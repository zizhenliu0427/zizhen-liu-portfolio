"use client";

import { useEffect, useRef } from "react";

const GLYPHS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン" +
  "0123456789ACEFHKLNPRXZ<>+*=:/\\";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Decorative Matrix-style code rain rendered behind the page content.
 * Density and frame rate drop on coarse-pointer/small viewports, and the
 * animation collapses to a single static frame under prefers-reduced-motion.
 */
export default function MatrixRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const effectsRoot = canvas.closest<HTMLElement>("main");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = window.matchMedia("(pointer: coarse), (max-width: 767px)");

    let raf = 0;
    let last = 0;
    let fontSize = 17;
    let frameInterval = 1000 / 24;
    let columns = 0;
    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let ticks: number[] = [];
    let paces: number[] = [];
    let chars: string[] = [];
    let hasWindowFocus = true;

    const setup = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fontSize = lowPower.matches ? 20 : 17;
      frameInterval = lowPower.matches ? 1000 / 16 : 1000 / 24;
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor(Math.random() * -(height / fontSize)),
      );
      // Columns advance every 1 or 2 frames for speed variation.
      paces = Array.from({ length: columns }, () => (Math.random() < 0.4 ? 2 : 1));
      ticks = new Array(columns).fill(0);
      chars = Array.from({ length: columns }, randomGlyph);

      // Canvas font strings cannot contain CSS variables; resolve it first.
      const mono = getComputedStyle(canvas)
        .getPropertyValue("--font-geist-mono")
        .trim();
      ctx.font = `${fontSize}px ${mono || "monospace"}`;
      ctx.textBaseline = "top";
      // Keep the canvas transparent. A full opaque fill becomes a large black
      // compositor surface in Chromium and can flash when Edge enters area
      // capture or when browser chrome briefly changes the viewport.
      ctx.clearRect(0, 0, width, height);
    };

    const drawStaticFrame = () => {
      setup();
      // A sparse, motionless glyph scatter keeps the texture without motion.
      for (let i = 0; i < columns; i += 2) {
        const glyphCount = 2 + Math.floor(Math.random() * 4);
        for (let g = 0; g < glyphCount; g++) {
          const y = Math.random() * height;
          ctx.fillStyle = `rgba(70, 255, 127, ${0.05 + Math.random() * 0.2})`;
          ctx.fillText(randomGlyph(), i * fontSize, y);
        }
      }
    };

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < frameInterval) return;
      last = now;

      // Fade old glyphs back to transparency instead of painting an opaque
      // near-black veil over the full viewport.
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      for (let i = 0; i < columns; i++) {
        if (++ticks[i] < paces[i]) continue;
        ticks[i] = 0;

        const x = i * fontSize;
        const yPrev = drops[i] * fontSize;

        // Settle the previous bright head into the trail: erase its cell and
        // redraw the SAME character in trail green, so no second glyph ever
        // stacks on top of it (that stacking read as ghosting).
        if (yPrev > -fontSize && yPrev < height) {
          ctx.clearRect(x, yPrev - 1, fontSize + 1, fontSize + 3);
          ctx.fillStyle = "rgba(70, 255, 127, 0.8)";
          ctx.fillText(chars[i], x, yPrev);
        }

        drops[i]++;
        const y = drops[i] * fontSize;
        if (y > -fontSize && y < height) {
          chars[i] = randomGlyph();
          ctx.clearRect(x, y - 1, fontSize + 1, fontSize + 3);
          ctx.fillStyle = "#d8ffe6";
          ctx.fillText(chars[i], x, y);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20);
          paces[i] = Math.random() < 0.4 ? 2 : 1;
        }
      }
    };

    const setEffectsPaused = (paused: boolean) => {
      effectsRoot?.toggleAttribute("data-effects-paused", paused);
    };

    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      setEffectsPaused(true);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (document.hidden || !hasWindowFocus) {
        pause();
        return;
      }
      setEffectsPaused(false);
      if (reducedMotion.matches) {
        drawStaticFrame();
        return;
      }
      setup();
      last = 0;
      raf = requestAnimationFrame(step);
    };

    let resizeTimer = 0;
    const onResize = () => {
      // Capture-area mode can generate a short resize/compositor hand-off.
      // Hold the last transparent frame until layout has settled.
      pause();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(start, 200);
    };

    const onBlur = () => {
      hasWindowFocus = false;
      pause();
    };

    const onFocus = () => {
      hasWindowFocus = true;
      start();
    };

    const onVisibilityChange = () => {
      if (document.hidden) pause();
      else start();
    };

    start();
    reducedMotion.addEventListener("change", start);
    lowPower.addEventListener("change", start);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      reducedMotion.removeEventListener("change", start);
      lowPower.removeEventListener("change", start);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      effectsRoot?.removeAttribute("data-effects-paused");
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
