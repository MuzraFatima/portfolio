import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { type Group, Vector3 } from 'three';
import { Moon } from '@/components/planets/Moon';
import { Planet } from '@/components/planets/Planet';
import { SceneLabel } from '@/components/shared/SceneLabel';
import { Satellite } from '@/components/spacecraft/Satellite';
import { Spring } from '@/physics/motion';
import { orbitPosition, planetPositions } from '@/physics/orbits';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { Project } from '@/types/content';
import { planetConfigs } from './planetConfigs';

/** One project world travelling on its orbit, selectable by click, tap or its label button. */
export function ProjectPlanet({ project }: { project: Project }) {
  const config = planetConfigs[project.id];
  const group = useRef<Group>(null);
  const visual = useRef<Group>(null);
  const swell = useRef(new Spring(1, 120, 14));
  const [hovered, setHovered] = useState(false);
  const selected = useGalaxyStore((s) => s.selectedProject === project.id);
  const selectProject = useGalaxyStore((s) => s.selectProject);
  const hoverProject = useGalaxyStore((s) => s.hoverProject);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  useCursor(hovered);

  useEffect(() => {
    planetPositions.set(project.id, new Vector3());
    return () => {
      planetPositions.delete(project.id);
    };
  }, [project.id]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    if (visual.current)
      visual.current.scale.setScalar(swell.current.step(hovered && !selected ? 1.08 : 1, delta));
    const t = reducedMotion ? 0 : clock.elapsedTime;
    orbitPosition(config.orbit, t, group.current.position);
    planetPositions.get(project.id)?.copy(group.current.position);
  });

  const radius = config.planet.radius;
  const select = () => selectProject(project.id);

  return (
    <group ref={group}>
      <group ref={visual}>
        <Planet {...config.planet}>
          {config.moons.map((m, i) => (
            <Moon key={i} {...m} />
          ))}
          {Array.from({ length: config.satellites ?? 0 }, (_, i) => (
            <Satellite
              key={i}
              distance={radius * 1.9 + i * 0.55}
              period={14 + i * 5}
              phase={(i / (config.satellites ?? 1)) * Math.PI * 2}
              inclination={0.25 * (i % 2 ? 1 : -1)}
            />
          ))}
        </Planet>
      </group>

      {/* Generous invisible hit area so small planets are easy to click or tap. */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          select();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          hoverProject(project.id);
        }}
        onPointerOut={() => {
          setHovered(false);
          hoverProject(null);
        }}
      >
        <sphereGeometry args={[radius * 1.7, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <SceneLabel
        position={[0, radius * (project.flagship ? 2.6 : 1.9), 0]}
        kicker={String(project.order).padStart(2, '0')}
        title={project.flagship ? `${project.name} · Flagship` : (project.shortName ?? project.name)}
        color={config.glow}
        active={selected || hovered}
        onActivate={select}
      />
    </group>
  );
}
