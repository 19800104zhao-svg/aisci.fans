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
    metaTitle: "AISci.fans | Global AI Science Network",
    metaDescription:
      "AISci.fans uses AI to organize frontier scientific problems, connect exceptional researchers, discover young talent, and surface venture-scale opportunities.",
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
      "Route the world's most important scientific problems to the right people, students, and capital.",
    heroBody:
      "AISci.fans organizes papers, researchers, young talent, virtual labs, and commercialization opportunities into one dynamic map. AI expands the search radius; human experts make the final judgment.",
    metricsAria: "Platform metrics",
    metricProblems: "frontier problems",
    metricSignals: "research signals",
    metricLabs: "virtual labs",
    graphAria: "AISci research graph visualization",
    graphCardOneLabel: "New bottleneck",
    graphCardOneText: "Autonomous wet-lab validation",
    graphCardTwoLabel: "Young talent",
    graphCardTwoText: "Replication proof-of-work",
    problemsKicker: "Frontier Problems",
    problemsTitle: "Frontier scientific problem library",
    problemFiltersAria: "Problem filters",
    filterAll: "All",
    filterBio: "Bio",
    filterMaterials: "Materials",
    filterSafety: "Safety",
    filterRobotics: "Robotics",
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
    metaTitle: "AISci.fans | 全球 AI 科学网络",
    metaDescription:
      "AISci.fans 用 AI 组织前沿科学问题、连接卓越研究者、发现年轻人才，并呈现可公司化的交叉学科机会。",
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
    heroTitle: "让全球最重要的科学问题，找到最合适的人、学生和资本。",
    heroBody:
      "AISci.fans 把论文、研究者、年轻人才、虚拟实验室和商业化机会组织到同一张动态地图里。AI 扩大搜索半径，人类专家负责最终判断。",
    metricsAria: "平台指标",
    metricProblems: "前沿问题",
    metricSignals: "研究信号",
    metricLabs: "虚拟实验室",
    graphAria: "AISci 研究图谱可视化",
    graphCardOneLabel: "新瓶颈",
    graphCardOneText: "自主湿实验验证",
    graphCardTwoLabel: "年轻人才",
    graphCardTwoText: "复现型 proof-of-work",
    problemsKicker: "前沿问题",
    problemsTitle: "前沿科学问题库",
    problemFiltersAria: "问题筛选",
    filterAll: "全部",
    filterBio: "生物",
    filterMaterials: "材料",
    filterSafety: "安全",
    filterRobotics: "机器人",
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
    metaTitle: "AISci.fans | グローバル AI 科学ネットワーク",
    metaDescription:
      "AISci.fans は AI で先端科学課題、優れた研究者、若い才能、事業化機会を結びつけるネットワークです。",
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
    heroTitle: "世界で最も重要な科学課題を、最適な人材、学生、資本へつなぐ。",
    heroBody:
      "AISci.fans は論文、研究者、若い才能、バーチャルラボ、事業化機会をひとつの動的な地図に整理します。AI が探索範囲を広げ、人間の専門家が最終判断を行います。",
    metricsAria: "プラットフォーム指標",
    metricProblems: "先端課題",
    metricSignals: "研究シグナル",
    metricLabs: "バーチャルラボ",
    graphAria: "AISci 研究グラフ可視化",
    graphCardOneLabel: "新しいボトルネック",
    graphCardOneText: "自律型ウェットラボ検証",
    graphCardTwoLabel: "若い才能",
    graphCardTwoText: "再現による proof-of-work",
    problemsKicker: "先端課題",
    problemsTitle: "先端科学課題ライブラリ",
    problemFiltersAria: "課題フィルター",
    filterAll: "すべて",
    filterBio: "バイオ",
    filterMaterials: "材料",
    filterSafety: "安全性",
    filterRobotics: "ロボット",
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
    id: "protein-validation",
    domain: "biology",
    score: 94,
    content: {
      en: {
        title:
          "How can AI-designed proteins move from in-silico promise to repeatable wet-lab validation?",
        summary:
          "Protein design models are advancing quickly, but repeatable, scalable, commercially relevant wet-lab loops remain the core bottleneck.",
        tags: ["AI for Biology", "Protein Design", "Wet Lab"],
        bottleneck:
          "There is still a gap between model scores and real binding, stability, immunogenicity, and manufacturability.",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute"],
        talent: ["Replicate diffusion models", "Build failure-case libraries", "Design open benchmarks"],
        capital: "Platform biotech, automated CROs, and proprietary data-asset companies are plausible paths.",
      },
      zh: {
        title: "AI 设计的蛋白质如何从计算承诺走向可重复的湿实验验证？",
        summary: "蛋白质设计模型进步很快，但可重复、可规模化、可商业化的湿实验闭环仍然是核心瓶颈。",
        tags: ["AI for Biology", "蛋白质设计", "湿实验"],
        bottleneck: "模型评分和真实结合、稳定性、免疫原性、可制造性之间仍有明显落差。",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute"],
        talent: ["复现扩散模型", "构建失败样本库", "设计公开 benchmark"],
        capital: "平台型 biotech、自动化 CRO、专有数据资产公司都有机会。",
      },
      ja: {
        title: "AI 設計タンパク質は、計算上の有望性から再現可能な湿実験検証へどう進むのか？",
        summary:
          "タンパク質設計モデルは急速に進歩していますが、再現性と拡張性があり商業化につながる湿実験ループが主要なボトルネックです。",
        tags: ["AI for Biology", "タンパク質設計", "湿実験"],
        bottleneck:
          "モデルスコアと実際の結合、安定性、免疫原性、製造可能性の間にはまだ大きな差があります。",
        researchers: ["David Baker Lab", "Isomorphic Labs", "Arc Institute"],
        talent: ["拡散モデルを再現", "失敗例ライブラリを構築", "公開 benchmark を設計"],
        capital: "プラットフォーム型 biotech、自動化 CRO、専有データ資産企業に機会があります。",
      },
    },
  },
  {
    id: "autonomous-materials",
    domain: "materials",
    score: 88,
    content: {
      en: {
        title: "Can autonomous labs discover useful materials faster than human-led trial cycles?",
        summary:
          "Materials discovery needs a closed loop between property prediction, synthesis planning, experimental robotics, and failure feedback.",
        tags: ["Materials", "Robotics", "Autonomous Lab"],
        bottleneck:
          "Synthesis feasibility and equipment standardization are weak, making high-quality model feedback difficult.",
        researchers: ["Materials Project", "Self-driving labs", "Robotic chemistry groups"],
        talent: ["Curate failed experiments", "Predict synthesis routes", "Connect robot-control interfaces"],
        capital:
          "Batteries, semiconductors, catalysts, and defense materials are likely early paid markets.",
      },
      zh: {
        title: "自主实验室能否比人类试错周期更快发现有用材料？",
        summary: "材料发现需要把性质预测、合成规划、实验机器人和失败反馈连成闭环。",
        tags: ["材料", "机器人", "自主实验室"],
        bottleneck: "合成可行性和实验设备标准化不足，导致模型很难获得高质量反馈。",
        researchers: ["Materials Project", "Self-driving labs", "Robotic chemistry groups"],
        talent: ["整理失败实验", "预测合成路线", "连接机器人控制接口"],
        capital: "电池、半导体、催化剂和国防材料会最早形成付费场景。",
      },
      ja: {
        title: "自律型ラボは、人間主導の試行錯誤より速く有用材料を発見できるのか？",
        summary:
          "材料発見には、物性予測、合成計画、実験ロボティクス、失敗フィードバックを結ぶ閉ループが必要です。",
        tags: ["材料", "ロボティクス", "自律型ラボ"],
        bottleneck:
          "合成可能性と実験設備の標準化が弱く、モデルに高品質なフィードバックを返しにくいことです。",
        researchers: ["Materials Project", "Self-driving labs", "Robotic chemistry groups"],
        talent: ["失敗実験を整理", "合成経路を予測", "ロボット制御インターフェースを接続"],
        capital: "電池、半導体、触媒、防衛材料が初期の有料市場になり得ます。",
      },
    },
  },
  {
    id: "verifiable-safety",
    domain: "safety",
    score: 91,
    content: {
      en: {
        title: "What would make frontier AI systems scientifically auditable before deployment?",
        summary:
          "AI safety needs to move from slogans into testable, falsifiable, engineerable verification systems.",
        tags: ["AI Safety", "Evaluation", "Formal Methods"],
        bottleneck:
          "Current evaluations can be adapted to by models, while formal methods struggle to cover real open environments.",
        researchers: ["ARC Evals", "Anthropic", "METR", "UK AISI"],
        talent: ["Design anti-gaming evals", "Replicate protocols", "Write falsifiable safety hypotheses"],
        capital: "Model audits, safety infrastructure, and enterprise governance tools can become standalone markets.",
      },
      zh: {
        title: "前沿 AI 系统在部署前如何被科学审计？",
        summary: "AI Safety 需要从口号变成可测试、可反驳、可工程落地的验证体系。",
        tags: ["AI Safety", "评测", "形式化方法"],
        bottleneck: "现有评测容易被模型适应，形式化方法又难覆盖真实开放环境。",
        researchers: ["ARC Evals", "Anthropic", "METR", "UK AISI"],
        talent: ["设计反作弊评测", "复现实验协议", "写可反驳安全假设"],
        capital: "模型审计、安全基础设施、企业治理工具会成为独立市场。",
      },
      ja: {
        title: "先端 AI システムを導入前に科学的に監査可能にするには何が必要か？",
        summary:
          "AI Safety はスローガンではなく、テスト可能で反証可能、かつ実装できる検証システムへ進む必要があります。",
        tags: ["AI Safety", "評価", "形式手法"],
        bottleneck:
          "現行の評価はモデルに適応されやすく、形式手法は現実のオープン環境を十分にカバーしにくいことです。",
        researchers: ["ARC Evals", "Anthropic", "METR", "UK AISI"],
        talent: ["対策困難な評価を設計", "実験プロトコルを再現", "反証可能な安全仮説を書く"],
        capital: "モデル監査、安全インフラ、企業向けガバナンスツールは独立市場になり得ます。",
      },
    },
  },
  {
    id: "robot-scientists",
    domain: "robotics",
    score: 83,
    content: {
      en: {
        title: "How can robots become reliable physical-world research assistants?",
        summary:
          "Next-generation science automation is not only software agents; it must also operate, observe, and correct in real experimental settings.",
        tags: ["Robotics", "Science Agents", "Embodied AI"],
        bottleneck:
          "Long-horizon tasks, low-error experiments, hardware variation, and safety constraints make generalization hard.",
        researchers: ["Stanford Robotics", "DeepMind Robotics", "Berkeley AI Research"],
        talent: ["Build lab task datasets", "Improve visual correction", "Evaluate long-horizon success rates"],
        capital: "Lab automation hardware, robot software stacks, and vertical research services all have room.",
      },
      zh: {
        title: "机器人如何成为可靠的物理世界科研助手？",
        summary: "下一代科学自动化不只是软件 agent，还要能在真实实验环境中操作、观测和纠错。",
        tags: ["机器人", "科学 Agent", "具身 AI"],
        bottleneck: "长程任务、低容错实验、硬件差异和安全约束使泛化非常困难。",
        researchers: ["Stanford Robotics", "DeepMind Robotics", "Berkeley AI Research"],
        talent: ["构建实验任务数据集", "改进视觉纠错", "评测长程操作成功率"],
        capital: "实验室自动化硬件、机器人软件栈和垂直科研服务都有机会。",
      },
      ja: {
        title: "ロボットは信頼できる物理世界の研究アシスタントになれるのか？",
        summary:
          "次世代の科学自動化はソフトウェア agent だけでなく、実験現場で操作、観察、修正できる必要があります。",
        tags: ["ロボティクス", "科学 Agent", "身体性 AI"],
        bottleneck:
          "長期タスク、低エラー実験、ハードウェア差、安全制約により汎化が難しいことです。",
        researchers: ["Stanford Robotics", "DeepMind Robotics", "Berkeley AI Research"],
        talent: ["実験タスクデータセットを構築", "視覚的修正を改善", "長期操作成功率を評価"],
        capital: "ラボ自動化ハードウェア、ロボットソフトウェアスタック、垂直型研究サービスに機会があります。",
      },
    },
  },
  {
    id: "research-agents",
    domain: "biology",
    score: 86,
    content: {
      en: {
        title:
          "Can AI agents become trustworthy collaborators for literature synthesis and experiment design?",
        summary:
          "Research agents are not valuable because they chat well, but because they can provide traceable evidence, executable experiments, and reliable uncertainty.",
        tags: ["Research Agents", "Literature", "Experiment Design"],
        bottleneck:
          "Hallucination, source quality, experimental constraints, and team permissions still block real lab adoption.",
        researchers: ["OpenAI", "FutureHouse", "Sakana AI", "Academic agent labs"],
        talent: ["Write source-grounded reviews", "Evaluate agent experiment design", "Build task environments"],
        capital: "Research SaaS, pharma knowledge systems, and automated diligence tools are early entry points.",
      },
      zh: {
        title: "AI agent 能否成为可信的文献综合和实验设计合作者？",
        summary: "科研 agent 的关键不是多会聊天，而是能否给出可追踪证据、可执行实验和可靠不确定性。",
        tags: ["科研 Agent", "文献", "实验设计"],
        bottleneck: "幻觉、来源质量、实验约束和团队协作权限仍然制约真实实验室采用。",
        researchers: ["OpenAI", "FutureHouse", "Sakana AI", "Academic agent labs"],
        talent: ["做 source-grounded 综述", "评测 agent 实验设计", "构建任务环境"],
        capital: "科研 SaaS、药企内部知识系统和自动化尽调工具是早期入口。",
      },
      ja: {
        title: "AI agent は文献統合と実験設計の信頼できる協力者になれるのか？",
        summary:
          "研究 agent の価値は会話の上手さではなく、追跡可能な証拠、実行可能な実験、信頼できる不確実性を出せることです。",
        tags: ["研究 Agent", "文献", "実験設計"],
        bottleneck:
          "幻覚、ソース品質、実験制約、チーム権限が、実際のラボ導入をまだ妨げています。",
        researchers: ["OpenAI", "FutureHouse", "Sakana AI", "Academic agent labs"],
        talent: ["ソースに基づくレビューを書く", "agent の実験設計を評価", "タスク環境を構築"],
        capital: "研究 SaaS、製薬企業の知識システム、自動デューデリジェンスツールが初期入口です。",
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
      <div class="problem-score score-${problem.score}">
        <span>${problem.score}</span>
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
