import type { PlanetProps } from '@/components/planets/Planet';
import type { PlanetMap } from '@/components/galaxy/textures';
import { keplerPeriod, type OrbitSpec } from '@/physics/orbits';
import type { ProjectId } from '@/types/content';

export interface MoonSpec {
  map: PlanetMap;
  radius: number;
  distance: number;
  period: number;
  phase: number;
  tilt?: number;
}

export interface PlanetConfig {
  planet: Omit<PlanetProps, 'children' | 'onClick' | 'onPointerOver' | 'onPointerOut'>;
  orbit: OrbitSpec;
  moons: MoonSpec[];
  /** Small artificial satellites (GateOrchestra's "agents"). */
  satellites?: number;
  glow: string;
}

function orbit(radius: number, phase: number, inclination = 0.03): OrbitSpec {
  return { radius, phase, inclination, period: keplerPeriod(radius) };
}

/**
 * Each project planet uses a real planetary surface map chosen to match its blueprint palette,
 * graded lightly so the worlds stay distinct. GateOrchestra is the flagship: ringed,
 * attended by agent satellites and moons, and the first planet from the star.
 */
export const planetConfigs: Record<ProjectId, PlanetConfig> = {
  gateorchestra: {
    planet: {
      map: 'neptune',
      radius: 2.9,
      tint: '#c3b6ff',
      atmosphere: { color: '#7d6bff', intensity: 1.5, scale: 1.1 },
      rings: { inner: 4.0, outer: 6.6, color: '#b9b2ff', opacity: 0.85, tilt: [0.35, 0, 0.1] },
      axialTilt: 0.32,
      spinSpeed: 0.12,
    },
    orbit: orbit(16, 0.2),
    moons: [
      { map: 'moon', radius: 0.42, distance: 8.2, period: 38, phase: 0 },
      { map: 'mercury', radius: 0.28, distance: 9.6, period: 55, phase: 2.4, tilt: 0.2 },
    ],
    satellites: 4,
    glow: '#8b7bff',
  },
  whototrust: {
    planet: {
      map: 'uranus',
      radius: 2.1,
      tint: '#e3fbff',
      clouds: { map: 'earth-clouds', opacity: 0.32, color: '#f5f0ff', speed: 0.05 },
      atmosphere: { color: '#6fe7ff', intensity: 1.25 },
      rings: { inner: 3.0, outer: 3.9, color: '#c9a8ff', opacity: 0.4, tilt: [1.2, 0, 0] },
      axialTilt: 1.4,
      spinSpeed: 0.09,
    },
    orbit: orbit(23, 1.2),
    moons: [{ map: 'moon', radius: 0.3, distance: 5.2, period: 44, phase: 1 }],
    glow: '#5ee1ff',
  },
  neurolens: {
    planet: {
      map: 'earth-daymap',
      nightMap: 'earth-nightmap',
      radius: 2.2,
      tint: '#d9fff0',
      clouds: { map: 'earth-clouds', opacity: 0.8, speed: 0.11 },
      atmosphere: { color: '#3fe0c0', intensity: 1.35 },
      axialTilt: 0.41,
      spinSpeed: 0.1,
    },
    orbit: orbit(30, 2.2),
    moons: [{ map: 'moon', radius: 0.55, distance: 5.4, period: 60, phase: 3 }],
    glow: '#34d399',
  },
  caar: {
    planet: {
      map: 'venus-atmosphere',
      radius: 2.0,
      tint: '#ffe7b0',
      atmosphere: { color: '#ffcc66', intensity: 1.2 },
      axialTilt: 0.05,
      spinSpeed: 0.04,
    },
    orbit: orbit(37, 3.2),
    moons: [],
    glow: '#f5b301',
  },
  'compute-bazaar': {
    planet: {
      map: 'jupiter',
      radius: 3.6,
      tint: '#ffe0c2',
      atmosphere: { color: '#ffa860', intensity: 1.0 },
      axialTilt: 0.05,
      spinSpeed: 0.18,
    },
    orbit: orbit(62, 4.2),
    moons: [
      { map: 'moon', radius: 0.36, distance: 6.4, period: 26, phase: 0 },
      { map: 'mercury', radius: 0.32, distance: 7.8, period: 34, phase: 1.6 },
      { map: 'moon', radius: 0.5, distance: 9.6, period: 48, phase: 3.3, tilt: 0.1 },
      { map: 'mercury', radius: 0.44, distance: 11.6, period: 70, phase: 5.1 },
    ],
    glow: '#fb923c',
  },
  jocky: {
    planet: {
      map: 'mars',
      bump: 0.06,
      radius: 1.8,
      tint: '#ffd2c8',
      atmosphere: { color: '#ff6a55', intensity: 0.8, scale: 1.06 },
      axialTilt: 0.44,
      spinSpeed: 0.1,
    },
    orbit: orbit(72, 5.2),
    moons: [
      { map: 'mercury', radius: 0.2, distance: 3.6, period: 18, phase: 0 },
      { map: 'moon', radius: 0.16, distance: 4.8, period: 30, phase: 2.2, tilt: 0.3 },
    ],
    glow: '#ef4444',
  },
  horizonguard: {
    planet: {
      map: 'saturn',
      radius: 2.6,
      atmosphere: { color: '#f2d39a', intensity: 0.9, scale: 1.06 },
      rings: { inner: 3.4, outer: 6.2, color: '#e8d2a6', opacity: 0.9, tilt: [0.42, 0, 0.12] },
      axialTilt: 0.47,
      spinSpeed: 0.14,
    },
    orbit: orbit(84, 6.2),
    moons: [{ map: 'moon', radius: 0.34, distance: 8.4, period: 46, phase: 1.2, tilt: 0.15 }],
    // Watch satellites: the monitor keeping an eye on drifting agents.
    satellites: 3,
    glow: '#d9b26a',
  },
};
