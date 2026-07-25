import { useSyncExternalStore } from "react";

/**
 * Decides what the visitor actually gets, once per page load.
 *
 * Two independent axes, because they fail independently: `flight` is how much
 * camera move to play, `renderer` is what draws the background at all. A repeat
 * visitor still gets the live WebGL field behind the hero — they just do not get
 * flown through the window again.
 */
export type IntroFlight =
  /** City, window, room, monitor, dock. */
  | "full"
  /** Already docked; short dissolve onto the live screen. */
  | "short"
  /** Already docked, no reveal animation at all. */
  | "none";

export type IntroPlan = {
  flight: IntroFlight;
  renderer: "webgl" | "canvas2d";
};

const SESSION_KEY = "zl-cinematic-entry-seen-v2";

/** Prerender assumes a repeat visitor: the quietest thing that can be wrong. */
const SERVER_PLAN: IntroPlan = { flight: "none", renderer: "webgl" };

function readSession(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    // Private mode and blocked storage both land here; treat as a first visit.
    return false;
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // The intro stays optional when storage is unavailable.
  }
}

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(
      probe.getContext("webgl2") ??
        probe.getContext("webgl") ??
        probe.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

const FLIGHTS: IntroFlight[] = ["full", "short", "none"];

function computePlan(): IntroPlan {
  const params = new URLSearchParams(window.location.search);

  // Debug switches. `?renderer=canvas2d` is the only practical way to exercise
  // the no-WebGL branch in a browser that has WebGL.
  const forcedRenderer = params.get("renderer");
  const forcedFlight = params.get("flight") as IntroFlight | null;
  if (forcedRenderer === "canvas2d") {
    return { flight: "none", renderer: "canvas2d" };
  }

  if (!supportsWebGL()) {
    // Bottom of the fallback chain that still moves: Canvas 2D glyph rain.
    return { flight: "none", renderer: "canvas2d" };
  }

  if (forcedFlight && FLIGHTS.includes(forcedFlight)) {
    return { flight: forcedFlight, renderer: "webgl" };
  }

  const forced = params.get("intro") === "1";
  if (!forced && readSession(SESSION_KEY)) {
    return { flight: "none", renderer: "webgl" };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Coarse pointers and narrow viewports skip the flight: the city leg is the
  // expensive part and the least legible on a phone.
  const compact = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
  if (reducedMotion || compact) {
    return { flight: "short", renderer: "webgl" };
  }

  return { flight: "full", renderer: "webgl" };
}

// Cached so getSnapshot returns a stable identity; a fresh object every call
// would make useSyncExternalStore re-render forever.
let cached: IntroPlan | null = null;

function getPlan(): IntroPlan {
  cached ??= computePlan();
  return cached;
}

/** Never fires: the plan is fixed for the life of the page load. */
function subscribe() {
  return () => {};
}

export function useIntroPlan(): IntroPlan {
  return useSyncExternalStore(subscribe, getPlan, () => SERVER_PLAN);
}
