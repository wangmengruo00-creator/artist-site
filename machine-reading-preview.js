(() => {
  const records = window.MACHINE_READING_REVIEW || [];
  const corpus = window.MACHINE_READING_CORPUS || [];
  const grid = document.querySelector("[data-review-grid]");
  if (!records.length || !grid) return;

  const elements = {
    id: document.querySelector("[data-record-id]"),
    group: document.querySelector("[data-record-group]"),
    image: document.querySelector("[data-record-image]"),
    assessment: document.querySelector("[data-record-assessment]"),
    confidence: document.querySelector("[data-record-confidence]"),
    cluster: document.querySelector("[data-record-cluster]"),
    visible: document.querySelector("[data-record-visible]"),
    machine: document.querySelector("[data-record-machine]"),
    lensNumber: document.querySelector("[data-lens-number]"),
    lensOutput: document.querySelector("[data-lens-output]"),
    next: document.querySelector("[data-record-next]")
  };

  const groupLabels = {
    "machine-failure": "Machine failure",
    "visual-outlier": "Visual outlier",
    "positive-control": "Positive control",
    "boundary-case": "Boundary case"
  };
  const lensNumbers = { preserved: "01", altered: "02", omitted: "03", reconstructed: "04" };
  let selected = records[0];
  let lens = "preserved";

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);

  const renderStage = () => {
    elements.id.textContent = selected.id.replace("-", "–");
    elements.group.textContent = groupLabels[selected.group];
    elements.image.src = selected.image;
    elements.image.alt = `${selected.id}, selected paper record`;
    elements.assessment.textContent = selected.assessment;
    elements.confidence.textContent = selected.confidence.toFixed(3);
    elements.cluster.textContent = String(selected.cluster).padStart(2, "0");
    elements.visible.textContent = selected.visible;
    elements.machine.textContent = selected.machine;
    elements.lensNumber.textContent = `${lensNumbers[lens]} / ${lens.toUpperCase()}`;
    elements.lensOutput.textContent = selected[lens];
    elements.next.textContent = selected.nextAction;
    document.querySelectorAll(".machine-reading-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.id === selected.id);
    });
  };

  records.forEach((record) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "machine-reading-card";
    card.dataset.id = record.id;
    card.dataset.group = record.group;
    card.innerHTML = `
      <figure><img src="${escapeHtml(record.image)}" alt="" loading="lazy" decoding="async"></figure>
      <div>
        <span>${escapeHtml(record.id.replace("-", "–"))} / ${escapeHtml(groupLabels[record.group])}</span>
        <strong>${escapeHtml(record.assessment)}</strong>
        <small>OCR ${record.confidence.toFixed(3)} · CLUSTER ${String(record.cluster).padStart(2, "0")}</small>
      </div>
    `;
    card.addEventListener("click", () => {
      selected = record;
      renderStage();
      document.querySelector(".machine-reading-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    grid.append(card);
  });

  const corpusGrid = document.querySelector("[data-corpus-grid]");
  if (corpusGrid) {
    corpus.forEach((record) => {
      const item = document.createElement(record.reviewed ? "button" : "figure");
      if (record.reviewed) item.type = "button";
      item.className = `machine-reading-corpus-item${record.reviewed ? " is-reviewed" : ""}`;
      item.dataset.id = record.id;
      item.innerHTML = `
        <img src="${escapeHtml(record.image)}" alt="" loading="lazy" decoding="async">
        <figcaption><strong>${escapeHtml(record.id.replace("-", "–"))}</strong><span>${escapeHtml(record.status)}</span></figcaption>
      `;
      if (record.reviewed) {
        item.setAttribute("aria-label", `Open draft comparison for ${record.id}`);
        item.addEventListener("click", () => {
          selected = records.find((candidate) => candidate.id === record.id) || selected;
          renderStage();
          document.querySelector("#diagnostic-reading")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      corpusGrid.append(item);
    });
  }

  document.querySelectorAll("[data-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      lens = button.dataset.lens;
      document.querySelectorAll("[data-lens]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      renderStage();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      document.querySelectorAll(".machine-reading-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.group !== filter;
      });
    });
  });

  renderStage();
})();
