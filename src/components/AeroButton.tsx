import type { ButtonHTMLAttributes, ReactNode } from "react";

type AeroButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** Windows 7 "default button" — adds the breathing cyan glow (e.g. for Next). */
  glow?: boolean;
};

/**
 * A glossy Aero "gel" button — translucent glass body, a bright top sheen, and a
 * bevelled rim. Matches the site's hand-built Aero glass language (no UI kit).
 * Pass `glow` for the Win7 default-button breathing cyan glow.
 */
export default function AeroButton({
  children,
  glow = false,
  className = "",
  ...props
}: AeroButtonProps) {
  return (
    <button
      className={[
        "relative overflow-hidden rounded-md px-4 py-1.5",
        glow ? "border border-sky-300/80 aero-btn-glow" : "border border-white/55",
        "ring-1 ring-inset ring-white/40",
        "bg-gradient-to-b from-white/45 to-white/10 backdrop-blur-sm",
        "text-sm font-medium text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]",
        "shadow-[0_1px_3px_rgba(13,55,120,0.25)] transition",
        "hover:from-white/60 hover:to-white/20",
        "active:from-white/15 active:to-white/5 active:shadow-inner",
        "disabled:opacity-50 disabled:pointer-events-none",
        "dark:text-white",
        className,
      ].join(" ")}
      {...props}
    >
      {/* top gloss highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/55 to-transparent" />
      <span className="relative">{children}</span>
    </button>
  );
}
