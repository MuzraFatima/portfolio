import { Suspense } from 'react';
import { Constellation, type ConstellationNode } from '@/components/galaxy/Constellation';
import { SpaceStation } from '@/components/spacecraft/SpaceStation';
import { Telescope } from '@/components/spacecraft/Telescope';
import { WORLD } from '@/journey/world';

// One bright star per achievement, joined into a small constellation.
const ACHIEVEMENT_NODES: ConstellationNode[] = [
  { position: [0, 4, 0], color: '#ffe7a8', size: 16 },
  { position: [6, -1, 1], color: '#fde68a', size: 12 },
  { position: [-5, -2, -1], color: '#cbd5ff', size: 5 },
  { position: [2, -5, 0], color: '#cbd5ff', size: 4 },
  { position: [-2, 7.5, -1], color: '#cbd5ff', size: 4 },
];
const ACHIEVEMENT_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [0, 4],
];

/** The places along the journey that are not planets. */
export function Regions() {
  return (
    <>
      <group position={WORLD.achievements}>
        <Constellation nodes={ACHIEVEMENT_NODES} edges={ACHIEVEMENT_EDGES} lineColor="#fde68a" />
      </group>

      <group position={WORLD.observatory}>
        {/* Fill light so the spacecraft read clearly far from the star. */}
        <pointLight position={[-10, 7, 14]} intensity={60} distance={40} decay={1} color="#e6ecff" />
        <pointLight position={[8, -2, -6]} intensity={20} distance={30} decay={1} color="#ffd2a0" />
        <Telescope />
      </group>

      <group position={WORLD.station}>
        <pointLight position={[10, 7, 14]} intensity={60} distance={40} decay={1} color="#e6ecff" />
        <pointLight position={[-8, -2, -6]} intensity={20} distance={30} decay={1} color="#ffd2a0" />
        <Suspense fallback={null}>
          <SpaceStation />
        </Suspense>
      </group>
    </>
  );
}
