import type { Metadata } from "next";
import Link from "next/link";
import { archive } from "@/data/portfolio";
import MatrixRain from "@/components/MatrixRain";
import ArchiveList from "./ArchiveList";
import styles from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Project Archive — Zizhen Liu",
  description:
    "Every project on record: web full-stack products, AI/ML systems, GPU and FPGA work, Android apps and the home lab.",
};

export default function ProjectsPage() {
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
          <span>02</span>
          <span aria-hidden="true">{"//"}</span>
          <span>PROJECT_ARCHIVE</span>
        </div>
        <h1>ls -la ./projects — {archive.length} entries.</h1>
        <p className={styles.intro}>
          Everything on record — pick a domain and its work moves to the front.
          University and NDA projects are labelled honestly instead of linking
          nowhere; demos are available on request.
        </p>

        <ArchiveList entries={archive} />

        <div className={styles.cta}>
          <a className={styles.ctaButton} href="mailto:lzz288898@gmail.com">
            Request a demo <span aria-hidden="true">↗</span>
          </a>
          <Link className={styles.ctaLink} href="/about">
            ABOUT THE OPERATOR
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
