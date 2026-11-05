import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { guidedTour, regions } from '@/data/regions';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { RegionId } from '@/types/content';
import { SettingsMenu } from './SettingsMenu';

const NAV: RegionId[] = ['gateway', 'about', 'skills', 'projects', 'achievements', 'certificates', 'contact'];

/** Quick navigation: every region is one click (or one key) away, whatever mode you are in. */
export function Navigation() {
  const region = useGalaxyStore((s) => s.region);
  const goTo = useGalaxyStore((s) => s.goTo);
  const mode = useGalaxyStore((s) => s.mode);
  const setMode = useGalaxyStore((s) => s.setMode);
  const selectedProject = useGalaxyStore((s) => s.selectedProject);
  const selectProject = useGalaxyStore((s) => s.selectProject);
  const [open, setOpen] = useState(false);

  // Keyboard: 1–7 jump to a region, ← → step through the tour, Esc goes back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Escape') {
        if (selectedProject) selectProject(null);
        else if (region !== 'gateway') goTo('gateway');
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= NAV.length) {
        goTo(NAV[n - 1]);
        return;
      }
      const i = guidedTour.indexOf(region);
      if (e.key === 'ArrowRight' && i < guidedTour.length - 1) goTo(guidedTour[i + 1]);
      if (e.key === 'ArrowLeft' && i > 0) goTo(guidedTour[i - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [region, selectedProject, goTo, selectProject]);

  const link = (id: RegionId, onDone?: () => void) => {
    const r = regions.find((x) => x.id === id)!;
    const active = region === id;
    return (
      <li key={id}>
        <button
          type="button"
          aria-current={active ? 'page' : undefined}
          onClick={() => {
            goTo(id);
            onDone?.();
          }}
          className={`rounded-full px-3 py-1.5 text-sm transition ${
            active ? 'bg-white/12 text-white' : 'text-ink/75 hover:bg-white/8 hover:text-white'
          }`}
        >
          {r.label}
        </button>
      </li>
    );
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 p-3 sm:p-4">
      <button
        type="button"
        onClick={() => goTo('gateway')}
        className="glass pointer-events-auto rounded-full px-4 py-2 font-display text-sm font-semibold tracking-wide text-white"
      >
        Muzra Fatima
      </button>

      <nav aria-label="Galaxy regions" className="glass pointer-events-auto hidden rounded-full p-1 lg:block">
        <ul className="flex items-center gap-0.5">{NAV.map((id) => link(id))}</ul>
      </nav>

      <div className="pointer-events-auto flex items-center gap-2">
        <div
          role="group"
          aria-label="Exploration mode"
          className="glass hidden rounded-full p-1 text-xs sm:flex"
        >
          {(['guided', 'free'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 capitalize transition ${
                mode === m ? 'bg-accent text-void' : 'text-ink/75 hover:text-white'
              }`}
              title={m === 'guided' ? 'Camera follows the tour' : 'Drag to orbit, scroll to zoom'}
            >
              {m}
            </button>
          ))}
        </div>
        <SettingsMenu />
        <button
          type="button"
          className="glass rounded-full px-4 py-2 text-sm text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Galaxy regions"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass pointer-events-auto absolute top-16 right-3 left-3 rounded-2xl p-3 lg:hidden"
          >
            <ul className="grid grid-cols-2 gap-1">{NAV.map((id) => link(id, () => setOpen(false)))}</ul>
            <div className="mt-3 flex gap-2 border-t border-line pt-3 text-xs sm:hidden">
              {(['guided', 'free'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full px-3 py-2 capitalize ${mode === m ? 'bg-accent text-void' : 'border border-line text-ink'}`}
                >
                  {m} mode
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
