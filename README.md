# Zizhen Liu (Lance)  — Portfolio

[中文版](README.zh-CN.md) | **English**

Personal portfolio website built to showcase my software engineering skills and projects.

## Tech Stack



- **Engine:** Node.js 24.2
- **Framework:** Next.js 16.2 (App Router)
- **UI Library:** React 19.2
- **Language:** TypeScript 6.0 (with native TypeScript 7 / `tsgo` preview for type-checking)
- **Styling:** Tailwind CSS 4 + Glassmorphism (Frutiger Aero)
- **Linting:** ESLint 9
- **i18n:** next-intl (English / Chinese)
- **Deployment:** Vercel

## Design

Frutiger Aero / Glassmorphism aesthetic inspired by Windows Aero (Longhorn - Vista - 7) and macOS Tahoe's liquid glass. Key visual elements include translucent frosted-glass cards, backdrop blur effects, subtle gradients, and soft lighting — with full support for both light and dark themes.

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
