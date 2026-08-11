(() => {
  const translations = new Map(Object.entries({
    ...(window.mengruoAutoTranslations || {}),
    "Works": "作品",
    "About": "关于",
    "Practice": "实践",
    "Profile": "个人简介",
    "Materials": "材料",
    "Processes": "工作方法",
    "Methods": "研究方法",
    "Current themes": "当前主题",
    "Contact": "联系",
    "For correspondence": "联系与交流",
    "Email": "邮箱",
    "Location": "所在地",
    "Shenzhen / Hong Kong": "深圳 / 香港",
    "Back to Works": "返回作品",
    "Back to Early Printed Matter": "返回早期印刷物",
    "Previous project / 01": "上一个项目 / 01",
    "Previous project / 02": "上一个项目 / 02",
    "Previous project / 03": "上一个项目 / 03",
    "Previous project / 04": "上一个项目 / 04",
    "Previous project / E01": "上一个项目 / E01",
    "Previous project / E02": "上一个项目 / E02",
    "Previous project / E03": "上一个项目 / E03",
    "Previous project / E05": "上一个项目 / E05",
    "Next project / 03": "下一个项目 / 03",
    "Next project / 04": "下一个项目 / 04",
    "Next project / 02": "下一个项目 / 02",
    "Next project / E03": "下一个项目 / E03",
    "Next project / E04": "下一个项目 / E04",
    "Next project / E05": "下一个项目 / E05",
    "Next project / E06": "下一个项目 / E06",
    "Project index": "作品索引",
    "All Works": "全部作品",
    "Project": "项目",
    "Year": "年份",
    "Size": "尺寸",
    "Medium": "媒介",
    "Type": "类型",
    "Documentation": "文献记录",
    "PROCESS": "过程",
    "Close": "关闭",
    "The Bureau of Invalidated Tickets": "失效票证管理局",
    "The Three Metamorphoses": "精神三变",
    "Skin of Writing": "皮相 / 笔象",
    "← The Bureau of Invalidated Tickets": "← 失效票证管理局",
    "← The Three Metamorphoses": "← 精神三变",
    "← Skin of Writing": "← 皮相 / 笔象",
    "← Beijing Orders": "← 北京秩序",
    "The Three Metamorphoses →": "精神三变 →",
    "Beijing Orders →": "北京秩序 →",
    "Skin of Writing →": "皮相 / 笔象 →",
    "After Use": "《使用之后》",

    "Practice-based artist and researcher": "实践型艺术家与研究者",
    "Working across printed matter, material traces, embodied writing, and responsive systems of reading.": "我的创作横跨印刷物、材料痕迹、具身书写与响应式阅读系统。",
    "Enter selected works": "进入精选作品",
    "Selected practice · 2016—2026": "精选实践 · 2016—2026",

    "My practice begins with materials that have passed through systems of use: old tickets, commodity labels and wrappers, practice papers, and other forms of everyday printed matter.": "我的实践始于那些曾经进入使用系统的材料：旧票券、商品标签与包装纸、练习用纸，以及其他日常印刷物。",
    "Alongside these materials, I work with artist-book structures and responsive interfaces. I am drawn to folds, stains, corrections, handwriting, numbers, stamps, and classifications—the traces through which former conditions of use remain partially perceptible.": "除这些材料外，我也使用艺术家书结构与响应式界面。我关注折痕、污渍、修改、手写、数字、印章与分类——正是通过这些痕迹，材料过去的使用条件仍能被部分感知。",
    "I collect, document, scan, classify, regroup, reprint, layer, cut, fold, bind, and test these materials. Rather than treating them only as historical documents or visual artefacts, I use material and spatial transformation to trace the organising relations they once enacted: recognition, value, eligibility, quantity, location, time, allocation, and exchange.": "我对这些材料进行收集、记录、扫描、分类、重新组合、再印刷、叠置、切割、折叠、装订与测试。我并不只把它们视为历史文献或视觉物件，而是通过材料与空间的转化，追踪它们曾经施行的组织关系：识别、价值、资格、数量、地点、时间、分配与交换。",
    "My current research,": "我目前的研究",
    ", focuses on twentieth-century Chinese paper ephemera, provisionally grouped as commodity labels and wrappers, and ration coupons and exchange or supply vouchers. It asks what happens to organising relations after the systems that enacted them cease to operate, and how practice-based artistic research can trace and translate them without presenting interpretation as historical fact.": "聚焦于二十世纪中国的纸质易逝品，暂分为商品标签与包装纸，以及粮票、兑换券或供应券两组。研究关注：当施行这些关系的系统停止运作后，组织关系会发生什么；实践型艺术研究又如何在不把阐释冒充为历史事实的前提下，对其进行追踪与转译。",
    "The research moves from material residue and evidential interpretation through artistic translation toward experimental re-operation. Algorithmic mediation remains a conditional method rather than a predetermined outcome: it is retained only where it meaningfully changes decision-making, participation, access, feedback, or the operation of a selected relation.": "研究从材料残留与证据性阐释出发，经由艺术转译，走向实验性的重新运作。算法中介是一种有条件的方法，而非预设结果：只有当它能切实改变决策、参与、准入、反馈或某一关系的运作方式时，才会被保留。",
    "AFTER USE / FIELD 01": "《使用之后》/ 场域 01",
    "Working corpus": "工作语料库",
    "Material field in process": "整理中的材料场",
    "Commodity wrappers, tickets, vouchers, and supporting records arranged for observation and comparison.": "为观察与比较而整理的商品包装、票券、凭证与辅助记录。",
    "Ration coupons, exchange and supply vouchers, commodity labels and wrappers, practice papers, ink, handmade paper, and responsive interfaces.": "粮票、兑换券与供应券、商品标签与包装纸、练习用纸、墨、手工纸和响应式界面。",
    "Collecting, provenance and contextual research, documenting, scanning, classifying, regrouping, reprinting, layering, cutting, folding, binding, spatial configuration, and rule-based prototyping.": "收集、来源与语境研究、记录、扫描、分类、重新组合、再印刷、叠置、切割、折叠、装订、空间配置与基于规则的原型测试。",
    "Questions within the practice": "实践中的问题",
    "What happens to the organising relations once enacted through obsolete paper-based systems after those systems cease to operate?": "当已经失效的纸质系统停止运作后，它们曾经施行的组织关系会发生什么？",
    "How can material, spatial, and embodied artistic processes translate these relations into contemporary encounters without presenting artistic interpretation as historical fact?": "材料、空间与具身的艺术过程，如何在不把艺术阐释呈现为历史事实的前提下，将这些关系转译为当代遭遇？",
    "Under what conditions can selected relations be translated into operational digital or algorithmically mediated environments, and how might they reshape access, choices, and actions?": "在何种条件下，选定的关系可以被转译进可运作的数字或算法中介环境？它们又可能如何重塑准入、选择与行动？",
    "Practice-based research": "实践型研究",
    "Research framework": "研究框架",
    "Corpus construction and evidential protocol": "语料库建构与证据规范",
    "Contextual tracing and diagnostic reading": "语境追踪与诊断式阅读",
    "Material, spatial, and embodied translation": "材料、空间与具身转译",
    "Experimental testing of algorithmic mediation": "算法中介的实验性测试",
    "Documentation, comparative analysis, and ethics": "记录、比较分析与伦理",
    "Obsolete paper-based systems and organising relations": "失效纸质系统与组织关系",
    "Commodity presentation, recognition, and value": "商品呈现、识别与价值",
    "Regulated access, allocation, and exchange": "受规制的准入、分配与交换",
    "Evidential responsibility and artistic translation": "证据责任与艺术转译",
    "Participation, agency, feedback, and possible emergence": "参与、能动性、反馈与可能的涌现",

    "Practice-based Research": "实践型研究",
    "Research": "研究",
    "Research Statement": "研究陈述",
    "is a practice-based inquiry into what happens to the organising relations once enacted through obsolete paper-based systems after those systems cease to operate. It asks how these relations can be traced and translated into contemporary perceptual and operational conditions without presenting artistic interpretation as historical fact.": "是一项实践型研究，关注当失效纸质系统停止运作后，它们曾经施行的组织关系会发生什么。研究探讨如何在不把艺术阐释呈现为历史事实的前提下，将这些关系追踪并转译至当代的感知与运作条件中。",
    "Current Research Questions": "当前研究问题",
    "What happens to organising relations after the paper systems that enacted them cease to operate?": "当施行这些关系的纸质系统停止运作后，组织关系会发生什么？",
    "How can incomplete material remains and historical records be traced without assuming continuity?": "如何在不预设连续性的前提下，追踪不完整的材料遗存与历史记录？",
    "How can material, spatial, and embodied processes translate former relations into contemporary encounters?": "材料、空间与具身过程如何将过去的关系转译为当代遭遇？",
    "Under what conditions can selected relations be tested through operational digital or algorithmically mediated environments?": "在何种条件下，选定的关系可以通过可运作的数字或算法中介环境接受测试？",
    "Provisional Material Scope": "暂定材料范围",
    "Commodity labels and small wrappers: recognition, attraction, authenticity, and value": "商品标签与小型包装纸：识别、吸引、真实性与价值",
    "Ration coupons and exchange or supply vouchers: eligibility, quantity, location, time, allocation, and exchange": "粮票、兑换券或供应券：资格、数量、地点、时间、分配与交换",
    "A bounded working corpus rather than a complete or representative archive": "一个边界明确的工作语料库，而非完整或具有代表性的档案",
    "Experimental Focus": "实验重点",
    "The computational strand is not primarily concerned with whether a machine reads an object more accurately than a human. Algorithmic mediation is retained only where it changes how a selected relation operates—through decision-making, participation, access, feedback, or possible emergence. If it produces no meaningful distinction, it will be reduced, revised, or removed.": "计算部分的重点并不是机器能否比人更准确地读取物件。只有当算法中介能通过决策、参与、准入、反馈或可能的涌现，改变某一选定关系的运作方式时，它才会被保留；若无法产生有意义的差异，则会被缩减、修改或移除。",
    "Working Research Sequence": "工作研究序列",
    "Withdrawal → Residue → Tracing → Translation → Experimental Re-operation → Possible Emergence": "退出运作 → 残留 → 追踪 → 转译 → 实验性重新运作 → 可能的涌现",

    "Selected Works": "精选作品",
    "Selected works examining how material traces, reading structures, and responsive systems can make relations perceptible.": "精选作品探索材料痕迹、阅读结构与响应式系统如何使关系变得可感。",
    "Section 01": "章节 01",
    "Current Practice": "当前实践",
    "Four current projects through which material traces, bodily encounters, and responsive conditions are tested as distinct yet related forms of reading.": "四个当前项目，通过材料痕迹、身体遭遇与响应条件，测试彼此不同却又相互关联的阅读形式。",
    "01 / Work in progress": "01 / 进行中",
    "02 / Current": "02 / 当前",
    "03 / Current": "03 / 当前",
    "04 / Current": "04 / 当前",
    "Working corpus, material archive, reading-system prototype": "工作语料库、材料档案、阅读系统原型",
    "An accumulating inquiry into how official categories, material traces, and proposed computational readings reorganise obsolete paper systems.": "一项持续积累的研究，探索官方分类、材料痕迹与拟议的计算阅读如何重新组织失效的纸质系统。",
    "Interactive web field, visual grammar, responsive perception": "互动网页场域、视觉语法、响应性感知",
    "A web-based perceptual field where movement, stillness, and presence accumulate as blur, rupture, density, and fading traces.": "一个基于网页的感知场域；移动、静止与在场在其中积累为模糊、断裂、密度与逐渐消退的痕迹。",
    "Beijing Orders / Three States of Order": "北京秩序 / 秩序三态",
    "Material prototype, speculative studies, interactive binding study": "材料原型、思辨性视觉研究、互动装帧研究",
    "Dragon-scale-bound artist books translating embodied encounters with Beijing’s architectural and historical order into layered material reading.": "龙鳞装艺术家书，将身体对北京建筑与历史秩序的遭遇转译为层叠的材料阅读。",
    "Ink, calligraphy practice paper, handmade paper, hand binding": "墨、书法练习纸、手工纸、手工装订",
    "A hand-bound book object gathering the pressure, correction, and residue of writing practice.": "一件手工装订的书本物件，汇集书写练习中的压力、修改与残留。",
    "Section 02": "章节 02",
    "Foundations Archive / 2016–2021": "实践基础档案 / 2016–2021",
    "Early experiments in printed sequence, folding, transparency, portable reading, and paper mechanisms.": "关于印刷序列、折叠、透明性、便携式阅读与纸质机关的早期实验。",
    "Open archive": "打开档案",
    "6 works": "6 件作品",
    "Printmaking, poetry, miniature artist book": "版画、诗歌、微型艺术家书",
    "A small sequential book on growth, care, and destruction.": "一本关于生长、照料与毁坏的小型序列书。",
    "Tracing paper, poem-based card object": "描图纸、基于诗歌的卡片物件",
    "Small translucent paper objects exploring reading and handling.": "通过小型半透明纸质物件探索阅读与拿取。",
    "Hand-carved print, folded artist book": "手刻版画、折叠艺术家书",
    "A folded printed study turning poetry into continuous reading.": "一项将诗歌转化为连续阅读的折叠印刷研究。",
    "Drawings in Printed Form / Publications": "印刷形式中的绘画 / 出版物",
    "Published books, watercolor drawing, printed image sequence": "出版书籍、水彩绘画、印刷图像序列",
    "Two published drawing books shown as early printed image practice.": "两本绘画出版物，呈现早期的印刷图像实践。",
    "Handmade artist book, mixed media, printed matter": "手工艺术家书、综合媒介、印刷物",
    "Layered travel journals using collected fragments and page structures.": "以收集的碎片与页面结构构成的层叠旅行手记。",
    "Risograph print, handmade box, mixed paper structures": "孔版印刷、手工盒、混合纸质结构",
    "A hand-assembled box opening into layered paper mechanisms.": "一件手工组装的盒状物件，展开后形成层叠的纸质机关。",

    "Back to Early Printed Matter": "返回早期印刷物",
    "Early Work / 2016": "早期作品 / 2016",
    "Early Work / 2017": "早期作品 / 2017",
    "Early Work / 2018": "早期作品 / 2018",
    "Archive index": "档案索引",
    "Earlier Works / Publications": "早期作品 / 出版物",
    "2017–2021 / Book publication, watercolor drawing, printed image sequence": "2017–2021 / 书籍出版、水彩绘画、印刷图像序列",
    "Two published drawing books developed from watercolor studies, botanical imagery, and printed book formats. These publications are shown as part of an early image-based practice where drawing, reproduction, layout, and book sequencing began to overlap.": "两本由水彩研究、植物图像与印刷书籍形式发展而来的绘画出版物。它们呈现了早期图像实践中绘画、复制、版式与书籍编排开始彼此交叠的阶段。",
    "Publication 2017 / Scenery with Blooming": "2017 年出版物 /《花开风景》",
    "2017 / Published book, watercolor flower and landscape drawing": "2017 / 出版书籍、水彩花卉与风景绘画",
    "A printed publication bringing watercolor flower and landscape studies into book form. The work records an early stage of drawing practice where illustration, printed layout, and instructional image sequence began to overlap.": "一本将水彩花卉与风景研究转化为书籍形式的出版物。作品记录了绘画实践的早期阶段：插图、印刷版式与教学性图像序列开始相互交叠。",
    "Publication 2021 / Creative Watercolor Illustration": "2021 年出版物 /《创意水彩插画》",
    "2021 / Published book, watercolor illustration, printed image sequence": "2021 / 出版书籍、水彩插画、印刷图像序列",
    "A later publication project extending watercolor drawing into a more developed printed format, where illustration, editorial sequencing, and reproducible image systems continued to shape the practice.": "这一后期出版项目将水彩绘画延伸至更成熟的印刷形式，插图、编辑序列与可复制的图像系统继续塑造着实践。",
    "Related archive": "相关档案",
    "Continue to current practice": "继续查看当前实践",
    "01 / Core Work": "01 / 核心作品",
    "Early Printed Matter / Artist Book Works": "早期印刷物 / 艺术家书作品",
    "2015-2018 / Artist books, hand printing, folded matter": "2015–2018 / 艺术家书、手工印刷、折叠纸质作品",
    "A compact archive of early studies in printed matter, book structure, and the relationship between text, image, and sequential reading.": "一个精简的早期研究档案，涉及印刷物、书籍结构，以及文字、图像与序列阅读之间的关系。",
    "Archive Note": "档案说明",
    "These early works are shown as a reduced archive rather than as fully developed projects. They indicate a continuing interest in books as material structures for reading, touch, sequence, and image-based thinking.": "这些早期作品以精简档案而非完整项目的形式呈现。它们显示出一种持续的兴趣：将书视为承载阅读、触摸、序列与图像思考的材料结构。",
    "2018 / Handmade artist book / Mixed media, printed matter, illustration, photography": "2018 / 手工艺术家书 / 综合媒介、印刷物、插图、摄影",
    "A series of handmade travel journals combining printed matter, illustration, photography, and layered page materials.": "一组结合印刷物、插图、摄影与层叠页面材料的手工旅行手记。",
    "2016 / Printmaking, poetry, miniature artist book": "2016 / 版画、诗歌、微型艺术家书",
    "A miniature artist book combining printmaking, poetry, and sequential storytelling through the life cycle of a butterfly.": "一本结合版画、诗歌与序列叙事的微型艺术家书，以蝴蝶的生命周期展开。",
    "2017 / Hand-carved print, folded artist book, printed paper": "2017 / 手刻版画、折叠艺术家书、印刷纸张",
    "An early printed matter study exploring poetry as a continuous reading structure through folding, hand printing, and wave-like image sequences.": "一项早期印刷物研究，通过折叠、手工印刷与波浪状图像序列，将诗歌探索为一种连续的阅读结构。",
    "2016 / Tracing paper, poem-based card object / 11 x 11 cm": "2016 / 描图纸、基于诗歌的卡片物件 / 11 × 11 cm",
    "A poem-based card object using translucent paper to turn reading into a small layered structure of opening and handling.": "一件基于诗歌的卡片物件，以半透明纸张将阅读转化为可开启、可拿取的小型层叠结构。",
    "2018 / Risograph print, handmade explosion box, mixed paper structures": "2018 / 孔版印刷、手工爆炸盒、混合纸质结构",
    "A hand-assembled box object that opens into layered paper mechanisms, printed fragments, and interactive interior elements.": "一件手工组装的盒状物件，展开后呈现层叠的纸质机关、印刷碎片与互动内部构件。",
    "Enter archive / E01": "进入档案 / E01",
    "A miniature artist book combining printmaking, poetry, and sequential storytelling. Inspired by the life cycle of a butterfly, the work reflects on growth, intervention, and the fragile boundary between care and destruction.": "一本结合版画、诗歌与序列叙事的微型艺术家书。作品受蝴蝶生命周期启发，思考生长、介入，以及照料与毁坏之间脆弱的边界。",
    "A small card-based work developed from poetry, using translucent paper to translate reading into a layered object. The work marks an early interest in the relation between text, material surface, and intimate forms of handling.": "一件由诗歌发展而来的小型卡片作品，以半透明纸张将阅读转译为层叠物件。它标志着我早期对文字、材料表面与亲密拿取方式之间关系的兴趣。",
    "A handmade explosion-box project developed from risograph printing, paper construction, and collected classroom materials. The work brings together printed fragments, folded mechanisms, and small interactive elements, reflecting an early interest in craft, assembly, and the book as a container for shared material traces.": "一件由孔版印刷、纸张构造与课堂收集材料发展而来的手工爆炸盒。作品汇集印刷碎片、折叠机关与小型互动元素，体现了我早期对手工、组装，以及书作为共同材料痕迹容器的兴趣。",
    "A handmade artist book series combining travel notes, printed matter, illustration, photography, and translucent page materials. The work treats the journal as a portable container for collected images, fragments, and layered observations.": "一组结合旅行笔记、印刷物、插图、摄影与半透明页面材料的手工艺术家书。作品将手记视为一个便携容器，用来承载收集的图像、碎片与层叠观察。",

    "Artist Book / Hand-bound Book Object": "艺术家书 / 手工装订书本物件",
    "A hand-bound artist book built from ink, calligraphy practice paper, discarded fragments, and translucent layers.": "一本由墨、书法练习纸、废弃碎片与半透明层构成的手工装订艺术家书。",
    "This book gathers the surfaces, corrections, pressures, and repetitions of writing practice into a hand-bound object. The page is treated as a skin: a place where gesture leaves evidence before language becomes fixed.": "这本书将书写练习中的表面、修改、压力与重复汇集为一件手工装订物。页面被视作皮肤：在语言定形之前，动作先在其上留下证据。",
    "Ink, calligraphy practice paper, handmade paper, calligraphy fragments, tracing paper, hand binding": "墨、书法练习纸、手工纸、书法碎片、描图纸、手工装订",
    "Artist book / hand-bound book object": "艺术家书 / 手工装订书本物件",
    "Book Object": "书本物件",
    "Cover": "封面",
    "Spine": "书脊",
    "Thickness": "厚度",
    "Interior Sequence": "内页序列",
    "Control marks": "控制性笔迹",
    "Calligraphy fragments": "书法碎片",
    "Ink texture": "墨迹肌理",
    "Character / texture": "文字 / 肌理",
    "Tracing paper and writing": "描图纸与书写",
    "Detail": "细节",
    "Binding": "装订",
    "Paper layers": "纸张层次",
    "Ink surface": "墨迹表面",
    "Reading traces": "阅读痕迹",
    "Reading protocol / 01": "阅读协议 / 01",
    "Select a trace to alter the reading emphasis in the interior sequence. This is an artist-defined protocol, not automated recognition.": "选择一类痕迹，改变对内页序列的阅读重心。这是艺术家提出的阅读协议，而非自动识别。",
    "All": "全部",
    "Mark": "笔迹",
    "Correction": "修改",
    "Pressure": "压力",
    "Residue": "残留",
    "Forthcoming documentation / 45–60 sec": "即将补充的记录 / 45–60 秒",
    "Hand, paper, friction, pause, and return.": "手、纸张、摩擦、停顿与返回。",
    "A quiet close-range flip-through will be added when the physical filming is complete. No placeholder video is being presented as finished work.": "实物拍摄完成后，将加入一段安静的近距离翻阅影像。在此之前，不会用占位视频冒充完成作品。",

    "View / 01": "视图 / 01",
    "Project record": "项目记录",
    "Project record →": "项目记录 →",
    "Working interface model. Record labels are provisional display markers, not completed catalogue entries.": "工作中的界面模型。记录标签是暂定的展示标记，并非已完成的编目条目。",
    "Research premise · methods · working sequence": "研究前提 · 方法 · 工作序列",
    "Prototype / 01 · Work in progress": "原型 / 01 · 进行中",
    "Enter Bureau Reading System": "进入管理局阅读系统",
    "System record · material trace · proposed machine reading": "系统记录 · 材料痕迹 · 拟议的机器阅读",
    "AFTER USE / RESEARCH OBJECT 01": "《使用之后》/ 研究对象 01",
    "Practice-based inquiry · Working corpus · 2026–": "实践型研究 · 工作语料库 · 2026–",
    "Tracing and translating organising relations in obsolete everyday paper systems.": "追踪并转译失效日常纸质系统中的组织关系。",
    "I am not collecting rare objects. I am tracing everyday systems through the paper they left behind.": "我收集的不是稀有物件。我借由日常系统留下的纸张，追踪它们曾经如何运作。",
    "Field view / 001": "材料场 / 001",
    "A working field of obsolete everyday paper objects: tickets, vouchers, wrappers, labels and image fragments.": "一个由失效日常纸质物构成的工作场：票券、凭证、包装纸、标签与图像碎片。",
    "After use": "使用之后",
    "The bureau is not a collection of old things. It is a research framework for asking what happens to organising relations after the paper systems that enacted them cease to operate.": "这个“管理局”并非旧物收藏。它是一个研究框架，用于追问：当施行这些关系的纸质系统停止运作后，组织关系会发生什么？",
    "Some papers organised eligibility, quantity, time, allocation and exchange. Others organised recognition, attraction and commodity value. The project traces these different operations through material residue, historical context and situated encounters without presenting later interpretation as recovered fact.": "有些纸张组织了资格、数量、时间、分配与交换；另一些则组织了识别、吸引与商品价值。项目通过材料残留、历史语境与具体遭遇追踪这些不同运作，但不把后来的阐释冒充为被复原的事实。",
    "Core question / RQ": "核心问题 / RQ",
    "Core corpus": "核心语料库",
    "Ration coupons, exchange vouchers, wrappers and product labels": "粮票、兑换券、包装纸与商品标签",
    "Corpus construction, material observation, contextual tracing, artistic translation and conditional testing": "语料库建构、材料观察、语境追踪、艺术转译与条件性测试",
    "TWO MATERIAL SYSTEMS": "两类材料系统",
    "Bounded corpus": "有限语料库",
    "Provisional groups": "暂定分组",
    "The initial corpus is deliberately limited to two working groups. They are compared not because they are historically equivalent, but because they organised everyday life through two markedly different modes.": "初始语料库有意限定为两个工作组。将它们并置，并非因为它们在历史上等同，而是因为它们曾以截然不同的方式组织日常生活。",
    "Eligibility, quantity and allocation": "资格、数量与分配",
    "Recognition, attraction and value": "识别、吸引与价值",
    "Held at the edge of the corpus": "保留在语料库边缘",
    "What can be seen is kept separate from what is known, interpreted or proposed.": "可直接看见的信息，与已知、阐释或拟议的内容保持分离。",
    "RESEARCH SEQUENCE": "研究序列",
    "From residue": "从残留出发",
    "To conditional testing": "走向条件性测试",
    "What materially remains?": "材料上还剩下什么？",
    "What can be supported?": "哪些判断可以获得证据支持？",
    "What changes form?": "什么改变了形式？",
    "What can operate again?": "什么可以再次运作？",
    "What was not there before?": "什么是之前不曾存在的？",
    "MOVING-IMAGE STUDY": "动态影像研究",
    "Materials are touched, turned, compared and rearranged. The film records the hand as part of the research method rather than presenting a finished archive.": "材料被触摸、翻转、比较与重新排列。影像将手的动作记录为研究方法的一部分，而非展示一个已完成的档案。",

    "Bureau Reading System · Prototype": "管理局阅读系统 · 原型",
    "BUREAU READING SYSTEM / PROTOTYPE": "管理局阅读系统 / 原型",
    "Three readings of one material record.": "对同一份材料记录的三种阅读。",
    "Reading mode": "阅读模式",
    "System record": "系统记录",
    "Material trace": "材料痕迹",
    "Proposed machine reading": "拟议的机器阅读",
    "All objects": "全部物件",
    "Selected relations": "选定关系",
    "Read by": "阅读方式",
    "Everything": "全部",
    "Who gets what": "谁可以获得什么",
    "Exchange / expiry": "交换 / 失效",
    "Image / attraction": "图像 / 吸引",
    "Value": "价值",
    "Material type": "材料类型",
    "Tickets & vouchers": "票券与凭证",
    "Wrappers & labels": "包装纸与标签",
    "Other printed matter": "其他印刷物",
    "SELECT AN OBJECT": "选择一件物件",
    "Bureau Reading System / How to read": "管理局阅读系统 / 如何阅读",
    "System record: what the paper may have regulated.": "系统记录：这张纸曾可能规制了什么。",
    "Material trace: what remains directly visible.": "材料痕迹：仍然可直接看见的东西。",
    "Proposed machine reading: what a formal model might connect or omit.": "拟议的机器阅读：形式模型可能建立什么联系，又可能遗漏什么。",

    "Current Research Project / 2026": "当前研究项目 / 2026",
    "2026 / Printed image, drawing, field-based structure": "2026 / 印刷图像、绘画、场域结构",
    "A three-part work that treats transformation as a material and perceptual process. Camel, lion, and child become structural positions for carrying, breaking, and beginning again within image-based research.": "一件由三部分构成的作品，将转变视为材料与感知过程。骆驼、狮子与孩童在图像研究中成为承载、打破与重新开始的结构位置。",
    "Camel": "骆驼",
    "Burden / accumulation / inherited weight": "负重 / 积累 / 继承的重量",
    "The first movement approaches transformation through carrying. Image fragments gather as weight, forming a structure of endurance, obedience, and compressed memory.": "第一阶段从承载进入转变。图像碎片积聚成重量，形成由忍耐、服从与压缩记忆构成的结构。",
    "Lion": "狮子",
    "Rupture / refusal / active separation": "断裂 / 拒绝 / 主动分离",
    "The second movement turns the accumulated field into an act of resistance. Drawing and printed structure become a way to test rupture, refusal, and the moment a form separates from what has shaped it.": "第二阶段把积累的场转化为抵抗行动。绘画与印刷结构成为测试断裂、拒绝，以及形式脱离其塑造力量之瞬间的方法。",
    "Child": "孩童",
    "Play / emergence / perceptual renewal": "游戏 / 涌现 / 感知更新",
    "The final movement opens toward play and beginning. The image field is treated as something provisional and alive, where perception can reorganize itself without returning to a fixed order.": "最后阶段向游戏与开始敞开。图像场被视为临时而鲜活之物，感知可以在其中重新组织，而无需回到固定秩序。",
    "Research Notes": "研究笔记",
    "The title refers to a sequence of transformation rather than a literal narrative. Within the portfolio, the work connects the material logic of artist books with newer experiments in field, residue, bodily attention, and image systems.": "标题指向一个转变序列，而非字面叙事。在作品集中，它把艺术家书的材料逻辑与关于场域、残留、身体注意和图像系统的新实验连接起来。",
    "Current development / 02": "当前发展 / 02",

    "Research process": "研究过程",
    "System": "系统",
    "M5Stack": "M5Stack",
    "Exhibition": "展览",
    "A perceptual field whose condition changes through presence.": "一个会因“在场”而改变状态的感知场。",
    "The work does not represent transformation. It constructs conditions in which transformation can be perceived.": "作品不再现转变，而是建构一组使转变得可感的条件。",
    "Research questions": "研究问题",
    "Three coexisting forces / never three stages": "三种共存的力量 / 而非三个线性阶段",
    "Weight": "重量",
    "Friction": "阻力",
    "Play": "游戏",
    "Two linked rule layers": "两层相互连接的规则",
    "Trace analysis": "痕迹分析",
    "Trace forces": "痕迹中的力",
    "Residue field": "残留场",
    "Shared visual grammar": "共享的视觉语法",
    "Rule evidence / input → state change → perceptual consequence": "规则证据 / 输入 → 状态变化 → 感知结果",
    "Encounter": "遭遇",
    "Rule": "规则",
    "Visible consequence": "可见结果",
    "Move": "移动",
    "Movement deposits an active trace.": "移动留下活跃痕迹。",
    "The path extends and the field ruptures.": "路径延展，场发生断裂。",
    "Pause": "停顿",
    "Stillness allows residue to accumulate.": "静止让残留得以积累。",
    "Density gathers around the last position.": "密度在最后的位置周围聚集。",
    "Stay": "停留",
    "Duration alters the field state.": "持续时间改变场的状态。",
    "The image thickens, fades, or leaves an afterimage.": "图像变得浓稠、淡去，或留下残像。",
    "Two inputs / two kinds of presence": "两种输入 / 两种在场",
    "Restricted visual primitive library": "受限的视觉基础语汇",
    "Visual development": "视觉发展",
    "Current state / not final integration": "当前状态 / 尚非最终整合",
    "A question held in the hand.": "一个被握在手中的问题。",

    "Experiment / 01 · Viewing method": "实验 / 01 · 观看方法",
    "Enter Reading Distance": "进入阅读距离",
    "Group reading · close reading · temporary relations": "群组阅读 · 近距离阅读 · 临时关系",
    "THE BUREAU OF INVALIDATED TICKETS": "失效票证管理局",
    "Material group / T–01": "材料组 / T–01",
    "02 / Regulated access and exchange": "02 / 受规制的准入与交换",
    "Ration coupons and exchange vouchers organised who could obtain what, how much, where and when. Group reading makes their explicit conditions, regional differences, repetition and traces of handling available for comparison.": "粮票与兑换券规定了谁可以在何时、何地、获得什么以及多少。群组阅读使明确条件、地域差异、重复与使用痕迹得以比较。",
    "Eligibility · Quantity · Location · Time · Allocation · Exchange": "资格 · 数量 · 地点 · 时间 · 分配 · 交换",
    "Single-object lens / W–001": "单一物件视角 / W–001",
    "01 / Commodity presentation and value": "01 / 商品呈现与价值",
    "Wrappers and labels participated in naming, recognition, attraction, perceived authenticity and commodity value. Single-object reading keeps colour, typography, printed image and handling trace available without reducing them to visual similarity alone.": "包装纸与标签参与了命名、识别、吸引、真实性感知与商品价值的建立。单一物件阅读保留颜色、字体、印刷图像与触摸痕迹，而不将它们简化为视觉相似性。",
    "Naming · Recognition · Attraction · Authenticity · Commodity value": "命名 · 识别 · 吸引 · 真实性 · 商品价值",
    "Material field / P–01": "材料场 / P–01",
    "Peripheral material / Awaiting entry": "边缘材料 / 等待进入",
    "Matchbox prints, cigarette packaging, stamps and other printed matter remain visible in the working archive without becoming a third equal category. They enter the core corpus only when provenance and analysis show that they extend the research question.": "火柴盒印刷品、香烟包装、邮票与其他印刷物被保留在工作档案中，但不作为第三个并列类别。只有当来源与分析证明它们能扩展研究问题时，才进入核心语料库。",
    "Retained · Unresolved · Awaiting provenance · Conditional entry": "保留 · 未决 · 等待来源研究 · 条件性进入",
    "How each record is read / 01": "每份记录如何被阅读 / 01",
    "The deeper research terms remain visible inside each record: direct observation, documented context, researcher inference, artistic proposition, machine output and what remains unknown.": "每份记录中都明示更深层的研究类别：直接观察、文献语境、研究者推断、艺术提案、机器输出与仍然未知的部分。",
    "The archive is one stage of the method, not its final form. Material records are traced through evidence, translated through artistic processes and, only where it changes the research situation, tested through rule-based or algorithmic mediation.": "档案只是方法的一个阶段，而非最终形式。材料记录通过证据被追踪，通过艺术过程被转译；只有当规则或算法中介真正改变研究情境时，才进入测试。",
    "Surface, fold, stain, text, image and use trace.": "表面、折痕、污渍、文字、图像与使用痕迹。",
    "Observation, provenance, context and unresolved gaps.": "观察、来源、语境与未解缺口。",
    "03 / TRANSLATION": "03 / 转译",
    "Regrouping, reprinting, cutting, folding, binding and spatial rules.": "重新分组、再印刷、切割、折叠、装订与空间规则。",
    "A selected relation placed under contemporary conditions.": "将一组选定关系置于当代条件之下。",
    "05 / EMERGENCE": "05 / 涌现",
    "Effects produced through participant action and feedback.": "由参与者行动与反馈产生的结果。",
    "Process evidence": "过程证据",
    "Film record / F–01": "影像记录 / F–01",
    "OBSERVATION PAGES": "观察页",
    "Working pages": "工作页",
    "Observation · handling": "观察 · 拿取",
    "Observation pages hold one object or material group long enough for surface, fold, stain, typography and repetition to be recorded. They separate what is directly visible from contextual evidence, inference and what remains unresolved.": "观察页让单一物件或材料组停留得足够久，使表面、折痕、污渍、字体与重复得以被记录，并将直接可见信息与语境证据、推断及未解部分分开。",
    "Handwritten sheets separate what is known, what is seen and what remains uncertain.": "手写观察页将已知、所见与仍然不确定的部分区分开来。",
    "Handling changes the distance between object, body and archive.": "拿取改变了物件、身体与档案之间的距离。",
    "EXPERIMENTAL PILOT": "实验性试点",
    "Next research cycle": "下一轮研究",
    "The next stage is not a larger visual network. It is a small operational pilot in which one relation—such as allocation or temporal validity—is translated into a changing condition that participants can encounter and affect.": "下一阶段不是更大的视觉网络，而是一个小型可运作试点：将分配或时间有效性等某一关系，转译为参与者可以遭遇并改变的动态条件。",
    "Who defines the translated rule, and what is retained, altered or removed?": "谁来定义转译后的规则？什么被保留、改变或删除？",
    "Can participant actions change what later participants are able to access, receive or see?": "参与者的行动能否改变后来者可以进入、获得或看见的内容？",
    "Does algorithmic mediation produce a meaningful relational difference, or should it be removed?": "算法中介是否产生了有意义的关系差异？如果没有，它是否应被移除？",

    "CURRENT PRACTICE / 01": "当前实践 / 01",
    "CURRENT PRACTICE / 03": "当前实践 / 03",
    "CURRENT PRACTICE / 04": "当前实践 / 04",
    "Beijing Orders": "北京秩序",
    "One material prototype · Two speculative visual studies · Interactive binding study": "一件材料原型 · 两组思辨性视觉研究 · 互动装帧研究",
    "Interactive binding study": "互动装帧研究",
    "Experience the structure through opening, turning and returning.": "通过打开、翻转与返回来经验这一结构。",
    "Open interaction": "打开互动",
    "Physical work": "实体作品",
    "Warm-toned fibrous paper, printed paper and textile scroll mount": "暖色纤维纸、印刷纸与织物卷轴底",
    "Integrated dragon-scale leaves and scroll base": "一体化龙鳞页与卷轴底",
    "Project state": "项目状态",
    "One material prototype, two speculative visual studies, and one interactive binding study": "一件材料原型、两组思辨性视觉研究与一项互动装帧研究",
    "ENCOUNTERING ORDER": "遭遇秩序",
    "Field observation and sketchbook studies across the Forbidden City, Beijing’s central axis, the Summer Palace and Yuanmingyuan focused on how order is encountered through the body: repeated gates, prescribed routes, symmetrical structures, material surfaces, distance, stopping and moments of partial visibility.": "在故宫、北京中轴线、颐和园与圆明园进行的现场观察与速写本研究，关注身体如何遭遇秩序：重复的门、被规定的路径、对称结构、材料表面、距离、停顿与局部可见的瞬间。",
    "The research moved away from recording particular sites and towards isolating the relations that organise perception: axis, procession, hierarchy, repetition, density, interval and trace.": "研究逐渐离开对特定地点的记录，转向提取组织感知的关系：轴线、行进、层级、重复、密度、间隔与痕迹。",
    "Axis, pattern, repetition and frame.": "轴线、模式、重复与框架。",
    "Surface, trace and historical accumulation.": "表面、痕迹与历史积累。",
    "Colour field and material translation.": "色彩场与材料转译。",
    "Repetition, symmetry and temporal trace.": "重复、对称与时间痕迹。",
    "Order is established.": "秩序被建立。",
    "Order persists as trace.": "秩序以痕迹的形式延续。",
    "Order becomes perceptible.": "秩序变得可感。",
    "STRUCTURAL TRANSLATION": "结构转译",
    "Dragon-scale binding is used as an operative structure rather than a decorative sign of tradition. Each leaf occupies a defined position, overlaps another and can only be read through a sequence of lifting, revealing and returning.": "龙鳞装被作为一种可运作结构，而非传统的装饰性符号。每一叶占据明确位置、与另一叶重叠，只能通过抬起、显现与返回的序列被阅读。",
    "The work does not reconstruct a historical specimen. It uses the binding’s overlapping and sequential logic as a contemporary method for testing how spatial order can become bodily, temporal and only partially visible.": "作品不重建历史样本，而是将装帧的重叠与序列逻辑作为当代方法，测试空间秩序如何变得具身、时间化并且只能局部可见。",
    "Conceal / Reveal": "隐藏 / 显现",
    "Reading action": "阅读动作",
    "MAKING THE MATERIAL PILOT": "制作材料试点",
    "CONCEPTUAL ORDER / PRODUCTION PATH": "概念秩序 / 制作路径",
    "A / DIGITAL STUDY": "A / 数字研究",
    "B / DIGITAL STUDY": "B / 数字研究",
    "C / PHYSICAL PROTOTYPE": "C / 实体原型",
    "Order as positioning, alignment and ritual sequence.": "作为定位、对齐与仪式序列的秩序。",
    "Order as residue, sediment and material persistence.": "作为残留、沉积与材料延续的秩序。",
    "Order as interval, unfolding and perceptual revelation.": "作为间隔、展开与感知显现的秩序。",
    "Interactive digital binding study": "互动数字装帧研究",
    "This interface is not a simulation of the book. It is a reading study: a way to observe sequence, reversal, pause, and partial visibility.": "这一界面不是对书的模拟，而是一项阅读研究：用于观察序列、逆转、停顿与局部可见性。",
    "MATERIAL READING": "材料阅读",
    "The prototype is not completed by being seen as a fixed image. Its structure asks for touch, lifting, hesitation and return. Fibres, folds, page edges and small variations in alignment make reading dependent on the duration and pressure of the hand.": "原型并不因被视为固定图像而完成。它的结构要求触摸、抬起、犹豫与返回；纤维、折痕、页边与对齐中的微小差异，使阅读依赖于手的停留时间与压力。",
    "The material pilot has established a viable structure and a method for translating spatial relations into sequential reading. The next stage is reader observation. A small handling study will examine how participants open, pause, reverse and re-roll the object, and whether the intended states of positioning, residue and gradual appearance remain perceptible without prior explanation.": "材料试点已建立可行结构，以及将空间关系转译为序列阅读的方法。下一阶段是读者观察：通过小型拿取研究，观察参与者如何打开、停顿、逆转与重新卷起物件，并测试在没有预先解释的情况下，定位、残留与渐进显现是否仍然可感。",

    "Interactive study / 2026": "互动研究 / 2026",
    "Field open — move, pause, stay": "场已开放——移动、停顿、停留",
    "Metamorphoses": "精神三变",
    "The field changes with movement, stillness, repetition and presence.": "场会随移动、静止、重复与在场而改变。",
    "leave a trace": "留下痕迹",
    "extend the path": "延展路径",
    "let residue gather": "让残留聚集",
    "Research console": "研究控制台",
    "Close / Field": "关闭 / 返回场",
    "A field where carrying, resisting and beginning again remain unfinished.": "一个使承担、抵抗与重新开始始终保持未完成的场。",
    "How might subtle change become perceptible without being represented, named or diagnosed?": "细微转变如何在不被再现、命名或诊断的情况下变得可感？",
    "A philosophical reading translated into an open responsive field, not a symbolic illustration or a model of the viewer.": "将一次哲学阅读转译为开放的响应式场，而非象征性插图或对观众的建模。",
    "Directional trace, persistent residue and opt-in coarse camera sensing operate in the browser. The M5Stack remains a separate working prototype.": "定向痕迹、持续残留与可选择启用的粗粒度摄像头感知在浏览器中运作；M5Stack 仍是独立的工作原型。",
    "Live trace relation / descriptive, never diagnostic": "实时痕迹关系 / 只作描述，不作诊断",
    "Trace tendency / not a personal state": "痕迹倾向 / 而非个人状态",
    "No trace measured": "尚未测量到痕迹",
    "System map / encounter → measurement → force → field": "系统图 / 遭遇 → 测量 → 力 → 场",
    "01 / Encounter": "01 / 遭遇",
    "Pointer or camera": "指针或摄像头",
    "Intentional path / coarse frame change": "有意路径 / 粗粒度画面变化",
    "02 / Features": "02 / 特征",
    "Movement qualities": "移动特质",
    "03 / Relations": "03 / 关系",
    "Two linked layers": "两个相连层次",
    "04 / Consequence": "04 / 结果",
    "Perceptual field": "感知场",
    "Three optional ways of entering the field": "三种可选的进入方式",
    "01 / Accumulate": "01 / 积累",
    "Return to a familiar path": "返回熟悉路径",
    "Move slowly through an area where a trace already remains.": "缓慢穿过已有痕迹残留的区域。",
    "02 / Interrupt": "02 / 中断",
    "Change direction without warning": "突然改变方向",
    "Let a continuous path turn against its previous movement.": "让连续路径转向与先前移动相反的方向。",
    "Enter where no trace remains": "进入尚无痕迹的位置",
    "Move into an area the field has not yet remembered.": "移入场尚未记住的区域。",
    "Agency and boundary": "能动性与边界",
    "The visitor chooses": "观众选择",
    "The system measures": "系统测量",
    "The system changes": "系统改变",
    "The system cannot know": "系统无法知道",
    "Identity, intention, emotion, belief or a person’s “true” metamorphosis.": "身份、意图、情感、信念，或一个人“真实的”转变。",
    "Limits / open questions": "局限 / 开放问题",
    "The computation is exposed so that it can be questioned. The person remains unresolved.": "计算过程被公开，因而可以被质疑；人本身始终不被定论。",
    "Core proposition": "核心命题",
    "The work does not illustrate transformation as a sequence. It builds a field in which carrying, resisting and beginning can overlap and be felt without being named.": "作品不把转变图解为一个序列，而是建构一个场，使承担、抵抗与开始能够相互重叠，并在未被命名前先被感受。",
    "Personal resonance / not autobiography": "个人共鸣 / 而非自传",
    "I had experienced carrying, resisting and becoming as real changes, but not as clean or dramatic stages. Even rupture did not feel like a spectacular collision. It appeared gradually and naturally, overlapping with responsibility, hesitation, curiosity and the making of new possibilities.": "我曾将承担、抵抗与成为经验为真实变化，但它们并非干净或戏剧化的阶段。即便断裂也不像壮观碰撞；它逐渐且自然地出现，与责任、犹豫、好奇与新可能性的生成重叠。",
    "The work therefore does not retell my biography or assume that every visitor shares the same story. It uses that experience to ask whether subtle internal change can become perceptible without being explained, diagnosed or represented literally.": "因此，作品不重述我的传记，也不假设每位观众共享同一故事。它从这一经验出发，追问细微的内在变化能否在不被解释、诊断或字面化再现的情况下变得可感。",
    "Research contribution": "研究贡献",
    "A practice-based exploration of how a lived encounter with philosophy can become an interactive system without turning the text into illustration or the visitor into a category.": "一项实践型探索：与哲学的切身遭遇如何成为互动系统，而不把文本变成插图，也不把观众变成类别。",
    "Practice-based methodology": "实践型方法",
    "Working now / two real prototypes": "当前工作 / 两个真实原型",
    "Web Field + M5Stack": "网页场 + M5Stack",
    "Next research stage": "下一研究阶段",
    "Differentiate → map → observe": "区分 → 映射 → 观察",
    "Participant observation": "参与者观察",
    "The field does not tell the viewer what state they are in. It changes with the way they enter it.": "场不告诉观众他们处于何种状态；它随观众进入的方式而改变。",
    "03 / Spiritual interface prototype": "03 / 精神性界面原型",
    "A physical threshold, not a remote control.": "一个身体性门槛，而非遥控器。",
    "Evidence status": "证据状态",
    "Three prompts": "三个提问",
    "Open response": "开放回应",
    "Conceptual relationship / technically separate today": "概念关系 / 当前在技术上分离",
    "Minimum viable connection / proposed test": "最小可行连接 / 拟议测试",
    "Implementation status": "实施状态",
    "04 / Speculative spatial development": "04 / 思辨性空间发展",
    "The same perceptual system, expanded from screen to space.": "同一感知系统，从屏幕扩展至空间。",
    "Translation of scale": "尺度转译",
    "Three spatial components": "三个空间组成部分",
    "01 / Entrance": "01 / 入口",
    "Spiritual Interface": "精神性界面",
    "02 / Transition": "02 / 过渡",
    "03 / Interior": "03 / 内部",
    "Perceptual Field": "感知场",
    "Installation overview": "装置概览",
    "Speculative Installation Proposal, 2026": "思辨性装置方案，2026",
    "AI-assisted spatial visualisation developed from the current working prototype.": "基于当前工作原型发展的 AI 辅助空间可视化。"
  }));

  const originals = new WeakMap();
  const normaliseText = (value) => value.replace(/\s+/g, " ").trim();
  const normalisedTranslations = new Map(
    [...translations].map(([key, value]) => [normaliseText(key), value])
  );

  function translatedText(value, language) {
    const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const core = match[2];
    const key = normaliseText(core);
    if (language === "zh-CN" && normalisedTranslations.has(key)) {
      return `${match[1]}${normalisedTranslations.get(key)}${match[3]}`;
    }
    return value;
  }

  function applyLanguage(language) {
    document.documentElement.lang = language;
    document.querySelectorAll("script, style").forEach((element) => {
      element.dataset.languageSkip = "true";
    });

    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest("script, style, .language-toggle")) continue;
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node);
      node.nodeValue = language === "zh-CN" ? translatedText(original, language) : original;
    }

    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      button.setAttribute("aria-label", language === "zh-CN" ? "Switch to English" : "切换到中文");
      if (button.dataset.languageState !== language) {
        button.dataset.languageState = language;
        button.innerHTML = language === "zh-CN"
          ? '<span>EN</span><span class="is-active">中文</span>'
          : '<span class="is-active">EN</span><span>中文</span>';
      }
    });
  }

  function addToggle() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-toggle";
    button.dataset.languageToggle = "true";
    button.addEventListener("click", () => {
      applyLanguage(document.documentElement.lang === "zh-CN" ? "en" : "zh-CN");
    });

    const navigation = document.querySelector(".landing-nav, .site-header .nav, .field-nav, .archive-status");
    if (navigation) {
      navigation.append(button);
    } else {
      button.classList.add("language-toggle-fixed");
      document.body.append(button);
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    .language-toggle {
      display: inline-flex;
      gap: 7px;
      align-items: center;
      padding: 3px 0;
      color: inherit;
      background: transparent;
      border: 0;
      font: inherit;
      font-size: 10px;
      letter-spacing: 0.04em;
      line-height: 1;
      cursor: pointer;
    }
    .language-toggle span { opacity: 0.42; }
    .language-toggle span + span::before { margin-right: 7px; content: "/"; opacity: 0.5; }
    .language-toggle .is-active { opacity: 1; }
    .language-toggle:focus-visible { outline: 1px solid currentColor; outline-offset: 5px; }
    .language-toggle-fixed {
      position: fixed;
      top: 22px;
      right: 24px;
      z-index: 1000;
      padding: 9px 11px;
      color: #1b1a18;
      background: rgba(247, 245, 240, 0.9);
      border: 1px solid rgba(27, 26, 24, 0.18);
      backdrop-filter: blur(10px);
    }
    html[lang="zh-CN"] body { font-family: "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; }
    html[lang="zh-CN"] h1,
    html[lang="zh-CN"] h2,
    html[lang="zh-CN"] h3,
    html[lang="zh-CN"] .about-intro-lead,
    html[lang="zh-CN"] .question-list p { letter-spacing: 0; }
    @media (max-width: 760px) {
      .landing-nav, .site-header .nav { align-items: center; }
      .language-toggle { font-size: 9px; }
    }
  `;
  document.head.append(style);

  addToggle();
  applyLanguage("en");

  let translationFrame = 0;
  const observer = new MutationObserver((mutations) => {
    if (document.documentElement.lang !== "zh-CN" || translationFrame) return;

    const hasRelevantAddition = mutations.some((mutation) =>
      [...mutation.addedNodes].some((node) => {
        const element = node.nodeType === Node.ELEMENT_NODE ? node : mutation.target;
        return !element.closest?.(".language-toggle, script, style");
      })
    );
    if (!hasRelevantAddition) return;

    translationFrame = window.requestAnimationFrame(() => {
      translationFrame = 0;
      if (document.documentElement.lang === "zh-CN") applyLanguage("zh-CN");
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
