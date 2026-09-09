"use client";

export type Locale = "en" | "zh";

const STORAGE_KEY = "zl-portfolio-locale";

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

/** Persist the user's language choice. */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}

/**
 * Priority: localStorage → navigator.language → fallback "en".
 */
export function getCurrentLocale(): Locale {
  return getStoredLocale() ?? getSystemLocale();
}
