(() => {
  const field = document.querySelector("[data-field-world]");
  const canvas = field?.querySelector(".trace-canvas");

  if (!field || !canvas) return;

  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paths = [];
  const visitedCells = new Set();
  let activePath = null;
  let drawing = false;
  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let pathId = 0;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  const resamplePath = (points, spacing = 8) => {
    if (points.length < 2) return points.slice();

    const sampled = [{ ...points[0] }];
    let previous = { ...points[0] };
    let distanceSinceSample = 0;

    for (let index = 1; index < points.length; index += 1) {
      const target = points[index];
      let segmentLength = Math.hypot(target.x - previous.x, target.y - previous.y);

      while (segmentLength > 0 && distanceSinceSample + segmentLength >= spacing) {
        const ratio = (spacing - distanceSinceSample) / segmentLength;
        const sample = {
          x: previous.x + (target.x - previous.x) * ratio,
          y: previous.y + (target.y - previous.y) * ratio,
          time: previous.time + (target.time - previous.time) * ratio,
        };
        sampled.push(sample);
        previous = sample;
        segmentLength = Math.hypot(target.x - previous.x, target.y - previous.y);
        distanceSinceSample = 0;
      }

      distanceSinceSample += segmentLength;
      previous = { ...target };
    }

    const last = points[points.length - 1];
    const sampledLast = sampled[sampled.length - 1];
    if (Math.hypot(last.x - sampledLast.x, last.y - sampledLast.y) > spacing * 0.35) {
      sampled.push({ ...last });
    }
    return sampled;
  };

  const segmentsIntersect = (a, b, c, d) => {
    const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    const abC = cross(a, b, c);
    const abD = cross(a, b, d);
    const cdA = cross(c, d, a);
    const cdB = cross(c, d, b);
    return abC * abD < 0 && cdA * cdB < 0;
  };

  const reportForces = (path, resolved = false) => {
    if (!path?.forces) return;
    window.dispatchEvent(new CustomEvent("tm:trace-forces", {
      detail: {
        traceId: path.id,
        resolved,
        forces: { ...path.forces },
        duration: path.duration || 0,
        repetition: path.repetition || 0,
        novelty: path.novelty || 0,
        features: { ...(path.features || {}) },
      },
    }));
  };

  const resize = () => {
    const rect = field.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const pointFromEvent = (event) => ({
    x: event.clientX,
    y: event.clientY,
    time: performance.now(),
  });

  const cellForPoint = (point) => `${Math.floor(point.x / 64)}:${Math.floor(point.y / 64)}`;

  const distanceToExistingTrace = (point) => {
    let nearest = Infinity;
    for (const path of paths.slice(-10)) {
      for (let index = 0; index < path.points.length; index += 7) {
        const candidate = path.points[index];
        nearest = Math.min(nearest, Math.hypot(point.x - candidate.x, point.y - candidate.y));
      }
    }
    return nearest;
  };

  const analysePath = (path, commit = true) => {
    const sourcePoints = resamplePath(path.points);
    let distance = 0;
    let turning = 0;
    let peakTurn = 0;
    let repeated = 0;
    let unexplored = 0;
    let intersections = 0;

    for (let index = 1; index < sourcePoints.length; index += 1) {
      const point = sourcePoints[index];
      const previous = sourcePoints[index - 1];
      distance += Math.hypot(point.x - previous.x, point.y - previous.y);

      const cell = cellForPoint(point);
      if (visitedCells.has(cell) || distanceToExistingTrace(point) < 38) repeated += 1;
      else unexplored += 1;

      if (index > 1) {
        const before = sourcePoints[index - 2];
        const firstAngle = Math.atan2(previous.y - before.y, previous.x - before.x);
        const secondAngle = Math.atan2(point.y - previous.y, point.x - previous.x);
        const localTurn = Math.abs(Math.atan2(Math.sin(secondAngle - firstAngle), Math.cos(secondAngle - firstAngle)));
        turning += localTurn;
        peakTurn = Math.max(peakTurn, localTurn);
      }

      for (let earlier = 1; earlier < index - 2; earlier += 1) {
        if (segmentsIntersect(sourcePoints[earlier - 1], sourcePoints[earlier], previous, point)) {
          intersections += 1;
        }
      }
    }

    const duration = Math.max(1, path.finishedAt - path.startedAt);
    const speed = distance / duration;
    const repetition = repeated / Math.max(1, repeated + unexplored);
    const novelty = unexplored / Math.max(1, repeated + unexplored);
    const curvature = turning / Math.max(1, sourcePoints.length - 2);
    const intersectionSignal = clamp(intersections / Math.max(1, sourcePoints.length * 0.08));
    const slowMovement = clamp(1 - speed / 1.1);
    const fastMovement = clamp(speed / 1.45);
    const longDuration = clamp(duration / 6500);
    const directionalContinuity = clamp(1 - curvature / 0.9);

    // The three relations remain independent: one does not need to diminish for
    // another to become present. They describe the path-field relation, not a person.
    const weight = clamp(0.08 + slowMovement * 0.44 + repetition * 0.5 + longDuration * 0.22);
    const friction = clamp(0.05 + fastMovement * 0.2 + clamp(curvature / 0.72) * 0.5 + clamp(peakTurn / 2.3) * 0.24 + intersectionSignal * 0.22);
    const play = clamp(0.08 + novelty * 0.7 + directionalContinuity * 0.16 + clamp(distance / Math.max(width, height)) * 0.12);

    path.distance = distance;
    path.duration = duration;
    path.forces = {
      weight,
      friction,
      play,
    };
    path.features = {
      speed,
      curvature,
      peakTurn,
      intersections,
      sampleCount: sourcePoints.length,
    };
    path.novelty = novelty;
    path.repetition = repetition;
    if (commit) sourcePoints.forEach((point) => visitedCells.add(cellForPoint(point)));
  };

  const mixedTone = (forces) => {
    const weightTone = [177, 174, 163];
    const frictionTone = [199, 205, 203];
    const playTone = [216, 217, 207];
    const visualTotal = Math.max(0.001, forces.weight + forces.friction + forces.play);
    const red = Math.round((weightTone[0] * forces.weight + frictionTone[0] * forces.friction + playTone[0] * forces.play) / visualTotal);
    const green = Math.round((weightTone[1] * forces.weight + frictionTone[1] * forces.friction + playTone[1] * forces.play) / visualTotal);
    const blue = Math.round((weightTone[2] * forces.weight + frictionTone[2] * forces.friction + playTone[2] * forces.play) / visualTotal);
    return `${red},${green},${blue}`;
  };

  const drawContinuousTrace = (path, time, alpha) => {
    const { weight, play } = path.forces;
    const tone = mixedTone(path.forces);
    const echoCount = Math.round(weight * 4);

    for (let echo = echoCount; echo >= 0; echo -= 1) {
      context.beginPath();
      path.points.forEach((point, index) => {
        const drift = reducedMotion ? 0 : Math.sin(time * 0.00028 + index * 0.19 + path.id) * echo * 1.45;
        const x = point.x + drift;
        const y = point.y + Math.cos(time * 0.00024 + index * 0.16 + path.id) * echo * 0.8;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.strokeStyle = `rgba(${tone},${echo === 0 ? alpha : alpha * (0.1 + weight * 0.06)})`;
      context.lineWidth = echo === 0 ? 0.72 + weight * 1.85 : 0.62 + weight * 0.18;
      context.shadowColor = `rgba(${tone},${alpha * weight * 0.42})`;
      context.shadowBlur = weight * 11;
      context.stroke();
    }

    if (play > 0.28) {
      const interval = Math.max(12, Math.round(25 - play * 12));
      for (let index = interval; index < path.points.length; index += interval) {
        const point = path.points[index];
        const radius = 0.72 + play * 1.55;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${tone},${alpha * play * 0.72})`;
        context.shadowBlur = play * 7;
        context.fill();
      }
    }
  };

  const drawFriction = (path, time, alpha) => {
    const { friction } = path.forces;
    if (friction < 0.2) return;

    const tone = mixedTone(path.forces);
    context.shadowBlur = 0;
    context.lineWidth = 0.58 + friction * 0.9;
    context.strokeStyle = `rgba(${tone},${alpha * friction * 0.82})`;

    for (let index = 1; index < path.points.length; index += 1) {
      if ((index + path.id) % Math.max(3, Math.round(8 - friction * 5)) === 0) continue;
      const previous = path.points[index - 1];
      const point = path.points[index];
      const displacement = reducedMotion ? 0 : Math.sin(time * 0.0007 + index * 1.7) * friction * 6.2;
      context.beginPath();
      context.moveTo(previous.x + displacement, previous.y - displacement * 0.45);
      context.lineTo(point.x + displacement, point.y - displacement * 0.45);
      context.stroke();
    }
  };

  const drawPath = (path, time, live = false) => {
    if (path.points.length < 2) return;
    const age = live ? 0 : time - path.finishedAt;
    const alpha = live ? 0.64 : clamp(0.76 - age / 155000, 0.08, 0.76);
    drawContinuousTrace(path, time, alpha);
    drawFriction(path, time, alpha);
    context.shadowBlur = 0;
  };

  const render = (time) => {
    context.clearRect(0, 0, width, height);
    paths.forEach((path) => drawPath(path, time));
    if (activePath) drawPath(activePath, time, true);
    window.requestAnimationFrame(render);
  };

  field.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (field.classList.contains("is-console-open")) return;
    if (event.target instanceof Element && event.target.closest("button, a, .field-title, .field-index, .research-console")) return;

    const point = pointFromEvent(event);
    drawing = true;
    activePath = {
      id: pathId += 1,
      points: [point],
      startedAt: point.time,
      finishedAt: point.time,
      forces: { weight: 0.34, friction: 0.22, play: 0.44 },
    };

    try {
      field.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is optional for synthetic previews.
    }
  });

  field.addEventListener("pointermove", (event) => {
    if (!drawing || !activePath) return;
    const point = pointFromEvent(event);
    const previous = activePath.points[activePath.points.length - 1];
    if (Math.hypot(point.x - previous.x, point.y - previous.y) < 6) return;
    activePath.points.push(point);
    activePath.finishedAt = point.time;

    if (activePath.points.length > 3) {
      const liveSample = {
        ...activePath,
        points: activePath.points.slice(-90),
      };
      analysePath(liveSample, false);
      activePath.forces = liveSample.forces;
      reportForces(liveSample);
    }
  });

  const finishPath = () => {
    if (!drawing || !activePath) return;
    drawing = false;
    activePath.finishedAt = performance.now();

    if (activePath.points.length > 4) {
      analysePath(activePath);
      paths.push(activePath);
      if (paths.length > 18) paths.shift();
      reportForces(activePath, true);
    }

    activePath = null;
  };

  field.addEventListener("pointerup", finishPath);
  field.addEventListener("pointercancel", finishPath);
  field.addEventListener("pointerleave", finishPath);
  window.addEventListener("tm:study-reset", () => {
    paths.length = 0;
    visitedCells.clear();
    activePath = null;
    drawing = false;
    pathId = 0;
    context.clearRect(0, 0, width, height);
    window.dispatchEvent(new CustomEvent("tm:trace-reset"));
  });
  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(render);
})();
