import type { Metadata } from "next";
import Link from "next/link";
import { education, interests, profile } from "@/data/portfolio";
import MatrixRain from "@/components/MatrixRain";
import styles from "../subpage.module.css";

export const metadata: Metadata = {
  title: "About — Zizhen Liu",
  description:
    "The operator behind the terminal: hardware and home lab, photography, automotive interests, languages and education.",
};

export default function AboutPage() {
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
        <Link className={styles.backLink} href="/">
          CD ../HOME
        </Link>
      </header>

      <div className={styles.main}>
        <div className={styles.eyebrow}>
          <span>05</span>
          <span aria-hidden="true">{"//"}</span>
          <span>OPERATOR_PROFILE</span>
        </div>
        <h1>The human behind the terminal.</h1>
        <p className={styles.intro}>
          {profile.name} ({profile.preferredName}) — a {profile.role.toLowerCase()} in{" "}
          {profile.location}. The professional story lives on the main page and
          in the project archive; this page is everything that happens when the
          IDE is closed — and most of it still involves hardware.
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
            <span>05.1</span>
            <span aria-hidden="true">{"//"}</span>
            <span>EDUCATION_RECORDS</span>
          </div>
          <div className={styles.eduList}>
            {education.map((item) => (
              <article key={item.school}>
                <span>{item.period}</span>
                <div>
                  <h3>{item.school}</h3>
                  <p>{item.degree}</p>
                  <p className={styles.courses}>{item.courses.join(" · ")}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.factsBlock}>
          <div className={styles.eyebrow}>
            <span>05.2</span>
            <span aria-hidden="true">{"//"}</span>
            <span>SYSTEM_FACTS</span>
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>LANGUAGES</dt>
              <dd>English (proficient) · Mandarin (native) · Japanese (learning)</dd>
            </div>
            <div>
              <dt>ACCESS</dt>
              <dd>{profile.workRights} · full NSW licence (manual)</dd>
            </div>
            <div>
              <dt>AFFILIATION</dt>
              <dd>Australian Computer Society member</dd>
            </div>
          </dl>
        </div>

        <div className={styles.cta}>
          <a className={styles.ctaButton} href={`mailto:${profile.email}`}>
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
          <Link className={styles.ctaLink} href="/projects">
            PROJECT ARCHIVE
          </Link>
          <Link className={styles.ctaLink} href="/desktop">
            AERO LAB
          </Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <span>© 2026 ZIZHEN LIU</span>
        <Link href="/">RETURN TO MAIN ↖</Link>
      </footer>
    </main>
  );
}
