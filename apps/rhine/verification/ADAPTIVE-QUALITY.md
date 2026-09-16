# Adaptive quality

Opt-in under Settings → Adaptive quality. The switch is saved, but runtime
reductions never overwrite the user's rendering preferences. Turning it off
restores those preferences (or the existing Super Performance override).

## Behaviour

- Estimate the browser's available refresh cadence from multiple animation
  frames, including the lightweight entry gate. No fixed 240 FPS target.
- Loaded frames can raise the estimated ceiling but cannot lower it just
  because the renderer is struggling. The estimate is approximate: browser
  power policies, variable refresh and monitor changes may affect it. Reload
  after moving to another display to obtain a fresh entry calibration.
- Require roughly two seconds below 90% of the estimate before reducing one
  step, with at least three seconds between reductions.
- Reduce AO and transmission resolution first, then shadow resolution;
  reduce the main 3D resolution in small steps, then depth of field.
  Already inexpensive settings can go straight to resolution adjustment.
- Keep the AO shader kernel unchanged, avoiding shader recompilation on each
  automatic step. UI text and animation speeds are unchanged.
- Recover only after at least twelve seconds at 97% of the estimate with
  actual render submissions. Cached static frames do not justify either
  upgrading or downgrading GPU quality. Failed recovery doubles the next
  recovery delay, up to two minutes.
- Pause decisions during boot, dialogs, model loading, background tabs and
  the independent viewer. The viewer uses the current override when opened.
- Keep the existing mobile Super Performance default. No automatic switch
  to a different material pipeline or 2D fallback. A quality floor prevents
  indefinite degradation; reaching full refresh rate is not guaranteed.

## Verification

`npm run check:adaptive-quality`: 13 deterministic tests cover refresh
estimation at 60/90/120/144/165/240 Hz, sustained versus transient load,
very slow rendering, idle reuse, recovery/backoff and preference bounds.
Production build includes TypeScript checks. Browser checks cover the
settings switch and bilingual text. These are not physical mobile GPU
benchmarks; visible quality steps may still be perceptible on some devices.
