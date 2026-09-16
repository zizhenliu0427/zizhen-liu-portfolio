import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceOpening, openingTime, seekOpeningTime, pauseOpeningTime, setMotionSpeed } from '../src/motion-speed.ts';

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('loading speed only accelerates the 2D opening', () => {
  for (const speed of [1, 2, 3]) {
    close(advanceOpening(10, 0.5, speed), 10 + 0.5 * speed);
    close(advanceOpening(22, 1, speed), 23);
    close(advanceOpening(29, 1, speed), 30);
    close(advanceOpening(21.9, 1, speed), 22.9);
  }
});

test('a frame crossing into the 3D array spends its remaining real time at 1x', () => {
  close(advanceOpening(21.8, 0.2, 2), 22.05);
  close(advanceOpening(21.8, 3, 2), 24.85);
  close(advanceOpening(22, -1, 3), 22);
});

test('changing loading speed preserves progress across the 3D boundary', t => {
  let now = 1000;
  t.mock.method(performance, 'now', () => now);
  setMotionSpeed(2);
  seekOpeningTime(21.5);
  now += 100;
  setMotionSpeed(3);
  now += 200;
  close(openingTime(), 22 + 1 / 30);
  now += 1000;
  close(openingTime(), 23 + 1 / 30);
  setMotionSpeed(1);
  now += 1000;
  close(openingTime(), 24 + 1 / 30);
});

test('replaying resets the opening and a host pause does not skip the sequence', t => {
  let now = 1000;
  t.mock.method(performance, 'now', () => now);
  setMotionSpeed(2);
  seekOpeningTime(22);
  now += 2000;
  pauseOpeningTime(2);
  close(openingTime(), 22);
  seekOpeningTime(1.76);
  now += 100;
  close(openingTime(), 1.96);
});
