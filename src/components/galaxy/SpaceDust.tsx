import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, type ShaderMaterial } from 'three';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PROFILES } from '@/utils/device';

const vertexShader = /* glsl */ `
  attribute float seed;
  uniform float time;
  uniform float pixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Slow drift so the dust feels suspended rather than frozen.
    p.x += sin(time * 0.05 + seed * 12.0) * 2.0;
    p.y += cos(time * 0.04 + seed * 7.0) * 1.2;
    p.z += sin(time * 0.03 + seed * 5.0) * 2.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vAlpha = smoothstep(260.0, 20.0, -mv.z) * (0.08 + seed * 0.14);
    gl_PointSize = (1.0 + seed * 1.5) * pixelRatio * (90.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vec3(0.75, 0.8, 1.0) * a, a);
  }
`;

/** Fine interplanetary dust lit faintly by the star; gives the space near the camera volume. */
export function SpaceDust() {
  const quality = useEffectiveQuality();
  const count = QUALITY_PROFILES[quality].dust;
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const material = useRef<ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 110;
      const a = Math.random() * Math.PI * 2;
      positions.set([Math.cos(a) * r, (Math.random() - 0.5) * 30, Math.sin(a) * r], i * 3);
      seeds[i] = Math.random();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({ time: { value: 0 }, pixelRatio: { value: Math.min(window.devicePixelRatio, 2) } }),
    [],
  );

  useFrame((_, delta) => {
    if (material.current && !reducedMotion) material.current.uniforms.time.value += delta;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
