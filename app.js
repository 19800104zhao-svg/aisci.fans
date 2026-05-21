const SUPPORTED_LANGUAGES = ["en", "zh", "ja"];
const SIGNAL_OPTIONS = ["frontier", "researcher", "talent", "lab", "capital"];
const ICONS = {
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
  "badge-check":
    '<path d="M8.5 2.8 12 1.6l3.5 1.2 2.2 3 3.3 1.2-.1 3.5 1.8 3-2.2 2.7-.7 3.4-3.5.6-2.9 2-3.1-1.7-3.4.3-1.3-3.2-2.7-2 .9-3.4-.9-3.4 2.7-2L5 3.6l3.5-.8Z"></path><path d="m8.5 12.2 2.4 2.4 4.8-5.1"></path>',
  bot:
    '<path d="M12 8V4H8"></path><rect x="4" y="8" width="16" height="12" rx="3"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M9 13h.01"></path><path d="M15 13h.01"></path><path d="M9 17h6"></path>',
  "clock-3": '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5h5"></path>',
  fingerprint:
    '<path d="M2 12c0-5.5 4.5-10 10-10 3.2 0 6 1.5 7.8 3.9"></path><path d="M5 19.5c1-1.7 1.5-3.6 1.5-5.5a5.5 5.5 0 0 1 11 0c0 1.3-.2 2.6-.7 3.8"></path><path d="M9.5 22c1.2-2.2 1.8-4.8 1.8-8a.7.7 0 0 1 1.4 0c0 2.8-.4 5.4-1.2 7.7"></path><path d="M14.8 21c.6-2.1.9-4.4.9-7a3.7 3.7 0 0 0-7.4 0c0 .8-.1 1.6-.3 2.4"></path>',
  "flask-conical":
    '<path d="M10 2v6.5L4.2 19A2 2 0 0 0 6 22h12a2 2 0 0 0 1.8-3L14 8.5V2"></path><path d="M8 2h8"></path><path d="M7 16h10"></path>',
  landmark:
    '<path d="M3 22h18"></path><path d="M6 18V9"></path><path d="M10 18V9"></path><path d="M14 18V9"></path><path d="M18 18V9"></path><path d="m12 2 9 5H3l9-5Z"></path>',
  "line-chart": '<path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-4 6"></path>',
  "mouse-pointer-2": '<path d="m4 4 7.1 16 2.1-6.8 6.8-2.1L4 4Z"></path><path d="m13.2 13.2 5.6 5.6"></path>',
  network:
    '<rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="M12 8v4"></path><path d="M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"></path>',
  orbit:
    '<circle cx="12" cy="12" r="3"></circle><path d="M19.5 12.5c1.9 3 2.3 5.6.9 7-1.9 1.9-6.7.2-10.8-3.9S3.8 6.7 5.7 4.8c1.4-1.4 4-.9 7 1"></path><path d="M4.5 11.5c-1.9-3-2.3-5.6-.9-7 1.9-1.9 6.7-.2 10.8 3.9s5.8 8.9 3.9 10.8c-1.4 1.4-4 .9-7-1"></path>',
  plus: '<path d="M12 5v14"></path><path d="M5 12h14"></path>',
  radar:
    '<path d="M19.1 4.9A10 10 0 1 1 4.9 19.1"></path><path d="M12 12 20 4"></path><path d="M7.8 12a4.2 4.2 0 0 1 4.2-4.2"></path><path d="M4.7 12A7.3 7.3 0 0 1 12 4.7"></path>',
  "refresh-cw": '<path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12A9 9 0 0 1 18.4 5.6L21 8"></path><path d="M16 8h5V3"></path>',
  search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"></path><path d="M22 2 11 13"></path>',
  "shield-alert": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path>',
  sparkles:
    '<path d="M12 3 10.4 8.4 5 10l5.4 1.6L12 17l1.6-5.4L19 10l-5.4-1.6L12 3Z"></path><path d="M19 15l-.8 2.2L16 18l2.2.8L19 21l.8-2.2L22 18l-2.2-.8L19 15Z"></path><path d="M5 3l-.7 1.7L2.5 5.5l1.8.7L5 8l.7-1.8 1.8-.7-1.8-.8L5 3Z"></path>',
  target: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.9"></path><path d="M16 3.1a4 4 0 0 1 0 7.8"></path>',
  x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
};

const UI_TEXT = {
  en: {
    langCode: "en",
    metaTitle: "AISci.fans | The 10 Great Scientific Questions",
    metaDescription:
      "AISci.fans maps the ten great scientific questions of 2026, connecting frontier problems, researchers, young talent, virtual labs, and venture capital.",
    sideRailAria: "AISci navigation",
    primaryNavAria: "Primary",
    brandSubtitle: "Global Science OS",
    navProblems: "Problems",
    navTalent: "Talent",
    navLabs: "Labs",
    navCapital: "Capital",
    navAtlas: "Atlas",
    atlasMiniTitle: "Atlas Agent",
    atlasMiniTime: "08:30 JST daily",
    atlasMiniDesc: "Automatically scans papers, code, patents, labs, and startup signals.",
    searchPlaceholder: "Search problems, researchers, labs, markets...",
    refreshAria: "Refresh intelligence",
    languageAria: "Language",
    submitSignal: "Submit Signal",
    heroKickerOne: "AI-native scientific governance",
    heroKickerTwo: "Problem first",
    heroTitle:
      "The 10 great scientific questions that should organize the next generation of research.",
    heroBody:
      "AISci.fans turns frontier problems into a living map of experts, proof-of-work young talent, virtual labs, datasets, funding, and venture-scale opportunities.",
    metricsAria: "Platform metrics",
    metricProblems: "great questions",
    metricSignals: "Atlas scan cycle",
    metricLabs: "launch target",
    graphAria: "AISci research graph visualization",
    graphCardOneLabel: "2026 watchlist",
    graphCardOneText: "AI safety · pandemics · energy",
    graphCardTwoLabel: "Proof-of-work",
    graphCardTwoText: "Students, labs, capital",
    problemsKicker: "Great Questions",
    problemsTitle: "The 10 scientific questions the world should organize around now",
    problemsLead:
      "Each question is chosen because it has scientific urgency, global stakes, young-talent entry points, and a plausible path to labs, capital, or new institutions.",
    problemFiltersAria: "Problem filters",
    filterAll: "All",
    filterBio: "Bio / Health",
    filterMaterials: "Energy / Materials",
    filterSafety: "AI Safety",
    filterRobotics: "Automation",
    problemDetailAria: "Selected problem details",
    problemDetailEmpty: "Select a problem",
    noMatchesTitle: "No matching research problems",
    noMatchesBody: "Atlas will keep scanning for new signals in this area.",
    detailScientificValue: "Scientific value",
    detailTalentReady: "Talent-ready",
    detailCommercialWatch: "Commercial watch",
    detailBottleneck: "Bottleneck",
    detailResearchers: "Researchers / Labs",
    detailTalent: "Young talent proof-of-work",
    detailCapital: "Capital thesis",
    detailOpenPage: "Open full problem page",
    talentKicker: "Talent Discovery",
    talentTitle: "Young talent should be discovered by proof, not by school names.",
    createPassport: "Create Research Passport",
    passportTitle: "Research Passport",
    passportBio: "Protein design · Shanghai · 19",
    proofOneLabel: "Paper replication",
    proofOneValue: "4 accepted",
    proofTwoLabel: "Open benchmark",
    proofTwoValue: "Top 3%",
    proofThreeLabel: "Expert review",
    proofThreeValue: "2 endorsements",
    proofFourLabel: "Code quality",
    proofFourValue: "Audited",
    challengesTitle: "Open Challenges",
    challengeOne: "Replicate a protein diffusion model and explain its failure cases",
    challengeOneMeta: "Mentor review",
    challengeTwo: "Write a falsifiable hypothesis for an AI safety problem",
    challengeTwoMeta: "48h sprint",
    challengeThree: "Predict materials synthesis feasibility with public data",
    challengeThreeMeta: "VC visible",
    hiddenSignalsTitle: "Hidden Talent Signals",
    signalOne: "Independent replication",
    signalTwo: "Cross-field synthesis",
    signalThree: "Benchmark improvement",
    signalFour: "Technical writing",
    labsKicker: "Virtual Labs",
    labsTitle: "Let top scientists organize global students around research agendas.",
    labOneStatus: "Recruiting",
    labOneTitle: "AI Drug Discovery Lab",
    labOneBody:
      "From target discovery to wet-lab validation, place publishable research and company-forming assets in the same workflow.",
    labOnePeople: "12 apprentices",
    labOneTasks: "5 open tasks",
    labTwoStatus: "Expert needed",
    labTwoTitle: "Autonomous Materials Lab",
    labTwoBody:
      "Build an interdisciplinary cohort around synthesis feasibility, experimental robotics, and materials property prediction.",
    labTwoPeople: "7 apprentices",
    labTwoTasks: "9 open tasks",
    labThreeStatus: "Funding gap",
    labThreeTitle: "Verifiable AI Safety Lab",
    labThreeBody:
      "Connect theory, formal verification, evaluation, and engineering auditability to find safety mechanisms that can actually ship.",
    labThreePeople: "18 apprentices",
    labThreeTasks: "6 open tasks",
    capitalKicker: "Capital Layer",
    capitalTitle:
      "VCs should see evidence that a problem is nearing commercialization, not just buzzwords.",
    opportunitiesTitle: "Translation Opportunities",
    oppOneTitle: "Protein binder design platforms",
    oppOneBody: "Evidence: new benchmarks, wet-lab partners, repeatable design loops",
    oppTwoTitle: "AI-native materials foundries",
    oppTwoBody: "Evidence: automated synthesis pipelines, property prediction, hardware demand",
    oppThreeTitle: "Research agent infrastructure",
    oppThreeBody: "Evidence: lab workflow automation, dataset curation, evaluation demand",
    riskTitle: "Risk Matrix",
    riskTechnical: "Technical",
    riskRegulatory: "Regulatory",
    riskIp: "IP",
    riskTeam: "Team",
    riskLow: "Low",
    riskMedium: "Medium",
    riskHigh: "High",
    atlasKicker: "Atlas Agent",
    atlasTitle: "Daily automation for the AISci science intelligence layer.",
    atlasSchedule: "Daily · 08:30 JST",
    queueTitle: "Today's Queue",
    queueOne: "Scan arXiv, bioRxiv, medRxiv, patents, GitHub, conference updates",
    queueTwo: "Score new frontier problems by scientific and commercial importance",
    queueThree: "Detect hidden young talent through public proof-of-work",
    queueFour: "Draft virtual lab proposals and VC diligence memos",
    schemaTitle: "Output Schema",
    schemaProblem: "Problem Card",
    schemaResearcher: "Researcher Node",
    schemaTalent: "Talent Signal",
    schemaLab: "Lab Proposal",
    schemaCapital: "Capital Memo",
    schemaSource: "Source Trail",
    modalKicker: "Signal Intake",
    modalTitle: "Add a research signal",
    closeSignalAria: "Close signal form",
    modalType: "Signal type",
    modalOptions: {
      frontier: "Frontier problem",
      researcher: "Researcher node",
      talent: "Young talent proof-of-work",
      lab: "Virtual lab proposal",
      capital: "Capital opportunity",
    },
    modalSignalTitle: "Title",
    modalTitlePlaceholder: "e.g. Autonomous wet-lab validation bottleneck",
    modalSource: "Source URL",
    modalNotes: "Why it matters",
    modalNotesPlaceholder:
      "Scientific value, bottleneck, talent signal, or commercialization thesis",
    modalSubmit: "Queue for Atlas",
    toastQueued: "Signal queued for Atlas review.",
    toastRefreshed: "Atlas intelligence layer refreshed.",
    graphCenterSubtitle: "Problem Graph",
    nodeLabels: [
      "Protein Design",
      "AI Safety",
      "Young Talent",
      "Virtual Labs",
      "VC Signals",
      "Materials",
      "Robotics",
      "Patents",
      "Open Tasks",
      "Experts",
      "Wet Labs",
      "Benchmarks",
    ],
  },
  zh: {
    langCode: "zh-CN",
    metaTitle: "AISci.fans | 全球十大科学问题",
    metaDescription:
      "AISci.fans 追踪 2026 年全球十大科学问题，连接前沿问题、研究者、年轻人才、虚拟实验室和风险资本。",
    sideRailAria: "AISci 导航",
    primaryNavAria: "主导航",
    brandSubtitle: "全球科学操作系统",
    navProblems: "问题库",
    navTalent: "人才",
    navLabs: "实验室",
    navCapital: "资本",
    navAtlas: "Atlas",
    atlasMiniTitle: "Atlas Agent",
    atlasMiniTime: "每日 08:30 JST",
    atlasMiniDesc: "自动扫描论文、代码、专利、实验室和创业信号。",
    searchPlaceholder: "搜索问题、研究者、实验室、市场...",
    refreshAria: "刷新情报",
    languageAria: "语言",
    submitSignal: "提交信号",
    heroKickerOne: "AI 原生科学治理",
    heroKickerTwo: "问题优先",
    heroTitle: "把下一代科研应该围绕的十大科学问题摆在首页。",
    heroBody:
      "AISci.fans 把前沿问题转化为一张动态地图：专家、年轻人才 proof-of-work、虚拟实验室、数据集、资金和可公司化机会都围绕问题组织。",
    metricsAria: "平台指标",
    metricProblems: "重大问题",
    metricSignals: "Atlas 扫描周期",
    metricLabs: "上线目标",
    graphAria: "AISci 研究图谱可视化",
    graphCardOneLabel: "2026 观察清单",
    graphCardOneText: "AI 安全 · 大流行 · 能源",
    graphCardTwoLabel: "Proof-of-work",
    graphCardTwoText: "学生、实验室、资本",
    problemsKicker: "重大问题",
    problemsTitle: "眼下全球科研最应该围绕的 10 个问题",
    problemsLead:
      "这些问题同时具备科学紧迫性、全球影响、年轻人才可参与入口，以及形成实验室、资本或新机构的可能。",
    problemFiltersAria: "问题筛选",
    filterAll: "全部",
    filterBio: "生物 / 健康",
    filterMaterials: "能源 / 材料",
    filterSafety: "AI 安全",
    filterRobotics: "自动化",
    problemDetailAria: "选中问题详情",
    problemDetailEmpty: "选择一个问题",
    noMatchesTitle: "没有匹配的研究问题",
    noMatchesBody: "Atlas 会继续扫描这个方向的新信号。",
    detailScientificValue: "科学价值",
    detailTalentReady: "适合人才参与",
    detailCommercialWatch: "商业化观察",
    detailBottleneck: "核心瓶颈",
    detailResearchers: "研究者 / 实验室",
    detailTalent: "年轻人才 proof-of-work",
    detailCapital: "资本判断",
    detailOpenPage: "进入完整问题页",
    talentKicker: "人才发现",
    talentTitle: "年轻人才不是靠学校被发现，而是靠作品被验证。",
    createPassport: "创建研究护照",
    passportTitle: "研究护照",
    passportBio: "蛋白质设计 · 上海 · 19 岁",
    proofOneLabel: "论文复现",
    proofOneValue: "4 项通过",
    proofTwoLabel: "开放 benchmark",
    proofTwoValue: "前 3%",
    proofThreeLabel: "专家评审",
    proofThreeValue: "2 个背书",
    proofFourLabel: "代码质量",
    proofFourValue: "已审计",
    challengesTitle: "开放挑战",
    challengeOne: "复现一个蛋白质扩散模型并解释失败样本",
    challengeOneMeta: "导师评审",
    challengeTwo: "为 AI Safety 问题写一份可反驳假设",
    challengeTwoMeta: "48 小时冲刺",
    challengeThree: "用公开数据预测材料合成可行性",
    challengeThreeMeta: "VC 可见",
    hiddenSignalsTitle: "隐藏人才信号",
    signalOne: "独立复现能力",
    signalTwo: "跨领域综合",
    signalThree: "Benchmark 改进",
    signalFour: "技术写作",
    labsKicker: "虚拟实验室",
    labsTitle: "让顶级科学家以研究议程组织全球学生。",
    labOneStatus: "招募中",
    labOneTitle: "AI 药物发现实验室",
    labOneBody: "从靶点发现到湿实验验证，把可发表研究和可公司化资产放在同一个工作流里。",
    labOnePeople: "12 名学徒",
    labOneTasks: "5 个开放任务",
    labTwoStatus: "需要专家",
    labTwoTitle: "自主材料实验室",
    labTwoBody: "围绕合成可行性、实验机器人和材料性质预测建立跨学科研究队列。",
    labTwoPeople: "7 名学徒",
    labTwoTasks: "9 个开放任务",
    labThreeStatus: "资金缺口",
    labThreeTitle: "可验证 AI Safety 实验室",
    labThreeBody: "把理论、形式化验证、评测和工程可审计性连接起来，寻找真正能落地的安全机制。",
    labThreePeople: "18 名学徒",
    labThreeTasks: "6 个开放任务",
    capitalKicker: "资本层",
    capitalTitle: "VC 看到的不是热词，而是问题接近商业化临界点的证据。",
    opportunitiesTitle: "转化机会",
    oppOneTitle: "蛋白质结合物设计平台",
    oppOneBody: "证据：新 benchmark、湿实验伙伴、可重复设计闭环",
    oppTwoTitle: "AI 原生材料 foundry",
    oppTwoBody: "证据：自动化合成流程、性质预测、硬件需求",
    oppThreeTitle: "科研 agent 基础设施",
    oppThreeBody: "证据：实验室流程自动化、数据集整理、评测需求",
    riskTitle: "风险矩阵",
    riskTechnical: "技术",
    riskRegulatory: "监管",
    riskIp: "知识产权",
    riskTeam: "团队",
    riskLow: "低",
    riskMedium: "中",
    riskHigh: "高",
    atlasKicker: "Atlas Agent",
    atlasTitle: "每日自动更新 AISci 的科学情报层。",
    atlasSchedule: "每日 · 08:30 JST",
    queueTitle: "今日队列",
    queueOne: "扫描 arXiv、bioRxiv、medRxiv、专利、GitHub、会议更新",
    queueTwo: "按科学价值和商业价值为新前沿问题打分",
    queueThree: "通过公开 proof-of-work 发现隐藏年轻人才",
    queueFour: "生成虚拟实验室提案和 VC 尽调 memo",
    schemaTitle: "输出结构",
    schemaProblem: "问题卡",
    schemaResearcher: "研究者节点",
    schemaTalent: "人才信号",
    schemaLab: "实验室提案",
    schemaCapital: "资本 memo",
    schemaSource: "来源链路",
    modalKicker: "信号提交",
    modalTitle: "添加研究信号",
    closeSignalAria: "关闭信号表单",
    modalType: "信号类型",
    modalOptions: {
      frontier: "前沿问题",
      researcher: "研究者节点",
      talent: "年轻人才 proof-of-work",
      lab: "虚拟实验室提案",
      capital: "资本机会",
    },
    modalSignalTitle: "标题",
    modalTitlePlaceholder: "例如：自主湿实验验证瓶颈",
    modalSource: "来源 URL",
    modalNotes: "为什么重要",
    modalNotesPlaceholder: "科学价值、瓶颈、人才信号或商业化判断",
    modalSubmit: "交给 Atlas 排队",
    toastQueued: "已加入 Atlas 审查队列。",
    toastRefreshed: "Atlas 情报层已刷新。",
    graphCenterSubtitle: "问题图谱",
    nodeLabels: [
      "蛋白质设计",
      "AI 安全",
      "年轻人才",
      "虚拟实验室",
      "VC 信号",
      "材料",
      "机器人",
      "专利",
      "开放任务",
      "专家",
      "湿实验",
      "Benchmark",
    ],
  },
  ja: {
    langCode: "ja-JP",
    metaTitle: "AISci.fans | 世界の10大科学課題",
    metaDescription:
      "AISci.fans は 2026 年の世界の10大科学課題を整理し、先端課題、研究者、若い才能、バーチャルラボ、資本をつなぎます。",
    sideRailAria: "AISci ナビゲーション",
    primaryNavAria: "メインナビゲーション",
    brandSubtitle: "グローバル科学 OS",
    navProblems: "課題",
    navTalent: "才能",
    navLabs: "ラボ",
    navCapital: "資本",
    navAtlas: "Atlas",
    atlasMiniTitle: "Atlas Agent",
    atlasMiniTime: "毎日 08:30 JST",
    atlasMiniDesc: "論文、コード、特許、ラボ、スタートアップ信号を自動スキャン。",
    searchPlaceholder: "課題、研究者、ラボ、市場を検索...",
    refreshAria: "インテリジェンスを更新",
    languageAria: "言語",
    submitSignal: "信号を送信",
    heroKickerOne: "AI ネイティブ科学ガバナンス",
    heroKickerTwo: "課題起点",
    heroTitle: "次世代の研究を組織すべき10の大きな科学課題。",
    heroBody:
      "AISci.fans は先端課題を中心に、専門家、若い才能の proof-of-work、バーチャルラボ、データセット、資金、事業化機会を動的な地図にします。",
    metricsAria: "プラットフォーム指標",
    metricProblems: "大きな課題",
    metricSignals: "Atlas スキャン周期",
    metricLabs: "公開目標",
    graphAria: "AISci 研究グラフ可視化",
    graphCardOneLabel: "2026 ウォッチリスト",
    graphCardOneText: "AI 安全性 · パンデミック · エネルギー",
    graphCardTwoLabel: "Proof-of-work",
    graphCardTwoText: "学生、ラボ、資本",
    problemsKicker: "大きな課題",
    problemsTitle: "いま世界の研究が向き合うべき10の科学課題",
    problemsLead:
      "科学的緊急性、世界的インパクト、若い才能の参加余地、ラボ・資本・新機関につながる可能性を基準に選んでいます。",
    problemFiltersAria: "課題フィルター",
    filterAll: "すべて",
    filterBio: "バイオ / 健康",
    filterMaterials: "エネルギー / 材料",
    filterSafety: "AI 安全性",
    filterRobotics: "自動化",
    problemDetailAria: "選択した課題の詳細",
    problemDetailEmpty: "課題を選択",
    noMatchesTitle: "一致する研究課題がありません",
    noMatchesBody: "Atlas がこの領域の新しい信号を継続的にスキャンします。",
    detailScientificValue: "科学的価値",
    detailTalentReady: "才能が参加可能",
    detailCommercialWatch: "事業化ウォッチ",
    detailBottleneck: "ボトルネック",
    detailResearchers: "研究者 / ラボ",
    detailTalent: "若い才能の proof-of-work",
    detailCapital: "資本仮説",
    detailOpenPage: "課題ページを開く",
    talentKicker: "才能発見",
    talentTitle: "若い才能は学校名ではなく、証明された成果で発見されるべきです。",
    createPassport: "研究パスポート作成",
    passportTitle: "研究パスポート",
    passportBio: "タンパク質設計 · 上海 · 19 歳",
    proofOneLabel: "論文再現",
    proofOneValue: "4 件承認",
    proofTwoLabel: "公開 benchmark",
    proofTwoValue: "上位 3%",
    proofThreeLabel: "専門家レビュー",
    proofThreeValue: "2 件の推薦",
    proofFourLabel: "コード品質",
    proofFourValue: "監査済み",
    challengesTitle: "オープンチャレンジ",
    challengeOne: "タンパク質拡散モデルを再現し、失敗例を説明する",
    challengeOneMeta: "メンターレビュー",
    challengeTwo: "AI Safety 課題に反証可能な仮説を書く",
    challengeTwoMeta: "48 時間スプリント",
    challengeThree: "公開データで材料合成可能性を予測する",
    challengeThreeMeta: "VC 可視",
    hiddenSignalsTitle: "隠れた才能シグナル",
    signalOne: "独立再現",
    signalTwo: "分野横断の統合",
    signalThree: "Benchmark 改善",
    signalFour: "技術文章力",
    labsKicker: "バーチャルラボ",
    labsTitle: "トップ科学者が研究アジェンダで世界中の学生を組織する。",
    labOneStatus: "募集中",
    labOneTitle: "AI 創薬ラボ",
    labOneBody:
      "標的発見からウェットラボ検証まで、論文化できる研究と会社化できる資産を同じワークフローに置きます。",
    labOnePeople: "12 名の見習い",
    labOneTasks: "5 件の公開タスク",
    labTwoStatus: "専門家募集",
    labTwoTitle: "自律型材料ラボ",
    labTwoBody:
      "合成可能性、実験ロボティクス、材料特性予測を軸に、分野横断の研究チームを作ります。",
    labTwoPeople: "7 名の見習い",
    labTwoTasks: "9 件の公開タスク",
    labThreeStatus: "資金ギャップ",
    labThreeTitle: "検証可能 AI Safety ラボ",
    labThreeBody:
      "理論、形式検証、評価、エンジニアリング監査性を接続し、実装できる安全機構を探します。",
    labThreePeople: "18 名の見習い",
    labThreeTasks: "6 件の公開タスク",
    capitalKicker: "資本レイヤー",
    capitalTitle: "VC が見るべきものは流行語ではなく、事業化が近いという証拠です。",
    opportunitiesTitle: "事業化機会",
    oppOneTitle: "タンパク質バインダー設計プラットフォーム",
    oppOneBody: "証拠：新 benchmark、ウェットラボ提携、再現可能な設計ループ",
    oppTwoTitle: "AI ネイティブ材料ファウンドリ",
    oppTwoBody: "証拠：自動合成パイプライン、物性予測、ハードウェア需要",
    oppThreeTitle: "研究 agent インフラ",
    oppThreeBody: "証拠：ラボ業務自動化、データセット整備、評価需要",
    riskTitle: "リスクマトリクス",
    riskTechnical: "技術",
    riskRegulatory: "規制",
    riskIp: "知財",
    riskTeam: "チーム",
    riskLow: "低",
    riskMedium: "中",
    riskHigh: "高",
    atlasKicker: "Atlas Agent",
    atlasTitle: "AISci の科学インテリジェンス層を毎日自動更新。",
    atlasSchedule: "毎日 · 08:30 JST",
    queueTitle: "今日のキュー",
    queueOne: "arXiv、bioRxiv、medRxiv、特許、GitHub、会議更新をスキャン",
    queueTwo: "新しい先端課題を科学的価値と商業価値でスコアリング",
    queueThree: "公開 proof-of-work から隠れた若い才能を検出",
    queueFour: "バーチャルラボ提案と VC 向けデューデリジェンスメモを作成",
    schemaTitle: "出力スキーマ",
    schemaProblem: "課題カード",
    schemaResearcher: "研究者ノード",
    schemaTalent: "才能シグナル",
    schemaLab: "ラボ提案",
    schemaCapital: "資本メモ",
    schemaSource: "ソース履歴",
    modalKicker: "シグナル入力",
    modalTitle: "研究シグナルを追加",
    closeSignalAria: "シグナルフォームを閉じる",
    modalType: "シグナル種別",
    modalOptions: {
      frontier: "先端課題",
      researcher: "研究者ノード",
      talent: "若い才能の proof-of-work",
      lab: "バーチャルラボ提案",
      capital: "資本機会",
    },
    modalSignalTitle: "タイトル",
    modalTitlePlaceholder: "例：自律型ウェットラボ検証のボトルネック",
    modalSource: "ソース URL",
    modalNotes: "なぜ重要か",
    modalNotesPlaceholder: "科学的価値、ボトルネック、才能シグナル、事業化仮説",
    modalSubmit: "Atlas キューへ追加",
    toastQueued: "Atlas レビューキューに追加しました。",
    toastRefreshed: "Atlas インテリジェンス層を更新しました。",
    graphCenterSubtitle: "課題グラフ",
    nodeLabels: [
      "タンパク質設計",
      "AI 安全性",
      "若い才能",
      "仮想ラボ",
      "VC 信号",
      "材料",
      "ロボット",
      "特許",
      "公開タスク",
      "専門家",
      "湿実験",
      "Benchmark",
    ],
  },
};

const PROBLEMS = [
  {
    id: "frontier-ai-audit",
    domain: "safety",
    score: 98,
    content: {
      en: {
        title: "How can frontier AI systems be scientifically audited before deployment?",
        summary:
          "The world needs AI safety to become measurable engineering: evaluations, monitoring, red-teaming, governance, and independent audit trails.",
        tags: ["AI Safety", "Evaluation", "Governance"],
        bottleneck:
          "Capabilities move faster than public test methods, while many evaluations can be gamed or fail outside benchmark settings.",
        researchers: ["UK AI Security Institute", "METR", "ARC Evals", "Anthropic"],
        talent: ["Build anti-gaming evals", "Replicate safety protocols", "Write falsifiable threat models"],
        capital: "Model audit, compliance infrastructure, safety monitoring, and enterprise AI governance can become real markets.",
      },
      zh: {
        title: "前沿 AI 系统在部署前如何被科学审计？",
        summary: "AI 安全必须从口号变成可测量工程：评测、监控、红队、治理和独立审计链路。",
        tags: ["AI 安全", "评测", "治理"],
        bottleneck: "能力进展快于公开测试方法，许多评测容易被模型适应，也难覆盖真实开放环境。",
        researchers: ["UK AI Security Institute", "METR", "ARC Evals", "Anthropic"],
        talent: ["设计反作弊评测", "复现实验协议", "写可反驳威胁模型"],
        capital: "模型审计、合规基础设施、安全监控和企业 AI 治理会形成真实市场。",
      },
      ja: {
        title: "先端 AI システムを導入前に科学的に監査するには何が必要か？",
        summary:
          "AI 安全性は、評価、監視、レッドチーム、ガバナンス、独立監査を含む測定可能な工学になる必要があります。",
        tags: ["AI 安全性", "評価", "ガバナンス"],
        bottleneck:
          "能力の進歩が公開テスト手法を上回り、多くの評価はモデルに適応されるか実環境で崩れます。",
        researchers: ["UK AI Security Institute", "METR", "ARC Evals", "Anthropic"],
        talent: ["対策困難な評価を設計", "安全プロトコルを再現", "反証可能な脅威モデルを書く"],
        capital: "モデル監査、コンプライアンス基盤、安全監視、企業 AI ガバナンスは市場になり得ます。",
      },
    },
  },
  {
    id: "reproducible-ai-science",
    domain: "safety",
    score: 96,
    content: {
      en: {
        title: "How can AI accelerate discovery without making science less reproducible?",
        summary:
          "Research agents can multiply output, but science only improves if evidence, code, data, uncertainty, and failed attempts remain traceable.",
        tags: ["Research Agents", "Reproducibility", "Open Science"],
        bottleneck:
          "Agent-generated claims often lack provenance, negative results, experimental constraints, and durable review workflows.",
        researchers: ["FutureHouse", "Sakana AI", "OpenAI", "Open science communities"],
        talent: ["Audit source trails", "Build replication tasks", "Benchmark agent experiment design"],
        capital: "Research operating systems, pharma knowledge tools, and automated diligence platforms are early entry points.",
      },
      zh: {
        title: "AI 如何加速科学发现，同时不削弱可复现性？",
        summary: "科研 agent 可以放大产出，但只有证据、代码、数据、不确定性和失败尝试都可追踪，科学才真的进步。",
        tags: ["科研 Agent", "可复现性", "开放科学"],
        bottleneck: "Agent 生成的结论经常缺少来源链路、负结果、实验约束和长期评审流程。",
        researchers: ["FutureHouse", "Sakana AI", "OpenAI", "开放科学社区"],
        talent: ["审计来源链路", "构建复现任务", "评测 agent 实验设计"],
        capital: "科研操作系统、药企知识工具和自动化尽调平台是早期入口。",
      },
      ja: {
        title: "AI は科学の再現性を損なわずに発見を加速できるのか？",
        summary:
          "研究 agent はアウトプットを増やせますが、証拠、コード、データ、不確実性、失敗例が追跡できて初めて科学は進歩します。",
        tags: ["研究 Agent", "再現性", "オープンサイエンス"],
        bottleneck:
          "Agent 生成の主張には、出典履歴、否定的結果、実験制約、長期レビュー手順が欠けがちです。",
        researchers: ["FutureHouse", "Sakana AI", "OpenAI", "オープンサイエンスコミュニティ"],
        talent: ["ソース履歴を監査", "再現タスクを作る", "agent の実験設計を評価"],
        capital: "研究 OS、製薬知識ツール、自動デューデリジェンス基盤が初期入口です。",
      },
    },
  },
  {
    id: "validated-ai-medicine",
    domain: "biology",
    score: 95,
    content: {
      en: {
        title: "How can AI-designed proteins and medicines become validated therapies?",
        summary:
          "Protein design, generative chemistry, and biological foundation models are advancing, but clinical value still depends on validation loops.",
        tags: ["AI Biology", "Protein Design", "Therapeutics"],
        bottleneck:
          "Model scores still diverge from binding, stability, toxicity, immunogenicity, manufacturability, and clinical outcomes.",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute", "DeepMind"],
        talent: ["Replicate design models", "Build failure-case libraries", "Design wet-lab benchmarks"],
        capital: "Platform biotech, automated CROs, biological data assets, and modality-specific startups are plausible paths.",
      },
      zh: {
        title: "AI 设计的蛋白质和药物如何成为经过验证的疗法？",
        summary: "蛋白质设计、生成式化学和生物基础模型都在进步，但临床价值仍取决于验证闭环。",
        tags: ["AI 生物学", "蛋白质设计", "疗法"],
        bottleneck: "模型评分和真实结合、稳定性、毒性、免疫原性、可制造性、临床结果之间仍有落差。",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute", "DeepMind"],
        talent: ["复现设计模型", "构建失败样本库", "设计湿实验 benchmark"],
        capital: "平台型 biotech、自动化 CRO、生物数据资产和特定疗法公司都有机会。",
      },
      ja: {
        title: "AI 設計タンパク質と薬は、どうすれば検証済み治療法になるのか？",
        summary:
          "タンパク質設計、生成化学、生物基盤モデルは進歩していますが、臨床価値は検証ループに依存します。",
        tags: ["AI 生物学", "タンパク質設計", "治療法"],
        bottleneck:
          "モデルスコアと結合、安定性、毒性、免疫原性、製造可能性、臨床結果にはまだ差があります。",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute", "DeepMind"],
        talent: ["設計モデルを再現", "失敗例ライブラリを構築", "湿実験 benchmark を設計"],
        capital: "プラットフォーム biotech、自動化 CRO、生物データ資産、治療モダリティ別企業に機会があります。",
      },
    },
  },
  {
    id: "pandemic-early-warning",
    domain: "biology",
    score: 94,
    content: {
      en: {
        title: "How can the world detect and stop the next pandemic before it spreads?",
        summary:
          "Wastewater, genomic surveillance, animal monitoring, clinical signals, and AI triage need to become one early-warning network.",
        tags: ["Pandemic Prevention", "Genomics", "Public Health"],
        bottleneck:
          "Surveillance data is fragmented across borders, species, hospitals, sequencing labs, and public health agencies.",
        researchers: ["WHO networks", "GISAID community", "Broad Institute", "Pandemic preparedness labs"],
        talent: ["Analyze outbreak data", "Build pathogen dashboards", "Model spillover risk"],
        capital: "Diagnostics, biosurveillance software, rapid vaccine infrastructure, and public-health data tools have demand.",
      },
      zh: {
        title: "世界如何在下一次大流行扩散前发现并阻止它？",
        summary: "污水监测、基因组监测、动物监测、临床信号和 AI 分诊需要连成一个早期预警网络。",
        tags: ["大流行预防", "基因组学", "公共卫生"],
        bottleneck: "监测数据分散在国家、物种、医院、测序实验室和公共卫生机构之间。",
        researchers: ["WHO networks", "GISAID community", "Broad Institute", "大流行准备实验室"],
        talent: ["分析暴发数据", "构建病原体仪表盘", "建模溢出风险"],
        capital: "诊断、生命监测软件、快速疫苗基础设施和公共卫生数据工具都有需求。",
      },
      ja: {
        title: "次のパンデミックを拡大前に検出し止めるにはどうすればよいか？",
        summary:
          "下水、ゲノム、動物、臨床信号、AI トリアージを一つの早期警戒ネットワークにする必要があります。",
        tags: ["パンデミック予防", "ゲノム", "公衆衛生"],
        bottleneck:
          "監視データは国境、種、病院、シーケンスラボ、公衆衛生機関に分散しています。",
        researchers: ["WHO networks", "GISAID community", "Broad Institute", "パンデミック対策ラボ"],
        talent: ["アウトブレイクデータを分析", "病原体ダッシュボードを作る", "スピルオーバーリスクをモデル化"],
        capital: "診断、バイオ監視ソフト、迅速ワクチン基盤、公衆衛生データツールに需要があります。",
      },
    },
  },
  {
    id: "antimicrobial-resistance",
    domain: "biology",
    score: 93,
    content: {
      en: {
        title:
          "How can humanity beat antimicrobial resistance with diagnostics, drugs, vaccines, and stewardship?",
        summary:
          "Drug-resistant infections are a slow-moving global crisis that needs better incentives, faster diagnostics, new modalities, and usage discipline.",
        tags: ["AMR", "Diagnostics", "Drug Discovery"],
        bottleneck:
          "Antibiotic economics are broken: society needs reserve drugs, but companies need sustainable markets and clinical trial paths.",
        researchers: ["WHO AMR programs", "CARB-X", "Wellcome", "Antibiotic discovery labs"],
        talent: ["Mine resistance datasets", "Design rapid diagnostics", "Model stewardship strategies"],
        capital: "Rapid diagnostics, phage platforms, narrow-spectrum drugs, and hospital decision software can unlock adoption.",
      },
      zh: {
        title: "人类如何用诊断、药物、疫苗和管理战胜抗菌药耐药性？",
        summary: "耐药感染是缓慢发生的全球危机，需要更好的激励、更快诊断、新疗法和用药纪律。",
        tags: ["AMR", "诊断", "药物发现"],
        bottleneck: "抗生素经济模型失灵：社会需要储备药物，公司却需要可持续市场和临床路径。",
        researchers: ["WHO AMR programs", "CARB-X", "Wellcome", "抗生素发现实验室"],
        talent: ["挖掘耐药数据集", "设计快速诊断", "建模用药管理策略"],
        capital: "快速诊断、噬菌体平台、窄谱药物和医院决策软件可以推动采用。",
      },
      ja: {
        title: "診断、薬、ワクチン、管理で薬剤耐性に勝つにはどうすればよいか？",
        summary:
          "薬剤耐性感染症はゆっくり進む世界的危機であり、より良いインセンティブ、迅速診断、新規モダリティ、使用管理が必要です。",
        tags: ["AMR", "診断", "創薬"],
        bottleneck:
          "抗生物質の経済性は壊れています。社会は予備薬を必要としますが、企業には持続可能な市場と臨床経路が必要です。",
        researchers: ["WHO AMR programs", "CARB-X", "Wellcome", "抗生物質発見ラボ"],
        talent: ["耐性データセットを解析", "迅速診断を設計", "使用管理戦略をモデル化"],
        capital: "迅速診断、ファージ基盤、狭域薬、病院意思決定ソフトが普及を促せます。",
      },
    },
  },
  {
    id: "autonomous-climate-materials",
    domain: "materials",
    score: 96,
    content: {
      en: {
        title: "Can autonomous labs discover batteries, catalysts, chips, and climate materials fast enough?",
        summary:
          "Self-driving labs could compress discovery cycles for batteries, catalysts, semiconductors, carbon capture, and industrial materials.",
        tags: ["Autonomous Labs", "Materials", "Climate Tech"],
        bottleneck:
          "Robotic experiments, synthesis feasibility, failed-result capture, and model feedback loops remain poorly standardized.",
        researchers: ["Materials Project", "Self-driving lab groups", "Robotic chemistry labs"],
        talent: ["Curate failed experiments", "Predict synthesis routes", "Connect robot-control interfaces"],
        capital: "Batteries, semiconductors, catalysts, critical minerals, and industrial decarbonization are early markets.",
      },
      zh: {
        title: "自主实验室能否足够快地发现电池、催化剂、芯片和气候材料？",
        summary: "自驱实验室有机会压缩电池、催化剂、半导体、碳捕获和工业材料的发现周期。",
        tags: ["自主实验室", "材料", "气候科技"],
        bottleneck: "机器人实验、合成可行性、失败结果记录和模型反馈闭环仍缺少标准化。",
        researchers: ["Materials Project", "Self-driving lab groups", "Robotic chemistry labs"],
        talent: ["整理失败实验", "预测合成路线", "连接机器人控制接口"],
        capital: "电池、半导体、催化剂、关键矿物和工业脱碳是早期市场。",
      },
      ja: {
        title: "自律型ラボは電池、触媒、チップ、気候材料を十分速く発見できるのか？",
        summary:
          "自動運転ラボは、電池、触媒、半導体、炭素回収、産業材料の発見サイクルを圧縮できます。",
        tags: ["自律型ラボ", "材料", "気候テック"],
        bottleneck:
          "ロボット実験、合成可能性、失敗結果の収集、モデルへのフィードバックがまだ標準化されていません。",
        researchers: ["Materials Project", "Self-driving lab groups", "Robotic chemistry labs"],
        talent: ["失敗実験を整理", "合成経路を予測", "ロボット制御インターフェースを接続"],
        capital: "電池、半導体、触媒、重要鉱物、産業脱炭素が初期市場です。",
      },
    },
  },
  {
    id: "clean-power-ai-grid",
    domain: "materials",
    score: 95,
    content: {
      en: {
        title: "How can clean power, grids, storage, and critical minerals support AI and electrification?",
        summary:
          "AI data centers, electrified transport, heat, and industry all increase demand for reliable clean power and resilient grids.",
        tags: ["Energy", "Grid", "Critical Minerals"],
        bottleneck:
          "Permitting, interconnection queues, storage duration, transmission buildout, and mineral supply chains are all rate limits.",
        researchers: ["IEA", "National labs", "Grid modeling groups", "Battery research labs"],
        talent: ["Model grid bottlenecks", "Analyze storage economics", "Map critical-mineral constraints"],
        capital: "Grid software, long-duration storage, geothermal, nuclear services, demand response, and mineral processing matter.",
      },
      zh: {
        title: "清洁电力、电网、储能和关键矿物如何支撑 AI 与电气化？",
        summary: "AI 数据中心、交通、供热和工业电气化都会增加可靠清洁电力和韧性电网需求。",
        tags: ["能源", "电网", "关键矿物"],
        bottleneck: "许可、并网排队、储能时长、输电建设和矿物供应链都是限制因素。",
        researchers: ["IEA", "国家实验室", "电网建模团队", "电池研究实验室"],
        talent: ["建模电网瓶颈", "分析储能经济性", "绘制关键矿物约束"],
        capital: "电网软件、长时储能、地热、核能服务、需求响应和矿物加工都很重要。",
      },
      ja: {
        title: "クリーン電力、送電網、蓄電、重要鉱物は AI と電化をどう支えるのか？",
        summary:
          "AI データセンター、交通、熱、産業の電化は、信頼できるクリーン電力と強靭な送電網の需要を増やします。",
        tags: ["エネルギー", "送電網", "重要鉱物"],
        bottleneck:
          "許認可、接続待ち、蓄電時間、送電建設、鉱物サプライチェーンが制約になります。",
        researchers: ["IEA", "国立研究所", "送電網モデル研究者", "電池研究ラボ"],
        talent: ["送電網ボトルネックをモデル化", "蓄電経済性を分析", "重要鉱物制約を地図化"],
        capital: "送電網ソフト、長時間蓄電、地熱、原子力サービス、需要応答、鉱物処理が重要です。",
      },
    },
  },
  {
    id: "resilient-food-systems",
    domain: "biology",
    score: 91,
    content: {
      en: {
        title:
          "How can agriculture fix nitrogen, water stress, and soil carbon while protecting food security?",
        summary:
          "Food systems must produce more with less fertilizer waste, less water stress, healthier soils, and lower climate risk.",
        tags: ["Food Security", "Synthetic Biology", "Climate"],
        bottleneck:
          "Field variability, farmer incentives, regulation, biological complexity, and measurement of soil outcomes slow adoption.",
        researchers: ["CGIAR", "Plant science labs", "Soil carbon groups", "Ag biotech teams"],
        talent: ["Analyze crop trials", "Model nitrogen flows", "Build soil measurement protocols"],
        capital: "Biological inputs, crop resilience, precision irrigation, soil measurement, and ag data tools are investable.",
      },
      zh: {
        title: "农业如何同时解决氮肥、水压力和土壤碳，又保护粮食安全？",
        summary: "粮食系统需要用更少的肥料浪费、更低水压力、更健康土壤和更低气候风险生产更多食物。",
        tags: ["粮食安全", "合成生物学", "气候"],
        bottleneck: "田间差异、农民激励、监管、生物复杂性和土壤结果测量都会拖慢采用。",
        researchers: ["CGIAR", "植物科学实验室", "土壤碳团队", "农业生物技术团队"],
        talent: ["分析作物试验", "建模氮循环", "构建土壤测量协议"],
        capital: "生物投入品、作物韧性、精准灌溉、土壤测量和农业数据工具值得关注。",
      },
      ja: {
        title: "食料安全を守りながら、窒素、水ストレス、土壌炭素をどう解決するのか？",
        summary:
          "食料システムは、肥料ロス、水ストレス、土壌劣化、気候リスクを抑えながら生産性を高める必要があります。",
        tags: ["食料安全保障", "合成生物学", "気候"],
        bottleneck:
          "圃場差、農家インセンティブ、規制、生物複雑性、土壌成果の測定が普及を遅らせます。",
        researchers: ["CGIAR", "植物科学ラボ", "土壌炭素研究者", "農業 biotech チーム"],
        talent: ["作物試験を分析", "窒素フローをモデル化", "土壌測定プロトコルを作る"],
        capital: "生物資材、作物レジリエンス、精密灌漑、土壌測定、農業データツールに機会があります。",
      },
    },
  },
  {
    id: "robotic-science-work",
    domain: "robotics",
    score: 90,
    content: {
      en: {
        title: "How can robots become safe, reliable research assistants in real physical environments?",
        summary:
          "Science automation needs robots that can operate, observe, correct mistakes, follow protocols, and work around humans.",
        tags: ["Robotics", "Lab Automation", "Embodied AI"],
        bottleneck:
          "Long-horizon reliability, hardware variation, safety constraints, and low-error experimental work make generalization hard.",
        researchers: ["Stanford Robotics", "Berkeley AI Research", "DeepMind Robotics", "Lab automation teams"],
        talent: ["Build lab task datasets", "Improve visual correction", "Evaluate long-horizon success"],
        capital: "Lab automation hardware, robot software stacks, and vertical research services all have room.",
      },
      zh: {
        title: "机器人如何在真实物理环境中成为安全可靠的科研助手？",
        summary: "科学自动化需要机器人能操作、观测、纠错、遵循 protocol，并在人类周围安全工作。",
        tags: ["机器人", "实验室自动化", "具身 AI"],
        bottleneck: "长程可靠性、硬件差异、安全约束和低容错实验使泛化非常困难。",
        researchers: ["Stanford Robotics", "Berkeley AI Research", "DeepMind Robotics", "实验室自动化团队"],
        talent: ["构建实验任务数据集", "改进视觉纠错", "评测长程成功率"],
        capital: "实验室自动化硬件、机器人软件栈和垂直科研服务都有机会。",
      },
      ja: {
        title: "ロボットは現実の物理環境で安全で信頼できる研究助手になれるのか？",
        summary:
          "科学自動化には、操作、観察、修正、プロトコル遵守、人間周辺での安全作業ができるロボットが必要です。",
        tags: ["ロボティクス", "ラボ自動化", "身体性 AI"],
        bottleneck:
          "長期信頼性、ハードウェア差、安全制約、低エラー実験が汎化を難しくしています。",
        researchers: ["Stanford Robotics", "Berkeley AI Research", "DeepMind Robotics", "ラボ自動化チーム"],
        talent: ["実験タスクデータセットを構築", "視覚的修正を改善", "長期成功率を評価"],
        capital: "ラボ自動化ハードウェア、ロボットソフトウェアスタック、垂直型研究サービスに機会があります。",
      },
    },
  },
  {
    id: "science-to-company",
    domain: "safety",
    score: 92,
    content: {
      en: {
        title: "How can discoveries become companies without losing openness, trust, and global talent mobility?",
        summary:
          "The world needs better paths from research problem to proof, lab, company, capital, and public benefit without locking talent inside institutions.",
        tags: ["Science Commercialization", "Talent", "Venture"],
        bottleneck:
          "Universities, labs, founders, students, investors, and governments all hold pieces of the workflow but rarely share one operating system.",
        researchers: ["Translational research institutes", "University tech transfer", "Deep tech accelerators"],
        talent: ["Create proof-of-work portfolios", "Map IP constraints", "Draft venture diligence memos"],
        capital: "Expert networks, virtual labs, science diligence, venture studios, and cross-border talent markets can converge.",
      },
      zh: {
        title: "科学发现如何变成公司，同时不损失开放性、信任和全球人才流动？",
        summary: "世界需要更好的路径，把研究问题变成证据、实验室、公司、资本和公共利益，而不是把人才锁在机构边界里。",
        tags: ["科学商业化", "人才", "风险资本"],
        bottleneck: "大学、实验室、创始人、学生、投资人和政府各自掌握一段流程，却缺少共同操作系统。",
        researchers: ["转化研究机构", "大学技术转移", "Deep tech 加速器"],
        talent: ["创建 proof-of-work 作品集", "绘制 IP 约束", "撰写 VC 尽调 memo"],
        capital: "专家网络、虚拟实验室、科学尽调、venture studio 和跨境人才市场可能汇合。",
      },
      ja: {
        title: "発見を、開放性・信頼・人材移動を失わずに会社へ変えるには？",
        summary:
          "研究課題を証拠、ラボ、会社、資本、公共利益へ変える道を、機関の境界に人材を閉じ込めず作る必要があります。",
        tags: ["科学の事業化", "人材", "ベンチャー"],
        bottleneck:
          "大学、ラボ、創業者、学生、投資家、政府が工程の一部を持っていますが、共通 OS がありません。",
        researchers: ["トランスレーショナル研究機関", "大学技術移転", "Deep tech アクセラレーター"],
        talent: ["proof-of-work ポートフォリオを作る", "IP 制約を地図化", "VC デューデリジェンス memo を書く"],
        capital: "専門家ネットワーク、バーチャルラボ、科学デューデリジェンス、venture studio、越境人材市場が交差します。",
      },
    },
  },
];

let currentLanguage = getInitialLanguage();
let selectedProblemId = PROBLEMS[0].id;
let activeFilter = "all";

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function getInitialLanguage() {
  let savedLanguage = "";
  try {
    savedLanguage = window.localStorage?.getItem("aisciLanguage") || "";
  } catch {
    savedLanguage = "";
  }
  return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : "en";
}

function text(key) {
  return UI_TEXT[currentLanguage][key] ?? UI_TEXT.en[key] ?? key;
}

function problemContent(problem) {
  return problem.content[currentLanguage] ?? problem.content.en;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyLanguage(language) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
  try {
    window.localStorage?.setItem("aisciLanguage", currentLanguage);
  } catch {
    // Language switching still works even when storage is blocked.
  }
  const dictionary = UI_TEXT[currentLanguage];

  document.documentElement.lang = dictionary.langCode;
  document.title = dictionary.metaTitle;
  qs("meta[name='description']").setAttribute("content", dictionary.metaDescription);

  qsa("[data-i18n]").forEach((element) => {
    element.textContent = text(element.dataset.i18n);
  });
  qsa("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", text(element.dataset.i18nPlaceholder));
  });
  qsa("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", text(element.dataset.i18nAriaLabel));
  });
  qsa("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", text(element.dataset.i18nTitle));
  });

  renderSignalOptions();
  updateLanguageButtons();
  renderProblems();
  refreshIcons();
}

function renderSignalOptions() {
  const typeSelect = qs("#signalForm select");
  const selected = typeSelect.value || "frontier";
  const modalOptions = text("modalOptions");
  typeSelect.innerHTML = SIGNAL_OPTIONS.map(
    (option) => `<option value="${option}">${escapeHtml(modalOptions[option])}</option>`,
  ).join("");
  typeSelect.value = SIGNAL_OPTIONS.includes(selected) ? selected : "frontier";
}

function updateLanguageButtons() {
  qsa(".language-switch button").forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderProblems() {
  const list = qs("#problemList");
  const search = qs("#globalSearch").value.trim().toLowerCase();
  const filtered = PROBLEMS.filter((problem) => {
    const content = problemContent(problem);
    const matchesFilter = Boolean(search) || activeFilter === "all" || problem.domain === activeFilter;
    const haystack = [
      content.title,
      content.summary,
      content.bottleneck,
      content.capital,
      ...content.tags,
      ...content.researchers,
      ...content.talent,
    ]
      .join(" ")
      .toLowerCase();
    return matchesFilter && (!search || haystack.includes(search));
  });

  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = `
      <div class="problem-card">
        <div>
          <h3>${escapeHtml(text("noMatchesTitle"))}</h3>
          <p>${escapeHtml(text("noMatchesBody"))}</p>
        </div>
      </div>
    `;
    renderDetail(null);
    return;
  }

  if (!filtered.some((problem) => problem.id === selectedProblemId)) {
    selectedProblemId = filtered[0].id;
  }

  filtered.forEach((problem) => {
    const content = problemContent(problem);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `problem-card ${problem.id === selectedProblemId ? "selected" : ""}`;
    button.dataset.id = problem.id;
    button.innerHTML = `
      <div>
        <h3>${escapeHtml(content.title)}</h3>
        <p>${escapeHtml(content.summary)}</p>
        <div class="card-tags">
          ${content.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <div class="problem-score score-${problem.score}">
        <span>${problem.score}</span>
      </div>
    `;
    button.addEventListener("click", () => {
      selectedProblemId = problem.id;
      renderProblems();
    });
    list.appendChild(button);
  });

  renderDetail(PROBLEMS.find((problem) => problem.id === selectedProblemId));
}

function renderDetail(problem) {
  const detail = qs("#problemDetail");

  if (!problem) {
    detail.innerHTML = `
      <div class="detail-empty">
        <i data-lucide="radar"></i>
        <span>${escapeHtml(text("problemDetailEmpty"))}</span>
      </div>
    `;
    refreshIcons();
    return;
  }

  const content = problemContent(problem);
  detail.innerHTML = `
    <div class="detail-head">
      <div>
        <h3>${escapeHtml(content.title)}</h3>
        <span>${content.tags.map(escapeHtml).join(" · ")}</span>
      </div>
      <div class="detail-actions">
        <div class="problem-score score-${problem.score}">
          <span>${problem.score}</span>
        </div>
        <a class="secondary-btn detail-link" href="/problems/${problem.id}/">${escapeHtml(text("detailOpenPage"))}</a>
      </div>
    </div>
    <div class="detail-tags">
      <span class="tag">${escapeHtml(text("detailScientificValue"))}</span>
      <span class="tag">${escapeHtml(text("detailTalentReady"))}</span>
      <span class="tag">${escapeHtml(text("detailCommercialWatch"))}</span>
    </div>
    <div class="detail-grid">
      <div class="detail-box">
        <strong>${escapeHtml(text("detailBottleneck"))}</strong>
        <p>${escapeHtml(content.bottleneck)}</p>
      </div>
      <div class="detail-box">
        <strong>${escapeHtml(text("detailResearchers"))}</strong>
        <ul>${content.researchers.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="detail-box">
        <strong>${escapeHtml(text("detailTalent"))}</strong>
        <ul>${content.talent.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
      <div class="detail-box">
        <strong>${escapeHtml(text("detailCapital"))}</strong>
        <p>${escapeHtml(content.capital)}</p>
      </div>
    </div>
  `;
  refreshIcons();
}

function refreshIcons() {
  qsa("i[data-lucide]").forEach((placeholder) => {
    const iconName = placeholder.dataset.lucide;
    const iconBody = ICONS[iconName];
    if (!iconBody) {
      return;
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("icon");
    svg.innerHTML = iconBody;
    placeholder.replaceWith(svg);
  });
}

function bindControls() {
  qsa(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      qsa(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter;
      renderProblems();
    });
  });

  qsa(".language-switch button").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(button.dataset.lang);
    });
  });

  qs("#globalSearch").addEventListener("input", renderProblems);

  qsa(".rail-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      qsa(".rail-nav a").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  qs("#submitSignal").addEventListener("click", () => openSignalModal("frontier"));
  qs("#createPassport").addEventListener("click", () => openSignalModal("talent"));
  qs("#closeSignal").addEventListener("click", closeSignalModal);
  qs("#signalModal").addEventListener("click", (event) => {
    if (event.target.id === "signalModal") {
      closeSignalModal();
    }
  });
  qs("#signalForm").addEventListener("submit", (event) => {
    event.preventDefault();
    closeSignalModal();
    event.currentTarget.reset();
    showToast(text("toastQueued"));
  });
  qs("#refreshIntel").addEventListener("click", () => {
    showToast(text("toastRefreshed"));
  });
}

function openSignalModal(signalType) {
  const modal = qs("#signalModal");
  const typeSelect = qs("#signalForm select");
  typeSelect.value = SIGNAL_OPTIONS.includes(signalType) ? signalType : "frontier";
  modal.hidden = false;
  qs("#signalForm input[name='title']").focus();
}

function closeSignalModal() {
  qs("#signalModal").hidden = true;
}

function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function drawGraph() {
  const canvas = qs("#scienceGraph");
  const context = canvas.getContext("2d");
  const stage = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const rect = stage.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = Math.min(rect.width, rect.height) * 0.34;
  const now = Date.now() * 0.00022;
  const nodeLabels = text("nodeLabels");

  context.clearRect(0, 0, rect.width, rect.height);

  const nodes = nodeLabels.map((label, index) => {
    const angle = (Math.PI * 2 * index) / nodeLabels.length + now;
    const wave = Math.sin(now * 2.5 + index) * 18;
    return {
      label,
      x: centerX + Math.cos(angle) * (radius + wave),
      y: centerY + Math.sin(angle) * (radius * 0.72 + wave * 0.35),
      color:
        index % 4 === 0
          ? "#008f6f"
          : index % 4 === 1
            ? "#2156d9"
            : index % 4 === 2
              ? "#b98116"
              : "#c6425a",
    };
  });

  context.lineWidth = 1;
  nodes.forEach((node, index) => {
    const next = nodes[(index + 1) % nodes.length];
    const chord = nodes[(index + 5) % nodes.length];
    drawLine(context, node, next, "rgba(23, 33, 29, 0.12)");
    drawLine(context, node, chord, "rgba(0, 143, 111, 0.12)");
  });

  context.beginPath();
  context.arc(centerX, centerY, Math.max(54, radius * 0.28), 0, Math.PI * 2);
  context.fillStyle = "rgba(255, 255, 255, 0.88)";
  context.fill();
  context.strokeStyle = "rgba(23, 33, 29, 0.14)";
  context.stroke();
  context.fillStyle = "#17211d";
  context.font = "800 18px system-ui, sans-serif";
  context.textAlign = "center";
  context.fillText("AISci", centerX, centerY - 3);
  context.font = "700 12px system-ui, sans-serif";
  context.fillStyle = "#637067";
  context.fillText(text("graphCenterSubtitle"), centerX, centerY + 18);

  nodes.forEach((node, index) => {
    context.beginPath();
    context.arc(node.x, node.y, index % 3 === 0 ? 9 : 7, 0, Math.PI * 2);
    context.fillStyle = node.color;
    context.fill();
    context.strokeStyle = "rgba(255, 255, 255, 0.88)";
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = "#17211d";
    context.font = "750 11px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText(node.label, node.x, node.y + 24);
  });

  requestAnimationFrame(drawGraph);
}

function drawLine(context, source, target, color) {
  context.beginPath();
  context.moveTo(source.x, source.y);
  context.lineTo(target.x, target.y);
  context.strokeStyle = color;
  context.stroke();
}

bindControls();
applyLanguage(currentLanguage);
requestAnimationFrame(drawGraph);
