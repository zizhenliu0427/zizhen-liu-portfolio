import * as THREE from 'three';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { BokehPass, type BokehPassParameters } from 'three/addons/postprocessing/BokehPass.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

type SSAOInternals = {
  _overrideVisibility(): void;
  _restoreVisibility(): void;
  _renderPass(renderer: THREE.WebGLRenderer, material: THREE.Material, target: THREE.WebGLRenderTarget | null): void;
};

/** Emit BokehPass's original packed HalfFloat depth alongside the AO normal.
 * A raw hardware depth texture has different precision; do not substitute it.
 * The local three revision uses _renderOverride as the normal-pass extension.
 */
export class SharedDepthAO extends SSAOPass {
  private packed: THREE.Texture;
  private sharing = true;
  private savedColor = new THREE.Color();
  private depthClear = new Float32Array([1, 1, 1, 1]);
  /** Drawn in the beauty pass only; their normals and depth do not change AO or focus. */
  omitted: THREE.Object3D[] = [];
  constructor(scene: THREE.Scene, camera: THREE.Camera, width: number, height: number, kernel = 32) {
    super(scene, camera, width, height, kernel);
    this.packed = this.normalRenderTarget.texture.clone();
    this.packed.name = 'Archive.packedDepth';
    this.normalRenderTarget.textures.push(this.packed);
    this.normalMaterial.onBeforeCompile = shader => {
      if (!this.sharing) return;
      shader.vertexShader = 'varying vec2 vArchiveZW;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvArchiveZW = gl_Position.zw;');
      shader.fragmentShader = 'varying vec2 vArchiveZW;\nlayout(location = 1) out vec4 archivePackedDepth;\n#include <packing>\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('void main() {', 'void main() {\narchivePackedDepth = packDepthToRGBA(0.5 * vArchiveZW.x / vArchiveZW.y + 0.5);');
    };
    this.normalMaterial.customProgramCacheKey = () => `archive-normal-packed-depth-v1-${this.sharing}`;
    const { blendSrc, blendDst, blendEquation, blendSrcAlpha, blendDstAlpha, blendEquationAlpha } = this.copyMaterial;
    Object.assign(this.blurMaterial, { blendSrc, blendDst, blendEquation, blendSrcAlpha, blendDstAlpha, blendEquationAlpha });
  }
  /** Same passes as SSAOPass, except the blur multiplies straight into the
   * frame with the composite's blend: one full-screen write and read fewer. */
  render(renderer: THREE.WebGLRenderer, write: THREE.WebGLRenderTarget, read: THREE.WebGLRenderTarget, delta: number, mask: boolean) {
    // A smaller AO target is upsampled by the composite; keep that path.
    if (this.output !== SSAOPass.OUTPUT.Default || this.renderToScreen || read.width !== this.width || read.height !== this.height)
      return super.render(renderer, write, read, delta, mask);
    const pass = this as unknown as SSAOInternals;
    pass._overrideVisibility();
    this._renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1);
    pass._restoreVisibility();
    const uniforms = this.ssaoMaterial.uniforms;
    uniforms.kernelRadius.value = this.kernelRadius;
    uniforms.minDistance.value = this.minDistance;
    uniforms.maxDistance.value = this.maxDistance;
    pass._renderPass(renderer, this.ssaoMaterial, this.ssaoRenderTarget);
    const blending = this.blurMaterial.blending;
    this.blurMaterial.blending = THREE.CustomBlending;
    try { pass._renderPass(renderer, this.blurMaterial, read); }
    finally { this.blurMaterial.blending = blending; }
  }
  setSharing(enabled: boolean) {
    if (enabled === this.sharing) return;
    this.normalRenderTarget.dispose();
    this.sharing = enabled;
    this.normalRenderTarget.textures.length = 1;
    if (enabled) this.normalRenderTarget.textures.push(this.packed);
    this.normalMaterial.needsUpdate = true;
  }
  _renderOverride(renderer: THREE.WebGLRenderer, material: THREE.Material, target: THREE.WebGLRenderTarget, color: THREE.ColorRepresentation, alpha: number) {
    renderer.getClearColor(this.savedColor);
    const savedAlpha = renderer.getClearAlpha(), autoClear = renderer.autoClear;
    const override = this.scene.overrideMaterial;
    renderer.setRenderTarget(target);
    renderer.autoClear = false;
    renderer.setClearColor(color, alpha);
    renderer.clear();
    // AO's normal clear remains unchanged; the packed depth background is white.
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (this.sharing) gl.clearBufferfv(gl.COLOR, 1, this.depthClear);
    this.scene.overrideMaterial = material;
    const visible = this.omitted.map(object => object.visible);
    for (const object of this.omitted) object.visible = false;
    try { renderer.render(this.scene, this.camera); }
    finally {
      this.omitted.forEach((object, i) => { object.visible = visible[i]; });
      this.scene.overrideMaterial = override;
      renderer.autoClear = autoClear;
      renderer.setClearColor(this.savedColor, savedAlpha);
    }
  }
}

export class SharedDepthBokeh extends BokehPass {
  private width = 1;
  private height = 1;
  private quad: FullScreenQuad;
  readonly outputsToCanvas: boolean;
  constructor(scene: THREE.Scene, camera: THREE.Camera, params: BokehPassParameters, private source: () => SharedDepthAO) {
    super(scene, camera, params);
    // Three adds tone mapping and sRGB output only when this draws to the
    // canvas, so the last bokeh pass can replace OutputPass exactly.
    const end = 'gl_FragColor.a = 1.0;';
    this.outputsToCanvas = this.materialBokeh.fragmentShader.includes(end);
    this.materialBokeh.fragmentShader = this.materialBokeh.fragmentShader.replace(end,
      `${end}\n#include <tonemapping_fragment>\n#include <colorspace_fragment>`);
    this.quad = new FullScreenQuad(this.materialBokeh);
  }
  setSize(width: number, height: number) { super.setSize(width, height); this.width = width; this.height = height; }
  render(renderer: THREE.WebGLRenderer, write: THREE.WebGLRenderTarget, read: THREE.WebGLRenderTarget, delta: number, mask: boolean) {
    const ao = this.source(), uniforms = this.uniforms as Record<string, {value: any}>;
    // Lower resolution AO must retain the original full resolution depth pass.
    if (!ao.enabled || ao.width !== this.width || ao.height !== this.height) {
      return super.render(renderer, write, read, delta, mask);
    }
    const originalDepth = uniforms.tDepth.value;
    uniforms.tDepth.value = ao.normalRenderTarget.textures[1];
    uniforms.tColor.value = read.texture;
    uniforms.nearClip.value = (this.camera as THREE.PerspectiveCamera).near;
    uniforms.farClip.value = (this.camera as THREE.PerspectiveCamera).far;
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(this.renderToScreen ? null : write);
    if (!this.renderToScreen) renderer.clear();
    try { this.quad.render(renderer); }
    finally { uniforms.tDepth.value = originalDepth; renderer.autoClear = autoClear; }
  }
  dispose() { super.dispose(); this.quad.dispose(); }
}
