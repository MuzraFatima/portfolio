import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, type Group, IcosahedronGeometry, type InstancedMesh, Object3D, Vector3 } from 'three';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PROFILES } from '@/utils/device';
import { usePlanetTexture } from './textures';

/** Deterministic pseudo-random value for a vertex position, so shared vertices move together. */
function hash3(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

function makeRockGeometry() {
  const g = new IcosahedronGeometry(1, 2);
  const pos = g.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = hash3(v.x, v.y, v.z);
    const lumps = 0.78 + n * 0.32 + Math.sin(v.x * 3.1 + v.y * 2.3) * 0.06;
    v.multiplyScalar(lumps);
    v.y *= 0.82; // most asteroids are elongated, not round
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

interface Props {
  inner?: number;
  outer?: number;
  thickness?: number;
}

/**
 * The main asteroid belt between the inner and outer project planets. One instanced mesh draws
 * every rock in a single call; each rock gets its own size, tilt and shade of real lunar rock.
 */
export function AsteroidField({ inner = 47, outer = 55, thickness = 2.2 }: Props) {
  const quality = useEffectiveQuality();
  const count = QUALITY_PROFILES[quality].asteroids;
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const texture = usePlanetTexture('moon');
  const mesh = useRef<InstancedMesh>(null);
  const group = useRef<Group>(null);

  const geometry = useMemo(makeRockGeometry, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const dummy = new Object3D();
    const tint = new Color();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Denser towards the middle of the belt.
      const t = (Math.random() + Math.random()) / 2;
      const r = inner + t * (outer - inner);
      dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * thickness, Math.sin(angle) * r);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.035 + Math.pow(Math.random(), 5) * 0.42;
      dummy.scale.set(s, s * (0.7 + Math.random() * 0.5), s * (0.8 + Math.random() * 0.4));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      const shade = 0.55 + Math.random() * 0.35;
      tint.setRGB(shade, shade * (0.92 + Math.random() * 0.06), shade * 0.88);
      mesh.current.setColorAt(i, tint);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [count, inner, outer, thickness]);

  useFrame((_, delta) => {
    if (group.current && !reducedMotion) group.current.rotation.y += delta * 0.004;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[geometry, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial map={texture} roughness={0.95} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}
