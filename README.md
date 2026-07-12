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
- **Deployment:** Cloudflare via OpenNext (static export)

## Design

Two distinct visual systems:

- **Main site (`/`)** — a Matrix-inspired CRT operator terminal: near-black
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

## Type Checking

```bash
npm run typecheck
```

This prefers the native TypeScript 7 compiler ([`tsgo`](https://www.npmjs.com/package/@typescript/native-preview), ~10× faster) and automatically falls back to the classic JavaScript-based `tsc` (TypeScript 6) when the native binary is unavailable — so it works the same locally and in CI. The fallback logic lives in [scripts/typecheck.mjs](scripts/typecheck.mjs).

> Note: `next build` does its own type checking via SWC and is independent of this script.

## Roadmap

See [TODO.md](TODO.md) for the full development plan.

## Licence

MIT
