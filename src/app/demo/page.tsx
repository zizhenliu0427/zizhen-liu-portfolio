import type { Metadata } from "next";
import Draggable from "@/components/Draggable";
import GlassCard from "@/components/GlassCard";
import GlassFilter from "@/components/GlassFilter";
import WallpaperSwitcher from "@/components/WallpaperSwitcher";

export const metadata: Metadata = {
  title: "Aero Glass — Demo",
  description: "Frutiger Aero / glassmorphism components demo.",
};

const SKILLS = ["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js"];

export default function DemoPage() {
  return (
    // NOTE: no `overflow-hidden` on this ancestor — it would disable the cards'
    // backdrop-filter (a Chromium quirk). AeroBackground is a sibling, not a
    // child, so nothing in the cards' ancestor chain clips/isolates the blur.
    <>
      <GlassFilter />
      <WallpaperSwitcher />
      <main className="relative h-dvh select-none">

      <p className="pointer-events-none absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
        Drag the cards over the wallpaper to compare the glass at different spots
      </p>

      {/* Hero */}
      <Draggable initialX={64} initialY={96}>
        <GlassCard className="w-80 p-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 drop-shadow-sm dark:text-white">
            Frutiger Aero
          </h1>
          <p className="mt-2 text-slate-800 dark:text-slate-100">
            Windows 7 Aero glass — diagonal reflections and internal sheen, built
            with Tailwind&nbsp;CSS.
          </p>
        </GlassCard>
      </Draggable>

      {/* About */}
      <Draggable initialX={480} initialY={140}>
        <GlassCard className="w-64 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            About
          </h2>
          <p className="mt-2 text-slate-800 dark:text-slate-100">
            A backdrop blur lets the wallpaper glow through the glass.
          </p>
        </GlassCard>
      </Draggable>

      {/* Skills */}
      <Draggable initialX={200} initialY={400}>
        <GlassCard className="w-72 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Skills
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-white/40 bg-white/25 px-3 py-1 text-sm text-slate-900 backdrop-blur-sm dark:text-slate-100"
              >
                {skill}
              </li>
            ))}
          </ul>
        </GlassCard>
      </Draggable>

      {/* Stronger blur variant */}
      <Draggable initialX={620} initialY={420}>
        <GlassCard blur="lg" className="w-72 p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Get in touch
          </h2>
          <p className="mt-2 text-slate-800 dark:text-slate-100">
            Stronger blur variant (<code>blur=&quot;lg&quot;</code>).
          </p>
        </GlassCard>
      </Draggable>
      </main>
    </>
  );
}
