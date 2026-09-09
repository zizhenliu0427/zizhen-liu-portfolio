"use client";

export type Locale = "en" | "zh";

const STORAGE_KEY = "zl-portfolio-locale";

/* The active locale lives outside React — in localStorage, with
   navigator.language as the fallback. Components read it through
   useSyncExternalStore rather than copying it into state, so the store below
   owns both the value and the change notifications. */
type LocaleListener = () => void;

const listeners = new Set<LocaleListener>();

/** Memoised result of `getCurrentLocale()`; `null` means "not resolved yet". */
let snapshot: Locale | null = null;

/** Check if `navigator.language` starts with `zh` → Chinese, else English. */
export function getSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

/** Read the user's explicit choice from localStorage (if any). */
export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "zh") return stored;
  return null;
}

/** Persist the user's language choice and notify every subscriber. */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
  snapshot = locale;
  for (const listener of listeners) listener();
}

/**
 * Priority: localStorage → navigator.language → fallback "en".
 */
export function getCurrentLocale(): Locale {
  return getStoredLocale() ?? getSystemLocale();
}

/* ------------------------------------------------------------------ */
/*  External store (useSyncExternalStore)                              */
/* ------------------------------------------------------------------ */

/** Subscribe to locale changes, including writes from another tab. */
export function subscribeLocale(listener: LocaleListener): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = null;
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Client snapshot. React calls this on every render, so the resolved value is
 * memoised and invalidated on write instead of touching localStorage each time.
 */
export function getLocaleSnapshot(): Locale {
  snapshot ??= getCurrentLocale();
  return snapshot;
}

/**
 * Server snapshot. There is no localStorage or navigator during the static
 * export, so the prerendered HTML is always English and React swaps in the
 * client value itself once hydration finishes.
 */
export function getServerLocaleSnapshot(): Locale {
  return "en";
}
