import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useLayoutEffect } from 'react';
import { SRGBColorSpace, type Texture } from 'three';
import { useEffectiveQuality } from '@/store/useGalaxyStore';

const BASE = `${import.meta.env.BASE_URL}assets/textures`;

export type PlanetMap =
  | 'sun'
  | 'neptune'
  | 'uranus'
  | 'earth-daymap'
  | 'earth-nightmap'
  | 'earth-clouds'
  | 'venus-atmosphere'
  | 'jupiter'
  | 'mars'
  | 'moon'
  | 'mercury'
  | 'saturn';

export type SpaceImage =
  'carina-nebula' | 'helix-nebula' | 'pillars-of-creation' | 'sombrero-galaxy' | 'whirlpool-galaxy';

/** URL of a planet surface map at the resolution that suits the current quality level. */
export function usePlanetMapUrl(name: PlanetMap): string {
  const quality = useEffectiveQuality();
  return `${BASE}/planets/${name}-${quality === 'low' ? '1k' : '2k'}.webp`;
}

export function spaceImageUrl(name: SpaceImage): string {
  return `${BASE}/space/${name}.webp`;
}

export function useSkyUrl(): string {
  const quality = useEffectiveQuality();
  return `${BASE}/space/milkyway-${quality === 'high' ? '4k' : '2k'}.webp`;
}

export const RING_ALPHA_URL = `${BASE}/planets/ring-alpha.webp`;

/** Marks colour textures as sRGB and applies the best anisotropic filtering the GPU offers. */
export function useColorTextures(...textures: Texture[]) {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  useLayoutEffect(() => {
    for (const t of textures) {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(8, maxAnisotropy);
      t.needsUpdate = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAnisotropy, ...textures]);
}

/** Loads one planet map and prepares it for colour use. */
export function usePlanetTexture(name: PlanetMap): Texture {
  const texture = useTexture(usePlanetMapUrl(name));
  useColorTextures(texture);
  return texture;
}
