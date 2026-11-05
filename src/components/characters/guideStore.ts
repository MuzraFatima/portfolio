import { create } from 'zustand';
import type { RegionId } from '@/types/content';

export type Gesture = 'idle' | 'wave' | 'point';

interface GuideState {
  gesture: Gesture;
  gestureAt: number;
  pointAt: RegionId | null;
  wave: () => void;
  point: (region: RegionId | null) => void;
}

/** Animation state for the astronaut guide, kept apart from navigation state on purpose. */
export const useGuideStore = create<GuideState>((set) => ({
  gesture: 'idle',
  gestureAt: 0,
  pointAt: null,
  wave: () => set({ gesture: 'wave', gestureAt: performance.now() }),
  point: (region) =>
    set({ gesture: region ? 'point' : 'idle', pointAt: region, gestureAt: performance.now() }),
}));
