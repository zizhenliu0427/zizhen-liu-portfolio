import type { ButtonHTMLAttributes, ReactNode } from "react";
import GlassCard from "./GlassCard";

/** Small glossy title-bar control (minimize / maximize / close). */
function WindowControl({
  label,
  danger = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        "grid h-5 w-7 place-items-center rounded-[5px] text-[11px] leading-none",
        "border border-white/55 ring-1 ring-inset ring-white/40",
        "bg-gradient-to-b from-white/45 to-white/10 text-slate-800 backdrop-blur-sm",
        "shadow-sm transition",
        danger
          ? "hover:border-red-300/70 hover:from-red-400/80 hover:to-red-500/50 hover:text-white"
          : "hover:from-white/65 hover:to-white/20",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

type AeroWindowProps = {
  title: ReactNode;
  children: ReactNode;
  /** Optional status-bar content shown at the bottom. */
  status?: ReactNode;
  /** Show the minimize/maximize/close controls. Defaults to true. */
  controls?: boolean;
  className?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

/**
 * A Windows 7 / Aero-style window — title bar with glossy controls, a glass
 * body, and an optional status bar — skinned with the site's own Aero glass
 * (GlassCard) rather than the 7.css look. Handy for framing portfolio sections,
 * projects, or "About me" cards as draggable windows.
 */
export default function AeroWindow({
  title,
  children,
  status,
  controls = true,
  className = "",
  onClose,
  onMinimize,
  onMaximize,
}: AeroWindowProps) {
  return (
    <GlassCard className={className}>
      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/25 px-3 py-1.5">
        <span className="truncate text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
          {title}
        </span>
        {controls && (
          <div className="flex shrink-0 items-center gap-1">
            <WindowControl label="Minimize" onClick={onMinimize}>
              &#x2013;
            </WindowControl>
            <WindowControl label="Maximize" onClick={onMaximize}>
              &#x25A1;
            </WindowControl>
            <WindowControl label="Close" danger onClick={onClose}>
              &#x2715;
            </WindowControl>
          </div>
        )}
      </div>

      {/* body */}
      <div className="px-4 py-3.5">{children}</div>

      {/* optional status bar */}
      {status && (
        <div className="border-t border-white/20 px-3 py-1 text-xs text-white/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
          {status}
        </div>
      )}
    </GlassCard>
  );
}
