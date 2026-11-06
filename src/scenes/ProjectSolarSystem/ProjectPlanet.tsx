import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Group } from 'three';
import { Moon } from '@/components/planets/Moon';
import { Planet } from '@/components/planets/Planet';
import { Satellite } from '@/components/spacecraft/Satellite';
import { scrollToStop } from '@/journey/progress';
import { planetPosition } from '@/journey/world';
import { Spring } from '@/physics/motion';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { Project } from '@/types/content';
import { planetConfigs } from './planetConfigs';

/** Clicks on the page's text pass through to the 3D scene; ignore those so reading never jumps. */
const overText = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest('a, button, p, h1, h2, h3, h4, li, form, dialog'));

/** One project world. Clicking or tapping it scrolls the journey to that project. */
export function ProjectPlanet({ project }: { project: Project }) {
  const config = planetConfigs[project.id];
  const position = useMemo(() => planetPosition(project.id), [project.id]);
  const visual = useRef<Group>(null);
  const swell = useRef(new Spring(1, 120, 14));
  const [hovered, setHovered] = useState(false);
  const hoverProject = useGalaxyStore((s) => s.hoverProject);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (visual.current) visual.current.scale.setScalar(swell.current.step(hovered ? 1.04 : 1, delta));
  });

  const radius = config.planet.radius;

  return (
    <group position={position}>
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

      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (overText(e.nativeEvent.target)) return;
          scrollToStop(`project-${project.id}`);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (overText(e.nativeEvent.target)) return;
          setHovered(true);
          hoverProject(project.id);
        }}
        onPointerOut={() => {
          setHovered(false);
          hoverProject(null);
        }}
      >
        <sphereGeometry args={[radius * 1.3, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
