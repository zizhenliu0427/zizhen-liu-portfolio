"use client";

import { useId, useState, type ReactNode } from "react";
import GlassCard from "./GlassCard";

export type AeroTab = { id: string; label: string; content: ReactNode };

/**
 * Tabbed panel — glass container (GlassCard) with glossy Aero tab buttons.
 * The active tab gets a brighter raised glass; inactive tabs are translucent.
 */
export default function AeroTabs({
  tabs,
  className = "",
}: {
  tabs: AeroTab[];
  className?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const base = useId();

  return (
    <GlassCard className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex flex-wrap gap-1 border-b border-white/25 px-2 pt-2"
      >
        {tabs.map((t) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-controls={`${base}-panel-${t.id}`}
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={[
                "relative overflow-hidden rounded-t-md border border-b-0 px-3 py-1.5 text-sm font-medium transition",
                selected
                  ? "border-white/55 bg-white/30 text-slate-900 dark:text-white"
                  : "border-transparent text-white/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)] hover:bg-white/15",
              ].join(" ")}
            >
              {selected && (
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={active !== t.id}
          className="px-4 py-3.5 text-slate-800 dark:text-slate-100"
        >
          {t.content}
        </div>
      ))}
    </GlassCard>
  );
}
