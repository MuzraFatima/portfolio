import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useEffectiveQuality } from '@/store/useGalaxyStore';
import { QUALITY_PROFILES } from '@/utils/device';
import { GalaxyScene } from './GalaxyScene';

/**
 * The single, persistent WebGL canvas. Regions are parts of one world, so navigating never
 * tears down and rebuilds the 3D environment.
 */
export default function GalaxyCanvas() {
  const quality = useEffectiveQuality();
  const profile = QUALITY_PROFILES[quality];
  const [dpr, setDpr] = useState<number>(profile.dpr[1]);

  return (
    <Canvas
      shadows
      className="!fixed inset-0"
      dpr={[profile.dpr[0], dpr]}
      camera={{ position: [0, 34, 96], fov: 50, near: 0.1, far: 2000 }}
      gl={{
        antialias: quality !== 'low',
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        outputColorSpace: SRGBColorSpace,
      }}
      aria-hidden="true"
    >
      <color attach="background" args={['#03040b']} />
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(profile.dpr[0], d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(profile.dpr[1], d + 0.25))}
      />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <GalaxyScene />
      </Suspense>
    </Canvas>
  );
}
