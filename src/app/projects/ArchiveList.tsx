"use client";

import { useSyncExternalStore } from "react";
import type { ArchiveAccess, ArchiveEntry } from "@/data/portfolio";
import styles from "../subpage.module.css";

const DOMAINS = ["ALL", "WEB", "AI/ML", "SYSTEMS", "HARDWARE", "MOBILE", "LAB"] as const;

const slugOf = (domain: string) =>
  domain.toLowerCase().replace(/[^a-z]+/g, "-");

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

// Kept outside the component: React Compiler treats location mutations inside
// component scope as illegal writes.
const applyHash = (slug: string) => {
  if (slug) {
    window.location.hash = slug;
    return;
  }
  window.history.replaceState(null, "", window.location.pathname);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

function AccessBadge({ access }: { access: ArchiveAccess }) {
  switch (access.kind) {
    case "live":
      return (
        <>
          <a className={styles.accessLink} href={access.href} target="_blank" rel="noreferrer">
            LIVE ↗
          </a>
          {access.source && (
            <a className={styles.accessLink} href={access.source} target="_blank" rel="noreferrer">
              SOURCE ↗
            </a>
          )}
        </>
      );
    case "github":
      return (
        <a className={styles.accessLink} href={access.href} target="_blank" rel="noreferrer">
          SOURCE ↗
        </a>
      );
    case "wip":
      return access.href ? (
        <a className={styles.accessLink} href={access.href} target="_blank" rel="noreferrer">
          IN DEVELOPMENT ↗
        </a>
      ) : (
        <span className={styles.access}>IN DEVELOPMENT</span>
      );
    case "nda":
      return <span className={styles.access}>NDA · DEMO ON REQUEST</span>;
    case "here":
      return access.href ? (
        <>
          <span className={styles.access}>YOU ARE HERE</span>
          <a className={styles.accessLink} href={access.href} target="_blank" rel="noreferrer">
            SOURCE ↗
          </a>
        </>
      ) : (
        <span className={styles.access}>YOU ARE HERE</span>
      );
    case "none":
      return null;
    default:
      return <span className={styles.access}>CODE PRIVATE</span>;
  }
}

/**
 * Archive listing with a domain filter: the selected domain's entries are
 * pinned to the top at full strength while the rest sink below, dimmed —
 * a frontend visitor reads frontend work first, an AI visitor reads AI first.
 * The selection deep-links via the URL hash (e.g. /projects#ai-ml).
 */
export default function ArchiveList({
  entries,
}: {
  entries: readonly ArchiveEntry[];
}) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.replace("#", ""),
    () => "",
  );

  const domain =
    DOMAINS.find((candidate) => slugOf(candidate) === hash && candidate !== "ALL") ?? "ALL";

  const select = (next: (typeof DOMAINS)[number]) => {
    applyHash(next === "ALL" ? "" : slugOf(next));
  };

  const hits = entries.filter(
    (entry) => domain === "ALL" || entry.domains.includes(domain),
  );
  const rest = entries.filter((entry) => !hits.includes(entry));
  const ordered = [
    ...hits.map((entry) => ({ entry, hit: true })),
    ...rest.map((entry) => ({ entry, hit: false })),
  ];

  const hitCount = ordered.filter(({ hit }) => hit).length;

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Prioritise projects by domain">
        <span className={styles.filtersLabel}>FILTER:</span>
        {DOMAINS.map((candidate) => (
          <button
            key={candidate}
            type="button"
            aria-pressed={domain === candidate}
            className={
              domain === candidate
                ? `${styles.filterButton} ${styles.filterActive}`
                : styles.filterButton
            }
            onClick={() => select(candidate)}
          >
            {candidate}
          </button>
        ))}
        <span className={styles.filterCount} aria-live="polite">
          {domain === "ALL"
            ? `${entries.length} ENTRIES`
            : `${hitCount} PRIORITISED · ${entries.length - hitCount} DIMMED`}
        </span>
      </div>

      <div className={styles.list}>
        {ordered.map(({ entry, hit }) => (
          <article
            className={hit ? styles.entry : `${styles.entry} ${styles.entryDimmed}`}
            key={entry.title}
          >
            <span className={styles.entryYear}>{entry.year}</span>
            <div className={styles.entryBody}>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <ul className={styles.entryStack} aria-label={`${entry.title} technologies`}>
                {entry.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.entryMeta}>
              <div className={styles.domains}>
                {entry.domains.map((entryDomain) => (
                  <span key={entryDomain}>{entryDomain}</span>
                ))}
              </div>
              <AccessBadge access={entry.access} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
