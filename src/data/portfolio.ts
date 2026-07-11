export const profile = {
  name: "Zizhen Liu",
  preferredName: "Lance",
  role: "Graduate / Junior Frontend Engineer",
  location: "Sydney, Australia",
  email: "lzz288898@gmail.com",
  github: "https://github.com/zizhenliu0427",
  githubSecondary: "https://github.com/Fairchild2333",
  linkedin: "https://www.linkedin.com/in/zizhen-liu-580a40258/",
  workRights: "485 visa · full working rights",
  availability: "Open to frontend opportunities across Australia",
  statement:
    "I build fast, responsive interfaces that turn complex data into clear, usable products.",
} as const;

export const projects = [
  {
    id: "sensor",
    index: "01",
    year: "2025",
    title: "Conversational AI for Building Sensor Data",
    type: "UNSW Capstone · Data product",
    summary:
      "A seven-page analytics workspace that lets building managers query and visualise live IoT sensor data in natural language.",
    highlights: [
      "Web Workers for CSV / Excel parsing",
      "Context state across 16 components",
      "22-endpoint typed fetch service",
    ],
    stack: ["React 19", "TypeScript", "ECharts", "Web Workers", "Vitest"],
    metric: "7 PAGE SPA",
    visual: "sensor",
  },
  {
    id: "cmo",
    index: "02",
    year: "2023—24",
    title: "CMO-DB",
    type: "Personal team · Bilingual database",
    summary:
      "A responsive, wiki-like equipment database with bilingual routing, lazy rendering and a custom directional sensor visualisation.",
    highlights: [
      "29,000+ searchable records",
      "English / Chinese URL routing",
      "Custom D3 sensor-arc visualisation",
    ],
    stack: ["JavaScript", "D3.js", "i18next", "Handlebars", "Bootstrap"],
    metric: "29K+ RECORDS",
    visual: "database",
    href: "https://www.cmo-db.com/",
  },
  {
    id: "ctv",
    index: "03",
    year: "2023",
    title: "CTV Violence Detection",
    type: "UTS team project · Monitoring UI",
    summary:
      "A secure frontend for real-time YOLO video analysis, designed around configurable multi-camera monitoring and protected workflows.",
    highlights: [
      "1 / 2 / 4 / 6 camera layouts",
      "JWT-protected nested routes",
      "Reusable video and auth hooks",
    ],
    stack: ["React 18", "React Router", "MUI", "Fetch API", "JWT"],
    metric: "LIVE MONITORING",
    visual: "camera",
  },
] as const;

export const experience = [
  {
    period: "OCT 2023 — JAN 2024",
    company: "Intelli New Technologies",
    location: "Sydney, Australia",
    role: "IT / Business Analysis Intern",
    bullets: [
      "Translated requirements into high-fidelity Figma flows and responsive interfaces.",
      "Worked through Jira and Confluence in Agile delivery, verifying React components during sprint reviews.",
      "Built Python scrapers to aggregate and normalise web data for analysis.",
    ],
  },
  {
    period: "MAY 2021 — AUG 2021",
    company: "Golden Lady Photography",
    location: "Chongqing, China",
    role: "IT Support Intern",
    bullets: [
      "Maintained a Vue.js corporate site and delivered responsive UI improvements.",
      "Diagnosed workstation hardware and configured operating systems and creative software.",
    ],
  },
] as const;

export const capabilities = [
  {
    index: "A",
    title: "Frontend systems",
    description: "Component architecture, routing and state for product interfaces.",
    items: ["React", "Next.js", "TypeScript", "Context API", "React Router"],
  },
  {
    index: "B",
    title: "Interface craft",
    description: "Responsive, accessible layouts with deliberate visual detail.",
    items: ["Tailwind CSS", "CSS Grid", "Flexbox", "MUI", "Figma"],
  },
  {
    index: "C",
    title: "Data & browser APIs",
    description: "Making dense information feel immediate and understandable.",
    items: ["ECharts", "D3.js", "Web Workers", "Intersection Observer", "Fetch"],
  },
  {
    index: "D",
    title: "Delivery",
    description: "Practical tooling from prototype through production deployment.",
    items: ["Vite", "Vitest", "Git", "Vercel", "REST APIs", "Node.js"],
  },
] as const;

export const education = [
  {
    school: "UNSW Sydney",
    degree: "Master of Information Technology",
    period: "2024 — 2025",
  },
  {
    school: "University of Technology Sydney",
    degree: "Bachelor of Software Engineering (Honours)",
    period: "2021 — 2024",
  },
] as const;
