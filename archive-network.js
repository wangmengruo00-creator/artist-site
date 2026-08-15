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

  const isZh = () => document.documentElement.lang === "zh-CN";
  const bilingual = (english, chinese) => isZh() ? chinese : english;
  const itemText = (item, key) => isZh() && item[`${key}Zh`] ? item[`${key}Zh`] : item[key];

  const baseRecords = [
    { id: "eligibility", ref: "R–01", title: "Eligibility", titleZh: "资格", kind: "term", lens: "access", x: 110, y: 245 },
    { id: "allocation", ref: "R–02", title: "Allocation", titleZh: "分配", kind: "term", lens: "access", x: 390, y: 80 },
    { id: "exchange", ref: "R–03", title: "Exchange", titleZh: "交换", kind: "term", lens: "exchange", x: 765, y: 70 },
    { id: "validity", ref: "R–04", title: "Temporal validity", titleZh: "时间有效性", kind: "term", lens: "exchange", x: 1135, y: 95 },
    { id: "recognition", ref: "R–05", title: "Recognition", titleZh: "识别", kind: "term", lens: "recognition", x: 1540, y: 285 },
    { id: "attraction", ref: "R–06", title: "Attraction", titleZh: "吸引", kind: "term", lens: "recognition", x: 1480, y: 850 },
    { id: "value", ref: "R–07", title: "Value", titleZh: "价值", kind: "term", lens: "value", x: 780, y: 980 }
  ];

  const curatedRecordDetails = {
    "T-001": { title: "Haircut ticket / Jiyuan County / 1977", titleZh: "理发票 / 济源县 / 1977", date: "1977 printed on object", dateZh: "物件上印有1977年", place: "Jiyuan County printed on object", placeZh: "物件上印有济源县", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "T-038": { title: "Jiangxi grain coupon / 1 shi jin / 1978", titleZh: "江西省粮票 / 壹市斤 / 1978", date: "1978 printed on object", dateZh: "物件上印有1978年", place: "Jiangxi Province printed on object", placeZh: "物件上印有江西省", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "T-072": { title: "Henan grain coupon / 20 shi jin / Luoyang", titleZh: "河南省粮票 / 贰拾市斤 / 洛阳", date: "Date not yet verified", dateZh: "日期尚未核实", place: "Henan Province · Luoyang printed on object", placeZh: "物件上印有河南省 · 洛阳", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "T-105": { title: "Jilin local grain coupon / 0.2 shi jin / 1975", titleZh: "吉林省地方粮票 / 贰市两 / 1975", date: "1975 printed on object", dateZh: "物件上印有1975年", place: "Jilin Province printed on object", placeZh: "物件上印有吉林省", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "T-148": { title: "Hunan grain coupon / 0.2 shi jin / 1971", titleZh: "湖南省粮票 / 贰市两 / 1971", date: "1971 printed on object", dateZh: "物件上印有1971年", place: "Hunan Province printed on object", placeZh: "物件上印有湖南省", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "T-185": { title: "Hebei local grain coupon / 1 shi liang / 1971", titleZh: "河北省地方粮票 / 壹市两 / 1971", date: "1971 printed on object", dateZh: "物件上印有1971年", place: "Hebei Province printed on object", placeZh: "物件上印有河北省", status: "Visible text transcribed", statusZh: "可见文字已转录" },
    "W-001": { title: "Fruit hard-candy wrapper / Yichun Food Factory", titleZh: "水果硬糖包装纸 / 宜春食品厂", status: "Brand and producer visible", statusZh: "品牌与生产者可见" },
    "W-030": { title: "Milk-candy wrapper / yellow floral print", titleZh: "奶糖包装纸 / 黄色花纹", status: "Product type visible · producer unresolved", statusZh: "产品类型可见 · 生产者未决" },
    "L-001": { title: "Tonghua red grape wine label / 720 mL", titleZh: "通化红葡萄酒标签 / 720毫升", status: "Product and volume visible", statusZh: "产品与容量可见" },
    "L-006": { title: "Tonghua seasoned grape wine label / 710 mL", titleZh: "通化加香葡萄酒标签 / 710毫升", status: "Product and volume visible", statusZh: "产品与容量可见" },
    "E-001": { title: "Flying Swallow Brand printed label", titleZh: "飞燕牌印刷标签", status: "Brand name visible · commodity unresolved", statusZh: "品牌名可见 · 商品未决" },
    "P-001": { title: "Hope menthol cigarette wrapper / 20", titleZh: "希望牌薄荷烟包装 / 20支", status: "Brand and product type visible", statusZh: "品牌与产品类型可见" }
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

  const collectionDetailsZh = {
    food: {
      date: "日期未决", place: "地区待辨认", function: "分配 / 准入 / 价值",
      trace: "印刷面额；纸张边缘；使用痕迹",
      note: "这张票证先作为一条独立材料记录进入档案。它的日期、地域与实际流通仍需逐件核验。",
      observation: "扫描中可以直接看到印刷面额、纸张边缘、颜色与接触痕迹。",
      context: "它原来的具体功能、日期与地域，仍需要回到单件物件与来源中查证。",
      inference: "仅凭扫描图像，不能推断它曾如何流通，也不能代替使用者的生活经验。",
      question: "当这张票证与其他受规制的纸张并置时，哪些组织关系开始变得可见？"
    },
    wrappers: {
      date: "日期未决", place: "地点待辨认", function: "包装 / 吸引 / 识别",
      trace: "折痕；颜色；薄印刷纸",
      note: "包装纸在这里保持自己的尺度，使颜色、字体与被拿取的记忆不会消失在一堆图像之中。",
      observation: "颜色、字体、折痕与薄印刷纸可以被直接观察。",
      context: "生产者、商品、日期与流通仍需逐件查证。",
      inference: "“吸引”是我正在测试的研究关系，不是已经复原的消费者反应。",
      question: "当商品与用途已经消失，什么仍然继续产生吸引？"
    },
    labels: {
      date: "日期未决", place: "地点待辨认", function: "识别 / 商品图像",
      trace: "裁切边缘；印刷颜色；表面磨损",
      note: "这张标签先被作为一个带有图像的独立物件阅读；它的生产者、日期与流通仍在调查。",
      observation: "裁切边缘、印刷颜色、图像与表面磨损可以被直接观察。",
      context: "生产者、地点、日期以及它与原商品之间的关系仍待记录。",
      inference: "识别与价值只是暂定的分析路径，不是历史结论。",
      question: "一块很小的印刷表面，如何继续组织识别与价值？"
    },
    "misc-a": {
      date: "日期未决", place: "地点待辨认", function: "图像 / 包装 / 识别",
      trace: "印刷表面；裁切边缘；颜色",
      note: "这张印刷图像标签被作为单件物件，而不是扫描页的一部分进入档案；身份仍保持开放。",
      observation: "印刷表面、边缘、颜色与接触痕迹可以被直接观察。",
      context: "来源未决，因此这条记录暂时停留在档案边界。",
      inference: "在研究关系获得支持之前，它是否进入核心材料集仍被保留。",
      question: "在什么条件下，这件物件才应该进入限定材料集？"
    },
    "misc-b": {
      date: "日期未决", place: "地点待辨认", function: "图像 / 包装 / 识别",
      trace: "印刷表面；册页痕迹；接触痕迹",
      note: "这张包装或印刷标签从册页中被分离出来，使图像、字体与材料痕迹可以被独立阅读。",
      observation: "重新扫描后，印刷表面、纸张边缘、颜色与接触痕迹可以被直接观察。",
      context: "身份与来源仍未解决；记录暂时停留在材料集边界。",
      inference: "它与识别或价值的可能关系，在获得查证之前仍只是艺术研究命题。",
      question: "在什么条件下，这件物件才应该进入限定材料集？"
    }
  };

  const genericTitleZh = (source) => ({
    food: "候选票证记录",
    wrappers: "候选包装纸记录",
    labels: "候选商品标签记录",
    "misc-a": "候选印刷物记录",
    "misc-b": "候选印刷物记录"
  })[source.collection] || "候选材料记录";

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
    const detailsZh = collectionDetailsZh[source.collection];
    const curated = curatedRecordDetails[source.id] || {};
    return {
      id: `scan-${source.id.toLowerCase()}`, ref: source.id.replace("-", "–"), title: curated.title || source.title,
      titleZh: curated.titleZh || genericTitleZh(source),
      kind: "object", scanned: true, featured, collection: source.collection, materialField: details.materialField,
      imageUrl: scanAssetRoot + source.image,
      thumbnailUrl: scanAssetRoot + source.image.replace("archive-items/", "archive-items/thumbnails/"),
      imagePosition: "50% 50%",
      sourceFile: source.source, sourcePage: source.page,
      date: curated.date || details.date, place: curated.place || details.place, function: details.function, trace: details.trace,
      status: curated.status || source.status, note: details.note, question: details.question,
      observation: details.observation, context: details.context, inference: details.inference,
      dateZh: curated.dateZh || detailsZh.date, placeZh: curated.placeZh || detailsZh.place,
      functionZh: detailsZh.function, traceZh: detailsZh.trace,
      statusZh: curated.statusZh || "候选数字记录 · 待逐件核对", noteZh: detailsZh.note,
      questionZh: detailsZh.question, observationZh: detailsZh.observation,
      contextZh: detailsZh.context, inferenceZh: detailsZh.inference,
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
    regulated: ["Tickets and vouchers", "票证"],
    commodity: ["Wrappers and labels", "包装纸与标签"],
    peripheral: ["Other printed matter / awaiting research", "其他印刷物 / 等待研究"]
  };

  const renderNodeContents = (button, item) => {
    const title = itemText(item, "title");
    button.setAttribute("aria-label", `${item.ref}: ${title}`);
    if (item.kind === "object") {
      const existingImage = button.querySelector("img");
      const imageAttributes = existingImage
        ? `${existingImage.dataset.src ? `data-src="${existingImage.dataset.src}"` : `src="${existingImage.src}"`}`
        : item.scanned && !item.featured
          ? `data-src="${thumbnailUrl(item)}"`
          : `src="${thumbnailUrl(item)}"`;
      button.innerHTML = `
        <span class="archive-node-image"><img ${imageAttributes} alt="" draggable="false" loading="lazy" decoding="async" fetchpriority="low" style="object-position:${item.imagePosition}"></span>
        <span class="archive-node-ref">${escapeHtml(item.ref)} / ${bilingual("Material record", "材料记录")}</span>
        <strong>${escapeHtml(title)}</strong>
        <span class="archive-node-meta">${escapeHtml(itemText(item, "date"))} · ${escapeHtml(itemText(item, "status"))}</span>
      `;
    } else {
      button.innerHTML = `<strong>${escapeHtml(title)}</strong>`;
    }
  };

  const makeNode = (item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `archive-node archive-node-${item.kind}`;
    if (item.scanned) button.classList.add("archive-node-scanned");
    if (item.featured) button.classList.add("archive-node-featured");
    button.dataset.id = item.id;
    button.dataset.index = String(index + 1).padStart(2, "0");
    renderNodeContents(button, item);

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
      ? bilingual(`Collection field / ${matching.length} working records visible`, `材料场 / 当前可见${matching.length}条工作记录`)
      : bilingual(
        `Relation field / ${matching.length} records visible / ${connectedExamples} bounded examples linked`,
        `关系场 / 当前可见${matching.length}条记录 / ${connectedExamples}件重点物件带有连线`
      );
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
      ? visibleRelated.map((entry) => `<li><button type="button" data-related-id="${entry.id}">${escapeHtml(entry.ref)} — ${escapeHtml(itemText(entry, "title"))}</button></li>`).join("")
      : `<li><button type="button" disabled>${bilingual("No relation under this lens", "当前阅读关系下没有连线")}</button></li>`;
    const relationSummary = item.kind === "term" && related.length > visibleRelated.length
      ? `<p class="archive-related-summary">${bilingual(
        `${related.length} records enter this working comparison; ${visibleRelated.length} are listed here to keep the field readable.`,
        `${related.length}条记录进入这次工作比较；这里只列出${visibleRelated.length}条，以保持材料场可读。`
      )}</p>`
      : "";

    if (item.kind === "term") {
      if (recordEvidenceControls) recordEvidenceControls.hidden = true;
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / ${bilingual("Provisional term", "暂定关系词")}</p>
        <h1>${escapeHtml(itemText(item, "title"))}</h1>
        <span class="archive-record-state">${bilingual("Working term / not historical evidence", "工作关系词 / 不是历史证据")}</span>
        <p>${bilingual(
          "This term opens one temporary route through the material field. A line indicates a proposed comparison only; it does not prove that the objects once shared the same history or use.",
          "这个关系词只是在材料场中打开一条暂时路径。连线表示我正在提出一种比较，不证明这些物件曾经共享同一段历史或用途。"
        )}</p>
        <span class="archive-related-label">${bilingual("Objects temporarily compared through this term", "通过这个关系词暂时并置的物件")}</span>
        ${relationSummary}
        <ul class="archive-related-list">${relationButtons}</ul>
      `;
    } else {
      if (recordEvidenceControls) recordEvidenceControls.hidden = false;
      const readingPanels = {
        visible: `
          <div class="archive-reading-panel" data-reading-panel="visible">
            <span class="archive-reading-panel-label">${bilingual("VISIBLE / DIRECT OBSERVATION", "可见 / 直接观察")}</span>
            <p>${escapeHtml(itemText(item, "observation"))}</p>
            <dl class="archive-record-data">
              <div><dt>${bilingual("Trace field", "痕迹范围")}</dt><dd>${escapeHtml(itemText(item, "trace"))}</dd></div>
              <div><dt>${bilingual("Limit", "边界")}</dt><dd>${bilingual("A visible trace cannot by itself recover who used the object or what that use meant.", "可见痕迹本身不能复原谁曾使用它，也不能说明那次使用对人意味着什么。")}</dd></div>
            </dl>
          </div>`,
        recorded: `
          <div class="archive-reading-panel" data-reading-panel="recorded">
            <span class="archive-reading-panel-label">${bilingual("RECORDED / PRESENT ARCHIVE", "已记录 / 当前工作档案")}</span>
            <p>${bilingual("Only information held by the present working archive is listed here.", "这里只列出当前工作档案能够支持的信息。")}</p>
            <dl class="archive-record-data">
              <div><dt>${bilingual("Material field", "材料范围")}</dt><dd>${escapeHtml(materialFieldLabels[item.materialField][isZh() ? 1 : 0])}</dd></div>
              <div><dt>${bilingual("Archive status", "档案状态")}</dt><dd>${escapeHtml(itemText(item, "status"))}</dd></div>
              ${item.sourceFile ? `<div><dt>${bilingual("Scan record", "扫描记录")}</dt><dd>${bilingual("Corpus scan", "材料集扫描")} · ${bilingual("page", "页")} ${escapeHtml(item.sourcePage)}</dd></div>` : ""}
            </dl>
            <p class="archive-reading-caution">${bilingual("Material field is a current working placement. It is not a final taxonomy.", "材料范围只是当前工作中的位置，不是最终分类法。")}</p>
          </div>`,
        proposed: `
          <div class="archive-reading-panel archive-reading-panel-proposed" data-reading-panel="proposed">
            <span class="archive-reading-panel-label">${bilingual("PROVISIONAL / RELATION UNDER TEST", "暂定 / 正在测试的关系")}</span>
            <p>${escapeHtml(itemText(item, "inference"))}</p>
            <dl class="archive-record-data">
              <div><dt>${bilingual("Working route", "工作路径")}</dt><dd>${escapeHtml(itemText(item, "function"))}</dd></div>
              <div><dt>${bilingual("Status", "状态")}</dt><dd>${bilingual("Artistic research proposition; not yet supported as object-specific historical evidence.", "艺术研究命题；尚未获得这件物件自身的历史证据支持。")}</dd></div>
            </dl>
          </div>`,
        unresolved: `
          <div class="archive-reading-panel archive-reading-panel-unresolved" data-reading-panel="unresolved">
            <span class="archive-reading-panel-label">${bilingual("UNRESOLVED / RESEARCH REQUIRED", "未决 / 仍需研究")}</span>
            <p>${escapeHtml(itemText(item, "context"))}</p>
            <dl class="archive-record-data">
              <div><dt>${bilingual("Date", "日期")}</dt><dd>${escapeHtml(itemText(item, "date"))}</dd></div>
              <div><dt>${bilingual("Place", "地点")}</dt><dd>${escapeHtml(itemText(item, "place"))}</dd></div>
              <div><dt>${bilingual("Still unknown", "仍然未知")}</dt><dd>${bilingual("Object-specific provenance, circulation, handling, and lived relation.", "这件物件的具体来源、流通、接触方式，以及它与日常生活的关系。")}</dd></div>
            </dl>
          </div>`
      };
      recordContent.innerHTML = `
        <p class="archive-record-kicker">${escapeHtml(item.ref)} / ${bilingual("Material record", "材料记录")}</p>
        <h1>${escapeHtml(itemText(item, "title"))}</h1>
        <figure class="archive-record-hero"><img src="${imageUrl(item)}" alt="${escapeHtml(itemText(item, "title"))}" decoding="async" style="object-position:${item.imagePosition}"></figure>
        <span class="archive-record-state">${escapeHtml(itemText(item, "status"))} / ${bilingual("working record", "工作记录")}</span>
        <p>${escapeHtml(itemText(item, "note"))}</p>
        <div class="archive-evidence-key" aria-label="Evidence key">
          <span>${bilingual("Visible", "可见")}</span><span>${bilingual("Recorded", "已记录")}</span><span>${bilingual("Provisional", "暂定关系")}</span><span>${bilingual("Unresolved", "未决")}</span>
        </div>
        ${readingPanels[state.readingMode]}
        <p class="archive-record-question">${escapeHtml(itemText(item, "question"))}</p>
        <span class="archive-related-label">${bilingual("Working comparison terms in this view", "当前视图中的工作比较关系词")}</span>
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
      ? bilingual("Browse the candidate archive and select an object", "浏览候选档案并选择一件物件")
      : bilingual("Pan, zoom and rearrange the provisional relation field", "平移、缩放并重排暂定关系场"));
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

  let renderedLanguage = document.documentElement.lang;
  const languageObserver = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => mutation.attributeName === "lang")) return;
    if (renderedLanguage === document.documentElement.lang) return;
    renderedLanguage = document.documentElement.lang;
    records.forEach((item) => renderNodeContents(elements.get(item.id), item));
    syncViewControls();
    positionNodes();
    if (state.selected) renderRecord(byId.get(state.selected));
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  syncViewControls();
  positionNodes();
  resetView();
})();
