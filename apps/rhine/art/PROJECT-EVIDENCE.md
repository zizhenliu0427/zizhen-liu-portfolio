# Project evidence prototypes

These two evidence interiors are now part of the [complete 31-archive collection](ARCHIVE-EXHIBITS.md). Shells, extraction, decryption and assembly motion are unchanged.

## Novacart / W-002 (formerly X-010)

The three images are captures of the actual Next.js catalogue, cart and order pages at source commit `e8cddcb0f8fdcb2832346f8e7e2706d5a86c6138` in [Novacart](https://github.com/zizhenliu0427/Novacart/tree/e8cddcb0f8fdcb2832346f8e7e2706d5a86c6138). Relevant source files were clean when captured.

`scripts/capture-novacart-evidence.mjs` supplies isolated API responses to the real frontend. Product names, prices and image URLs come from `backend/Novacart.Core/Data/AppDbContext.cs`; the six selected product records are stored in `project-evidence/novacart-fixture.json`. The visitor, cart and order are **demonstration records**, not customer activity, sales evidence or a live backend test. Product photography retains the source seed catalogue's Unsplash URLs; it is visible within the captured application, not a new original photography claim.

The physical route `Next.js → YARP → APIs` and Auth/Product/Cart/Order labels summarise `docs/ARCHITECTURE.md`. The lower catalogue and service route separate from the upper cart/order screens when exploded. Screenshots intentionally keep the source interface's English and colours when the portfolio language/theme changes.

### Reproduce the captures

1. Use the source commit above with frontend dependencies installed.
2. Copy its `frontend` to this repository's ignored `.tools/novacart-preview`, excluding `node_modules`, `.next` and all `.env*` files. Install the locked dependencies in the copy, or link its `node_modules` to the source installation.
3. In that disposable copy run `node node_modules/next/dist/bin/next dev -p 5180 -H localhost`. No backend credentials or services are required; every `/api/**` request is intercepted.
4. In this repository run `node scripts/capture-novacart-evidence.mjs ../Novacart`. The script captures the source pages in headless Edge using fixture responses and fails on client exceptions. It never submits an actual checkout or writes to the source repository.

## GPU benchmark / S-002 (formerly X-026)

The bars use [the source report, section 5c](https://github.com/Fairchild2333/Multi-Graphics-API-GPU-Benchmark/blob/eb10fd3bac72b52c661a85282c3b729630e5136d/docs/report.md), preserved in `project-evidence/gpu-results.json`. These are archived results, not a new test run.

| Condition | Windowed | Compute only |
| --- | ---: | ---: |
| Throughput (iterations/s; source labels it Avg FPS) | 1,750.6 | 21,259.6 |
| Compute time | 0.033 ms | 0.034 ms |

Same RX 9070 XT, Vulkan, 1M particles; Ryzen 5 7600, Adrenalin 26.3.1, 1280×720 windowed, V-Sync off, device-local memory. Bar lengths share a zero baseline and a linear scale. Compute-only mode excludes drawing and presentation. The throughput ratio **does not mean the compute shader became 12× faster**. The model deliberately displays both compute timings and execution paths. Hardware and API labels are test context, not measured bar categories.

## Blender and runtime

Run Blender 4.5+ with `--background --factory-startup --python art/build_evidence_models.py -- --render`. It uses the same machining helpers as `build_project_models.py`, and writes:

- `art/project-evidence.blend`: two editable scenes with packed source screenshots and studio cameras.
- `public/assets/projects/novacart.glb` and `gpu-benchmark.glb`: only the interior geometry; screenshots embedded in the Novacart GLB.
- `art/project-previews/novacart.png` and `gpu-benchmark.png`: studio renders, not screenshots of the website's external shell.
- `art/project-evidence/report.json`: mesh, triangle and byte counts.

Run `node scripts/project-model-gallery.mjs` to refresh the complete review page after generating all interiors. `build_project_models.py` skips evidence and documentary designs; `build_archive_exhibits.py` generates the other 29 current interiors.

Models load only when selected. No runtime screenshot generation, new render loop or external image fetch is introduced. Shared template textures survive scene/viewer cloning and are disposed with the model library. Embedded images remain available in the existing offline model cache. The website theme changes the archive shell; source screenshots retain their original colours.

## Earlier prototype verification — 15 September 2026

Production build and 22 content checks passed. Ten Playwright checks passed across `project-models.spec.ts`, `project-model-offline.spec.ts` and `language-motion.spec.ts`: bounded assets, 18-project switching, source textures retained through viewer/language/theme changes, original loading-motion scope, delayed requests, retry, offline reuse, and desktop/phone/tablet layouts. Studio previews and actual website screenshots were visually inspected, including the phone's performance mode. This is functional and visual verification, not an FPS benchmark on physical mobile devices.

Final exports: Novacart 841,552 bytes / 8,698 triangles; GPU 542,768 bytes / 12,476 triangles. Initial offline precache remains 33.9 MiB. The preview gallery is a local development review page; only the two GLBs and their runtime integration are included in the website build.
