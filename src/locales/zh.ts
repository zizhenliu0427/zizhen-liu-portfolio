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
    lastName: "子箴",
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
    copyright: "© 2026 刘子箴",
    engineeredIn: "DESIGNED + ENGINEERED BY ZIZHEN LIU",
    backToTop: "回到顶部 ↑",
  },

  /* ------------------------------------------------------------------ */
  /*  关于页面                                                           */
  /* ------------------------------------------------------------------ */
  about: {
    metaTitle: "关于 — 刘子箴",
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
    metaTitle: "项目档案 — 刘子箴",
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
    name: "刘子箴",
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
    metaTitle: "刘子箴 — Aero 实验室",
    metaDescription:
      "手工构建的 Frutiger Aero、Y2K 时代桌面实验室。Windows 7 是首个版本；XP 和 98 即将推出。",
    getStarted: "开始使用",
    aboutMe: "关于我",
    aboutTitle: "关于 — 刘子箴",
    aboutBio:
      "刘子箴 (Lance) — 全栈工程师。",
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
    userName: "刘子箴",
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
    metaTitle: "刘子箴 — 欢迎",
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
    welcomeName: "刘子箴 ",
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

  /* ------------------------------------------------------------------ */
  /*  精选项目文案(键对应 data/portfolio.ts 里的 project id)              */
  /*  约定:项目名与技术术语保留英文,只翻描述性文字                        */
  /* ------------------------------------------------------------------ */
  projectContent: {
    sensor: {
      type: "UNSW 毕业项目 \u00b7 端到端数据产品",
      summary:
        "一个物联网分析平台,楼宇管理者可以直接用自然语言查询实时传感器数据。覆盖 React 前端、FastAPI + Kafka 后端,以及对话背后的 RAG 检索管线。",
      highlights: [
        "React 19 单页应用 \u00b7 CSV/Excel 解析交给 Web Workers",
        "Kafka 数据接入 + PostgreSQL UPSERT 批量写入",
        "Qdrant 向量检索 + 本地大模型(Ollama)与 NL2SQL",
      ],
      metric: "全栈 + AI",
      access: "学校项目 / 代码未公开",
    },
    cmo: {
      type: "个人团队项目 \u00b7 已上线的全栈产品",
      summary:
        "一个 wiki 式的装备数据库。前台做中英双语路由和 D3 可视化,后台是 Node/Express + Sequelize 的无服务器架构,在 29,000 多条记录上跑最多六表联查。",
      highlights: [
        "29,000+ 条记录 \u00b7 参数化多表联查",
        "迁移到 Vercel 无服务器架构,基础设施零维护",
        "中英文 URL 路由 \u00b7 自制 D3 传感器扇形图",
      ],
      metric: "29K+ 条记录",
    },
    ctv: {
      type: "UTS 团队项目 \u00b7 全栈 + 计算机视觉",
      summary:
        "实时监控平台:YOLOv8 在 10,025 张人工标注的画面上训练,经 Django REST + MJPEG 推流,送到多路摄像头的 React 面板。",
      highlights: [
        "在 RTX 4090 上把 YOLOv8 训到 85% mAP50",
        "OpenCV \u2192 MJPEG 实时推流,延迟低于 200ms",
        "JWT 鉴权的 React 单页应用,支持 1/2/4/6 分屏",
      ],
      metric: "85% mAP50 实时",
      access: "团队项目 / 代码未公开",
    },
    novacart: {
      type: "个人产品 \u00b7 电商平台 \u00b7 开发中",
      summary:
        "端到端搭建的移动优先电商平台。Next.js PWA 店面,底下是 ASP.NET Core + PostgreSQL,接了 Stripe 支付、Redis 缓存、服务端购物车持久化,以及一套可配置的订单状态机。",
      highlights: [
        "可配置订单状态机 + 后台数据看板",
        "服务端购物车持久化 \u00b7 Stripe 支付",
        "ASP.NET Core + PostgreSQL + Redis 全栈容器化",
      ],
      metric: "开发中",
    },
    mediajira: {
      type: "Codritium 实习 \u00b7 跨全栈的平台工程",
      summary:
        "Codritium 实习期间开发的广告投放管理平台。让实时聊天在 100 人并发下稳定送达,做了多人实时协作表格和 Calendly 式预约链接,完成横跨 12 个模块、涉及 373 个文件的 slug-URL 迁移,并把 CI 从 57 分钟压到 20 分钟。",
      highlights: [
        "100 人并发聊天:送达从 83\u201389% 提到 9,900/9,900,WebSocket p95 从 47.5 秒降到 5.0 秒",
        "多人实时协作表格:在线状态、他人光标,协作编辑约 145ms 同步",
        "CI 耗时 \u221266%(找回 597 个被跳过的测试)\u00b7 12 模块 slug-URL 迁移 + IDOR 越权修复",
      ],
      metric: "9,900/9,900 条送达",
    },
  },

  /* ------------------------------------------------------------------ */
  /*  项目归档文案(键对应 data/portfolio.ts 里的 archive id)              */
  /* ------------------------------------------------------------------ */
  archiveContent: {
    "sdr2hdr": { summary: "全程驻留 GPU 的视频管线(NVDEC \u2192 CUDA \u2192 RTX TrueHDR/VSR \u2192 NVENC),4K HDR 实时转换稳定在 ~120fps。色彩空间转换 kernel 手写,支持 HDR10 元数据标记,配中英双语命令行。" },
    "portfolio": { summary: "你正在看的这个站点:Next.js 静态构建,canvas 代码雨、CRT 氛围层,以及 /desktop 下一套手写的 Windows 7 Aero 窗口管理器。" },
    "gpu-benchmark": { summary: "C++17 写的五后端基准测试(Vulkan、DX12、DX11、OpenGL、Metal),实测 10 多张 AMD 与 NVIDIA 显卡,覆盖六代 AMD 架构;无窗口计算模式挖出了被渲染路径掩盖的 12 倍吞吐差异。附 2,300 行技术报告。" },
    "mediajira-archive": { summary: "Codritium 实习期的产品(MediaJira):面向媒介采购团队的广告投放管理平台。Next.js/TypeScript 前端,Django REST + Channels 后端,配 Celery 任务、PostgreSQL/Redis、广告平台对接,以及实时聊天和多人协作表格。" },
    "novacart-archive": { summary: "开发中的移动优先电商平台:ASP.NET Core + PostgreSQL 后端,含可配置订单状态机、Stripe 支付、Redis 缓存与服务端购物车持久化;前台是带后台看板的 Next.js PWA 店面。" },
    "lanely": { summary: "全栈看板工具:拖拽式面板、基于 WebSocket 的多人实时协作、项目数据统计。后端 FastAPI + SQLAlchemy,前端 React/TypeScript。" },
    "whale-logistics": { summary: "用 Spring Cloud 微服务重做海运货代的全流程:把集装箱从码头到还空箱的全程可见性自动化,替掉原来靠邮件人工协调的方式,降低滞箱风险。" },
    "av2text": { summary: "AI 音视频转写,带说话人分离。以三种形态交付:命令行、网页应用和 Electron 桌面端,前置 FFmpeg 预处理,后接 Whisper 系语音识别模型。" },
    "breaktime": { summary: "Kahoot 式的多人派对游戏平台:主持端投屏,玩家用手机加入。Socket.IO 撑起实时房间,Vue 3 + TypeScript 单仓结构,可作为 PWA 安装。" },
    "hls-keeper": { summary: "浏览器扩展抓取 HLS 流和站内附件,与本地 Python 服务通信,配网页控制台;FFmpeg 把切片合成可播放的文件。全程在本机完成。" },
    "bili-dns": { summary: "解决海外看 B 站卡顿:探测 CDN 边缘节点,把最快的那个用 DNS 固定下来。带定时复测、阈值保护和候选 IP 刷新,支持 Windows、macOS、OpenWrt 和 AdGuard Home。" },
    "sensor-archive": { summary: "端到端的物联网分析系统:React 19 前端,FastAPI + Kafka 数据接入,TFT 时序预测配分位数回归,以及基于 Qdrant 和本地大模型的 RAG/NL2SQL 对话层。" },
    "gdwg": { summary: "现代 C++20 泛型图容器:值语义、多态边类型层级、确定性排序,Catch2 单元测试全覆盖。" },
    "isic2018": { summary: "在类别严重失衡的皮肤镜数据上微调 DenseNet/EfficientNet/ResNet,并手写实现 Squeeze-and-Excitation 注意力模块,macro F1 达到 83%;用 Grad-CAM 验证模型看的是不是该看的区域。" },
    "ctv-archive": { summary: "YOLOv8 在自行标注的 10,025 帧数据集上训练(85% mAP50),经 Django REST 提供服务,MJPEG 推流延迟低于 200ms,输出到 JWT 鉴权的多路摄像头 React 面板。" },
    "cmo-db": { summary: "wiki 式数据库,承载 29,000 多条记录:Node/Express + Sequelize 无服务器后端,中英双语 URL 路由,延迟渲染,以及自制的 D3 传感器扇形图。" },
    "kv260": { summary: "在可编程逻辑里用 VHDL 写 I2S 接收器,48kHz/24-bit 音频经 AXI4-Stream + DMA 送进 Linux,配 Device Tree 集成和一级 AXI-Lite 控制的增益/EQ。" },
    "good360": { summary: "为 Good360 Australia 的捐赠 App 做的聊天模块,Kotlin/MVVM:多类型 RecyclerView 消息流、Firebase 实时同步、图片消息,以及可复现的聊天室 ID 生成。" },
    "budget-app": { summary: "记录日常开销的个人理财 Android 应用,开发中。" },
    "home-lab": { summary: "VMware Workstation 里搭的 Windows Server 2025 + Active Directory 实验环境,一台支持远程访问和 IPv6 的群晖 NAS,外加一些底层折腾:黑苹果 EFI/ACPI 引导、kext 注入,以及安卓第三方 ROM 救砖。" },
  },

  /* ------------------------------------------------------------------ */
  /*  工作经历文案(键对应 data/portfolio.ts 里的 experience id)           */
  /*  约定:公司名保留英文,技术术语保留英文                                */
  /* ------------------------------------------------------------------ */
  experienceContent: {
    codritium: {
      location: "悉尼,澳大利亚",
      role: "软件开发实习生",
      bullets: [
        "开发 Marketing Simplified(MediaJira)——面向媒介采购团队的广告投放管理平台,Next.js/TypeScript 前端搭配 Django REST + Channels 后端。",
        "让实时聊天在高并发下稳定送达(幂等发送、transactional outbox、PgBouncer 连接池),100 人并发时 9,900/9,900 条全部送达;并基于 Django Channels 做了多人实时协作表格,协作编辑约 145ms 同步。",
        "交付 Calendly 式预约链接、373 个文件的 slug-URL 迁移和 IDOR 越权修复;CI 从 57 分钟压到 20 分钟;生产环境出现 521 故障时恢复 144 个数据库迁移,让服务重新上线。",
      ],
    },
    intelli: {
      location: "悉尼,澳大利亚",
      role: "IT / 业务分析实习生",
      bullets: [
        "用 Python 爬虫和 Pandas ETL 管线采集、校验并规范化半结构化的网页数据,供下游功能使用。",
        "把业务需求转成用户故事和 API 约定,并在敏捷冲刺评审中对照设计稿验证 React 组件。",
        "产出并验证数据看板的线框图,支撑前后端交界处的响应式实现。",
      ],
    },
    goldenlady: {
      location: "重庆,中国",
      role: "IT 支持实习生",
      bullets: [
        "维护线上的 Vue.js 企业官网,稳妥地交付响应式界面调整与内容更新。",
        "排查工作站硬件故障,为高负载场景配置操作系统与创意设计软件。",
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  /*  能力分组(键对应 capability id);技术条目保留英文                    */
  /* ------------------------------------------------------------------ */
  capabilityContent: {
    interface: {
      title: "界面",
      description: "跨 Web 与移动端的产品界面。",
    },
    server: {
      title: "服务端与数据",
      description: "API、数据管线,以及背后的模型。",
    },
    metal: {
      title: "底层",
      description: "性能本身就是产品的系统级代码。",
    },
    delivery: {
      title: "交付",
      description: "从原型到部署上线、经过测试的软件。",
    },
  },

  /* ------------------------------------------------------------------ */
  /*  教育经历(键对应 education id)                                      */
  /* ------------------------------------------------------------------ */
  educationContent: {
    unsw: {
      school: "新南威尔士大学(UNSW)",
      degree: "信息技术硕士",
      courses: ["毕业项目 (85)", "人工智能 (81)", "高级 C++ (81)"],
    },
    uts: {
      school: "悉尼科技大学(UTS)",
      degree: "软件工程学士(荣誉)",
      courses: ["数据库基础 (94)", "系统测试与质量管理 (90)", "数据结构与算法 (84)"],
    },
  },
} as const;
