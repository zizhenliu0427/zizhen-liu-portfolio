import type { InputHTMLAttributes } from "react";

/**
 * Aero text field — a recessed (inset-shadow) translucent glass input. Kept
 * legible on purpose: it's tinted glass, not fully transparent, so text reads.
 */
export default function AeroInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "w-full rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white",
        "border border-white/45 bg-white/25 backdrop-blur-sm",
        "shadow-[inset_0_1px_3px_rgba(13,55,120,0.2)]",
        "placeholder:text-slate-600 dark:placeholder:text-slate-300",
        "outline-none transition focus:bg-white/35 focus:ring-2 focus:ring-white/70",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
