import { create } from 'zustand';
import type { ProjectId } from '@/types/content';
import { detectQuality, prefersReducedMotion, type QualityLevel } from '@/utils/device';

interface GalaxyState {
  /** Follows the operating-system setting; there is no separate switch on the page. */
  reducedMotion: boolean;
  webglAvailable: boolean;
  hoveredProject: ProjectId | null;
  setReducedMotion: (value: boolean) => void;
  setWebglAvailable: (value: boolean) => void;
  hoverProject: (id: ProjectId | null) => void;
}

export const useGalaxyStore = create<GalaxyState>()((set) => ({
  reducedMotion: prefersReducedMotion(),
  webglAvailable: true,
  hoveredProject: null,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setWebglAvailable: (webglAvailable) => set({ webglAvailable }),
  hoverProject: (hoveredProject) => set({ hoveredProject }),
}));

/** Rendering quality, chosen once from the device's screen size, cores and memory. */
export function useEffectiveQuality(): QualityLevel {
  return detectQuality();
}
