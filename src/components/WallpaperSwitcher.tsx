"use client";

import { useState } from "react";
import AeroBackground from "./AeroBackground";
import GlassCard from "./GlassCard";

const WALLPAPERS = [
  { src: "/bg-hill1.jpg", label: "Hill 1" },
  { src: "/bg-hill2.jpg", label: "Hill 2" },
  { src: "/bg-hill3.jpg", label: "Hill 3" },
  { src: "/bg-hill4.jpg", label: "Hill 4" },
];

/**
 * Aero background plus a wallpaper picker styled after the Windows Vista/7
 * Alt+Tab task switcher: a translucent glass strip of landscape thumbnails with
 * the active one wrapped in a brighter glowing selection tile, and its label
 * shown above. Demo-only.
 */
export default function WallpaperSwitcher() {
  const [current, setCurrent] = useState(WALLPAPERS[0].src);
  const activeLabel = WALLPAPERS.find((w) => w.src === current)?.label;

  return (
    <>
      <AeroBackground wallpaper={current} />
      <div className="fixed bottom-5 right-5 z-50">
        <GlassCard className="px-3 pb-2.5 pt-2">
          {/* active title, like the window title Win7 shows above the previews */}
          <p className="mb-1.5 truncate text-center text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {activeLabel}
          </p>
          <div className="flex items-center gap-1.5">
            {WALLPAPERS.map((w) => {
              const active = current === w.src;
              return (
                <button
                  key={w.src}
                  type="button"
                  onClick={() => setCurrent(w.src)}
                  title={w.label}
                  aria-label={`Use ${w.label} wallpaper`}
                  aria-pressed={active}
                  className={`rounded-md p-1 transition ${
                    active
                      ? "bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.55)] ring-1 ring-white/90"
                      : "ring-1 ring-transparent hover:bg-white/15 hover:ring-white/40"
                  }`}
                >
                  {/* landscape preview with a glossy Aero sheen */}
                  <span
                    className="relative block h-10 w-16 overflow-hidden rounded-[3px] bg-cover bg-center ring-1 ring-black/25"
                    style={{ backgroundImage: `url('${w.src}')` }}
                  >
                    <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
