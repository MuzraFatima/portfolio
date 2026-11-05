import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ProjectId, RegionId } from '@/types/content';
import { detectQuality, prefersReducedMotion, type QualityLevel } from '@/utils/device';

export type ExploreMode = 'guided' | 'free';
export type QualitySetting = QualityLevel | 'auto';

interface Preferences {
  quality: QualitySetting;
  reducedMotion: boolean;
  soundOn: boolean;
  guideEnabled: boolean;
  /** Visitors who already watched the intro can skip it next time. */
  introSeen: boolean;
}

interface GalaxyState extends Preferences {
  region: RegionId;
  selectedProject: ProjectId | null;
  hoveredProject: ProjectId | null;
  mode: ExploreMode;
  introActive: boolean;
  /** True while the camera is flying between targets. */
  travelling: boolean;
  /** Plain-HTML view of all content, for visitors who prefer it or have no WebGL. */
  textMode: boolean;
  webglAvailable: boolean;

  goTo: (region: RegionId) => void;
  selectProject: (id: ProjectId | null) => void;
  hoverProject: (id: ProjectId | null) => void;
  setMode: (mode: ExploreMode) => void;
  finishIntro: () => void;
  setTravelling: (value: boolean) => void;
  setTextMode: (value: boolean) => void;
  setWebglAvailable: (value: boolean) => void;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
}

export const useGalaxyStore = create<GalaxyState>()(
  persist(
    (set) => ({
      quality: 'auto',
      reducedMotion: prefersReducedMotion(),
      soundOn: false,
      guideEnabled: true,
      introSeen: false,

      region: 'gateway',
      selectedProject: null,
      hoveredProject: null,
      mode: 'guided',
      introActive: true,
      travelling: false,
      textMode: false,
      webglAvailable: true,

      goTo: (region) =>
        set((s) => ({
          region,
          selectedProject: region === 'projects' ? s.selectedProject : null,
          introActive: false,
        })),
      selectProject: (id) =>
        set(() => ({
          selectedProject: id,
          region: 'projects',
          introActive: false,
        })),
      hoverProject: (id) => set({ hoveredProject: id }),
      setMode: (mode) => set({ mode }),
      finishIntro: () => set({ introActive: false, introSeen: true }),
      setTravelling: (travelling) => set({ travelling }),
      setTextMode: (textMode) => set({ textMode }),
      setWebglAvailable: (webglAvailable) => set({ webglAvailable }),
      setPreference: (key, value) => set({ [key]: value } as Partial<GalaxyState>),
    }),
    {
      name: 'muzra-galaxy-preferences',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): Preferences => ({
        quality: s.quality,
        reducedMotion: s.reducedMotion,
        soundOn: false, // audio must always start from a fresh user gesture
        guideEnabled: s.guideEnabled,
        introSeen: s.introSeen,
      }),
    },
  ),
);

/** The quality level actually used for rendering, resolving "auto". */
export function useEffectiveQuality(): QualityLevel {
  const quality = useGalaxyStore((s) => s.quality);
  return quality === 'auto' ? detectQuality() : quality;
}
