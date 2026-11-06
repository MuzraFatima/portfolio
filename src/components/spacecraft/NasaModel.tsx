import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Box3, type Group, type Mesh, type MeshStandardMaterial, Vector3 } from 'three';
import { useGalaxyStore } from '@/store/useGalaxyStore';

interface Props {
  url: string;
  /** Size of the model's longest side, in world units. */
  size: number;
  rotation?: [number, number, number];
  /** Slow turn around the vertical axis, in radians per second. */
  spin?: number;
}

/**
 * A real NASA spacecraft model (NASA 3D Resources), centred and scaled to fit the scene,
 * drifting and turning slowly the way a spacecraft holds attitude.
 */
export function NasaModel({ url, size, rotation = [0, 0, 0], spin = 0.02 }: Props) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(true), [scene]);
  const body = useRef<Group>(null);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(model);
    const dims = box.getSize(new Vector3());
    const centre = box.getCenter(new Vector3());
    const s = size / Math.max(dims.x, dims.y, dims.z);
    return { scale: s, offset: centre.multiplyScalar(-s) };
  }, [model, size]);

  useLayoutEffect(() => {
    model.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Without an environment map, very metallic surfaces render black; keep them readable.
      const m = mesh.material as MeshStandardMaterial;
      if ('metalness' in m) m.metalness = Math.min(m.metalness, 0.45);
    });
  }, [model]);

  useFrame(({ clock }, delta) => {
    if (!body.current || reducedMotion) return;
    body.current.rotation.y += delta * spin;
    body.current.position.y = Math.sin(clock.elapsedTime * 0.4) * size * 0.015;
  });

  return (
    <group rotation={rotation}>
      <group ref={body}>
        <group position={offset} scale={scale}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}
