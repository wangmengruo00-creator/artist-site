(() => {
  const field = document.querySelector("[data-archive-field]");
  const stage = document.querySelector("[data-archive-stage]");
  const nodesLayer = document.querySelector("[data-archive-nodes]");
  const canvas = document.querySelector(".archive-relations");
  const record = document.querySelector("[data-archive-record]");
  const recordEmpty = record?.querySelector(".archive-record-empty");
  const recordContent = record?.querySelector(".archive-record-content");
  const recordEvidenceControls = record?.querySelector("[data-record-evidence-controls]");
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

  const curatedRecordDetails = {
    "T-001": { title: "Haircut ticket / Jiyuan County / 1977", date: "1977 printed on object", place: "Jiyuan County printed on object", status: "Visible text transcribed" },
    "T-038": { title: "Jiangxi grain coupon / 1 shi jin / 1978", date: "1978 printed on object", place: "Jiangxi Province printed on object", status: "Visible text transcribed" },
    "T-072": { title: "Henan grain coupon / 20 shi jin / Luoyang", date: "Date not yet verified", place: "Henan Province · Luoyang printed on object", status: "Visible text transcribed" },
    "T-105": { title: "Jilin local grain coupon / 0.2 shi jin / 1975", date: "1975 printed on object", place: "Jilin Province printed on object", status: "Visible text transcribed" },
    "T-148": { title: "Hunan grain coupon / 0.2 shi jin / 1971", date: "1971 printed on object", place: "Hunan Province printed on object", status: "Visible text transcribed" },
    "T-185": { title: "Hebei local grain coupon / 1 shi liang / 1971", date: "1971 printed on object", place: "Hebei Province printed on object", status: "Visible text transcribed" },
    "W-001": { title: "Fruit hard-candy wrapper / Yichun Food Factory", status: "Brand and producer visible" },
    "W-030": { title: "Milk-candy wrapper / yellow floral print", status: "Product type visible · producer unresolved" },
    "L-001": { title: "Tonghua red grape wine label / 720 mL", status: "Product and volume visible" },
    "L-006": { title: "Tonghua seasoned grape wine label / 710 mL", status: "Product and volume visible" },
    "E-001": { title: "Flying Swallow Brand printed label", status: "Brand name visible · commodity unresolved" },
    "P-001": { title: "Hope menthol cigarette wrapper / 20", status: "Brand and product type visible" }
  };
  const curatedRecordIds = new Set(Object.keys(curatedRecordDetails));
  const scanSource = (window.INVALIDATED_ARCHIVE_ITEMS || []).filter((item) =>
    item.published && !item.duplicateOf
  );
  const traceSetIds = curatedRecordIds;
  const collectionSeen = {};
  const collectionTotals = scanSource.reduce((totals, item) => {
    totals[item.collection] = (totals[item.collection] || 0) + 1;
    return totals;
  }, {});
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
    const cluster = source.collection === "food" ? { x: 500, y: 500, r: 420 }
      : source.collection === "wrappers" ? { x: 1290, y: 360, r: 275 }
        : source.collection === "labels" ? { x: 1370, y: 820, r: 165 }
          : { x: 980, y: 810, r: 255 };
    const radialProgress = Math.sqrt((collectionIndex + 1) / collectionTotals[source.collection]);
    const radius = cluster.r * (0.12 + radialProgress * 0.86);
    const details = collectionDetails[source.collection];
    const curated = curatedRecordDetails[source.id] || {};
    return {
      id: `scan-${source.id.toLowerCase()}`, ref: source.id.replace("-", "–"), title: curated.title || source.title,
      kind: "object", scanned: true, featured, collection: source.collection, materialField: details.materialField,
      imageUrl: scanAssetRoot + source.image,
      thumbnailUrl: scanAssetRoot + source.image.replace("archive-items/", "archive-items/thumbnails/"),
      imagePosition: "50% 50%",
      sourceFile: source.source, sourcePage: source.page,
      date: curated.date || details.date, place: curated.place || details.place, function: details.function, trace: details.trace,
      status: curated.status || source.status, note: details.note, question: details.question,
      observation: details.observation, context: details.context, inference: details.inference,
      x: Math.round(cluster.x + Math.cos(angle) * radius),
      y: Math.round(cluster.y + Math.sin(angle) * radius)
    };
  });

  const records = [...baseRecords, ...scannedRecords];

  const scannedRelations = scannedRecords
    .filter((item) => item.featured)
    .flatMap((item) => collectionDetails[item.collection].terms.map(([target, lens]) => ({ source: item.id, target, lens })));
  const relations = scannedRelations;

  const byId = new Map(records.map((item) => [item.id, item]));
  const elements = new Map();
  const state = {
    scale: 0.72, x: 0, y: 0, view: "grid", lens: "all", collection: "all",
    readingMode: "visible", selected: null, dragging: false, pointerX: 0, pointerY: 0,
    nodeDrag: null, suppressClickId: null, topNodeZ: 20
  };

  const imageUrl = (item) => item.imageUrl;
  const thumbnailUrl = (item) => item.thumbnailUrl || item.imageUrl;

  const loadDeferredImage = (image) => {
    if (!image?.dataset.src) return;
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  const imageObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadDeferredImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { root: field, rootMargin: "520px 260px" })
    : null;

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
    if (item.featured) button.classList.add("archive-node-featured");
    button.dataset.id = item.id;
    button.dataset.index = String(index + 1).padStart(2, "0");
    button.setAttribute("aria-label", `${item.ref}: ${item.title}`);

    if (item.kind === "object") {
      const imageAttributes = item.scanned && !item.featured
        ? `data-src="${thumbnailUrl(item)}"`
        : `src="${thumbnailUrl(item)}"`;
      button.innerHTML = `
        <span class="archive-node-image"><img ${imageAttributes} alt="" draggable="false" loading="lazy" decoding="async" fetchpriority="low" style="object-position:${item.imagePosition}"></span>
        <span class="archive-node-ref">${escapeHtml(item.ref)} / Material record</span>
        <strong>${escapeHtml(item.title)}</strong>
        <span class="archive-node-meta">${escapeHtml(item.date)} · ${escapeHtml(item.status)}</span>
      `;
    } else {
      button.innerHTML = `<strong>${escapeHtml(item.title)}</strong>`;
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (state.suppressClickId === item.id) {
        state.suppressClickId = null;
        return;
      }
      selectNode(item.id);
    });

    button.addEventListener("pointerdown", (event) => {
      if (state.view !== "network" || (event.pointerType === "mouse" && event.button !== 0)) return;
      event.stopPropagation();
      state.topNodeZ += 1;
      button.style.zIndex = String(state.topNodeZ);
      state.nodeDrag = {
        id: item.id,
        pointerId: event.pointerId,
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startNodeX: item.x,
        startNodeY: item.y,
        moved: false
      };
      button.classList.add("is-node-dragging");
      button.setPointerCapture(event.pointerId);
    });

    button.addEventListener("pointermove", (event) => {
      const drag = state.nodeDrag;
      if (!drag || drag.id !== item.id || drag.pointerId !== event.pointerId) return;
      const deltaX = (event.clientX - drag.startPointerX) / state.scale;
      const deltaY = (event.clientY - drag.startPointerY) / state.scale;
      if (Math.hypot(deltaX, deltaY) > 2) drag.moved = true;
      if (!drag.moved) return;
      event.preventDefault();
      item.x = Math.max(8, Math.min(stage.offsetWidth - button.offsetWidth - 8, drag.startNodeX + deltaX));
      item.y = Math.max(8, Math.min(stage.offsetHeight - button.offsetHeight - 8, drag.startNodeY + deltaY));
      button.style.left = `${item.x}px`;
      button.style.top = `${item.y}px`;
      window.requestAnimationFrame(drawRelations);
    });

    const finishNodeDrag = (event) => {
      const drag = state.nodeDrag;
      if (!drag || drag.id !== item.id || drag.pointerId !== event.pointerId) return;
      if (drag.moved && event.type === "pointerup") state.suppressClickId = item.id;
      state.nodeDrag = null;
      button.classList.remove("is-node-dragging");
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      drawRelations();
    };

    button.addEventListener("pointerup", finishNodeDrag);
    button.addEventListener("pointercancel", finishNodeDrag);
    button.addEventListener("dragstart", (event) => event.preventDefault());
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
    const connectedExamples = matching.filter((item) => {
      if (!item.featured) return false;
      if (state.lens === "all") return true;
      return collectionDetails[item.collection].terms.some(([, lens]) => lens === state.lens);
    }).length;
    count.textContent = state.view === "grid"
      ? `Collection field / ${matching.length} working records visible`
      : `Relation field / ${matching.length} records visible / ${connectedExamples} bounded examples linked`;
  };

  const positionNodes = () => {
    document.body.dataset.archiveView = state.view;
    updateStageSize();
    records.forEach((item) => {
      const networkHidden = state.view === "network" && item.scanned && !matchesCollection(item);
      const gridHidden = state.view === "grid" && (item.kind === "term" || !matchesCollection(item));
      const position = state.view === "grid" ? gridPosition(item) : item;
      const element = elements.get(item.id);
      element.hidden = networkHidden || gridHidden;
      const image = element.querySelector("img[data-src]");
      if (!element.hidden && image) {
        if (imageObserver) imageObserver.observe(image);
        else loadDeferredImage(image);
      } else if (element.hidden && image && imageObserver) {
        imageObserver.unobserve(image);
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
      const sourceItem = byId.get(relation.source);
      if (sourceItem?.scanned && !sourceItem.featured && state.selected !== relation.source) return;
      const source = nodeCenter(relation.source);
      const target = nodeCenter(relation.target);
      const connected = !state.selected || relation.source === state.selected || relation.target === state.selected;
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      const middleX = (source.x + target.x) / 2;
      ctx.bezierCurveTo(middleX, source.y, middleX, target.y, target.x, target.y);
      ctx.setLineDash(connected && state.selected ? [5, 4] : [3, 6]);
      ctx.strokeStyle = ["recognition", "value"].includes(relation.lens)
        ? `rgba(135,55,45,${connected ? 0.34 : 0.055})`
        : `rgba(48,75,103,${connected ? 0.28 : 0.045})`;
      ctx.lineWidth = connected && state.selected ? 1.6 : 0.8;
      ctx.stroke();
      ctx.setLineDash([]);
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
    const visibleRelated = item.kind === "term"
      ? [...related].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 24)
      : related;
    const relationButtons = visibleRelated.length
      ? visibleRelated.map((entry) => `<li><button type="button" data-related-id="${entry.id}">${escapeHtml(entry.ref)} — ${escapeHtml(entry.title)}</button></li>`).join("")
      : "<li><button type=\"button\" disabled>No relation under this lens</button></li>";
    const relationSummary = item.kind === "term" && related.length > visibleRelated.length
      ? `<p class="archive-related-summary">${related.length} records enter this working comparison; ${visibleRelated.length} are listed here to keep the field readable.</p>`
      : "";

    if (item.kind === "term") {
      if (recordEvidenceControls) recordEvidenceControls.hidden = true;
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / Provisional term</p>
        <h1>${escapeHtml(item.title)}</h1>
        <span class="archive-record-state">Working term / not historical evidence</span>
        <p>This term opens one temporary route through the material field. A line indicates a proposed comparison only; it does not prove that the objects once shared the same history or use.</p>
        <span class="archive-related-label">Objects temporarily compared through this term</span>
        ${relationSummary}
        <ul class="archive-related-list">${relationButtons}</ul>
      `;
    } else {
      if (recordEvidenceControls) recordEvidenceControls.hidden = false;
      const readingPanels = {
        visible: `
          <div class="archive-reading-panel" data-reading-panel="visible">
            <span class="archive-reading-panel-label">VISIBLE / DIRECT OBSERVATION</span>
            <p>${escapeHtml(item.observation)}</p>
            <dl class="archive-record-data">
              <div><dt>Trace field</dt><dd>${escapeHtml(item.trace)}</dd></div>
              <div><dt>Limit</dt><dd>A visible trace cannot by itself recover who used the object or what that use meant.</dd></div>
            </dl>
          </div>`,
        recorded: `
          <div class="archive-reading-panel" data-reading-panel="recorded">
            <span class="archive-reading-panel-label">RECORDED / PRESENT ARCHIVE</span>
            <p>Only information held by the present working archive is listed here.</p>
            <dl class="archive-record-data">
              <div><dt>Material field</dt><dd>${escapeHtml(materialFieldLabels[item.materialField])}</dd></div>
              <div><dt>Archive status</dt><dd>${escapeHtml(item.status)}</dd></div>
              ${item.sourceFile ? `<div><dt>Scan record</dt><dd>Corpus scan · page ${escapeHtml(item.sourcePage)}</dd></div>` : ""}
            </dl>
            <p class="archive-reading-caution">Material field is a current working placement. It is not a final taxonomy.</p>
          </div>`,
        proposed: `
          <div class="archive-reading-panel archive-reading-panel-proposed" data-reading-panel="proposed">
            <span class="archive-reading-panel-label">PROVISIONAL / RELATION UNDER TEST</span>
            <p>${escapeHtml(item.inference)}</p>
            <dl class="archive-record-data">
              <div><dt>Working route</dt><dd>${escapeHtml(item.function)}</dd></div>
              <div><dt>Status</dt><dd>Artistic research proposition; not yet supported as object-specific historical evidence.</dd></div>
            </dl>
          </div>`,
        unresolved: `
          <div class="archive-reading-panel archive-reading-panel-unresolved" data-reading-panel="unresolved">
            <span class="archive-reading-panel-label">UNRESOLVED / RESEARCH REQUIRED</span>
            <p>${escapeHtml(item.context)}</p>
            <dl class="archive-record-data">
              <div><dt>Date</dt><dd>${escapeHtml(item.date)}</dd></div>
              <div><dt>Place</dt><dd>${escapeHtml(item.place)}</dd></div>
              <div><dt>Still unknown</dt><dd>Object-specific provenance, circulation, handling, and lived relation.</dd></div>
            </dl>
          </div>`
      };
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / Material record</p>
        <h1>${escapeHtml(item.title)}</h1>
        <figure class="archive-record-hero"><img src="${imageUrl(item)}" alt="${escapeHtml(item.title)}" decoding="async" style="object-position:${item.imagePosition}"></figure>
        <span class="archive-record-state">${escapeHtml(item.status)} / working record</span>
        <p>${escapeHtml(item.note)}</p>
        <div class="archive-evidence-key" aria-label="Evidence key">
          <span>Visible</span><span>Recorded</span><span>Provisional</span><span>Unresolved</span>
        </div>
        ${readingPanels[state.readingMode]}
        <p class="archive-record-question">${escapeHtml(item.question)}</p>
        <span class="archive-related-label">Working comparison terms in this view</span>
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
    if (recordEvidenceControls) recordEvidenceControls.hidden = true;
    document.body.classList.remove("is-record-open");
  };

  const applyTransform = () => {
    stage.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
    const zoomLevel = document.querySelector("[data-zoom-level]");
    if (zoomLevel) zoomLevel.textContent = `${Math.round(state.scale * 100)}%`;
  };

  const resetView = () => {
    const bounds = field.getBoundingClientRect();
    const dimensions = updateStageSize();
    if (state.view === "grid") {
      state.scale = 1;
      state.x = 0;
      state.y = 0;
    } else {
      state.scale = Math.max(0.36, Math.min(0.9, Math.min(bounds.width / dimensions.width, bounds.height / dimensions.height) * 0.94));
      state.x = (bounds.width - dimensions.width * state.scale) / 2;
      state.y = (bounds.height - dimensions.height * state.scale) / 2;
    }
    applyTransform();
  };

  const setZoom = (nextScale, clientX, clientY) => {
    const bounds = field.getBoundingClientRect();
    const previous = state.scale;
    state.scale = Math.max(0.32, Math.min(1.45, nextScale));
    const focusX = Number.isFinite(clientX) ? clientX - bounds.left : bounds.width / 2;
    const focusY = Number.isFinite(clientY) ? clientY - bounds.top : bounds.height / 2;
    state.x = focusX - ((focusX - state.x) / previous) * state.scale;
    state.y = focusY - ((focusY - state.y) / previous) * state.scale;
    applyTransform();
  };

  const syncViewControls = () => {
    const gridMode = state.view === "grid";
    field.setAttribute("aria-label", gridMode
      ? "Browse the candidate archive and select an object"
      : "Pan, zoom and rearrange the provisional relation field");
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
    if (state.view === "grid") return;
    event.preventDefault();
    setZoom(state.scale * (event.deltaY > 0 ? 0.9 : 1.1), event.clientX, event.clientY);
  }, { passive: false });

  field.addEventListener("dblclick", (event) => {
    if (state.view !== "network" || event.target.closest("button")) return;
    event.preventDefault();
    setZoom(state.scale * 1.28, event.clientX, event.clientY);
  });

  field.addEventListener("keydown", (event) => {
    if (state.view !== "network") return;
    if (["+", "="].includes(event.key)) {
      event.preventDefault();
      setZoom(state.scale * 1.16);
    }
    if (event.key === "-") {
      event.preventDefault();
      setZoom(state.scale / 1.16);
    }
    if (event.key === "0") {
      event.preventDefault();
      resetView();
    }
  });

  field.addEventListener("pointerdown", (event) => {
    if (state.view !== "network") return;
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
