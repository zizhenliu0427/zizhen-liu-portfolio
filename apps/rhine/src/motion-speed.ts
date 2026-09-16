export type MotionSpeed = 1 | 2 | 3;
export let motionSpeed: MotionSpeed = 2;
export function normaliseMotionSpeed(value: unknown): MotionSpeed {
  return value === 1 || value === 3 ? value : 2;
}
export function motionDuration(milliseconds: number) { return milliseconds / motionSpeed; }

/** Continuous loading/decryption time, independent of the 3D opening clock. */
let previous = 0, position = 0;
export function motionTime(now = performance.now() / 1000) {
  if (previous) position += Math.max(0, now - previous) * motionSpeed;
  previous = now;
  return position;
}
export function setMotionSpeed(value: unknown) {
  motionTime();
  openingTime();
  motionSpeed = normaliseMotionSpeed(value);
}

/** The 2D loading sequence may accelerate; the 3D array always uses real time. */
export function advanceOpening(position: number, elapsed: number, speed: number) {
  const boundary = 21.9;
  const accelerated = Math.min(Math.max(0, elapsed), Math.max(0, boundary - position) / speed);
  return position + accelerated * speed + Math.max(0, elapsed - accelerated);
}
let openingPrevious = 0, openingPosition = 0;
export function openingTime(now = performance.now() / 1000) {
  if (openingPrevious) openingPosition = advanceOpening(openingPosition, now - openingPrevious, motionSpeed);
  openingPrevious = now;
  return openingPosition;
}
export function seekOpeningTime(position: number) {
  openingPosition = position;
  openingPrevious = performance.now() / 1000;
}
export function pauseOpeningTime(seconds: number) { openingPrevious += seconds; }
