import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useEffect, useRef } from 'react';
import { useReveal } from '@/animations/useReveal';
import { regionById } from '@/data/regions';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { RegionId } from '@/types/content';
import { AboutContent } from './content/AboutContent';
import { AchievementsContent } from './content/AchievementsContent';
import { CertificatesContent } from './content/CertificatesContent';
import { ContactContent } from './content/ContactContent';
import { SkillsContent } from './content/SkillsContent';

const CONTENT: Partial<Record<RegionId, () => ReactNode>> = {
  about: () => <AboutContent />,
  skills: () => <SkillsContent />,
  achievements: () => <AchievementsContent />,
  certificates: () => <CertificatesContent />,
  contact: () => <ContactContent />,
};

/** The information panel for each non-project region, sliding in from the left. */
export function RegionPanel() {
  const region = useGalaxyStore((s) => s.region);
  const scroller = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const render = CONTENT[region];
  const meta = regionById[region];

  useReveal(scroller, [region]);
  useEffect(() => {
    if (render) heading.current?.focus({ preventScroll: true });
  }, [render, region]);

  return (
    <AnimatePresence mode="wait">
      {render && (
        <motion.section
          key={region}
          ref={scroller}
          aria-labelledby="region-title"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ x: -30, opacity: 0, transition: { duration: 0.25 } }}
          className="glass pointer-events-auto fixed inset-x-3 top-20 bottom-3 z-30 overflow-y-auto rounded-3xl p-6 sm:inset-x-auto sm:left-4 sm:w-[min(34rem,calc(100vw-2rem))] sm:p-8 md:bottom-4"
        >
          <p className="font-display text-xs tracking-[0.24em] uppercase" style={{ color: meta.color }}>
            {meta.code} · {meta.name}
          </p>
          <h2
            id="region-title"
            ref={heading}
            tabIndex={-1}
            className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl"
          >
            {meta.label}
          </h2>
          {render()}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
