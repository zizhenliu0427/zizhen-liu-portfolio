# Background geometry comparison — 17 September 2026

Standalone experiment; production geometry, quality presets and saved preferences
are unchanged. This is a manual two-tier comparison, not automatic distance LOD.

## Scope

`art/build_background_lod.py` generates two replacement surfaces from the current
unbranded archive cassette. Its reproducible Blender source is
`art/background-lod.blend`; the exported mesh and source hash are in
`reference/background-lod/`.

| Surface | Original triangles | Simplified triangles |
| --- | ---: | ---: |
| Titanium fasteners | 2,136 | 384 |
| Ivory edges | 940 | 564 |
| Complete background cassette | 4,200 | 2,072 |

Only the background instanced geometry changes. Selected archives, project
interiors, materials, glass, lighting, shadows, camera and animation remain the
same. Switching refreshes the shared theme attribute because the instance pool
can grow while the other geometry is inactive.

## Measurements

Edge headless, RTX 5090 / ANGLE D3D11, 3840 × 2160, DPR 1. Three alternating
rounds per quality preset and geometry tier, fresh scenes, 60 warm-up frames and
240 measured frames. GPU durations use asynchronous WebGL timer queries; they
are **rendering cost, not measured display FPS**. The standalone scene excludes
the main site's DOM interface and browser extensions.

| Quality | Original GPU ms | Simplified GPU ms | Reduction |
| --- | ---: | ---: | ---: |
| Original | 5.075 | 4.841 | 4.6% |
| Balanced | 3.939 | 3.856 | 2.1% |

These are medians of the three run medians. Original-quality individual paired
reductions ranged from 3.8% to 9.5%, so avoid treating small gains as guaranteed.
CPU submission remained around 0.9–1.0 ms. Each run had 319 background archives
and 69 draw calls; reported triangles across render passes fell from 4,131,843
to 2,108,115. See `background-lod-results.json` for each run.

The earlier approximately 15% estimate is invalid: an inactive LOD retained an
undersized instance attribute and some surfaces were silently clipped. The
corrected measurements above replace that estimate. The check now validates
attribute identity/capacity as well as matching selected geometry, materials,
camera/model positions, population, quality settings and draw calls.

## Appearance and decision

Light/dark overview and detail screenshots were compared at 4K. Selected model
geometry remains original, but simplified background screws and bevels change
small highlights, more visibly in dark mode. This is not a lossless optimisation.
Keep this as a reviewable experiment: its small extra gain, especially with the
Balanced preset, does not justify silently making it the default. This machine's
results do not establish performance improvements on phones or integrated GPUs.

## Reproduce

From `apps/rhine`:

```powershell
# Optional: regenerate with locally installed Blender.
blender --background --python art/build_background_lod.py
node scripts/build-background-lod.mjs
npx --yes serve@14 release/background-lod -l 3190 --no-clipboard
# In another terminal:
node scripts/check-background-lod.mjs
```

Open http://localhost:3190/reference/background-lod and use the background,
quality, scene, dark-mode and pause controls. For automation use the clean URL
with `?bench=1`: the static server's `.html` redirect can discard the query.
`--visual-only` repeats screenshots and interactive checks without remeasuring.
Raw samples and eight images are saved under ignored
`art/.cache/background-lod/`. The check also exercises real controls and a paused
viewport resize. TypeScript checking and the standalone production build pass.
