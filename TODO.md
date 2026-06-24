# Portfolio TODO

> **Status:** The Aero glass design language is solved (reusable components + live
> demo). README is done. The *actual* site pages (real content sections) are not
> built yet — the homepage is still the create-next-app scaffold.
>
> Legend: `[x]` done · `[~]` changed/dropped · `[ ]` to do

## Phase 1: Planning & Design System
- [ ] Design and plan page sections (Hero, About, Experience, Projects, Skills, Contact)
- [x] Build the Frutiger Aero / Windows Aero glass design system — `GlassCard`,
      `GlassFilter` (edge refraction), `AeroBackground` + convex-lens bubbles,
      viewport-fixed striations, `.aero-glass*` classes
- [x] Live Aero demo (`/demo`): draggable glass cards + Win7 Alt+Tab-style wallpaper switcher
- [~] shadcn/ui — **dropped**: using the hand-built Aero system instead (every
      component is Aero glass; see project memory)
- [~] Aceternity UI effects — **dropped for now**: custom Aero effects instead

## Phase 2: Development
- [~] App Router structure — only the default homepage + `/demo` exist; real sections still to build
- [ ] Build the real homepage sections from the Aero components (Hero / About / Experience / Projects / Skills / Contact)
- [ ] Reusable section components (SectionHeading, ProjectCard, SkillBadge) — all Aero glass
- [ ] i18n with next-intl (English / Chinese switching) — Aero-styled language toggle
- [ ] Dark / light theme toggle (Aero-styled control; currently only `prefers-color-scheme`)
- [ ] Responsive layout pass with Tailwind breakpoints
- [ ] Intersection Observer scroll animations (section fade-in, nav highlight)
- [ ] Extract custom hooks when repeated logic appears (e.g. `useIntersectionObserver`)

## Phase 3: Polish
- [ ] Evaluate Framer Motion (currently pure CSS animations)
- [ ] Replace the copyrighted Windows 7 wallpaper with a free / AI-generated background for production
- [ ] Performance pass — backdrop-filter cost, image optimisation (WebP), lazy-loading
- [ ] Decide whether the wallpaper switcher ships in production or stays demo-only

## Phase 4: Documentation
- [x] README.md (British English)
- [x] README.zh-CN.md with cross-links

## Phase 5: Deploy
- [ ] Deploy to Vercel

## Tooling (done)
- [x] TypeScript 7 native (`tsgo`) preview as primary type-checker, TS 6 fallback — `npm run typecheck`
- [x] VS Code native-preview workspace settings + extension recommendations
