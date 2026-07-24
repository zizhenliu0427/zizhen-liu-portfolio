# Portfolio cinematic/Three.js rebuild handoff

> Updated: 2026-07-25<br>
> Decision status: **restart required**<br>
> Current cinematic prototype: **not approved; do not polish it further**<br>
> Next direction: build an isolated Three.js/WebGL proof of concept first, then
> integrate it only after the monitor-to-page handoff is convincing.

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

## 7. Current prototype: what exists and how to treat it

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

1. Inspect `git status`/diff and preserve all unrelated edits.
2. Disable or isolate the rejected cinematic prototype without deleting source
   evidence.
3. Build a dedicated local prototype route/component for only the final
   monitor-to-fullscreen transition.
4. Prove that the same live render target continues moving through monitor,
   fullscreen and DOM reveal states.
5. Add the compact boot window inside that continuous screen system.
6. Get user approval for the final 1.5 seconds before adding city/room footage.
7. Add the exterior/room segment and conceal its cut into the approved Three.js
   endpoint.
8. Compress the complete timing to approximately five seconds.
9. Add Skip, session, reduced-motion, mobile and failure fallbacks.
10. Integrate into `/` only after the isolated prototype is approved.
11. Run production build and regression checks for all existing routes.

The critical reversal from the previous attempt is: **approve the live endpoint
first, then build the cinematic backward from it**.

## 12. Acceptance criteria

The rebuild is not complete until all of these are true:

- The complete entrance reaches the interactive homepage at roughly five
  seconds.
- Exterior, workspace, dual monitors and final main-screen target are readable
  despite the short duration.
- The final monitor geometry is stable and its bezel leaves the viewport
  cleanly.
- Glyphs visibly continue moving through the monitor-to-page handoff.
- No static-frame pause, obvious layer swap, black/white flash or route reload
  is visible.
- The compact ZL boot window is present and feels embedded in the screen rather
  than appended afterward.
- Homepage typography/panels reveal only after the screen signal is established.
- Skip is available within one second and reaches exactly the same final state.
- The result remains a usable portfolio when video or WebGL is unavailable.
- Motion is smooth on desktop and deliberately simplified on mobile/reduced
  motion.
- Existing portfolio, project, About and Aero routes do not regress.

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
