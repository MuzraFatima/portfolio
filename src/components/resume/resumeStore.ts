import { create } from 'zustand';

interface ResumeState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useResume = create<ResumeState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
