"use client";

import OobeWizard from "./OobeWizard";

/**
 * The OOBE setup wizard for a desktop window — reuses the real <OobeWizard />
 * component (same design as the /oobe page) in `embedded` mode, over its own
 * contained aurora background. No iframe, no rebuild: it just fills and resizes
 * with the window. (#aero-refract for the glass comes from the desktop's
 * GlassFilter.)
 */
export default function OobeApp() {
  return (
    <div
      className="relative h-full overflow-hidden"
      style={{ background: "#04161f" }}
    >
      {/* STATIC aurora wallpaper (soft radial-gradient glow, no animated layers
          or blur filter). The animated aurora flickers the compositor while a
          large window resizes; this costs nothing to repaint. */}
      <div className="aurora-static" />
      <OobeWizard embedded />
    </div>
  );
}
