# Homepage rendering cost and balanced preset

Measured locally on 2026-09-17 with Edge/ANGLE D3D11 on an RTX 5090,
3840 × 2160 output, original quality, adaptive quality disabled, light theme.
The archive array keeps its normal idle motion. This is an automated headless
comparison, not a guarantee for another browser window or device.

## Reproduce

Build the root portfolio and serve `out/` on port 3100. From `apps/rhine`:

```sh
node scripts/profile-home.mjs baseline
node scripts/profile-home.mjs repeated --repeat
node scripts/capture-render-comparison.mjs original-fixed
node scripts/capture-render-comparison.mjs half-fixed --half
```

The profiling script uses asynchronous disjoint GPU timer queries and records
CPU callback time, renderer identity, actual target sizes and scene statistics.
These diagnostics are never loaded by the production website. Raw results and
screenshots are written to ignored `art/.cache/`.

## Results

Three alternating runs per configuration, each measured for five seconds after
six seconds of settling (same scene, all settings except transmission unchanged):

| Configuration | Mean GPU time | Mean CPU callback time | FPS display at end of each run |
| --- | ---: | ---: | --- |
| Original, full-resolution refraction | 4.907 ms | 1.016 ms | 185 / 182 / 184 |
| Original with 50% refraction resolution | 3.832 ms | 1.082 ms | 238 / 239 / 240 |

GPU work decreased by approximately 22%. CPU/GPU work overlaps; these timings
must not be added to calculate FPS. The sampled scene had about 316 background
archives, 69 draw calls and 4.1 million submitted triangles across all passes.
The screenshot's simple shapes do not represent the full cost: transmission
captures opaque geometry into a multisampled texture and generates mipmaps;
the scene also has shadow, AO, depth and bokeh passes. The 360-degree viewer
does not render this entire array or its AO/bokeh pipeline.

Single-pass ablation found lowering transmission resolution to be the most
promising tested trade-off. Disabling shadows or bokeh did not consistently
produce a comparable gain. Back-face culling of four closed opaque background
parts was also tried and reverted because it produced no stable improvement.

## Shipping change

Added an explicit **Balanced / 平衡** preset. It keeps all Original settings,
except transmission resolution is 50% per dimension (one quarter of the capture
pixels). Main scene resolution, text, shadows, AO, bokeh and motion stay intact.
The setting also applies to the model viewer, as other quality settings do.
Refraction behind glass can look softer; this is a quality/performance trade-off,
not a lossless rendering optimisation. Existing preferences and defaults remain
unchanged, and Original restores full refraction resolution.

Validation: root production build, quality normalisation/device-limit checks,
and browser coverage of preset application, unchanged main render dimensions,
canvas preservation, persistence and restoring Original.
