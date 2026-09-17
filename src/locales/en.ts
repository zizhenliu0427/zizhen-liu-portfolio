/**
 * English translations — the baseline/source-of-truth locale.
 * Keys are organised by page/component → section.
 *
 * Decorative/terminal aesthetic text (ProjectVisual mock data, HUD labels,
 * marquee tickers, mock code panels) is intentionally kept hardcoded in the
 * components — translating it would break the visual design.
 */
export const en = {
  /* ------------------------------------------------------------------ */
  /*  Navigation (shared across pages)                                   */
  /* ------------------------------------------------------------------ */
  nav: {
    skipToContent: "Skip to content",
    work: "Work",
    projects: "Projects",
    experience: "Experience",
    lab: "Lab",
    about: "About",
    contact: "Contact",
    openToWork: "OPEN_TO_WORK",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Hero                                                        */
  /* ------------------------------------------------------------------ */
  hero: {
    systemProfile: "00 // SYSTEM_PROFILE",
    sydneyBadge: "SYDNEY · AU",
    firstName: "ZIZHEN",
    lastName: "LIU",
    roleA: "FULL-STACK",
    roleB: "ENGINEER",
    tagline: "WEB · AI · SYSTEMS",
    statement:
      "I build complete products — responsive interfaces, data and AI backends, and systems code all the way down to the GPU.",
    exploreWork: "Explore selected work",
    startConversation: "Start a conversation",
    locationLabel: "LOCATION",
    locationValue: "Sydney, Australia",
    accessLabel: "ACCESS",
    accessValue: "485 visa · full working rights",
    statusLabel: "STATUS",
    statusValue: "Open to software opportunities across Australia",
    scrollCue: "SCROLL TO DECODE",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Section 01: Work                                            */
  /* ------------------------------------------------------------------ */
  work: {
    eyebrow: "SELECTED_WORK",
    title: "Products built end to end.",
    viewLive: "View live project",
    viewSource: "View source",
    experienceEntry: "Experience entry",
    caseStudyFallback: "CASE STUDY / INCOMING",
    archiveLink: "OPEN PROJECT_ARCHIVE — {count} ENTRIES",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Section 02: Experience                                      */
  /* ------------------------------------------------------------------ */
  experience: {
    eyebrow: "EXPERIENCE_LOG",
    title: "From requirements to shipped UI.",
    intro:
      "A full-stack engineer with a software engineering foundation, product analysis experience and a habit of learning by building across the whole stack.",
    gfwNote:
      "① Hosted in mainland China — access from outside China may be affected by the GFW and may require a Chinese network route/proxy.",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Section 03: Capabilities                                    */
  /* ------------------------------------------------------------------ */
  capabilities: {
    eyebrow: "STACK_MAP",
    title: "Interface to metal, one engineer.",
    educationLabel: "EDUCATION / VERIFIED",
    educationTitle: "Software engineering foundation.",
    educationTitle2: "Product-focused execution.",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Section 04: Lab                                             */
  /* ------------------------------------------------------------------ */
  lab: {
    eyebrow: "AERO_LAB",
    titleA: "The portfolio has",
    titleB: "a Frutiger Aero operating system.",
    description:
      "A hand-built lab of Y2K-era interfaces — glassy Aero chrome, gel buttons, reflections and drag-and-drop window management, all engineered from scratch. Windows 7 is the first build; XP and Windows 98 shells are next.",
    launchLab: "Launch the Aero lab",
    resumeSetup: "Open résumé setup",
    viewComponents: "View Aero components",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Section 05: Contact                                         */
  /* ------------------------------------------------------------------ */
  contact: {
    topline: "05 // CONTACT_PROTOCOL",
    channelOpen: "CHANNEL: OPEN",
    subtitleA: "Have a role, a product,",
    subtitleB: "or a difficult interface?",
    ctaA: "LET'S BUILD",
    ctaB: "SOMETHING CLEAR.",
    resumeStatus: "RÉSUMÉ PDF / UPDATE INCOMING",
  },

  /* ------------------------------------------------------------------ */
  /*  Home — Footer                                                      */
  /* ------------------------------------------------------------------ */
  footer: {
    copyright: "© 2026 ZIZHEN LIU",
    engineeredIn: "DESIGNED + ENGINEERED IN SYDNEY",
    backToTop: "BACK TO TOP ↑",
  },

  /* ------------------------------------------------------------------ */
  /*  About page                                                         */
  /* ------------------------------------------------------------------ */
  about: {
    metaTitle: "About — Zizhen Liu",
    metaDescription:
      "The operator behind the terminal: hardware and home lab, photography, automotive interests, languages and education.",
    backHome: "CD ../HOME",
    sectionIndex: "05",
    eyebrow: "OPERATOR_PROFILE",
    title: "The human behind the terminal.",
    introPrefix: " — a ",
    introMiddle: " in ",
    introSuffix:
      ". The professional story lives on the main page and in the project archive; this page is everything that happens when the IDE is closed — and most of it still involves hardware.",
    educationIndex: "05.1",
    educationEyebrow: "EDUCATION_RECORDS",
    factsIndex: "05.2",
    factsEyebrow: "SYSTEM_FACTS",
    languagesLabel: "LANGUAGES",
    languagesValue:
      "English (proficient) · Mandarin (native) · Japanese (learning)",
    accessLabel: "ACCESS",
    accessSuffix: " · full NSW licence (manual)",
    affiliationLabel: "AFFILIATION",
    affiliationValue: "Australian Computer Society member",
    startConversation: "Start a conversation ",
    projectArchive: "PROJECT ARCHIVE",
    aeroLab: "AERO LAB",
    returnToMain: "RETURN TO MAIN ↖",
  },

  /* ------------------------------------------------------------------ */
  /*  Projects / archive page                                            */
  /* ------------------------------------------------------------------ */
  projectsPage: {
    metaTitle: "Project Archive — Zizhen Liu",
    metaDescription:
      "Every project on record: web full-stack products, AI/ML systems, GPU and FPGA work, Android apps and the home lab.",
    backHome: "CD ../HOME",
    sectionIndex: "02",
    eyebrow: "PROJECT_ARCHIVE",
    lsPrefix: "ls -la ./projects — ",
    lsSuffix: " entries.",
    description:
      "Everything on record — pick a domain and its work moves to the front. University and NDA projects are labelled honestly instead of linking nowhere; demos are available on request.",
    requestDemo: "Request a demo ",
    aboutOperator: "ABOUT THE OPERATOR",
    aeroLab: "AERO LAB",
    returnToMain: "RETURN TO MAIN ↖",
  },

  archive: {
    filterLabel: "FILTER:",
    all: "ALL",
    entries: "{count} ENTRIES",
    prioritised: "{hitCount} PRIORITISED · {rest} DIMMED",
    live: "LIVE ↗",
    source: "SOURCE ↗",
    inDevelopment: "IN DEVELOPMENT ↗",
    inDevelopmentNoLink: "IN DEVELOPMENT",
    nda: "NDA · DEMO ON REQUEST",
    youAreHere: "YOU ARE HERE",
    codePrivate: "CODE PRIVATE",
  },

  /* ------------------------------------------------------------------ */
  /*  Labs entry page                                                    */
  /* ------------------------------------------------------------------ */
  labsEntry: {
    brandLine: "ZL // ENTRY PROTOTYPE",
    name: "Zizhen Liu",
    role: "Full-stack Engineer",
    description:
      "The glyph field behind this text is the same live render target that was inside the monitor. No bridge frame, no crossfade, no reset.",
  },

  /* ------------------------------------------------------------------ */
  /*  Demo page                                                          */
  /* ------------------------------------------------------------------ */
  demo: {
    metaTitle: "Aero Glass — Demo",
    metaDescription:
      "Frutiger Aero / glassmorphism component playground.",
    dragInstructions:
      "Drag the windows around — every piece is a hand-built Aero glass component",
    frutigerAero: "Frutiger Aero",
    glassDescription:
      "Hand-built glass: edge refraction, viewport-pinned striations, convex-lens bubbles.",
    aboutMeTitle: "About Me",
    aboutMeDescription:
      "A draggable window — title bar, glossy controls, body and status bar, skinned with our own glass.",
    contactMe: "Contact me",
    resume: "Résumé",
    aboutTab: "About",
    experienceTab: "Experience",
    experienceContent: "Experience timeline goes here.",
    skillsTab: "Skills",
    skills: "Skills",
    progressStates: "Progress states",
    contactTitle: "Contact",
    namePlaceholder: "Your name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sendMessage: "Send message",
    workNav: "Work",
  },

  /* ------------------------------------------------------------------ */
  /*  Win7 Desktop                                                       */
  /* ------------------------------------------------------------------ */
  desktop: {
    metaTitle: "Zizhen Liu — Aero Lab",
    metaDescription:
      "A hand-built Frutiger Aero, Y2K-era desktop lab. Windows 7 is the first build; XP and 98 are next.",
    getStarted: "Get Started",
    aboutMe: "About Me",
    aboutTitle: "About — Zizhen Liu",
    aboutBio:
      "Zizhen Liu (Lance) — Graduate / Junior Frontend Engineer, Sydney.",
    aboutDescription:
      "Recent Master of Information Technology (UNSW) with a Software Engineering (Honours) background (UTS). I build intuitive, high-performing web apps with React, TypeScript and responsive design.",
    aboutExtra:
      "Open to grad/junior roles — 485 visa, full working rights. Off the clock: building PCs since 14, photography, Japanese culture.",
    experienceLabel: "Experience",
    experienceTitle: "Experience",
    intelliCompany: "Intelli New Technologies — Sydney",
    intelliRole: "IT / Business Analysis Intern · Oct 2023 – Jan 2024",
    intelliDesc:
      "Pencil prototyping, responsive UI build, Agile delivery and Scrum training, security and load testing, Python data scrapers.",
    goldenCompany: "Golden Lady Photography — Chongqing",
    goldenRole: "Software Development Intern · Mar – Jul 2024",
    goldenDesc:
      "Next.js + React site frontend; CMS integration; server-side rendering; legacy migration audit; workstation support.",
    projectsLabel: "Projects",
    projectsTitle: "Projects",
    sensorProject:
      "Conversational-AI Sensor Analytics — React 19, ECharts, Web Workers. Query IoT data in natural language.",
    cmoProject:
      "CMO-DB — Weapon Database — 29,000+ records, bilingual, D3.js. ",
    ctvProject:
      "CTV — Violence Detection — React, JWT route guards, multi-panel YOLO video UI.",
    skillsLabel: "Skills",
    skillsTitle: "Skills",
    skillLanguages: "Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3",
    skillFrameworks: "Frameworks: React, React Router, Context API",
    skillUI: "UI / Styling: Tailwind, MUI v5, Bootstrap 5, CSS Grid/Flexbox",
    skillData: "Data / APIs: ECharts, D3.js, Web Workers, Fetch API",
    skillTooling: "Tooling: Vite, Vitest, Git, Vercel, Figma",
    contactLabel: "Contact",
    contactTitle: "Contact",
    linkedinSydney: "LinkedIn · Sydney, Australia",
    githubPrimary: "GitHub · zizhenliu0427",
    githubSecondary: "GitHub · Fairchild2333",
    visaStatus: "485 Temporary Graduate Visa — full working rights",
    startButton: "Start",
    showDesktop: "Show desktop",
    flipHint:
      "Tab / scroll to cycle · click a window or Enter to open · Esc to cancel",
    desktopLabel: "Desktop",
    userName: "Zizhen Liu",
  },

  /* ------------------------------------------------------------------ */
  /*  Boot screen                                                        */
  /* ------------------------------------------------------------------ */
  boot: {
    title: "ZL://BOOT_SEQUENCE — V.01",
    loadProfile: "> loading profile.sys ",
    decryptPortfolio: "> decrypting portfolio.dat ",
    traceSignal: "> tracing signal — sydney.au ",
    accessGranted: "> access granted — entering system",
    ok: "OK",
  },

  /* ------------------------------------------------------------------ */
  /*  OOBE wizard                                                        */
  /* ------------------------------------------------------------------ */
  oobe: {
    metaTitle: "Zizhen Liu — Welcome",
    metaDescription:
      "Frontend engineer portfolio, presented as a Windows Aero setup wizard.",
    startingSetup: "Starting setup…",
    loadingProfile: "Loading profile…",
    installingExperience: "Installing experience…",
    installingProjects: "Installing projects…",
    configuringSkills: "Configuring skills…",
    completingSetup: "Completing setup…",
    welcomeLabel: "Welcome",
    welcomeTitle: "Welcome",
    welcomeName: "Zizhen Liu ",
    welcomeAlias: "(Lance)",
    welcomeRolePrefix: "Graduate / Junior ",
    welcomeRole: "Frontend Engineer",
    welcomeLocation: " · Sydney",
    welcomeDescription:
      "React · TypeScript · responsive UI. Open to grad/junior roles — 485 visa with full working rights. Let's get set up.",
    aboutLabel: "About",
    aboutTitle: "Get to know me",
    aboutEdu:
      "Recent Master of Information Technology (UNSW) with a Software Engineering (Honours) background (UTS).",
    aboutSkills:
      "I build intuitive, high-performing web apps with React, modern JavaScript/TypeScript and responsive design.",
    aboutHobbies:
      "Off the clock: building PCs since 14, photography, and Japanese culture. English (proficient) · Mandarin (native) · Japanese (beginner).",
    experienceLabel: "Experience",
    experienceTitle: "Where I've worked",
    projectsLabel: "Projects",
    projectsTitle: "What I've built",
    skillsLabel: "Skills",
    skillsTitle: "My toolkit",
    contactLabel: "Contact",
    contactTitle: "Let's connect",
    contactStatus:
      "Open to graduate / junior frontend roles across Australia.",
    contactLinkedin: "LinkedIn · Sydney, Australia",
    contactGithubPrimary: "GitHub · zizhenliu0427",
    contactGithubSecondary: "GitHub · Fairchild2333",
    back: "Back",
    next: "Next",
    finish: "Finish",
    scrollHint: "Scroll or ↑ ↓ to move",
  },

  /* ------------------------------------------------------------------ */
  /*  Cinematic entry                                                    */
  /* ------------------------------------------------------------------ */
  cinematic: {
    skipIntro: "SKIP INTRO ",
    ariaLabel: "Cinematic introduction",
  },

  /* ------------------------------------------------------------------ */
  /*  Portfolio data — translatable fields                               */
  /* ------------------------------------------------------------------ */
  data: {
    /* Profile */
    profileRole: "Full-Stack Engineer",
    profileTagline: "WEB · AI · SYSTEMS",
    profileStatement:
      "I build complete products — responsive interfaces, data and AI backends, and systems code all the way down to the GPU.",
    profileAvailability: "Open to software opportunities across Australia",

    /* Capabilities */
    cap01Title: "Interface",
    cap01Desc: "Product surfaces across web and mobile.",
    cap02Title: "Server & data",
    cap02Desc: "APIs, pipelines and the models behind them.",
    cap03Title: "Metal",
    cap03Desc: "Systems code where performance is the product.",
    cap04Title: "Delivery",
    cap04Desc: "From prototype to deployed, tested software.",

    /* Education */
    edu01Degree: "Master of Information Technology",
    edu02Degree: "Bachelor of Software Engineering (Honours)",

    /* Experience roles */
    exp01Role: "Software Developer Intern",
    exp02Role: "IT / Business Analysis Intern",
    exp03Role: "IT Support Intern",

    /* Interests */
    interestHardwareTitle: "Hardware & home lab",
    interestHardwareBody:
      "Building PCs since age 14. Today the lab runs a Windows Server 2025 + Active Directory environment in VMware, a Synology DS923+ NAS with remote access, and a history of Hackintosh EFI/ACPI bring-ups, kext injection and Android custom-ROM rescue work.",
    interestPhotoTitle: "Photography",
    interestPhotoBody:
      "Landscape and HDR photography — a gallery is planned for this site once the selects are curated.",
    interestAutoTitle: "Automotive",
    interestAutoBody:
      "Owner of a Honda Civic Type R (FK8), running ADVAN GT Beyond wheels and Neova AD09 tyres. Manual, of course.",
    interestCultureTitle: "Languages & culture",
    interestCultureBody:
      "Native Mandarin, proficient English, beginner Japanese — studying it alongside a long-running interest in Japanese culture and anime.",
  },

  /* ------------------------------------------------------------------ */
  /*  Featured project copy (keyed by project id in data/portfolio.ts)    */
  /* ------------------------------------------------------------------ */
  projectContent: {
    sensor: {
      type: "UNSW Capstone \u00b7 End-to-end data product",
      summary:
        "An IoT analytics platform where building managers query live sensor data in natural language \u2014 built across the React front end, the FastAPI/Kafka backend and the RAG pipeline behind the conversation.",
      highlights: [
        "React 19 SPA \u00b7 Web Workers for CSV/Excel parsing",
        "Kafka ingestion + PostgreSQL UPSERT batch pipeline",
        "RAG with Qdrant + local LLMs (Ollama) and NL2SQL",
      ],
      metric: "FULL-STACK + AI",
      access: "UNI PROJECT / CODE PRIVATE",
    },
    cmo: {
      type: "Personal team \u00b7 Live full-stack product",
      summary:
        "A responsive, wiki-like equipment database \u2014 bilingual routing and D3 visuals up front, a serverless Node/Express + Sequelize backend answering 6-table joins across 29,000+ records behind it.",
      highlights: [
        "29,000+ records \u00b7 parameterised multi-table JOINs",
        "Serverless migration to Vercel, zero-maintenance infra",
        "English / Chinese URL routing \u00b7 custom D3 sensor arcs",
      ],
      metric: "29K+ RECORDS",
    },
    ctv: {
      type: "UTS team project \u00b7 Full-stack + computer vision",
      summary:
        "A real-time monitoring platform: YOLOv8 trained on 10,025 hand-annotated frames, served through a Django REST + MJPEG streaming backend into a multi-camera React dashboard.",
      highlights: [
        "YOLOv8 trained to 85% mAP50 on an RTX 4090",
        "Sub-200ms OpenCV \u2192 MJPEG live streaming pipeline",
        "JWT-secured React SPA with 1/2/4/6 camera layouts",
      ],
      metric: "85% mAP50 LIVE",
      access: "TEAM PROJECT / CODE PRIVATE",
    },
    novacart: {
      type: "Personal product \u00b7 E-commerce platform \u00b7 in development",
      summary:
        "A mobile-first e-commerce platform built end to end \u2014 a Next.js PWA storefront over an ASP.NET Core + PostgreSQL backend with Stripe payments, Redis caching, server-side cart persistence and a configurable order state machine.",
      highlights: [
        "Configurable order state machine + admin analytics",
        "Server-side cart persistence \u00b7 Stripe payments",
        "Dockerised ASP.NET Core + PostgreSQL + Redis stack",
      ],
      metric: "IN ACTIVE DEV",
    },
    mediajira: {
      type: "Codritium internship \u00b7 Platform engineering across the stack",
      summary:
        "The campaign-management platform built at Codritium \u2014 real-time chat made reliable under 100-user load, multi-user spreadsheet collaboration, Calendly-style booking links, a 373-file slug-URL migration across 12 modules and a CI pipeline cut from 57 to 20 minutes.",
      highlights: [
        "Chat under 100-user load: 83\u201389% \u2192 9,900/9,900 delivered, WebSocket p95 47.5s \u2192 5.0s",
        "Real-time spreadsheet collaboration \u00b7 presence, remote cursors, ~155ms peer edits",
        "CI \u221266% (+597 recovered tests) \u00b7 12-module slug-URL migration + IDOR fixes",
      ],
      metric: "9,900/9,900 DELIVERED",
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Archive copy (keyed by archive id in data/portfolio.ts)             */
  /* ------------------------------------------------------------------ */
  archiveContent: {
    stickybeak: { summary: "An Australian souvenir and regional-speciality shop with a React storefront and administration console, Spring Cloud microservices, Stripe sandbox payments, an order state machine and RabbitMQ fulfilment events." },
    "sdr2hdr": { summary: "Fully GPU-resident video pipeline (NVDEC \u2192 CUDA \u2192 RTX TrueHDR/VSR \u2192 NVENC) sustaining ~120fps real-time 4K HDR conversion, with hand-written colour-space kernels, HDR10 metadata signalling and a bilingual CLI." },
    "portfolio": { summary: "The site you are reading: a Next.js static build with a canvas code-rain, CRT ambient layers and a hand-built Windows 7 Aero window manager living at /desktop." },
    "gpu-benchmark": { summary: "C++17 benchmark with five backends \u2014 Vulkan, DX12, DX11, OpenGL, Metal \u2014 profiling 10+ AMD and NVIDIA GPUs, including six generations of AMD architectures; a headless compute mode uncovered 12x hidden throughput. 2,300-line technical report." },
    "mediajira-archive": { summary: "Codritium internship product (MediaJira): a campaign-management platform for media-buying teams \u2014 Next.js/TypeScript over Django REST + Channels, with Celery jobs, PostgreSQL/Redis, ad-platform integrations, real-time chat and collaborative spreadsheets." },
    "novacart-archive": { summary: "Mobile-first e-commerce platform in active development: an ASP.NET Core + PostgreSQL backend with a configurable order state machine, Stripe payments, Redis caching and server-side cart persistence, behind a Next.js PWA storefront with admin analytics." },
    "lanely": { summary: "Full-stack Kanban tool \u2014 drag-and-drop boards, real-time collaboration over WebSockets and project analytics, with a FastAPI + SQLAlchemy backend behind a React/TypeScript front end." },
    "whale-logistics": { summary: "Spring Cloud microservices platform modernising end-to-end sea-freight workflows: automates container visibility from the wharf to empty dehire, replacing manual email coordination and mitigating detention risk." },
    "av2text": { summary: "AI audio/video transcription with speaker diarisation, shipped three ways \u2014 CLI, web app and Electron desktop \u2014 with FFmpeg preprocessing in front of Whisper-class ASR models." },
    "breaktime": { summary: "Kahoot-style party-game platform: host on a projector, players join from their phones \u2014 real-time game rooms over Socket.IO in a Vue 3 + TypeScript monorepo, installable as a PWA." },
    "hls-keeper": { summary: "Captures HLS streams and site attachments via a browser extension talking to a local Python server with a web dashboard; FFmpeg merges segments into playable archives, all on your own machine." },
    "bili-dns": { summary: "Fixes overseas Bilibili buffering by probing CDN edge nodes and pinning the fastest via DNS \u2014 periodic re-checks, threshold protection and candidate-IP refresh across Windows, macOS, OpenWrt and AdGuard Home." },
    "sensor-archive": { summary: "End-to-end IoT analytics: React 19 SPA, FastAPI + Kafka ingestion, TFT time-series forecasting with quantile regression, and a RAG/NL2SQL conversational layer over Qdrant with local LLMs." },
    "gdwg": { summary: "Modern C++20 generic graph container with value semantics, a polymorphic edge hierarchy, deterministic ordering and full Catch2 unit-test coverage." },
    "isic2018": { summary: "Fine-tuned DenseNet/EfficientNet/ResNet backbones with a hand-implemented Squeeze-and-Excitation attention module, reaching 83% macro F1 on severely imbalanced dermoscopy data; Grad-CAM interpretability." },
    "ctv-archive": { summary: "YOLOv8 trained on a self-annotated 10,025-frame dataset (85% mAP50), served via Django REST with sub-200ms MJPEG streaming into a JWT-secured multi-camera React dashboard." },
    "cmo-db": { summary: "Wiki-like database serving 29,000+ records: serverless Node/Express + Sequelize backend, bilingual URL routing, deferred rendering and custom D3 sensor-arc visualisations." },
    "kv260": { summary: "VHDL I2S receiver in programmable logic streaming 48kHz/24-bit audio through AXI4-Stream + DMA into Linux, with Device Tree integration and an AXI-Lite controlled gain/EQ stage." },
    "good360": { summary: "Kotlin/MVVM chat feature for Good360 Australia's donation app: multi-type RecyclerView messaging, Firebase Realtime sync, image messages and deterministic chat-room IDs." },
    "budget-app": { summary: "Personal-finance Android app for tracking daily spending \u2014 in active development." },
    "home-lab": { summary: "Windows Server 2025 + Active Directory lab in VMware WorkStation, a Synology NAS with remote access and IPv6, and low-level device work: Hackintosh EFI/ACPI bring-up, kext injection and Android custom-ROM recovery." },
  },

  /* ------------------------------------------------------------------ */
  /*  Experience copy (keyed by experience id in data/portfolio.ts)       */
  /* ------------------------------------------------------------------ */
  experienceContent: {
    codritium: {
      company: "Codritium",
      period: "MAR 2026 — PRESENT",
      location: "Sydney, Australia",
      role: "Software Developer Intern",
      bullets: [
        "Building Marketing Simplified (MediaJira), a campaign-management platform for media-buying teams — a Next.js/TypeScript front end over a Django REST + Channels backend.",
        "Ruled out the obvious diagnosis before designing: an audit found Kafka provisioned in the Docker stack but carrying zero application traffic, and Celery on Redis already in place — the real defect was a send pipeline only partly asynchronous, with an unreliable database-commit-to-broker boundary. Rather than introduce a new broker, made that hand-off durable with a transactional outbox, moved O(recipients) status writes off the HTTP path, isolated the chat queues and routed traffic through PgBouncer: 100 messages and all 9,900 delivery statuses landed at 100 concurrent users, and connection setup fell from 50.88ms to 2.96ms.",
        "Found and fixed two channel-layer defects that were dropping messages silently — queue capacity and expiry were both running on defaults, so roughly 12,000 of 148,500 deliveries (8%) disappeared under load while every message was committed and every status recorded as delivered, one defect logging a single INFO line and the other nothing at all. With both set explicitly and reconnect replay added, the same run delivered 148,500 of 148,500.",
        "Built multi-user spreadsheet collaboration on Django Channels — presence, remote cursors and committed cell edits, with one-time WebSocket tickets consumed atomically in Redis, Lua-script presence cleanup and jittered exponential-backoff reconnection — measuring 155ms p95 end-to-end propagation and 3ms p95 cursor routing, stable at 50 concurrent editors on staggered arrival.",
        "Hardened access control by scoping owner-owned endpoints to the requesting user, closing cases where changing an id in the URL exposed another account's data, and fixed an expired session that retried token refresh forever instead of signing the user out.",
        "Migrated 12 core modules from numeric URL ids to human-readable slugs in a 373-file change, using a three-step add/backfill/not-null migration per module and keeping deep links backwards compatible.",
        "Cut CI from 57 to 20 minutes: parallel execution raised the collected pytest suite from 3,808 to 4,405 tests while halving its runtime from roughly 22 to 11 minutes, and freeing a GitHub Actions cache stuck at 10.31GB against a 10GB quota — 79 of its 89 entries were 9.81GB of buildkit layer blobs — took repeat builds from 0 of 4 cache hits to a hit every time; frontend lint, type-check and jest gates also became blocking instead of silently passing.",
        "Added a live WebSocket session gauge exported through Prometheus with a Grafana board, via a Channels consumer base class so all seven consumers report without touching their own lifecycle code, and made the count correct across rejected handshakes, post-accept crashes and repeated closes.",
        "Recovered a production outage by restoring 144 migrations as no-ops, then added post-deploy health polling and a CI guard that fails any pull request deleting or renaming a migration.",
      ],
    },
    intelli: {
      company: "Intelli New Technologies",
      period: "OCT 2023 — JAN 2024",
      location: "Sydney, Australia",
      role: "IT / Business Analysis Intern",
      bullets: [
        "Built Python scrapers and Pandas ETL pipelines to collect, validate and normalise semi-structured web data for downstream features.",
        "Translated business requirements into user stories and API contracts, verifying React components in Agile sprint reviews via Jira/Confluence, and authored an internal Scrum training course covering roles, artifacts, events and scaling frameworks.",
        "Evaluated Pencil Project against Figma and Adobe XD on capability, collaboration and cost, then produced and validated wireframes in the chosen tool to support responsive implementation across the frontend/backend boundary.",
        "Reverse-engineered live sites end to end — HTML source, Wireshark packet captures and BuiltWith fingerprinting — tracing a scraper's empty image results to CSS backgrounds and JavaScript-injected assets rather than standard image tags.",
        "Ran a cross-platform compatibility matrix across Windows, macOS and Android on Edge, Chrome, Firefox and Safari, paired with Lighthouse performance and accessibility audits at each responsive breakpoint.",
        "Scanned a client site with Nikto and reported missing X-Frame-Options, HSTS and X-Content-Type-Options headers alongside TLS and certificate findings, pairing each with a concrete remediation directive.",
        "Load-tested the same client site from 100 to 10,000 concurrent users, tracking response time, error rate and throughput, and showed the error rate reaching 83% at 500 users.",
        "Logged and triaged defects on a shared severity/priority template, escalating a full production outage at the highest rating.",
      ],
    },
    goldenlady: {
      company: "Golden Lady Photography",
      period: "MAR 2024 — JUL 2024",
      location: "Chongqing, China",
      role: "Software Development Intern",
      bullets: [
        "Rebuilt the Guangzhou branch's website frontend on Next.js (Pages Router) and React: 9 page templates serving roughly 300 reachable URLs across 9 navigation sections and 9 store locations.",
        "Drove roughly 295 CMS entries through Axios against the category, article and appointment APIs, pairing Ant Design and SWR for the appointment form and handling list pagination, the category tree and image CDN delivery.",
        "Rendered pages server-side with getServerSideProps so Baidu and WeChat could index titles and body copy — with no sitemap in place, server-rendered markup was the only way search engines could reach the content; detail pages render CMS rich text with images and video, and bundles are split per route.",
        "Audited the legacy DedeCMS PHP site page by page for missing pages, broken routes and 301s, mobile breakpoints, failing form submissions and style drift.",
        "Aligned CMS field contracts (tid/bid/rid) with the backend and filled in edge pages the spec had missed, keeping the site live throughout.",
        "Diagnosed workstation hardware and configured operating systems and creative software for heavy-workload use.",
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Capability groups (keyed by capability id)                          */
  /* ------------------------------------------------------------------ */
  capabilityContent: {
    interface: {
      title: "Interface",
      description: "Product surfaces across web and mobile.",
    },
    server: {
      title: "Server & data",
      description: "APIs, pipelines and the models behind them.",
    },
    metal: {
      title: "Metal",
      description: "Systems code where performance is the product.",
    },
    delivery: {
      title: "Delivery",
      description: "From prototype to deployed, tested software.",
    },
  },

  /* ------------------------------------------------------------------ */
  /*  Education (keyed by education id)                                   */
  /* ------------------------------------------------------------------ */
  educationContent: {
    unsw: {
      school: "University of New South Wales (UNSW)",
      degree: "Master of Information Technology",
      courses: ["Capstone Project (85)", "Artificial Intelligence (81)", "Advanced C++ (81)"],
    },
    uts: {
      school: "University of Technology Sydney (UTS)",
      degree: "Bachelor of Software Engineering (Honours)",
      courses: ["Database Fundamentals (94)", "Systems Testing & QM (90)", "Data Structures & Algorithms (84)"],
    },
  },
} as const;
