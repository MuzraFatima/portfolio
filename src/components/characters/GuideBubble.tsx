import { AnimatePresence, motion } from 'framer-motion';
import { guidedTour, regionById } from '@/data/regions';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { guideMessages } from './guideMessages';
import { useGuideStore } from './guideStore';

/**
 * The astronaut's speech bubble. It suggests the next stop on the guided tour but never blocks
 * anything: every region stays reachable from the menu, and the guide can be hidden at any time.
 */
export function GuideBubble() {
  const region = useGalaxyStore((s) => s.region);
  const guideEnabled = useGalaxyStore((s) => s.guideEnabled);
  const setPreference = useGalaxyStore((s) => s.setPreference);
  const goTo = useGalaxyStore((s) => s.goTo);
  const setMode = useGalaxyStore((s) => s.setMode);
  const selectedProject = useGalaxyStore((s) => s.selectedProject);
  const point = useGuideStore((s) => s.point);
  const wave = useGuideStore((s) => s.wave);

  const index = guidedTour.indexOf(region);
  const next = index >= 0 && index < guidedTour.length - 1 ? guidedTour[index + 1] : null;

  return (
    <AnimatePresence>
      {guideEnabled && !selectedProject && (
        <motion.aside
          key={region}
          aria-label="Guide"
          aria-live="polite"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
          className={`glass pointer-events-auto fixed right-4 z-30 hidden md:block w-[min(20rem,calc(100vw-2rem))] rounded-2xl p-4 text-sm sm:right-6 ${
            region === 'gateway' ? 'bottom-6 sm:right-[6%]' : 'bottom-24'
          }`}
        >
          <p className="mb-1 font-display text-[11px] tracking-[0.2em] text-accent-2 uppercase">Guide</p>
          <p className="leading-relaxed text-ink/90">{guideMessages[region]}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {next && (
              <button
                type="button"
                onMouseEnter={() => point(next)}
                onFocus={() => point(next)}
                onMouseLeave={() => point(null)}
                onBlur={() => point(null)}
                onClick={() => {
                  setMode('guided');
                  point(null);
                  goTo(next);
                }}
                className="rounded-full bg-accent/90 px-3.5 py-1.5 font-medium text-void transition hover:bg-accent-2"
              >
                {region === 'gateway' ? 'Start the tour' : `Next: ${regionById[next].label}`}
              </button>
            )}
            {region === 'gateway' && (
              <button
                type="button"
                onClick={() => {
                  setMode('free');
                  wave();
                  goTo('projects');
                }}
                className="rounded-full border border-line px-3.5 py-1.5 text-ink transition hover:border-accent-2"
              >
                Explore freely
              </button>
            )}
            <button
              type="button"
              onClick={() => setPreference('guideEnabled', false)}
              className="ml-auto text-xs text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Hide guide
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
