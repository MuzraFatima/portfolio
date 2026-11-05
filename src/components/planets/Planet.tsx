import { useTexture } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { forwardRef, type ReactNode, useMemo, useRef } from 'react';
import { AdditiveBlending, BackSide, Color, type Group, type Mesh } from 'three';
import { PlanetaryRings } from '@/components/galaxy/PlanetaryRings';
import { type PlanetMap, useColorTextures, usePlanetMapUrl } from '@/components/galaxy/textures';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PROFILES } from '@/utils/device';

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPositionW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPositionW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

// Rim glow that is strongest on the sunlit limb, the way a real atmosphere scatters light.
const atmosphereFragment = /* glsl */ `
  uniform vec3 color;
  uniform vec3 sunPosition;
  uniform float intensity;
  varying vec3 vNormalW;
  varying vec3 vPositionW;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 sunDir = normalize(sunPosition - vPositionW);
    float rim = pow(1.0 - abs(dot(viewDir, vNormalW)), 2.6);
    float lit = smoothstep(-0.35, 0.6, dot(vNormalW, sunDir));
    float a = rim * lit * intensity;
    gl_FragColor = vec4(color * a, a);
  }
`;

export interface PlanetProps {
  map: PlanetMap;
  radius: number;
  atmosphere?: { color: string; intensity?: number; scale?: number };
  clouds?: { map: PlanetMap; opacity?: number; color?: string; speed?: number };
  rings?: { inner: number; outer: number; color?: string; opacity?: number; tilt?: [number, number, number] };
  /** Subtle colour grade over the real surface map. */
  tint?: string;
  axialTilt?: number;
  spinSpeed?: number;
  roughness?: number;
  children?: ReactNode;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

/**
 * A realistic planet: a real surface map lit by the central star, optional cloud layer,
 * a scattering atmosphere, optional rings, and room for moons as children.
 */
export const Planet = forwardRef<Group, PlanetProps>(function Planet(
  {
    map,
    radius,
    atmosphere,
    clouds,
    rings,
    tint = '#ffffff',
    axialTilt = 0.4,
    spinSpeed = 0.08,
    roughness = 0.9,
    children,
    onClick,
    onPointerOver,
    onPointerOut,
  },
  ref,
) {
  const quality = useEffectiveQuality();
  const segments = QUALITY_PROFILES[quality].segments;
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  const surfaceUrl = usePlanetMapUrl(map);
  const cloudUrl = usePlanetMapUrl(clouds?.map ?? map);
  const [surfaceMap, cloudMap] = useTexture([surfaceUrl, cloudUrl]);
  useColorTextures(surfaceMap, cloudMap);

  const surface = useRef<Mesh>(null);
  const cloudMesh = useRef<Mesh>(null);

  const atmosphereUniforms = useMemo(
    () => ({
      color: { value: new Color(atmosphere?.color ?? '#88aaff') },
      sunPosition: { value: [0, 0, 0] },
      intensity: { value: atmosphere?.intensity ?? 1.2 },
    }),
    [atmosphere?.color, atmosphere?.intensity],
  );

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (surface.current) surface.current.rotation.y += delta * spinSpeed;
    if (cloudMesh.current) cloudMesh.current.rotation.y += delta * (clouds?.speed ?? spinSpeed * 1.25);
  });

  return (
    <group ref={ref}>
      <group rotation={[0, 0, axialTilt]}>
        <mesh
          ref={surface}
          castShadow
          receiveShadow
          onClick={onClick}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          <sphereGeometry args={[radius, segments, Math.round(segments * 0.75)]} />
          <meshStandardMaterial map={surfaceMap} color={tint} roughness={roughness} metalness={0} />
        </mesh>

        {clouds && (
          <mesh ref={cloudMesh} scale={1.012} castShadow={quality === 'high'} receiveShadow>
            <sphereGeometry args={[radius, segments, Math.round(segments * 0.75)]} />
            <meshStandardMaterial
              alphaMap={cloudMap}
              color={clouds.color ?? '#ffffff'}
              transparent
              opacity={clouds.opacity ?? 0.85}
              depthWrite={false}
              roughness={1}
            />
          </mesh>
        )}

        {rings && <PlanetaryRings {...rings} />}
      </group>

      {atmosphere && (
        <mesh scale={atmosphere.scale ?? 1.09}>
          <sphereGeometry args={[radius, 64, 48]} />
          <shaderMaterial
            uniforms={atmosphereUniforms}
            vertexShader={atmosphereVertex}
            fragmentShader={atmosphereFragment}
            blending={AdditiveBlending}
            side={BackSide}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {children}
    </group>
  );
});
