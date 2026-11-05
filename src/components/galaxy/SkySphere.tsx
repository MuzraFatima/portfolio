import { useTexture } from '@react-three/drei';
import { BackSide } from 'three';
import { useColorTextures, useSkyUrl } from './textures';

/**
 * The real night sky: ESO's 360° photograph of the Milky Way wrapped on the inside of a huge sphere.
 * Tilted so the galactic band crosses the scene diagonally, which reads as more cinematic.
 */
export function SkySphere() {
  const texture = useTexture(useSkyUrl());
  useColorTextures(texture);

  return (
    <mesh rotation={[0.35, 0.6, -0.42]} renderOrder={-10}>
      <sphereGeometry args={[1400, 64, 32]} />
      <meshBasicMaterial
        map={texture}
        side={BackSide}
        depthWrite={false}
        toneMapped={false}
        color="#aeb8e6"
        fog={false}
      />
    </mesh>
  );
}
