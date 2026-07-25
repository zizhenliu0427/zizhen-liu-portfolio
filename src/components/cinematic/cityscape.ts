import * as THREE from "three";

/**
 * Procedural night city. No models, no textures: buildings are instanced boxes
 * and every window is generated in the fragment shader from world position.
 *
 * Scale is deliberately forced. The room the camera ends up in is monitor-sized
 * (~1.6 world units across), so a to-scale skyscraper containing it would put
 * the camera 150+ units out and the flight would need an enormous deceleration
 * into the desk — or a hidden cut. Instead the hero building is a mid-rise a
 * short distance away and the genuinely huge towers sit far behind it, which
 * reads as the same city while keeping the whole move on one curve.
 */

/** Where the hero building's facade sits. The camera passes through it. */
export const FACADE_Z = 2.6;
const HERO_HALF_WIDTH = 5.5;
const HERO_BOTTOM = -7;
const HERO_TOP = 15;
const HERO_DEPTH = 13;
const GROUND_Y = HERO_BOTTOM;

/** The aperture the camera actually flies through. */
export const WINDOW_W = 3.6;
export const WINDOW_H = 2.6;
export const WINDOW_CY = 0.2;

const HASH = /* glsl */ `
float zlHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

const WINDOW_EMISSION = /* glsl */ `
{
  vec3 wp = vZlWorld;
  float horiz = 0.0;
  bool draw = true;

  #ifdef ZL_BOX
    // Unit-box local coords pick the face: no windows on roofs.
    vec3 al = abs(vZlLocal);
    if (al.y > 0.4999) draw = false;
    else if (al.x > al.z) horiz = wp.z;
    else horiz = wp.x;
  #else
    horiz = dot(wp, uHorizAxis);
  #endif

  if (draw) {
    // Per-block offset so neighbouring buildings do not share floor lines.
    float blockSeed = zlHash(floor(wp.xz / 34.0));
    // ~1.25 x 1.55 world units per window: at this scale the hero facade gets
    // roughly nine windows across and ten floors.
    vec2 g = vec2(horiz / 1.25, (wp.y + blockSeed * 4.0) / 1.55);
    vec2 cell = floor(g);
    vec2 f = fract(g);

    // Analytic AA, widened with distance. This is a cheap stand-in for depth of
    // field, and it is most of what stops a distant facade reading as a crisp
    // checkerboard of squares instead of a haze of lights.
    float haze = smoothstep(30.0, 240.0, vZlDepth);
    vec2 aa = fwidth(g) * 1.3 + 0.0015 + haze * 0.30;
    float rx = smoothstep(0.20 - aa.x, 0.20 + aa.x, f.x)
             * (1.0 - smoothstep(0.80 - aa.x, 0.80 + aa.x, f.x));
    float ry = smoothstep(0.24 - aa.y, 0.24 + aa.y, f.y)
             * (1.0 - smoothstep(0.78 - aa.y, 0.78 + aa.y, f.y));

    // Whole floors go dark, the way an office tower does at night. Purely
    // per-window randomness reads as noise rather than as a building.
    float floorLit = step(0.26, zlHash(vec2(cell.y, blockSeed * 31.0)));
    float on = step(0.60, zlHash(cell + blockSeed * 13.0)) * floorLit;
    float dim = 0.3 + 0.7 * zlHash(cell * 1.7 + 3.0);
    // Cold by default; warm is the rare accent, not the theme.
    vec3 tint = mix(
      vec3(0.48, 0.66, 0.95),
      vec3(1.0, 0.76, 0.46),
      step(0.78, zlHash(cell * 2.3 + 9.0))
    );
    gl_FragColor.rgb += tint * rx * ry * on * dim * uWindowGain * (1.0 + haze * 0.6);

    // Floor slabs only, and faint. Adding vertical piers as well turned every
    // facade into graph paper, which read worse than plain boxes did.
    float slab = 1.0 - smoothstep(0.0, 0.10 + aa.y, abs(f.y - 0.9));
    gl_FragColor.rgb += vec3(0.011, 0.014, 0.019) * slab * (1.0 - haze);
  }
}
`;

type WindowMaterialOptions = {
  mode: "box" | "plane";
  /** Plane mode only: which world axis runs horizontally across the surface. */
  horizontalAxis?: THREE.Vector3;
  gain?: number;
};

function createWindowMaterial({
  mode,
  horizontalAxis = new THREE.Vector3(1, 0, 0),
  gain = 1,
}: WindowMaterialOptions) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x03060a,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  if (mode === "box") material.defines = { ZL_BOX: "" };

  const uniforms = {
    uHorizAxis: { value: horizontalAxis },
    uWindowGain: { value: gain },
  };

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHorizAxis = uniforms.uHorizAxis;
    shader.uniforms.uWindowGain = uniforms.uWindowGain;

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vZlWorld;
         varying vec3 vZlLocal;
         varying float vZlDepth;`,
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
         vec4 zlPos = vec4(transformed, 1.0);
         #ifdef USE_INSTANCING
           zlPos = instanceMatrix * zlPos;
         #endif
         vZlWorld = (modelMatrix * zlPos).xyz;
         vZlLocal = transformed;
         vZlDepth = -mvPosition.z;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         varying vec3 vZlWorld;
         varying vec3 vZlLocal;
         varying float vZlDepth;
         uniform vec3 uHorizAxis;
         uniform float uWindowGain;
         ${HASH}`,
      )
      // Injected before fog so distance still washes the windows out.
      .replace("#include <fog_fragment>", `${WINDOW_EMISSION}\n#include <fog_fragment>`);
  };

  return material;
}

export type Cityscape = {
  group: THREE.Group;
  /**
   * Drives everything keyed to how close the camera is to the window, given the
   * distance to the aperture: the beacon glow (large enough to read from 44
   * units out, so it would flood the frame up close), the glass sheen, and the
   * light spilling out of the opening.
   */
  setApproach(distanceToWindow: number): void;
  dispose(): void;
};

/**
 * @param screenTexture live glyph field, shown faintly in the hero window so
 *   the light seen from outside is literally the monitor being flown toward.
 */
export function createCityscape(screenTexture: THREE.Texture): Cityscape {
  const group = new THREE.Group();
  const disposables: { dispose(): void }[] = [];

  const track = <T extends { dispose(): void }>(item: T) => {
    disposables.push(item);
    return item;
  };

  // --- sky ---------------------------------------------------------------
  // Against a flat black clear colour a night skyline has no silhouette. This
  // is a screen-space gradient drawn before everything, with a faint sodium
  // glow at the horizon standing in for city light pollution.
  const sky = new THREE.Mesh(
    track(new THREE.PlaneGeometry(2, 2)),
    track(
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL1,
        depthTest: false,
        depthWrite: false,
        vertexShader: /* glsl */ `
          precision highp float;
          attribute vec3 position;
          attribute vec2 uv;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          void main() {
            float h = clamp(vUv.y, 0.0, 1.0);
            vec3 top = vec3(0.004, 0.010, 0.020);
            vec3 horizon = vec3(0.055, 0.075, 0.105);
            vec3 color = mix(horizon, top, pow(h, 0.62));
            color += vec3(0.030, 0.020, 0.010) * pow(1.0 - h, 5.0);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    ),
  );
  sky.frustumCulled = false;
  sky.renderOrder = -1000;
  group.add(sky);

  // --- distant skyline ---------------------------------------------------
  const towerGeometry = track(new THREE.BoxGeometry(1, 1, 1));
  const towerMaterial = track(createWindowMaterial({ mode: "box", gain: 0.55 }));

  // Sections, not buildings: a tower is a base plus optional setbacks and a
  // crown. Single boxes are the main reason the first pass read as a bar chart.
  const MAX_SECTIONS = 620;
  const towers = new THREE.InstancedMesh(towerGeometry, towerMaterial, MAX_SECTIONS);
  towers.frustumCulled = false;

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();

  // Aviation obstruction lights on the tallest crowns. Small emissive boxes
  // rather than sprites so they read from any angle without billboarding.
  const MAX_BEACONS = 90;
  const beacons = new THREE.InstancedMesh(
    track(new THREE.BoxGeometry(0.55, 0.55, 0.55)),
    track(
      new THREE.MeshBasicMaterial({
        color: 0xff3b2a,
        toneMapped: false,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
    ),
    MAX_BEACONS,
  );
  beacons.frustumCulled = false;
  let beaconCount = 0;

  // Deterministic layout: the intro must look identical on every visit.
  let seed = 20260725;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  let placed = 0;
  const addSection = (
    cx: number,
    baseY: number,
    cz: number,
    w: number,
    hh: number,
    d: number,
  ) => {
    if (placed >= MAX_SECTIONS) return;
    position.set(cx, baseY + hh / 2, cz);
    scale.set(w, hh, d);
    // Deliberately axis-aligned. The window grid picks its horizontal axis from
    // unit-box local coordinates, so a rotated instance smears the pattern into
    // long streaks across the face — and a grid city reads better anyway.
    matrix.compose(position, quaternion, scale);
    towers.setMatrixAt(placed, matrix);
    placed++;
  };

  let guard = 0;
  while (placed < MAX_SECTIONS - 3 && guard++ < MAX_SECTIONS * 40) {
    const x = (random() - 0.5) * 420;
    const z = 26 - random() * 400;

    // Two clearances. The corridor keeps the hero building isolated in the near
    // field so it reads as the target; the radius around the start point stops a
    // tower spawning on top of the camera, which wrecked the opening frame.
    if (Math.abs(x) < 32 && z > -48) continue;
    if (Math.hypot(x - 18, z - 44) < 40) continue;

    const distance = Math.hypot(x, z);
    // Taller and wider the further out, so the skyline reads as monumental
    // without anything looming over the hero building.
    const height = 14 + random() * (distance > 90 ? 170 : 60);
    const width = 8 + random() * (distance > 90 ? 26 : 14);
    const depth = 8 + random() * 22;

    if (height < 55) {
      // Low-rise: a single mass plus a small rooftop plant box.
      addSection(x, GROUND_Y, z, width, height, depth);
      addSection(
        x + (random() - 0.5) * width * 0.3,
        GROUND_Y + height,
        z + (random() - 0.5) * depth * 0.3,
        width * 0.3,
        1.6 + random() * 2.4,
        depth * 0.3,
      );
      continue;
    }

    // Tower: base, setback shaft, crown. The stepped silhouette is what makes
    // it read as architecture rather than an extruded rectangle.
    const baseH = height * (0.5 + random() * 0.15);
    const shaftH = height * (0.26 + random() * 0.12);
    const crownH = Math.max(4, height - baseH - shaftH);

    addSection(x, GROUND_Y, z, width, baseH, depth);
    const shaftW = width * (0.7 + random() * 0.14);
    const shaftD = depth * (0.7 + random() * 0.14);
    addSection(x, GROUND_Y + baseH, z, shaftW, shaftH, shaftD);
    const crownW = shaftW * (0.5 + random() * 0.2);
    const crownD = shaftD * (0.5 + random() * 0.2);
    addSection(x, GROUND_Y + baseH + shaftH, z, crownW, crownH, crownD);

    const top = GROUND_Y + height;
    if (height > 110 && beaconCount < MAX_BEACONS) {
      // Mast plus the light itself.
      addSection(x, top, z, 0.5, 4 + random() * 5, 0.5);
      position.set(x, top + 5.5, z);
      scale.set(1, 1, 1);
      matrix.compose(position, quaternion, scale);
      beacons.setMatrixAt(beaconCount, matrix);
      beaconCount++;
    }
  }
  towers.count = placed;
  towers.instanceMatrix.needsUpdate = true;
  group.add(towers);

  beacons.count = beaconCount;
  beacons.instanceMatrix.needsUpdate = true;
  group.add(beacons);

  // --- ground ------------------------------------------------------------
  const ground = new THREE.Mesh(
    track(new THREE.PlaneGeometry(900, 900)),
    track(new THREE.MeshBasicMaterial({ color: 0x03050a, toneMapped: false })),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  group.add(ground);

  // --- hero building -----------------------------------------------------
  // Built as five walls with a genuine opening cut into the facade, rather than
  // a solid box the camera clips through. Flying through an unbroken wall did
  // not read as entering a window, which is the whole point of the shot.
  const facadeMaterial = track(
    createWindowMaterial({
      mode: "plane",
      horizontalAxis: new THREE.Vector3(1, 0, 0),
      gain: 0.48,
    }),
  );
  const flankMaterial = track(
    createWindowMaterial({
      mode: "plane",
      horizontalAxis: new THREE.Vector3(0, 0, 1),
      gain: 0.48,
    }),
  );

  const addWall = (
    material: THREE.Material,
    w: number,
    hh: number,
    px: number,
    py: number,
    pz: number,
    rotY = 0,
    rotX = 0,
  ) => {
    const wall = new THREE.Mesh(track(new THREE.PlaneGeometry(w, hh)), material);
    wall.position.set(px, py, pz);
    wall.rotation.set(rotX, rotY, 0);
    group.add(wall);
  };

  const heroH = HERO_TOP - HERO_BOTTOM;
  const heroCy = (HERO_TOP + HERO_BOTTOM) / 2;
  const winRight = WINDOW_W / 2;
  const winBottom = WINDOW_CY - WINDOW_H / 2;
  const winTop = WINDOW_CY + WINDOW_H / 2;

  // Facade in four pieces around the aperture.
  const sideW = HERO_HALF_WIDTH - winRight;
  addWall(facadeMaterial, sideW, heroH, -(winRight + sideW / 2), heroCy, FACADE_Z);
  addWall(facadeMaterial, sideW, heroH, winRight + sideW / 2, heroCy, FACADE_Z);
  addWall(
    facadeMaterial,
    WINDOW_W,
    HERO_TOP - winTop,
    0,
    (HERO_TOP + winTop) / 2,
    FACADE_Z,
  );
  addWall(
    facadeMaterial,
    WINDOW_W,
    winBottom - HERO_BOTTOM,
    0,
    (winBottom + HERO_BOTTOM) / 2,
    FACADE_Z,
  );

  // Flanks and back give the building volume from an approach angle.
  addWall(
    flankMaterial,
    HERO_DEPTH,
    heroH,
    -HERO_HALF_WIDTH,
    heroCy,
    FACADE_Z - HERO_DEPTH / 2,
    Math.PI / 2,
  );
  addWall(
    flankMaterial,
    HERO_DEPTH,
    heroH,
    HERO_HALF_WIDTH,
    heroCy,
    FACADE_Z - HERO_DEPTH / 2,
    -Math.PI / 2,
  );
  addWall(
    facadeMaterial,
    HERO_HALF_WIDTH * 2,
    heroH,
    0,
    heroCy,
    FACADE_Z - HERO_DEPTH,
  );

  // Roof: no windows.
  const roof = new THREE.Mesh(
    track(new THREE.PlaneGeometry(HERO_HALF_WIDTH * 2, HERO_DEPTH)),
    track(new THREE.MeshBasicMaterial({ color: 0x05080b, toneMapped: false })),
  );
  roof.rotation.x = -Math.PI / 2;
  roof.position.set(0, HERO_TOP, FACADE_Z - HERO_DEPTH / 2);
  group.add(roof);

  // --- window frame ------------------------------------------------------
  const mullionMaterial = track(
    new THREE.MeshStandardMaterial({ color: 0x11171c, roughness: 0.5, metalness: 0.6 }),
  );
  const barGeometry = track(new THREE.BoxGeometry(1, 1, 0.22));
  const addBar = (w: number, hh: number, px: number, py: number) => {
    const bar = new THREE.Mesh(barGeometry, mullionMaterial);
    bar.position.set(px, py, FACADE_Z - 0.02);
    bar.scale.set(w, hh, 1);
    group.add(bar);
  };
  const JAMB = 0.14;
  addBar(WINDOW_W + JAMB * 2, JAMB, 0, winTop + JAMB / 2);
  addBar(WINDOW_W + JAMB * 2, JAMB, 0, winBottom - JAMB / 2);
  addBar(JAMB, WINDOW_H, -(WINDOW_W / 2 + JAMB / 2), WINDOW_CY);
  addBar(JAMB, WINDOW_H, WINDOW_W / 2 + JAMB / 2, WINDOW_CY);
  // A single low transom only. A centre mullion would sit exactly where the
  // camera flies through the opening.
  addBar(WINDOW_W, 0.07, 0, winBottom + WINDOW_H * 0.26);

  // --- glass -------------------------------------------------------------
  // Fades out as the camera closes so the fly-through is not a visible pass
  // through a solid pane, while still reading as glazing from a distance.
  const glassUniforms = { uOpacity: { value: 1 } };
  const glass = new THREE.Mesh(
    track(new THREE.PlaneGeometry(WINDOW_W, WINDOW_H)),
    track(
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL1,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: glassUniforms,
        vertexShader: /* glsl */ `
          precision highp float;
          attribute vec3 position;
          attribute vec2 uv;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            // Raking sky reflection across the pane.
            float sheen = pow(clamp(1.0 - (vUv.x * 0.6 + vUv.y * 0.4), 0.0, 1.0), 2.2);
            vec3 color = vec3(0.10, 0.16, 0.26) * sheen;
            gl_FragColor = vec4(color * uOpacity, 1.0);
          }
        `,
      }),
    ),
  );
  glass.position.set(0, WINDOW_CY, FACADE_Z - 0.04);
  group.add(glass);

  // Soft green spill around the target window. Without it the window is just
  // another lit rectangle on a facade full of them; with it, the shot has an
  // obvious destination from the first frame.
  const glowUniforms = { uOpacity: { value: 1 } };
  const glow = new THREE.Mesh(
    track(new THREE.PlaneGeometry(7.5, 5.4)),
    track(
      new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL1,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: glowUniforms,
        vertexShader: /* glsl */ `
          precision highp float;
          attribute vec3 position;
          attribute vec2 uv;
          uniform mat4 modelViewMatrix;
          uniform mat4 projectionMatrix;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            float d = length((vUv - 0.5) * vec2(1.0, 1.35)) * 2.0;
            float falloff = pow(max(0.0, 1.0 - d), 2.6);
            gl_FragColor = vec4(vec3(0.16, 0.85, 0.42) * falloff * 0.5 * uOpacity, 1.0);
          }
        `,
      }),
    ),
  );
  glow.position.set(0, 0.1, FACADE_Z + 0.002);
  group.add(glow);

  // Light spilling out of the opening: the live field itself, sitting just
  // inside the aperture so it is seen *through* the hole rather than pasted
  // onto the wall. Same texture as the monitor, so the green in the window and
  // the green on the desk are one source.
  const spill = new THREE.Mesh(
    track(new THREE.PlaneGeometry(WINDOW_W, WINDOW_H)),
    track(
      new THREE.MeshBasicMaterial({
        map: screenTexture,
        toneMapped: false,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      }),
    ),
  );
  spill.position.set(0, WINDOW_CY, FACADE_Z - 0.45);
  group.add(spill);

  return {
    group,
    setApproach(distance) {
      // Beacon reads from far out and is gone before it can wash the frame;
      // glass and spill clear the aperture before the camera reaches it.
      glowUniforms.uOpacity.value = THREE.MathUtils.smoothstep(distance, 2.5, 11);
      const near = THREE.MathUtils.smoothstep(distance, 0.8, 4.5);
      glassUniforms.uOpacity.value = near;
      spill.material.opacity = 0.85 * near;
      spill.visible = near > 0.01;
    },
    dispose() {
      disposables.forEach((item) => item.dispose());
      towers.dispose();
    },
  };
}
