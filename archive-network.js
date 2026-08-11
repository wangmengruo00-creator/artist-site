(() => {
  const field = document.querySelector("[data-archive-field]");
  const stage = document.querySelector("[data-archive-stage]");
  const nodesLayer = document.querySelector("[data-archive-nodes]");
  const canvas = document.querySelector(".archive-relations");
  const record = document.querySelector("[data-archive-record]");
  const recordEmpty = record?.querySelector(".archive-record-empty");
  const recordContent = record?.querySelector(".archive-record-content");
  const closeRecord = document.querySelector("[data-close-record]");

  if (!field || !stage || !nodesLayer || !canvas || !record || !recordContent) return;

  const ctx = canvas.getContext("2d");
  const scanAssetRoot = "../assets/invalidated-tickets/";

  const baseRecords = [
    { id: "eligibility", ref: "R–01", title: "Eligibility", kind: "term", lens: "access", x: 110, y: 245 },
    { id: "allocation", ref: "R–02", title: "Allocation", kind: "term", lens: "access", x: 390, y: 80 },
    { id: "exchange", ref: "R–03", title: "Exchange", kind: "term", lens: "exchange", x: 765, y: 70 },
    { id: "validity", ref: "R–04", title: "Temporal validity", kind: "term", lens: "exchange", x: 1135, y: 95 },
    { id: "recognition", ref: "R–05", title: "Recognition", kind: "term", lens: "recognition", x: 1540, y: 285 },
    { id: "attraction", ref: "R–06", title: "Attraction", kind: "term", lens: "recognition", x: 1480, y: 850 },
    { id: "value", ref: "R–07", title: "Value", kind: "term", lens: "value", x: 780, y: 980 }
  ];

  const scanSource = (window.INVALIDATED_ARCHIVE_ITEMS || []).filter((item) => item.published && !item.duplicateOf);
  const traceSetIds = new Set([
    "T-001", "T-012", "T-038", "T-072", "T-105", "T-148", "T-185",
    "W-001", "W-015", "W-030", "W-051",
    "L-001", "L-006", "L-012",
    "E-001",
    "P-001", "P-012", "P-024", "P-036", "P-044"
  ]);
  const collectionSeen = {};
  const collectionDetails = {
    food: {
      materialField: "regulated",
      date: "Date unresolved", place: "Region awaiting identification", function: "Allocation / access / value",
      trace: "Printed value; paper edge; use trace", note: "This ticket enters the archive as an individual material record. Its date, locality and circulation remain open to verification.",
      observation: "Printed denomination, paper edge, colour and handling trace are directly visible in the scan.",
      context: "Former function, date and locality require object-specific provenance research.",
      inference: "No claim about circulation or user experience is made from the scan alone.",
      question: "What becomes visible when this object is read beside other regulated papers?", terms: [["eligibility", "access"], ["allocation", "access"], ["exchange", "exchange"], ["validity", "exchange"], ["value", "value"]]
    },
    wrappers: {
      materialField: "commodity",
      date: "Date unresolved", place: "Place awaiting identification", function: "Packaging / attraction / recognition",
      trace: "Fold; colour; thin printed paper", note: "This wrapper is kept at its own scale so colour, typography and the memory of handling do not disappear into a visual pile.",
      observation: "Colour, typography, fold and thin printed paper are directly visible.",
      context: "Producer, commodity, date and circulation require object-specific documentation.",
      inference: "Attraction is treated as a research proposition rather than a recovered consumer response.",
      question: "What continues to attract after the product and its use have disappeared?", terms: [["recognition", "recognition"], ["attraction", "recognition"], ["value", "value"]]
    },
    labels: {
      materialField: "commodity",
      date: "Date unresolved", place: "Place awaiting identification", function: "Identification / commodity image",
      trace: "Cut edge; printed colour; surface wear", note: "This label is read as a single image-bearing object while its producer, date and circulation remain under investigation.",
      observation: "Cut edge, printed colour, image and surface wear are directly visible.",
      context: "Producer, place, date and former commodity relation remain to be documented.",
      inference: "Recognition and value are provisional analytical routes, not historical conclusions.",
      question: "How does a small printed surface continue to organise recognition and value?", terms: [["recognition", "recognition"], ["attraction", "recognition"], ["value", "value"]]
    },
    "misc-a": {
      materialField: "peripheral",
      date: "Date unresolved", place: "Place awaiting identification", function: "Image / packaging / recognition",
      trace: "Printed surface; cut edge; colour", note: "This printed image label enters as an individual object rather than as part of its scanned page. Identification remains open.",
      observation: "Printed surface, edge, colour and handling trace are directly visible.",
      context: "This record is retained at the corpus boundary while provenance remains unresolved.",
      inference: "Entry into the core corpus is withheld until the research relation can be supported.",
      question: "Under what conditions should this object enter the bounded corpus?", terms: [["recognition", "recognition"], ["value", "value"]]
    },
    "misc-b": {
      materialField: "peripheral",
      date: "Date unresolved", place: "Place awaiting identification", function: "Image / packaging / recognition",
      trace: "Printed surface; album trace; handling", note: "This packaging or printed label has been separated from its album page so its image, typography and material trace can be read independently.",
      observation: "Printed surface, paper edge, colour and handling trace are directly visible in the rescan.",
      context: "Identification and provenance remain unresolved; the record is held at the corpus boundary.",
      inference: "A possible relation to recognition or value remains an artistic proposition until researched.",
      question: "Under what conditions should this object enter the bounded corpus?", terms: [["recognition", "recognition"], ["attraction", "recognition"], ["value", "value"]]
    }
  };

  const scannedRecords = scanSource.map((source, index) => {
    const collectionIndex = collectionSeen[source.collection] || 0;
    collectionSeen[source.collection] = collectionIndex + 1;
    const featured = traceSetIds.has(source.id);
    const angle = collectionIndex * 2.399963;
    const cluster = source.collection === "food" ? { x: 570, y: 500, r: 360 }
      : source.collection === "wrappers" ? { x: 1270, y: 500, r: 300 }
        : source.collection === "labels" ? { x: 930, y: 520, r: 240 }
          : { x: 900, y: 520, r: 420 };
    const details = collectionDetails[source.collection];
    return {
      id: `scan-${source.id.toLowerCase()}`, ref: source.id.replace("-", "–"), title: source.title,
      kind: "object", scanned: true, featured, collection: source.collection, materialField: details.materialField,
      imageUrl: scanAssetRoot + source.image, imagePosition: "50% 50%",
      sourceFile: source.source, sourcePage: source.page,
      date: details.date, place: details.place, function: details.function, trace: details.trace,
      status: source.status, note: details.note, question: details.question,
      observation: details.observation, context: details.context, inference: details.inference,
      x: Math.round(cluster.x + Math.cos(angle) * cluster.r * (0.45 + (collectionIndex % 5) * 0.1)),
      y: Math.round(cluster.y + Math.sin(angle) * cluster.r * (0.45 + (collectionIndex % 5) * 0.1))
    };
  });

  const records = [...baseRecords, ...scannedRecords];

  const scannedRelations = scannedRecords.flatMap((item) => collectionDetails[item.collection].terms.map(([target, lens]) => ({ source: item.id, target, lens })));
  const relations = scannedRelations;

  const byId = new Map(records.map((item) => [item.id, item]));
  const elements = new Map();
  const state = { scale: 0.72, x: 0, y: 0, view: "grid", lens: "all", collection: "all", readingMode: "system", selected: null, dragging: false, pointerX: 0, pointerY: 0 };

  const imageUrl = (item) => item.imageUrl;

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);

  const materialFieldLabels = {
    regulated: "Tickets and vouchers",
    commodity: "Wrappers and labels",
    peripheral: "Other printed matter / awaiting research"
  };

  const makeNode = (item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `archive-node archive-node-${item.kind}`;
    if (item.scanned) button.classList.add("archive-node-scanned");
    button.dataset.id = item.id;
    button.dataset.index = String(index + 1).padStart(2, "0");
    button.setAttribute("aria-label", `${item.ref}: ${item.title}`);

    if (item.kind === "object") {
      const imageAttributes = item.scanned && !item.featured
        ? `data-src="${imageUrl(item)}"`
        : `src="${imageUrl(item)}"`;
      button.innerHTML = `
        <span class="archive-node-image"><img ${imageAttributes} alt="" loading="lazy" decoding="async" style="object-position:${item.imagePosition}"></span>
        <span class="archive-node-ref">${escapeHtml(item.ref)} / Material record</span>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="archive-node-meta">${escapeHtml(item.date)} · ${escapeHtml(item.status)}</span>
      `;
    } else {
      button.innerHTML = `<strong>${escapeHtml(item.title)}</strong>`;
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectNode(item.id);
    });
    nodesLayer.appendChild(button);
    elements.set(item.id, button);
  };

  records.forEach(makeNode);

  const matchesCollection = (item) => state.collection === "all"
    || item.kind === "term"
    || item.materialField === state.collection;

  const visibleGridObjects = () => records.filter((entry) => entry.kind === "object" && matchesCollection(entry));

  const gridPosition = (item) => {
    const objectItems = visibleGridObjects();
    if (item.kind === "object") {
      const index = objectItems.findIndex((entry) => entry.id === item.id);
      return { x: 70 + (index % 8) * 220, y: 70 + Math.floor(index / 8) * 285 };
    }
    return { x: 0, y: 0 };
  };

  const updateStageSize = () => {
    const gridRows = Math.ceil(visibleGridObjects().length / 8);
    const width = state.view === "grid" ? 1840 : 1800;
    const height = state.view === "grid" ? Math.max(1100, 120 + gridRows * 285) : 1100;
    stage.style.width = `${width}px`;
    stage.style.height = `${height}px`;
    nodesLayer.style.width = `${width}px`;
    nodesLayer.style.height = `${height}px`;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return { width, height };
  };

  const updateCount = () => {
    const count = document.querySelector("[data-archive-count]");
    if (!count) return;
    const matching = scannedRecords.filter((item) => state.collection === "all" || item.materialField === state.collection);
    const visible = state.view === "grid" ? matching.length : matching.filter((item) => item.featured).length;
    count.textContent = state.view === "grid"
      ? `All objects / ${visible} individual scans / nothing removed`
      : `Selected relations / ${visible} working examples / ${baseRecords.length} possible relations`;
  };

  const positionNodes = () => {
    document.body.dataset.archiveView = state.view;
    updateStageSize();
    records.forEach((item) => {
      const networkHidden = state.view === "network" && item.scanned && (!item.featured || !matchesCollection(item));
      const gridHidden = state.view === "grid" && (item.kind === "term" || !matchesCollection(item));
      const position = state.view === "grid" ? gridPosition(item) : item;
      const element = elements.get(item.id);
      element.hidden = networkHidden || gridHidden;
      const image = element.querySelector("img[data-src]");
      if (!element.hidden && image) {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }
      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
    });
    updateCount();
    window.requestAnimationFrame(drawRelations);
  };

  const nodeCenter = (id) => {
    const item = byId.get(id);
    const position = state.view === "grid" ? gridPosition(item) : item;
    const element = elements.get(id);
    return { x: position.x + element.offsetWidth / 2, y: position.y + element.offsetHeight / 2 };
  };

  const visibleRelations = () => relations.filter((relation) => state.lens === "all" || relation.lens === state.lens);

  const drawRelations = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state.view === "grid") return;

    const activeRelations = visibleRelations();
    activeRelations.forEach((relation) => {
      if (elements.get(relation.source)?.hidden || elements.get(relation.target)?.hidden) return;
      const source = nodeCenter(relation.source);
      const target = nodeCenter(relation.target);
      const connected = !state.selected || relation.source === state.selected || relation.target === state.selected;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      const middleX = (source.x + target.x) / 2;
      ctx.bezierCurveTo(middleX, source.y, middleX, target.y, target.x, target.y);
      ctx.strokeStyle = ["recognition", "value"].includes(relation.lens)
        ? `rgba(135,55,45,${connected ? 0.42 : 0.07})`
        : `rgba(48,75,103,${connected ? 0.34 : 0.06})`;
      ctx.lineWidth = connected && state.selected ? 1.6 : 0.8;
      ctx.stroke();
    });
  };

  const relatedIds = (id) => {
    const ids = new Set();
    visibleRelations().forEach((relation) => {
      if (relation.source === id) ids.add(relation.target);
      if (relation.target === id) ids.add(relation.source);
    });
    return ids;
  };

  const updateEmphasis = () => {
    const related = state.selected ? relatedIds(state.selected) : new Set();
    const activeRelationIds = new Set(visibleRelations().flatMap((relation) => [relation.source, relation.target]));
    records.forEach((item) => {
      const element = elements.get(item.id);
      const relevantToLens = state.lens === "all" || activeRelationIds.has(item.id);
      const relevantToSelection = !state.selected || item.id === state.selected || related.has(item.id);
      element.classList.toggle("is-selected", item.id === state.selected);
      element.classList.toggle("is-related", related.has(item.id));
      element.classList.toggle("is-muted", !relevantToLens || !relevantToSelection);
    });
    drawRelations();
  };

  const renderRecord = (item) => {
    const related = [...relatedIds(item.id)].map((id) => byId.get(id));
    const relationButtons = related.length
      ? related.map((entry) => `<li><button type="button" data-related-id="${entry.id}">${escapeHtml(entry.ref)} — ${escapeHtml(entry.title)}</button></li>`).join("")
      : "<li><button type=\"button\" disabled>No relation under this lens</button></li>";

    if (item.kind === "term") {
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / Provisional term</p>
        <h1>${escapeHtml(item.title)}</h1>
        <span class="archive-record-state">Proposed relation / not historical fact</span>
        <p>This is one possible way of comparing the objects. The visible connections do not claim that the former relation survives unchanged.</p>
        <span class="archive-related-label">Objects connected for comparison</span>
        <ul class="archive-related-list">${relationButtons}</ul>
      `;
    } else {
      const readingPanels = {
        system: `
          <div class="archive-reading-panel" data-reading-panel="system">
            <span class="archive-reading-panel-label">SYSTEM RECORD / DOCUMENTED + UNRESOLVED</span>
            <p>Read the object through the conditions its former system may have organised.</p>
            <dl class="archive-record-data">
              <div><dt>Material type</dt><dd>${escapeHtml(materialFieldLabels[item.materialField])}</dd></div>
              <div><dt>Date</dt><dd>${escapeHtml(item.date)}</dd></div>
              <div><dt>Place</dt><dd>${escapeHtml(item.place)}</dd></div>
              <div><dt>Former operation</dt><dd>${escapeHtml(item.function)}</dd></div>
              ${item.sourceFile ? `<div><dt>Scan source</dt><dd>${escapeHtml(item.sourceFile)} · page ${escapeHtml(item.sourcePage)}</dd></div>` : ""}
            </dl>
            <p class="archive-reading-caution">Known information remains separate from later interpretation. Date, provenance, and circulation stay unresolved unless documented.</p>
          </div>`,
        material: `
          <div class="archive-reading-panel" data-reading-panel="material">
            <span class="archive-reading-panel-label">MATERIAL TRACE / DIRECT OBSERVATION</span>
            <p>${escapeHtml(item.observation)}</p>
            <dl class="archive-record-data">
              <div><dt>Trace field</dt><dd>${escapeHtml(item.trace)}</dd></div>
              <div><dt>Reading limit</dt><dd>A visible trace cannot by itself recover who used the object or what that use meant.</dd></div>
            </dl>
          </div>`,
        machine: `
          <div class="archive-reading-panel archive-reading-panel-machine" data-reading-panel="machine">
            <span class="archive-reading-panel-label">PROPOSED MACHINE READING / NOT YET COMPUTED</span>
            <p>A future prototype could compare this scan through colour distribution, layout, printed symbols, numerals, edges, and visible wear.</p>
            <dl class="archive-record-data">
              <div><dt>Possible link</dt><dd>Formal similarity to other records may produce a new comparison.</dd></div>
              <div><dt>Possible omission</dt><dd>Provenance, touch, former eligibility, and lived use may remain illegible to the model.</dd></div>
              <div><dt>Research status</dt><dd>Proposed test only. No automated interpretation is presented as historical evidence.</dd></div>
            </dl>
          </div>`
      };
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / Material record</p>
        <h1>${escapeHtml(item.title)}</h1>
        <figure class="archive-record-hero"><img src="${imageUrl(item)}" alt="${escapeHtml(item.title)}" style="object-position:${item.imagePosition}"></figure>
        <span class="archive-record-state">${escapeHtml(item.status)}</span>
        <p>${escapeHtml(item.note)}</p>
        ${readingPanels[state.readingMode]}
        <p class="archive-record-question">${escapeHtml(item.question)}</p>
        <span class="archive-related-label">Possible connections in this view</span>
        <ul class="archive-related-list">${relationButtons}</ul>
      `;
    }

    recordContent.querySelectorAll("[data-related-id]").forEach((button) => {
      button.addEventListener("click", () => selectNode(button.dataset.relatedId));
    });
    recordEmpty.hidden = true;
    recordContent.hidden = false;
    document.body.classList.add("is-record-open");
  };

  function selectNode(id) {
    state.selected = id;
    updateEmphasis();
    renderRecord(byId.get(id));
  }

  const clearSelection = () => {
    state.selected = null;
    updateEmphasis();
    recordContent.hidden = true;
    recordEmpty.hidden = false;
    document.body.classList.remove("is-record-open");
  };

  const applyTransform = () => {
    stage.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  };

  const resetView = () => {
    const bounds = field.getBoundingClientRect();
    const dimensions = updateStageSize();
    if (state.view === "grid") {
      state.scale = Math.max(0.48, Math.min(0.82, (bounds.width / dimensions.width) * 0.96));
      state.x = (bounds.width - dimensions.width * state.scale) / 2;
      state.y = 24;
    } else {
      state.scale = Math.max(0.36, Math.min(0.9, Math.min(bounds.width / dimensions.width, bounds.height / dimensions.height) * 0.94));
      state.x = (bounds.width - dimensions.width * state.scale) / 2;
      state.y = (bounds.height - dimensions.height * state.scale) / 2;
    }
    applyTransform();
  };

  const setZoom = (nextScale) => {
    const bounds = field.getBoundingClientRect();
    const previous = state.scale;
    state.scale = Math.max(0.32, Math.min(1.45, nextScale));
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    state.x = centerX - ((centerX - state.x) / previous) * state.scale;
    state.y = centerY - ((centerY - state.y) / previous) * state.scale;
    applyTransform();
  };

  const syncViewControls = () => {
    const gridMode = state.view === "grid";
    const lensGroup = document.querySelector(".archive-lenses");
    lensGroup?.classList.toggle("is-inactive", gridMode);
    document.querySelectorAll("[data-lens]").forEach((button) => {
      button.disabled = gridMode;
    });
  };

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      if (state.view === "grid") {
        state.lens = "all";
        document.querySelectorAll("[data-lens]").forEach((candidate) => {
          const active = candidate.dataset.lens === "all";
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
      }
      document.querySelectorAll("[data-view]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      syncViewControls();
      positionNodes();
      clearSelection();
      resetView();
    });
  });

  document.querySelectorAll("[data-reading-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.readingMode = button.dataset.readingMode;
      document.querySelectorAll("[data-reading-mode]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      if (state.selected) renderRecord(byId.get(state.selected));
    });
  });

  document.querySelectorAll("[data-lens]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lens = button.dataset.lens;
      document.querySelectorAll("[data-lens]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      updateEmphasis();
      if (state.selected) renderRecord(byId.get(state.selected));
    });
  });

  document.querySelectorAll("[data-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      state.collection = button.dataset.collection;
      document.querySelectorAll("[data-collection]").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      clearSelection();
      positionNodes();
      resetView();
    });
  });

  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.zoom === "reset") resetView();
      if (button.dataset.zoom === "in") setZoom(state.scale * 1.16);
      if (button.dataset.zoom === "out") setZoom(state.scale / 1.16);
    });
  });

  field.addEventListener("wheel", (event) => {
    event.preventDefault();
    setZoom(state.scale * (event.deltaY > 0 ? 0.92 : 1.08));
  }, { passive: false });

  field.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".archive-node") || event.target.closest("button")) return;
    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    field.classList.add("is-dragging");
    field.setPointerCapture(event.pointerId);
  });

  field.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    state.x += event.clientX - state.pointerX;
    state.y += event.clientY - state.pointerY;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;
    applyTransform();
  });

  const endDrag = () => {
    state.dragging = false;
    field.classList.remove("is-dragging");
  };

  field.addEventListener("pointerup", endDrag);
  field.addEventListener("pointercancel", endDrag);
  field.addEventListener("click", (event) => {
    if (!event.target.closest(".archive-node")) clearSelection();
  });
  closeRecord?.addEventListener("click", clearSelection);
  window.addEventListener("resize", resetView, { passive: true });

  syncViewControls();
  positionNodes();
  resetView();
})();
