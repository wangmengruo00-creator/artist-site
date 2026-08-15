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
  const lensLabelsZh = { preserved: "保留", altered: "改变", omitted: "遗漏", reconstructed: "重建" };
  const groupLabelsZh = {
    "machine-failure": "机器读取失效",
    "visual-outlier": "视觉离群",
    "positive-control": "正向对照",
    "boundary-case": "边界案例"
  };
  const zhRecords = {
    "T-027": {
      visible: "一张褪色、纵向排版的印刷票证。大号竖排面额仍可见，但较小的发行者与日期无法从当前扫描中可靠辨认。",
      preserved: "视觉模型保留了深色、纵向、有边框的形式，并把它与相似版式的票证归为邻近。",
      altered: "机器没有提出文字转录，于是这件印刷物被缩减为颜色、边框密度与版式特征。",
      omitted: "文字、纵向阅读方向、面额、印章与老化痕迹都没有进入OCR记录。",
      reconstructed: "它与其他记录的关系完全由颜色、边框密度与格式建立，而不是由文字意义建立。",
      assessment: "具有研究意义的遗漏",
      nextAction: "重新扫描，或旋转、裁切后再做一次OCR；同时保留这次失败，作为方向与褪色偏差的证据。"
    },
    "T-001": {
      visible: "一张棕色服务票证，上方为发行者文字，中间可见“理发票”，底部有日期行，星形装饰围成边框。",
      preserved: "OCR保留了“理发票”，也保留了发行者与日期结构的一些碎片。",
      altered: "发行者与日期的大部分内容被转成错误且重复的字符。",
      omitted: "图形标志、边框纹样、纸张色调，以及装饰与文字之间的区别没有被描述。",
      reconstructed: "装饰星形与退化印刷似乎被读成了重复语言，由此制造出物件上并不存在的文字。",
      assessment: "核心词被保留；装饰被误读成文字",
      nextAction: "人工转录发行者与日期；另做一张排除装饰边框的OCR裁切进行比较。"
    },
    "T-024": {
      visible: "一张包含多张重叠纸币的照片，而不是一件被单独分离的物件。上方纸币可见“中国人民银行”“壹分”与“一九五三年”。",
      preserved: "OCR检测到三个文字区域，并大致保留了面额结构。",
      altered: "原本相对清楚的纸币文字仍被大量误识别。",
      omitted: "多张纸币彼此重叠这一事实，以及纸币上的车辆图像都没有被记录。",
      reconstructed: "处理流程把整张照片当成一条档案记录，尽管其中显然包含数件实物。",
      assessment: "分割失效与文字识别失效同时发生",
      nextAction: "标记为多物件图像；在提出任何目录判断前，先拆分为逐件裁切与独立编号。"
    },
    "T-054": {
      visible: "贵州省地方粮票，拾市斤；面额下方印有1977，右侧带建筑图像。",
      preserved: "省份与面额被保留下来。",
      altered: "“粮票”被读成“積票”。",
      omitted: "可见年份1977与建筑图像没有被提取。",
      reconstructed: "关键物件类型被改写后，关键词分类器没有提出粮票类别，尽管其他证据仍然支持。",
      assessment: "一个字的错误改变了分类",
      nextAction: "核验年份并加入人工修正，但不覆盖原始OCR字符串。"
    },
    "T-075": {
      visible: "同一张照片至少包含两张不同面额、颜色与日期的黑龙江省粮票。",
      preserved: "OCR识别出“黑龙江省粮票”，也提取了来自两件物件的部分面额与数字。",
      altered: "多个单位与日期字符识别错误。",
      omitted: "两张实物票证之间的边界，以及透明收纳套没有被编码。",
      reconstructed: "不同物件的文字被合并为一条机器记录，制造出错误的数字组合。",
      assessment: "多件物件被合并",
      nextAction: "建立独立裁切与编号，同时保留这张来源图像，记录收藏与存放状态。"
    },
    "T-006": {
      visible: "一张高饱和绿色票证，发行者为许昌市食品总厂，“壹分”为主要面额，中间带食物相关图形。",
      preserved: "“壹分”被正确读取。",
      altered: "发行者文字严重失真。",
      omitted: "图形标志，以及红字与绿底之间的视觉关系没有被描述。",
      reconstructed: "它成为材料集中最强的视觉离群点，却因版式与色彩结构近似而与T-007配对。",
      assessment: "视觉配对有效；语义读取较弱",
      nextAction: "把T-006与T-007作为视觉系列识别的测试，不把邻近关系当成共享来源的证明。"
    },
    "T-007": {
      visible: "一张高饱和蓝色票证，发行者为许昌市食品总厂，“叁分”为主要面额，中间图形与T-006相同。",
      preserved: "“叁分”被正确读取。",
      altered: "尽管视觉上可与T-006比较，发行者文字仍被读乱。",
      omitted: "由重复版式与图形建立的系列关系没有被OCR命名。",
      reconstructed: "视觉模型把T-006识别为最近邻；两者同时又是更大材料集中的离群记录。",
      assessment: "形式关系强；历史关系尚未核实",
      nextAction: "比较发行者、尺寸与背面后，再判断两者是否属于同一发行系列。"
    },
    "T-137": {
      visible: "一张工农兵晶体管收音机购货券，带毛主席语录、收音机图像、点阵底纹及“盖章有效／过期作废”。",
      preserved: "语录的大部分内容、“工农兵”“收音机”与有效期说明被检测到。",
      altered: "“晶体管”及语录中的多个字被误读。",
      omitted: "醒目的物件类型“购货券”没有进入OCR输出，收音机图像也没有被语义记录。",
      reconstructed: "机器突出意识形态上显眼的文字，却漏掉较小但在功能上关键的分类词。",
      assessment: "机器的阅读层级不同于物件功能",
      nextAction: "把物件功能与意识形态文字分开记录为两层证据。"
    },
    "T-089": {
      visible: "淄博市细粮票，贰仟伍佰克（2.5公斤），1991年，带火车图像。",
      preserved: "发行者、粮票类型、主要面额与年份大体被保留。",
      altered: "括号中的公制数值被读乱。",
      omitted: "火车图像及其可能指向的地区现代化叙事不在OCR记录中。",
      reconstructed: "文字意义相对清楚的物件仍被标记为视觉异常，显示语义相似与形式相似之间的冲突。",
      assessment: "OCR较强；视觉聚类适配较弱",
      nextAction: "让语义分组与视觉分组保持并行，不把两者压成同一分类。"
    },
    "T-132": {
      visible: "一张风景入场券，四字标题使用较旧的阅读方向排列，票价“伍元”清晰可见。",
      preserved: "四个标题字与“票价伍元”被检测到。",
      altered: "OCR按字符在图像中的从左到右顺序读取；历史上的预期读法可能是从右到左。",
      omitted: "阅读方向、风景图像与上方露出的相邻票证都没有被编码。",
      reconstructed: "空间转录被转化为一种语言顺序，说明OCR的方向判断并不中立。",
      assessment: "阅读方向发生冲突",
      nextAction: "查证标题的历史读法，并把空间顺序与解释后的阅读顺序分开保存。"
    },
    "T-103": {
      visible: "吉林省地方粮票，叁市斤，1975年，带建筑与车辆图像。",
      preserved: "发行者、物件类型与面额被准确转录。",
      altered: "核心提取文字中没有明显改变。",
      omitted: "可见年份1975与图像没有进入OCR摘要。",
      reconstructed: "高OCR置信度容易制造“已经完整”的感觉，尽管清楚可见的日期仍然缺席。",
      assessment: "核心准确，但记录不完整",
      nextAction: "作为正向对照保留，同时仍需人工核验被遗漏的字段。"
    },
    "T-118": {
      visible: "上海市粮食局鲜蛋饲料票，1992年，宝山区，50公斤，带年内使用／过期作废说明与印章。",
      preserved: "主要文字、地点、日期、数量与有效期说明被准确保留。",
      altered: "核心OCR字符串没有明显改变。",
      omitted: "印章、图像、纸张磨损及其作为后期材料痕迹的状态没有被区分。",
      reconstructed: "OCR把印刷与盖章放进同一文字流，压平了不同写入时刻。",
      assessment: "转录较强；时间层次被压平",
      nextAction: "把印刷制度记录与盖章、后期材料痕迹分层保存。"
    },
    "T-120": {
      visible: "梅溪区供销社煤油供应证，一九七八年，月份栏未填写。",
      preserved: "发行者、物件类型与中文数字年份被准确保留，并被标准化为1978。",
      altered: "核心读取没有明显字符错误。",
      omitted: "空白月份栏没有被表示为一种证据性缺席。",
      reconstructed: "机器记录了“月”这个标签，却没有记录月份没有填写这一有意义的状态。",
      assessment: "文字被保留；空白状态丢失",
      nextAction: "把已填／未填状态作为材料阅读注释加入，而不是作为OCR文字。"
    },
    "T-122": {
      visible: "一张2001年总后勤部物资油料部军用柴油票，壹拾升，带可拆存根、车辆栏、序列号与盖章区。",
      preserved: "物件类型、发行机构、数量、年份、序列号与多数表格字段被保留。",
      altered: "“清票专用章”可能混合了印刷与盖章区域；文字顺序跟随OCR检测，而非表格层级。",
      omitted: "齿孔、存根拆分逻辑与空白车辆栏没有被表示。",
      reconstructed: "一张结构化操作表单被转换为扁平的文字行序列。",
      assessment: "OCR较强；表单逻辑被压平",
      nextAction: "把存根／正文、空白／填写状态与序列号重复建模为结构关系。"
    },
    "T-083": {
      visible: "淄博市粗粮票，伍佰克（壹市斤），1990年，带农业机械图像。",
      preserved: "发行者、票证类型与“伍佰克”被保留。",
      altered: "“壹市斤”被读成“壹市厅”。",
      omitted: "可见年份1990与农业图像没有被提取。",
      reconstructed: "单字替换把计量单位变成非单位，而整条记录仍保持较高置信度。",
      assessment: "高置信度的单位错误",
      nextAction: "加入单位词表核验，并把高置信度字符串与允许的计量形式比较。"
    },
    "T-012": {
      visible: "北京地下铁道换乘车票，用于1、2号线换乘，报销金额伍元，序号039457，带列车／车站图像。",
      preserved: "主要票证类型、北京、换乘功能、金额与序列号被保留。",
      altered: "小字说明中的多个字符识别错误。",
      omitted: "列车／车站图像、污渍，以及主票与蓝色副券区域之间的区别没有被完整描述。",
      reconstructed: "关键词协议正确提出交通类别，而视觉聚类依据的是浅色版式，不是移动功能。",
      assessment: "功能类别正确；小字部分错误",
      nextAction: "让功能关键词分类与视觉相似性保持分开。"
    },
    "T-008": {
      visible: "文化宫电影院入场券，单号，25排17座，编号311，乙3，带“当场有效／残票作废”与副券。",
      preserved: "电影院、入场功能、编号、有效性说明与副券大体被保留。",
      altered: "座位信息中的“排”被误读，有效性说明中也有一个字发生改变。",
      omitted: "狭长竖向格式、红黑层级与纸张撕裂状态没有被语义记录。",
      reconstructed: "入场类别有用，但OCR行序无法复现票证如何引导读者从场所、座位走向有效性。",
      assessment: "物件识别较好；阅读顺序被压平",
      nextAction: "人工确认后，把场所、座位、序列号与有效性拆成独立字段。"
    },
    "T-047": {
      visible: "巢湖市定点油票，贰佰伍拾克（半市斤），一九九〇年，带食用油容器图像。",
      preserved: "发行者、物件类型、两套数量单位与中文数字年份被准确保留并标准化。",
      altered: "核心读取没有明显改变。",
      omitted: "图像与装饰性防伪纹样没有被表示。",
      reconstructed: "关键词分类提出商品／配给类别，却不能区分分配规则、商品类型与兑换语境。",
      assessment: "较强的正向对照",
      nextAction: "作为参照记录，用于测试较低质量扫描中的单位与日期提取。"
    },
    "T-094": {
      visible: "郫县猪肉票，贰市斤，1979年，带绿色风景／农业图像与红色印章。",
      preserved: "物件类型与面额被准确保留。",
      altered: "短OCR字符串中没有明显改变。",
      omitted: "可见年份、印章、图像与材料状态都没有进入记录。",
      reconstructed: "一段简短而准确的文字可能显得完整，但物件大部分时间与材料证据仍然不可读。",
      assessment: "文字准确，但材料读取很薄",
      nextAction: "把日期、印章与保存状态作为独立人工复核的证据字段。"
    },
    "T-002": {
      visible: "江苏省结婚补助棉胎专用券，高邮，1983年，中间有大型双喜字与官方印章。",
      preserved: "主要文字、地点与年份大体被保留。",
      altered: "重复出现的小字被读成“江惹省／絮椲票／臺用華”等错误文字。",
      omitted: "中央双喜符号、印章，以及婚姻所限定的资格条件没有被当前关键词协议捕捉。",
      reconstructed: "规则没有包含“棉胎”或“结婚补助”，因此一条相对准确的OCR记录没有获得候选类别。",
      assessment: "不是OCR失败，而是分类体系遗漏",
      nextAction: "不要只增加关键词；先判断“资格发生的场合”是否应成为独立分类维度。"
    }
  };
  const isZh = () => document.documentElement.lang === "zh-CN";
  const recordText = (record, key) => isZh() && zhRecords[record.id]?.[key] ? zhRecords[record.id][key] : record[key];
  const corpusStatus = (status) => isZh()
    ? status.replace("Included in 20-record draft comparison", "已进入20条比较草案").replace("Candidate record / artist validation pending", "候选记录 / 待艺术家复核")
    : status;
  let selected = records[0];
  let lens = "preserved";
  let filter = "all";

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[character]);

  const renderStage = () => {
    elements.id.textContent = selected.id.replace("-", "–");
    elements.group.textContent = isZh() ? groupLabelsZh[selected.group] : groupLabels[selected.group];
    elements.image.src = selected.image;
    elements.image.alt = isZh() ? `${selected.id}，当前纸质记录` : `${selected.id}, selected paper record`;
    elements.assessment.textContent = recordText(selected, "assessment");
    elements.confidence.textContent = selected.confidence.toFixed(3);
    elements.cluster.textContent = String(selected.cluster).padStart(2, "0");
    elements.visible.textContent = recordText(selected, "visible");
    elements.machine.textContent = isZh() && selected.machine === "No text detected" ? "未检测到文字" : selected.machine;
    elements.lensNumber.textContent = `${lensNumbers[lens]} / ${isZh() ? lensLabelsZh[lens] : lens.toUpperCase()}`;
    elements.lensOutput.textContent = recordText(selected, lens);
    elements.next.textContent = recordText(selected, "nextAction");
    document.querySelectorAll(".machine-reading-card").forEach((card) => {
      card.classList.toggle("is-selected", card.dataset.id === selected.id);
    });
  };

  const renderReviewGrid = () => {
    grid.replaceChildren();
    records.forEach((record) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "machine-reading-card";
      card.dataset.id = record.id;
      card.dataset.group = record.group;
      card.hidden = filter !== "all" && record.group !== filter;
      card.innerHTML = `
        <figure><img src="${escapeHtml(record.image)}" alt="" loading="lazy" decoding="async"></figure>
        <div>
          <span>${escapeHtml(record.id.replace("-", "–"))} / ${escapeHtml(isZh() ? groupLabelsZh[record.group] : groupLabels[record.group])}</span>
          <strong>${escapeHtml(recordText(record, "assessment"))}</strong>
          <small>OCR ${record.confidence.toFixed(3)} · ${isZh() ? "聚类" : "CLUSTER"} ${String(record.cluster).padStart(2, "0")}</small>
        </div>
      `;
      card.addEventListener("click", () => {
        selected = record;
        renderStage();
        document.querySelector(".machine-reading-stage")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      grid.append(card);
    });
  };

  const corpusGrid = document.querySelector("[data-corpus-grid]");
  const renderCorpusGrid = () => {
    if (!corpusGrid) return;
    corpusGrid.replaceChildren();
    corpus.forEach((record) => {
      const item = document.createElement(record.reviewed ? "button" : "figure");
      if (record.reviewed) item.type = "button";
      item.className = `machine-reading-corpus-item${record.reviewed ? " is-reviewed" : ""}`;
      item.dataset.id = record.id;
      item.innerHTML = `
        <img src="${escapeHtml(record.image)}" alt="" loading="lazy" decoding="async">
        <figcaption><strong>${escapeHtml(record.id.replace("-", "–"))}</strong><span>${escapeHtml(corpusStatus(record.status))}</span></figcaption>
      `;
      if (record.reviewed) {
        item.setAttribute("aria-label", isZh() ? `打开${record.id}的比较草案` : `Open draft comparison for ${record.id}`);
        item.addEventListener("click", () => {
          selected = records.find((candidate) => candidate.id === record.id) || selected;
          renderStage();
          document.querySelector("#diagnostic-reading")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      corpusGrid.append(item);
    });
  };

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
      filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
      document.querySelectorAll(".machine-reading-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.group !== filter;
      });
    });
  });

  let renderedLanguage = document.documentElement.lang;
  const languageObserver = new MutationObserver((mutations) => {
    if (!mutations.some((mutation) => mutation.attributeName === "lang")) return;
    if (renderedLanguage === document.documentElement.lang) return;
    renderedLanguage = document.documentElement.lang;
    renderReviewGrid();
    renderCorpusGrid();
    renderStage();
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  renderReviewGrid();
  renderCorpusGrid();
  renderStage();
})();
