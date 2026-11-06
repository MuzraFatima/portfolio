import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { useGalaxyStore } from '@/store/useGalaxyStore';

interface Props {
  distance: number;
  period: number;
  phase: number;
  inclination?: number;
  scale?: number;
}

/** A small communications satellite: gold-foil bus, two solar wings and a dish. */
export function Satellite({ distance, period, phase, inclination = 0, scale = 0.22 }: Props) {
  const orbit = useRef<Group>(null);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  useFrame(({ clock }) => {
    if (!orbit.current) return;
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const a = phase + (t / period) * Math.PI * 2;
    orbit.current.position.set(
      Math.cos(a) * distance,
      Math.sin(a) * distance * inclination,
      Math.sin(a) * distance,
    );
    orbit.current.rotation.y = -a;
  });

  return (
    <group ref={orbit}>
      <group scale={scale}>
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1.4]} />
          <meshStandardMaterial color="#d4a94a" metalness={0.5} roughness={0.32} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 2.1, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[3, 0.05, 1.1]} />
              <meshStandardMaterial color="#1a2c5c" metalness={0.65} roughness={0.25} emissive="#0a1430" />
            </mesh>
            <mesh position={[-side * 1.55, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6]} />
              <meshStandardMaterial color="#b8bec8" metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.75, 0.3]} rotation={[-0.6, 0, 0]}>
          <coneGeometry args={[0.55, 0.3, 24, 1, true]} />
          <meshStandardMaterial color="#e8ebf0" metalness={0.4} roughness={0.4} side={2} />
        </mesh>
      </group>
    </group>
  );
}
