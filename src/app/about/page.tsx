"use client";

import Link from "next/link";
import { education, interests, profile } from "@/data/portfolio";
import MatrixRain from "@/components/MatrixRain";
import styles from "../subpage.module.css";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AboutPage() {
  const { t, isZh } = useLanguage();

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
          {t('about.backHome')}
        </Link>
      </header>

      <div className={styles.main}>
        <div className={styles.eyebrow}>
          <span>{t('about.sectionIndex')}</span>
          <span aria-hidden="true">{"//"}</span>
          <span>{t('about.eyebrow')}</span>
        </div>
        <h1>{t('about.title')}</h1>
        <p className={styles.intro}>
          {profile.name} ({profile.preferredName}){t('about.introPrefix')}{profile.role.toLowerCase()}{t('about.introMiddle')}
          {!isZh && profile.location}{!isZh && ". "}{t('about.introSuffix')}
        </p>

        <div className={styles.cards}>
          {interests.map((interest) => (
            <article className={styles.card} key={interest.id}>
              <h2>{interest.title}</h2>
              <p>{interest.body}</p>
            </article>
          ))}
        </div>

        <div className={styles.factsBlock}>
          <div className={styles.eyebrow}>
            <span>{t('about.educationIndex')}</span>
            <span aria-hidden="true">{"//"}</span>
            <span>{t('about.educationEyebrow')}</span>
          </div>
          <div className={styles.eduList}>
            {education.map((item) => (
              <article key={item.school}>
                <span>{item.period}</span>
                <div>
                  <h3>{item.school}</h3>
                  <p>{item.degree}</p>
                  <p className={styles.eduMeta}>
                    {!isZh && item.location.toUpperCase()}
                    {item.ranking && (
                      <>
                        {" "}
                        <b>[ {item.ranking} ]</b>
                      </>
                    )}
                  </p>
                  <p className={styles.courses}>{item.courses.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.factsBlock}>
          <div className={styles.eyebrow}>
            <span>{t('about.factsIndex')}</span>
            <span aria-hidden="true">{"//"}</span>
            <span>{t('about.factsEyebrow')}</span>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>{t('about.languagesLabel')}</dt>
              <dd>{t('about.languagesValue')}</dd>
            </div>
            {!isZh && (
              <div>
                <dt>{t('about.accessLabel')}</dt>
                <dd>{profile.workRights}{t('about.accessSuffix')}</dd>
              </div>
            )}
            <div>
              <dt>{t('about.affiliationLabel')}</dt>
              <dd>{t('about.affiliationValue')}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.cta}>
          <a className={styles.ctaButton} href={`mailto:${profile.email}`}>
            {t('about.startConversation')}<span aria-hidden="true">↗</span>
          </a>
          <Link className={styles.ctaLink} href="/projects">
            {t('about.projectArchive')}
          </Link>
          <Link className={styles.ctaLink} href="/desktop">
            {t('about.aeroLab')}
          </Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>{t('footer.copyright')}</span>
        <Link href="/">{t('about.returnToMain')}</Link>
      </footer>
    </main>
  );
}
