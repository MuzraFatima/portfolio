import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, type Mesh, type ShaderMaterial } from 'three';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import { usePlanetTexture } from './textures';

const coronaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft corona: a bright inner glow, a wide faint halo and slowly shifting streamers.
const coronaFragment = /* glsl */ `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float a = atan(p.y, p.x);
    float streamers = 0.5 + 0.5 * sin(a * 7.0 + time * 0.15) * sin(a * 3.0 - time * 0.1);
    float glow = exp(-r * 6.0) * 2.2 + exp(-r * 2.4) * 0.5 * (0.7 + 0.3 * streamers);
    glow *= smoothstep(1.0, 0.25, r);
    vec3 col = mix(vec3(1.0, 0.55, 0.18), vec3(1.0, 0.9, 0.7), exp(-r * 4.0));
    gl_FragColor = vec4(col * glow, glow);
  }
`;

export const STAR_RADIUS = 5.5;

/**
 * The central star: a real solar surface map, self-lit and slowly rotating, wrapped in a corona.
 * It is also the light source for every planet, so its point light casts the shadows.
 */
export function CentralStar() {
  const texture = usePlanetTexture('sun');
  const quality = useEffectiveQuality();
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const surface = useRef<Mesh>(null);
  const corona = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (surface.current) surface.current.rotation.y += delta * 0.02;
    if (corona.current) corona.current.uniforms.time.value += delta;
  });

  const shadowSize = quality === 'high' ? 2048 : 1024;

  return (
    <group>
      <mesh ref={surface}>
        <sphereGeometry args={[STAR_RADIUS, 96, 64]} />
        <meshBasicMaterial map={texture} color={[3.2, 2.3, 1.5]} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh renderOrder={2}>
          <planeGeometry args={[STAR_RADIUS * 12, STAR_RADIUS * 12]} />
          <shaderMaterial
            ref={corona}
            uniforms={uniforms}
            vertexShader={coronaVertex}
            fragmentShader={coronaFragment}
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      <pointLight
        color="#fff1dc"
        intensity={2600}
        distance={0}
        decay={1.7}
        castShadow={quality !== 'low'}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.0008}
        shadow-camera-near={STAR_RADIUS}
        shadow-camera-far={140}
      />
    </group>
  );
}
