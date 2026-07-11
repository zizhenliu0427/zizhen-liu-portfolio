"use client";

import { useEffect, useRef } from "react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";

// Scramble letters with letters of the same case and digits with digits so
// the string keeps roughly the same width and never rewraps mid-animation.
function scrambleChar(ch: string) {
  if (/[A-Z]/.test(ch)) return UPPER[Math.floor(Math.random() * UPPER.length)];
  if (/[a-z]/.test(ch)) return LOWER[Math.floor(Math.random() * LOWER.length)];
  if (/[0-9]/.test(ch)) return DIGIT[Math.floor(Math.random() * DIGIT.length)];
  return ch;
}

/**
 * Renders `text` normally on the server, then — once visible and only when
 * motion is allowed — replays it as a Matrix-style decode: every character
 * cycles through random glyphs and settles left to right.
 */
export default function Decode({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval = 0;
    let timeout = 0;

    const play = () => {
      const tick = 45;
      const perTick = Math.max(1, Math.ceil(text.length / (700 / tick)));
      let revealed = 0;
      interval = window.setInterval(() => {
        revealed += perTick;
        el.textContent = text
          .split("")
          .map((ch, i) => (i < revealed ? ch : scrambleChar(ch)))
          .join("");
        if (revealed >= text.length) {
          window.clearInterval(interval);
          el.textContent = text;
        }
      }, tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timeout = window.setTimeout(play, delay);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      el.textContent = text;
    };
  }, [text, delay]);

  // Assistive tech reads the visually-hidden real text; the scrambling
  // characters are aria-hidden so garbage frames are never announced.
  return (
    <span>
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: "hidden",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
      <span aria-hidden="true" ref={ref}>
        {text}
      </span>
    </span>
  );
}
