"use client";

import Link from "next/link";
import { archive } from "@/data/portfolio";
import MatrixRain from "@/components/MatrixRain";
import ArchiveList from "./ArchiveList";
import styles from "../subpage.module.css";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.grid} />
        <MatrixRain className={styles.rain} />
        <div className={styles.scanlines} />
        <div className={styles.vignette} />
      </div>

      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Zizhen Liu — home">
          ZL
        </Link>
        <LanguageToggle />
        <Link className={styles.backLink} href="/">
          {t('projectsPage.backHome')}
        </Link>
      </header>

      <div className={styles.main}>
        <div className={styles.eyebrow}>
          <span>{t('projectsPage.sectionIndex')}</span>
          <span aria-hidden="true">{"//"}</span>
          <span>{t('projectsPage.eyebrow')}</span>
        </div>
        <h1>{t('projectsPage.titlePrefix')}{archive.length}{t('projectsPage.titleSuffix')}</h1>
        <p className={styles.intro}>
          {t('projectsPage.intro')}
        </p>

        <ArchiveList entries={archive} />

        <div className={styles.cta}>
          <a className={styles.ctaButton} href="mailto:lzz288898@gmail.com">
            {t('projectsPage.requestDemo')} <span aria-hidden="true">↗</span>
          </a>
          <Link className={styles.ctaLink} href="/about">
            {t('projectsPage.aboutOperator')}
          </Link>
          <Link className={styles.ctaLink} href="/desktop">
            {t('projectsPage.aeroLab')}
          </Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>{t('footer.copyright')}</span>
        <Link href="/">{t('projectsPage.returnToMain')}</Link>
      </footer>
    </main>
  );
}
