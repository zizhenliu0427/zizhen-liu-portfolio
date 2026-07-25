"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlyphRainField } from "./glyphRain";
import { createPostFx } from "./postFx";
import { createCityscape, FACADE_Z } from "./cityscape";
import { markIntroSeen, type IntroFlight } from "./introPlan";
import styles from "./MonitorHandoff.module.css";

/**
 * The full cinematic entry: night city, through a window, into the workspace,
 * onto the main display, and out into the page — one scene, one camera, one
 * unbroken curve. There is no cut, no video, no bridge frame and no crossfade
 * anywhere in the sequence, and the glyph simulation on the monitor is the same
 * running simulation that becomes the page background.
 */

const SCREEN_W = 1.6;
const SCREEN_H = 0.9;
const FLIGHT_MS = 4400;
const BOOT_AT = 0.86; // progress at which the boot window appears

/**
 * Interior shell. Sized from the monitor: SCREEN_H of 0.9 units stands in for a
 * ~0.35 m panel, so one unit is ~0.39 m. The desk surface therefore has to sit
 * ~1.9 units above the floor and the ceiling ~6.7 units above that, otherwise
 * the room reads as a crawlspace with a desk on the ground.
 */
const ROOM_HALF_W = 5;
const ROOM_FLOOR = -2.7;
const ROOM_CEILING = 4;
const ROOM_BACK_Z = -2.6;

/** Dissolve length for the reduced-motion / small-screen entry. */
const SHORT_MS = 620;

type Props = {
  /** Fires once the screen owns the viewport and the DOM may reveal. */
  onDocked?: () => void;
  /** How much of the camera move to play. See `introPlan.ts`. */
  flight: IntroFlight;
};

/**
 * Fraction of the flight spent outside the building. The exterior leg is ~41
 * world units and the interior leg is barely 1.3, so a single easing over the
 * whole curve gives the room a fifth of the runtime no matter how it is shaped.
 * Splitting the timeline at the facade is the only way to control the beats.
 */
const EXTERIOR_TIME = 0.62;
/** Exponential approach: constant *apparent* growth rate, not constant speed. */
const APPROACH_K = 3.5;
/**
 * Chosen so du/dt matches across the facade crossing. Without matching, the
 * camera visibly changes speed at the transit.
 */
const INTERIOR_POWER = 1.4;

const approachEase = (x: number) =>
  (1 - Math.exp(-APPROACH_K * x)) / (1 - Math.exp(-APPROACH_K));
const interiorEase = (x: number) => 1 - Math.pow(1 - x, INTERIOR_POWER);

/** Distance at which a SCREEN_W x SCREEN_H plane exactly covers the frustum. */
function dockDistance(camera: THREE.PerspectiveCamera) {
  const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  return Math.min(
    SCREEN_H / 2 / halfFov,
    SCREEN_W / 2 / (halfFov * camera.aspect),
  ) * 0.995;
}

export default function MonitorHandoff({ onDocked, flight }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const dockedRef = useRef(onDocked);
  useEffect(() => {
    dockedRef.current = onDocked;
  }, [onDocked]);

  const [bootVisible, setBootVisible] = useState(false);
  const skipRef = useRef<() => void>(() => {});
  const scrollReleaseRef = useRef<() => void>(() => {});
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        // Lets review tooling screenshot a manually driven frame.
        preserveDrawingBuffer: process.env.NODE_ENV !== "production",
      });
    } catch {
      // No WebGL: hide the decorative layer and let the page reveal at once.
      host.style.display = "none";
      dockedRef.current?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x02060a, 1);
    host.appendChild(renderer.domElement);

    // --- live glyph field -------------------------------------------------
    const rain = createGlyphRainField(1280, 720);
    const post = createPostFx(
      Math.max(1, Math.round(host.clientWidth * renderer.getPixelRatio())),
      Math.max(1, Math.round(host.clientHeight * renderer.getPixelRatio())),
    );

    // --- scene ------------------------------------------------------------
    const scene = new THREE.Scene();
    // Linear fog rather than exponential: the shot spans 1 to 300 units, and an
    // exp2 density tuned for the room erases the skyline completely.
    scene.fog = new THREE.Fog(0x02060a, 20, 420);

    const city = createCityscape(rain.texture);
    scene.add(city.group);

    const camera = new THREE.PerspectiveCamera(
      38,
      host.clientWidth / host.clientHeight,
      0.05,
      900,
    );

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
      new THREE.MeshBasicMaterial({ map: rain.texture, toneMapped: false }),
    );
    scene.add(screen);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(SCREEN_W + 0.05, SCREEN_H + 0.05, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0x0e1216,
        roughness: 0.55,
        metalness: 0.5,
      }),
    );
    bezel.position.z = -0.028;
    scene.add(bezel);

    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.34, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x0b0f13, roughness: 0.6, metalness: 0.6 }),
    );
    stand.position.set(0, -SCREEN_H / 2 - 0.16, -0.05);
    scene.add(stand);

    // Second display, angled in from the left.
    const sideScreen = new THREE.Mesh(
      new THREE.BoxGeometry(SCREEN_W + 0.05, SCREEN_H + 0.05, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x0c1014, roughness: 0.5, metalness: 0.5 }),
    );
    sideScreen.position.set(-1.62, 0.02, -0.42);
    sideScreen.rotation.y = 0.55;
    scene.add(sideScreen);

    // The same live field. A render-target texture cannot be cloned for a
    // second uv transform (the clone has no GPU handle), so the copy is
    // mirrored and dimmed instead of re-sampled.
    const sideGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
      new THREE.MeshBasicMaterial({
        map: rain.texture,
        toneMapped: false,
        // Additive rather than alpha-blended: blending 50% over the dark bezel
        // desaturated the glyphs to grey.
        blending: THREE.AdditiveBlending,
        opacity: 0.55,
        transparent: true,
      }),
    );
    sideGlow.position.copy(sideScreen.position);
    sideGlow.rotation.copy(sideScreen.rotation);
    sideGlow.translateZ(0.03);
    sideGlow.scale.x = -1;
    scene.add(sideGlow);

    const DESK_Y = -SCREEN_H / 2 - 0.34;
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.07, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x05070a, roughness: 0.94, metalness: 0.06 }),
    );
    desk.position.set(0, DESK_Y, 0.2);
    scene.add(desk);

    // --- room shell -------------------------------------------------------
    // Encloses the desk so that once the camera is inside the building it sees
    // an interior, not the city geometry beyond.
    const shellMaterial = new THREE.MeshStandardMaterial({
      color: 0x070a0c,
      roughness: 1,
      side: THREE.DoubleSide,
    });
    const roomDepth = FACADE_Z - ROOM_BACK_Z;
    const roomCentreZ = (FACADE_Z + ROOM_BACK_Z) / 2;

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM_HALF_W * 2, ROOM_CEILING - ROOM_FLOOR),
      shellMaterial,
    );
    backWall.position.set(0, (ROOM_CEILING + ROOM_FLOOR) / 2, ROOM_BACK_Z);
    scene.add(backWall);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM_HALF_W * 2, roomDepth),
      shellMaterial,
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, ROOM_FLOOR, roomCentreZ);
    scene.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(ROOM_HALF_W * 2, roomDepth),
      shellMaterial,
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, ROOM_CEILING, roomCentreZ);
    scene.add(ceiling);

    [-ROOM_HALF_W, ROOM_HALF_W].forEach((x) => {
      const sideWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDepth, ROOM_CEILING - ROOM_FLOOR),
        shellMaterial,
      );
      sideWall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      sideWall.position.set(x, (ROOM_CEILING + ROOM_FLOOR) / 2, roomCentreZ);
      scene.add(sideWall);
    });

    // --- desk props -------------------------------------------------------
    // Silhouettes only. They exist to give scale and to say someone works
    // here; none of them should pull focus from the screen.
    const propMaterial = new THREE.MeshStandardMaterial({
      color: 0x151a20,
      roughness: 0.68,
      metalness: 0.3,
    });
    const propTop = DESK_Y + 0.035;

    const addProp = (
      geometry: THREE.BufferGeometry,
      x: number,
      y: number,
      z: number,
      rotY = 0,
    ) => {
      const mesh = new THREE.Mesh(geometry, propMaterial);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      scene.add(mesh);
      return mesh;
    };

    // Keyboard: a base plus a keycap-height lip that catches the screen light.
    addProp(new THREE.BoxGeometry(0.86, 0.028, 0.26), -0.06, propTop + 0.014, 0.66, -0.04);
    addProp(new THREE.BoxGeometry(0.82, 0.014, 0.22), -0.06, propTop + 0.036, 0.655, -0.04);
    addProp(new THREE.BoxGeometry(0.1, 0.032, 0.16), 0.56, propTop + 0.016, 0.64);

    addProp(new THREE.CylinderGeometry(0.058, 0.05, 0.13, 18), 0.98, propTop + 0.065, 0.5);

    // Headphones on a stand, left of the keyboard.
    addProp(new THREE.CylinderGeometry(0.055, 0.075, 0.016, 16), -1.02, propTop + 0.008, 0.44);
    addProp(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 10), -1.02, propTop + 0.16, 0.44);
    const headband = addProp(
      new THREE.TorusGeometry(0.085, 0.016, 8, 20, Math.PI),
      -1.02,
      propTop + 0.3,
      0.44,
    );
    headband.rotation.x = Math.PI / 2;
    const earCup = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 14);
    [-1.105, -0.935].forEach((x) => {
      const cup = addProp(earCup, x, propTop + 0.3, 0.44);
      cup.rotation.z = Math.PI / 2;
    });

    // Tower under the right end of the desk. It stays an unlit silhouette —
    // an emissive status LED here just read as a stray bright line.
    addProp(new THREE.BoxGeometry(0.42, 0.86, 0.9), 1.55, DESK_Y - 0.47, -0.1, -0.12);

    // Shelf behind, breaking up the empty wall.
    addProp(new THREE.BoxGeometry(2.4, 0.05, 0.3), -1.1, 0.92, -2.24);
    addProp(new THREE.BoxGeometry(0.26, 0.34, 0.22), -1.85, 1.12, -2.24, 0.2);
    addProp(new THREE.BoxGeometry(0.2, 0.28, 0.2), -1.5, 1.09, -2.24, -0.3);
    addProp(new THREE.BoxGeometry(0.5, 0.16, 0.24), -0.55, 1.03, -2.24);

    // --- lighting ---------------------------------------------------------
    // The screens are the only meaningful sources. Tight falloff keeps the
    // desk from turning into one broad green gradient.
    const screenLight = new THREE.PointLight(0x4dff96, 7.5, 4.4, 2.1);
    screenLight.position.set(0, -0.05, 0.36);
    scene.add(screenLight);

    // No second point light for the left display: any light close enough to a
    // flat panel to spill usefully also paints a round hotspot on it, which
    // showed straight through the semi-transparent glow plane.

    // A cold, very dim fill so silhouettes do not crush to pure black.
    const fill = new THREE.DirectionalLight(0x1b2a38, 0.9);
    fill.position.set(-0.6, 1.2, 1.4);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x0d151a, 1.2));

    // --- camera timeline --------------------------------------------------
    // Two curves: where the camera is, and what it is aimed at. Aiming via a
    // moving look-at target rather than slerped keyframes keeps the turn
    // readable and guarantees the final orientation exactly — at the end the
    // target is the screen centre, so the docked pose is exact by construction.
    let dockDist = dockDistance(camera);

    const makeCurve = (count: number) =>
      new THREE.CatmullRomCurve3(
        Array.from({ length: count }, () => new THREE.Vector3()),
      );
    const path = makeCurve(7);
    const aim = makeCurve(7);

    const rebuildPath = () => {
      dockDist = dockDistance(camera);

      // Exterior, high and off-axis -> window approach -> through the facade
      // -> settle onto the display.
      // Close enough that the hero building is a substantial shape in frame one
      // with the city framing it. Wider establishing shots were tried first and
      // read as wallpaper: a 22-unit mid-rise cannot compete with 150-unit
      // towers for attention, so the shot comes to it instead.
      path.points[0].set(18, 14, 44);
      path.points[1].set(12, 9, 28);
      path.points[2].set(5.5, 4.2, 14);
      path.points[3].set(1.8, 1.5, FACADE_Z + 2.8);
      path.points[4].set(0.4, 0.4, FACADE_Z - 0.4);
      path.points[5].set(0.05, 0.08, dockDist + 0.6);
      path.points[6].set(0, 0, dockDist);

      // Aim starts high on the building, walks down to the window, then onto
      // the screen. The last point is the screen centre, so the docked
      // orientation comes out exact rather than approximately right.
      aim.points[0].set(0, 6, FACADE_Z);
      aim.points[1].set(0, 4, FACADE_Z);
      aim.points[2].set(0, 2.0, FACADE_Z);
      aim.points[3].set(0, 0.5, 1.4);
      aim.points[4].set(0, 0.12, 0.35);
      aim.points[5].set(0, 0.01, 0);
      aim.points[6].set(0, 0, 0);

      // getPointAt needs the arc-length table rebuilt after moving points.
      path.updateArcLengths();
      aim.updateArcLengths();

      // Locate the facade crossing along the arc so the timeline can be split
      // there. Binary search rather than a constant: the curve's arc length
      // shifts slightly with dockDist, which depends on viewport aspect.
      let low = 0;
      let high = 1;
      for (let i = 0; i < 24; i++) {
        const mid = (low + high) / 2;
        if (path.getPointAt(mid).z > FACADE_Z) low = mid;
        else high = mid;
      }
      facadeU = (low + high) / 2;
    };
    let facadeU = 0.95;
    rebuildPath();

    const aimTarget = new THREE.Vector3();
    const dock = () => {
      camera.position.copy(path.points[6]);
      camera.lookAt(0, 0, 0);
    };

    let docked = false;
    let notified = false;
    let bootShown = false;
    let bootExitTimer = 0;
    const showBoot = () => {
      if (bootShown) return;
      bootShown = true;
      setBootVisible(true);
    };
    let startedAt = 0;
    let raf = 0;
    const clock = new THREE.Clock();

    // Once the page owns the viewport the field has to stop competing with the
    // typography. Dimming the running simulation keeps motion continuous —
    // a scrim over it would not. Declared before settle(), which reads them on
    // the reduced-motion path.
    const FIELD_FULL = 1.2;
    const FIELD_BEHIND_CONTENT = 0.46;
    let fieldTarget = FIELD_FULL;
    let fieldLevel = FIELD_FULL;
    let lastElapsed = 0;

    const settle = () => {
      if (notified) return;
      notified = true;
      docked = true;
      // A repeat visitor gets no boot window: re-running it on every navigation
      // is exactly the "artificially appended loader" the brief rules out.
      if (flight !== "none") {
        showBoot();
        bootExitTimer = window.setTimeout(() => setBootVisible(false), 620);
      }
      scrollReleaseRef.current();
      // Removed rather than styled away, so it leaves the tab order too.
      skipButtonRef.current?.setAttribute("hidden", "");
      dockedRef.current?.();
      markIntroSeen();
      fieldTarget = FIELD_BEHIND_CONTENT;
    };

    // Only the full flight animates the camera; the others open already docked.
    const flightActive = flight === "full";
    let shortTimer = 0;
    if (flight === "none") {
      dock();
      settle();
    } else if (flight === "short") {
      dock();
      showBoot();
      shortTimer = window.setTimeout(settle, SHORT_MS);
    }

    // --- boot overlay tracking -------------------------------------------
    const corner = new THREE.Vector3();
    const positionBoot = () => {
      const boot = bootRef.current;
      if (!boot) return;
      // project() reads matrixWorldInverse, which the renderer only refreshes
      // during render — refresh it here or the overlay lags a frame behind.
      camera.updateMatrixWorld();
      // Project the screen plane and size the HTML overlay to match it, so the
      // boot window reads as content living inside the display.
      corner.set(-SCREEN_W / 2, SCREEN_H / 2, 0).project(camera);
      const left = (corner.x * 0.5 + 0.5) * host.clientWidth;
      const top = (-corner.y * 0.5 + 0.5) * host.clientHeight;
      corner.set(SCREEN_W / 2, -SCREEN_H / 2, 0).project(camera);
      const right = (corner.x * 0.5 + 0.5) * host.clientWidth;
      const bottom = (-corner.y * 0.5 + 0.5) * host.clientHeight;

      boot.style.left = `${left}px`;
      boot.style.top = `${top}px`;
      boot.style.width = `${Math.max(0, right - left)}px`;
      boot.style.height = `${Math.max(0, bottom - top)}px`;
    };

    /** Places the camera for a flight progress in [0,1] and draws one frame. */
    const drawAt = (progress: number, elapsed: number) => {
      const dt = Math.max(0, Math.min(0.1, elapsed - lastElapsed));
      lastElapsed = elapsed;
      fieldLevel += (fieldTarget - fieldLevel) * (1 - Math.exp(-dt / 0.34));
      rain.setIntensity(fieldLevel);

      if (progress >= 1) {
        // Re-dock every frame so resizes keep the plane exactly covering.
        dock();
      } else {
        const eased =
          progress < EXTERIOR_TIME
            ? facadeU * approachEase(progress / EXTERIOR_TIME)
            : facadeU +
              (1 - facadeU) *
                interiorEase((progress - EXTERIOR_TIME) / (1 - EXTERIOR_TIME));
        // getPointAt, not getPoint: arc-length parameterisation puts speed
        // entirely under the easing function instead of leaving it at the mercy
        // of how far apart the control points happen to be.
        camera.position.copy(path.getPointAt(eased));
        camera.lookAt(aim.getPointAt(eased, aimTarget));

        city.setApproach(camera.position.z - FACADE_Z);
      }

      // One simulation step, then one scene draw. Order matters: the monitor
      // material samples the target written this same frame.
      rain.render(renderer, elapsed);
      positionBoot();
      post.render(renderer, scene, camera, elapsed);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!startedAt) startedAt = performance.now();

      const progress =
        docked || !flightActive
          ? 1
          : Math.min(1, (performance.now() - startedAt) / FLIGHT_MS);
      if (flightActive && progress >= BOOT_AT) showBoot();

      drawAt(progress, clock.getElapsedTime());

      if (progress >= 1 && !docked) settle();
    };

    raf = requestAnimationFrame(frame);
    // Paint one frame immediately so the first composite is never an empty
    // canvas, even if rAF is throttled at mount.
    drawAt(flightActive ? 0 : 1, 0);

    // Skip and natural completion have to land in exactly the same state, so
    // both go through dock() + settle() and nothing else.
    skipRef.current = () => {
      if (docked) return;
      dock();
      settle();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!flightActive || docked) return;
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        skipRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Hold scroll only while the camera is actually flying, and restore the
    // exact prior values rather than clearing the property.
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    if (flightActive) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    const releaseScroll = () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
    };
    scrollReleaseRef.current = releaseScroll;

    // Dev-only handle for deterministic frame capture during review. Headless
    // preview panes report document.hidden, which starves rAF.
    const debugWindow = window as typeof window & {
      __zlEntry?: {
        capture(progress: number, elapsed: number): string;
        showBoot(): void;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        screen: THREE.Mesh;
        rainStats(elapsed: number): {
          maxG: number;
          litPct: number;
          atlasAlpha: number;
        };
      };
    };
    if (process.env.NODE_ENV !== "production") {
      debugWindow.__zlEntry = {
        capture(progress, elapsed) {
          drawAt(progress, elapsed);
          // readPixels is reliable without preserveDrawingBuffer, unlike
          // canvas.toDataURL on a WebGL surface.
          const gl = renderer.getContext();
          const w = renderer.domElement.width;
          const h = renderer.domElement.height;
          const pixels = new Uint8Array(w * h * 4);
          gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

          const full = document.createElement("canvas");
          full.width = w;
          full.height = h;
          const fullCtx = full.getContext("2d");
          if (!fullCtx) return "";
          const image = fullCtx.createImageData(w, h);
          for (let y = 0; y < h; y++) {
            const src = (h - 1 - y) * w * 4;
            image.data.set(pixels.subarray(src, src + w * 4), y * w * 4);
          }
          fullCtx.putImageData(image, 0, 0);

          const small = document.createElement("canvas");
          small.width = 960;
          small.height = Math.round((h / w) * 960);
          small.getContext("2d")?.drawImage(full, 0, 0, small.width, small.height);
          return small.toDataURL("image/png");
        },
        showBoot,
        scene,
        camera,
        renderer,
        screen,
        rainStats(elapsed: number) {
          rain.render(renderer, elapsed);
          const w = 256;
          const h = 256;
          const buffer = new Uint8Array(w * h * 4);
          renderer.readRenderTargetPixels(rain.target, 0, 0, w, h, buffer);
          let maxG = 0;
          let lit = 0;
          for (let i = 0; i < buffer.length; i += 4) {
            if (buffer[i + 1] > maxG) maxG = buffer[i + 1];
            if (buffer[i + 1] > 20) lit++;
          }

          const atlasCtx = rain.atlasCanvas.getContext("2d");
          const atlasData = atlasCtx?.getImageData(0, 0, 512, 512).data;
          let atlasAlpha = 0;
          if (atlasData) {
            for (let i = 3; i < atlasData.length; i += 4) {
              if (atlasData[i] > 10) atlasAlpha++;
            }
          }
          return { maxG, litPct: (100 * lit) / (w * h), atlasAlpha };
        },
      };
    }

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      const ratio = renderer.getPixelRatio();
      post.setSize(
        Math.max(1, Math.round(w * ratio)),
        Math.max(1, Math.round(h * ratio)),
      );
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rebuildPath();
      if (docked) dock();
    };
    window.addEventListener("resize", onResize);

    // Declared before onVisibility, which reads it.
    let onScreen = true;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && onScreen) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Stop simulating when the canvas is scrolled out of view. A no-op while the
    // host is a fixed full-viewport layer, but it is the mechanism the hero
    // background needs once this is mounted inside the page on `/`.
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (!onScreen) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (!raf && !document.hidden) {
          raf = requestAnimationFrame(frame);
        }
      },
      { rootMargin: "10%" },
    );
    observer.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(bootExitTimer);
      window.clearTimeout(shortTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      releaseScroll();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material.dispose();
        }
      });
      rain.dispose();
      post.dispose();
      city.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // The scene is built once; React state is only used for overlay chrome.
  }, [flight]);

  return (
    <>
      <div
        className={`${styles.host} ${flight === "short" ? styles.dissolve : ""}`}
        ref={hostRef}
        // Decorative: screen readers get the real page structure underneath.
        aria-hidden="true"
      >
      <div
        className={`${styles.boot} ${bootVisible ? styles.bootVisible : ""}`}
        ref={bootRef}
        aria-hidden="true"
      >
        <div className={styles.bootWindow}>
          <p className={styles.bootTitle}>ZL://BOOT_SEQUENCE — V.01</p>
          <p className={styles.bootLine}>&gt; loading profile.sys <span>OK</span></p>
          <p className={styles.bootLine}>&gt; decrypting portfolio.dat <span>OK</span></p>
          <p className={styles.bootLine}>&gt; tracing signal <span>OK</span></p>
          <p className={styles.bootLine}>&gt; access granted — entering system<i /></p>
        </div>
      </div>
      </div>

      {/* Outside the aria-hidden host: a focusable control must never live
          inside a subtree hidden from assistive technology. */}
      {flight === "full" && (
        <button
          className={styles.skip}
          type="button"
          ref={skipButtonRef}
          onClick={() => skipRef.current()}
        >
          SKIP INTRO <span aria-hidden="true">↗</span>
        </button>
      )}
    </>
  );
}
