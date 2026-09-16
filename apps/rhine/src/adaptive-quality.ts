import type { RenderQuality } from './render-quality';

/** Runtime overrides only: the user's saved quality remains the ceiling. */
export function adaptiveQuality(base: RenderQuality, level: number): RenderQuality {
  const step = Math.max(0, Math.min(12, Math.floor(level)));
  if (!step) return { ...base };
  const effectSteps = base.aoSamples > 0 || base.transmission > .25 || base.shadows > 1024 ? 3 : 0;
  return {
    ...base,
    aoResolution: Math.min(base.aoResolution, step === 1 ? .75 : .5),
    transmission: Math.min(base.transmission, step === 1 ? .75 : step === 2 ? .5 : .25),
    shadows: step >= 3 ? Math.min(base.shadows, 1024) : base.shadows,
    // Keep the AO shader kernel unchanged to avoid runtime shader compilation.
    // Small resolution steps follow the less conspicuous effect reductions.
    scale: Math.max(50, Math.floor(base.scale * (1 - Math.max(0, step - effectSteps) * .05) / 5) * 5),
    depthOfField: Math.max(0, base.depthOfField - Math.max(0, step - 7) * 20),
  };
}

export class AdaptiveQuality {
  level = 0;
  refreshRate: number | null = null;
  private last = 0;
  private intervals: number[] = [];
  private elapsed = 0;
  private frames = 0;
  private drawn = 0;
  private slow = 0;
  private stable = 0;
  private cooldown = 0;
  private recovery = false;
  private recoveryDelay = 12000;

  resetWindow() {
    this.last = this.elapsed = this.frames = this.drawn = this.slow = this.stable = 0;
    this.intervals = [];
  }
  reset() {
    this.level = 0;
    this.cooldown = 0;
    this.recoveryDelay = 12000;
    this.recovery = false;
    this.resetWindow();
  }

  /** Lightweight entry samples may recalibrate down; load must not lower the target. */
  observe(now: number, options: { lightweight: boolean; eligible: boolean; drawn: boolean }): boolean {
    const dt = this.last ? now - this.last : 0;
    this.last = now;
    if (dt <= 0 || dt > 1000) { this.intervals = []; this.elapsed = this.frames = this.drawn = this.slow = this.stable = 0; return false; }
    if (dt >= 1 && dt < 100) this.intervals.push(dt);
    if (this.intervals.length >= 120) {
      const sorted = [...this.intervals].sort((a, b) => a - b);
      // Use a group of fast frames, never a single unusually short callback.
      const sample = Math.round(1000 / sorted[Math.floor(sorted.length * .2)]);
      const reliable = sorted[Math.floor(sorted.length * .4)] / sorted[Math.floor(sorted.length * .1)] < 1.15;
      if (reliable && (options.lightweight || this.refreshRate === null || sample > this.refreshRate * 1.08)) {
        this.refreshRate = sample;
      }
      this.intervals = [];
    }
    if (!options.eligible || this.refreshRate === null || now < this.cooldown) {
      this.elapsed = this.frames = this.drawn = this.slow = this.stable = 0;
      return false;
    }
    this.elapsed += dt;
    this.frames++;
    if (options.drawn) this.drawn++;
    if (this.elapsed < 1000) return false;
    const fps = this.frames * 1000 / this.elapsed;
    const busy = this.drawn / this.frames > .65;
    const span = this.elapsed;
    this.elapsed = this.frames = this.drawn = 0;
    // Cached idle frames do not prove the GPU has headroom for better quality.
    if (busy && fps < this.refreshRate * .9) {
      this.slow += span;
      this.stable = 0;
    } else {
      this.slow = 0;
      this.stable = busy && fps >= this.refreshRate * .97 ? this.stable + span : 0;
    }
    if (this.slow >= 2000 && this.level < 12) {
      this.level++;
      if (this.recovery) this.recoveryDelay = Math.min(120000, this.recoveryDelay * 2);
      this.recovery = false;
      this.cooldown = now + 3000;
    } else if (this.stable >= this.recoveryDelay && this.level > 0) {
      this.level--;
      this.recovery = true;
      this.cooldown = now + 5000;
    } else return false;
    this.slow = this.stable = 0;
    return true;
  }
}
