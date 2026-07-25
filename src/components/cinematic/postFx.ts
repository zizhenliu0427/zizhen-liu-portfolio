import * as THREE from "three";

/**
 * Minimal post chain: threshold bloom at quarter resolution, then one
 * composite pass carrying chromatic aberration, vignette and grain.
 *
 * Written by hand rather than pulled from three/examples/jsm because
 * UnrealBloomPass costs several extra passes and a chunk of bundle for
 * quality this scene does not need. Total cost here is three quarter-res
 * draws plus one full-res composite.
 */

const VERTEX = /* glsl */ `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const BRIGHT = /* glsl */ `
precision highp float;
uniform sampler2D uSrc;
uniform float uThreshold;
uniform float uSoft;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uSrc, vUv).rgb;
  float lum = max(max(c.r, c.g), c.b);
  gl_FragColor = vec4(c * smoothstep(uThreshold, uThreshold + uSoft, lum), 1.0);
}
`;

const BLUR = /* glsl */ `
precision highp float;
uniform sampler2D uSrc;
uniform vec2 uStep;
varying vec2 vUv;
void main() {
  // 9-tap gaussian, weights folded to 5 samples via linear filtering.
  vec3 sum = texture2D(uSrc, vUv).rgb * 0.2270270270;
  sum += texture2D(uSrc, vUv + uStep * 1.3846153846).rgb * 0.3162162162;
  sum += texture2D(uSrc, vUv - uStep * 1.3846153846).rgb * 0.3162162162;
  sum += texture2D(uSrc, vUv + uStep * 3.2307692308).rgb * 0.0702702703;
  sum += texture2D(uSrc, vUv - uStep * 3.2307692308).rgb * 0.0702702703;
  gl_FragColor = vec4(sum, 1.0);
}
`;

const COMPOSITE = /* glsl */ `
precision highp float;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBloom_;
uniform float uAberration;
uniform float uGrain;
uniform float uVignette;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 centered = vUv - 0.5;
  float r2 = dot(centered, centered);

  // Lateral chromatic aberration: grows toward the corners, absent in the
  // middle, so text stays clean where the reader looks.
  vec2 offset = centered * uAberration * r2;
  vec3 color = vec3(
    texture2D(uScene, vUv + offset).r,
    texture2D(uScene, vUv).g,
    texture2D(uScene, vUv - offset).b
  );

  color += texture2D(uBloom, vUv).rgb * uBloom_;
  // Wide and shallow: shapes the corners without dimming the middle third.
  color *= mix(1.0, smoothstep(1.25, 0.34, length(centered)), uVignette);

  float grain = hash(vUv * uResolution + fract(uTime) * 431.7);
  color += (grain - 0.5) * uGrain;

  gl_FragColor = vec4(color, 1.0);
}
`;

export type PostFx = {
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    time: number,
  ): void;
  setSize(width: number, height: number): void;
  dispose(): void;
};

const BLOOM_DIVISOR = 4;

export function createPostFx(width: number, height: number): PostFx {
  const sceneTarget = new THREE.WebGLRenderTarget(width, height);
  sceneTarget.texture.minFilter = THREE.LinearFilter;
  sceneTarget.texture.magFilter = THREE.LinearFilter;
  sceneTarget.texture.generateMipmaps = false;

  const bloomOptions = {
    depthBuffer: false,
    stencilBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  };
  let bloomW = Math.max(1, Math.floor(width / BLOOM_DIVISOR));
  let bloomH = Math.max(1, Math.floor(height / BLOOM_DIVISOR));
  const bloomA = new THREE.WebGLRenderTarget(bloomW, bloomH, bloomOptions);
  const bloomB = new THREE.WebGLRenderTarget(bloomW, bloomH, bloomOptions);

  const shared = { depthTest: false, depthWrite: false, glslVersion: THREE.GLSL1 };

  const brightMaterial = new THREE.RawShaderMaterial({
    ...shared,
    vertexShader: VERTEX,
    fragmentShader: BRIGHT,
    uniforms: {
      uSrc: { value: sceneTarget.texture },
      uThreshold: { value: 0.52 },
      uSoft: { value: 0.35 },
    },
  });

  const blurMaterial = new THREE.RawShaderMaterial({
    ...shared,
    vertexShader: VERTEX,
    fragmentShader: BLUR,
    uniforms: {
      uSrc: { value: null },
      uStep: { value: new THREE.Vector2() },
    },
  });

  const compositeMaterial = new THREE.RawShaderMaterial({
    ...shared,
    vertexShader: VERTEX,
    fragmentShader: COMPOSITE,
    uniforms: {
      uScene: { value: sceneTarget.texture },
      uBloom: { value: bloomA.texture },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTime: { value: 0 },
      uBloom_: { value: 0.78 },
      uAberration: { value: 0.012 },
      uGrain: { value: 0.028 },
      uVignette: { value: 0.5 },
    },
  });

  const quadScene = new THREE.Scene();
  const quadCamera = new THREE.Camera();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), brightMaterial);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const pass = (
    renderer: THREE.WebGLRenderer,
    material: THREE.RawShaderMaterial,
    target: THREE.WebGLRenderTarget | null,
  ) => {
    quad.material = material;
    renderer.setRenderTarget(target);
    renderer.render(quadScene, quadCamera);
  };

  return {
    render(renderer, scene, camera, time) {
      renderer.setRenderTarget(sceneTarget);
      renderer.render(scene, camera);

      pass(renderer, brightMaterial, bloomA);

      blurMaterial.uniforms.uSrc.value = bloomA.texture;
      blurMaterial.uniforms.uStep.value.set(1 / bloomW, 0);
      pass(renderer, blurMaterial, bloomB);

      blurMaterial.uniforms.uSrc.value = bloomB.texture;
      blurMaterial.uniforms.uStep.value.set(0, 1 / bloomH);
      pass(renderer, blurMaterial, bloomA);

      compositeMaterial.uniforms.uTime.value = time;
      pass(renderer, compositeMaterial, null);
    },
    setSize(nextWidth, nextHeight) {
      sceneTarget.setSize(nextWidth, nextHeight);
      bloomW = Math.max(1, Math.floor(nextWidth / BLOOM_DIVISOR));
      bloomH = Math.max(1, Math.floor(nextHeight / BLOOM_DIVISOR));
      bloomA.setSize(bloomW, bloomH);
      bloomB.setSize(bloomW, bloomH);
      compositeMaterial.uniforms.uResolution.value.set(nextWidth, nextHeight);
    },
    dispose() {
      quad.geometry.dispose();
      brightMaterial.dispose();
      blurMaterial.dispose();
      compositeMaterial.dispose();
      sceneTarget.dispose();
      bloomA.dispose();
      bloomB.dispose();
    },
  };
}
