"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import AeroButton from "./AeroButton";
import AeroProgress from "./AeroProgress";
import GlassCard from "./GlassCard";

// Setup-style caption per step, shown next to the bottom install progress bar.
const INSTALL_LABEL: Record<string, string> = {
  welcome: "Starting setup…",
  about: "Loading profile…",
  experience: "Installing experience…",
  projects: "Installing projects…",
  skills: "Configuring skills…",
  contact: "Completing setup…",
};

/** Aero "command link": arrow + bold title + sub text, like Win7 wizard options. */
function CommandLink({ title, sub }: { title: string; sub: string }) {
  return (
    <button className="flex w-full items-start gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-left transition hover:bg-white/20">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-b from-sky-300 to-sky-600 text-sm text-white shadow ring-1 ring-inset ring-white/50">
        &rsaquo;
      </span>
      <span>
        <span className="block font-medium text-white">{title}</span>
        <span className="block text-sm text-slate-300">{sub}</span>
      </span>
    </button>
  );
}

const SKILLS = [
  { label: "React / Next.js", value: 90 },
  { label: "TypeScript / JavaScript", value: 90 },
  { label: "CSS / Tailwind / SVG", value: 88 },
  { label: "Node / Python / REST APIs", value: 75 },
];

type Step = { id: string; label: string; title: string; content: ReactNode };

const STEPS: Step[] = [
  {
    id: "welcome",
    label: "Welcome",
    title: "Welcome",
    content: (
      <div className="space-y-3">
        <p className="text-3xl font-semibold tracking-tight text-white">
          Zizhen Liu <span className="text-slate-400">(Lance)</span>
        </p>
        <p className="text-lg text-slate-200">
          Graduate / Junior{" "}
          <span className="text-sky-300">Frontend Engineer</span> · Sydney
        </p>
        <p className="text-sm text-slate-300">
          React · TypeScript · responsive UI. Open to grad/junior roles — 485
          visa with full working rights. Let&rsquo;s get set up.
        </p>
      </div>
    ),
  },
  {
    id: "about",
    label: "About",
    title: "Get to know me",
    content: (
      <div className="space-y-2 text-slate-200">
        <p>
          Recent <strong className="text-white">Master of Information
          Technology</strong> (UNSW) with a{" "}
          <strong className="text-white">Software Engineering (Honours)</strong>{" "}
          background (UTS).
        </p>
        <p>
          I build intuitive, high-performing web apps with React, modern
          JavaScript/TypeScript and responsive design.
        </p>
        <p className="text-sm text-slate-300">
          Off the clock: building PCs since 14, photography, and Japanese
          culture. English (proficient) · Mandarin (native) · Japanese
          (beginner).
        </p>
      </div>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    title: "Where I've worked",
    content: (
      <ol className="space-y-4 text-slate-200">
        <li>
          <p className="font-medium text-white">
            Intelli New Technologies — Sydney
          </p>
          <p className="text-xs text-slate-400">
            IT / Business Analysis Intern · Oct 2023 – Jan 2024
          </p>
          <p className="mt-1 text-sm">
            Figma prototyping, responsive UI build, Agile delivery, React
            component verification, Python data scrapers.
          </p>
        </li>
        <li>
          <p className="font-medium text-white">
            Golden Lady Photography — Chongqing
          </p>
          <p className="text-xs text-slate-400">
            IT Support Intern · May – Aug 2021
          </p>
          <p className="mt-1 text-sm">
            Maintained a Vue.js corporate site; responsive UI tweaks; system
            setup.
          </p>
        </li>
      </ol>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    title: "What I've built",
    content: (
      <div className="space-y-2.5">
        <CommandLink
          title="Conversational-AI Sensor Analytics"
          sub="React 19 · ECharts · Web Workers — query IoT data in natural language"
        />
        <CommandLink
          title="CMO-DB — Weapon Database"
          sub="29,000+ records · bilingual · D3.js · cmo-db.com"
        />
        <CommandLink
          title="CTV — Real-Time Violence Detection"
          sub="React · JWT route guards · multi-panel YOLO video UI"
        />
      </div>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    title: "My toolkit",
    content: (
      <div className="space-y-2.5">
        {SKILLS.map((s) => (
          <AeroProgress
            key={s.label}
            label={s.label}
            value={s.value}
            color="blue"
          />
        ))}
      </div>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    title: "Let's connect",
    content: (
      <div className="space-y-3 text-slate-200">
        <p>Open to graduate / junior frontend roles across Australia.</p>
        <ul className="space-y-1 text-sm">
          <li>✉ lzz288898@gmail.com</li>
          <li>☎ +61 432 354 832</li>
          <li>in LinkedIn · Sydney, Australia</li>
        </ul>
      </div>
    ),
  },
];

/**
 * Windows Vista/7 OOBE-style setup wizard: a clickable step rail, a centred
 * content-glass panel with a round Aero back button (top-left), a blue title,
 * and a glowing default "Next" button (bottom-right). Free navigation — jump to
 * any step. Mobile-first: the rail collapses to top chips and the panel goes
 * full-width.
 */
export default function OobeWizard() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const first = i === 0;
  const last = i === STEPS.length - 1;

  // Wheel / arrow keys advance the wizard (the page itself never scrolls).
  // Debounced so one scroll flick = one step.
  const lock = useRef(false);
  useEffect(() => {
    const go = (dir: number) => {
      if (lock.current) return;
      lock.current = true;
      window.setTimeout(() => (lock.current = false), 650);
      setI((n) => Math.min(STEPS.length - 1, Math.max(0, n + dir)));
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      go(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4 pb-28 sm:p-8 sm:pb-28">
      {/* centred Aero wizard window */}
      <GlassCard tone="content" className="relative w-full max-w-2xl">
        {/* round Aero back button, top-left */}
        <button
          type="button"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={first}
          aria-label="Back"
          className="absolute -left-3 -top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/60 bg-gradient-to-b from-white/70 to-white/25 text-lg leading-none text-slate-700 shadow-md ring-1 ring-inset ring-white/60 backdrop-blur-sm transition hover:from-white/85 disabled:opacity-40 disabled:hover:from-white/70"
        >
          &lsaquo;
        </button>

        <div className="flex min-h-[20rem] flex-col p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-sky-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            {step.title}
          </h1>
          <div className="mt-4 flex-1">{step.content}</div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
            <span className="text-xs text-slate-400">Scroll or ↑ ↓ to move</span>
            <div className="flex gap-2">
              {!first && (
                <AeroButton onClick={() => setI((n) => Math.max(0, n - 1))}>
                  Back
                </AeroButton>
              )}
              <AeroButton
                glow
                onClick={() => setI((n) => Math.min(STEPS.length - 1, n + 1))}
                disabled={last}
              >
                {last ? "Finish" : "Next"}
              </AeroButton>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Windows Vista-style bottom status bar: a green progress line plus big
          numbered phases, pinned to the bottom edge of the whole screen. */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <AeroProgress
          value={((i + 1) / STEPS.length) * 100}
          color="green"
          animate
        />
        <div className="border-t border-white/10 bg-gradient-to-b from-[#0c3a52]/95 to-[#06212f]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center gap-5 overflow-x-auto px-4 py-2.5 sm:px-8">
            {STEPS.map((s, idx) => {
              const active = idx === i;
              const done = idx < i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-current={active ? "step" : undefined}
                  title={INSTALL_LABEL[s.id]}
                  className="flex shrink-0 items-center gap-2"
                >
                  <span
                    className={`text-2xl font-light leading-none ${
                      active
                        ? "text-white"
                        : done
                          ? "text-green-400"
                          : "text-white/35"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`whitespace-nowrap text-sm transition ${
                      active
                        ? "font-medium text-white"
                        : "text-white/55 hover:text-white/85"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
