import type { Metadata } from "next";
import AeroButton from "@/components/AeroButton";
import AeroInput from "@/components/AeroInput";
import AeroNav from "@/components/AeroNav";
import AeroProgress from "@/components/AeroProgress";
import AeroTabs from "@/components/AeroTabs";
import AeroTextarea from "@/components/AeroTextarea";
import AeroTooltip from "@/components/AeroTooltip";
import AeroWindow from "@/components/AeroWindow";
import Draggable from "@/components/Draggable";
import GlassCard from "@/components/GlassCard";
import GlassFilter from "@/components/GlassFilter";
import WallpaperSwitcher from "@/components/WallpaperSwitcher";

export const metadata: Metadata = {
  title: "Aero Glass — Demo",
  description: "Frutiger Aero / glassmorphism component playground.",
};

const SKILLS = [
  { label: "TypeScript", value: 92 },
  { label: "React / Next.js", value: 88 },
  { label: "Node.js", value: 80 },
  { label: "CSS / SVG", value: 85 },
];

export default function DemoPage() {
  return (
    // NOTE: no `overflow-hidden` on this ancestor — it would disable the cards'
    // backdrop-filter (a Chromium quirk). AeroBackground is a sibling, not a
    // child, so nothing in the cards' ancestor chain clips/isolates the blur.
    <>
      <GlassFilter />
      <WallpaperSwitcher />
      <main className="relative h-dvh select-none">
        <p className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          Drag the windows around — every piece is a hand-built Aero glass component
        </p>

        {/* GlassCard — hero */}
        <Draggable initialX={48} initialY={70}>
          <GlassCard className="w-72 p-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 drop-shadow-sm dark:text-white">
              Frutiger Aero
            </h1>
            <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">
              Hand-built glass: edge refraction, viewport-pinned striations,
              convex-lens bubbles.
            </p>
          </GlassCard>
        </Draggable>

        {/* AeroWindow + AeroButton + AeroTooltip */}
        <Draggable initialX={360} initialY={64}>
          <AeroWindow title="About Me" status="Ready" className="w-80">
            <p className="text-sm text-slate-800 dark:text-slate-100">
              A draggable window — title bar, glossy controls, body and status
              bar, skinned with our own glass.
            </p>
            <div className="mt-3 flex gap-2">
              <AeroTooltip label="Opens your mail client">
                <AeroButton>Contact me</AeroButton>
              </AeroTooltip>
              <AeroButton>Résumé</AeroButton>
            </div>
          </AeroWindow>
        </Draggable>

        {/* AeroTabs */}
        <Draggable initialX={730} initialY={70}>
          <AeroTabs
            className="w-80"
            tabs={[
              {
                id: "about",
                label: "About",
                content: (
                  <p className="text-sm">
                    Tabbed glass panel — switch sections without leaving the card.
                  </p>
                ),
              },
              {
                id: "experience",
                label: "Experience",
                content: (
                  <p className="text-sm">Experience timeline goes here.</p>
                ),
              },
              {
                id: "skills",
                label: "Skills",
                content: (
                  <div className="space-y-2.5">
                    {SKILLS.slice(0, 2).map((s) => (
                      <AeroProgress key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </Draggable>

        {/* AeroProgress — skills */}
        <Draggable initialX={48} initialY={330}>
          <GlassCard className="w-72 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Skills
            </h2>
            <div className="mt-3 space-y-2.5">
              {SKILLS.map((s) => (
                <AeroProgress key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </GlassCard>
        </Draggable>

        {/* AeroProgress colour states — Windows 7 green / yellow / red */}
        <Draggable initialX={372} initialY={398}>
          <GlassCard className="w-72 p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Progress states
            </h2>
            <div className="mt-3 space-y-2.5">
              <AeroProgress label="Normal" value={70} color="green" />
              <AeroProgress label="Paused" value={45} color="yellow" />
              <AeroProgress label="Error" value={30} color="red" />
              <AeroProgress label="Downloading" value={60} color="green" animate />
              <AeroProgress label="Working…" indeterminate />
            </div>
          </GlassCard>
        </Draggable>

        {/* AeroInput + AeroTextarea — contact form */}
        <Draggable initialX={700} initialY={360}>
          <AeroWindow title="Contact" status="Not sent" className="w-80">
            <form className="space-y-3">
              <AeroInput placeholder="Your name" aria-label="Your name" />
              <AeroInput type="email" placeholder="Email" aria-label="Email" />
              <AeroTextarea rows={3} placeholder="Message" aria-label="Message" />
              <AeroButton type="button">Send message</AeroButton>
            </form>
          </AeroWindow>
        </Draggable>

        {/* AeroNav — Windows 7 taskbar-style floating dock */}
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <AeroNav
            brand="Zizhen Liu"
            items={[
              { label: "About" },
              { label: "Work" },
              { label: "Experience" },
              { label: "Contact", active: true },
            ]}
          />
        </div>
      </main>
    </>
  );
}
