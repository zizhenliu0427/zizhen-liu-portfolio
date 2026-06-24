import type { TextareaHTMLAttributes } from "react";

/** Aero textarea — same recessed translucent glass as AeroInput. */
export default function AeroTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        "w-full resize-y rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white",
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
