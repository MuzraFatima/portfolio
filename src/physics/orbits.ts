import { Vector3 } from 'three';

export interface OrbitSpec {
  radius: number;
  /** Angle at t = 0, in radians. */
  phase: number;
  /** Tilt of the orbital plane, in radians. */
  inclination: number;
  /** Seconds for one full orbit. */
  period: number;
}

/**
 * Position on a circular, inclined orbit. Using a closed-form position (instead of integrating
 * velocity every frame) keeps orbits perfectly stable however long the page stays open.
 */
export function orbitPosition(spec: OrbitSpec, time: number, target = new Vector3()): Vector3 {
  const angle = spec.phase + (time / spec.period) * Math.PI * 2;
  const x = Math.cos(angle) * spec.radius;
  const z = Math.sin(angle) * spec.radius;
  return target.set(x, Math.sin(angle) * Math.sin(spec.inclination) * spec.radius * 0.15, z);
}

/**
 * Kepler's third law in miniature: farther planets orbit more slowly (period ∝ r^1.5),
 * scaled so the innermost planet takes about 3.5 minutes per orbit.
 */
export function keplerPeriod(radius: number, base = 210, baseRadius = 16): number {
  return base * Math.pow(radius / baseRadius, 1.5);
}
