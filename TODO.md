# Portfolio TODO

> Direction updated 2026-07-10. The main product remains the technology
> portfolio at `/`, but its next visual iteration is a Matrix-inspired hacker
> interface. Windows 7 is preserved as a lab. This planning update changes only
> `TODO.md` and `HANDOFF.md`; it does not authorise replacing the user's current
> implementation.

Legend: `[x]` done · `[~]` partial / intentionally deferred · `[ ]` to do

## Safety baseline — applies to every priority

These are release safeguards, not competing product priorities.

- [ ] Read the latest worktree and diff before editing; the portfolio, Win7,
      Flip 3D, mobile rotate gate and Cloudflare/OpenNext work are uncommitted.
- [ ] Checkpoint the current work without losing untracked files, especially
      `src/components/flip3d.ts`, `src/components/RotateGate.tsx`,
      `src/app/page.module.css`, `src/data/` and deployment configuration.
- [ ] Preserve `/desktop`, `/oobe` and `/demo`; regress these routes after every
      substantial main-site or global-style change.
- [ ] Keep 7.css, future XP.css and future 98.css route-scoped. Never allow their
      generic selectors to leak into `/` or into one another.
- [ ] Distinguish an earlier successful check from a fresh verification after
      user edits. Do not carry old `[x]` test results forward without checking.

## Current implementation snapshot

- [x] Replace the create-next-app root with a recruiter-facing, data-driven
      portfolio.
- [x] Add Hero, Selected Work, Experience, Capabilities, Education, Lab and
      Contact sections.
- [x] Keep portfolio data in the typed `src/data/portfolio.ts` source.
- [x] Add responsive rules at 1180px, 860px and 620px, fluid `clamp()` sizing,
      a horizontally scrollable narrow navigation and stacked mobile layouts.
- [x] Add keyboard focus states, semantic landmarks and a skip link.
- [x] Add a `prefers-reduced-motion` static path for the main portfolio.
- [x] Add a portrait touch-device rotate gate to the Win7 lab.
- [x] Reskin `/` to the Matrix-inspired direction: phosphor-green token palette,
      canvas code-rain layer and dark-green surfaces (2026-07-11).
- [x] Second Matrix pass (2026-07-11, user request): boot-sequence intro,
      decode/scramble headings and terminal component styling. The boot intro
      deliberately deviates from the earlier "no boot sequence" constraint at
      the owner's request, but stays non-blocking: `pointer-events: none`,
      ~2s pure-CSS auto-fade that works without JavaScript, hidden under
      `prefers-reduced-motion`, and shown once per session.
- [x] Fix code-rain ghosting: the bright head glyph is now erased and settled
      into the trail as the same character instead of having a second random
      glyph drawn over it.
- [x] Third Matrix pass (2026-07-11, user feedback "not Matrix enough"): CRT
      operator-terminal redesign. Display typography moved to phosphor-green
      Geist Mono with layered bloom text-shadows; CRT ambient layers added
      (dark scanlines + RGB screen-door mask, vignette, slow sweep band,
      low-amplitude tube flicker — sweep/flicker off on coarse/small devices);
      terminal chrome details (green panel squares instead of traffic-light
      dots, ">_" prompt on the secondary action, bracketed text links).
      98.css was considered and rejected for `/` — Win98 chrome is the Y2K lab
      language, reserved for `/labs/98` in Priority 3.
- [x] Sync the project archive with the live GitHub accounts (2026-07-11):
      added Novacart, Lanely, Whale Logistics CMS, Audio/Video2Text AI,
      Breaktime Arcade, HLS Keeper and Bili CDN DNS Pin — 19 entries total.
      sdr2hdr and this portfolio itself now link to their public repos instead
      of reading CODE PRIVATE; the “here” badge supports an optional source
      link.
- [~] Win7 mobile support is not fully responsive: portrait touch devices are
      asked to rotate and the fixed desktop canvas then runs in landscape.
- [x] Preserve the existing Windows 7/Aero experience and its OOBE/demo routes.

## Priority 1 — Matrix-inspired technology portfolio

The direction is inspired by the visual language of *The Matrix*, not a clone
and not an official branded site. The recruiter journey and readability remain
more important than spectacle.

### Visual direction

- [x] Audit the latest `/` before implementation and record which current
      components, content and responsive behaviours can stay unchanged.
      (2026-07-11: all structure, content and breakpoints kept; only colour
      tokens, ambient layers and metadata changed.)
- [x] Replace the current cyan/violet-heavy mood with a controlled palette:
      near-black surfaces, phosphor green accents and off-white/grey body text.
- [x] Define tokens for background, foreground, muted text, terminal green,
      borders, glow, focus, success/warning states, spacing and motion.
      (Colour tokens in `page.module.css`; 2026-07-11 pass added motion tokens
      `--t-fast/--t-base/--t-mid/--t-slow/--ease/--ease-out` and spacing tokens
      `--gutter/--gutter-md/--gutter-sm` to `page.module.css` and
      `subpage.module.css`, replacing the repeated transition/gutter literals.
      One-off animation choreography keeps literal durations by design.)
- [x] Explore a lightweight code-rain or falling-glyph layer, terminal prompts,
      scanlines, grid traces, blinking cursors and code annotations.
      (`src/components/MatrixRain.tsx`: DPR-scaled canvas, throttled rAF,
      translucent-fill trails, katakana/digit glyphs with bright head.)
- [x] Keep decorative effects behind the content, non-interactive and hidden
      from assistive technology. (Rain canvas is `aria-hidden` inside the
      pointer-events-none fixed ambient layer at `z-index: -2`.)
- [x] Preserve the current page hierarchy: identity and role first, then work,
      experience, capabilities/education, lab and contact.
- [x] Redesign the Hero, navigation, project visuals, section dividers, Contact
      and Lab teaser as one coherent system rather than adding isolated effects.
      (Single token remap across every section; the Aero window preview in the
      Lab teaser intentionally keeps its Frutiger Aero blues as the doorway to
      the Win7 lab.)
- [x] Avoid copyrighted film stills, logos, dialogue, fonts and ripped assets;
      produce an original hacker/cyber visual system.
- [x] Update metadata theme colour and the Open Graph image after the new visual
      direction is approved. (Theme colour `#030806`; `public/og.png`
      regenerated 2026-07-11 as a 1200×630 phosphor/CRT card — bloomed name,
      code-rain, scanlines — and the layout OG metadata updated to 1200×630.)

### Responsive, motion and performance requirements

- [x] Design desktop, tablet and mobile states before implementing the reskin.
      (Existing 1180/860/620px states were audited first and preserved; the
      reskin changed colour and decoration only.)
- [x] Re-test at 320, 360, 390, 768, 1024 and 1440px after the Matrix pass.
      (2026-07-11 browser pass: `scrollWidth` equals viewport at every width and
      no content element exceeds the viewport; only the intentionally bleeding
      grid/glow/marquee decor layers do, inside clipped containers.)
- [ ] Check iOS Safari and Android Chrome, not only a resized desktop browser.
- [x] Do not use `overflow-x: clip` as proof that nothing is overflowing; inspect
      large headings, code lines, project visuals and the horizontal nav.
      (Verified via per-element `getBoundingClientRect` at each width.)
- [x] Keep all core actions usable without hover and provide roughly 44px touch
      targets where practical. (Carried over from the pre-reskin implementation.)
- [x] Reduce or disable code rain, blur, backdrop filters, scanlines and large
      shadows on small/coarse-pointer or lower-powered devices. (Rain drops to
      16fps, larger glyph grid and 0.3 opacity on coarse-pointer/sub-768px
      viewports; other effect reductions unchanged from the previous pass.)
- [x] Stop continuous decorative motion under `prefers-reduced-motion` while
      leaving all information and navigation visible. (Global reduce rule plus a
      static single-frame glyph scatter in `MatrixRain`.)
- [x] Keep body text contrast and line length readable; phosphor green should be
      an accent, not the colour of every paragraph. (Body copy is off-white/
      grey-green; phosphor green marks labels, actions and state only.)

### Priority 1 acceptance

- [x] The first viewport states Zizhen's name, target role, Sydney location,
      availability and primary work/contact action.
- [x] 320px and 390px layouts have no unintended horizontal scrolling,
      clipping, overlap or unreadable terminal text. (Desktop-browser check;
      real-device confirmation still listed above.)
- [x] The page remains complete with animation disabled and by keyboard only.
      (All content is static DOM; rain/marquee/grid are decoration only.)
- [x] Decorative glyphs are not announced by screen readers. (`aria-hidden`
      ambient layer and canvas.)
- [x] The visual result feels unmistakably hacker/Matrix-inspired while still
      functioning as a professional portfolio.
- [x] `/desktop`, `/oobe` and `/demo` remain intact. (Regressed 2026-07-11:
      desktop icons/windows/taskbar, OOBE wizard and demo playground all render
      with their Aero styling untouched.)

## Priority 2 — more resume, projects, work and personal story

> 2026-07-11: first major P2 pass landed. All 14 domain resumes were extracted
> and synthesised; positioning moved from "Frontend Engineer" to full-stack
> ("interface → server & data → metal"). New pages: `/projects` (12-entry
> archive with honest access labels — LIVE / SOURCE / NDA / CODE PRIVATE /
> IN DEVELOPMENT) and `/about` (home lab, photography, automotive, languages,
> education records). IT-support career content deliberately stays off the
> site; its home-lab side lives on `/about`.
> Same day: `/projects` gained a domain filter (ALL/WEB/AI-ML/SYSTEMS/
> HARDWARE/MOBILE/LAB) — the picked domain's entries pin to the top, the rest
> dim below; deep-linkable via URL hash (`/projects#web`, `#ai-ml`, …).
> 2026-07-11 (later): archive synced against both GitHub accounts — seven
> public repos added, now 19 entries; stale CODE PRIVATE labels fixed.

### Source material and data

- [~] Add the latest resume PDF and confirm the real GitHub, LinkedIn, email,
      live-project and source-code URLs. (GitHub ×2 + LinkedIn confirmed and
      live; resume PDF still pending — owner to choose which version.)
- [~] Expand the shared typed content model for `profile`, `projects`,
      `experience`, `internships`, `education`, `skills`, `interests` and
      `photography` instead of duplicating copy in presentation components.
      (`archive`, `interests`, `education.courses`, `profile.tagline/linkedin`
      added; `photography` gallery data still pending real photos.)
- [~] Verify dates, titles, locations, qualifications, metrics and publication
      permission before making them public. (All content sourced from the
      owner's own resumes; NDA projects labelled, no confidential code linked.)
- [x] Keep the schema translation-ready, but do not block this content milestone
      on the later i18n implementation.

### Professional content

- [ ] Keep three strongest projects prominent on `/` and add a way to browse
      the wider project archive.
- [ ] Give each major project a case-study structure: problem, audience, role,
      constraints, technical decisions, contribution, result, stack and links.
- [ ] Add real screenshots or lightweight demos for Sensor Analytics, CMO-DB,
      CTV and other selected work.
- [ ] Expand work and internship history with clear organisation, role, dates,
      location and impact-first bullets.
- [ ] Expand education details for UNSW, UTS and any relevant awards,
      coursework or activities that strengthen the story.
- [ ] Add a visible Resume action once the current PDF exists.
- [ ] Decide whether long-form content belongs in `/projects/[slug]` pages or a
      smaller expandable archive after the source material is collected.

### Interests and visual work

- [ ] Add a personal section after the professional story for photography,
      computers/hardware and cars.
- [ ] Create a photography/HDR gallery with captions, dates/locations where
      appropriate, descriptive alt text and an optional before/after treatment.
- [ ] Include PC building, hardware, setup or homelab stories that show genuine
      long-term technical curiosity.
- [ ] Present automotive interest as a concise personal signal, with original or
      licensed media only.
- [ ] Optimise all media to responsive AVIF/WebP where appropriate; prevent the
      gallery from delaying the main first viewport.
- [ ] Review privacy, copyright, EXIF/location data and third-party branding
      before publishing photos.

### Priority 2 acceptance

- [ ] A visitor can understand what Zizhen did, why it mattered and what changed
      for every featured project.
- [ ] Resume, education, employment and internships are complete and internally
      consistent.
- [ ] No false CTA, placeholder URL or unexplained `coming soon` appears.
- [ ] Interests add personality without pushing the professional evidence below
      the core recruiter journey.
- [ ] Photography works on mobile, has useful alt text and does not compromise
      first-load performance.
- [ ] Modern and retro presentations consume the same portfolio facts.

## Priority 3 — Y2K lab family with XP.css and 98.css

Y2K is the umbrella direction for the experimental OS interfaces. Win7 remains
the first existing lab; XP and Windows 98 become distinct route-scoped builds.

- [ ] Add `/labs` as the experiment index and keep the current Win7 entry.
- [ ] Decide whether a standalone non-OS Y2K page is useful; do not create one by
      default if the XP/98 labs already express the idea.
- [ ] Prototype `/labs/xp` with [XP.css](https://github.com/botoxparty/XP.css).
- [ ] Prototype `/labs/98` with [98.css](https://github.com/jdan/98.css).
- [ ] Record and comply with the libraries' licences; use legally reusable
      wallpapers, icons, sounds and fonts.
- [ ] Give each first release About, Projects, Experience/Skills, Education,
      Resume and Contact surfaces backed by the shared content.
- [ ] Implement only the core shell interactions first: open, focus, move,
      minimise and close, plus an appropriate start/taskbar surface.
- [ ] Provide keyboard, touch and small-screen stacked fallbacks; do not require
      double-click or precision mouse input to read the portfolio.
- [ ] Reuse window-management code only after a genuinely repeated abstraction
      appears; visual CSS must remain isolated per lab.
- [ ] Keep deep OS simulation, games, boot sequences and Flip 3D-like spectacle
      out of the initial XP/98 scope.

### Priority 3 acceptance

- [ ] `/`, Win7, XP and 98 do not leak styles into one another.
- [ ] Each lab exposes the same essential portfolio content and real contact
      paths even when its decorative interaction is unavailable.
- [ ] The main `/` route remains the Matrix-inspired professional portfolio,
      never an OS simulator.

## Priority 4 — English / 中文 i18n

- [ ] Use English (`en-AU`) as the default recruiter-facing locale and add
      Simplified Chinese (`zh-CN`).
- [ ] Choose a stable URL strategy such as `/en/...` and `/zh-CN/...`; do not
      rely only on client state or IP detection.
- [ ] Make the language switch preserve the current page and, where possible,
      the current section/anchor.
- [ ] Translate navigation, Hero, projects, experience, internships, education,
      interests, photography captions, contact, UI states and accessible labels.
- [ ] Localise `<html lang>`, titles, descriptions, Open Graph metadata,
      canonical URLs and `hreflang` relationships.
- [ ] Format dates, locations and punctuation with locale-aware helpers.
- [ ] Define the Lab translation boundary explicitly: portfolio content must be
      translated; simulated OS chrome may retain era-appropriate language only
      when intentional and accessible.
- [ ] Add missing-key checks and a documented fallback locale.
- [ ] Repeat responsive checks in both languages; Chinese and English text have
      different wrapping and density.

### Priority 4 acceptance

- [ ] Direct visits, refreshes and internal navigation work for both locales
      without waiting for client hydration to reveal the main content.
- [ ] Switching language does not send the visitor back to an unrelated page.
- [ ] Neither locale contains large accidental mixed-language blocks or missing
      translation keys.
- [ ] Search engines can identify the relationship between the two versions.

## Later TODO — after priorities 1–4

### Quality, SEO and deployment

- [ ] Run fresh lint, typecheck and production builds after the current user
      changes; resolve any result instead of relying on an earlier pass.
- [ ] Add focused tests for navigation, key content, locale routing and critical
      external links.
- [ ] Add CI for lint, typecheck, tests and build.
- [ ] Run accessibility, keyboard, console-error, responsive and performance
      audits for every public route.
- [ ] Add canonical metadata, sitemap and robots after the production domain is
      final; regenerate the OG image for the Matrix direction.
- [ ] Verify the current Cloudflare/OpenNext configuration and public headers;
      record one supported deployment path before production release.
- [ ] Replace copyrighted/local-only Windows assets before public deployment.

### Win7 and Flip 3D improvements

- [ ] Turn the current Win7 landscape gate into a real small-screen fallback if
      the lab is expected to be fully usable on phones.
- [ ] Limit the rotate gate so large portrait touch devices are not blocked
      unnecessarily.
- [ ] Test landscape windows, taskbar, dragging and Flip 3D on small phones and
      tablets.
- [ ] Fix the one-frame Flip 3D height-measurement race.
- [ ] Avoid unnecessary `measuredH` updates when an explicit window height is in
      use.
- [ ] Move viewport measurements out of render and centralise desktop/window
      Flip 3D geometry in shared helpers.
- [ ] Extract the repeated modular depth calculation into a named helper.

### Other experiments

- [ ] Consider a CMS, custom contact backend or heavier 3D only when real content
      volume demonstrates a need.
- [ ] Avoid long loaders, scroll hijacking and core interactions that work only
      with a custom cursor.

### Classic Mac / macOS lab — final priority

- [ ] Start only after priorities 1–4 and the Win7/XP/98 lab family are stable.
- [ ] Choose the target era first: Classic Macintosh/System 6, Mac OS 9 Platinum
      or modern macOS.
- [ ] Prefer [system.css](https://github.com/sakofchit/system.css) for a Classic
      Macintosh build; treat modern macOS clones as references, not copy sources.
- [ ] Reuse shared content while keeping Mac assets and styles isolated and
      properly licensed.
