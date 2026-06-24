"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

// Shared stacking counter so clicking a window brings it to the front.
let zCounter = 10;

type Win7WindowProps = {
  title: ReactNode;
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  width?: number;
};

/**
 * A draggable Windows 7 window using 7.css chrome. Drag by the title bar; the
 * min/max/close controls work; clicking a window raises it above the others.
 * Must live inside a positioned `.win7` desktop container.
 */
export default function Win7Window({
  title,
  children,
  initialX = 48,
  initialY = 48,
  width = 360,
}: Win7WindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [maximized, setMaximized] = useState(false);
  const [open, setOpen] = useState(true);
  const [z, setZ] = useState(() => ++zCounter);
  const grab = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  if (!open) return null;

  const focus = () => setZ(++zCounter);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (maximized) return;
    // don't start a drag when clicking the window controls
    if ((e.target as HTMLElement).closest(".title-bar-controls")) return;
    dragging.current = true;
    grab.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setPos({ x: e.clientX - grab.current.x, y: e.clientY - grab.current.y });
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const style: CSSProperties = maximized
    ? { position: "absolute", inset: "0 0 40px 0", width: "auto", zIndex: z }
    : { position: "absolute", left: pos.x, top: pos.y, width, zIndex: z };

  return (
    <div className="window" style={style} onPointerDown={focus}>
      <div
        className="title-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => setMaximized((m) => !m)}
        style={{ cursor: maximized ? "default" : "grab", touchAction: "none" }}
      >
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => setOpen(false)} />
          <button
            aria-label={maximized ? "Restore" : "Maximize"}
            onClick={() => setMaximized((m) => !m)}
          />
          <button aria-label="Close" onClick={() => setOpen(false)} />
        </div>
      </div>
      <div className="window-body has-space" style={{ color: "#1a1a1a" }}>
        {children}
      </div>
    </div>
  );
}
