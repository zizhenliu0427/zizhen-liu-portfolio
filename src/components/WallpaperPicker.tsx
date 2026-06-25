"use client";

import GlassCard from "./GlassCard";

export type Wallpaper = { src: string; label: string; thumb?: string };

/**
 * Windows Vista/7 Alt+Tab-style wallpaper picker — a glass strip of landscape
 * thumbnails with the active one in a glowing tile and its label above.
 * Controlled (same visual as the /demo switcher).
 */
export default function WallpaperPicker({
  wallpapers,
  current,
  onSelect,
  className = "",
}: {
  wallpapers: Wallpaper[];
  current: string;
  onSelect: (src: string) => void;
  className?: string;
}) {
  const activeLabel = wallpapers.find((w) => w.src === current)?.label;

  return (
    <GlassCard className={`px-3 pb-2.5 pt-2 ${className}`}>
      <p className="mb-1.5 truncate text-center text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        {activeLabel}
      </p>
      <div className="flex items-center gap-1.5">
        {wallpapers.map((w) => {
          const active = current === w.src;
          return (
            <button
              key={w.src}
              type="button"
              onClick={() => onSelect(w.src)}
              title={w.label}
              aria-label={`Use ${w.label} wallpaper`}
              aria-pressed={active}
              className={`rounded-md p-1 transition ${
                active
                  ? "bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.55)] ring-1 ring-white/90"
                  : "ring-1 ring-transparent hover:bg-white/15 hover:ring-white/40"
              }`}
            >
              <span
                className="relative block h-10 w-16 overflow-hidden rounded-[3px] bg-cover bg-center ring-1 ring-black/25"
                style={
                  w.thumb
                    ? { background: w.thumb }
                    : { backgroundImage: `url('${w.src}')` }
                }
              >
                <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
