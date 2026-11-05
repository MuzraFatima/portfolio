import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const hull = { color: '#d9dde4', metalness: 0.75, roughness: 0.35 } as const;
const foil = { color: '#c9a24a', metalness: 0.95, roughness: 0.28 } as const;
const panel = { color: '#14254d', metalness: 0.7, roughness: 0.22, emissive: '#06102a' } as const;

function SolarArray({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0, s * 2.4]} castShadow>
          <boxGeometry args={[1.5, 0.04, 4]} />
          <meshStandardMaterial {...panel} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 9]} />
        <meshStandardMaterial {...hull} />
      </mesh>
    </group>
  );
}

/** R07 — a modular space station: truss, pressurised modules, solar arrays and a spinning ring. */
export function SpaceStation() {
  const ring = useRef<Group>(null);
  const body = useRef<Group>(null);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (ring.current) ring.current.rotation.z += delta * 0.18;
    if (body.current) body.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={body}>
      {/* Main truss */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 16, 0.35]} />
        <meshStandardMaterial {...hull} />
      </mesh>
      {/* Pressurised modules */}
      {[-1.6, 0, 1.6].map((z, i) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 1.5, 24]} />
          <meshStandardMaterial {...(i === 1 ? foil : hull)} />
        </mesh>
      ))}
      <mesh position={[0, 0, 2.9]} castShadow>
        <sphereGeometry args={[0.6, 24, 16]} />
        <meshStandardMaterial {...hull} />
      </mesh>
      {/* Solar arrays */}
      {[-7, -4.5, 4.5, 7].map((x) => (
        <SolarArray key={x} position={[x, 0, 0]} />
      ))}
      {/* Rotating habitat ring */}
      <group ref={ring} position={[0, 0, -2.6]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[2.4, 0.22, 16, 64]} />
          <meshStandardMaterial {...hull} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[0.08, 4.8, 0.08]} />
            <meshStandardMaterial {...hull} />
          </mesh>
        ))}
      </group>
      {/* Navigation beacons */}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={x < 0 ? '#ff4d4d' : '#4dff88'} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
