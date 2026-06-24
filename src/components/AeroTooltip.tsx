import type { ReactNode } from "react";

/**
 * Aero balloon tooltip — a small frosted-glass bubble shown on hover/focus.
 * Pure CSS (no JS); wrap any element with it.
 */
export default function AeroTooltip({
  label,
  children,
  className = "",
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`group relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-white/45 bg-white/30 px-2.5 py-1 text-xs text-slate-900 opacity-0 shadow-lg backdrop-blur-md transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:text-white"
      >
        {label}
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-white/45 bg-white/30 backdrop-blur-md" />
      </span>
    </span>
  );
}
