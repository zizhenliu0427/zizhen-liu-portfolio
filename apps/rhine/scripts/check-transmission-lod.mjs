import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  transmissionLodSupported, transmissionParsFragment, compensateTransmission,
  nativeTransmissionLod, frostedCoverLod,
} from '../src/transmission-lod.ts';
import { ARRAY_FROSTED_ROUGHNESS } from '../src/glass-reveal.ts';

test('patches the installed three.js transmission chunk', () => {
  assert.ok(transmissionLodSupported);
  const chunk = transmissionParsFragment();
  assert.ok(chunk.includes('uniform float transmissionLodBias;'));
  assert.ok(chunk.includes('vec2 transmissionReferenceSize = transmissionSamplerSize * exp2( transmissionLodBias );'));
  assert.ok(chunk.includes('float lod = max( 0.0, log2( transmissionReferenceSize.x ) * applyIorToRoughness( roughness, ior ) - transmissionLodBias );'));
  assert.ok(!chunk.includes('float lod = log2( transmissionSamplerSize.x )'));
  const bias = { value: 0 };
  const shader = { uniforms: {}, vertexShader: '', fragmentShader: '#include <transmission_pars_fragment>\nvoid main() {}' };
  compensateTransmission(shader, bias);
  assert.equal(shader.uniforms.transmissionLodBias, bias, 'The renderer owns one shared bias');
  assert.ok(shader.fragmentShader.startsWith(THREE.ShaderChunk.transmission_pars_fragment.slice(0, 20)));
  const replaced = { uniforms: {}, vertexShader: '', fragmentShader: 'custom transmission' };
  compensateTransmission(replaced, bias);
  assert.equal(replaced.fragmentShader, 'custom transmission', 'Custom chunks are left in place');
});

test('a half capture read one level finer covers the same reference footprint', () => {
  for (const width of [640, 1280, 1920, 2880, 3840]) for (const roughness of [.1, .28, .42]) {
    const reference = nativeTransmissionLod(width, roughness);
    // Mirrors the GLSL: log2(sampler * 2^bias) * k - bias, in half-size texels.
    const compensated = nativeTransmissionLod(width / 2 * 2, roughness) - 1;
    assert.ok(Math.abs(2 ** compensated * 2 - 2 ** reference) < 1e-9);
  }
});

test('browsing glass is coarse enough, clearing glass is not', () => {
  // Array frost exceeds one level on any capture wider than ~15 px.
  assert.ok(nativeTransmissionLod(16, ARRAY_FROSTED_ROUGHNESS) >= 1);
  // A frosted, fully lifted 1080p cover remains more than one level coarse.
  assert.ok(frostedCoverLod(300, 1920, 1, 0) >= 1.1);
  // A fully clear cover reads almost the finest level and needs the reference.
  assert.ok(frostedCoverLod(300, 3840, 1, 1) < 1);
  let previous = Infinity;
  for (let i = 0; i <= 100; i++) {
    const lod = frostedCoverLod(300, 1920, 1, i / 100);
    assert.ok(lod <= previous + 1e-10, 'Clearing never coarsens the finest read');
    previous = lod;
  }
  // Small projected covers fall back to the reference capture.
  assert.ok(frostedCoverLod(60, 1920, 1, 0) < 1);
});
