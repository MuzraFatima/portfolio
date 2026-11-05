import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

/**
 * Root of the 3D world. Phase 02 renders a minimal star and star field to prove the canvas;
 * later phases replace this with the full galaxy.
 */
export function GalaxyScene() {
  const star = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (star.current) star.current.rotation.y += delta * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={600} color="#ffe7a8" />
      <mesh ref={star}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial color="#ffd27a" />
      </mesh>
      <Stars radius={300} depth={120} count={4000} factor={6} fade speed={0.4} />
    </>
  );
}
