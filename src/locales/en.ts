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
      "Figma prototyping, responsive UI build, Agile delivery, React component verification, Python data scrapers.",
    goldenCompany: "Golden Lady Photography — Chongqing",
    goldenRole: "IT Support Intern · May – Aug 2021",
    goldenDesc:
      "Maintained a Vue.js corporate site; responsive UI tweaks; system setup.",
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
} as const;
