(() => {
  const field = document.querySelector("[data-field-world]");
  const residueCanvas = field?.querySelector(".residue-canvas");
  const traceCanvas = field?.querySelector(".trace-canvas");
  const toggle = document.querySelector("[data-study-video-toggle]");
  const status = document.querySelector("[data-study-video-status]");
  if (!field || !residueCanvas || !traceCanvas || !toggle || !status) return;

  const captureCanvas = document.createElement("canvas");
  const context = captureCanvas.getContext("2d", { alpha: false });
  let recorder = null;
  let stream = null;
  let chunks = [];
  let frame = 0;
  let discard = false;
  let currentRun = null;

  const enabled = () => toggle.getAttribute("aria-pressed") === "true";
  const safeName = (value, fallback) => String(value || fallback)
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 24) || fallback;

  const chooseMimeType = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = [
      "video/mp4;codecs=avc1.42E01E",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  };

  const updateCanvasSize = () => {
    const rect = field.getBoundingClientRect();
    const scale = Math.min(1, 1920 / Math.max(1, rect.width), 1080 / Math.max(1, rect.height));
    captureCanvas.width = Math.max(2, Math.round(rect.width * scale));
    captureCanvas.height = Math.max(2, Math.round(rect.height * scale));
  };

  const draw = () => {
    if (!recorder || recorder.state !== "recording") return;
    context.fillStyle = "#0b0d0c";
    context.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
    context.drawImage(residueCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
    context.drawImage(traceCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
    frame = window.requestAnimationFrame(draw);
  };

  const download = (blob, mimeType) => {
    const extension = mimeType.startsWith("video/mp4") ? "mp4" : "webm";
    const participant = safeName(currentRun?.participantCode, "P00");
    const condition = safeName(currentRun?.condition, "STUDY");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `three-metamorphoses-${participant}-${condition}-${Date.now()}.${extension}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const stop = (shouldDiscard = false) => {
    if (!recorder || recorder.state === "inactive") return;
    discard = shouldDiscard;
    status.textContent = shouldDiscard ? "Video capture cancelled." : "Finalising video…";
    recorder.stop();
  };

  const start = (detail) => {
    if (!enabled()) return;
    const mimeType = chooseMimeType();
    if (!mimeType || typeof captureCanvas.captureStream !== "function") {
      status.textContent = "Automatic video is not supported in this browser. Use screen recording for this run.";
      return;
    }

    if (recorder && recorder.state !== "inactive") stop(true);
    updateCanvasSize();
    currentRun = { ...detail };
    chunks = [];
    discard = false;
    stream = captureCanvas.captureStream(30);
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) chunks.push(event.data);
    });
    recorder.addEventListener("stop", () => {
      window.cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      if (!discard && chunks.length) {
        const blob = new Blob(chunks, { type: mimeType });
        download(blob, mimeType);
        status.textContent = "Video downloaded. Export the matching JSON before resetting the field.";
      } else if (!discard) {
        status.textContent = "No video frames were captured. Use screen recording for this run.";
      }
      chunks = [];
      stream = null;
    });
    recorder.start(500);
    status.textContent = `Recording clean field video · ${captureCanvas.width} × ${captureCanvas.height} · 30 fps`;
    draw();
  };

  toggle.addEventListener("click", () => {
    const next = !enabled();
    toggle.setAttribute("aria-pressed", String(next));
    toggle.textContent = `Auto video: ${next ? "on" : "off"}`;
    status.textContent = next
      ? "Ready. Starting a run will record the visual field and download a video when the run ends."
      : "Automatic field video is disabled.";
  });

  window.addEventListener("tm:study-start", (event) => start(event.detail || {}));
  window.addEventListener("tm:study-stop", () => stop(false));
  window.addEventListener("tm:study-reset", () => {
    if (recorder?.state === "recording") stop(true);
  });
})();
