import Link from "next/link";
import {
  capabilities,
  education,
  experience,
  profile,
  projects,
} from "@/data/portfolio";
import BootScreen from "@/components/BootScreen";
import Decode from "@/components/Decode";
import MatrixRain from "@/components/MatrixRain";
import styles from "./page.module.css";

function SectionHeading({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <div className={styles.sectionCode}>
        <span>{index}</span>
        <span aria-hidden="true">{"//"}</span>
        <span>{eyebrow}</span>
      </div>
      <h2>
        <Decode text={title} />
      </h2>
    </div>
  );
}

function VisualChrome() {
  return (
    <div className={styles.visualChrome} aria-hidden="true">
      <span>PHOSPHOR // P31</span>
      <span>SYNC 60.00HZ</span>
    </div>
  );
}

function ProjectVisual({ visual }: { visual: (typeof projects)[number]["visual"] }) {
  if (visual === "sensor") {
    const bars = [38, 64, 48, 78, 56, 88, 70, 96, 66, 83, 58, 74];
    return (
      <div className={`${styles.projectVisual} ${styles.sensorVisual}`} aria-hidden="true">
        <div className={styles.visualTopline}>
          <span>ENVIRONMENT / LIVE</span>
          <span className={styles.visualStatus}>STREAMING</span>
        </div>
        <div className={styles.sensorReadout}>
          <div>
            <span>TEMP.AVG</span>
            <strong>22.4°C</strong>
          </div>
          <div>
            <span>AIR.QUALITY</span>
            <strong>GOOD</strong>
          </div>
        </div>
        <div className={styles.chart}>
          {bars.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
          <div className={styles.chartScan} />
        </div>
        <div className={styles.promptLine}>
          <span>&gt;_</span>
          <span>Compare energy usage across the last 30 days</span>
          <i />
        </div>
        <VisualChrome />
      </div>
    );
  }

  if (visual === "database") {
    return (
      <div className={`${styles.projectVisual} ${styles.databaseVisual}`} aria-hidden="true">
        <div className={styles.visualTopline}>
          <span>CMO_DB / INDEX</span>
          <span>EN · 中文</span>
        </div>
        <div className={styles.databaseSearch}>
          <span>⌕</span>
          <span>Search 29,000+ records</span>
          <b>⌘ K</b>
        </div>
        <div className={styles.databaseGrid}>
          {["AESA", "RADAR", "EO/IR", "SONAR", "EW", "MISSILE"].map((label, index) => (
            <div key={label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{label}</strong>
              <i>{[3421, 9814, 2260, 4893, 1942, 6750][index]}</i>
            </div>
          ))}
        </div>
        <div className={styles.orbit}>
          <span />
          <span />
          <span />
          <b>16</b>
        </div>
        <VisualChrome />
      </div>
    );
  }

  return (
    <div className={`${styles.projectVisual} ${styles.cameraVisual}`} aria-hidden="true">
      <div className={styles.visualTopline}>
        <span>CTV / SECURE MONITOR</span>
        <span className={styles.recording}>● REC</span>
      </div>
      <div className={styles.cameraGrid}>
        {["CAM_01", "CAM_02", "CAM_03", "CAM_04"].map((camera, index) => (
          <div key={camera} className={index === 2 ? styles.cameraAlert : undefined}>
            <span>{camera}</span>
            <i />
            {index === 2 && <b>ACTIVITY DETECTED</b>}
          </div>
        ))}
      </div>
      <div className={styles.cameraFooter}>
        <span>4 CHANNELS ONLINE</span>
        <span>LATENCY 42MS</span>
      </div>
      <VisualChrome />
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.site}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <BootScreen />

      <div className={styles.ambient} aria-hidden="true">
        <div className={styles.grid} />
        <MatrixRain className={styles.rain} />
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <div className={styles.scanlines} />
        <div className={styles.sweep} />
        <div className={styles.vignette} />
      </div>

      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="Zizhen Liu — home">
          <span className={styles.brandMark}>ZL</span>
          <span className={styles.brandText}>
            PORTFOLIO
            <small>V.01 / 2026</small>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#work"><span>01</span> Work</a>
          <a href="#experience"><span>02</span> Experience</a>
          <a href="#lab"><span>03</span> Lab</a>
          <a href="#contact"><span>04</span> Contact</a>
        </nav>

        <div className={styles.availability}>
          <i aria-hidden="true" />
          OPEN_TO_WORK
        </div>
      </header>

      <section className={styles.hero} id="top">
        <div className={styles.heroContent} id="main-content">
          <div className={styles.heroMeta}>
            <span>00 // SYSTEM_PROFILE</span>
            <span>SYDNEY · AU</span>
          </div>

          <h1>
            <span><Decode text="ZIZHEN" delay={260} /></span>
            <span><Decode text="LIU" delay={420} /><span className={styles.cursor} aria-hidden="true" /></span>
          </h1>

          <div className={styles.roleLine}>
            <span>FRONTEND</span>
            <span>ENGINEER</span>
          </div>

          <p className={styles.heroStatement}>{profile.statement}</p>

          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#work">
              Explore selected work <span aria-hidden="true">↘</span>
            </a>
            <a className={styles.secondaryButton} href={`mailto:${profile.email}`}>
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>

          <dl className={styles.heroFacts}>
            <div>
              <dt>LOCATION</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>ACCESS</dt>
              <dd>{profile.workRights}</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd>{profile.availability}</dd>
            </div>
          </dl>
        </div>

        <aside className={styles.profilePanel} aria-label="Candidate profile summary">
          <div className={styles.panelHeader}>
            <span className={styles.panelDots}><i /><i /><i /></span>
            <span>candidate.profile.ts</span>
            <span>UTF-8</span>
          </div>
          <div className={styles.codeBlock}>
            <div><span className={styles.lineNo}>01</span><code><b>const</b> candidate = &#123;</code></div>
            <div><span className={styles.lineNo}>02</span><code>&nbsp;&nbsp;name: <em>&quot;{profile.name}&quot;</em>,</code></div>
            <div><span className={styles.lineNo}>03</span><code>&nbsp;&nbsp;alias: <em>&quot;{profile.preferredName}&quot;</em>,</code></div>
            <div><span className={styles.lineNo}>04</span><code>&nbsp;&nbsp;focus: [</code></div>
            <div><span className={styles.lineNo}>05</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<em>&quot;React&quot;</em>, <em>&quot;TypeScript&quot;</em>,</code></div>
            <div><span className={styles.lineNo}>06</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<em>&quot;Data visualisation&quot;</em>,</code></div>
            <div><span className={styles.lineNo}>07</span><code>&nbsp;&nbsp;],</code></div>
            <div><span className={styles.lineNo}>08</span><code>&nbsp;&nbsp;available: <strong>true</strong>,</code></div>
            <div><span className={styles.lineNo}>09</span><code>&#125;;</code></div>
          </div>
          <div className={styles.panelTelemetry}>
            <div><span>UI SYSTEMS</span><i><b /></i><em>92</em></div>
            <div><span>DATA UI</span><i><b /></i><em>88</em></div>
            <div><span>PRODUCT THINKING</span><i><b /></i><em>84</em></div>
          </div>
          <div className={styles.panelFooter}>
            <span><i /> BUILD READY</span>
            <span>CTRL + K</span>
          </div>
          <div className={styles.panelRaster} aria-hidden="true" />
        </aside>

        <div className={styles.scrollCue} aria-hidden="true">
          <span>SCROLL TO DECODE</span>
          <i />
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div>
          <span>REACT</span><i>{"//"}</i><span>TYPESCRIPT</span><i>{"//"}</i><span>NEXT.JS</span><i>{"//"}</i>
          <span>DATA VISUALISATION</span><i>{"//"}</i><span>RESPONSIVE UI</span><i>{"//"}</i><span>WEB APIs</span><i>{"//"}</i>
          <span>REACT</span><i>{"//"}</i><span>TYPESCRIPT</span><i>{"//"}</i><span>NEXT.JS</span><i>{"//"}</i>
          <span>DATA VISUALISATION</span><i>{"//"}</i><span>RESPONSIVE UI</span><i>{"//"}</i><span>WEB APIs</span><i>{"//"}</i>
        </div>
      </div>

      <section className={styles.section} id="work">
        <SectionHeading index="01" eyebrow="SELECTED_WORK" title="Interfaces built for real complexity." />
        <div className={styles.projects}>
          {projects.map((project) => (
            <article className={styles.project} key={project.id}>
              <div className={styles.projectCopy}>
                <div className={styles.projectIndex}>
                  <span>{project.index}</span>
                  <span>{project.year}</span>
                </div>
                <p className={styles.projectType}>{project.type}</p>
                <h3>{project.title}</h3>
                <p className={styles.projectSummary}>{project.summary}</p>
                <ul className={styles.projectHighlights}>
                  {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <ul className={styles.tags} aria-label={`${project.title} technologies`}>
                  {project.stack.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className={styles.projectFooter}>
                  <span>{project.metric}</span>
                  {"href" in project ? (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      View live project <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className={styles.caseStudyPending}>CASE STUDY / INCOMING</span>
                  )}
                </div>
              </div>
              <ProjectVisual visual={project.visual} />
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.experienceSection}`} id="experience">
        <SectionHeading index="02" eyebrow="EXPERIENCE_LOG" title="From requirements to shipped UI." />
        <div className={styles.experienceLayout}>
          <p className={styles.sectionIntro}>
            A frontend-focused engineer with a software engineering foundation,
            product analysis experience and a habit of learning through ambitious interfaces.
          </p>
          <div className={styles.timeline}>
            {experience.map((item, index) => (
              <article key={item.company} className={styles.timelineItem}>
                <div className={styles.timelineMarker}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <div className={styles.timelineMeta}>
                  <span>{item.period}</span>
                  <span>{item.location}</span>
                </div>
                <div className={styles.timelineBody}>
                  <h3>{item.company}</h3>
                  <p>{item.role}</p>
                  <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="capabilities">
        <SectionHeading index="03" eyebrow="CAPABILITY_MATRIX" title="Code, craft and product thinking." />
        <div className={styles.capabilityGrid}>
          {capabilities.map((group) => (
            <article key={group.index} className={styles.capabilityCard}>
              <div className={styles.capabilityTop}>
                <span>[{group.index}]</span>
                <i aria-hidden="true" />
              </div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className={styles.educationBlock}>
          <div>
            <span className={styles.miniLabel}>EDUCATION / VERIFIED</span>
            <h3>Software engineering foundation.<br />Product-focused execution.</h3>
          </div>
          <div className={styles.educationList}>
            {education.map((item) => (
              <article key={item.school}>
                <span>{item.period}</span>
                <div><h4>{item.school}</h4><p>{item.degree}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.labSection}`} id="lab">
        <div className={styles.labCopy}>
          <div className={styles.sectionCode}><span>04</span><span>{"//"}</span><span>AERO_LAB</span></div>
          <h2>
            <Decode text="The portfolio has" />
            <br />
            <Decode text="a Frutiger Aero operating system." />
          </h2>
          <p>
            A hand-built lab of Y2K-era interfaces — glassy Aero chrome, gel
            buttons, reflections and drag-and-drop window management, all
            engineered from scratch. Windows 7 is the first build; XP and
            Windows 98 shells are next.
          </p>
          <div className={styles.labActions}>
            <Link className={styles.primaryButton} href="/desktop">Launch the Aero lab <span>↗</span></Link>
            <Link href="/oobe">Open résumé setup</Link>
            <Link href="/demo">View Aero components</Link>
          </div>
        </div>
        <div className={styles.labPreview} aria-hidden="true">
          <div className={styles.labWindowBack}><span /></div>
          <div className={styles.labWindow}>
            <div className={styles.labTitlebar}>
              <span><i>✧</i> Aero Lab.exe</span>
              <b><i>—</i><i>□</i><i>×</i></b>
            </div>
            <div className={styles.labBody}>
              <div className={styles.labOrb}>✧</div>
              <div>
                <span>STATUS</span>
                <strong>AERO SYSTEM ONLINE</strong>
                <p>Drag · resize · minimise · explore</p>
              </div>
              <div className={styles.labProgress}><span /></div>
            </div>
          </div>
          <div className={styles.labTaskbar}><b>✧</b><i /><i /><span>10:07 PM</span></div>
        </div>
      </section>

      <section className={styles.contact} id="contact">
        <div className={styles.contactTopline}>
          <span>05 // CONTACT_PROTOCOL</span>
          <span>CHANNEL: OPEN</span>
        </div>
        <p>Have a role, a product,<br />or a difficult interface?</p>
        <h2>
          <Decode text="LET'S BUILD" />
          <br />
          <span className={styles.contactOutline}><Decode text="SOMETHING CLEAR." /></span>
        </h2>
        <div className={styles.contactActions}>
          <a href={`mailto:${profile.email}`}>{profile.email} <span>↗</span></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub · zizhenliu0427 <span>↗</span></a>
          <a href={profile.githubSecondary} target="_blank" rel="noreferrer">GitHub · Fairchild2333 <span>↗</span></a>
          <span>RÉSUMÉ PDF / UPDATE INCOMING</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 ZIZHEN LIU</span>
        <span>DESIGNED + ENGINEERED IN SYDNEY</span>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
