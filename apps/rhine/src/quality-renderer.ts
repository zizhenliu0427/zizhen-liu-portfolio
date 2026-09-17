import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { renderDimensions, type RenderQuality } from "./render-quality";

export function applyTextureQuality(
  root: THREE.Object3D,
  renderer: THREE.WebGLRenderer,
  quality: RenderQuality,
) {
  const maximum = Math.min(
    quality.anisotropy,
    renderer.capabilities.getMaxAnisotropy(),
  );
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture && !value.isRenderTargetTexture)
          textures.add(value);
      }
    }
  });
  for (const texture of textures) {
    if (texture.anisotropy === maximum) continue;
    texture.anisotropy = maximum;
    texture.needsUpdate = true;
  }
}

const composerSizes = new WeakMap<EffectComposer, string>();

export function resizeQuality(
  renderer: THREE.WebGLRenderer,
  composer: EffectComposer,
  host: HTMLElement,
  quality: RenderQuality,
  superPerformance = false,
) {
  const width = Math.max(1, host.clientWidth),
    height = Math.max(1, host.clientHeight);
  const dimensions = renderDimensions(
    quality,
    width,
    height,
    host.getBoundingClientRect().width / width,
    devicePixelRatio,
    renderer.capabilities.maxTextureSize,
    superPerformance ? 921_600 : 8_294_400,
  );
  // Mode changes can alter the HUD layout without changing render dimensions.
  // Reassigning an unchanged canvas size still clears/reallocates its buffer.
  if (renderer.getPixelRatio() !== dimensions.ratio) renderer.setPixelRatio(dimensions.ratio);
  const size = renderer.getSize(new THREE.Vector2());
  if (size.x !== width || size.y !== height) renderer.setSize(width, height);
  const key = `${width}:${height}:${dimensions.ratio}`;
  if (composerSizes.get(composer) !== key) {
    composer.setPixelRatio(dimensions.ratio);
    composer.setSize(width, height);
    composerSizes.set(composer, key);
  }
  renderer.transmissionResolutionScale = quality.transmission;
  host.dataset.renderQuality = JSON.stringify({
    ...dimensions,
    antialias: quality.antialias,
    transmission: quality.transmission,
    anisotropy: Math.min(
      quality.anisotropy,
      renderer.capabilities.getMaxAnisotropy(),
    ),
    superPerformance,
  });
  return dimensions;
}

export function createViewerPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
) {
  const composer = new EffectComposer(renderer);
  const smaa = new SMAAPass();
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(smaa);
  composer.addPass(new OutputPass());
  return { composer, smaa };
}
