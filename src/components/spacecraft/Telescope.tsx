import { Float } from '@react-three/drei';

const silver = { color: '#d6dbe3', metalness: 0.92, roughness: 0.22 } as const;
const panel = { color: '#1b2f63', metalness: 0.6, roughness: 0.25, emissive: '#071230' } as const;

/** R06 — a Hubble-style space observatory: foil-wrapped tube, aperture door and twin solar wings. */
export function Telescope() {
  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
      <group rotation={[0.2, -0.7, 0.15]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 6, 32]} />
          <meshStandardMaterial {...silver} />
        </mesh>
        <mesh position={[-3.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.25, 1.25, 1.6, 32]} />
          <meshStandardMaterial color="#9aa1ad" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Open aperture door */}
        <mesh position={[3.15, 1.0, 0]} rotation={[0, 0, -0.9]} castShadow>
          <cylinderGeometry args={[1.22, 1.22, 0.08, 32]} />
          <meshStandardMaterial {...silver} />
        </mesh>
        <mesh position={[3.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[1.1, 32]} />
          <meshStandardMaterial color="#05070d" roughness={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[-1, 0, s * 3.4]}>
            <mesh castShadow>
              <boxGeometry args={[1.6, 0.04, 4.4]} />
              <meshStandardMaterial {...panel} />
            </mesh>
            <mesh position={[0, 0, -s * 2.4]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1]} />
              <meshStandardMaterial {...silver} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}
