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

## Compensated frosted capture (2026-09-24)

Every quality preset now captures refraction at half width and height while
browsing the array, then reads it one mip level finer. Glass reads the same
filtered footprint as the full-size capture from a quarter of the pixels, so
Original keeps its look.

Why it is equivalent: three.js picks the refraction mip as
`log2(captureWidth) × roughness × iorFactor`. The array frost (roughness 0.28)
and the selected frosted cover already read mip levels 2–4. For any read at
level 1 or above, level *L* of a half-size capture is level *L + 1* of the
full-size one. `src/transmission-lod.ts` patches the transmission chunk: it
computes the LOD from the unreduced reference size and subtracts a shared
`transmissionLodBias`. The frosted cover's bounded LOD uses the same
reference size.

`ArchiveScene.updateTransmissionCapture` finds the finest LOD read this frame.
It checks the array frost plus each selected or returning cover, using its
lift, clarity and projected height at a conservative depth. The capture is
reduced only when that LOD is at least 1.1, and it returns to the reference
capture below 1.0. Clearing glass in the detail view, and very small covers,
use the reference capture. The switch waits one second before reducing again,
so the capture is not reallocated repeatedly. The capture is never reduced when
the reference is below 50% (for example Super Performance). The 360° viewer
keeps bias 0 and its own full capture. `#three-scene[data-transmission-capture]`
shows the scale in use.

### Same-frame comparison

A probe build froze one frame and rendered it four times in headless Chromium
(SwiftShader): reference, reference again, compensated half capture, and an
uncompensated half capture (the old Balanced behaviour). Differences are per-pixel
maximum channel differences in 8-bit sRGB against the reference:

| View | Compensated mean / max / >2 levels | Uncompensated mean / max / >2 levels |
| --- | --- | --- |
| Opening array, 1920 × 1080, light | 0.21 / 3 / 0.01% | 2.86 / 24 / 29.9% |
| Reduced-motion archive, 960 × 540, light | 0.29 / 4 / 0.12% | 1.29 / 16 / 16.9% |
| Reduced-motion archive, 960 × 540, dark | 0.30 / 8 / 0.13% | 1.15 / 14 / 15.7% |

Repeat renders were identical (0 difference). In the standard 1080p view the
selected cover projects to about 487 px, a reference LOD of about 3.0, well
above the threshold. When detail was opened, the capture returned to 1.0 as
the cover cleared, and it dropped to 0.5 after returning to the archive. No
shader or page errors occurred.

### Cost

While browsing, the capture has the same size and GPU cost as the Balanced
preset's capture. On the RTX 5090 at 4K, Balanced measured 3.83 ms against
4.91 ms for Original (see above). A GPU time measurement for this change still
has to be made on that machine: run `node scripts/profile-home.mjs` before and
after this change. SwiftShader shows image differences, not GPU timings. The
detail view, which needs clear refraction, keeps its full cost. Balanced remains
available and now uses a quarter-width capture while browsing, compared with
its half-width reference.

`npm run check:transmission-lod` covers the shader patch, the footprint
identity, the thresholds as covers clear, and the fallback for small covers.
