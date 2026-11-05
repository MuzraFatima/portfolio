import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useEffectiveQuality } from '@/store/useGalaxyStore';

/**
 * Bloom lets the star, corona and bright stars glow the way a camera sensor would record them.
 * Skipped entirely on low quality, where it would cost too much frame time.
 */
export function Effects() {
  const quality = useEffectiveQuality();
  if (quality === 'low') return null;

  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        intensity={quality === 'high' ? 0.9 : 0.6}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      <Vignette offset={0.32} darkness={0.62} />
    </EffectComposer>
  );
}
