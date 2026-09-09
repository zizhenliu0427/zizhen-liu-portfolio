"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={styles.toggle} role="radiogroup" aria-label="Language">
      <button
        className={locale === "en" ? styles.active : undefined}
        onClick={() => setLocale("en")}
        aria-checked={locale === "en"}
        role="radio"
      >
        EN
      </button>
      <span className={styles.divider} aria-hidden="true">/</span>
      <button
        className={locale === "zh" ? styles.active : undefined}
        onClick={() => setLocale("zh")}
        aria-checked={locale === "zh"}
        role="radio"
      >
        中
      </button>
    </div>
  );
}
