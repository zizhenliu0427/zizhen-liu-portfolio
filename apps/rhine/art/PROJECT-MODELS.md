# Original project interiors — restored 16 September 2026

The active set contains **32 symbolic models**: the restored first 18 project designs, 10 personal/education/interests, 3 internship interiors and Stickybeak in the same style. The original 18 GLBs are unchanged by the supplement. Every record keeps its current category ID, personal label and bilingual HTML content.

## Stickybeak / W-009

The microservices commerce model connects a storefront, payment token and parcel
to three service modules on an event bus. It uses the existing ceramic, graphite,
amber and teal materials and two assembly layers. This is a conceptual structure,
not an application screenshot or a claim about deployment or throughput.

The bilingual content was checked against the local Stickybeak README, frontend
package, Stripe webhook implementation and order state machine on 17 September
2026. It identifies payments as sandbox integration and makes no unverified
performance or production-usage claims.

Generate only this model with
`blender --background --factory-startup --python-exit-code 1 --python art/build_project_models.py -- --only W-009 --render`.
The command preserves other assets and merges the report. Source:
`art/stickybeak-model.blend`; output: `public/assets/projects/stickybeak.glb`
(496,388 bytes, 8,308 triangles, no textures). The collection now has 33 archives,
including the separate C-001 original-optics acknowledgement. Historical counts
in the implementation notes below describe their respective earlier checks.

Examples: Novacart shelves and product modules; Whale cargo ship, containers and routes; GPU compute core and memory array; Building AI buildings and sensor network. These are conceptual structures, not source screenshots or measured data.

## Reproduction

The original scene names and `design` metadata in `project-models.blend` identify the first collection. `content/project-models.json` maps these designs to current W/A/S IDs. Geometry comes from the original `build_project_models.py` design functions; labels are regenerated with current identifiers.

To regenerate the 13 supplementary models without touching the first 18, use `--supplement --render`; this saves `profile-models.blend` and merges their measurements into the report. A full run regenerates all 31 designs.

```powershell
blender --background --factory-startup --python art/build_project_models.py -- --render
node scripts/project-model-gallery.mjs
```

- `art/project-models.blend`: preserved original 18 source scenes and studio setup.
- `art/profile-models.blend`: 13 new source scenes, cameras and lights.
- `art/build_project_models.py`: reproducible geometry, labels and export.
- `art/project-models-report.json`: all 31 active models' measurements.
- `public/assets/projects/*.glb`: interiors, loaded on selection; other unused study assets remain historical.
- `art/project-previews/index.html`: the 31-model gallery with regenerated previews.

Both the main archive and six-layer assembly viewer use the selected project's interior. Mobile retains the lightweight cover in performance mode. Original extraction, camera and decryption motion are unchanged. The extra dark documentary backboard is absent; small graphite parts remain part of the original design in light mode.

## Verification

Integrated tests cover the asset bounds, 31 distinct models with two assembly layers and no textures; all 31 record selections; personal/internship interiors; desktop and mobile layouts; both themes and language changes; and the assembly viewer. Main-scene models are fetched once on demand, including the profile at entry, with other records fetched on selection. The historical documentary and evidence studies have separate source files and reports.

## Supplementary designs

- P-001 identity medallion with three engineering modules; P-002 envelope and network connector; P-003 layered compute package; P-004 desktop and mobile interfaces; P-005 API/server/storage route; P-006 branch, checks and release crate.
- P-007 camera body and concentric lens; P-008 steering wheel and speech channels; P-009 books and research lattice (UNSW); P-010 books and engineering circuit package (UTS).
- I-001 development workstation and CI checkpoints (Codritium); I-002 ingestion, processing and storage (Intelli New); I-003 website workstation and support rack (Golden Lady).

All are geometric interpretations of existing portfolio content, without invented metrics. The same ceramic/graphite/silver/amber/teal materials and two assembly layers are used. Studio preview plates are not exported.

## Unbranded shell

`clear_reference_details.py` omits the moulded side company inscription. Regenerate both the cassette and assembly with `build_archive.py` and `build_assembly.py`. The exported files and editable shell sources are updated; the removed `Moulded_Lettering` geometry is absent from both. Other material groups retain their vertex counts and bounds. MIT notices and settings attribution remain.

## Final acknowledgements archive

C-001 is the sixth and final category, bringing the archive to 32 records. It reuses the original glass and optical rings rather than a symbolic project interior. Only this archive loads `rhine-tribute.glb`, containing the original RHINE LAB, LLC. side inscription. The normal shell stays unbranded. Both the main scene and assembly viewer retain native optics and glass settings, including performance mode.

Reproduce the optional inscription with `blender --background --factory-startup --python-exit-code 1 --python art/build_tribute.py`; its editable source is `art/rhine-tribute.blend`. The bilingual record thanks LBEILC/RhineLabUI, HYPERGRYPH, Arknights/Rhine Lab, OpenAI GPT-6 Astra and Codex and provides source/official links. The symbolic gallery still contains 31 models; C-001 uses shared original geometry.
