import { motion, useReducedMotion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { ResumeButton } from '@/components/resume/ResumeDialog';
import { profile } from '@/data/profile';
import { scrollToStop } from '@/journey/progress';
import { Kicker } from '@/journey/ui/Section';

const go = (id: string) => (e: MouseEvent) => {
  e.preventDefault();
  scrollToStop(id);
};

/** The first page: name, a short introduction, and the astronaut floating beside it. */
export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="on-sky relative flex min-h-[100svh] items-center px-5 pt-24 pb-16 sm:px-12 lg:px-20"
    >
      <div className="max-w-[42rem]">
        <motion.div {...rise(0.1)}>
          <Kicker>AI / ML Engineer · A journey through intelligence</Kicker>
        </motion.div>

        <h1 id="home-title" className="mt-6 font-serif leading-[0.9] tracking-[-0.01em]">
          <motion.span {...rise(0.25)} className="block text-[clamp(4.2rem,12vw,9.5rem)] text-ink">
            Muzra
          </motion.span>
          <motion.span {...rise(0.4)} className="block text-[clamp(4.2rem,12vw,9.5rem)] text-sun italic">
            Fatima.
          </motion.span>
        </h1>

        <motion.p
          {...rise(0.6)}
          className="mt-8 max-w-[30rem] text-lg leading-relaxed text-ink/90 sm:text-xl"
        >
          I build LLM-powered multi-agent systems, confidence-based model routing and retrieval pipelines, and
          I measure whether they really help.
        </motion.p>
        <motion.p {...rise(0.7)} className="mt-3 font-mono text-xs text-sun/85">
          {profile.location.replace(', Telangana', '')} · B.Tech AI &amp; ML · 2023–2027
        </motion.p>

        <motion.div
          {...rise(0.85)}
          className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4 font-mono text-[13px]"
        >
          <a href="#about" onClick={go('about')} className="border-b border-sun pb-1 text-sun hover:text-ink">
            Begin the journey ↓
          </a>
          <a href="#projects" onClick={go('projects')} className="text-ink/90 hover:text-sun">
            Straight to my work ↗
          </a>
          <ResumeButton className="text-ink/90 hover:text-sun" />
        </motion.div>

        <motion.p
          {...rise(1.1)}
          className="mt-16 font-mono text-[10px] tracking-[0.24em] text-muted uppercase"
        >
          Scroll to travel — six worlds, one journey
        </motion.p>
      </div>
    </section>
  );
}
