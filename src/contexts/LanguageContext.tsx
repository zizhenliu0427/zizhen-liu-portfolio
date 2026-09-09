"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n";
import { getCurrentLocale, setStoredLocale } from "@/i18n";
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

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a dot-path key. Falls back to English, then to the key itself. */
  t: (key: string) => string;
  /** Convenience flag: `true` when current locale is Chinese. */
  isZh: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  /* Hydrate from localStorage / navigator.language on mount */
  useEffect(() => {
    setLocaleState(getCurrentLocale());
    setMounted(true);
  }, []);

  /* Update <html lang> attribute whenever locale changes */
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setStoredLocale(next);
  }, []);

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

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t, isZh: locale === "zh" }}
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
