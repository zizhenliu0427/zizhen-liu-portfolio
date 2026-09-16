# Original project interiors — restored 16 September 2026

The active set is the first **18 symbolic project models** requested by the user: 8 Web & Apps, 4 AI & Data and 6 Systems & Hardware. Personal information and internships retain Rhine's original optical interior. Every record keeps its current category ID, personal label and bilingual HTML content.

Examples: Novacart shelves and product modules; Whale cargo ship, containers and routes; GPU compute core and memory array; Building AI buildings and sensor network. These are conceptual structures, not source screenshots or measured data.

## Reproduction

The original scene names and `design` metadata in `project-models.blend` identify the first collection. `content/project-models.json` maps these designs to current W/A/S IDs. Geometry comes from the original `build_project_models.py` design functions; labels are regenerated with current identifiers.

```powershell
blender --background --factory-startup --python art/build_project_models.py -- --render
node scripts/project-model-gallery.mjs
```

- `art/project-models.blend`: editable restored source scenes and studio setup.
- `art/build_project_models.py`: reproducible geometry, labels and export.
- `art/project-models-report.json`: only the 18 active models' measurements.
- `public/assets/projects/*.glb`: interiors, loaded on selection; other unused study assets remain historical.
- `art/project-previews/index.html`: the 18-model gallery with regenerated previews.

Both the main archive and six-layer assembly viewer use the selected project's interior. Mobile retains the lightweight cover in performance mode. Original extraction, camera and decryption motion are unchanged. The extra dark documentary backboard is absent; small graphite parts remain part of the original design in light mode.

## Verification

Integrated tests cover the asset bounds, 18 distinct models with two assembly layers and no textures; all 31 record selections; native fallback for personal/internship records; desktop and mobile layouts; both themes and language changes; and the assembly viewer. Main-scene models are fetched once on demand, not at initial profile entry. The historical documentary and evidence studies have separate source files and reports.
