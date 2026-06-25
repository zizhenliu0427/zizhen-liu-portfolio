"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

type Win7WindowProps = {
  title: ReactNode;
  children: ReactNode;
  x: number;
  y: number;
  z: number;
  active: boolean;
  minimizing: boolean;
  /** Playing the close animation before the parent removes the window. */
  closing?: boolean;
  /** Initial window width (px). Default 400. */
  defaultWidth?: number;
  /** Initial window height (px). Omit for content-sized (auto) height. */
  defaultHeight?: number;
  /** Drop the white body padding and let the child fill the body edge-to-edge
   *  (e.g. an embedded iframe). */
  bare?: boolean;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onMinimize: () => void;
  onClose: () => void;
};

/**
 * A draggable, resizable Windows 7 window (7.css chrome), controlled by
 * Win7Desktop. `active` adds the focused look; `minimizing` plays the
 * shrink-to-taskbar animation. Drag by the title bar; resize from the
 * bottom-right grip. Maximize is intentionally disabled.
 */
export default function Win7Window({
  title,
  children,
  x,
  y,
  z,
  active,
  minimizing,
  closing = false,
  defaultWidth = 400,
  defaultHeight,
  bare = false,
  onFocus,
  onMove,
  onMinimize,
  onClose,
}: Win7WindowProps) {
  const winRef = useRef<HTMLDivElement>(null);
  const grab = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const resize = useRef<{ px: number; py: number; w: number; h: number } | null>(
    null,
  );

  const [size, setSize] = useState<{ w: number; h: number | null }>({
    w: defaultWidth,
    h: defaultHeight ?? null,
  });

  // Play the Aero open animation only briefly on mount, then drop the class. The
  // animation transforms the window (fill: both), which makes it a backdrop-root
  // and confines the title bar's glass backdrop-filter to the window interior.
  // Removing it once done lets the title bar frost the desktop behind it.
  const [opening, setOpening] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setOpening(false), 240);
    return () => window.clearTimeout(t);
  }, []);

  // Maximize/restore. Win7 grows the window to fill the screen with an ease-out
  // re-layout (not a scale), so we animate the actual left/top/width/height via a
  // transition that's only active during the toggle (never during a drag).
  const [maximized, setMaximized] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  function toggleMax() {
    onFocus();
    if (maximized) {
      setTransitioning(true);
      setMaximized(false);
      window.setTimeout(() => setTransitioning(false), 280);
    } else {
      // pin an explicit start height first (auto height can't animate), then
      // grow on the next frame so the transition has a real "from" value
      if (size.h == null) {
        setSize((s) => ({ ...s, h: winRef.current?.offsetHeight ?? 320 }));
      }
      requestAnimationFrame(() => {
        setTransitioning(true);
        setMaximized(true);
        window.setTimeout(() => setTransitioning(false), 280);
      });
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (maximized) return;
    if ((e.target as HTMLElement).closest(".title-bar-controls")) return;
    dragging.current = true;
    grab.current = { x: e.clientX - x, y: e.clientY - y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    onMove(e.clientX - grab.current.x, e.clientY - grab.current.y);
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  function onResizeDown(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    onFocus();
    const h = size.h ?? winRef.current?.offsetHeight ?? 320;
    resize.current = { px: e.clientX, py: e.clientY, w: size.w, h };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onResizeMove(e: PointerEvent<HTMLDivElement>) {
    const r = resize.current;
    if (!r) return;
    setSize({
      w: Math.max(300, r.w + (e.clientX - r.px)),
      h: Math.max(180, r.h + (e.clientY - r.py)),
    });
  }
  function onResizeUp(e: PointerEvent<HTMLDivElement>) {
    resize.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const style: CSSProperties = {
    position: "absolute",
    zIndex: z,
    display: "flex",
    flexDirection: "column",
    ...(maximized
      ? { left: 0, top: 0, width: "100%", height: "calc(100% - 40px)" }
      : { left: x, top: y, width: size.w, height: size.h ?? undefined }),
    transition: transitioning
      ? `left .28s ${ease}, top .28s ${ease}, width .28s ${ease}, height .28s ${ease}`
      : undefined,
  };

  const bodyStyle: CSSProperties = size.h
    ? { flex: "1 1 0", minHeight: 0, overflow: bare ? "hidden" : "auto" }
    : { maxHeight: "70vh", overflow: "auto" };
  if (!bare) bodyStyle.color = "#1a1a1a";
  if (bare) {
    bodyStyle.padding = "0";
    // solid backstop so the desktop never shows through an embedded (bare) app
    // during the maximize/resize transition
    bodyStyle.background = "#04161f";
  }

  return (
    <div
      ref={winRef}
      className={`window glass ${active ? "active" : ""} ${
        minimizing
          ? "win7-min"
          : closing
            ? "win7-close"
            : opening
              ? "win7-open"
              : ""
      }`}
      style={style}
      onPointerDown={onFocus}
    >
      <div
        className="title-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest(".title-bar-controls"))
            toggleMax();
        }}
        style={{ cursor: maximized ? "default" : "grab", touchAction: "none" }}
      >
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={onMinimize} />
          <button
            aria-label={maximized ? "Restore" : "Maximize"}
            onClick={toggleMax}
          />
          <button aria-label="Close" onClick={onClose} />
        </div>
      </div>
      <div
        className={`window-body ${bare ? "" : "has-space"}`}
        style={bodyStyle}
      >
        {children}
      </div>
      {/* bottom-right resize grip (hidden while maximized) */}
      {!maximized && (
        <div
          aria-hidden
          onPointerDown={onResizeDown}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeUp}
          title="Resize"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
            touchAction: "none",
            zIndex: 6,
            backgroundImage:
              "linear-gradient(135deg, transparent 0 45%, rgba(90,90,90,.55) 45% 55%, transparent 55% 70%, rgba(90,90,90,.55) 70% 80%, transparent 80%)",
          }}
        />
      )}
    </div>
  );
}
