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
    let distance = 0;
    let turning = 0;
    let repeated = 0;
    let unexplored = 0;

    for (let index = 1; index < path.points.length; index += 1) {
      const point = path.points[index];
      const previous = path.points[index - 1];
      distance += Math.hypot(point.x - previous.x, point.y - previous.y);

      const cell = cellForPoint(point);
      if (visitedCells.has(cell) || distanceToExistingTrace(point) < 38) repeated += 1;
      else unexplored += 1;

      if (index > 1) {
        const before = path.points[index - 2];
        const firstAngle = Math.atan2(previous.y - before.y, previous.x - before.x);
        const secondAngle = Math.atan2(point.y - previous.y, point.x - previous.x);
        turning += Math.abs(Math.atan2(Math.sin(secondAngle - firstAngle), Math.cos(secondAngle - firstAngle)));
      }
    }

    const duration = Math.max(1, path.finishedAt - path.startedAt);
    const speed = distance / duration;
    const repetition = repeated / Math.max(1, repeated + unexplored);
    const novelty = unexplored / Math.max(1, repeated + unexplored);
    const directionalChange = turning / Math.max(1, path.points.length - 2);

    const rawWeight = 0.18 + clamp(1 - speed / 1.1) * 0.52 + repetition * 0.56 + clamp(duration / 6500) * 0.2;
    const rawFriction = 0.12 + clamp(speed / 1.45) * 0.38 + clamp(directionalChange / 0.68) * 0.6;
    const rawPlay = 0.16 + novelty * 0.7 + clamp(1 - directionalChange / 1.1) * 0.16;
    const total = rawWeight + rawFriction + rawPlay;

    path.distance = distance;
    path.duration = duration;
    path.forces = {
      weight: rawWeight / total,
      friction: rawFriction / total,
      play: rawPlay / total,
    };
    path.novelty = novelty;
    path.repetition = repetition;
    if (commit) path.points.forEach((point) => visitedCells.add(cellForPoint(point)));
  };

  const mixedTone = (forces) => {
    const weightTone = [177, 174, 163];
    const frictionTone = [199, 205, 203];
    const playTone = [216, 217, 207];
    const red = Math.round(weightTone[0] * forces.weight + frictionTone[0] * forces.friction + playTone[0] * forces.play);
    const green = Math.round(weightTone[1] * forces.weight + frictionTone[1] * forces.friction + playTone[1] * forces.play);
    const blue = Math.round(weightTone[2] * forces.weight + frictionTone[2] * forces.friction + playTone[2] * forces.play);
    return `${red},${green},${blue}`;
  };

  const drawContinuousTrace = (path, time, alpha) => {
    const { weight, play } = path.forces;
    const tone = mixedTone(path.forces);
    const echoCount = Math.round(weight * 3);

    for (let echo = echoCount; echo >= 0; echo -= 1) {
      context.beginPath();
      path.points.forEach((point, index) => {
        const drift = reducedMotion ? 0 : Math.sin(time * 0.00028 + index * 0.19 + path.id) * echo * 1.2;
        const x = point.x + drift;
        const y = point.y + Math.cos(time * 0.00024 + index * 0.16 + path.id) * echo * 0.8;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.strokeStyle = `rgba(${tone},${echo === 0 ? alpha : alpha * 0.12})`;
      context.lineWidth = echo === 0 ? 0.65 + weight * 1.55 : 0.65;
      context.shadowColor = `rgba(${tone},${alpha * weight * 0.35})`;
      context.shadowBlur = weight * 9;
      context.stroke();
    }

    if (play > 0.28) {
      const interval = Math.max(12, Math.round(25 - play * 12));
      for (let index = interval; index < path.points.length; index += interval) {
        const point = path.points[index];
        const radius = 0.7 + play * 1.35;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${tone},${alpha * play * 0.62})`;
        context.shadowBlur = play * 6;
        context.fill();
      }
    }
  };

  const drawFriction = (path, time, alpha) => {
    const { friction } = path.forces;
    if (friction < 0.2) return;

    const tone = mixedTone(path.forces);
    context.shadowBlur = 0;
    context.lineWidth = 0.55 + friction * 0.75;
    context.strokeStyle = `rgba(${tone},${alpha * friction * 0.7})`;

    for (let index = 1; index < path.points.length; index += 1) {
      if ((index + path.id) % Math.max(3, Math.round(8 - friction * 5)) === 0) continue;
      const previous = path.points[index - 1];
      const point = path.points[index];
      const displacement = reducedMotion ? 0 : Math.sin(time * 0.0007 + index * 1.7) * friction * 4.5;
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
    }

    activePath = null;
  };

  field.addEventListener("pointerup", finishPath);
  field.addEventListener("pointercancel", finishPath);
  field.addEventListener("pointerleave", finishPath);
  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(render);
})();
