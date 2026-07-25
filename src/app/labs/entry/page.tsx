"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MatrixRain from "@/components/MatrixRain";
import { useIntroPlan, type IntroFlight } from "@/components/cinematic/introPlan";
import styles from "./page.module.css";

// Three.js stays out of the initial chunk: the readable DOM and SKIP must not
// wait on it.
const MonitorHandoff = dynamic(
  () => import("@/components/cinematic/MonitorHandoff"),
  { ssr: false },
);

export default function EntryLabPage() {
  const plan = useIntroPlan();
  const [replayFlight, setReplayFlight] = useState<IntroFlight | null>(null);
  const [run, setRun] = useState(0);
  const flight = replayFlight ?? plan.flight;

  // The hero starts hidden in the prerendered HTML and is revealed only by
  // MonitorHandoff's callback. Deriving it from `flight` instead meant the
  // hydration render (where useIntroPlan still reports the server snapshot,
  // "none") revealed the hero for a frame and then faded it back out.
  // The Canvas 2D branch has no MonitorHandoff to call back, so it reveals on
  // its own — hidden to visible is safe, it just transitions in.
  const [docked, setDocked] = useState(false);
  const revealed = docked || plan.renderer === "canvas2d";
  const heroRef = useRef<HTMLElement>(null);

  const onDocked = useCallback(() => setDocked(true), []);

  // Predictable focus after both natural completion and Skip. Driven by an
  // effect rather than requestAnimationFrame: rAF never fires in a background
  // tab, so focus would silently never land. Skipped when nothing animated —
  // a repeat visitor's focus should stay wherever the browser put it.
  const movesFocus = flight !== "none";
  useEffect(() => {
    if (docked && movesFocus) heroRef.current?.focus({ preventScroll: true });
  }, [docked, movesFocus]);

  return (
    <main className={styles.page}>
      {plan.renderer === "webgl" ? (
        <MonitorHandoff key={run} flight={flight} onDocked={onDocked} />
      ) : (
        // No WebGL: the existing Canvas 2D glyph rain, which already degrades to
        // a single static frame under prefers-reduced-motion.
        <MatrixRain className={styles.rain} />
      )}

      {/* The hero resolves over the still-running field — the same texture is
          on screen before and after this appears. */}
      <section
        className={`${styles.hero} ${revealed ? styles.heroIn : ""}`}
        ref={heroRef}
        tabIndex={-1}
      >
        <p className={styles.eyebrow}>ZL // ENTRY PROTOTYPE</p>
        <h1>Zizhen Liu</h1>
        <p className={styles.role}>Full-stack Engineer</p>
        <p className={styles.note}>
          The glyph field behind this text is the same live render target that
          was inside the monitor. No bridge frame, no crossfade, no reset.
        </p>
        <p className={styles.debug}>
          plan: {plan.renderer} / {plan.flight}
          {replayFlight ? ` (replaying ${replayFlight})` : ""}
        </p>
      </section>

      {plan.renderer === "webgl" && (
        <div className={styles.controls}>
          {(["full", "short", "none"] as const).map((mode) => (
            <button
              key={mode}
              className={styles.replay}
              type="button"
              onClick={() => {
                setDocked(false);
                setReplayFlight(mode);
                setRun((n) => n + 1);
              }}
            >
              REPLAY {mode.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
