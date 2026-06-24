"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";

type DraggableProps = {
  children: ReactNode;
  /** Initial position in pixels, relative to the nearest positioned ancestor. */
  initialX?: number;
  initialY?: number;
};

/**
 * Makes its child freely draggable with the mouse or a finger. Used in the demo
 * to slide glass cards over different parts of the wallpaper and check how the
 * Aero reflection reads against various backgrounds.
 */
export default function Draggable({
  children,
  initialX = 0,
  initialY = 0,
}: DraggableProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  // Offset between the pointer and the element's top-left corner at grab time.
  const grab = useRef({ x: 0, y: 0 });

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    grab.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setPos({ x: e.clientX - grab.current.x, y: e.clientY - grab.current.y });
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        touchAction: "none",
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 50 : undefined,
      }}
    >
      {children}
    </div>
  );
}
