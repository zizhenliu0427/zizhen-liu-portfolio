import * as THREE from "three";

/**
 * GPU glyph-rain field.
 *
 * The whole effect is one fragment shader sampling a generated glyph atlas, so
 * there is no per-character CPU work and no DOM. It renders into a
 * WebGLRenderTarget whose texture is the single source of truth for both the
 * monitor surface and the post-handoff page background — the transition swaps
 * which geometry samples it, never the simulation itself.
 */

const ATLAS_GRID = 8; // 8x8 cells
const ATLAS_CELL = 64; // px per cell
const GLYPHS = [
  ..."アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン",
  ..."0123456789",
  ..."<>+*=:/\\|",
];

function createGlyphAtlas(): THREE.CanvasTexture {
  const size = ATLAS_GRID * ATLAS_CELL;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(ATLAS_CELL * 0.74)}px "Hiragino Kaku Gothic ProN", "Noto Sans JP", "MS Gothic", monospace`;

    for (let i = 0; i < ATLAS_GRID * ATLAS_GRID; i++) {
      const glyph = GLYPHS[i % GLYPHS.length];
      const cx = (i % ATLAS_GRID) * ATLAS_CELL + ATLAS_CELL / 2;
      const cy = Math.floor(i / ATLAS_GRID) * ATLAS_CELL + ATLAS_CELL / 2;
      ctx.fillText(glyph, cx, cy);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

const VERTEX = /* glsl */ `
precision highp float;

// RawShaderMaterial injects nothing, so the built-ins are declared by hand.
attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform float uTime;
uniform float uCellPx;
uniform float uIntensity;

varying vec2 vUv;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 grid = uResolution / uCellPx;
  vec2 gv = vUv * grid;
  vec2 id = floor(gv);
  vec2 f = fract(gv);

  float rows = grid.y;
  float col = id.x;
  // vUv.y is 0 at the bottom; the rain reads top-down.
  float rowFromTop = rows - 1.0 - id.y;

  float speed = mix(5.0, 15.0, hash11(col * 1.7));
  float phase = hash11(col * 3.1 + 4.2) * 400.0;
  float trailLen = mix(9.0, 22.0, hash11(col * 0.9 + 11.0));
  // The dark gap after each stream is what makes columns read as discrete
  // drops rather than a solid wall of text.
  float gap = mix(6.0, 34.0, hash11(col * 2.3 + 19.0));
  float span = rows + trailLen + gap;

  float head = mod(uTime * speed + phase, span);
  float d = head - rowFromTop;

  float body = d >= 0.0 ? exp(-d / (trailLen * 0.34)) : 0.0;
  float headMask = smoothstep(1.6, 0.0, abs(d));
  // Per-cell jitter keeps trails from looking like a printed gradient.
  float cellDim = mix(0.6, 1.0, hash21(id * 1.31 + 5.0));
  float lum = max(body * 1.05 * cellDim, headMask);
  if (lum < 0.012) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Glyphs re-roll at a per-cell rate so trails shimmer instead of scrolling.
  float rate = mix(1.5, 10.0, hash21(id * 0.37));
  float slot = floor(uTime * rate);
  float gi = floor(hash21(id + slot * vec2(0.13, 0.71)) * 63.999);
  vec2 cell = vec2(mod(gi, 8.0), 7.0 - floor(gi / 8.0));
  vec2 auv = (cell + f) / 8.0;
  float mask = texture2D(uAtlas, auv).a;

  vec3 trailCol = vec3(0.24, 1.0, 0.47);
  // Rare cool streams read as depth/network signal.
  trailCol = mix(trailCol, vec3(0.35, 0.85, 1.0), step(0.955, hash11(col * 5.3 + 2.0)));
  vec3 headCol = vec3(0.88, 1.0, 0.93);
  vec3 color = mix(trailCol, headCol, headMask);
  // Heads bloom slightly hotter than the trail they leave behind.
  color += headCol * headMask * 0.5;

  float scan = 0.9 + 0.1 * sin(vUv.y * uResolution.y * 3.14159);
  gl_FragColor = vec4(color * lum * mask * scan * uIntensity, 1.0);
}
`;

export type GlyphRainField = {
  /** Live texture. Never reallocated while the field is alive. */
  readonly texture: THREE.Texture;
  readonly target: THREE.WebGLRenderTarget;
  readonly atlasCanvas: HTMLCanvasElement;
  render(renderer: THREE.WebGLRenderer, elapsed: number): void;
  setSize(width: number, height: number): void;
  setIntensity(value: number): void;
  dispose(): void;
};

export function createGlyphRainField(
  width: number,
  height: number,
): GlyphRainField {
  const atlas = createGlyphAtlas();
  const target = new THREE.WebGLRenderTarget(width, height, {
    depthBuffer: false,
    stencilBuffer: false,
  });
  target.texture.minFilter = THREE.LinearFilter;
  target.texture.magFilter = THREE.LinearFilter;
  target.texture.generateMipmaps = false;
  target.texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL1,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uAtlas: { value: atlas },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTime: { value: 0 },
      uCellPx: { value: 22 },
      uIntensity: { value: 1.2 },
    },
  });

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);

  return {
    texture: target.texture,
    target,
    atlasCanvas: atlas.image as HTMLCanvasElement,
    render(renderer, elapsed) {
      material.uniforms.uTime.value = elapsed;
      const previous = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
      renderer.setRenderTarget(previous);
    },
    setSize(nextWidth, nextHeight) {
      target.setSize(nextWidth, nextHeight);
      material.uniforms.uResolution.value.set(nextWidth, nextHeight);
    },
    setIntensity(value) {
      material.uniforms.uIntensity.value = value;
    },
    dispose() {
      quad.geometry.dispose();
      material.dispose();
      atlas.dispose();
      target.dispose();
    },
  };
}
