# Portfolio TODO

> Scope reset: 2026-07-21.
> The current site is the stable baseline. The next product milestone is a
> cinematic exterior-to-computer entrance that hands off seamlessly to an
> evolved Matrix-inspired portfolio. This file authorises planning and ordered
> implementation only; it does not authorise discarding current user changes.

Legend: `[x]` done · `[~]` partial / deferred · `[ ]` to do

## Safety baseline — applies to every phase

- [ ] Read the latest worktree and diff before editing.
- [ ] Preserve the current user edits in `README.zh-CN.md`,
      `src/app/page.tsx`, `src/app/page.module.css` and
      `src/data/portfolio.ts` unless the requested work explicitly overlaps.
- [ ] Preserve `/desktop`, `/oobe` and `/demo`; regress them after global-style
      or navigation changes.
- [ ] Keep 7.css, future XP.css and future 98.css styles route scoped.
- [ ] Maintain an immediately readable static path when video/GPU effects fail.
- [ ] Treat old browser checks as historical evidence, not fresh verification.

## Current baseline

- [x] Replace the starter with a recruiter-facing, data-driven portfolio.
- [x] Add Hero, Selected Work, Experience, Capabilities, Education, Lab and
      Contact sections.
- [x] Add `/projects` with 20 entries and `/about` with supporting personal
      context.
- [x] Keep shared portfolio facts in `src/data/portfolio.ts`.
- [x] Add responsive layouts, keyboard focus, semantic landmarks and a skip
      link.
- [x] Add Matrix-inspired tokens, Canvas 2D glyph rain, CRT layers, decoded
      headings and a session-based non-blocking boot screen.
- [x] Add `prefers-reduced-motion` and low-power/coarse-pointer fallbacks.
- [x] Preserve the Windows 7/Aero desktop, OOBE and component demo routes.
- [x] Confirm a production build passes on 2026-07-21.
- [~] Win7 mobile support remains a landscape gate rather than a true small
      screen layout.
- [ ] Verify the current site on real iOS Safari and Android Chrome devices.

## Phase 0 — scope and cinematic pre-production

- [x] Choose the core narrative: Sydney exterior → building/window → personal
      workspace → computer → Matrix-inspired boot → real portfolio.
- [x] Choose pre-rendered video rather than a full real-time 3D building scene.
- [x] Choose a seamless same-page handoff rather than a route change/reload.
- [x] Choose a hybrid live visual: recognisable glyph rain evolving into
      spatial data streams.
- [x] Reserve WebGPU for an optional technical lab; prefer WebGL plus fallbacks
      on the main route.
- [x] Document the product scope and non-goals in `HANDOFF.md`.
- [x] Create the production brief in `docs/cinematic-entry-brief.md`.
- [ ] Lock the exact exterior location language: recognisable Sydney, invented
      Sydney-inspired skyline, or a location-neutral technology district.
- [ ] Lock the workspace art direction and personal props.
- [ ] Lock the monitor count, aspect ratios, camera endpoint and safe crop.
- [ ] Approve desktop and mobile storyboards before generating final video.
- [ ] Approve the exact boot copy and final live-Hero first frame.

### Phase 0 acceptance

- [ ] First and last keyframes are approved at desktop and mobile aspect ratios.
- [ ] The last monitor frame can match the real Hero without a visible jump.
- [ ] All props and architecture are original, owned or correctly licensed.
- [ ] The shot duration is at most nine seconds and contains a viable hidden-cut
      plan.

## Phase 1 — cinematic asset production

- [ ] Produce the locked final desk/monitor keyframe first.
- [ ] Produce exterior, window-transition and room-entry keyframes around the
      locked endpoint.
- [ ] Generate two or three controllable source clips rather than relying on one
      long AI generation.
- [ ] Hide joins behind window frames, dark occlusion, motion blur or a brief
      exposure/signal transition.
- [ ] Keep monitor screens blank, keyed or trackable during generation.
- [ ] Composite the real terminal boot and matching Hero frame in post.
- [ ] Correct structural morphing, disappearing props, inconsistent monitor
      geometry and unstable lighting.
- [ ] Export a desktop master, web delivery files and a final-frame poster.
- [ ] Produce either a dedicated mobile composition or an approved poster-first
      mobile fallback.
- [ ] Record generation tool, model, source-asset and commercial-use/licence
      information.

### Provisional delivery targets

- [ ] Desktop composition: 16:9, 1920×1080, 24 or 30 fps.
- [ ] Delivery: WebM plus MP4 fallback, muted, no mandatory audio track.
- [ ] Poster: optimised AVIF/WebP plus a broadly compatible fallback if needed.
- [ ] Duration: target about 7–8 seconds, hard maximum 9 seconds.
- [ ] Final approach: about one second of stable, near-front-facing monitor
      framing before takeover.
- [ ] Mobile: centre-safe composition and/or dedicated short portrait asset.

### Phase 1 acceptance

- [ ] The final edit reads as one continuous camera move without obvious AI
      discontinuities.
- [ ] The monitor endpoint is stable enough for screen replacement and takeover.
- [ ] Encoded assets meet the agreed visual-quality and transfer-size budgets.
- [ ] A poster fallback is visually complete on its own.

## Phase 2 — entry controller and seamless takeover

- [ ] Add the cinematic layer above the already-loaded home page.
- [ ] Start from the first frame, muted and `playsInline`; handle autoplay
      failure without blocking entry.
- [ ] Show a keyboard/touch accessible `SKIP INTRO` no later than one second.
- [ ] Store completion in `sessionStorage` so the full entrance plays once per
      browser session.
- [ ] Do not replay during normal internal navigation or browser back/forward.
- [ ] Implement the monitor-fill → CRT sync → live Hero handoff without a route
      transition.
- [ ] Ensure Skip and natural completion land in the same final DOM state.
- [ ] Absorb/retire the standalone `BootScreen` only after its role exists inside
      the monitor sequence.
- [ ] Preload only what is necessary; never hold the real page behind a video
      download.
- [ ] Use the poster and immediate entry when video playback or decoding fails.
- [ ] Under `prefers-reduced-motion`, skip the camera move and use a brief poster
      dissolve.
- [ ] Restore predictable keyboard focus and document scrolling after takeover.
- [ ] Prevent the decorative layer from being announced by screen readers.

### Phase 2 acceptance

- [ ] No white/black flash, layout jump or duplicate loader appears at handoff.
- [ ] Skip works immediately by keyboard and touch.
- [ ] Repeat visits do not replay the cinematic in the same session.
- [ ] Core identity, work and contact actions remain available without video.
- [ ] Slow connection, autoplay rejection and decode failure all enter the site
      cleanly.

## Phase 3 — spatial Matrix Hero

- [ ] Prototype a single WebGL canvas behind the semantic Hero.
- [ ] Preserve discrete falling glyphs in upper/distant layers.
- [ ] Add perspective depth and controlled parallax rather than flat full-screen
      rain.
- [ ] Make selected glyph streams accelerate, stretch and curve toward the Hero
      focal point or terminal.
- [ ] Allow trails to resolve back into legible glyphs so the effect remains
      Matrix-inspired.
- [ ] Keep phosphor green dominant; use cool cyan and amber only as sparse
      semantic signals.
- [ ] Avoid generic rainbow gradients and smooth fibre-optic SaaS visuals.
- [ ] Keep the current Canvas 2D rain as the WebGL fallback.
- [ ] Use one graphics context, lazy loading, deterministic cleanup and no global
      scroll listeners that run when unnecessary.
- [ ] Pause when offscreen or when `document.hidden` is true.
- [ ] Cap device-pixel ratio and reduce density/frame rate on mobile and low
      power devices.
- [ ] Provide a static CSS fallback and complete reduced-motion mode.

### Phase 3 acceptance

- [ ] The effect still reads as code/glyph rain before it reads as light trails.
- [ ] Text and calls to action remain clearer than the background.
- [ ] WebGL failure falls back automatically without an error surface.
- [ ] Desktop motion is smooth and mobile degradation is intentional.
- [ ] No additional graphics context remains alive after route changes.

## Phase 4 — motion system and project evidence

- [ ] Define one shared motion vocabulary for Hero, sections, headings, project
      media and links.
- [ ] Add restrained scroll-driven reveals without scroll hijacking.
- [ ] Prototype sticky-stacking Selected Work cards and retain a simple mobile
      flow.
- [ ] Replace or supplement abstract project visuals with real screenshots or
      short recordings for the strongest three to five projects.
- [ ] Add media masks/scans that belong to the terminal system rather than a
      generic portfolio template.
- [ ] Add subtle magnetic/pointer interactions only where keyboard/touch states
      remain equivalent.
- [ ] Keep continuous background effects subordinate to project evidence.
- [ ] Re-test the complete motion stack under reduced motion and coarse pointer.

### Phase 4 acceptance

- [ ] Scrolling feels intentionally paced without delaying reading.
- [ ] At least three featured projects show real, legible evidence.
- [ ] Mobile projects remain compact and usable without sticky traps.
- [ ] The page feels more cinematic without becoming a copied MotionSite skin.

## Phase 5 — resume, case studies and personal story

- [~] Resume source exists externally; select the current PDF and reconcile it
      with site data.
- [~] Shared data already covers profile, projects, experience, education and
      supporting interests; extend only where case studies need it.
- [ ] Add a visible Resume action after the current PDF is approved.
- [ ] Give major projects a case-study structure: problem, audience, role,
      decisions, implementation and outcome.
- [ ] Verify employment, internship, education, dates, links and defensible
      impact statements.
- [ ] Decide between `/projects/[slug]` pages and expandable archive detail.
- [ ] Add original photography/HDR work with captions and responsive media.
- [ ] Add concise hardware/homelab and automotive material after professional
      evidence.
- [ ] Review media ownership, privacy, EXIF/location and third-party branding.

### Phase 5 acceptance

- [ ] Visitors can understand what Zizhen built, why it mattered and what
      changed.
- [ ] Resume and website facts are internally consistent.
- [ ] No featured item relies on unexplained placeholders or false CTAs.
- [ ] Personal interests add identity without displacing professional evidence.

## Phase 6 — contained WebGPU lab

- [ ] Define one demonstrable GPU concept before adding the route.
- [ ] Prefer a project connected to existing GPU/systems interests: WGSL compute
      particles, flow field, spatial simulation or visualised GPU pipeline.
- [ ] Add `/labs/webgpu` only after the main cinematic and project evidence are
      stable.
- [ ] Include WebGPU feature detection plus WebGL/static fallback.
- [ ] Explain the engineering decisions, limits and measured behaviour rather
      than shipping a context-free visual toy.
- [ ] Keep lab bundles isolated from the main route.

## Phase 7 — Aero/Y2K lab family

- [ ] Add `/labs` as the experiment index and preserve the existing Win7 entry.
- [ ] Prototype scoped `/labs/xp` and `/labs/98` experiences only after the main
      portfolio priorities are stable.
- [ ] Reuse shared portfolio facts without leaking OS-theme CSS.
- [ ] Implement accessible open/focus/move/minimise/close basics before deeper
      simulation.
- [ ] Replace the Win7 orientation gate with a genuine small-screen fallback
      when this phase resumes.
- [ ] Fix recorded Flip 3D measurement and viewport issues.

## Phase 8 — English / 中文 i18n

- [ ] Use `en-AU` as default and add directly addressable `zh-CN` routes.
- [ ] Preserve the current route and section when switching languages.
- [ ] Translate navigation, portfolio content, UI states, accessible labels and
      metadata.
- [ ] Localise document language, dates, canonical URLs, `hreflang` and Open
      Graph data.
- [ ] Add missing-key checks and repeat responsive tests in both languages.

## Phase 9 — release quality

- [ ] Run fresh lint, typecheck and production build after implementation.
- [ ] Test 320, 360, 390, 768, 1024 and 1440px layouts.
- [ ] Test real iOS Safari and Android Chrome devices.
- [ ] Test slow network, data saver, autoplay rejection and video decode failure.
- [ ] Test keyboard-only, screen reader and reduced-motion entry paths.
- [ ] Measure video transfer, JavaScript cost, CPU/GPU time, frame pacing and
      layout stability.
- [ ] Add focused tests for entry completion/skip/session state and key content.
- [ ] Add CI for lint, typecheck, tests and build.
- [ ] Complete canonical metadata, sitemap, robots, headers and production-domain
      configuration.
- [ ] Replace copyrighted/local-only Windows assets before public deployment.

## Deferred non-goals

- [ ] Full real-time 3D city/building/office rendering on `/`.
- [ ] WebGPU-only main-site rendering.
- [ ] Mandatory or repeatedly playing cinematic intro.
- [ ] Scroll hijacking, custom-cursor requirements or content gated by animation.
- [ ] Generic blue/orange AI-SaaS reskin.
- [ ] CMS, contact backend or authentication without a demonstrated content need.
- [ ] Classic Mac/macOS lab before the cinematic, evidence, WebGPU and Y2K work
      are stable.
