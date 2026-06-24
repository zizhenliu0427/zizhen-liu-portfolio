type AeroProgressColor = "green" | "yellow" | "red" | "blue";

/**
 * Windows 7 / Aero progress bar — a glossy grey track with a vivid gel fill,
 * faithful to the 7.css recipe (styles live in globals.css under `.aero-pg`).
 * Green is the default state; pass `color` for yellow (paused) / red (error) /
 * blue. `animate` adds a sweeping shine; `indeterminate` is the marquee state.
 */
export default function AeroProgress({
  value = 0,
  label,
  color = "green",
  animate = false,
  indeterminate = false,
  className = "",
}: {
  value?: number;
  label?: string;
  color?: AeroProgressColor;
  animate?: boolean;
  indeterminate?: boolean;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-sm font-medium text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
          <span>{label}</span>
          {!indeterminate && <span>{pct}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={typeof label === "string" ? label : undefined}
        className={`aero-pg ${indeterminate ? "is-marquee" : ""}`}
      >
        {!indeterminate && (
          <div
            className={`aero-pg__fill aero-pg__fill--${color} ${
              animate ? "is-animate" : ""
            }`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
