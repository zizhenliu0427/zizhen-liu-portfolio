import * as THREE from "three";
import {
  ARRAY_FROSTED_ROUGHNESS,
  CLEAR_ROUGHNESS,
  FROSTED_ROUGHNESS,
  frostedTransmissionLod,
  glassRevealAtHeight,
} from "./glass-reveal.ts";

/** Shared by the transmissive materials drawn by one renderer. 0 means the
 * capture is at the reference size; 1 means it is half the width and height. */
export type TransmissionLodBias = { value: number };

const NATIVE_LOD = "float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );";
const SAMPLER_SIZE = "uniform vec2 transmissionSamplerSize;";
const CHUNK = "#include <transmission_pars_fragment>";
export const transmissionLodSupported =
  THREE.ShaderChunk.transmission_pars_fragment.includes(NATIVE_LOD) &&
  THREE.ShaderChunk.transmission_pars_fragment.includes(SAMPLER_SIZE);

/** Three picks the refraction mip from the capture's own width. A capture at
 * 2^-bias of the reference width, read `bias` levels finer, returns the same
 * box-filtered footprint wherever the reference LOD is at least `bias`.
 * `referenceLod` may use `transmissionReferenceSize`, the unreduced size. */
export function transmissionParsFragment(
  referenceLod = "log2( transmissionReferenceSize.x ) * applyIorToRoughness( roughness, ior )",
) {
  return THREE.ShaderChunk.transmission_pars_fragment
    .replace(SAMPLER_SIZE, `${SAMPLER_SIZE}\n\tuniform float transmissionLodBias;`)
    .replace(NATIVE_LOD, `vec2 transmissionReferenceSize = transmissionSamplerSize * exp2( transmissionLodBias );\n\t\tfloat lod = max( 0.0, ${referenceLod} - transmissionLodBias );`);
}

/** Leaves an already replaced transmission chunk as it is, adding only the bias. */
export function compensateTransmission(
  shader: THREE.WebGLProgramParametersWithUniforms,
  bias: TransmissionLodBias,
) {
  shader.uniforms.transmissionLodBias = bias;
  shader.fragmentShader = shader.fragmentShader.replace(CHUNK, transmissionParsFragment());
}

export function nativeTransmissionLod(width: number, roughness: number, ior = 1.46) {
  return Math.log2(Math.max(1, width)) * roughness * THREE.MathUtils.clamp(ior * 2 - 2, 0, 1);
}

/** Finest reference LOD read by a selected or returning cover. Roughness is
 * lowest at the top edge while clearing; pass the smallest projected height. */
export function frostedCoverLod(panelPixels: number, width: number, quality: number, clarity: number) {
  const frosted = THREE.MathUtils.lerp(ARRAY_FROSTED_ROUGHNESS, FROSTED_ROUGHNESS, quality);
  const roughness = THREE.MathUtils.lerp(frosted, CLEAR_ROUGHNESS, glassRevealAtHeight(clarity, 1));
  return frostedTransmissionLod(panelPixels, width, roughness, quality);
}
