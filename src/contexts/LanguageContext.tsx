"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import {
  getLocaleSnapshot,
  getServerLocaleSnapshot,
  setStoredLocale,
  subscribeLocale,
} from "@/i18n";
import { translations } from "@/locales";

/* ------------------------------------------------------------------ */
/*  Translation helpers                                                */
/* ------------------------------------------------------------------ */

type Translations = typeof translations.en;

/** Resolve a dot-path key like `"nav.work"` against a nested object. */
function resolve(obj: Translations, path: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj;
  for (const segment of path.split(".")) {
    if (cur == null) return path;
    cur = cur[segment];
  }
  return typeof cur === "string" ? cur : path;
}

/**
 * Resolve a dot-path key to a string array — used for list content such as
 * project highlights, which `resolve` cannot return. `null` means "not found",
 * so the caller can fall back to English.
 */
function resolveList(obj: Translations, path: string): readonly string[] | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj;
  for (const segment of path.split(".")) {
    if (cur == null) return null;
    cur = cur[segment];
  }
  return Array.isArray(cur) ? (cur as readonly string[]) : null;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a dot-path key. Falls back to English, then to the key itself. */
  t: (key: string) => string;
  /**
   * Translate a dot-path key that holds a list (e.g. project highlights).
   * Falls back to English, then to an empty array.
   */
  tList: (key: string) => readonly string[];
  /** Convenience flag: `true` when current locale is Chinese. */
  isZh: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function LanguageProvider({ children }: { children: ReactNode }) {
  /* The locale is external state (localStorage, falling back to
     navigator.language), so it is read through useSyncExternalStore instead of
     being copied into React state inside an effect. The prerendered HTML uses
     the server snapshot and React swaps in the client value during hydration —
     no setState in an effect, no cascading render. */
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  /* Update <html lang> attribute whenever locale changes */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  /* Writing to the store notifies every subscriber, so this needs no local
     state of its own; the module-level function is already referentially
     stable across renders. */
  const setLocale = setStoredLocale;

  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale] as Translations;
      const result = resolve(dict, key);
      // Fallback to English if key not found in current locale
      if (result === key && locale !== "en") {
        return resolve(translations.en, key);
      }
      return result;
    },
    [locale],
  );

  const tList = useCallback(
    (key: string): readonly string[] => {
      const dict = translations[locale] as Translations;
      return resolveList(dict, key) ?? resolveList(translations.en, key) ?? [];
    },
    [locale],
  );

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, tList, isZh: locale === "zh" }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a <LanguageProvider>");
  }
  return ctx;
}
