import test from 'node:test';
import assert from 'node:assert/strict';
import { AdaptiveQuality, adaptiveQuality } from '../src/adaptive-quality.ts';
import { qualityPresets } from '../src/render-quality.ts';

function clock(controller) {
  let now = 1000;
  return (hz, seconds, options = {}) => {
    let changes = 0;
    for (let i = 0; i < Math.ceil(hz * seconds); i++) {
      now += 1000 / hz;
      if (controller.observe(now, { lightweight: false, eligible: true, drawn: true, ...options })) changes++;
    }
    return changes;
  };
}
for (const hz of [60, 90, 120, 144, 165, 240]) test(`estimates ${hz} Hz without a fixed target`, () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(hz, 3, { lightweight: true, eligible: false });
  assert.equal(a.refreshRate, hz);
  assert.equal(a.level, 0);
});
test('sustained load lowers quality without redefining the display target', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(144, 2, { lightweight: true, eligible: false });
  assert.equal(run(90, 3), 1);
  assert.equal(a.refreshRate, 144);
  assert.equal(a.level, 1);
  assert.equal(run(90, 2), 0, 'cooldown prevents repeated reallocations');
});
test('short frame drops do not trigger a downgrade', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(120, 2, { lightweight: true, eligible: false });
  run(30, .25); run(120, 5);
  assert.equal(a.level, 0);
});
test('slow cached frames do not sacrifice quality and very slow rendered frames can adapt', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(120, 2, { lightweight: true, eligible: false });
  run(30, 8, { drawn: false }); assert.equal(a.level, 0);
  run(3, 3); assert.equal(a.level, 1);
});
test('idle cached frames cannot raise quality and recovery is slow', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(120, 2, { lightweight: true, eligible: false }); run(60, 3);
  run(120, 25, { drawn: false }); assert.equal(a.level, 1);
  run(120, 8); assert.equal(a.level, 1);
  run(120, 6); assert.equal(a.level, 0);
});
test('hidden/loading intervals clear sustained-load evidence', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(120, 2, { lightweight: true, eligible: false }); run(60, 1.1);
  a.resetWindow(); run(60, 3, { eligible: false }); run(120, 4);
  assert.equal(a.level, 0);
});
test('all overrides stay bounded and never mutate the saved settings', () => {
  for (const base of Object.values(qualityPresets)) {
    const saved = structuredClone(base);
    let previous = base;
    for (let level = 0; level <= 12; level++) {
      const quality = adaptiveQuality(base, level);
      for (const key of ['scale','shadows','aoResolution','transmission','depthOfField']) {
        assert.ok(quality[key] <= previous[key], key);
      }
      assert.ok(quality.scale >= 50);
      assert.equal(quality.aoSamples, base.aoSamples, 'no shader recompilation');
      previous = quality;
    }
    assert.deepEqual(base, saved);
    assert.deepEqual(adaptiveQuality(base, 0), base);
  }
});
test('failed recovery backs off rather than repeatedly pumping quality', () => {
  const a = new AdaptiveQuality(); const run = clock(a);
  run(120, 2, { lightweight: true, eligible: false }); run(60, 3);
  run(120, 18); assert.equal(a.level, 0);
  for (let frame = 0; frame < 600 && a.level === 0; frame++) run(60, 1 / 60);
  assert.equal(a.level, 1);
  run(120, 18); assert.equal(a.level, 1, 'recovery now requires a longer stable interval');
});
