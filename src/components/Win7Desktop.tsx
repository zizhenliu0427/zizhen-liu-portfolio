"use client";

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/data/portfolio";
import {
  FLIP_AX,
  FLIP_AY,
  FLIP_DEPTH,
  FLIP_DX,
  FLIP_DY,
  FLIP_FORE,
  FLIP_SKEW,
  FLIP_W,
} from "./flip3d";
import GlassFilter from "./GlassFilter";
import OobeApp from "./OobeApp";
import RotateGate from "./RotateGate";
import WallpaperPicker from "./WallpaperPicker";
import Win7Window from "./Win7Window";

// The taskbar glass, separated from the dynamic content and memoised so desktop
// state changes (start menu, minimise) never re-render or repaint it — plus its
// own compositing layer (will-change) — so the refraction never flashes.
const TaskbarGlass = memo(function TaskbarGlass() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backdropFilter:
            "url(#aero-refract) blur(2px) saturate(1.8) brightness(1.1)",
          WebkitBackdropFilter: "blur(2px) saturate(1.8) brightness(1.1)",
          willChange: "backdrop-filter",
        }}
      />
      <div aria-hidden className="aero-glass absolute inset-0" />
    </>
  );
});

type App = {
  id: string;
  label: string;
  icon: string;
  title: string;
  content: ReactNode;
  /** Initial window width/height; bare = no body padding (for iframes). */
  w?: number;
  h?: number;
  bare?: boolean;
};

const APPS: App[] = [
  {
    id: "setup",
    label: "Get Started",
    icon: "🧭",
    title: "Get Started — Setup",
    content: <OobeApp />,
    w: 720,
    h: 520,
    bare: true,
  },
  {
    id: "about",
    label: "About Me",
    icon: "👤",
    title: "About — Zizhen Liu",
    content: (
      <>
        <p>
          <strong>Zizhen Liu (Lance)</strong> — Graduate / Junior Frontend
          Engineer, Sydney.
        </p>
        <p style={{ marginTop: 8 }}>
          Recent Master of Information Technology (UNSW) with a Software
          Engineering (Honours) background (UTS). I build intuitive,
          high-performing web apps with React, TypeScript and responsive design.
        </p>
        <p style={{ marginTop: 8 }}>
          Open to grad/junior roles — 485 visa, full working rights. Off the
          clock: building PCs since 14, photography, Japanese culture.
        </p>
      </>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    icon: "💼",
    title: "Experience",
    content: (
      <>
        <p>
          <strong>Intelli New Technologies — Sydney</strong>
          <br />
          IT / Business Analysis Intern · Oct 2023 – Jan 2024
        </p>
        <p style={{ marginTop: 4 }}>
          Figma prototyping, responsive UI build, Agile delivery, React
          component verification, Python data scrapers.
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Golden Lady Photography — Chongqing</strong>
          <br />
          IT Support Intern · May – Aug 2021
        </p>
        <p style={{ marginTop: 4 }}>
          Maintained a Vue.js corporate site; responsive UI tweaks; system setup.
        </p>
      </>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: "📁",
    title: "Projects",
    content: (
      <ul className="tree-view">
        <li>
          <strong>Conversational-AI Sensor Analytics</strong> — React 19,
          ECharts, Web Workers. Query IoT data in natural language.
        </li>
        <li>
          <strong>CMO-DB — Weapon Database</strong> — 29,000+ records, bilingual,
          D3.js. <code>cmo-db.com</code>
        </li>
        <li>
          <strong>CTV — Violence Detection</strong> — React, JWT route guards,
          multi-panel YOLO video UI.
        </li>
      </ul>
    ),
  },
  {
    id: "skills",
    label: "Skills",
    icon: "📊",
    title: "Skills",
    content: (
      <ul>
        <li>
          <strong>Languages:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3
        </li>
        <li>
          <strong>Frameworks:</strong> React, React Router, Context API
        </li>
        <li>
          <strong>UI / Styling:</strong> Tailwind, MUI v5, Bootstrap 5, CSS
          Grid/Flexbox
        </li>
        <li>
          <strong>Data / APIs:</strong> ECharts, D3.js, Web Workers, Fetch API
        </li>
        <li>
          <strong>Tooling:</strong> Vite, Vitest, Git, Vercel, Figma
        </li>
      </ul>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: "✉️",
    title: "Contact",
    content: (
      <ul>
        <li>✉ {profile.email}</li>
        <li>☎ +61 432 354 832</li>
        <li>
          in <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> · Sydney, Australia
        </li>
        <li>
          ◉ <a href={profile.github} target="_blank" rel="noreferrer">GitHub · zizhenliu0427</a>
        </li>
        <li>
          ◉ <a href={profile.githubSecondary} target="_blank" rel="noreferrer">GitHub · Fairchild2333</a>
        </li>
        <li>485 Temporary Graduate Visa — full working rights</li>
      </ul>
    ),
  },
];

const AURORA_THUMB =
  "radial-gradient(60% 80% at 38% 62%, #15d8c8, transparent 70%)," +
  "radial-gradient(55% 70% at 74% 40%, #2a86ff, transparent 70%)," +
  "linear-gradient(165deg, #021a2b, #02101b)";

const WALLPAPERS = [
  { src: "/win7-wallpaper.jpg", label: "Windows 7" },
  { src: "/bg-hill1.jpg", label: "Hill" },
  { src: "/bg-hill3.jpg", label: "Field" },
  { src: "aurora", label: "Aurora", thumb: AURORA_THUMB },
];

type Win = {
  id: string;
  x: number;
  y: number;
  z: number;
  min: boolean;
  minimizing: boolean;
  closing?: boolean;
};

const appOf = (id: string) => APPS.find((a) => a.id === id)!;

export default function Win7Desktop() {
  const [wins, setWins] = useState<Win[]>([
    { id: "about", x: 96, y: 56, z: 11, min: false, minimizing: false },
  ]);
  const zTop = useRef(11);
  const [startOpen, setStartOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [wallpaper, setWallpaper] = useState("/win7-wallpaper.jpg");
  const [peek, setPeek] = useState(false); // Aero Peek (Show Desktop) hover
  const [flip3d, setFlip3d] = useState(false); // Aero Flip 3D overlay
  const [flipIdx, setFlipIdx] = useState(0);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  // The desktop is a fixed canvas — prevent the page from scrolling (windows are
  // kept on-screen by clamping, but this guards any edge case). Body-level
  // overflow doesn't break the windows' glass backdrop-filter (a div ancestor
  // would). Restored on unmount.
  //
  // <html> needs the same treatment as <body>: the always-mounted Flip 3D
  // desktop card renders with `transform: scale(2.2)` while closed, and a
  // scaled child's paint bounds inflate the document's scrollable overflow.
  // If only <body> clips, mobile Chromium falls back to treating <html> as
  // the root scroller and sizes window.innerWidth (and any position:fixed
  // element, e.g. RotateGate) to that inflated scroll width instead of the
  // real viewport.
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  const bumpZ = () => (zTop.current += 1);

  function openApp(id: string) {
    setWins((ws) => {
      if (ws.some((w) => w.id === id))
        return ws.map((w) =>
          w.id === id ? { ...w, min: false, minimizing: false, z: bumpZ() } : w,
        );
      const n = ws.length;
      return [
        ...ws,
        { id, x: 90 + n * 28, y: 56 + n * 28, z: bumpZ(), min: false, minimizing: false },
      ];
    });
    setStartOpen(false);
  }
  const focusWin = useCallback((id: string) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: bumpZ() } : w)));
  }, []);
  // play the fade+shrink close animation, then remove the window
  const closeWin = (id: string) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)));
    window.setTimeout(
      () => setWins((ws) => ws.filter((w) => w.id !== id)),
      190,
    );
  };
  const moveWin = (id: string, x: number, y: number) =>
    setWins((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        // keep the window on-screen (replaces the old overflow:hidden clipping)
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        return {
          ...w,
          x: Math.max(0, Math.min(x, vw - 400)),
          y: Math.max(0, Math.min(y, vh - 80)),
        };
      }),
    );

  function minWin(id: string) {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimizing: true } : w)));
    window.setTimeout(() => {
      setWins((ws) =>
        ws.map((w) => (w.id === id ? { ...w, min: true, minimizing: false } : w)),
      );
    }, 180);
  }

  function taskbarClick(id: string) {
    const w = wins.find((x) => x.id === id);
    if (!w) return;
    const lz = wins.filter((x) => !x.min).map((x) => x.z);
    const top = lz.length ? Math.max(...lz) : 0;
    if (!w.min && w.z === top) {
      // active window → minimize (with animation)
      minWin(id);
    } else {
      // minimized or background → restore + focus
      setWins((ws) =>
        ws.map((x) =>
          x.id === id ? { ...x, min: false, minimizing: false, z: bumpZ() } : x,
        ),
      );
    }
  }

  const openWins = wins.filter((w) => !w.min);

  // Aero Peek — Show Desktop button: click toggles minimise-all / restore-all.
  function showDesktop() {
    setPeek(false);
    setWins((ws) => {
      const anyVisible = ws.some((w) => !w.min);
      return ws.map((w) => ({ ...w, min: anyVisible, minimizing: false }));
    });
  }

  // Aero Flip 3D
  function openFlip() {
    if (!openWins.length) return;
    const front = openWins.reduce((a, b) => (b.z > a.z ? b : a));
    setFlipIdx(Math.max(0, openWins.findIndex((w) => w.id === front.id)));
    setFlip3d(true);
  }
  function selectFlip(id: string) {
    setFlip3d(false);
    focusWin(id);
  }

  // Flip 3D keys: Tab / arrows cycle, Enter opens the front window, Esc cancels.
  useEffect(() => {
    if (!flip3d) return;
    const m = wins.filter((w) => !w.min).length + 1; // windows + desktop (last item)
    const onKey = (e: KeyboardEvent) => {
      const open = wins.filter((w) => !w.min);
      // If every window was closed while Flip 3D was open, bail on the next key.
      if (!open.length && m <= 1) {
        setFlip3d(false);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setFlip3d(false);
      } else if (
        e.key === "Tab" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        setFlipIdx((x) => (x + (e.shiftKey ? -1 : 1) + m) % m);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFlipIdx((x) => (x - 1 + m) % m);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const idx = ((flipIdx % m) + m) % m;
        setFlip3d(false);
        if (idx === open.length) showDesktop();
        else if (open[idx]) focusWin(open[idx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flip3d, flipIdx, wins, focusWin]);

  const liveZ = openWins.map((w) => w.z);
  const topZ = liveZ.length ? Math.max(...liveZ) : 0;
  const isAurora = wallpaper === "aurora";

  return (
    <>
      {/* SVG filters for the Aero glass refraction (taskbar / picker glass). */}
      <GlassFilter />
      <RotateGate />
      <div
      className="win7"
      style={{
        position: "relative",
        height: "100dvh",
        // wallpaper is rendered as a child ELEMENT below (not a background here):
        // .window.glass backdrop-filter samples sibling elements but not a big
        // ancestor's background-image (Chromium). Just a base colour here.
        background: "#06283c",
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setStartOpen(false);
      }}
    >
      {isAurora ? (
        <div className="aurora">
          <div className="aurora__layer aurora__layer--1" />
          <div className="aurora__layer aurora__layer--2" />
          <div className="aurora__layer aurora__layer--3" />
          <div className="aurora__ribbon" />
        </div>
      ) : (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: `url('${wallpaper}') center / cover`,
          }}
        />
      )}

      {/* desktop icons */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {APPS.map((a) => (
          <button
            key={a.id}
            onDoubleClick={() => openApp(a.id)}
            title={`Open ${a.label}`}
            style={{
              all: "unset",
              cursor: "pointer",
              width: 76,
              textAlign: "center",
              color: "#fff",
              fontSize: 12,
              textShadow: "0 1px 3px rgba(0,0,0,.85)",
            }}
          >
            <div style={{ fontSize: 34, lineHeight: 1 }}>{a.icon}</div>
            <div style={{ marginTop: 4 }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* windows are direct children of .win7 (no overflow-hidden wrapper — that
          would break the .window.glass backdrop-filter). Off-screen drags are
          clamped in moveWin; clicking empty desktop closes the start menu via the
          .win7 onPointerDown handler. */}
      {openWins.map((w, i) => {
        const m = openWins.length + 1; // open windows + the desktop item
        return (
          <Win7Window
            key={w.id}
            title={appOf(w.id).title}
            x={w.x}
            y={w.y}
            z={w.z}
            active={!w.min && w.z === topZ}
            minimizing={w.minimizing}
            closing={w.closing}
            defaultWidth={appOf(w.id).w}
            defaultHeight={appOf(w.id).h}
            bare={appOf(w.id).bare}
            peek={peek}
            flip={flip3d}
            flipP={(((i - flipIdx) % m) + m) % m}
            flipCount={m}
            onFlipSelect={() => selectFlip(w.id)}
            onFocus={() => focusWin(w.id)}
            onMove={(x, y) => moveWin(w.id, x, y)}
            onMinimize={() => minWin(w.id)}
            onClose={() => closeWin(w.id)}
          >
            {appOf(w.id).content}
          </Win7Window>
        );
      })}

      {/* Aero Flip 3D dim + hint (only while open) */}
      {flip3d && openWins.length > 0 && (
        <>
          <div
            onClick={() => setFlip3d(false)}
            onWheel={(e) => {
              const m = openWins.length + 1;
              setFlipIdx((x) => (x + (e.deltaY > 0 ? 1 : -1) + m) % m);
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 99990,
              background:
                "radial-gradient(120% 100% at 50% 40%, rgba(10,32,58,.45), rgba(2,10,22,.82))",
              animation: "flip3d-in .22s ease-out both",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 64,
              zIndex: 100010,
              textAlign: "center",
              fontSize: 13,
              color: "rgba(255,255,255,.85)",
              textShadow: "0 1px 3px rgba(0,0,0,.6)",
              pointerEvents: "none",
            }}
          >
            Tab / scroll to cycle · click a window or Enter to open · Esc to
            cancel
          </div>
        </>
      )}

      {/* Desktop item — last in the Flip 3D stack. Always mounted so it can
          shrink in from full-screen (and out) like the desktop transitioning
          into the 3D view; shows the wallpaper + desktop icons, no taskbar. */}
      {(() => {
        const on = flip3d && openWins.length > 0;
        const m = openWins.length + 1;
        const dp = (((openWins.length - flipIdx) % m) + m) % m;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const cardH = (FLIP_W * (vh - 40)) / vw; // screen aspect = maximised size
        const tcx = vw / 2 + FLIP_AX - dp * FLIP_DX;
        const tcy = (vh - 40) / 2 + FLIP_AY - dp * FLIP_DY;
        const tx = tcx - FLIP_W / 2; // card left=0 → centre at FLIP_W/2
        const ty = tcy - cardH / 2; // card top=0 → centre at cardH/2
        const para = `scaleX(${FLIP_FORE}) skewY(${FLIP_SKEW}deg) scale(${
          1 - dp * FLIP_DEPTH
        })`;
        return (
          <div
            onClick={() => {
              if (!on) return;
              setFlip3d(false);
              showDesktop();
            }}
            aria-hidden={!on}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: FLIP_W,
              height: on ? cardH : 340, // static when off → no SSR/client mismatch
              zIndex: 100000 + (m - dp),
              cursor: "pointer",
              pointerEvents: on ? "auto" : "none",
              borderRadius: 7,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.5)",
              boxShadow: "0 30px 70px rgba(0,0,0,.55)",
              opacity: on ? Math.max(0.45, 1 - dp * 0.08) : 0,
              background: isAurora
                ? AURORA_THUMB
                : `url('${wallpaper}') center / cover`,
              // off-state is a STATIC transform (no window-derived values) so
              // SSR and client hydration match; the real geometry is only
              // computed/used once Flip 3D is open (client-only).
              transform: on ? `translate(${tx}px, ${ty}px) ${para}` : "scale(2.2)",
              transition:
                "transform .44s cubic-bezier(.22,1,.36,1), opacity .44s ease",
              willChange: on ? "transform, opacity" : undefined,
            }}
          >
            {/* mini desktop icons (top-left), no taskbar */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 10,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {APPS.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 50,
                    color: "#fff",
                    fontSize: 9,
                    textShadow: "0 1px 2px rgba(0,0,0,.85)",
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{a.icon}</span>
                  <span style={{ marginTop: 2 }}>{a.label}</span>
                </div>
              ))}
            </div>
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 500,
                color: "#fff",
                background: "linear-gradient(transparent, rgba(0,0,0,.5))",
                textShadow: "0 1px 2px rgba(0,0,0,.6)",
              }}
            >
              Desktop
            </span>
          </div>
        );
      })()}

      {/* start menu (Aero glass) */}
      {startOpen && (
        <div
          className="win7-menu-open"
          style={{
            position: "absolute",
            bottom: 42,
            left: 6,
            width: 260,
            zIndex: 9999,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,.4)",
            background:
              "linear-gradient(to bottom, rgba(20,42,72,.92), rgba(8,22,40,.95))",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 12px 32px rgba(0,0,0,.5)",
          }}
        >
          <div
            style={{
              padding: "10px 12px",
              color: "#cfe6ff",
              fontSize: 12,
              borderBottom: "1px solid rgba(255,255,255,.12)",
            }}
          >
            Zizhen Liu
          </div>
          {APPS.map((a) => (
            <button
              key={a.id}
              onClick={() => openApp(a.id)}
              style={{
                all: "unset",
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(120,180,255,.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* taskbar (Aero glass) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 40,
          zIndex: 9998,
          borderTop: "1px solid rgba(255,255,255,.6)",
          boxShadow: "0 -2px 12px rgba(13,55,120,.35)",
        }}
      >
        {/* memoised glass (refraction kept) — decoupled from the dynamic
            content below so clicks/minimise never repaint it */}
        <TaskbarGlass />
        <div
          className="relative win7-taskbar"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 6px",
          }}
        >
        <button
          onClick={() => setStartOpen((o) => !o)}
          aria-label="Start"
          style={{
            all: "unset",
            cursor: "pointer",
            height: 34,
            width: 34,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 28%, #cfeeff, #2a7fd6 58%, #0a4a8a)",
            boxShadow:
              "0 1px 4px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.7), inset 0 6px 8px rgba(255,255,255,.4)",
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 32%, #fff, rgba(255,255,255,.2))",
            }}
          />
        </button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.25)" }} />

        {/* Flip 3D — "switch between windows" quick-launch (Win+Tab is grabbed by
            the real OS, so this button is the trigger) */}
        <button
          onClick={openFlip}
          aria-label="Switch between windows (Flip 3D)"
          title="Flip 3D"
          style={{
            all: "unset",
            cursor: "pointer",
            height: 30,
            width: 32,
            display: "grid",
            placeItems: "center",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,.22)",
            background: "rgba(255,255,255,.08)",
          }}
        >
          <span style={{ position: "relative", width: 17, height: 14 }}>
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 4,
                width: 11,
                height: 9,
                borderRadius: 2,
                background: "rgba(255,255,255,.35)",
                boxShadow: "0 0 0 1px rgba(255,255,255,.65)",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 6,
                top: 0,
                width: 11,
                height: 9,
                borderRadius: 2,
                background: "rgba(170,215,255,.9)",
                boxShadow: "0 0 0 1px rgba(255,255,255,.9)",
              }}
            />
          </span>
        </button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,.25)" }} />

        <div style={{ display: "flex", gap: 5, flex: 1, overflow: "hidden" }}>
          {wins.map((w) => {
            const active = !w.min && w.z === topZ;
            return (
              <button
                key={w.id}
                onClick={() => taskbarClick(w.id)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  maxWidth: 170,
                  padding: "5px 10px",
                  borderRadius: 5,
                  color: "#fff",
                  fontSize: 12,
                  border: `1px solid rgba(255,255,255,${active ? ".6" : ".22"})`,
                  background: active
                    ? "linear-gradient(to bottom, rgba(255,255,255,.4), rgba(255,255,255,.12))"
                    : "rgba(255,255,255,.07)",
                }}
              >
                <span style={{ fontSize: 15 }}>{appOf(w.id).icon}</span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {appOf(w.id).label}
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 12,
            textAlign: "right",
            padding: "0 8px",
            textShadow: "0 1px 2px rgba(0,0,0,.5)",
          }}
          suppressHydrationWarning
        >
          {clock}
        </div>

        {/* Aero Peek — Show Desktop sliver at the far right; hover previews the
            desktop (windows → glass outlines), click minimises/restores all */}
        <button
          aria-label="Show desktop"
          title="Show desktop"
          onMouseEnter={() => setPeek(true)}
          onMouseLeave={() => setPeek(false)}
          onClick={showDesktop}
          style={{
            all: "unset",
            cursor: "pointer",
            height: "100%",
            width: 12,
            marginLeft: 4,
            borderLeft: "1px solid rgba(255,255,255,.35)",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,.16), rgba(255,255,255,.03))",
          }}
        />
        </div>
      </div>
    </div>

      {/* wallpaper picker — bottom-right (hidden during Flip 3D). OUTSIDE .win7
          so 7.css doesn't restyle it. */}
      {!flip3d && (
        <div style={{ position: "fixed", bottom: 52, right: 14, zIndex: 99999 }}>
          <WallpaperPicker
            wallpapers={WALLPAPERS}
            current={wallpaper}
            onSelect={setWallpaper}
          />
        </div>
      )}
    </>
  );
}
