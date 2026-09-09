"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./BootScreen.module.css";

const SESSION_KEY = "zl-boot-seen";

/**
 * Decorative Matrix-style boot sequence shown over the page on first load.
 * It never blocks the visitor: the overlay ignores pointer events, is hidden
 * from assistive technology, disappears via pure CSS even without JavaScript,
 * and is skipped entirely under prefers-reduced-motion and on repeat visits
 * within the same session.
 */
export default function BootScreen({
  embedded = false,
  compact = false,
}: {
  embedded?: boolean;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) return;
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      ref.current?.style.setProperty("display", "none");
      return;
    }
    window.sessionStorage.setItem(SESSION_KEY, "1");
  }, [embedded]);

  return (
    <div
      className={`${styles.boot} ${embedded ? styles.embedded : ""} ${compact ? styles.compact : ""}`}
      aria-hidden="true"
      ref={ref}
    >
      <div className={styles.inner}>
        <p className={styles.title}>{t('boot.title')}</p>
        <p className={styles.line}>
          {t('boot.loadProfile')} <span>{t('boot.ok')}</span>
        </p>
        <p className={styles.line}>
          {t('boot.decryptPortfolio')} <span>{t('boot.ok')}</span>
        </p>
        <p className={styles.line}>
          {t('boot.traceSignal')} <span>{t('boot.ok')}</span>
        </p>
        <p className={`${styles.line} ${styles.last}`}>
          {t('boot.accessGranted')}<i />
        </p>
        <div className={styles.bar}>
          <span />
        </div>
      </div>
    </div>
  );
}
