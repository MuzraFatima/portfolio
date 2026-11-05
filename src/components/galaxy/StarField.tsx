import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, type ShaderMaterial } from 'three';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import { QUALITY_PROFILES } from '@/utils/device';

/** Approximate colours of real stars by spectral class (O/B blue-white → M red-orange). */
const SPECTRAL = [
  [0.62, 0.71, 1.0],
  [0.78, 0.84, 1.0],
  [0.97, 0.97, 1.0],
  [1.0, 0.96, 0.88],
  [1.0, 0.87, 0.68],
  [1.0, 0.74, 0.52],
];
// Weighted toward white and yellow stars, as in the real sky.
const WEIGHTS = [0.04, 0.12, 0.3, 0.28, 0.17, 0.09];

function pickSpectral(r: number) {
  let acc = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i];
    if (r <= acc) return SPECTRAL[i];
  }
  return SPECTRAL[2];
}

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float seed;
  attribute vec3 color;
  uniform float time;
  uniform float pixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = color;
    vTwinkle = 0.75 + 0.25 * sin(time * (0.6 + seed * 1.8) + seed * 40.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * pixelRatio * (320.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = exp(-d * d * 60.0);
    float halo = exp(-d * d * 12.0) * 0.35;
    float a = (core + halo) * vTwinkle;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

/**
 * Foreground stars between the camera and the photographed sky. They give real parallax when
 * the camera moves, which a flat sky image alone cannot.
 */
export function StarField() {
  const quality = useEffectiveQuality();
  const count = QUALITY_PROFILES[quality].stars;
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const material = useRef<ShaderMaterial>(null);

  const { positions, colors, sizes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Uniform direction, radius between 160 and 900 so stars sit around and beyond the regions.
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const r = 160 + Math.pow(Math.random(), 0.6) * 740;
      const s = Math.sqrt(1 - u * u);
      positions.set([r * s * Math.cos(theta), r * u, r * s * Math.sin(theta)], i * 3);
      colors.set(pickSpectral(Math.random()), i * 3);
      // Most stars are faint; a few are bright.
      sizes[i] = 0.45 + Math.pow(Math.random(), 7) * 3.2;
      seeds[i] = Math.random();
    }
    return { positions, colors, sizes, seeds };
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
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
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
