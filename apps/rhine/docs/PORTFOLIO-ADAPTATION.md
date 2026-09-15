# Portfolio adaptation · 2026-09-15

## Baseline and scope

Fork: `zizhenliu0427/zizhen-liu-portfolio-rhine`.
Upstream: `LBEILC/RhineLabUI`, commit `d9ecb6c6f7a36e8b522072a0ebbd7691a50550a7`.

This is the independent third version of Zizhen Liu's portfolio. The original Matrix and Windows 7 project was read as a content source and was not modified.

The scene, model geometry, materials, lighting, array motion, camera timeline, decryption and viewer retain the upstream implementation. Scene changes only update printed label text. Shared brand paths and launcher icons are an original ZL monogram. Reference-PV typing samples are replaced at runtime with procedural key clicks.

The content importer reads the original portfolio's current working tree, including its current Chinese translations. The generated JSON is standalone. Forty records include projects, profile entries, education, employment and explicit engineering notes about existing projects. Performance figures are carried over from that source, not remeasured in this task.

Project/contact actions sit outside the fixed-height text panel. Optional links are validated before export/build; HTML escapes all content. Searches include the complete technology stack. Bookmarks, preferences and PWA caches use a fork-specific namespace. The fixed scaled stage uses overflow clipping to prevent modal focus from panning the entire interface; nested document panels retain scrolling.

## Verification

- `npm run check:content`: 20 tests pass, including all 40 UTF-8 exports, malformed content, unsafe links and literal text escaping.
- `npm run build`: TypeScript and production build pass. The inherited large-bundle warning remains; this task did not optimize the renderer.
- `npm run test:e2e`: 3 tests pass against the production build in Microsoft Edge, approximately 56 seconds total.
  - Full opening naturally reaches the personal profile; viewer open/close, return and column navigation work without page errors.
  - Novacart search, source link, decryption completion, notes, bookmarks, export and upstream license links work. Frame scroll offsets remain zero after modal interaction.
  - 390 × 844 touch viewport with reduced motion: entry, contact, technology search and project reading work without document-width overflow.
- Actual screenshots were inspected at 1600 × 900 and 390 × 844. The initial clipped link row, narrow-screen contact collision and focus-induced frame panning were corrected.
- Original LICENSE, GLB assets and Blender sources are unchanged. The runtime carries the upstream MIT notice.

Browser screenshots are regenerated under ignored `test-results/`; they are not design mockups. The mobile check uses Chromium viewport/touch emulation, not a physical iPhone or Safari.

## Local preview

`npm run dev` starts the independent preview at http://127.0.0.1:5174.
The complete opening ends in the profile detail; ENTER SYSTEM skips to the array.

No adapted public website was deployed. Upstream non-code model/art restrictions remain, as described in the root README. Upstream deployment settings and licensed webfont accounts are not used for this fork.
