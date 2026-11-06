import { Suspense } from 'react';
import { Constellation, type ConstellationNode } from '@/components/galaxy/Constellation';
import { SceneLabel } from '@/components/shared/SceneLabel';
import { SpaceStation } from '@/components/spacecraft/SpaceStation';
import { Telescope } from '@/components/spacecraft/Telescope';
import { achievements } from '@/data/achievements';
import { regionById } from '@/data/regions';
import { skillCategories } from '@/data/skills';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { RegionId } from '@/types/content';

function RegionLabel({ id, y }: { id: RegionId; y: number }) {
  const region = regionById[id];
  const active = useGalaxyStore((s) => s.region === id);
  const goTo = useGalaxyStore((s) => s.goTo);
  return (
    <SceneLabel
      position={[0, y, 0]}
      kicker={region.code}
      title={region.name}
      color={region.color}
      active={active}
      onActivate={() => goTo(id)}
    />
  );
}

// Skill categories laid out as an irregular constellation, one star per category.
const SKILL_LAYOUT: [number, number, number][] = [
  [-9, 5, 0],
  [-4, 8, -2],
  [2, 6.5, 1],
  [7, 9, -1],
  [10, 3, 0],
  [5, -1, 2],
  [-2, -2.5, -1],
  [-8, -1, 1],
];
const SKILL_NODES: ConstellationNode[] = skillCategories.map((c, i) => ({
  position: SKILL_LAYOUT[i % SKILL_LAYOUT.length],
  color: c.color,
  size: 9,
}));
const SKILL_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 0],
  [2, 5],
];

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

/** The non-planet regions: Skill Nebula, Achievement Constellation, Observatory and Station. */
export function Regions() {
  const skills = regionById.skills;
  const ach = regionById.achievements;
  const certs = regionById.certificates;
  const contact = regionById.contact;
  const region = useGalaxyStore((s) => s.region);

  return (
    <>
      <group position={skills.position}>
        <Constellation nodes={SKILL_NODES} edges={SKILL_EDGES} lineColor="#c4b5fd" />
        {region === 'skills' &&
          skillCategories.map((c, i) => (
            <SceneLabel
              key={c.id}
              position={[
                SKILL_NODES[i].position[0],
                SKILL_NODES[i].position[1] - 1.4,
                SKILL_NODES[i].position[2],
              ]}
              title={c.name}
              color={c.color}
              onActivate={() => useGalaxyStore.getState().goTo('skills')}
            />
          ))}
        <RegionLabel id="skills" y={13} />
      </group>

      <group position={ach.position}>
        <Constellation nodes={ACHIEVEMENT_NODES} edges={ACHIEVEMENT_EDGES} lineColor="#fde68a" />
        {region === 'achievements' &&
          achievements.map((a, i) => (
            <SceneLabel
              key={a.id}
              position={[ACHIEVEMENT_NODES[i].position[0], ACHIEVEMENT_NODES[i].position[1] - 1.8, 0]}
              title={a.year + ' · ' + (a.project ? 'SIH Winner' : 'Publication')}
              color="#fde68a"
              onActivate={() => useGalaxyStore.getState().goTo('achievements')}
            />
          ))}
        <RegionLabel id="achievements" y={11} />
      </group>

      <group position={certs.position}>
        {/* Fill light so the spacecraft read clearly far from the star. */}
        <pointLight position={[10, 7, 14]} intensity={60} distance={40} decay={1} color="#e6ecff" />
        <pointLight position={[-8, -2, -6]} intensity={20} distance={30} decay={1} color="#ffd2a0" />
        <Telescope />
        <RegionLabel id="certificates" y={5} />
      </group>

      <group position={contact.position}>
        <pointLight position={[-10, 7, 14]} intensity={60} distance={40} decay={1} color="#e6ecff" />
        <pointLight position={[8, -2, -6]} intensity={20} distance={30} decay={1} color="#ffd2a0" />
        <Suspense fallback={null}>
          <SpaceStation />
        </Suspense>
        <RegionLabel id="contact" y={4.5} />
      </group>
    </>
  );
}
