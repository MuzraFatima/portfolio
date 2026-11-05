import { Suspense, useMemo } from 'react';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute } from 'three';
import { projects } from '@/data/projects';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { ProjectId } from '@/types/content';
import { planetConfigs } from './planetConfigs';
import { ProjectPlanet } from './ProjectPlanet';

/** A faint orbit path; brighter for the selected or hovered planet. */
function OrbitPath({ id }: { id: ProjectId }) {
  const { orbit, glow } = planetConfigs[id];
  const highlighted = useGalaxyStore((s) => s.selectedProject === id || s.hoveredProject === id);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const steps = 256;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      points.push(
        Math.cos(a) * orbit.radius,
        Math.sin(a) * Math.sin(orbit.inclination) * orbit.radius * 0.15,
        Math.sin(a) * orbit.radius,
      );
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(points, 3));
    return g;
  }, [orbit]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        color={highlighted ? glow : '#8090c0'}
        transparent
        opacity={highlighted ? 0.55 : 0.12}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </lineLoop>
  );
}

/** R04 — the six project planets orbiting the central star, in the blueprint's fixed order. */
export function ProjectSolarSystem() {
  return (
    <group>
      {projects.map((p) => (
        <group key={p.id}>
          <OrbitPath id={p.id} />
          <Suspense fallback={null}>
            <ProjectPlanet project={p} />
          </Suspense>
        </group>
      ))}
    </group>
  );
}
