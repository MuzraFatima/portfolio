import { motion } from 'framer-motion';
import { guidedTour, regionById } from '@/data/regions';
import { useGalaxyStore } from '@/store/useGalaxyStore';

/** Where you are on the guided tour. Each dot is also a shortcut to that stop. */
export function TourProgress() {
  const region = useGalaxyStore((s) => s.region);
  const mode = useGalaxyStore((s) => s.mode);
  const selected = useGalaxyStore((s) => s.selectedProject);
  const goTo = useGalaxyStore((s) => s.goTo);
  if (mode !== 'guided' || selected) return null;
  const index = guidedTour.indexOf(region);

  return (
    <nav
      aria-label="Tour progress"
      className="pointer-events-auto fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
    >
      {guidedTour.map((id, i) => (
        <button
          key={id}
          type="button"
          onClick={() => goTo(id)}
          aria-label={`Go to ${regionById[id].name}`}
          aria-current={i === index ? 'step' : undefined}
          className="group relative flex h-4 w-4 items-center justify-center"
        >
          <motion.span
            layout
            className="block rounded-full"
            animate={{
              width: i === index ? 10 : 6,
              height: i === index ? 10 : 6,
              backgroundColor: i <= index ? regionById[id].color : 'rgba(200,210,255,0.3)',
            }}
          />
          <span className="pointer-events-none absolute right-6 rounded bg-black/60 px-2 py-0.5 text-[11px] whitespace-nowrap text-ink opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            {regionById[id].label}
          </span>
        </button>
      ))}
      <span className="mt-1 text-[10px] tracking-widest text-muted [writing-mode:vertical-rl]">SCROLL</span>
    </nav>
  );
}
