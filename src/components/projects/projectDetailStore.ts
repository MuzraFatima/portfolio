import { create } from 'zustand';
import type { ProjectId } from '@/types/content';

interface ProjectDetailState {
  openId: ProjectId | null;
  open: (id: ProjectId) => void;
  close: () => void;
}

export const useProjectDetail = create<ProjectDetailState>()((set) => ({
  openId: null,
  open: (openId) => set({ openId }),
  close: () => set({ openId: null }),
}));
