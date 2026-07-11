# Portfolio direction handoff

> Updated: 2026-07-11  
> Status: Priority 1 (Matrix CRT reskin) is complete on desktop-browser
> evidence — only real-device iOS/Android checks remain. Priority 2 has landed
> its first passes: full-stack repositioning, `/projects` (19 entries, synced
> with both GitHub accounts) and `/about`. All work is committed up to
> `74b2385`.

## 1. Current decision

The main product remains a recruiter-facing technology portfolio at `/`. Its
next iteration should move from the current cyan/violet technical-editorial look
to an original Matrix-inspired hacker aesthetic: near-black surfaces, phosphor
green signals, terminal/code language and optional digital-rain atmosphere.

The exact implementation order is:

| Order | Workstream | Outcome |
| --- | --- | --- |
| 1 | Matrix-inspired main portfolio | Re-theme and refine `/` without losing clarity, responsiveness or the current content structure |
| 2 | Resume and personal-content expansion | More projects, work, internships, education, photography/HDR, computers and cars |
| 3 | Y2K retro labs | Preserve Win7, then add distinct XP.css and 98.css interfaces |
| 4 | English / 中文 i18n | `en-AU` and `zh-CN` content, routing and metadata |
| Later | Quality and experiments | CI, deeper audits, Win7/Flip 3D improvements and optional ideas |
| Last | Classic Mac / macOS | Consider only after the priorities above are stable |

Quality and worktree-preservation checks apply continuously. They are safety
gates, not permission to reorder the four product workstreams.

### Progress as of 2026-07-11

- Priority 1 shipped in three passes (palette/code-rain → boot intro + decode
  headings → CRT operator terminal), then closed out with motion/spacing
  tokens (`--t-*`, `--ease*`, `--gutter*`) and a regenerated 1200×630 phosphor
  OG image. Outstanding: real iOS Safari / Android Chrome verification.
- Priority 2 so far: full-stack positioning, `/projects` domain-filter archive
  synced against both GitHub accounts (19 entries; stale CODE PRIVATE labels
  fixed, sdr2hdr + this site now link SOURCE) and `/about`. Next: resume PDF
  (a TeX `resume` repo exists under Fairchild2333), case studies, project
  screenshots, photography gallery.
- Checkpoints: `dbb05f4` (P2 pages) and `74b2385` (P1 close-out + GitHub
  sync).

## 2. Boundaries that must not be broken

- Do not replace the latest user files with an earlier generated version. Read
  the current worktree and diff before every implementation session.
- Preserve the current Windows 7/Aero work and the `/desktop`, `/oobe` and
  `/demo` routes.
- Preserve all untracked supporting files when checkpointing, including
  `src/components/flip3d.ts`, `src/components/RotateGate.tsx`,
  `src/app/page.module.css`, `src/data/`, the Open Graph image and deployment
  configuration.
- The main `/` route stays a professional portfolio. Win7, XP, 98 and any future
  Mac interface remain optional labs.
- Keep 7.css, XP.css and 98.css route-scoped so their generic selectors cannot
  alter the main site or another lab.
- Shared facts should have one typed source; themes may change presentation, not
  maintain contradictory resumes.

## 3. Current repository snapshot

### Main portfolio

`/` is no longer the create-next-app starter. It currently contains:

- a recruiter-focused Hero with identity, role, Sydney location, work status and
  calls to work/contact;
- Selected Work, Experience, Capabilities, Education, Aero Lab and Contact
  sections;
- typed shared content from `src/data/portfolio.ts`;
- a dedicated CSS module with responsive states, animation fallbacks and
  technical visual effects;
- project and lab links plus portfolio metadata/Open Graph work.

The current page structure is a strong base for a visual reskin. The Matrix pass
should generally update tokens, surfaces, decoration and component treatments
instead of deleting the working information architecture.

### Recent user work

> 2026-07-11: the work below has since been committed; kept for context.

The current worktree cannot precisely separate every user edit from earlier
generated work because the technology portfolio has not been checkpointed. File
state and timestamps indicate the later edits are concentrated around:

- Win7 Aero Peek and Flip 3D interaction;
- `RotateGate.tsx` and root-overflow handling for portrait touch devices;
- updated Aero/Y2K wording in the main Lab teaser and `/desktop` metadata;
- OpenNext/Cloudflare scripts and configuration, public headers and related
  package changes.

Do not assume those changes are disposable or regenerate their files wholesale.

### Existing lab routes

| Route | Current role | Rule |
| --- | --- | --- |
| `/desktop` | Windows 7/Aero desktop and window manager | Preserve; future mobile work must not remove desktop interaction |
| `/oobe` | Aero resume/setup walkthrough | Preserve and eventually feed from shared content |
| `/demo` | Aero component playground | Preserve as an engineering/design-system lab |
| `/labs` | Future experiment index | Add in Priority 3 |
| `/labs/xp` | Future XP.css portfolio shell | Priority 3 |
| `/labs/98` | Future 98.css portfolio shell | Priority 3 |

No standalone `/labs/y2k` route is required yet. “Y2K” is the umbrella visual
family unless a distinct concept later proves useful.

## 4. Responsive status — accurate scope

### Main `/` route: responsive

The current technology portfolio has a real responsive implementation:

- the page root uses full width, `100svh` and horizontal clipping;
- fluid type and spacing use `clamp()`;
- at 1180px the 12-column Hero becomes a single-column composition and the
  profile/Lab layouts reflow;
- at 860px navigation becomes a scrollable second row and projects, experience
  and education stack;
- at 620px gutters shrink, Hero actions become full width, facts/capabilities/
  timeline/contact/footer become mobile columns and the code panel compresses;
- hover-only effects are guarded by `@media (hover: hover)`;
- `prefers-reduced-motion` stops non-essential animation.

An earlier 390px browser check found no horizontal overflow, and the user's later
work did not materially change the main CSS module. That is evidence of a solid
baseline, not a substitute for a fresh test after the Matrix reskin.

### Win7 `/desktop` route: landscape gate, not full responsive reflow

`RotateGate.tsx` is mounted by `Win7Desktop`. A media query covers portrait
devices with a coarse primary pointer and asks the user to rotate. In landscape,
the fixed desktop/window-manager canvas runs normally.

This is useful mobile handling, but it is not a true phone layout. Known limits:

- portrait tablets and other large touch devices can also be blocked because the
  gate has no maximum width;
- a small phone in landscape still needs interaction testing for windows,
  taskbar, drag targets and Flip 3D;
- there is no stacked/read-only mobile shell when landscape space is inadequate.

### Next responsive test matrix

After the Matrix visual work, verify 320, 360, 390, 768, 1024 and 1440px, plus
representative iOS Safari and Android Chrome devices. Check:

- unintended overflow hidden by `overflow-x: clip`;
- very large Hero/Contact text and nowrap terminal/code rows;
- horizontal-nav discoverability and future Chinese labels;
- touch target size and interactions that currently imply hover;
- project media height and total page length on phones;
- performance cost from fixed backgrounds, blur, backdrop filters, scanlines,
  marquee, code rain and large shadows;
- reduced-motion and a low-effects path for coarse-pointer/small screens.

## 5. Priority 1 brief — Matrix-inspired main site

### Intended visual language

- near-black background with layered black/green surfaces;
- phosphor or terminal green for state, focus, borders and selected highlights;
- off-white/grey for long-form reading;
- lightweight falling glyphs or code rain, grid traces, terminal prompts,
  scanlines, cursors and system annotations;
- controlled bloom/glow rather than uniform neon;
- confident identity typography and project evidence kept above decoration.

This is an original “hacker/cyber terminal” interpretation. Do not use film
stills, official Matrix logos, copied dialogue, proprietary fonts, ripped audio
or other copyrighted media. The inspiration should be recognisable through
design grammar rather than copied assets.

### Product constraints

- The first viewport still answers who Zizhen is, the target role, location,
  availability and what action to take.
- Do not hide content behind a boot sequence, long loader, custom cursor, scroll
  hijacking or animation completion.
- Falling glyphs and scanlines are decorative, `aria-hidden`, non-interactive and
  visually behind the content.
- Green is an accent. Body copy must retain comfortable contrast and line length.
- Reduced-motion stops continuous effects; mobile/low-power modes also reduce
  expensive filters, not just keyframe animation.
- Complete the reskin as a coherent system: Hero, header, project treatments,
  section language, Lab teaser, Contact, focus/hover and OG artwork.

### Completion gate

The Matrix pass is done when the main site has one coherent visual identity,
passes fresh responsive/keyboard/reduced-motion checks, preserves the recruiter
story, and leaves all Aero routes working.

## 6. Priority 2 brief — deeper portfolio content

The professional story should become richer before more theme engineering. The
home page keeps a curated set; deeper pages or archives carry the detail.

### Content to collect

- latest resume PDF;
- verified email, GitHub, LinkedIn, live URLs and source links;
- full work and internship history with dates, roles, locations and defensible
  impact statements;
- complete UNSW, UTS and relevant education details;
- more projects, screenshots, constraints, technical decisions and results;
- original photography/HDR images and captions;
- material about PC building, hardware/homelab interests and cars.

### Proposed information architecture

- Hero and concise profile
- Selected Work
- All Projects or `/projects/[slug]` case studies
- Experience and Internships
- Skills/Capabilities
- Education
- About and Interests
- Photography/HDR gallery
- Aero/Y2K Labs
- Resume and Contact

Interests belong after the core professional evidence. They should make the
portfolio memorable without diluting its job-search purpose.

### Shared content/media model

Extend the typed source with domains such as `profile`, `socialLinks`,
`projects`, `experience`, `internships`, `education`, `skills`, `interests` and
`photography`. Every project should be able to express problem, audience, role,
decisions, result, stack, media, live/source links and translation keys later.

Images need responsive sizes, AVIF/WebP where suitable, meaningful alt text,
captions, ownership/licence notes and privacy review. Strip or consciously keep
EXIF/location data; do not let a gallery delay the first viewport.

### Completion gate

Resume, employment, internships and education are internally consistent; every
featured project explains contribution and outcome; real links work; personal
interests enrich rather than dominate; and all themes read the same facts.

## 7. Priority 3 brief — Y2K, XP.css and 98.css

Build a `/labs` index that preserves Win7 and introduces XP and Windows 98 as
separate interfaces:

- XP: `/labs/xp`, using [XP.css](https://github.com/botoxparty/XP.css)
- Windows 98: `/labs/98`, using [98.css](https://github.com/jdan/98.css)

The first version of each should be intentionally smaller than the Win7 lab:
About, Projects, Experience/Skills, Education, Resume and Contact; core window
open/focus/move/minimise/close behaviour; an era-appropriate start/taskbar
surface; and keyboard/touch/small-screen access.

Use the libraries according to their licences and source all wallpaper, icons,
fonts and sound legally. Do not begin with filesystem simulation, boot sequences,
games or spectacle. Route-scoped CSS and shared portfolio data are mandatory.

### Completion gate

Win7, XP and 98 are independently usable, do not leak styles, expose the same
essential portfolio facts and never replace `/` as the main experience.

## 8. Priority 4 brief — English / 中文 i18n

Use `en-AU` as the default and add `zh-CN`. Decide locale routing before adding
translations; locale-prefixed, directly addressable URLs are preferable to a
client-only toggle. Do not infer language from IP.

The language switch should retain the current page/section. Localise main
content, navigation, UI states, accessible labels, dates, metadata, canonical
URLs, `hreflang` and Open Graph data. Set the document `lang` correctly. Define a
fallback locale and fail checks on missing keys.

Portfolio content inside Labs must be translatable. Simulated OS chrome can keep
era-appropriate terminology only when this is intentional and does not make the
content inaccessible. Both languages require independent responsive checks,
especially navigation and long English/Chinese wrapping differences.

### Completion gate

Both locale URLs render useful server content directly, refresh correctly, keep
the visitor's route during language switching, contain no large accidental
mixed-language areas and expose their relationship to search engines.

## 9. Later backlog

Only after the four product priorities:

1. add focused tests and CI, complete SEO/deployment configuration, and run full
   accessibility/performance audits;
2. improve Win7 small-screen behaviour beyond the orientation gate and clean up
   the recorded Flip 3D geometry/measurement issues;
3. consider optional CMS, contact backend or heavier interactive experiments
   only when content needs justify them;
4. consider a Classic Macintosh/System 6, Mac OS 9 Platinum or modern macOS lab
   last. `system.css` is a possible Classic Mac base; modern clones are references,
   not sources to copy.

## 10. Next implementation-session checklist

1. Read `git status`, the current diff and all new/untracked files. Do not
   start from an earlier snapshot.
2. Run the outstanding P1 real-device checks (iOS Safari, Android Chrome) when
   hardware is available and log the result in TODO.md.
3. Continue Priority 2: pick the resume PDF (TeX source exists), define the
   case-study structure, collect screenshots and photography selects.
4. Then open Priority 3 with the `/labs` index; keep XP.css/98.css
   route-scoped.
5. Regress `/desktop`, `/oobe` and `/demo` after any global change.

The active task list in [TODO.md](TODO.md) is authoritative for execution order.
