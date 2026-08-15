(() => {
  const panel = document.querySelector("[data-study-panel]");
  const params = new URLSearchParams(window.location.search);
  if (!panel || params.get("study") !== "true") return;

  const conditionButtons = [...panel.querySelectorAll("[data-study-condition]")];
  const resetButton = panel.querySelector("[data-study-reset]");
  const startButton = panel.querySelector("[data-study-start]");
  const markButton = panel.querySelector("[data-study-mark]");
  const replayButton = panel.querySelector("[data-study-replay]");
  const exportButton = panel.querySelector("[data-study-export]");
  const participantInput = panel.querySelector("[data-study-participant]");
  const participantLabel = panel.querySelector("[data-study-participant-label]");
  const protocolOutput = panel.querySelector("[data-study-protocol]");
  const phaseOutput = panel.querySelector("[data-study-phase]");
  const timeOutput = panel.querySelector("[data-study-time]");
  const statusOutput = panel.querySelector("[data-study-status]");
  const metricOutputs = new Map(
    [...panel.querySelectorAll("[data-study-metric]")].map((element) => [element.dataset.studyMetric, element]),
  );
  const cue = document.createElement("div");
  cue.className = "study-cue";
  cue.hidden = true;
  cue.setAttribute("aria-live", "polite");
  document.body.appendChild(cue);

  const requestedDuration = Number(params.get("studySeconds"));
  const runDuration = Number.isFinite(requestedDuration) && requestedDuration >= 2
    ? Math.min(30, requestedDuration)
    : 30;

  const protocols = {
    free: {
      en: `Explore the field freely for ${runDuration} seconds. There is no correct movement and no need to produce a particular image.`,
      zh: `自由探索场域 ${runDuration} 秒。没有正确动作，也不需要生成某种特定图像。`,
    },
    fast: {
      en: "Make one straight pass across the field in approximately one second. The system will then switch to observation.",
      zh: "用约一秒完成一次穿过场域的直线移动；动作完成后，系统会自动进入观察阶段。",
    },
    slow: {
      en: "Follow one continuous path for approximately five seconds, keeping the direction as stable as possible.",
      zh: "用约五秒完成一条连续路径，并尽量保持方向稳定；完成后系统会自动进入观察阶段。",
    },
    still: {
      en: "Move once to establish a position, then keep the pointer still. After three seconds the system will switch to observation.",
      zh: "先移动一次以建立位置，随后保持指针静止；三秒后系统会自动进入观察阶段。",
    },
    repeat: {
      en: "Traverse the same path exactly three times. Release after the third path; when the message changes, stop moving and observe.",
      zh: "沿同一路径恰好移动三次。第三条路径完成后松开；提示变化时停止移动，只进行观察。",
    },
  };

  const words = {
    en: {
      choose: "Select one condition. The field will reset before the timed run.",
      ready: "Ready",
      running: "Recording",
      complete: "Complete",
      stopped: "Stopped",
      reset: "Field reset",
      notStarted: "Not started",
      start: `Start ${runDuration}-second run`,
      stop: "Stop run",
      replay: "Replay recorded paths",
      replaying: "Replaying",
      replayComplete: "Replay complete",
      participantLabel: "Participant code / no names",
      freeCondition: "Free encounter",
      waitingPhase: "Waiting for a condition",
      readyPhase: "Ready to begin",
      inputPhase: "Input phase — perform the selected action",
      observationPhase: "Observation phase — do not add movement",
      inputCue: "Input phase — follow the selected action now",
      observationCue: "Action complete — observe only; please do not move the pointer",
      repeatObservationCue: "Three paths recorded — stop moving now and observe the field",
      compliant: "Followed",
      deviated: "Movement after input",
      incomplete: "Input incomplete",
      pending: "Pending",
    },
    zh: {
      choose: "选择一个条件；计时开始前，场域将被重置。",
      ready: "准备就绪",
      running: "正在记录",
      complete: "已完成",
      stopped: "已停止",
      reset: "场域已重置",
      notStarted: "尚未开始",
      start: `开始 ${runDuration} 秒测试`,
      stop: "停止测试",
      replay: "重放已记录路径",
      replaying: "正在重放",
      replayComplete: "重放完成",
      participantLabel: "参与者编号 / 不记录姓名",
      freeCondition: "自由体验",
      waitingPhase: "等待选择测试条件",
      readyPhase: "已准备，可以开始",
      inputPhase: "操作阶段——完成所选动作",
      observationPhase: "观察阶段——请不要继续移动",
      inputCue: "操作阶段——现在完成所选动作",
      observationCue: "动作完成——只需观察，请不要再移动指针",
      repeatObservationCue: "已记录三条路径——现在停止移动，只观察场域",
      compliant: "已按流程完成",
      deviated: "操作后仍有移动",
      incomplete: "操作未完成",
      pending: "等待判断",
    },
  };

  const state = {
    condition: null,
    active: false,
    completed: false,
    startedAt: 0,
    stoppedAt: 0,
    frame: 0,
    phase: "waiting",
    phaseTransitions: [],
    traceSamples: [],
    fieldSamples: [],
    observations: [],
    recordedPaths: [],
    automaticMarks: new Set(),
    latestTrace: null,
    latestField: null,
    observationBaseline: null,
    observationGraceUntil: 0,
    inputCompletionTrace: null,
    protocolDeviation: false,
    protocolCompliance: null,
    replaying: false,
    statusKey: "notStarted",
  };

  const language = () => document.documentElement.lang === "zh-CN" ? "zh" : "en";
  const copy = () => words[language()];
  const participantCode = () => {
    const cleaned = String(participantInput?.value || "P00")
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 12);
    return cleaned || "P00";
  };
  const elapsedSeconds = () => state.active
    ? Math.min(runDuration, (performance.now() - state.startedAt) / 1000)
    : Math.max(0, (state.stoppedAt - state.startedAt) / 1000 || 0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds - minutes * 60;
    return `${String(minutes).padStart(2, "0")}:${remainder.toFixed(1).padStart(4, "0")}`;
  };
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  const setMetric = (name, value) => {
    const output = metricOutputs.get(name);
    if (output) output.textContent = value;
  };

  const phaseLabel = () => {
    const current = copy();
    if (state.phase === "input") return current.inputPhase;
    if (state.phase === "observation") return current.observationPhase;
    if (state.condition) return current.readyPhase;
    return current.waitingPhase;
  };

  const cueLabel = () => {
    const current = copy();
    if (state.phase !== "observation") return current.inputCue;
    return state.condition === "repeat" ? current.repeatObservationCue : current.observationCue;
  };

  const updateComplianceMetric = () => {
    if (state.protocolDeviation) setMetric("compliance", copy().deviated);
    else if (state.protocolCompliance === true) setMetric("compliance", copy().compliant);
    else if (state.protocolCompliance === false) setMetric("compliance", copy().incomplete);
    else setMetric("compliance", copy().pending);
  };

  const clearMetrics = () => {
    ["speed", "curvature", "repetition", "duration", "intersections", "density", "directionStrength"].forEach((name) => setMetric(name, "—"));
    setMetric("residueCount", "0");
    setMetric("observations", String(state.observations.length));
    setMetric("pointerDistance", "0 px");
    setMetric("longestStillness", "0.0 s");
    updateComplianceMetric();
  };

  const updateLanguage = () => {
    const current = copy();
    protocolOutput.textContent = state.condition ? protocols[state.condition][language()] : current.choose;
    phaseOutput.textContent = phaseLabel();
    startButton.textContent = state.active ? current.stop : current.start;
    if (replayButton) replayButton.textContent = current.replay;
    if (participantLabel) participantLabel.textContent = current.participantLabel;
    const freeButton = panel.querySelector('[data-study-condition="free"]');
    if (freeButton) freeButton.textContent = current.freeCondition;
    statusOutput.textContent = current[state.statusKey] || current.notStarted;
    if (state.active) cue.textContent = cueLabel();
    updateComplianceMetric();
  };

  const snapshot = (label, seconds = elapsedSeconds()) => ({
    label,
    atSeconds: Number(seconds.toFixed(3)),
    phase: state.phase,
    trace: state.latestTrace ? { ...state.latestTrace } : null,
    field: state.latestField ? { ...state.latestField } : null,
  });

  const markObservation = (label = "manual") => {
    state.observations.push(snapshot(label));
    setMetric("observations", String(state.observations.length));
    exportButton.disabled = false;
  };

  const setPhase = (phase, reason) => {
    if (state.phase === phase) return;
    state.phase = phase;
    if (state.active) {
      state.phaseTransitions.push({
        phase,
        reason,
        atSeconds: Number(elapsedSeconds().toFixed(3)),
      });
    }
    if (phase === "observation") {
      const graceSeconds = state.condition === "fast" ? 0.9 : state.condition === "repeat" ? 0.65 : 0.5;
      state.observationBaseline = {
        pointerMoveCount: Number(state.latestField?.pointerMoveCount || 0),
        pointerDistance: Number(state.latestField?.pointerDistance || 0),
      };
      state.observationGraceUntil = elapsedSeconds() + graceSeconds;
      state.inputCompletionTrace = state.latestTrace ? { ...state.latestTrace } : null;
      markObservation("input-complete");
    }
    phaseOutput.textContent = phaseLabel();
    cue.textContent = cueLabel();
    cue.dataset.phase = phase;
  };

  const resetRun = (statusKey = "reset") => {
    if (state.frame) cancelAnimationFrame(state.frame);
    state.active = false;
    state.completed = false;
    state.startedAt = 0;
    state.stoppedAt = 0;
    state.frame = 0;
    state.phase = state.condition ? "ready" : "waiting";
    state.phaseTransitions = [];
    state.traceSamples = [];
    state.fieldSamples = [];
    state.observations = [];
    state.recordedPaths = [];
    state.automaticMarks.clear();
    state.latestTrace = null;
    state.latestField = null;
    state.observationBaseline = null;
    state.observationGraceUntil = 0;
    state.inputCompletionTrace = null;
    state.protocolDeviation = false;
    state.protocolCompliance = null;
    state.replaying = false;
    state.statusKey = statusKey;
    timeOutput.textContent = "00:00.0";
    startButton.disabled = !state.condition;
    markButton.disabled = true;
    if (replayButton) replayButton.disabled = true;
    exportButton.disabled = true;
    cue.hidden = true;
    cue.dataset.phase = state.phase;
    clearMetrics();
    updateLanguage();
    window.dispatchEvent(new CustomEvent("tm:study-reset"));
  };

  const evaluateCompliance = () => {
    if (state.condition === "free") return true;
    if (state.protocolDeviation || state.phase !== "observation") return false;
    const trace = state.inputCompletionTrace || state.traceSamples.at(-1);
    if (state.condition === "fast") return Boolean(trace && trace.durationMs <= 1800);
    if (state.condition === "slow") return Boolean(trace && trace.durationMs >= 3000 && trace.durationMs <= 8000);
    if (state.condition === "still") return Number(state.latestField?.longestStillnessMs || 0) >= 3000;
    if (state.condition === "repeat") return state.traceSamples.length >= 3 && Number(trace?.repetition || 0) >= 0.35;
    return false;
  };

  const stopRun = (completed = false) => {
    if (!state.active) return;
    state.stoppedAt = performance.now();
    state.active = false;
    state.completed = completed;
    state.statusKey = completed ? "complete" : "stopped";
    state.protocolCompliance = evaluateCompliance();
    if (state.frame) cancelAnimationFrame(state.frame);
    state.frame = 0;
    if (completed && !state.automaticMarks.has(runDuration)) {
      state.automaticMarks.add(runDuration);
      state.observations.push(snapshot(`${runDuration}s`, runDuration));
    }
    timeOutput.textContent = formatTime(completed ? runDuration : elapsedSeconds());
    statusOutput.textContent = copy()[state.statusKey];
    startButton.textContent = copy().start;
    markButton.disabled = true;
    if (replayButton) replayButton.disabled = state.recordedPaths.length === 0;
    exportButton.disabled = state.traceSamples.length === 0 && state.fieldSamples.length === 0;
    cue.hidden = true;
    setMetric("observations", String(state.observations.length));
    updateComplianceMetric();
  };

  const tick = () => {
    if (!state.active) return;
    const elapsed = elapsedSeconds();
    timeOutput.textContent = formatTime(elapsed);
    [5, 15].filter((mark) => mark < runDuration).forEach((mark) => {
      if (elapsed >= mark && !state.automaticMarks.has(mark)) {
        state.automaticMarks.add(mark);
        state.observations.push(snapshot(`${mark}s`, mark));
        setMetric("observations", String(state.observations.length));
      }
    });
    if (elapsed >= runDuration) {
      stopRun(true);
      return;
    }
    state.frame = requestAnimationFrame(tick);
  };

  const startRun = () => {
    if (!state.condition) return;
    resetRun("ready");
    state.active = true;
    state.statusKey = "running";
    state.startedAt = performance.now();
    state.stoppedAt = state.startedAt;
    cue.hidden = false;
    setPhase("input", "run-started");
    statusOutput.textContent = copy().running;
    startButton.textContent = copy().stop;
    markButton.disabled = false;
    if (replayButton) replayButton.disabled = true;
    state.frame = requestAnimationFrame(tick);
    window.setTimeout(() => document.querySelector("[data-console-close]")?.click(), 180);
  };

  conditionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.condition = button.dataset.studyCondition;
      conditionButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      resetRun("ready");
    });
  });

  resetButton.addEventListener("click", () => resetRun("reset"));
  startButton.addEventListener("click", () => state.active ? stopRun(false) : startRun());
  markButton.addEventListener("click", () => markObservation());

  window.addEventListener("tm:trace-forces", (event) => {
    if (!state.active) return;
    const detail = event.detail || {};
    const features = detail.features || {};
    state.latestTrace = {
      traceId: detail.traceId || null,
      resolved: Boolean(detail.resolved),
      speed: Number(features.speed || 0),
      curvature: Number(features.curvature || 0),
      peakTurn: Number(features.peakTurn || 0),
      intersections: Number(features.intersections || 0),
      sampleCount: Number(features.sampleCount || 0),
      durationMs: Number(detail.duration || 0),
      repetition: Number(detail.repetition || 0),
      novelty: Number(detail.novelty || 0),
      relations: { ...(detail.forces || {}) },
    };
    setMetric("speed", `${state.latestTrace.speed.toFixed(3)} px/ms`);
    setMetric("curvature", state.latestTrace.curvature.toFixed(3));
    setMetric("repetition", `${(state.latestTrace.repetition * 100).toFixed(1)}%`);
    setMetric("duration", `${(state.latestTrace.durationMs / 1000).toFixed(2)} s`);
    setMetric("intersections", String(state.latestTrace.intersections));
    if (detail.resolved) {
      state.traceSamples.push({ atSeconds: Number(elapsedSeconds().toFixed(3)), phase: state.phase, ...state.latestTrace });
      if (detail.trajectory?.points?.length) {
        state.recordedPaths.push({
          atSeconds: Number(elapsedSeconds().toFixed(3)),
          coordinateSpace: detail.trajectory.coordinateSpace,
          viewport: { ...(detail.trajectory.viewport || {}) },
          points: detail.trajectory.points.map((point) => ({ ...point })),
        });
      }
      exportButton.disabled = false;
      if (state.phase === "input" && !["still", "free"].includes(state.condition)) {
        const enoughTraces = state.condition === "repeat" ? state.traceSamples.length >= 3 : state.traceSamples.length >= 1;
        if (enoughTraces) setPhase("observation", `${state.traceSamples.length}-trace-input-complete`);
      }
    }
  });

  window.addEventListener("tm:field-state", (event) => {
    if (!state.active) return;
    const detail = event.detail || {};
    state.latestField = {
      density: Number(detail.density || 0),
      directionStrength: Number(detail.directionStrength || 0),
      residueCount: Number(detail.residueCount || 0),
      idleForMs: Number(detail.idleForMs || 0),
      longestStillnessMs: Number(detail.longestStillnessMs || 0),
      pointerMoveCount: Number(detail.pointerMoveCount || 0),
      pointerDistance: Number(detail.pointerDistance || 0),
    };
    setMetric("density", state.latestField.density.toFixed(4));
    setMetric("directionStrength", state.latestField.directionStrength.toFixed(4));
    setMetric("residueCount", String(state.latestField.residueCount));
    setMetric("pointerDistance", `${Math.round(state.latestField.pointerDistance)} px`);
    setMetric("longestStillness", `${(state.latestField.longestStillnessMs / 1000).toFixed(1)} s`);
    state.fieldSamples.push({ atSeconds: Number(elapsedSeconds().toFixed(3)), phase: state.phase, ...state.latestField });
    if (state.phase === "input" && state.condition === "still" && state.latestField.pointerMoveCount > 0 && state.latestField.idleForMs >= 3000) {
      setPhase("observation", "three-seconds-still");
    }
    if (state.phase === "observation" && state.observationBaseline) {
      if (elapsedSeconds() < state.observationGraceUntil) {
        state.observationBaseline.pointerMoveCount = state.latestField.pointerMoveCount;
        state.observationBaseline.pointerDistance = state.latestField.pointerDistance;
        return;
      }
      const addedDistance = state.latestField.pointerDistance - state.observationBaseline.pointerDistance;
      const addedMoves = state.latestField.pointerMoveCount - state.observationBaseline.pointerMoveCount;
      if (addedDistance > 12 || addedMoves > 2) {
        state.protocolDeviation = true;
        updateComplianceMetric();
      }
    }
  });

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const replayRecordedPaths = async () => {
    if (state.active || state.replaying || state.recordedPaths.length === 0) return;
    const field = document.querySelector("[data-field-world]");
    if (!field) return;

    state.replaying = true;
    state.statusKey = "replaying";
    statusOutput.textContent = copy().replaying;
    startButton.disabled = true;
    if (replayButton) replayButton.disabled = true;
    exportButton.disabled = true;

    const paths = state.recordedPaths.map((path) => ({
      ...path,
      points: path.points.map((point) => ({ ...point })),
    }));
    const pathStarts = paths.map((path) => path.atSeconds * 1000 - Number(path.points.at(-1)?.t || 0));
    const firstStart = Math.min(...pathStarts);
    const events = [];

    paths.forEach((path, pathIndex) => {
      const base = Math.max(0, pathStarts[pathIndex] - firstStart);
      path.points.forEach((point, pointIndex) => {
        events.push({
          at: base + Number(point.t || 0),
          type: pointIndex === 0 ? "pointerdown" : "pointermove",
          point,
          pointerId: 700 + pathIndex,
        });
      });
      const last = path.points.at(-1);
      if (last) events.push({ at: base + Number(last.t || 0) + 12, type: "pointerup", point: last, pointerId: 700 + pathIndex });
    });
    events.sort((a, b) => a.at - b.at);

    document.querySelector("[data-console-close]")?.click();
    window.dispatchEvent(new CustomEvent("tm:study-reset"));
    await wait(240);
    const replayStartedAt = performance.now();

    for (const replayEvent of events) {
      const remaining = replayEvent.at - (performance.now() - replayStartedAt);
      if (remaining > 0) await wait(remaining);
      const rect = field.getBoundingClientRect();
      const clientX = rect.left + clamp(Number(replayEvent.point.x || 0), 0, 1) * rect.width;
      const clientY = rect.top + clamp(Number(replayEvent.point.y || 0), 0, 1) * rect.height;
      field.dispatchEvent(new PointerEvent(replayEvent.type, {
        bubbles: true,
        cancelable: true,
        pointerId: replayEvent.pointerId,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons: replayEvent.type === "pointerup" ? 0 : 1,
        clientX,
        clientY,
      }));
    }

    state.replaying = false;
    state.statusKey = "replayComplete";
    statusOutput.textContent = copy().replayComplete;
    startButton.disabled = !state.condition;
    if (replayButton) replayButton.disabled = false;
    exportButton.disabled = false;
  };

  replayButton?.addEventListener("click", replayRecordedPaths);

  exportButton.addEventListener("click", () => {
    const payload = {
      schema: "three-metamorphoses-study-v4",
      project: "The Three Metamorphoses",
      generatedAt: new Date().toISOString(),
      participantCode: participantCode(),
      privacyNote: "Anonymous pilot code only. Do not enter a participant name.",
      condition: state.condition,
      protocol: state.condition ? protocols[state.condition].en : null,
      targetDurationSeconds: runDuration,
      completed: state.completed,
      protocolFollowed: state.protocolCompliance,
      protocolDeviation: state.protocolDeviation,
      conceptualBoundary: "The condition constrains the test input, not the participant's meaning or identity.",
      phaseTransitions: state.phaseTransitions,
      inputCompletionTrace: state.inputCompletionTrace,
      traceSamples: state.traceSamples,
      recordedPaths: state.recordedPaths,
      fieldSamples: state.fieldSamples,
      observations: state.observations,
      finalTrace: state.latestTrace,
      finalField: state.latestField,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `three-metamorphoses-${participantCode()}-${state.condition || "study"}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  panel.hidden = false;
  panel.dataset.studyEnabled = "true";
  resetRun("notStarted");
})();
