# Archive interiors

The active collection contains **31 interiors**: 10 personal, 3 internship, 8 web, 4 AI/data and 6 systems/hardware records. All use category-specific P/I/W/A/S identifiers.

See [ARCHIVE-EXHIBITS.md](ARCHIVE-EXHIBITS.md) for the complete catalogue, meanings, provenance, reproduction, numbering migration and validation. [PROJECT-EVIDENCE.md](PROJECT-EVIDENCE.md) retains the detailed source documentation for Novacart's actual UI and the GPU report.

## Current sources

- `build_archive_exhibits.py` and `archive-exhibits.blend`: 29 documentary interiors.
- `build_evidence_models.py` and `project-evidence.blend`: two evidence interiors.
- `../content/project-models.json`: all 31 canonical IDs, asset keys and bilingual assembly labels.
- `../content/archive-exhibits.json`: documentary content and per-record source notices.
- `../public/assets/projects/*.glb`: current runtime interiors.
- `project-models-report.json`: combined triangle, mesh and file-size measurements.
- `project-previews/index.html`: local review with all five categories; regenerate using `node scripts/project-model-gallery.mjs`.

The original `project-models.blend` contains the historical symbolic studies. It remains editable but is not the current runtime collection. Its generator now supplies shared machining helpers and skips the replacement designs.

## Runtime

Models load only when selected. The introductory profile is approximately 107 KB; the entire 31-model collection totals about 6 MB. All interiors remain under 15,000 triangles. Novacart embeds its three screenshots, while the other models use geometry without external textures. No extra lights or animation clips are loaded.

The original exterior cassette, extraction and camera movement remain shared. Every interior supplies two compatible assembly layers to the six-part viewer. Mobile devices retain the performance-mode default, and no animation speeds were changed.

Production GLBs have content-hashed URLs. They are excluded from initial PWA precaching and cached on first use. Unopened models need a network connection. Legacy X identifiers remain searchable and downloadable and resolve to their new record when restored from saved archives.

The source scenes and studio previews are local development artifacts. Upstream archive shells and third-party resources retain their existing notices and restrictions.
