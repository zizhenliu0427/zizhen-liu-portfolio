"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BootScreen from "./BootScreen";
import styles from "./CinematicEntry.module.css";

const SESSION_KEY = "zl-cinematic-entry-seen-v1";

type Phase = "checking" | "playing" | "handoff" | "leaving" | "done";
type ExitMode = "handoff" | "skip" | "immediate";

function focusPortfolio() {
  window.requestAnimationFrame(() => {
    document.getElementById("main-content")?.focus({ preventScroll: true });
  });
}

export default function CinematicEntry() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [showSkip, setShowSkip] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const stallTimerRef = useRef<number | null>(null);
  const finishingRef = useRef(false);
  const bootShownRef = useRef(false);

  const finish = useCallback((mode: ExitMode = "skip") => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // The intro remains optional when storage is unavailable.
    }

    videoRef.current?.pause();
    setShowSkip(false);
    setShowBoot(false);
    const site = rootRef.current?.closest("main");
    const revealPortfolio = () => site?.removeAttribute("data-intro-active");

    if (mode === "immediate") {
      revealPortfolio();
      setPhase("done");
      focusPortfolio();
      return;
    }

    if (mode === "handoff") {
      setPhase("handoff");
      revealTimerRef.current = window.setTimeout(revealPortfolio, 100);
      exitTimerRef.current = window.setTimeout(() => {
        setPhase("done");
        focusPortfolio();
      }, 680);
      return;
    }

    revealPortfolio();
    setPhase("leaving");
    exitTimerRef.current = window.setTimeout(() => {
      setPhase("done");
      focusPortfolio();
    }, 420);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactDevice = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    const forcePreview = new URLSearchParams(window.location.search).get("intro") === "1";

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Treat unavailable storage as a first visit.
    }

    let skipTimer: number | null = null;
    const decisionTimer = window.setTimeout(() => {
      if (reducedMotion || compactDevice || (!forcePreview && seen)) {
        finishingRef.current = true;
        setPhase("done");
        return;
      }

      finishingRef.current = false;
      bootShownRef.current = false;
      setShowBoot(false);
      rootRef.current?.closest("main")?.setAttribute("data-intro-active", "");
      setPhase("playing");
      skipTimer = window.setTimeout(() => setShowSkip(true), 900);
    }, 0);

    return () => {
      window.clearTimeout(decisionTimer);
      if (skipTimer !== null) window.clearTimeout(skipTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    playPromise?.catch(() => finish("immediate"));

    stallTimerRef.current = window.setTimeout(() => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) finish("immediate");
    }, 4500);

    return () => {
      if (stallTimerRef.current !== null) window.clearTimeout(stallTimerRef.current);
    };
  }, [finish, phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    const update = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 5.02;
      const progress = Math.min(1, Math.max(0, video.currentTime / duration));
      const takeoverStart = Math.max(0, duration - 1.55);
      const takeover = Math.min(1, Math.max(0, (video.currentTime - takeoverStart) / 1.46));
      const easedTakeover = takeover * takeover * (3 - 2 * takeover);
      const sync = takeover > 0.52 && takeover < 0.94
        ? Math.sin(((takeover - 0.52) / 0.42) * Math.PI) * 0.72
        : 0;

      root.style.setProperty("--entry-progress", progress.toFixed(4));
      root.style.setProperty("--entry-scale", (1 + easedTakeover * 0.52).toFixed(4));
      root.style.setProperty("--entry-sync", Math.max(0, sync).toFixed(4));

      if (!bootShownRef.current && video.currentTime >= duration - 0.84) {
        bootShownRef.current = true;
        setShowBoot(true);
      }

      if (video.currentTime >= duration - 0.04) {
        finish("handoff");
        return;
      }

      rafRef.current = window.requestAnimationFrame(update);
    };

    rafRef.current = window.requestAnimationFrame(update);
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [finish, phase]);

  useEffect(() => {
    if (
      phase !== "playing" &&
      phase !== "handoff" &&
      phase !== "leaving"
    ) return;

    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;

    const onVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) video.pause();
      else video.play().catch(() => finish("immediate"));
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [finish, phase]);

  useEffect(() => () => {
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current);
    if (stallTimerRef.current !== null) window.clearTimeout(stallTimerRef.current);
    rootRef.current?.closest("main")?.removeAttribute("data-intro-active");
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.entry} ${styles[phase]}`}
      ref={rootRef}
      aria-label="Cinematic introduction"
    >
      <div className={styles.videoFrame} aria-hidden="true">
        <video
          className={styles.video}
          ref={videoRef}
          src="/cinematic-entry.mp4"
          poster="/cinematic-entry-poster.webp"
          preload="auto"
          autoPlay
          muted
          playsInline
          tabIndex={-1}
          onPlaying={() => {
            if (stallTimerRef.current !== null) window.clearTimeout(stallTimerRef.current);
          }}
          onEnded={() => finish("handoff")}
          onError={() => finish("immediate")}
        />
      </div>

      <div className={styles.bridge} aria-hidden="true">
        <div className={styles.bridgeStill} />
        <div className={styles.bridgeShade} />
      </div>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.syncFlash} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {showBoot && phase === "playing" && <BootScreen embedded compact />}

      {showSkip && phase === "playing" && (
        <button className={styles.skip} type="button" onClick={() => finish("skip")}>
          SKIP INTRO <span aria-hidden="true">↗</span>
        </button>
      )}

      <div className={styles.progress} aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
