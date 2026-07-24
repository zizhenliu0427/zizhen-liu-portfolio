export const profile = {
  name: "Zizhen Liu",
  preferredName: "Lance",
  role: "Full-Stack Engineer",
  tagline: "WEB · AI · SYSTEMS",
  location: "Sydney, Australia",
  email: "lzz288898@gmail.com",
  github: "https://github.com/zizhenliu0427",
  githubSecondary: "https://github.com/Fairchild2333",
  linkedin: "https://www.linkedin.com/in/zizhen-liu-580a40258/",
  workRights: "485 visa · full working rights",
  availability: "Open to software opportunities across Australia",
  statement:
    "I build complete products — responsive interfaces, data and AI backends, and systems code all the way down to the GPU.",
} as const;

export type FeaturedProject = {
  id: string;
  index: string;
  year: string;
  title: string;
  type: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  metric: string;
  visual: "sensor" | "database" | "camera" | "cart" | "campaign";
  /** Live product URL, shown as "View live project". */
  href?: string;
  /** Public repository URL, shown as "View source". */
  github?: string;
  /** Honest access label when neither link exists. */
  access?: string;
  /** In-page anchor to the matching experience entry (e.g. "#exp-codritium"). */
  experienceHref?: string;
};

export const projects: readonly FeaturedProject[] = [
  {
    id: "sensor",
    index: "01",
    year: "2025",
    title: "Conversational AI for Building Sensor Data",
    type: "UNSW Capstone · End-to-end data product",
    summary:
      "An IoT analytics platform where building managers query live sensor data in natural language — built across the React front end, the FastAPI/Kafka backend and the RAG pipeline behind the conversation.",
    highlights: [
      "React 19 SPA · Web Workers for CSV/Excel parsing",
      "Kafka ingestion + PostgreSQL UPSERT batch pipeline",
      "RAG with Qdrant + local LLMs (Ollama) and NL2SQL",
    ],
    stack: ["React 19", "TypeScript", "FastAPI", "Kafka", "PostgreSQL", "Qdrant"],
    metric: "FULL-STACK + AI",
    visual: "sensor",
    access: "UNI PROJECT / CODE PRIVATE",
  },
  {
    id: "cmo",
    index: "02",
    year: "2023—24",
    title: "CMO-DB",
    type: "Personal team · Live full-stack product",
    summary:
      "A responsive, wiki-like equipment database — bilingual routing and D3 visuals up front, a serverless Node/Express + Sequelize backend answering 6-table joins across 29,000+ records behind it.",
    highlights: [
      "29,000+ records · parameterised multi-table JOINs",
      "Serverless migration to Vercel, zero-maintenance infra",
      "English / Chinese URL routing · custom D3 sensor arcs",
    ],
    stack: ["JavaScript", "Node.js", "Express", "Sequelize", "D3.js", "i18next"],
    metric: "29K+ RECORDS",
    visual: "database",
    href: "https://www.cmo-db.com/",
  },
  {
    id: "ctv",
    index: "03",
    year: "2023",
    title: "CTV Violence Detection",
    type: "UTS team project · Full-stack + computer vision",
    summary:
      "A real-time monitoring platform: YOLOv8 trained on 10,025 hand-annotated frames, served through a Django REST + MJPEG streaming backend into a multi-camera React dashboard.",
    highlights: [
      "YOLOv8 trained to 85% mAP50 on an RTX 4090",
      "Sub-200ms OpenCV → MJPEG live streaming pipeline",
      "JWT-secured React SPA with 1/2/4/6 camera layouts",
    ],
    stack: ["React 18", "Django REST", "PyTorch", "YOLOv8", "OpenCV", "MySQL"],
    metric: "85% mAP50 LIVE",
    visual: "camera",
    access: "TEAM PROJECT / CODE PRIVATE",
  },
  {
    id: "novacart",
    index: "04",
    year: "2026",
    title: "Novacart",
    type: "Personal product · E-commerce platform · in development",
    summary:
      "A mobile-first e-commerce platform built end to end — a Next.js PWA storefront over an ASP.NET Core + PostgreSQL backend with Stripe payments, Redis caching, server-side cart persistence and a configurable order state machine.",
    highlights: [
      "Configurable order state machine + admin analytics",
      "Server-side cart persistence · Stripe payments",
      "Dockerised ASP.NET Core + PostgreSQL + Redis stack",
    ],
    stack: ["ASP.NET Core", "C#", "Next.js", "PostgreSQL", "Stripe", "Redis"],
    metric: "IN ACTIVE DEV",
    visual: "cart",
    github: "https://github.com/zizhenliu0427/Novacart",
  },
  {
    id: "mediajira",
    index: "05",
    year: "2026",
    title: "Marketing Simplified (MediaJira)",
    type: "Codritium internship · Platform engineering across the stack",
    summary:
      "The campaign-management platform I build at Codritium — a 373-file slug-URL migration across 12 Django/Next.js modules, a CI pipeline rebuilt from 57 to 20 minutes, a production outage diagnosed and recovered on GCP, and CSM features shipped end to end.",
    highlights: [
      "12-module slug-URL architecture + IDOR access-control hardening",
      "CI −66%: pytest config fix (+597 recovered tests), xdist, blocking quality gates",
      "Prod 521 recovery — 144 migrations restored, migration guard + health polling",
    ],
    stack: ["Next.js", "TypeScript", "Django REST", "PostgreSQL", "GitHub Actions", "Docker"],
    metric: "4,758 TESTS GREEN",
    visual: "campaign",
    href: "https://zmarkio.com/",
    github: "https://github.com/quanwangniuniu/marketing-simplified",
    experienceHref: "#exp-codritium",
  },
];

export type ArchiveAccess =
  | { kind: "live"; href: string; source?: string }
  | { kind: "github"; href: string }
  | { kind: "nda" }
  | { kind: "private" }
  | { kind: "wip"; href?: string }
  | { kind: "here"; href?: string }
  | { kind: "none" };

export type ArchiveEntry = {
  year: string;
  title: string;
  domains: readonly string[];
  summary: string;
  stack: readonly string[];
  access: ArchiveAccess;
};

export const archive: readonly ArchiveEntry[] = [
  {
    year: "2026",
    title: "sdr2hdr — GPU SDR-to-HDR / Super-Resolution Pipeline",
    domains: ["SYSTEMS"],
    summary:
      "Fully GPU-resident video pipeline (NVDEC → CUDA → RTX TrueHDR/VSR → NVENC) sustaining ~120fps real-time 4K HDR conversion, with hand-written colour-space kernels, HDR10 metadata signalling and a bilingual CLI.",
    stack: ["C++17", "CUDA", "NVENC/NVDEC", "RTX Video SDK", "FFmpeg"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/sdr2hdr",
    },
  },
  {
    year: "2026",
    title: "This portfolio — Matrix CRT terminal + Aero OS lab",
    domains: ["WEB"],
    summary:
      "The site you are reading: a Next.js static build with a canvas code-rain, CRT ambient layers and a hand-built Windows 7 Aero window manager living at /desktop.",
    stack: ["Next.js", "TypeScript", "Canvas", "CSS Modules", "Cloudflare"],
    access: {
      kind: "here",
      href: "https://github.com/zizhenliu0427/zizhen-liu-portfolio",
    },
  },
  {
    year: "2026",
    title: "Multi-Graphics-API GPU Compute Benchmark",
    domains: ["SYSTEMS"],
    summary:
      "C++17 benchmark with five backends — Vulkan, DX12, DX11, OpenGL, Metal — profiling 10+ AMD and NVIDIA GPUs, including six generations of AMD architectures; a headless compute mode uncovered 12x hidden throughput. 2,300-line technical report.",
    stack: ["C++17", "Vulkan", "DirectX 12", "Metal", "RenderDoc", "Python"],
    access: {
      kind: "github",
      href: "https://github.com/Fairchild2333/Multi-Graphics-API-GPU-Benchmark",
    },
  },
  {
    year: "2026",
    title: "Marketing Simplified — Campaign Management Platform",
    domains: ["WEB"],
    summary:
      "Codritium internship product (MediaJira): a campaign-management platform for media-buying teams — Next.js/TypeScript over Django REST + Channels, with Kafka event streaming, Celery jobs, ad-platform integrations and a Prometheus/Grafana/Loki/Jaeger observability stack.",
    stack: ["Next.js", "TypeScript", "Django REST", "Kafka", "Celery", "PostgreSQL"],
    access: {
      kind: "live",
      href: "https://zmarkio.com/",
      source: "https://github.com/quanwangniuniu/marketing-simplified",
    },
  },
  {
    year: "2026",
    title: "Novacart — E-Commerce Platform",
    domains: ["WEB"],
    summary:
      "Mobile-first e-commerce platform in active development: an ASP.NET Core + PostgreSQL backend with a configurable order state machine, Stripe payments, Redis caching and server-side cart persistence, behind a Next.js PWA storefront with admin analytics.",
    stack: ["ASP.NET Core", "Next.js", "PostgreSQL", "Stripe", "Redis", "Docker"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/Novacart",
    },
  },
  {
    year: "2026",
    title: "Lanely — Kanban Project Management",
    domains: ["WEB"],
    summary:
      "Full-stack Kanban tool — drag-and-drop boards, real-time collaboration over WebSockets and project analytics, with a FastAPI + SQLAlchemy backend behind a React/TypeScript front end.",
    stack: ["FastAPI", "SQLAlchemy", "React", "TypeScript", "WebSocket", "Docker"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/lanely",
    },
  },
  {
    year: "2026",
    title: "Whale Logistics CMS — Sea-Freight Microservices",
    domains: ["WEB"],
    summary:
      "Spring Cloud microservices platform modernising end-to-end sea-freight workflows: automates container visibility from the wharf to empty dehire, replacing manual email coordination and mitigating detention risk.",
    stack: ["Java", "Spring Cloud", "RabbitMQ", "React", "TypeScript", "Docker"],
    access: {
      kind: "github",
      href: "https://github.com/Fairchild2333/whale-logistics-cms",
    },
  },
  {
    year: "2026",
    title: "Audio/Video2Text AI — Transcription Suite",
    domains: ["AI/ML", "WEB"],
    summary:
      "AI audio/video transcription with speaker diarisation, shipped three ways — CLI, web app and Electron desktop — with FFmpeg preprocessing in front of Whisper-class ASR models.",
    stack: ["Python", "Whisper", "FFmpeg", "FastAPI", "Next.js", "Electron"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/Audio-Video2Text-AI",
    },
  },
  {
    year: "2026",
    title: "Breaktime Arcade — Multiplayer Party Games",
    domains: ["WEB"],
    summary:
      "Kahoot-style party-game platform: host on a projector, players join from their phones — real-time game rooms over Socket.IO in a Vue 3 + TypeScript monorepo, installable as a PWA.",
    stack: ["Vue 3", "TypeScript", "Socket.IO", "Express", "PWA"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/breaktime-arcade",
    },
  },
  {
    year: "2026",
    title: "HLS Keeper — Local-First Stream Archiver",
    domains: ["WEB"],
    summary:
      "Captures HLS streams and site attachments via a browser extension talking to a local Python server with a web dashboard; FFmpeg merges segments into playable archives, all on your own machine.",
    stack: ["Python", "Chrome Extension", "FFmpeg", "HLS"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/hls-keeper",
    },
  },
  {
    year: "2026",
    title: "Bili CDN DNS Pin — Streaming Network Tuner",
    domains: ["SYSTEMS"],
    summary:
      "Fixes overseas Bilibili buffering by probing CDN edge nodes and pinning the fastest via DNS — periodic re-checks, threshold protection and candidate-IP refresh across Windows, macOS, OpenWrt and AdGuard Home.",
    stack: ["Shell", "DNS", "OpenWrt", "AdGuard Home"],
    access: {
      kind: "github",
      href: "https://github.com/zizhenliu0427/bili-cdn-dns-pin",
    },
  },
  {
    year: "2025",
    title: "Conversational AI for Building Sensor Data",
    domains: ["WEB", "AI/ML"],
    summary:
      "End-to-end IoT analytics: React 19 SPA, FastAPI + Kafka ingestion, TFT time-series forecasting with quantile regression, and a RAG/NL2SQL conversational layer over Qdrant with local LLMs.",
    stack: ["React 19", "FastAPI", "Kafka", "PostgreSQL", "Qdrant", "PyTorch"],
    access: { kind: "private" },
  },
  {
    year: "2025",
    title: "GDWG — Generic Directed Weighted Graph Library",
    domains: ["SYSTEMS"],
    summary:
      "Modern C++20 generic graph container with value semantics, a polymorphic edge hierarchy, deterministic ordering and full Catch2 unit-test coverage.",
    stack: ["C++20", "STL", "Templates", "Catch2"],
    access: { kind: "private" },
  },
  {
    year: "2024",
    title: "Skin Lesion Classification — ISIC2018",
    domains: ["AI/ML"],
    summary:
      "Fine-tuned DenseNet/EfficientNet/ResNet backbones with a hand-implemented Squeeze-and-Excitation attention module, reaching 83% macro F1 on severely imbalanced dermoscopy data; Grad-CAM interpretability.",
    stack: ["PyTorch", "Albumentations", "scikit-learn", "OpenCV"],
    access: { kind: "private" },
  },
  {
    year: "2023",
    title: "CTV — Real-Time Violence Detection",
    domains: ["WEB", "AI/ML"],
    summary:
      "YOLOv8 trained on a self-annotated 10,025-frame dataset (85% mAP50), served via Django REST with sub-200ms MJPEG streaming into a JWT-secured multi-camera React dashboard.",
    stack: ["PyTorch", "YOLOv8", "Django REST", "React 18", "OpenCV"],
    access: { kind: "private" },
  },
  {
    year: "2023—24",
    title: "CMO-DB — Bilingual Equipment Database",
    domains: ["WEB"],
    summary:
      "Wiki-like database serving 29,000+ records: serverless Node/Express + Sequelize backend, bilingual URL routing, deferred rendering and custom D3 sensor-arc visualisations.",
    stack: ["Node.js", "Express", "Sequelize", "D3.js", "i18next", "Vercel"],
    access: { kind: "live", href: "https://www.cmo-db.com/" },
  },
  {
    year: "2023",
    title: "FPGA Audio Capture & Gain EQ — AMD Kria KV260",
    domains: ["HARDWARE"],
    summary:
      "VHDL I2S receiver in programmable logic streaming 48kHz/24-bit audio through AXI4-Stream + DMA into Linux, with Device Tree integration and an AXI-Lite controlled gain/EQ stage.",
    stack: ["VHDL", "Vivado", "AXI4 / DMA", "PetaLinux", "C/C++"],
    access: { kind: "private" },
  },
  {
    year: "2023",
    title: "Good360 Donation App — Real-Time Chat Module",
    domains: ["MOBILE"],
    summary:
      "Kotlin/MVVM chat feature for Good360 Australia's donation app: multi-type RecyclerView messaging, Firebase Realtime sync, image messages and deterministic chat-room IDs.",
    stack: ["Kotlin", "MVVM", "Firebase", "RecyclerView"],
    access: { kind: "nda" },
  },
  {
    year: "ONGOING",
    title: "Budget Manage App",
    domains: ["MOBILE"],
    summary:
      "Personal-finance Android app for tracking daily spending — in active development.",
    stack: ["Android", "Kotlin"],
    access: {
      kind: "wip",
      href: "https://github.com/Fairchild2333/Budge-Manage-App",
    },
  },
  {
    year: "ONGOING",
    title: "Home Lab — Server, NAS & Device Restoration",
    domains: ["LAB"],
    summary:
      "Windows Server 2025 + Active Directory lab in VMware WorkStation, a Synology NAS with remote access and IPv6, and low-level device work: Hackintosh EFI/ACPI bring-up, kext injection and Android custom-ROM recovery.",
    stack: ["Windows Server", "Active Directory", "Synology", "EFI/ACPI", "ADB"],
    access: { kind: "none" },
  },
] as const;

export type ExperienceLink = {
  label: string;
  href: string;
  /** Hosted in mainland China — may be affected by GFW and may only be accessible from Chinese networks directly. */
  cn?: boolean;
  /** Same-page anchor link (renders without target="_blank"). */
  internal?: boolean;
};

export type ExperienceItem = {
  period: string;
  company: string;
  location: string;
  role: string;
  bullets: readonly string[];
  links?: readonly ExperienceLink[];
};

export const experience: readonly ExperienceItem[] = [
  {
    period: "JUN 2026 — PRESENT",
    company: "Codritium",
    location: "Sydney, Australia",
    role: "Software Developer Intern",
    bullets: [
      "Building Marketing Simplified (MediaJira), a campaign-management platform for media-buying teams — a Next.js/TypeScript front end over a Django REST + Channels backend.",
      "Working across an event-driven, containerised stack: Kafka event pipelines, Celery background jobs, PostgreSQL/Redis, Nginx and Docker Compose.",
      "Shipping with production-grade observability (OpenTelemetry → Prometheus/Grafana/Loki/Jaeger) and a Jest/pytest/K6 test pipeline in GitHub Actions CI.",
    ],
    links: [
      { label: "FEATURED_05", href: "#project-mediajira", internal: true },
      { label: "ZMARKIO.COM", href: "https://zmarkio.com/" },
      {
        label: "SOURCE",
        href: "https://github.com/quanwangniuniu/marketing-simplified",
      },
      { label: "CODRITIUM", href: "https://www.codritium.com/" },
      {
        label: "LINKEDIN",
        href: "https://www.linkedin.com/company/codritium/",
      },
    ],
  },
  {
    period: "OCT 2023 — JAN 2024",
    company: "Intelli New Technologies",
    location: "Sydney, Australia",
    role: "IT / Business Analysis Intern",
    bullets: [
      "Built Python scrapers and Pandas ETL pipelines to collect, validate and normalise semi-structured web data for downstream features.",
      "Translated business requirements into user stories and API contracts, verifying React components in Agile sprint reviews via Jira/Confluence.",
      "Produced and validated data-dashboard wireframes, supporting responsive implementation across the frontend/backend boundary.",
    ],
    links: [
      { label: "INTELLINEW.COM.AU", href: "https://intellinew.com.au/" },
      {
        label: "LINKEDIN",
        href: "https://www.linkedin.com/company/intelli-new-technologies/",
      },
    ],
  },
  {
    period: "MAY 2021 — AUG 2021",
    company: "Golden Lady Photography",
    location: "Chongqing, China",
    role: "IT Support Intern",
    bullets: [
      "Maintained a Vue.js corporate site in production, shipping responsive UI and content updates safely.",
      "Diagnosed workstation hardware and configured operating systems and creative software for heavy-workload use.",
    ],
    links: [
      { label: "GROUP SITE", href: "https://goldenladies.com/", cn: true },
      { label: "CHONGQING", href: "https://cq.121314.com/", cn: true },
      { label: "GUANGZHOU", href: "http://www.jfrgz.com/", cn: true },
      {
        label: "LINKEDIN",
        href: "https://www.linkedin.com/company/%E9%87%8D%E5%BA%86%E9%87%91%E5%A4%AB%E4%BA%BA%E5%AE%9E%E4%B8%9A%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8/",
      },
    ],
  },
];

export const capabilities = [
  {
    index: "01",
    title: "Interface",
    description: "Product surfaces across web and mobile.",
    items: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "ECharts / D3", "Android (Kotlin)"],
  },
  {
    index: "02",
    title: "Server & data",
    description: "APIs, pipelines and the models behind them.",
    items: ["FastAPI", "Django REST", "Node.js / Express", "PostgreSQL / MySQL", "Kafka", "RAG / Qdrant", "PyTorch"],
  },
  {
    index: "03",
    title: "Metal",
    description: "Systems code where performance is the product.",
    items: ["C++17/20", "CUDA", "Vulkan / DX12 / Metal", "NVENC / NVDEC", "VHDL / FPGA", "Linux"],
  },
  {
    index: "04",
    title: "Delivery",
    description: "From prototype to deployed, tested software.",
    items: ["Docker", "Git", "Vercel / Cloudflare", "Vitest / Catch2", "Jira / Confluence", "Agile"],
  },
] as const;

export type EducationItem = {
  school: string;
  location: string;
  /** Verified rank chip, e.g. "QS 2027 · WORLD #19". Keep it short. */
  ranking?: string;
  degree: string;
  period: string;
  courses: readonly string[];
};

export const education: readonly EducationItem[] = [
  {
    school: "University of New South Wales (UNSW)",
    location: "Sydney, Australia",
    ranking: "QS 2027 · WORLD #19 · AU #1",
    degree: "Master of Information Technology",
    period: "2024 — 2025",
    courses: ["Capstone Project (85)", "Artificial Intelligence (81)", "Advanced C++ (81)"],
  },
  {
    school: "University of Technology Sydney (UTS)",
    location: "Sydney, Australia",
    ranking: "QS 2027 · WORLD #87",
    degree: "Bachelor of Software Engineering (Honours)",
    period: "2021 — 2024",
    courses: ["Database Fundamentals (94)", "Systems Testing & QM (90)", "Data Structures & Algorithms (84)"],
  },
];

export const interests = [
  {
    id: "hardware",
    title: "Hardware & home lab",
    body:
      "Building PCs since age 14. Today the lab runs a Windows Server 2025 + Active Directory environment in VMware, a Synology DS923+ NAS with remote access, and a history of Hackintosh EFI/ACPI bring-ups, kext injection and Android custom-ROM rescue work.",
  },
  {
    id: "photography",
    title: "Photography",
    body:
      "Landscape and HDR photography — a gallery is planned for this site once the selects are curated.",
  },
  {
    id: "automotive",
    title: "Automotive",
    body:
      "Owner of a Honda Civic Type R (FK8), running ADVAN GT Beyond wheels and Neova AD09 tyres. Manual, of course.",
  },
  {
    id: "culture",
    title: "Languages & culture",
    body:
      "Native Mandarin, proficient English, beginner Japanese — studying it alongside a long-running interest in Japanese culture and anime.",
  },
] as const;
