# Portfolio cinematic/Three.js rebuild handoff

## 0. Status and decisions — 2026-07-25

**Read this section first.** Sections 1-14 are the original brief, written before
any of the current implementation existed. Where the two conflict, §0 wins.

### Decisions taken after the brief was written

1. **No video at all.** The AI-generated clip is rejected outright, not just as
   a final asset. The entire sequence is real-time Three.js. This deletes the
   "preferred hybrid implementation" in §5 and every reference to hiding a
   video-to-WebGL cut — with one scene and one camera there is no cut to hide.
2. **No Sydney, no real city.** Landmark recognisability is dropped; the user
   may not end up working there, and an anonymous Mega City is closer to the
   source material anyway. §3's Sydney requirement no longer applies.
   (`BootScreen` still contains a `sydney.au` line — content decision pending.)
3. **Stylised, not photoreal.** *The Matrix Awakens* is the reference for
   **atmosphere only** — scale, dense architecture, camera behaviour,
   atmospheric perspective, cold night grade with sparse warm window light.
   Nanite/Lumen fidelity is not reproducible in WebGL and will not be attempted.
   At this budget image quality comes from shader, post, grade and camera, not
   from geometry count. §5's ban on building a city from scratch is lifted for
   procedural geometry; it still stands for photoreal asset production.
4. **The city is to be legible, not suggested.** The user rejected the option of
   hiding the city behind bokeh and shallow depth of field, and asked for a city
   that reads clearly. Procedural boxes have been pushed about as far as they go
   (stepped silhouettes, floor bands, whole-floor lighting, distance softening,
   obstruction beacons) and still read as boxes. Closing the remaining gap needs
   **licensed glTF building assets with baked lighting**, which must be supplied
   by the user — assets are not to be downloaded from arbitrary sources. Until
   they exist, treat the procedural city as placeholder, not as the target.

WebGPU remains out of the main route (see `TODO.md`): the glyph field is
fill-rate bound, not compute bound, so WebGPU buys no image quality here. It
stays reserved for a separate `/labs/webgpu` demo.

### Current state

`/labs/entry` runs the whole sequence — night city, window transit, room,
monitor, DOM handoff — on **one scene, one camera, one unbroken curve**. There is
no video, no cut, no bridge frame and no crossfade anywhere in it. §11 steps 3-9
are done; **only step 10, integration into `/`, remains**. The rejected
`CinematicEntry` is still mounted on `/` and has not been touched.

| File | Responsibility |
| --- | --- |
| `src/components/cinematic/glyphRain.ts` | Glyph field in one fragment shader, drawn into a `WebGLRenderTarget`. Generates its own glyph atlas. This texture is the single source of truth for the monitor, the window spill and the page background. |
| `src/components/cinematic/cityscape.ts` | Procedural night city: instanced building sections, window shader keyed off world position, sky gradient, hero building with a real window aperture, frame, glass, beacons. |
| `src/components/cinematic/postFx.ts` | Quarter-res threshold bloom, then one composite pass carrying chromatic aberration, vignette and grain. Hand-written; `UnrealBloomPass` costs more passes and bundle than this scene needs. |
| `src/components/cinematic/introPlan.ts` | Decides once per page load what the visitor gets. |
| `src/components/cinematic/MonitorHandoff.tsx` | Scene assembly, camera timeline, boot overlay projection, skip/scroll/focus/pause behaviour. |
| `src/app/labs/entry/` | Isolated prototype route with per-mode replay controls. |

### Behaviour model

`introPlan.ts` resolves two axes that fail independently:

- `flight`: `full` (city → window → room → monitor) | `short` (already docked,
  brief dissolve) | `none` (already docked, no animation)
- `renderer`: `webgl` | `canvas2d`

Keeping them separate matters: a repeat visitor still gets the live WebGL field
as the hero background and only loses the flight. Collapsing this into a single
mode would degrade repeat visits to a static background and break the
"background motion is continuous" requirement.

Resolution order: no WebGL → `canvas2d`; `?flight=` / `?renderer=` debug
override; session already seen → `none`; `prefers-reduced-motion` or
`(pointer: coarse), (max-width: 767px)` → `short`; otherwise `full`.
`?intro=1` replays. `?renderer=canvas2d` is the only practical way to exercise
the no-WebGL branch in a browser that has WebGL.

### Two mechanisms not to unpick

**Timeline is split at the facade, not eased as one curve.** The exterior leg is
~41 world units and the interior leg ~1.3, so the facade sits at ~95% of the arc
and *no* single easing gives the room more than about a fifth of the runtime —
verified empirically, the first attempt gave the city 70%. `EXTERIOR_TIME` splits
the timeline there; the crossing is located by binary search on arc length
because it shifts with viewport aspect. Exterior uses an exponential approach
(constant *apparent* growth, not constant speed) and `INTERIOR_POWER` is chosen
so `du/dt` matches across the join — mismatched, the camera visibly changes
speed at the transit.

**The handoff is not a switch.** The camera dollies until the monitor plane
covers the frustum and then stays there, re-docking every frame so resize keeps
it exact. Nothing is swapped at the handoff, so no seam can exist. Do not
"optimise" this into a fullscreen-quad swap.

### Two traps that cost real debugging time

- `useIntroPlan` returns a **server snapshot** on the hydration render. Anything
  seeded from it (`useState(flight === "none")`) latches the wrong value and
  reveals the hero for a frame before fading it back out. Derive reveal state;
  never seed it.
- Post-intro focus must **not** be scheduled in `requestAnimationFrame`. rAF does
  not fire in a background tab, so focus silently never lands. Use a
  commit-ordered effect.

Also: `Object3D.lookAt` aims **+Z** at the target while cameras look down **−Z**.
Computing camera orientation with a plain `Object3D` scratch inverts it and the
scene renders black. Use a `Camera` as the scratch object.

### Verified vs not

Verified by assertion, not by inspection: session gating, `?intro=1`, the real
mobile gate at 375px, the Canvas 2D fallback, Skip present within a frame with a
44px target and outside the `aria-hidden` subtree, Escape-to-skip, scroll lock
and restore-to-prior-value, focus landing on the hero, session marking, and — the
acceptance criterion that matters — **Skip and natural completion land on a
byte-identical camera pose** (`[0, 0, 1.30036, 0, 0, 0, 1]`, within 1e-6).

**Not verified: the motion itself.** The preview pane used during development
reports `visibilityState: "hidden"`, which starves rAF, and its compositor does
not reliably sync to manually driven frames. Beats were confirmed numerically
(camera poses, facade crossing at 2.73s, per-beat bright-pixel ratios). Whether
the sequence *reads* well at 60fps has not been observed and needs a human at a
real browser. In particular the transit darkens sharply (bright-pixel coverage
5.3% → 0.34% over ~0.5s) — physically correct and the intended "darkness at the
window" beat, but it could read as a black flash.

---

> **Everything from here down is the original brief, written before any of the
> above existed.** It is kept because the product goal, the non-negotiable
> requirements and the art direction in it still stand. Where it describes the
> *implementation* — the video wrapper, the hybrid cut, Sydney — §0 overrides it.
> References below to "the current prototype" mean the rejected video version,
> not `/labs/entry`.

> Updated: 2026-07-25<br>
> Decision status of the **video** prototype: **rejected; do not polish it**

## 1. Why this handoff exists

The current portfolio itself is a valid baseline, but the attempted cinematic
entry does not meet the desired quality. The current implementation combines a
generated city-to-desk video, a cropped still frame, CSS fades, Canvas 2D code
rain and the old boot overlay. It improved incrementally, but still feels like
separate layers being swapped rather than one continuous system.

The user explicitly rejected the current effect because:

- the transition still feels visibly disconnected from the live page;
- there is a perceptible pause/freeze near the monitor takeover;
- the live frontend does not appear to continue the same motion seen inside
  the video monitor;
- the original loading/boot window disappeared in one iteration and felt
  artificially appended when restored;
- shortening the generated video to five seconds made the camera move faster,
  but did not solve the continuity problem;
- further CSS crossfades and static-frame bridges are unlikely to produce the
  desired premium result.

The next implementation should therefore start from the transition mechanism,
not from more edits to the current video wrapper.

## 2. Product goal

The opening should feel like the visitor physically enters Zizhen Liu's digital
workspace and the monitor becomes the real website.

The intended experience is:

```text
Sydney-inspired city exterior
  -> approach a modern technology building
  -> pass through/near a window in one apparently continuous shot
  -> enter a personal developer workspace
  -> approach a desk with two modern IPS monitors
  -> the main monitor wakes into moving Matrix-inspired glyph rain
  -> the existing ZL boot/loading window runs inside that live screen
  -> the monitor fills the viewport
  -> the same moving graphics continue behind the real semantic portfolio
```

This is a professional software-engineering portfolio, not a film demo followed
by a resume. The spectacle should establish identity quickly, then get out of
the way.

## 3. Non-negotiable user requirements

### Timing

- The complete pre-page experience should be approximately **five seconds**.
- Five seconds means city exterior through the start of the interactive page;
  do not play a five-second movie and then add a separate two-second loader.
- The boot/loading window must overlap the final monitor approach rather than
  extending the entrance significantly.
- `SKIP INTRO` must appear within the first second.

### Camera and environment

- The shot should read as one continuous move from outside the building to the
  main display.
- Use a Sydney/Sydney-inspired skyline, not an unrelated generic US city.
- Visual quality may take inspiration from the atmosphere of *The Matrix
  Awakens* UE5 demo: cinematic scale, believable architecture and a restrained
  black/green grade. Do not copy its assets, branding or exact environment.
- The room should feel like a real developer/GPU engineer workspace rather than
  a generic gaming room or influencer setup.
- Use **two modern IPS displays**. A CRT monitor is not the target endpoint.
- Props may suggest engineering, photography, hardware and automotive
  interests, but the monitors remain the focal point.

### Screen content

- Do not place portfolio headings, navigation or fake website copy over the
  city/room portion of the cinematic.
- Do not ask a video model to generate readable code or portfolio text.
- The monitor should contain original Matrix-inspired moving glyphs, not a
  static screenshot and not official Matrix imagery.
- The existing loading window is part of the identity and must return in the
  final sequence. Its current copy is:

```text
ZL://BOOT_SEQUENCE — V.01
> loading profile.sys                OK
> decrypting portfolio.dat           OK
> tracing signal — sydney.au         OK
> access granted — entering system
```

- The boot window should appear inside the monitor/live graphics system and
  complete during the last part of the five-second sequence.

### Handoff

- The live code rain must visibly keep moving through the transition. Motion
  cannot pause on a final video frame.
- Do not use a full-screen static screenshot as the primary bridge.
- Do not perform an obvious video fade-out followed by an unrelated DOM fade-in.
- No route change, reload, black flash, white flash or layout jump.
- The page must already exist underneath/alongside the effect and become
  interactive without navigation.
- The homepage typography and panels may enter after the boot signal, but the
  background motion must be continuous before, during and after their reveal.

## 4. Target five-second storyboard

The exact edit may move by a few frames, but use this as the default pacing:

| Time | Beat | Required result |
| --- | --- | --- |
| 0.00-0.75s | Sydney exterior | Immediate location/scale; camera already moving toward a target |
| 0.75-1.75s | Building/window approach | Accelerated but readable push; architecture or darkness can conceal a cut |
| 1.75-2.80s | Workspace entry | Reveal the desk and two monitors; avoid lingering on props |
| 2.80-3.75s | Monitor approach | Camera stabilises, main display becomes nearly front-facing |
| 3.75-4.65s | Live screen takeover | Moving glyph system and compact ZL boot window run together |
| 4.65-5.00s | Interactive reveal | Monitor/canvas fills viewport; DOM content begins to resolve over the same live motion |

The first exterior beat should not consume half the sequence. The last monitor
beat needs enough time to establish continuity.

## 5. Recommended technical architecture

### Core decision

Use **Three.js/WebGL for the monitor screen, takeover and live Hero background**.
The highest-priority goal is that one renderer/animation state owns both the
monitor content and the post-transition background.

Do not put semantic portfolio content inside WebGL. Navigation, headings,
projects and contact actions remain normal HTML/React.

### Preferred hybrid implementation

The practical default is:

1. use a short pre-rendered/AI/3D clip only for the exterior, window and room
   approach if a full real-time scene is too costly;
2. hide the video-to-WebGL cut while the monitor surface or a dark window frame
   fills most of the viewport;
3. use Three.js for the final monitor plane, live glyph effect, boot window
   compositing and fullscreen takeover;
4. keep that same WebGL canvas alive as the Hero background after the DOM is
   revealed.

A full real-time Three.js city/building/office is allowed only if suitable
licensed glTF assets, baked lighting and an acceptable performance budget are
available. Do not spend the next implementation session building a photoreal
city from scratch.

### Continuous render-target strategy

Recommended rendering model:

1. Render the Matrix-inspired glyph/data effect into a
   `THREE.WebGLRenderTarget`.
2. Use that render target's texture as the material for the main monitor mesh.
3. Run the compact ZL boot window as an HTML/CSS overlay accurately projected
   over the monitor, or composite a controlled texture into the same target.
4. Animate the Three.js camera along a deterministic spline toward the monitor.
5. When the monitor fills the viewport, switch from the 3D monitor view to a
   fullscreen quad sampling the **same live render target**.
6. Reveal the semantic Hero DOM over that canvas while the render target keeps
   advancing without resetting time, random seeds or particle positions.

The visual content must not be recreated at the handoff. It must be the same
running simulation before and after the screen fills the viewport.

### Three.js scene guidance

- Prefer one renderer and one WebGL context on `/`.
- Raw Three.js is acceptable and may be preferable for bundle/control; React
  Three Fiber is optional, not required.
- Use a deterministic camera timeline rather than scroll-driven camera control
  for the intro.
- A `CatmullRomCurve3` camera path plus quaternion/slerp orientation is a
  reasonable starting point.
- Use baked lighting/textures for any room/building assets. Avoid expensive
  real-time global illumination.
- Use bloom sparingly for phosphor highlights. Avoid heavy gamer RGB,
  overexposure and generic blue/orange fibre optics.
- Motion blur is optional and must not hide low frame rate.
- Cap device pixel ratio; do not render unrestricted native DPR.
- Cleanly dispose geometries, materials, textures, render targets and event
  listeners when the component unmounts.

## 6. Live Matrix art direction

The live effect should clearly begin as code/glyph rain:

- phosphor green is dominant;
- upper/distant layers contain discrete falling characters;
- some streams accelerate and stretch toward the monitor/Hero focal point;
- lower/near layers may bend in perspective and become light trails;
- trails should periodically resolve back into glyphs;
- cool cyan may appear as a rare network/depth signal;
- amber is reserved for sparse status events;
- CRT scanlines, bloom and signal decay may remain subtle supporting layers.

Do not turn it into generic multicolour fibre optics or a typical AI SaaS
background. It must still read as Matrix-inspired code before it reads as
abstract light.

## 7. The rejected video prototype: what exists and how to treat it

> Still accurate. These files are all still present and `/` still mounts
> `CinematicEntry`; the Three.js work lives entirely under
> `src/components/cinematic/` and `/labs/entry`. They come out as part of §11
> step 10, not before. `BootScreen.tsx` is the exception worth noting — it is
> still used by other routes, and its `sydney.au` copy line is a pending content
> decision (§0 decision 2). The `/labs/entry` boot overlay is a separate
> implementation and does not import it.

The following experimental files currently exist:

- `src/components/CinematicEntry.tsx`
- `src/components/CinematicEntry.module.css`
- `src/components/BootScreen.tsx`
- `src/components/BootScreen.module.css`
- `public/cinematic-entry.mp4`
- `public/cinematic-entry-poster.webp`
- `public/cinematic-screen-bridge.webp`
- the `CinematicEntry` mount in `src/app/page.tsx`
- cinematic waiting/reveal styles in `src/app/page.module.css`

`public/cinematic-entry.mp4` is currently a roughly five-second, 2×-speed web
encode derived from the selected generated clip. The screen bridge is a cropped
still from its last frame.

These files are evidence/prototype material, **not an approved foundation**.
The next implementation may remove or replace them, but must inspect the
working-tree diff first and must not destroy unrelated user edits.

The existing generated video may be used temporarily to prototype a hidden
cut into the Three.js monitor scene. Do not assume it is a final production
asset.

## 8. Existing site that must be preserved

Preserve the current semantic portfolio and routes unless the user explicitly
requests a separate redesign:

- `/`: Hero, Selected Work, Experience, Capabilities, Education, Lab, Contact;
- `/projects`: project archive;
- `/about`: professional/personal context;
- `/desktop`, `/oobe`, `/demo`: Windows 7/Aero experiments;
- shared content in `src/data/portfolio.ts`;
- responsive, keyboard, reduced-motion and low-power behaviour.

The new Three.js layer is an enhancement around the Hero. It must not replace
the whole portfolio or make project/contact content dependent on GPU support.

## 9. Behaviour, fallback and accessibility

- Play the full sequence once per browser session by default.
- Provide `?intro=1` or an equivalent internal debug switch for replay.
- Show `SKIP INTRO` within one second; keyboard and touch must work.
- Skip and natural completion must land in the same stable DOM/canvas state.
- Never replay during normal internal navigation.
- Autoplay is muted; audio is not required.
- `prefers-reduced-motion` skips the camera flight and enters through a short
  monitor/live-Hero dissolve.
- Mobile/coarse-pointer devices may use a poster or much shorter screen-only
  transition rather than the full city flight.
- If video, model or WebGL initialisation fails, show the readable portfolio
  immediately with the existing Canvas 2D/static fallback.
- Screen readers encounter the real page structure, not decorative scene beats.
- Restore scroll and predictable focus after completion/Skip.

Progressive fallback chain:

```text
hybrid video + Three.js takeover
  -> Three.js monitor/Hero only
  -> current Canvas 2D glyph rain
  -> static CSS atmosphere
  -> plain semantic portfolio
```

## 10. Performance expectations

- Target smooth 60 fps on a normal desktop; degrade intentionally toward 30 fps
  on lower-power devices.
- A transition frame should not freeze noticeably; specifically, avoid a
  single-frame stall near the video/WebGL or WebGL/DOM takeover.
- Preload only the assets needed during the five-second entry.
- Lazy-load optional Three.js/postprocessing code without delaying readable
  content or Skip.
- Use compressed textures/models where appropriate and keep the entry asset
  budget explicit.
- Pause or reduce animation when `document.hidden`, when the Hero is far outside
  the viewport, or when reduced motion is requested.
- Do not maintain both an expensive hidden canvas and an expensive visible
  canvas.

## 11. Rebuild order

Do not immediately wire a new renderer into the production Hero. Use this order:

1. ~~Inspect `git status`/diff and preserve all unrelated edits.~~ done
2. ~~Disable or isolate the rejected cinematic prototype without deleting source
   evidence.~~ superseded — the new work is a separate route, so `/` was left
   entirely alone rather than disabled.
3. ~~Build a dedicated local prototype route/component for only the final
   monitor-to-fullscreen transition.~~ done — `/labs/entry`
4. ~~Prove that the same live render target continues moving through monitor,
   fullscreen and DOM reveal states.~~ done, and approved
5. ~~Add the compact boot window inside that continuous screen system.~~ done —
   HTML overlay projected onto the screen plane every frame
6. ~~Get user approval for the final 1.5 seconds before adding city/room
   footage.~~ approved
7. ~~Add the exterior/room segment and conceal its cut into the approved Three.js
   endpoint.~~ done — and **there is no cut to conceal**: forced perspective keeps
   the hero building close enough that the whole move stays on one curve
8. ~~Compress the complete timing to approximately five seconds.~~ done — 4.4s
   flight + ~0.6s boot tail
9. ~~Add Skip, session, reduced-motion, mobile and failure fallbacks.~~ done, see
   §0 "Verified vs not"
10. **← NEXT.** Integrate into `/` only after the isolated prototype is approved.
    Open questions for that step: the WebGL host must become the hero background
    rather than a fixed full-viewport layer (the `IntersectionObserver` pause is
    already in place for this), and `/about` and `/projects` still run the
    Canvas 2D `MatrixRain` — two expensive canvases must not coexist.
11. Run production build and regression checks for all existing routes.

Independent of the above: the city's visual quality is **not** signed off. See §0
decision 4 — it needs licensed glTF assets supplied by the user. Integration and
assets are decoupled; integrating now does not block swapping the city later.

The critical reversal from the previous attempt is: **approve the live endpoint
first, then build the cinematic backward from it**.

## 12. Acceptance criteria

The rebuild is not complete until all of these are true. Status is against
`/labs/entry`; nothing is signed off for `/` until step 10 lands.

| Criterion | Status |
| --- | --- |
| Reaches the interactive page at roughly five seconds | met — 4.4s + ~0.6s boot tail |
| Exterior, workspace, dual monitors, main screen all readable | **unconfirmed** — beats are numerically correct but unobserved in motion |
| Final monitor geometry stable, bezel leaves the viewport cleanly | met — re-docks every frame, exact across aspect |
| Glyphs visibly continue moving through the handoff | met by construction — nothing is swapped |
| No static-frame pause, layer swap, flash or reload | **needs eyes** — the transit darkens 5.3% → 0.34% bright pixels over ~0.5s; correct, but may read as a flash |
| Boot window embedded in the screen, not appended | met — projected onto the screen plane per frame; suppressed entirely on repeat visits |
| Typography reveals only after the screen signal | met |
| Skip available within one second, same final state | met — present immediately, pose identical to 1e-6 |
| Usable portfolio without WebGL | met — Canvas 2D fallback, verified |
| Simplified on mobile / reduced motion | met — `short` flight, verified at 375px |
| Existing routes do not regress | met — `/` untouched; lint, typecheck and build clean across all 8 routes |
| City reads as a real city | **not met** — see §0 decision 4 |

## 13. Explicit non-goals

- Do not keep patching the current static crossfade until it is called done.
- Do not put the entire portfolio into a WebGL canvas.
- Do not require WebGPU on the main route.
- Do not create a full photoreal city from scratch before proving the last
  monitor transition.
- Do not use official Matrix logos, dialogue, fonts, film footage or ripped
  audio.
- Do not copy MotionSite templates or *The Matrix Awakens* assets.
- Do not make the intro mandatory, unskippable or repeat on every navigation.
- Do not add a loader after a five-second intro and call the total sequence five
  seconds.

## 14. One-paragraph brief for the next implementation session

> **Superseded — this describes work that is now done.** The current brief is:
> watch `/labs/entry?intro=1` in a real browser and judge whether the motion
> reads, especially the darkening at the window transit. Then either integrate
> into `/` (§11 step 10) or wait on licensed glTF city assets (§0 decision 4) —
> the two are independent. Kept below for the original framing.

Rebuild the rejected cinematic entry as an isolated Three.js/WebGL prototype.
First prove a continuous final 1.5-second sequence in which a modern IPS monitor
shows moving Matrix-inspired glyph rain, the compact `ZL://BOOT_SEQUENCE` runs
inside it, the camera moves until the screen fills the viewport, and the exact
same live render target continues as the semantic homepage Hero background.
There must be no static bridge, motion reset, route change or visible fade
between unrelated layers. After that endpoint is approved, attach a short
Sydney-building-to-dual-monitor exterior/workspace segment and keep the complete
experience near five seconds with Skip, session, reduced-motion, mobile and
Canvas 2D/static fallbacks.
