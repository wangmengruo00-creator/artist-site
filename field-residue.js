(() => {
  const field = document.querySelector("[data-residue-field]");
  const canvas = field?.querySelector(".residue-canvas");
  const exitLink = field?.querySelector("[data-field-exit]");
  const cameraToggle = field?.querySelector("[data-camera-toggle]");
  const globalField = field?.hasAttribute("data-tm-global-field") || false;

  if (!field || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const residues = [];
  const cameraDebug = document.createElement("span");
  const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "true";
  const textResidues = {
    weight: ["depth", "weight"],
    rupture: ["break", "refuse"],
    emergence: ["begin", "again"],
  };

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;
  let inside = false;
  let pointerDown = false;
  let lastPoint = null;
  let lastMoveAt = performance.now();
  let hideUiTimer = 0;
  let pagePhase = document.body?.dataset.tmPhase || "origin";

  const breath = {
    inhale: 0,
    hold: 0,
    exhale: 0.45,
    idle: 0.18,
    rhythm: 0,
  };

  const cameraPresence = {
    available: false,
    active: false,
    denied: false,
    motion: 0,
    brightness: 0,
    brightnessShift: 0,
    presence: 0,
    rupture: 0,
    shock: 0,
    lastBrightness: 0,
    previousFrame: null,
    video: null,
    canvas: null,
    context: null,
    lastSampleAt: 0,
  };

  cameraDebug.textContent = "camera: off";
  cameraDebug.setAttribute("aria-hidden", "true");
  cameraDebug.style.cssText = [
    "position:absolute",
    "right:18px",
    "bottom:16px",
    "z-index:3",
    "font:10px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace",
    "letter-spacing:0.02em",
    "color:rgba(220,218,208,0.34)",
    "pointer-events:none",
    "user-select:none",
    `display:${debugEnabled ? "block" : "none"}`,
  ].join(";");
  field.appendChild(cameraDebug);

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const random = (min, max) => min + Math.random() * (max - min);
  const ease = (current, target, amount) => current + (target - current) * amount;

  const resize = () => {
    const rect = field.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.fillStyle = "#22221f";
    ctx.fillRect(0, 0, width, height);
  };

  const pointFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      t: performance.now(),
    };
  };

  const showFieldExit = () => {
    window.clearTimeout(hideUiTimer);
    field.classList.add("is-ui-visible");
    hideUiTimer = window.setTimeout(() => {
      field.classList.remove("is-ui-visible");
    }, 3000);
  };

  const exitField = (event) => {
    if (event) event.preventDefault();

    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      const currentUrl = new URL(window.location.href);
      if (referrer && referrer.href !== currentUrl.href && referrer.origin === currentUrl.origin) {
        window.history.back();
        return;
      }
    } catch {
      // Fall through to the project index when referrer data is unavailable.
    }

    window.location.href = exitLink?.getAttribute("href") || "works.html";
  };

  const updateCameraToggle = (label, active = false, disabled = false) => {
    if (!cameraToggle) return;
    cameraToggle.textContent = label;
    cameraToggle.setAttribute("aria-pressed", String(active));
    cameraToggle.disabled = disabled;
  };

  const stopCameraPresence = () => {
    const stream = cameraPresence.video?.srcObject;
    if (stream?.getTracks) stream.getTracks().forEach((track) => track.stop());
    if (cameraPresence.video) cameraPresence.video.srcObject = null;
    cameraPresence.active = false;
    cameraPresence.motion = 0;
    cameraPresence.brightnessShift = 0;
    cameraPresence.presence = 0;
    cameraPresence.rupture = 0;
    cameraPresence.shock = 0;
    cameraPresence.previousFrame = null;
    cameraPresence.video = null;
    cameraPresence.canvas = null;
    cameraPresence.context = null;
    updateCameraToggle("Camera: off");
  };

  const initCameraPresence = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      updateCameraToggle("Camera: unavailable", false, true);
      return;
    }

    cameraPresence.available = true;
    cameraPresence.denied = false;
    updateCameraToggle("Camera: asking", false, true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: 160 },
          height: { ideal: 120 },
          frameRate: { ideal: 12, max: 15 },
        },
      });

      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await video.play();

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 48;
      sampleCanvas.height = 36;

      cameraPresence.active = true;
      cameraPresence.denied = false;
      cameraPresence.video = video;
      cameraPresence.canvas = sampleCanvas;
      cameraPresence.context = sampleCanvas.getContext("2d", { willReadFrequently: true });
      updateCameraToggle("Camera: on", true);
    } catch {
      cameraPresence.active = false;
      cameraPresence.denied = true;
      updateCameraToggle("Camera: blocked");
    }
  };

  const sampleCameraPresence = (now) => {
    if (!cameraPresence.active || !cameraPresence.video || !cameraPresence.context) {
      cameraPresence.motion = ease(cameraPresence.motion, 0, 0.04);
      cameraPresence.brightnessShift = ease(cameraPresence.brightnessShift, 0, 0.04);
      cameraPresence.presence = ease(cameraPresence.presence, 0, 0.035);
      cameraPresence.rupture = ease(cameraPresence.rupture, 0, 0.08);
      cameraPresence.shock *= 0.9;
      return;
    }

    if (now - cameraPresence.lastSampleAt < 140) return;
    cameraPresence.lastSampleAt = now;

    const sampleWidth = cameraPresence.canvas.width;
    const sampleHeight = cameraPresence.canvas.height;
    const sampleContext = cameraPresence.context;
    sampleContext.drawImage(cameraPresence.video, 0, 0, sampleWidth, sampleHeight);

    const pixels = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data;
    const currentFrame = new Uint8Array(sampleWidth * sampleHeight);

    let brightness = 0;
    let motion = 0;

    for (let i = 0, j = 0; i < pixels.length; i += 4, j += 1) {
      const luminance = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
      currentFrame[j] = luminance;
      brightness += luminance;

      if (cameraPresence.previousFrame) {
        motion += Math.abs(luminance - cameraPresence.previousFrame[j]);
      }
    }

    brightness /= currentFrame.length * 255;
    motion = cameraPresence.previousFrame ? motion / (currentFrame.length * 255) : 0;

    const brightnessShift = Math.abs(brightness - cameraPresence.lastBrightness);
    const motionSignal = clamp(motion * 9.2);
    const brightnessSignal = clamp(brightnessShift * 5.4);
    const presenceSignal = clamp(motionSignal * 0.8 + brightnessSignal * 0.2);
    const ruptureSignal = clamp(Math.max(0, motionSignal - 0.16) * 1.55 + brightnessSignal * 0.24);

    cameraPresence.motion = ease(cameraPresence.motion, motionSignal, 0.2);
    cameraPresence.brightness = ease(cameraPresence.brightness, brightness, 0.08);
    cameraPresence.brightnessShift = ease(cameraPresence.brightnessShift, brightnessSignal, 0.12);
    cameraPresence.presence = ease(cameraPresence.presence, presenceSignal, 0.14);
    cameraPresence.rupture = ease(cameraPresence.rupture, ruptureSignal, ruptureSignal > cameraPresence.rupture ? 0.32 : 0.08);
    if (ruptureSignal > 0.42) {
      cameraPresence.shock = Math.max(cameraPresence.shock, clamp((ruptureSignal - 0.35) * 0.9));
    }
    cameraPresence.shock *= 0.82;
    cameraPresence.lastBrightness = brightness;
    cameraPresence.previousFrame = currentFrame;
  };

  const addResidue = (residue) => {
    residues.push(residue);
    if (residues.length > 560) residues.splice(0, residues.length - 560);
  };

  const emitResidue = (point, previous) => {
    if (!previous) return;

    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.45) return;

    const speed = clamp(distance / 145);
    const angle = Math.atan2(dy, dx);
    const side = angle + Math.PI / 2;
    const count = Math.max(1, Math.min(4, Math.floor(distance / 34) + 1));
    const now = performance.now();

    breath.inhale = clamp(breath.inhale + speed * 0.2 + 0.045);
    breath.exhale = clamp(breath.exhale * 0.92);

    for (let i = 0; i < count; i += 1) {
      const t = clamp((i + random(0.28, 0.86)) / count);
      const off = random(-2.4, 2.4) + Math.sin(frame * 0.045 + i) * 0.55;
      const x = previous.x + dx * t + Math.cos(side) * off + random(-0.8, 0.8);
      const y = previous.y + dy * t + Math.sin(side) * off + random(-0.8, 0.8);
      const length = Math.max(6, Math.min(56, distance * random(0.18, 0.46)));
      const imperfectAngle = angle + random(-0.11, 0.11);

      addResidue({
        x,
        y,
        px: x - Math.cos(imperfectAngle) * length,
        py: y - Math.sin(imperfectAngle) * length,
        vx: dx * random(0.00008, 0.00028) + random(-0.0028, 0.0028),
        vy: dy * random(0.00008, 0.00028) + random(-0.0028, 0.0028),
        angle: imperfectAngle,
        opacity: clamp(0.026 + speed * 0.042 + (pointerDown ? 0.008 : 0), 0.018, 0.08),
        decay: random(0.000035, 0.00013),
        size: random(0.6, 1.55) + speed * 0.42,
        spread: random(1.0, 3.2),
        density: random(0.35, 0.95) + speed * 0.35,
        directionNoise: random(0.22, 0.72),
        weight: random(0.04, 0.12),
        rupture: 0,
        emergence: 0,
        pulse: random(0, Math.PI * 2),
        born: now,
      });
    }
  };

  const pointerTarget = globalField ? document.documentElement : field;

  pointerTarget.addEventListener("pointerenter", (event) => {
    inside = true;
    field.classList.add("is-active");
    showFieldExit();
    lastPoint = pointFromEvent(event);
    lastMoveAt = lastPoint.t;
  });

  pointerTarget.addEventListener("pointerleave", () => {
    inside = false;
    field.classList.remove("is-active");
    pointerDown = false;
    lastPoint = null;
  });

  pointerTarget.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    lastPoint = pointFromEvent(event);
    lastMoveAt = lastPoint.t;
    showFieldExit();
  });

  pointerTarget.addEventListener("pointerup", () => {
    pointerDown = false;
  });

  pointerTarget.addEventListener("pointermove", (event) => {
    if (globalField) {
      inside = true;
    }
    const point = pointFromEvent(event);
    if (
      point.x < 94 ||
      point.y < 94 ||
      point.x > width - 94 ||
      point.y > height - 94
    ) {
      showFieldExit();
    } else {
      window.clearTimeout(hideUiTimer);
      hideUiTimer = window.setTimeout(() => {
        field.classList.remove("is-ui-visible");
      }, 3000);
    }

    emitResidue(point, lastPoint);
    lastPoint = point;
    lastMoveAt = point.t;
  });

  if (exitLink) {
    exitLink.addEventListener("click", exitField);
    exitLink.addEventListener("pointerenter", showFieldExit);
    exitLink.addEventListener("focus", showFieldExit);
  }

  window.addEventListener("tm:phase", (event) => {
    pagePhase = event.detail?.phase || "origin";
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") exitField(event);
  });

  const updateBreath = (idleFor) => {
    const moving = clamp(breath.inhale);
    const cameraSignal = cameraPresence.presence;
    const rupture = cameraPresence.rupture;
    const holdTarget = inside && idleFor > 280 && idleFor < 1700 ? clamp(1 - Math.abs(idleFor - 900) / 900) : 0;
    const exhaleTarget = idleFor > 900 ? clamp((idleFor - 900) / 2800) : 0;
    const idleTarget = idleFor > 520 ? clamp((idleFor - 520) / 2600 + cameraSignal * 0.24 + rupture * 0.28, 0.16, 0.9) : 0.12 + cameraSignal * 0.12 + rupture * 0.16;

    breath.inhale = ease(breath.inhale, cameraSignal * 0.055 + rupture * 0.18, 0.035);
    breath.hold = ease(breath.hold, holdTarget * (1 - moving * 0.55), 0.035);
    breath.exhale = ease(breath.exhale, Math.max(exhaleTarget, 0.12 - cameraSignal * 0.042), 0.025);
    breath.idle = ease(breath.idle, idleTarget, 0.018);
    breath.rhythm += 0.012 + breath.inhale * 0.006 + breath.idle * 0.003 + cameraSignal * 0.0018 + rupture * 0.005 - breath.exhale * 0.002;
  };

  const drawResidue = (residue, now) => {
    const age = now - residue.born;
    const life = clamp(age / 14500);
    const inhale = breath.inhale;
    const hold = breath.hold;
    const exhale = breath.exhale;
    const idle = breath.idle;
    const cameraSignal = cameraPresence.presence;
    const rupture = cameraPresence.rupture;
    const shock = cameraPresence.shock;
    const phaseWeight = pagePhase === "carry" || pagePhase === "accumulate" ? 0.5 : 0;
    const phaseRupture = pagePhase === "interrupt" ? 0.38 : 0;
    const phaseEmergence = pagePhase === "emerge" || pagePhase === "open" ? 0.34 : 0;
    const pulse = Math.sin(breath.rhythm + residue.pulse) * 0.5 + 0.5;
    const slowPulse = Math.sin(breath.rhythm * 0.37 + residue.pulse * 1.7) * 0.5 + 0.5;
    const softPulse = 0.64 + pulse * 0.2 + slowPulse * idle * 0.1;
    const oldMemory = life > 0.18 ? life : 0;
    const cameraAwakening = cameraSignal * oldMemory;
    const lionForce = clamp(rupture * oldMemory + phaseRupture * oldMemory);
    const distanceFromPointer = lastPoint ? Math.hypot(residue.x - lastPoint.x, residue.y - lastPoint.y) : Infinity;
    const localPresence = Number.isFinite(distanceFromPointer) ? clamp(1 - distanceFromPointer / 170) : 0;
    const localStillness = inside ? localPresence * (hold * 0.65 + idle * 0.25) : 0;
    residue.weight = clamp((residue.weight || 0) + localStillness * 0.0022 + oldMemory * (0.00012 + phaseWeight * 0.0007) - exhale * 0.00035);
    residue.rupture = clamp((residue.rupture || 0) * 0.965 + lionForce * 0.032 + shock * lionForce * 0.018);
    residue.emergence = clamp((residue.emergence || 0) * 0.985 + (idle > 0.45 && oldMemory > 0.38 ? idle * oldMemory * (1 - residue.weight) * 0.0018 : 0) + phaseEmergence * oldMemory * 0.0009 - residue.rupture * 0.0015);
    const materialAge = clamp(life + residue.weight * 0.18 + residue.rupture * 0.08 + residue.emergence * 0.04);
    const residueTone = Math.round(218 - materialAge * 34);
    const visibilityBoost = globalField ? 2.35 : 1;
    const alpha = clamp(
      residue.opacity *
        (1 - life * 0.72) *
        (0.48 + inhale * 0.34 + hold * 0.2 + idle * 0.08 + residue.weight * 0.12 + residue.emergence * 0.05 + softPulse * 0.12) *
        visibilityBoost,
      0,
      globalField ? 0.12 : 0.052,
    );

    const diffusion = residue.spread * (1 + materialAge * 8.5 + exhale * 3.2 + hold * 1.2 + idle * 0.8 + residue.rupture * 0.8 + residue.emergence * 0.55 + cameraAwakening * 0.34 + lionForce * 1.1);
    const ruptureOffset = (lionForce + residue.rupture * 0.65) * (2 + shock * 5);
    const drift =
      Math.sin(breath.rhythm * 0.72 + residue.angle) * diffusion * (0.18 + idle * 0.1) +
      Math.sin(breath.rhythm * 0.31 + residue.pulse) * idle * 0.9 +
      Math.sin(frame * 0.41 + residue.pulse) * ruptureOffset;
    const x = residue.x + Math.cos(residue.angle + frame * 0.0009) * drift + random(-ruptureOffset, ruptureOffset);
    const y = residue.y + Math.sin(residue.angle - frame * 0.0009) * drift + random(-ruptureOffset, ruptureOffset);
    const sx = residue.px * 0.7 + x * 0.3;
    const sy = residue.py * 0.7 + y * 0.3;
    const microCount = Math.max(2, Math.floor(3 + residue.density * 2 + inhale * 2 + idle * 1.5 + residue.weight * 1.2 + residue.emergence));

    for (let i = 0; i < microCount; i += 1) {
      const t = random(0.08, 1);
      const side = residue.angle + Math.PI / 2;
      const idleTremor = idle * (slowPulse - 0.5) * 1.6 + cameraAwakening * (pulse - 0.5) * 1.2;
      const ruptureBreak = Math.random() < (lionForce + residue.rupture * 0.55) * 0.45 ? random(-diffusion * 1.8, diffusion * 1.8) : 0;
      const sideOffset = random(-diffusion, diffusion) * residue.directionNoise + idleTremor + ruptureBreak;
      const forwardOffset = random(-diffusion * 0.28, diffusion * 0.28) + idle * random(-0.5, 0.5) + lionForce * random(-2.5, 2.5);
      const mx =
        sx +
        (x - sx) * t +
        Math.cos(side) * sideOffset +
        Math.cos(residue.angle) * forwardOffset;
      const my =
        sy +
        (y - sy) * t +
        Math.sin(side) * sideOffset +
        Math.sin(residue.angle) * forwardOffset;
      const size = Math.max(0.55, residue.size * random(0.55, 1.55) + diffusion * 0.035);

      ctx.fillStyle = `rgba(${residueTone}, ${residueTone}, ${Math.max(176, residueTone - 8)}, ${alpha * random(0.32, 0.78)})`;
      ctx.fillRect(mx, my, size, size);
    }

    const fogAlpha = alpha * (0.052 + hold * 0.032 + exhale * 0.07 + idle * 0.04);
    if (fogAlpha > 0.001) {
      const fogCount = 2 + Math.floor(exhale * 2);
      ctx.fillStyle = `rgba(${Math.max(174, residueTone - 10)}, ${Math.max(174, residueTone - 10)}, ${Math.max(166, residueTone - 18)}, ${fogAlpha})`;
      for (let i = 0; i < fogCount; i += 1) {
        const radius = residue.size * random(3.2, 9.5) + diffusion * random(0.1, 0.34);
        ctx.beginPath();
        ctx.arc(
          x + random(-diffusion * 1.6, diffusion * 1.6),
          y + random(-diffusion * 1.6, diffusion * 1.6),
          radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }

    if (life > 0.42 && (hold > 0.35 || exhale > 0.42 || idle > 0.5 || materialAge > 0.62) && Math.random() < 0.003 + idle * 0.0025 + materialAge * 0.002) {
      const amberAlpha = alpha * random(0.028, 0.09);
      ctx.fillStyle = `rgba(224, 190, 118, ${amberAlpha})`;
      ctx.fillRect(x + random(-diffusion, diffusion), y + random(-diffusion, diffusion), random(0.7, 1.4), random(0.7, 1.4));
    }

    if (residue.emergence > 0.12 && Math.random() < residue.emergence * 0.018) {
      const edgeDistance = diffusion * random(0.7, 1.4);
      const edgeAngle = residue.angle + random(-1.8, 1.8);
      const edgeAlpha = alpha * random(0.04, 0.12);
      ctx.fillStyle = `rgba(218, 216, 202, ${edgeAlpha})`;
      ctx.fillRect(
        x + Math.cos(edgeAngle) * edgeDistance,
        y + Math.sin(edgeAngle) * edgeDistance,
        random(0.55, 1.05),
        random(0.55, 1.05),
      );
    }

    const textForce = Math.max(residue.weight, residue.rupture, residue.emergence);
    const textCanLeak = oldMemory > 0.46 && textForce > 0.16 && Math.random() < textForce * 0.0028;
    if (textCanLeak) {
      const textKind =
        residue.rupture > residue.weight && residue.rupture > residue.emergence
          ? "rupture"
          : residue.emergence > residue.weight
            ? "emergence"
            : "weight";
      const words = textResidues[textKind];
      const word = words[Math.floor(Math.random() * words.length)];
      const textAlpha = alpha * random(0.18, 0.34);
      const textDistance = diffusion * random(0.35, 1.1);
      const textAngle = residue.angle + random(-1.4, 1.4);
      ctx.save();
      ctx.translate(
        x + Math.cos(textAngle) * textDistance,
        y + Math.sin(textAngle) * textDistance,
      );
      ctx.rotate(residue.angle + random(-0.18, 0.18));
      ctx.font = `${random(9, 13)}px Georgia, 'Times New Roman', serif`;
      ctx.fillStyle = `rgba(214, 211, 196, ${textAlpha})`;
      ctx.fillText(word, 0, 0);
      ctx.restore();
    }

    residue.x += residue.vx + random(-0.0015, 0.0015) + Math.cos(residue.pulse + breath.rhythm * 0.24) * (idle * 0.006 + cameraAwakening * 0.006 + lionForce * 0.018);
    residue.y += residue.vy + random(-0.0015, 0.0015) + Math.sin(residue.pulse - breath.rhythm * 0.21) * (idle * 0.006 + cameraAwakening * 0.006 + lionForce * 0.018);
    residue.px += residue.vx * 0.42;
    residue.py += residue.vy * 0.42;
    residue.vx *= 0.988 - residue.weight * 0.004;
    residue.vy *= 0.988 - residue.weight * 0.004;
    residue.spread += 0.002 + exhale * 0.006 + hold * 0.002 + idle * 0.0015 + residue.emergence * 0.002 + lionForce * 0.003;
    residue.opacity -= residue.decay * (0.68 + exhale * 0.42 + lionForce * 0.08 - hold * 0.18 - idle * 0.12);
  };

  const updateCameraDebug = () => {
    let level = "off";
    if (cameraPresence.denied) {
      level = "off";
    } else if (cameraPresence.active) {
      if (cameraPresence.rupture > 0.48) level = "rupture";
      else if (cameraPresence.presence > 0.48) level = "high";
      else if (cameraPresence.presence > 0.2) level = "medium";
      else if (cameraPresence.presence > 0.045 || cameraPresence.rupture > 0.06) level = "low";
      else level = "low";
    }

    cameraDebug.textContent = `camera: ${level}`;
  };

  const draw = () => {
    frame += 1;
    const now = performance.now();
    const idleFor = now - lastMoveAt;
    sampleCameraPresence(now);
    updateCameraDebug();
    updateBreath(idleFor);

    const backgroundPulse = Math.sin(breath.rhythm * 0.42) * 0.5 + 0.5;
    const lionPulse = cameraPresence.rupture * (0.6 + cameraPresence.shock * 0.8);
    const phaseFade = pagePhase === "accumulate" || pagePhase === "carry" ? -0.0012 : pagePhase === "interrupt" ? 0.0014 : 0;
    const fade = clamp(
      0.008 +
        breath.exhale * 0.0032 -
        breath.hold * 0.0015 -
        breath.idle * 0.001 -
        cameraPresence.presence * (0.00055 + backgroundPulse * 0.00045) -
        lionPulse * 0.0012 +
        phaseFade,
      0.0064,
      0.013,
    );
    ctx.fillStyle = `rgba(34, 34, 31, ${fade})`;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const fieldShake = cameraPresence.shock * cameraPresence.rupture * 4.5;
    if (fieldShake > 0.04) {
      ctx.translate(random(-fieldShake, fieldShake), random(-fieldShake, fieldShake));
    }

    for (let i = residues.length - 1; i >= 0; i -= 1) {
      const residue = residues[i];
      if (residue.opacity <= 0.001 && residues.length > 120 && Math.random() < 0.006) {
        residues.splice(i, 1);
        continue;
      }
      drawResidue(residue, now);
    }

    ctx.restore();
    requestAnimationFrame(draw);
  };

  try {
    window.localStorage.removeItem("three-metamorphoses-v3-reclaim");
    window.localStorage.removeItem("three-metamorphoses-v31-antiform");
  } catch {
    // Local storage is optional; the field still works without it.
  }

  resize();
  if (globalField) {
    const seededAt = performance.now();
    for (let i = 0; i < 86; i += 1) {
      const angle = random(-Math.PI, Math.PI);
      const length = random(7, 34);
      const x = random(width * 0.1, width * 0.9);
      const y = random(height * 0.18, height * 0.82);
      addResidue({
        x,
        y,
        px: x - Math.cos(angle) * length,
        py: y - Math.sin(angle) * length,
        vx: random(-0.003, 0.003),
        vy: random(-0.003, 0.003),
        angle,
        opacity: random(0.018, 0.045),
        decay: random(0.000035, 0.0001),
        size: random(0.55, 1.35),
        spread: random(1.2, 4.8),
        density: random(0.32, 0.88),
        directionNoise: random(0.28, 0.8),
        weight: random(0.04, 0.18),
        rupture: 0,
        emergence: 0,
        pulse: random(0, Math.PI * 2),
        born: seededAt - random(0, 6200),
      });
    }
  }
  showFieldExit();
  if (cameraToggle) {
    updateCameraToggle("Camera: off");
    cameraToggle.addEventListener("click", () => {
      if (cameraPresence.active) stopCameraPresence();
      else initCameraPresence();
    });
  } else {
    // Preserve existing embedded-field behaviour on pages without the opt-in control.
    initCameraPresence();
  }
  window.addEventListener("pagehide", stopCameraPresence);
  window.addEventListener("resize", resize);
  requestAnimationFrame(draw);
})();
