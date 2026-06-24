import type { ReactNode } from "react";
import GlassCard from "./GlassCard";

export type NavItem = { label: string; href?: string; active?: boolean };

/**
 * Navigation styled after the Windows 7 taskbar — a glass strip with a glossy
 * "start orb" and taskbar-style buttons. Drop it in a fixed/sticky wrapper to
 * use it as a top nav or a floating bottom dock.
 */
export default function AeroNav({
  items,
  brand,
  className = "",
}: {
  items: NavItem[];
  brand?: ReactNode;
  className?: string;
}) {
  return (
    <GlassCard className={className}>
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        {/* Aero "start" orb (generic — no Microsoft logo) */}
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-sky-300 to-sky-600 shadow-[0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-inset ring-white/70">
          <span className="block h-3.5 w-3.5 rounded-full bg-gradient-to-b from-white/95 to-white/30" />
        </span>

        {brand && (
          <span className="ml-1 text-sm font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {brand}
          </span>
        )}

        <span className="mx-1 h-6 w-px bg-white/30" />

        <nav className="flex items-center gap-1">
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href ?? "#"}
              aria-current={it.active ? "page" : undefined}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)] transition",
                it.active
                  ? "border border-white/55 bg-white/25"
                  : "border border-transparent hover:border-white/30 hover:bg-white/15",
              ].join(" ")}
            >
              {it.label}
            </a>
          ))}
        </nav>
      </div>
    </GlassCard>
  );
}
