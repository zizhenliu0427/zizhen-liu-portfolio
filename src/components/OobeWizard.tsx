"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/portfolio";
import { useLanguage } from "@/contexts/LanguageContext";
import AeroButton from "./AeroButton";
import AeroProgress from "./AeroProgress";
import GlassCard from "./GlassCard";

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

export type Step = { id: string; label: string; title: string; content: ReactNode };

/**
 * Windows Vista/7 OOBE-style setup wizard: a clickable step rail, a centred
 * content-glass panel with a round Aero back button (top-left), a blue title,
 * and a glowing default "Next" button (bottom-right). Free navigation — jump to
 * any step. Mobile-first: the rail collapses to top chips and the panel goes
 * full-width.
 */
export default function OobeWizard({
  embedded = false,
}: {
  /** When embedded in a desktop window, listen on our own element (not the
   *  whole page) and pin the status bar to this container instead of the
   *  viewport, so the same wizard works standalone or inside a window. */
  embedded?: boolean;
} = {}) {
  const { t, isZh } = useLanguage();

  const INSTALL_LABEL: Record<string, string> = {
    welcome: t('oobe.startingSetup'),
    about: t('oobe.loadingProfile'),
    experience: t('oobe.installingExperience'),
    projects: t('oobe.installingProjects'),
    skills: t('oobe.configuringSkills'),
    contact: t('oobe.completingSetup'),
  };

  const SKILLS = [
    { label: "React / Next.js", value: 90 },
    { label: "TypeScript / JavaScript", value: 90 },
    { label: "CSS / Tailwind / SVG", value: 88 },
    { label: "Node / Python / REST APIs", value: 75 },
  ];

  const STEPS: Step[] = [
    {
      id: "welcome",
      label: t('oobe.welcomeLabel'),
      title: t('oobe.welcomeTitle'),
      content: (
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight text-white">
            {t('oobe.welcomeName')} <span className="text-slate-400">{t('oobe.welcomeAlias')}</span>
          </p>
          <p className="text-lg text-slate-200">
            {t('oobe.welcomeRolePrefix')}
            <span className="text-sky-300">{t('oobe.welcomeRole')}</span>
            {!isZh && t('oobe.welcomeLocation')}
          </p>
          {!isZh && (
            <p className="text-sm text-slate-300">
              {t('oobe.welcomeDescription')}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "about",
      label: t('oobe.aboutLabel'),
      title: t('oobe.aboutTitle'),
      content: (
        <div className="space-y-2 text-slate-200">
          <p>
            {t('oobe.aboutEdu')}
          </p>
          <p>
            {t('oobe.aboutSkills')}
          </p>
          <p className="text-sm text-slate-300">
            {t('oobe.aboutHobbies')}
          </p>
        </div>
      ),
    },
    {
      id: "experience",
      label: t('oobe.experienceLabel'),
      title: t('oobe.experienceTitle'),
      content: (
        <ol className="space-y-4 text-slate-200">
          <li>
            <p className="font-medium text-white">
              {t('desktop.intelliCompany')}
            </p>
            <p className="text-xs text-slate-400">
              {t('desktop.intelliRole')}
            </p>
            <p className="mt-1 text-sm">
              {t('desktop.intelliDesc')}
            </p>
          </li>
          <li>
            <p className="font-medium text-white">
              {t('desktop.goldenCompany')}
            </p>
            <p className="text-xs text-slate-400">
              {t('desktop.goldenRole')}
            </p>
            <p className="mt-1 text-sm">
              {t('desktop.goldenDesc')}
            </p>
          </li>
        </ol>
      ),
    },
    {
      id: "projects",
      label: t('oobe.projectsLabel'),
      title: t('oobe.projectsTitle'),
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
      label: t('oobe.skillsLabel'),
      title: t('oobe.skillsTitle'),
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
      label: t('oobe.contactLabel'),
      title: t('oobe.contactTitle'),
      content: (
        <div className="space-y-3 text-slate-200">
          {!isZh && <p>{t('oobe.contactStatus')}</p>}
          <ul className="space-y-1 text-sm">
            <li>✉ {profile.email}</li>
            <li>☎ +61 432 354 832</li>
            <li>
              in <a className="text-sky-300 hover:underline" href={profile.linkedin} target="_blank" rel="noreferrer">{!isZh ? t('oobe.contactLinkedin') : 'LinkedIn'}</a>
            </li>
            <li>
              ◉ <a className="text-sky-300 hover:underline" href={profile.github} target="_blank" rel="noreferrer">{t('oobe.contactGithubPrimary')}</a>
            </li>
            <li>
              ◉ <a className="text-sky-300 hover:underline" href={profile.githubSecondary} target="_blank" rel="noreferrer">{t('oobe.contactGithubSecondary')}</a>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const [i, setI] = useState(0);
  const step = STEPS[i];
  const first = i === 0;
  const last = i === STEPS.length - 1;

  // Wheel / arrow keys advance the wizard (the page itself never scrolls).
  // Debounced so one scroll flick = one step.
  const lock = useRef(false);
  const rootRef = useRef<HTMLElement>(null);
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
    const target: EventTarget =
      embedded && rootRef.current ? rootRef.current : window;
    target.addEventListener("wheel", onWheel as EventListener, {
      passive: true,
    });
    target.addEventListener("keydown", onKey as EventListener);
    return () => {
      target.removeEventListener("wheel", onWheel as EventListener);
      target.removeEventListener("keydown", onKey as EventListener);
    };
  }, [embedded]);

  return (
    <main
      ref={rootRef}
      tabIndex={embedded ? 0 : undefined}
      className={`relative flex items-center justify-center p-4 pb-28 outline-none sm:p-8 sm:pb-28 ${
        embedded ? "h-full min-h-full" : "min-h-dvh"
      }`}
    >
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
            <span className="text-xs text-slate-400">{t('oobe.scrollHint')}</span>
            <div className="flex gap-2">
              {!first && (
                <AeroButton onClick={() => setI((n) => Math.max(0, n - 1))}>
                  {t('oobe.back')}
                </AeroButton>
              )}
              <AeroButton
                glow
                onClick={() => setI((n) => Math.min(STEPS.length - 1, n + 1))}
                disabled={last}
              >
                {last ? t('oobe.finish') : t('oobe.next')}
              </AeroButton>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Windows Vista-style bottom status bar: a green progress line plus big
          numbered phases, pinned to the bottom edge (of the viewport standalone,
          or of the window container when embedded). */}
      <div
        className={`${embedded ? "absolute" : "fixed"} inset-x-0 bottom-0 z-40`}
      >
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
