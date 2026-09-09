const base = "../../outputs/after-use-xiaorensutang-viewing-conditions-2026-09-09/";

const conditions = {
  c1: {
    code: "C1 · DOCUMENTED INPUT",
    title: "White backing / album page",
    image: `${base}XST-C1-source.jpg`,
    alt: "The wrapper photographed against a white album page",
    boundary: "The OCR was run on a perspective-corrected crop of this photograph. The full wrapper boundary is visible.",
    machineNote: "Apple Vision OCR on the C1 perspective-corrected crop.",
    ocr: [
      ["XIAORENSUTANG", 0.3],
      ["长春市第一食品厂", 0.5],
    ],
    observation: "Against white paper, the blue and pale areas appear distinct.",
  },
  c2: {
    code: "C2 · DOCUMENTED INPUT",
    title: "Hand-held / ordinary indoor light",
    image: `${base}XST-C2-source.jpg`,
    alt: "The wrapper held in ordinary indoor light",
    boundary: "The OCR was run on a perspective-corrected crop of this photograph. Holding, distance and background differ from C1.",
    machineNote: "Apple Vision OCR on the C2 perspective-corrected crop.",
    ocr: [
      ["XIAORENSUTANE", 0.5],
      ["长春市第一後品厂", 0.5],
    ],
    observation: "Recorded state: lifted away from the album backing and held in ordinary indoor light. No isolated material conclusion was recorded for this state.",
  },
  c3: {
    code: "C3 · DOCUMENTED INPUT",
    title: "Held against the hand",
    image: `${base}XST-C3-source.jpg`,
    alt: "The wrapper photographed with the artist's hand visible behind it",
    boundary: "The OCR was run on a perspective-corrected crop of this photograph. The hand remains part of the captured viewing condition.",
    machineNote: "Apple Vision OCR on the C3 perspective-corrected crop.",
    ocr: [
      ["XIAORENSUTANE", 0.5],
      ["长春市第一食品厂", 1.0],
    ],
    observation: "Recorded state: the wrapper is viewed against the hand. No separate causal claim has been made about the visual change in this state.",
  },
  c4: {
    code: "C4 · DOCUMENTED INPUT · QUALITATIVE ONLY",
    title: "Held toward strong light",
    image: `${base}XST-C4-source.jpg`,
    alt: "The wrapper held toward strong light so its thin surface becomes visible",
    boundary: "This is the exact photograph used for the C4 OCR. Two corners extend beyond the frame, so it was not perspective-corrected or included in quantitative image comparison.",
    machineNote: "Apple Vision OCR was run directly on this C4 source photograph; no result from another image has been substituted.",
    ocr: [
      ["XIADRENSUTTAME", 0.3],
      ["长春市第一食品厂", 0.3],
    ],
    observation: "When lifted toward strong light, the wrapper seems more translucent, its image less clear, and fine thread-like patterns become visible.",
  },
};

const image = document.querySelector("#wrapper-image");
const stage = document.querySelector("#image-stage");
const title = document.querySelector("#condition-title");
const code = document.querySelector("#condition-code");
const boundary = document.querySelector("#condition-boundary");
const machineNote = document.querySelector("#machine-note");
const lines = document.querySelector("#ocr-lines");
const observation = document.querySelector("#state-observation");
const zoomLevel = document.querySelector("#zoom-level");

let current = "c1";
let zoom = 1;
let panX = 0;
let panY = 0;
let dragStart = null;

function renderTransform() {
  image.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
  zoomLevel.value = `${Math.round(zoom * 100)}%`;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

function resetZoom() {
  zoom = 1;
  panX = 0;
  panY = 0;
  renderTransform();
}

function setCondition(key) {
  current = key;
  const item = conditions[key];
  document.querySelectorAll(".condition-button").forEach((button) => {
    const active = button.dataset.condition === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  image.style.opacity = "0";
  image.src = item.image;
  image.alt = item.alt;
  image.onload = () => { image.style.opacity = "1"; };
  code.textContent = item.code;
  title.textContent = item.title;
  boundary.textContent = item.boundary;
  machineNote.textContent = item.machineNote;
  observation.textContent = item.observation;
  lines.replaceChildren(...item.ocr.map(([text, confidence]) => {
    const row = document.createElement("div");
    row.className = "ocr-line";
    const value = document.createElement("code");
    value.textContent = text;
    const score = document.createElement("span");
    score.textContent = `confidence ${confidence.toFixed(1)}`;
    row.append(value, score);
    return row;
  }));
  resetZoom();
}

document.querySelectorAll(".condition-button").forEach((button) => {
  button.addEventListener("click", () => setCondition(button.dataset.condition));
});

document.querySelector("#zoom-in").addEventListener("click", () => {
  zoom = Math.min(4, zoom + 0.25);
  renderTransform();
});

document.querySelector("#zoom-out").addEventListener("click", () => {
  zoom = Math.max(1, zoom - 0.25);
  if (zoom === 1) { panX = 0; panY = 0; }
  renderTransform();
});

document.querySelector("#zoom-reset").addEventListener("click", resetZoom);

stage.addEventListener("pointerdown", (event) => {
  if (zoom === 1) return;
  dragStart = { x: event.clientX - panX, y: event.clientY - panY };
  stage.classList.add("is-dragging");
  stage.setPointerCapture(event.pointerId);
});

stage.addEventListener("pointermove", (event) => {
  if (!dragStart) return;
  panX = event.clientX - dragStart.x;
  panY = event.clientY - dragStart.y;
  renderTransform();
});

function endDrag(event) {
  dragStart = null;
  stage.classList.remove("is-dragging");
  if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
}

stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

document.querySelectorAll("textarea[data-note]").forEach((textarea) => {
  const key = `one-wrapper-reflection:${textarea.dataset.note}`;
  textarea.value = localStorage.getItem(key) || "";
  textarea.addEventListener("input", () => localStorage.setItem(key, textarea.value));
});

setCondition(current);
