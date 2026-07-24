# Cinematic entry production brief

> Created: 2026-07-21
> Status: concept approved; art direction, keyframes and assets pending.

## Objective

Create an original, apparently continuous cinematic move from a Sydney exterior
into Zizhen Liu's developer workspace. The camera finishes at the primary
monitor, which boots into an original Matrix-inspired interface and expands to
become the real portfolio.

The result should communicate place, engineering identity and technical depth
before it communicates spectacle.

## Viewer experience

```text
Sydney exterior
  -> building approach
  -> window / hidden cut
  -> personal developer workspace
  -> desk and monitor approach
  -> phosphor terminal boot
  -> monitor fills the viewport
  -> live portfolio takes control
```

Target duration: about 7–8 seconds; maximum 9 seconds.

## Storyboard beats

### Beat 1 — exterior

- Night, blue-hour or late-evening Sydney atmosphere.
- Contemporary building, believable rather than fantastical megacity.
- One restrained green light signal may motivate the target window.
- Camera movement begins smoothly with a clear destination.

### Beat 2 — window transition

- Camera accelerates toward the selected window.
- A mullion, dark occlusion, reflection or motion-blurred facade may hide a cut.
- Exterior and interior lighting direction must remain coherent.
- Avoid physically impossible glass melting unless used as a deliberate digital
  signal transition.

### Beat 3 — workspace reveal

- The room should feel used by a software/GPU engineer, not like a generic
  influencer gaming setup.
- Candidate props: workstation, compact hardware/PCB element, camera or lens,
  understated automotive object, notebook and practical task lighting.
- Props must not compete with the monitor endpoint.
- Avoid visible third-party logos unless owned/cleared and intentionally shown.

### Beat 4 — monitor boot

- Camera approaches a stable, geometrically consistent monitor arrangement.
- Screen content should be blank/keyed during generative production.
- Composite real boot content later; do not accept AI-generated code or text.
- Suggested original boot language:

```text
WAKE SIGNAL .............. OK
GPU DEVICE ............... ONLINE
PORTFOLIO NODE ........... READY
IDENTITY: ZIZHEN LIU
ENTERING SYSTEM
```

- Avoid official Matrix dialogue, logos, fonts and film imagery.

### Beat 5 — takeover

- Main monitor becomes close to front-facing.
- Bezel exits the viewport or becomes visually negligible.
- The composed terminal frame matches the live Hero's background, focal point
  and luminance.
- A brief CRT sync, scan or signal lock may conceal the final transition.
- The video layer fades away while the live page continues the motion.

## Production strategy

Do not depend on a single long AI-video generation. Use a controlled hybrid:

1. approve the final desk/monitor keyframe;
2. build the room-entry and exterior keyframes around that endpoint;
3. generate two or three short clips with consistent camera direction;
4. place hidden cuts behind architecture, darkness or fast motion;
5. stabilise and clean structural errors;
6. track/replace the monitor content in post;
7. export web delivery assets and an exact final-frame poster.

Traditional 3D, AI video, compositing and editorial techniques may be mixed.
The final viewer illusion matters more than claiming a literal single take.

## Required keyframes before animation

- Exterior establishing frame.
- Target-window approach frame.
- First readable interior/workspace frame.
- Desk approach frame.
- Final near-front-facing monitor frame.
- Real live-Hero frame used for the handoff match.
- Mobile crop/storyboard frame for each beat or an approved poster-only mobile
  decision.

## Delivery assets

Provisional targets, to be confirmed after test encodes:

| Asset | Target |
| --- | --- |
| Desktop master | 16:9, 1920×1080, 24/30 fps, visually lossless working master |
| Desktop WebM | Muted VP9/AV1 delivery encode |
| Desktop MP4 | Muted H.264 fallback |
| Final poster | Optimised AVIF/WebP and compatible fallback if required |
| Mobile | Dedicated short portrait/crop encode, or approved final-poster entry |
| Screen composite | Clean boot animation and exact final Hero-match frame |

Keep source masters, prompts, seeds/settings where available, edit project
files, licences and provenance notes outside the optimised public assets.

## Live handoff requirements

- The actual `/` page is loaded beneath the cinematic layer.
- No route change or page reload occurs at takeover.
- Natural completion and Skip reach the same state.
- The full sequence plays once per browser session.
- A visible Skip control appears by one second.
- Autoplay failure, video error or timeout enters through the poster immediately.
- Reduced-motion users see a brief poster-to-Hero dissolve.
- Mobile may bypass the full video by design.

## Visual continuity requirements

- Deep near-black background remains consistent across video and live page.
- Phosphor green is the dominant system colour.
- Cool cyan is a sparse network/depth accent; amber is reserved for status.
- The live spatial effect starts as recognisable glyph rain and only then bends
  into data streams.
- Avoid rainbow fibre optics, generic purple SaaS gradients and excessive gamer
  RGB lighting.
- The workstation screen and live Hero must share a common focal point.

## Review checklist

- Does the shot establish Sydney/personal context without becoming tourism or
  architecture advertising?
- Does the room look like Zizhen's workspace rather than a stock AI scene?
- Are monitors and major props geometrically stable through the shot?
- Is every hidden cut invisible at normal playback speed?
- Can the final screen be matched to the live page without a noticeable jump?
- Does Skip feel like entering the same destination rather than abandoning the
  experience?
- Does the result remain complete without video, audio or GPU rendering?
- Are all assets original, owned or correctly licensed for portfolio use?

## Out of scope for the first release

- A fully real-time WebGL/WebGPU exterior, building and room.
- Interactive camera control during the cinematic.
- Mandatory audio or voiceover.
- Multiple alternate cinematic routes.
- A long narrative before the visitor can reach work/contact information.
- Copying the reference video's city, room, props, UI or exact camera path.
