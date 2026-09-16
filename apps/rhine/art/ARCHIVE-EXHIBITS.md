# Complete archive collection

## Current website (16 September 2026)

The user clarified that the desired collection is the first **18 symbolic project interiors**, preserved in `project-models.blend` and its generator. These are restored with current W/A/S IDs; the remaining 13 personal and internship records now have matching symbolic interiors in `profile-models.blend`. The 31 documentary/evidence designs described below are historical studies, no longer the active runtime collection. See [PROJECT-MODELS.md](PROJECT-MODELS.md) for current assets and reproduction.

## Historical documentary collection

All 31 records now have their own interior, including personal information, education, interests and internships. The shared archive shell, camera motion, loading controls and six-part assembly viewer remain in place.

## Numbering

| Prefix | Category | Current range |
| --- | --- | --- |
| P | Personal information, education and interests | P-001–P-010 |
| I | Internships | I-001–I-003 |
| W | Web and applications | W-001–W-008 |
| A | AI and data | A-001–A-004 |
| S | Systems and hardware | S-001–S-006 |

The canonical ID changes across the visible title, hover label, cassette print, details, viewer, search results and exported filename. Record array order remains unchanged to preserve scene positions. Every old main-record X ID and merged-note X ID redirects directly to a canonical record. Old saved IDs are resolved on read, both kinds of old IDs remain searchable, and all 40 old bilingual download paths remain available. `content/archive-id-migration.json` documents the 31 main-record mappings.

Migration is reproducible and idempotent: `node scripts/migrate-archive-ids.mjs`, then `npm run export:archives`. The organisation/import workflow performs migration before final content validation. Do not infer category prefixes from visual column order.

## Meaning and provenance

`content/archive-exhibits.json` contains a per-model explanation, source record, display captions and source notice. `scripts/prepare-archive-exhibits.mjs` defines the 29 new documentary arrangements from the existing bilingual archive content. Novacart and the GPU report keep their separately documented sources in [PROJECT-EVIDENCE.md](PROJECT-EVIDENCE.md).

- **Personal**: identity and three engineering areas; contact channels; skills; web/mobile surfaces; delivery workflow; photography interests; the recorded FK8 and language interests; two education records with existing course marks. The photography panel does not invent a personal photo gallery, and language levels are textual rather than invented percentage scores.
- **Internships**: Codritium's recorded 57→20 minute CI result; Intelli New's collection/validation/normalisation work; Golden Lady's site updates and workstation support. They describe the user's existing portfolio claims, not new measurements or independent verification of employment.
- **Web**: CMO query relationships; Novacart source UI; MediaJira's recorded 47.5→5.0 second WebSocket p95 result; Lanely's four task states; Whale's container lifecycle; Breaktime's host/join/play/vote flow; Good360's MVVM and message types; Web Keeper's current browser path and legacy Python/FFmpeg archive path.
- **AI**: sensor ingestion and RAG; recorded classification backbones/SE attention/Grad-CAM; CTV camera/inference/streaming structure and recorded metrics; transcription and its CLI/web/desktop interfaces.
- **Systems**: the video decode/transform/encode path; archived Vulkan throughput; generic Edge hierarchy; I2S/AXI/DMA/Linux; CDN probing and pinning; lab identity, storage and device systems.

Local README files were also read for CMO-DB, Lanely, Breaktime Arcade, Whale Logistics, HLS Keeper/Web Keeper, Building Sensor AI, Audio-Video2Text-AI, sdr2hdr and bili-cdn-dns-pin. Only documented current or explicitly identified legacy paths are used. Private source code, account details and customer data are not embedded in model assets.

These are labelled **documentary studies**, not screenshots of those applications. The slips on the Kanban board, camera frames, waveforms and timing shapes are schematic layouts, not real task counts, captured footage or measured signal samples. Course and performance bars use their recorded values with a zero baseline and linear scale. Source information stays readable as HTML on the review page, independently of 3D resolution.

## Reproduce

From the portfolio repository, with Blender 4.5+:

```powershell
node scripts/prepare-archive-exhibits.mjs
blender --background --factory-startup --python art/build_archive_exhibits.py -- --render
blender --background --factory-startup --python art/build_evidence_models.py -- --render
node scripts/project-model-gallery.mjs
npm run build
```

- `art/archive-exhibits.blend`: 29 editable scenes with studio cameras/lights.
- `art/project-evidence.blend`: Novacart and GPU scenes, with packed source screenshots.
- `public/assets/projects/*.glb`: 31 runtime interiors.
- `art/project-models-report.json`: combined measurements in record order.
- `art/project-previews/index.html`: complete local review grouped P/I/W/A/S, with per-record source explanations.

The original `art/project-models.blend` is a historical study collection. Its old scenes are no longer the current runtime designs. `build_project_models.py` supplies common machining helpers and skips current documentary/evidence designs.

## Performance and validation

All 31 GLBs total 5,983,296 bytes; the largest is 845,016 bytes and the largest interior has 12,528 triangles. New documentary interiors use geometry without external textures. Novacart retains three embedded source images. Only the selected archive loads; the initial personal model is about 107 KB. No new animation loop or per-frame screenshot generation is introduced. Touch devices retain the existing default performance mode.

Production build, 22 content checks and all 27 Playwright tests passed. Coverage includes all 31 model selections, personal/internship/project assembly views, category wrapping, visible numbering, saved-ID migration, old/new search IDs, all legacy downloads, language/theme changes, original motion scope, mobile/tablet layouts, delayed loads, retry and offline model reuse. Studio renders and representative actual website views were inspected. This is functional and visual verification, not a physical-device FPS benchmark.
