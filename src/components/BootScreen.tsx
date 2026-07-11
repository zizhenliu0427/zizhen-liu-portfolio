"use client";

import { useEffect, useRef } from "react";
import styles from "./BootScreen.module.css";

const SESSION_KEY = "zl-boot-seen";

/**
 * Decorative Matrix-style boot sequence shown over the page on first load.
 * It never blocks the visitor: the overlay ignores pointer events, is hidden
 * from assistive technology, disappears via pure CSS even without JavaScript,
 * and is skipped entirely under prefers-reduced-motion and on repeat visits
 * within the same session.
 */
export default function BootScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      ref.current?.style.setProperty("display", "none");
      return;
    }
    window.sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  return (
    <div className={styles.boot} aria-hidden="true" ref={ref}>
      <div className={styles.inner}>
        <p className={styles.title}>ZL://BOOT_SEQUENCE — V.01</p>
        <p className={styles.line}>
          &gt; loading profile.sys <span>OK</span>
        </p>
        <p className={styles.line}>
          &gt; decrypting portfolio.dat <span>OK</span>
        </p>
        <p className={styles.line}>
          &gt; tracing signal — sydney.au <span>OK</span>
        </p>
        <p className={`${styles.line} ${styles.last}`}>
          &gt; access granted — entering system<i />
        </p>
        <div className={styles.bar}>
          <span />
        </div>
      </div>
    </div>
  );
}
