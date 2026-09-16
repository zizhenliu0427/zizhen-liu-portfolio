# Zizhen Liu (Lance)  — Portfolio

[中文版](README.zh-CN.md) | **English**

Personal portfolio website built to showcase my software engineering skills and projects.

## Tech Stack



- **Engine:** Node.js 24.2
- **Framework:** Next.js 16.2 (App Router)
- **UI Library:** React 19.2
- **Language:** TypeScript 6.0 (with native TypeScript 7 / `tsgo` preview for type-checking)
- **Styling:** CSS Modules (main site) + Tailwind CSS 4 · Glassmorphism in the Aero lab
- **Linting:** ESLint 9
- **i18n:** English / Chinese — planned (Priority 4)
- **Deployment:** Vercel (Next.js static export)

## Design

Three visual systems in one repository and deployment:

- **Rhine archive (`/`)** — the default home page, with
  31 bilingual archives, category-specific IDs and documentary 3D interiors.
  Sources and editable Blender projects live in `apps/rhine`. Adapted from
  [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI); its MIT licence and
  third-party asset notices are retained in that directory.

- **Matrix (`/matrix`)** — a Matrix-inspired CRT operator terminal: near-black
  surfaces, phosphor-green accents, canvas code-rain, scanlines and bloom,
  with reduced-motion and low-power fallbacks. The recruiter journey stays
  first; the spectacle stays behind the content.
- **Aero lab (`/desktop`, `/oobe`, `/demo`)** — Frutiger Aero / Glassmorphism
  inspired by Windows Aero (Longhorn – Vista – 7) and Aqua/Liquid Glass: a
  hand-built draggable window manager, OOBE-style résumé wizard and component
  playground. XP and Windows 98 shells are planned next.

## What's inside

- **Selected Work** — five featured builds, each with a hand-drawn terminal visual:
  IoT sensor analytics, CMO-DB, CTV violence detection, Novacart e-commerce, and
  the Codritium internship platform work (MediaJira), cross-linked with the
  experience log.
- **`/projects`** — a domain-filterable archive of everything on record
  (WEB / AI-ML / SYSTEMS / HARDWARE / MOBILE / LAB) with honest access labels:
  LIVE, SOURCE, NDA, CODE PRIVATE, IN DEVELOPMENT.
- **Experience** — Codritium (current), Intelli New Technologies and Golden Lady
  Photography, each with company links; mainland-China-hosted sites carry a
  footnote for visitors outside China.
- **Education** — UNSW and UTS with verified QS 2027 rank chips.
- **`/about`** — the operator: home lab, photography, automotive, languages.
- **Aero lab** — `/desktop`, `/oobe`, `/demo` Windows 7 era experiments.

All content is typed data in [`src/data/portfolio.ts`](src/data/portfolio.ts);
themes only change presentation.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

`npm install` / `npm ci` also installs Rhine's pinned dependencies separately
from Next.js. `npm run dev` and `npm run build` first compile Rhine into the
ignored `public/rhine` directory. Next.js then serves/exports all three interfaces
on the same origin. The generated output is not committed.

For live editing of the archive, run `npm run dev:rhine` (port 5174), then
`npm run build:rhine` to refresh it in the main site's preview. The model gallery
is at `/rhine/art/project-previews`. The site uses normal browser caching;
legacy Rhine offline workers retire automatically without refreshing the page.

## Type Checking

```bash
npm run typecheck
```

This prefers the native TypeScript 7 compiler ([`tsgo`](https://www.npmjs.com/package/@typescript/native-preview), ~10× faster) and automatically falls back to the classic JavaScript-based `tsc` (TypeScript 6) when the native binary is unavailable — so it works the same locally and in CI. The fallback logic lives in [scripts/typecheck.mjs](scripts/typecheck.mjs).

> Note: `next build` does its own type checking via SWC and is independent of this script.

## Deployment

Deployed on Vercel from `main`. The site is a full static export
(`output: "export"` in [next.config.ts](next.config.ts)) — no API routes, no
middleware, no serverless functions — so Vercel needs no extra configuration
beyond its auto-detected Next.js defaults.

One environment variable is required in the Vercel project, otherwise
`metadataBase` falls back to `localhost` and every Open Graph preview breaks:

```
NEXT_PUBLIC_SITE_URL=https://<your-domain>
```

## Roadmap

See [TODO.md](TODO.md) for the full development plan.

## Licence

MIT
