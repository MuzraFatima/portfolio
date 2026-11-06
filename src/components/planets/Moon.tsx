import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { usePlanetTexture } from '@/components/galaxy/textures';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { MoonSpec } from '@/scenes/ProjectSolarSystem/planetConfigs';

/** A moon with a real lunar or Mercurian surface, tidally locked to its planet. */
export function Moon({ map, radius, distance, period, phase, tilt = 0 }: MoonSpec) {
  const texture = usePlanetTexture(map);
  const ref = useRef<Group>(null);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const a = phase + (t / period) * Math.PI * 2;
    ref.current.position.set(Math.cos(a) * distance, Math.sin(a) * distance * tilt, Math.sin(a) * distance);
    ref.current.rotation.y = -a;
  });

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 24]} />
        <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={0.03} roughness={0.95} />
      </mesh>
    </group>
  );
}
