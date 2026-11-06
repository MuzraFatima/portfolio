import type { Vector3 } from 'three';
import { orbitPosition } from '@/physics/orbits';
import { planetConfigs } from '@/scenes/ProjectSolarSystem/planetConfigs';
import type { ProjectId } from '@/types/content';

/**
 * Where everything sits in the galaxy. The journey spirals outward from the central star:
 * the Skill Nebula hangs above the system, the six project planets follow one another around
 * the star in blueprint order, and the last three stops continue the spiral beyond them.
 */
export type Vec3 = [number, number, number];

/** Planets are shown at fixed points on their orbits so the camera path through them is stable. */
export function planetPosition(id: ProjectId): Vector3 {
  return orbitPosition(planetConfigs[id].orbit, 0);
}

export const WORLD = {
  star: [0, 0, 0] as Vec3,
  skillNebula: [-30, 70, -150] as Vec3,
  achievements: [103, 22, -19] as Vec3,
  observatory: [86, -14, 76] as Vec3,
  station: [-6, -8, 125] as Vec3,
};
