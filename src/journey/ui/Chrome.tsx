import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { type MouseEvent, useEffect, useState } from 'react';
import { ResumeButton } from '@/components/resume/ResumeDialog';
import { profile } from '@/data/profile';
import { scrollToStop, useActiveStop } from '@/journey/progress';
import { navStops, stopIndex, stops } from '@/journey/stops';

const go = (id: string, after?: () => void) => (e: MouseEvent) => {
  e.preventDefault();
  scrollToStop(id);
  after?.();
};

/** Which top-level section the current stop belongs to (project planets count as Projects). */
function useCurrentSection() {
  const active = useActiveStop((s) => s.active);
  const id = stops[active].id;
  return id.startsWith('project-') ? 'projects' : id;
}

/** Name on the left, a few quiet text links on the right. No buttons or toggles. */
export function TopBar() {
  const current = useCurrentSection();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="on-sky fixed inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 sm:px-10 sm:py-7">
      <a
        href="#home"
        onClick={go('home')}
        className="flex items-center gap-3"
        aria-label="Muzra Fatima, back to the start"
      >
        <span className="font-serif text-[2rem] leading-none text-ink italic">
          M<span className="ml-0.5 align-top text-sm text-sun not-italic">✦</span>
        </span>
        <span className="hidden font-mono text-[10px] leading-snug tracking-[0.18em] uppercase sm:block">
          <span className="block text-ink">Muzra Fatima</span>
          <span className="block text-muted">A journey through intelligence</span>
        </span>
      </a>

      <nav aria-label="Journey">
        <ul className="hidden items-center gap-7 font-mono text-[11px] md:flex">
          {navStops.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={go(id)}
                aria-current={current === id ? 'location' : undefined}
                className={`transition-colors hover:text-ink ${current === id ? 'text-sun' : 'text-ink/70'}`}
              >
                {stops[stopIndex[id]].label}
              </a>
            </li>
          ))}
          <li>
            <ResumeButton className="text-ink/70 hover:text-ink" />
          </li>
          <li>
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-ink/70 hover:text-ink">
              GitHub ↗
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-6 font-mono text-[11px] md:hidden">
          <ResumeButton className="text-ink/80" />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="journey-menu"
            className="text-sun"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="journey-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[4.5rem] z-30 bg-void/95 px-6 pt-8 md:hidden"
          >
            <ul className="space-y-4">
              {['home', ...navStops].map((id, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={go(id, () => setMenuOpen(false))}
                    className="flex items-baseline gap-4 font-serif text-4xl text-ink"
                  >
                    <span className="font-mono text-xs text-sun">{String(i + 1).padStart(2, '0')}</span>
                    {stops[stopIndex[id]].label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block font-mono text-sm text-sun"
            >
              GitHub ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** The name of the place the camera is visiting, on the side opposite the text (wide screens). */
export function PlaceTitle() {
  const active = useActiveStop((s) => s.active);
  const stop = stops[active];
  if (active === 0) return null;
  return (
    <div
      aria-hidden="true"
      className={`on-sky pointer-events-none fixed top-24 z-20 hidden md:block ${
        stop.side === 'left' ? 'right-12 text-right lg:right-20' : 'left-12 lg:left-20'
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={stop.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-serif text-[1.7rem] tracking-wide text-ink/95 uppercase italic">{stop.place}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
            {String(active + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')} · {stop.label}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Current place and a thin line that fills as the journey progresses. */
export function BottomBar() {
  const active = useActiveStop((s) => s.active);
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const stop = stops[active];

  return (
    <div
      aria-hidden="true"
      className="on-sky pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-center gap-6 px-5 pb-5 font-mono text-[10px] tracking-[0.16em] uppercase sm:px-10 sm:pb-6"
    >
      <span className="hidden shrink-0 text-ink/80 sm:block">
        <span className="text-sun">✦</span> {stop.place}
      </span>
      <span className="relative h-px flex-1 bg-white/15">
        <motion.span className="absolute inset-0 origin-left bg-sun" style={{ scaleX: fill }} />
      </span>
      <span className="shrink-0 text-muted">
        {String(active + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
      </span>
    </div>
  );
}

/**
 * A soft darkening on the text side of the screen, so text reads clearly while the other side
 * shows the galaxy at full brightness. It moves with the text as stops alternate sides.
 */
export function SideWash() {
  const active = useActiveStop((s) => s.active);
  const side = stops[active].side;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1]">
      <div
        className="absolute inset-0 hidden transition-opacity duration-1000 md:block"
        style={{
          opacity: side === 'left' ? 1 : 0,
          background:
            'linear-gradient(90deg, rgba(3,4,11,0.82) 0%, rgba(3,4,11,0.55) 30%, rgba(3,4,11,0) 58%)',
        }}
      />
      <div
        className="absolute inset-0 hidden transition-opacity duration-1000 md:block"
        style={{
          opacity: side === 'right' ? 1 : 0,
          background:
            'linear-gradient(270deg, rgba(3,4,11,0.82) 0%, rgba(3,4,11,0.55) 30%, rgba(3,4,11,0) 58%)',
        }}
      />
      {/* Phones show text across the whole width, so the whole view is dimmed a little. */}
      <div className="absolute inset-0 bg-[rgba(3,4,11,0.5)] md:hidden" />
    </div>
  );
}

/** Fades text out as it scrolls under the top bar or into the bottom bar. Sits above the page text. */
export function EdgeFade() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[15]">
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{
          background: 'linear-gradient(180deg, rgba(3,4,11,0.96) 0%, rgba(3,4,11,0.85) 45%, rgba(3,4,11,0))',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: 'linear-gradient(0deg, rgba(3,4,11,0.94) 0%, rgba(3,4,11,0.75) 40%, rgba(3,4,11,0))',
        }}
      />
    </div>
  );
}
