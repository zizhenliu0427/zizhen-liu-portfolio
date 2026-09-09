/**
 * 中文翻译文件
 *
 * 与 en.ts 结构完全对应。
 * - 涉及 Sydney / visa / Australia 的内容使用空字符串 ""，由渲染侧通过
 *   `isZh` 条件判断是否隐藏整个区块。
 * - 品牌名 (GRIDRUNNER OS, ZL) 和项目名保留英文。
 * - 技术术语保留英文。
 */
export const zh = {
  /* ------------------------------------------------------------------ */
  /*  导航                                                               */
  /* ------------------------------------------------------------------ */
  nav: {
    skipToContent: "跳转到内容",
    work: "作品",
    projects: "项目",
    experience: "经历",
    lab: "实验室",
    about: "关于",
    contact: "联系",
    openToWork: "求职中",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — Hero                                                        */
  /* ------------------------------------------------------------------ */
  hero: {
    systemProfile: "00 // 系统档案",
    sydneyBadge: "", // 中文版隐藏
    firstName: "刘",
    lastName: "自臻",
    roleA: "全栈",
    roleB: "工程师",
    tagline: "WEB · AI · 系统",
    statement:
      "我构建完整的产品 — 响应式界面、数据与 AI 后端、以及深入 GPU 层级的系统代码。",
    exploreWork: "浏览精选作品",
    startConversation: "开始对话",
    locationLabel: "", // 中文版隐藏
    locationValue: "", // 中文版隐藏
    accessLabel: "", // 中文版隐藏
    accessValue: "", // 中文版隐藏
    statusLabel: "状态",
    statusValue: "全栈工程师 · 寻求工作机会",
    scrollCue: "向下滚动以解码",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — 精选作品                                                     */
  /* ------------------------------------------------------------------ */
  work: {
    eyebrow: "精选作品",
    title: "从零到一，端到端构建产品。",
    viewLive: "查看线上项目",
    viewSource: "查看源码",
    experienceEntry: "相关经历",
    caseStudyFallback: "案例分析 / 即将发布",
    archiveLink: "打开项目档案 — {count} 个条目",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — 经历                                                        */
  /* ------------------------------------------------------------------ */
  experience: {
    eyebrow: "经历日志",
    title: "从需求到交付。",
    intro:
      "一名全栈工程师，拥有软件工程学术背景和产品分析经验，习惯通过动手构建来学习整个技术栈。",
    gfwNote:
      "① 部署在中国大陆 — 从海外访问可能受 GFW 影响，可能需要中国网络线路/代理。",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — 技术能力                                                     */
  /* ------------------------------------------------------------------ */
  capabilities: {
    eyebrow: "技术栈",
    title: "从界面到底层，一个工程师。",
    educationLabel: "教育背景 / 已验证",
    educationTitle: "软件工程学术基础。",
    educationTitle2: "产品导向的执行力。",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — Aero 实验室                                                  */
  /* ------------------------------------------------------------------ */
  lab: {
    eyebrow: "AERO 实验室",
    titleA: "这个作品集拥有",
    titleB: "一个 Frutiger Aero 操作系统。",
    description:
      "手工构建的 Y2K 时代界面实验室 — 玻璃质感的 Aero 镀铬效果、果冻按钮、反射效果和可拖拽窗口管理，全部从零开始开发。Windows 7 是首个版本；XP 和 Windows 98 即将推出。",
    launchLab: "启动 Aero 实验室",
    resumeSetup: "打开简历设置",
    viewComponents: "查看 Aero 组件",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — 联系                                                        */
  /* ------------------------------------------------------------------ */
  contact: {
    topline: "05 // 联系方式",
    channelOpen: "通道：开放",
    subtitleA: "有职位、产品、",
    subtitleB: "或复杂的界面需求？",
    ctaA: "一起",
    ctaB: "构建清晰的产品。",
    resumeStatus: "简历 PDF / 即将更新",
  },

  /* ------------------------------------------------------------------ */
  /*  首页 — 页脚                                                        */
  /* ------------------------------------------------------------------ */
  footer: {
    copyright: "© 2026 刘自臻",
    engineeredIn: "DESIGNED + ENGINEERED BY ZIZHEN LIU",
    backToTop: "回到顶部 ↑",
  },

  /* ------------------------------------------------------------------ */
  /*  关于页面                                                           */
  /* ------------------------------------------------------------------ */
  about: {
    metaTitle: "关于 — 刘自臻",
    metaDescription:
      "终端背后的人：硬件与家庭实验室、摄影、汽车爱好、语言与教育。",
    backHome: "CD ../首页",
    sectionIndex: "05",
    eyebrow: "个人档案",
    title: "终端背后的人。",
    introPrefix: " — 一名",
    introMiddle: "，就读于",
    introSuffix:
      "。专业经历在主页和项目档案中；这个页面是关闭 IDE 之后的一切 — 其中大部分仍然与硬件有关。",
    educationIndex: "05.1",
    educationEyebrow: "教育记录",
    factsIndex: "05.2",
    factsEyebrow: "系统信息",
    languagesLabel: "语言",
    languagesValue:
      "英语（熟练） · 中文（母语） · 日语（学习中）",
    accessLabel: "", // 中文版隐藏
    accessSuffix: "",
    affiliationLabel: "专业协会",
    affiliationValue: "澳大利亚计算机协会会员",
    startConversation: "开始对话 ",
    projectArchive: "项目档案",
    aeroLab: "AERO 实验室",
    returnToMain: "返回主页 ↖",
  },

  /* ------------------------------------------------------------------ */
  /*  项目档案页面                                                       */
  /* ------------------------------------------------------------------ */
  projectsPage: {
    metaTitle: "项目档案 — 刘自臻",
    metaDescription:
      "所有项目记录：Web 全栈产品、AI/ML 系统、GPU 和 FPGA 项目、Android 应用和家庭实验室。",
    backHome: "CD ../首页",
    sectionIndex: "02",
    eyebrow: "项目档案",
    lsPrefix: "ls -la ./projects — ",
    lsSuffix: " 个条目。",
    description:
      "所有项目记录 — 选择一个领域，相关项目将被优先显示。大学和保密项目已如实标注，不会链接到空页面；演示可应要求提供。",
    requestDemo: "申请演示 ",
    aboutOperator: "关于作者",
    aeroLab: "AERO 实验室",
    returnToMain: "返回主页 ↖",
  },

  archive: {
    filterLabel: "筛选：",
    all: "全部",
    entries: "{count} 个条目",
    prioritised: "{hitCount} 个优先 · {rest} 个次要",
    live: "在线 ↗",
    source: "源码 ↗",
    inDevelopment: "开发中 ↗",
    inDevelopmentNoLink: "开发中",
    nda: "保密 · 可应要求演示",
    youAreHere: "当前网站",
    codePrivate: "代码不公开",
  },

  /* ------------------------------------------------------------------ */
  /*  Labs 入口页                                                        */
  /* ------------------------------------------------------------------ */
  labsEntry: {
    brandLine: "ZL // 入口原型",
    name: "刘自臻",
    role: "全栈工程师",
    description:
      "文字背后的字符雨场是与显示器内部相同的实时渲染目标。无桥接帧、无交叉淡入、无重置。",
  },

  /* ------------------------------------------------------------------ */
  /*  Demo 页面                                                          */
  /* ------------------------------------------------------------------ */
  demo: {
    metaTitle: "Aero 玻璃 — 演示",
    metaDescription:
      "Frutiger Aero / 玻璃拟态组件实验场。",
    dragInstructions:
      "拖动窗口 — 每一个都是手工构建的 Aero 玻璃组件",
    frutigerAero: "Frutiger Aero",
    glassDescription:
      "手工构建的玻璃效果：边缘折射、视口固定条纹、凸透镜气泡。",
    aboutMeTitle: "关于我",
    aboutMeDescription:
      "一个可拖动窗口 — 标题栏、光泽控件、内容和状态栏，应用了我们自己的玻璃皮肤。",
    contactMe: "联系我",
    resume: "简历",
    aboutTab: "关于",
    experienceTab: "经历",
    experienceContent: "经历时间线在此。",
    skillsTab: "技能",
    skills: "技能",
    progressStates: "进度状态",
    contactTitle: "联系",
    namePlaceholder: "你的姓名",
    emailPlaceholder: "邮箱",
    messagePlaceholder: "留言",
    sendMessage: "发送消息",
    workNav: "作品",
  },

  /* ------------------------------------------------------------------ */
  /*  Win7 桌面                                                          */
  /* ------------------------------------------------------------------ */
  desktop: {
    metaTitle: "刘自臻 — Aero 实验室",
    metaDescription:
      "手工构建的 Frutiger Aero、Y2K 时代桌面实验室。Windows 7 是首个版本；XP 和 98 即将推出。",
    getStarted: "开始使用",
    aboutMe: "关于我",
    aboutTitle: "关于 — 刘自臻",
    aboutBio:
      "刘自臻 (Lance) — 全栈工程师。",
    aboutDescription:
      "新南威尔士大学（UNSW）信息技术硕士，悉尼科技大学（UTS）软件工程荣誉学士。擅长使用 React、TypeScript 构建高性能 Web 应用。",
    aboutExtra:
      "业余时间：14 岁起组装电脑、摄影、日本文化爱好。",
    experienceLabel: "经历",
    experienceTitle: "经历",
    intelliCompany: "Intelli New Technologies — 悉尼",
    intelliRole: "IT / 商业分析实习生 · 2023年10月 – 2024年1月",
    intelliDesc:
      "Figma 原型设计、响应式 UI 开发、Agile 交付、React 组件验证、Python 数据爬虫。",
    goldenCompany: "金夫人摄影 — 重庆",
    goldenRole: "IT 支持实习生 · 2021年5月 – 2021年8月",
    goldenDesc:
      "维护 Vue.js 企业网站；响应式 UI 优化；系统配置。",
    projectsLabel: "项目",
    projectsTitle: "项目",
    sensorProject:
      "对话式 AI 传感器分析 — React 19、ECharts、Web Workers。用自然语言查询 IoT 数据。",
    cmoProject:
      "CMO-DB — 武器装备数据库 — 29,000+ 条记录，双语，D3.js。",
    ctvProject:
      "CTV — 暴力检测 — React、JWT 路由守卫、多面板 YOLO 视频 UI。",
    skillsLabel: "技能",
    skillsTitle: "技能",
    skillLanguages: "语言：JavaScript (ES6+)、TypeScript、HTML5、CSS3",
    skillFrameworks: "框架：React、React Router、Context API",
    skillUI: "UI / 样式：Tailwind、MUI v5、Bootstrap 5、CSS Grid/Flexbox",
    skillData: "数据 / API：ECharts、D3.js、Web Workers、Fetch API",
    skillTooling: "工具：Vite、Vitest、Git、Vercel、Figma",
    contactLabel: "联系",
    contactTitle: "联系",
    linkedinSydney: "LinkedIn",
    githubPrimary: "GitHub · zizhenliu0427",
    githubSecondary: "GitHub · Fairchild2333",
    visaStatus: "", // 中文版隐藏
    startButton: "开始",
    showDesktop: "显示桌面",
    flipHint:
      "Tab / 滚动切换窗口 · 点击或回车打开 · Esc 取消",
    desktopLabel: "桌面",
    userName: "刘自臻",
  },

  /* ------------------------------------------------------------------ */
  /*  启动画面                                                           */
  /* ------------------------------------------------------------------ */
  boot: {
    title: "ZL://BOOT_SEQUENCE — V.01",
    loadProfile: "> loading profile.sys ",
    decryptPortfolio: "> decrypting portfolio.dat ",
    traceSignal: "> tracing signal — portfolio.sys ",
    accessGranted: "> access granted — entering system",
    ok: "OK",
  },

  /* ------------------------------------------------------------------ */
  /*  OOBE 向导                                                          */
  /* ------------------------------------------------------------------ */
  oobe: {
    metaTitle: "刘自臻 — 欢迎",
    metaDescription:
      "前端工程师作品集，以 Windows Aero 设置向导的形式呈现。",
    startingSetup: "正在启动设置…",
    loadingProfile: "正在加载档案…",
    installingExperience: "正在安装经历…",
    installingProjects: "正在安装项目…",
    configuringSkills: "正在配置技能…",
    completingSetup: "正在完成设置…",
    welcomeLabel: "欢迎",
    welcomeTitle: "欢迎",
    welcomeName: "刘自臻 ",
    welcomeAlias: "(Lance)",
    welcomeRolePrefix: "",
    welcomeRole: "全栈工程师",
    welcomeLocation: "", // 中文版隐藏 Sydney
    welcomeDescription:
      "React · TypeScript · 响应式 UI。寻求全栈/前端开发职位。让我们开始设置。",
    aboutLabel: "关于",
    aboutTitle: "了解我",
    aboutEdu:
      "新南威尔士大学（UNSW）信息技术硕士，悉尼科技大学（UTS）软件工程荣誉学士。",
    aboutSkills:
      "擅长使用 React、TypeScript 和响应式设计构建高性能 Web 应用。",
    aboutHobbies:
      "业余时间：14 岁起组装电脑、摄影、日本文化。英语（熟练） · 中文（母语） · 日语（入门）。",
    experienceLabel: "经历",
    experienceTitle: "工作经历",
    projectsLabel: "项目",
    projectsTitle: "项目作品",
    skillsLabel: "技能",
    skillsTitle: "技术栈",
    contactLabel: "联系",
    contactTitle: "取得联系",
    contactStatus:
      "寻求全栈/前端开发职位。",
    contactLinkedin: "LinkedIn",
    contactGithubPrimary: "GitHub · zizhenliu0427",
    contactGithubSecondary: "GitHub · Fairchild2333",
    back: "上一步",
    next: "下一步",
    finish: "完成",
    scrollHint: "滚动或 ↑ ↓ 键导航",
  },

  /* ------------------------------------------------------------------ */
  /*  电影式入场                                                         */
  /* ------------------------------------------------------------------ */
  cinematic: {
    skipIntro: "跳过介绍 ",
    ariaLabel: "电影式介绍",
  },

  /* ------------------------------------------------------------------ */
  /*  Portfolio 数据 — 可翻译字段                                         */
  /* ------------------------------------------------------------------ */
  data: {
    /* 个人资料 */
    profileRole: "全栈工程师",
    profileTagline: "WEB · AI · 系统",
    profileStatement:
      "我构建完整的产品 — 响应式界面、数据与 AI 后端、以及深入 GPU 层级的系统代码。",
    profileAvailability: "全栈工程师 · 寻求工作机会",

    /* 技术能力 */
    cap01Title: "界面",
    cap01Desc: "Web 和移动端的产品界面。",
    cap02Title: "服务端与数据",
    cap02Desc: "API、数据管道和背后的模型。",
    cap03Title: "底层",
    cap03Desc: "性能即产品的系统代码。",
    cap04Title: "交付",
    cap04Desc: "从原型到部署、经过测试的软件。",

    /* 教育 */
    edu01Degree: "信息技术硕士",
    edu02Degree: "软件工程荣誉学士",

    /* 工作角色 */
    exp01Role: "软件开发实习生",
    exp02Role: "IT / 商业分析实习生",
    exp03Role: "IT 支持实习生",

    /* 兴趣 */
    interestHardwareTitle: "硬件与家庭实验室",
    interestHardwareBody:
      "14 岁起组装电脑。目前实验室运行 VMware 中的 Windows Server 2025 + Active Directory 环境、一台支持远程访问的 Synology DS923+ NAS，以及 Hackintosh EFI/ACPI 配置、kext 注入和 Android 刷机救砖的经历。",
    interestPhotoTitle: "摄影",
    interestPhotoBody:
      "风景和 HDR 摄影 — 精选作品整理完成后将在本站发布。",
    interestAutoTitle: "汽车",
    interestAutoBody:
      "Honda Civic Type R (FK8) 车主，使用 ADVAN GT Beyond 轮毂和 Neova AD09 轮胎。当然是手动挡。",
    interestCultureTitle: "语言与文化",
    interestCultureBody:
      "中文母语、英语熟练、日语入门 — 伴随着对日本文化和动漫的持续兴趣而学习。",
  },
} as const;
