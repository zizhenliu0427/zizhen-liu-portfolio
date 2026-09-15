export type MotionSpeed = 1 | 2 | 3;
export let motionSpeed: MotionSpeed = 2;
export function normaliseMotionSpeed(value: unknown): MotionSpeed {
  return value === 1 || value === 3 ? value : 2;
}
export function motionDuration(milliseconds: number) { return milliseconds / motionSpeed; }

/** A continuous timeline: changing speed never seeks or restarts the opening. */
let previous = 0, position = 0;
export function motionTime(now = performance.now() / 1000) {
  if (previous) position += Math.max(0, now - previous) * motionSpeed;
  previous = now;
  return position;
}
export function setMotionSpeed(value: unknown) {
  motionTime();
  motionSpeed = normaliseMotionSpeed(value);
}
