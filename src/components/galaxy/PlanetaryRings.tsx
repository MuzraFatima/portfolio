import { useTexture } from '@react-three/drei';
import { useLayoutEffect, useMemo } from 'react';
import { DoubleSide, RingGeometry, SRGBColorSpace, Vector3 } from 'three';
import { RING_ALPHA_URL } from './textures';

interface Props {
  inner: number;
  outer: number;
  /** Tint applied to the real ring photograph so each ringed planet keeps its identity. */
  color?: string;
  opacity?: number;
  tilt?: [number, number, number];
}

/**
 * Rings textured with a real ring-brightness profile. The texture runs across the ring's width,
 * so the UVs are remapped from the default square layout to inner → outer radius.
 */
export function PlanetaryRings({ inner, outer, color = '#ffffff', opacity = 0.9, tilt = [0, 0, 0] }: Props) {
  const texture = useTexture(RING_ALPHA_URL);

  useLayoutEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  const geometry = useMemo(() => {
    const g = new RingGeometry(inner, outer, 160, 1);
    const pos = g.attributes.position;
    const uv = g.attributes.uv;
    const v = new Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    return g;
  }, [inner, outer]);

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2 + tilt[0], tilt[1], tilt[2]]} receiveShadow castShadow>
      <meshStandardMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        side={DoubleSide}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
