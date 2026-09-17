# Opening render preparation — 17 September 2026

## Findings

A fresh Edge context created 36 WebGL programs during the visible 3D opening. Compilation and first uploads coincided with long frames. The full scene was previously loaded but never rendered until the array became visible. Double-sided frosted glass also needed back-face variants while its clearcoat changed during extraction.

The main scene and model viewer have different workloads: the sampled main detail scene rendered 154 background cassettes, with 69 renderer-reported calls and 2,047,399 submitted triangles across passes. The viewer renders a single assembly without the main scene's AO, bokeh and array shadows. Comparing their FPS does not isolate GPU speed or establish the exact CPU/GPU bottleneck on another browser/device.

## Changes

- Enable the entry button after the core resources load; prepare the selected project and GPU pipeline concurrently with the 2D opening.
- Prepare four representative opening poses behind the entry/2D overlay, compile visible meshes separately with paint opportunities between them, and execute the actual render pipeline to initialise uploads, shadows and post-processing targets.
- Wait for queued GPU work using a polled WebGL fence, never blocking with `gl.finish()`. Restore the starting pose/decryption afterwards; preserve motion and quality.
- Avoid resetting unchanged renderer canvas dimensions and composer sizes when only HUD layout changes.
- Batch redaction line measurements before appending overlays, avoiding a forced layout for every field during the detail handoff and language switch.
- Expose preparation status/program count through the existing review statistics.

Normal entry overlaps cold rendering preparation with the existing 2D opening. If preparation outlasts it, hold the welcome card before the 3D boundary. Early skip requests queue until preparation completes; reduced-motion/direct-entry visitors keep the entry screen because they have no 2D sequence to cover the work. It does not reduce steady-state scene complexity or guarantee a target frame rate. Changing rendering settings after preparation can still introduce new variants.

## Validation

Root production build and integrated Edge tests cover concurrent startup preparation, slow-asset/early-skip and reduced-motion paths, no new programs during the visible opening, camera composition across all categories, handoff, desktop/phone archive models, theme/language changes, credits and the FPS setting.

Diagnostic command from apps/rhine, with root out/ served on port 3100:

```powershell
node scripts/profile-opening.mjs prepared --natural
```

A fresh 1920×1080 Edge run after the full pose preparation created **zero** programs during the visible opening (36 before). Natural playback still recorded occasional long frames, with the worst sampled intervals around the final DOM handoff (~29–33 ms). This is a targeted compilation fix, not evidence that all one-frame stalls are gone, nor a measurement of the user's 4K steady-state FPS. Raw diagnostics are local under art/.cache/opening-*.json; headless timing should not be equated with the interactive browser.
