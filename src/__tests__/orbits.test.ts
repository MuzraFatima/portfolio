import { describe, expect, it } from 'vitest';
import { keplerPeriod, orbitPosition } from '@/physics/orbits';

describe('orbital motion', () => {
  const spec = { radius: 30, phase: 0.5, inclination: 0.03, period: 120 };

  it('stays on its orbit radius in the orbital plane at any time', () => {
    for (const t of [0, 1, 59.5, 3600, 86400 * 7]) {
      const p = orbitPosition(spec, t);
      expect(Math.hypot(p.x, p.z)).toBeCloseTo(30, 6);
    }
  });

  it('returns to the same place after one period', () => {
    const a = orbitPosition(spec, 10);
    const b = orbitPosition(spec, 10 + spec.period);
    expect(a.distanceTo(b)).toBeLessThan(1e-9);
  });

  it('makes farther planets slower (Kepler-style)', () => {
    expect(keplerPeriod(60)).toBeGreaterThan(keplerPeriod(30));
    expect(keplerPeriod(64) / keplerPeriod(16)).toBeCloseTo(8, 6);
  });
});
