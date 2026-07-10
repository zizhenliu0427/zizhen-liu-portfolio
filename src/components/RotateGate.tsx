import GlassCard from "./GlassCard";

/**
 * Blocks touchscreen phones/tablets held in portrait — the window-manager
 * canvas needs landscape width. CSS-only (see .rotate-gate in globals.css):
 * shown/hidden purely by an (orientation) media query, so it reacts to a
 * physical rotation immediately with no JS orientation listener needed.
 */
export default function RotateGate() {
  return (
    <div className="rotate-gate" role="alert">
      <GlassCard tone="content" className="rotate-gate__card">
        <div className="rotate-gate__icon" aria-hidden="true">
          ⟳
        </div>
        <h2>Turn your phone sideways</h2>
        <p>
          This Aero-glass desktop lab needs landscape width for its windows
          and taskbar. If rotating does nothing, switch off rotation lock
          first — Control Centre on iOS, Quick Settings on Android.
        </p>
      </GlassCard>
    </div>
  );
}
