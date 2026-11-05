import { motion } from 'framer-motion';
import { profile } from '@/data/profile';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

/** The landing view: who Muzra is, readable immediately, beside the astronaut guide. */
export function HeroAbout() {
  const goTo = useGalaxyStore((s) => s.goTo);
  const degree = profile.education[0];

  return (
    <motion.section
      aria-labelledby="hero-name"
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
      className="glass pointer-events-auto w-full max-w-xl rounded-3xl p-6 sm:p-8"
    >
      <motion.p variants={item} className="font-display text-xs tracking-[0.28em] text-accent-2 uppercase">
        The Galaxy of Intelligence
      </motion.p>
      <motion.h1
        id="hero-name"
        variants={item}
        className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-6xl"
      >
        {profile.name}
      </motion.h1>
      <motion.p variants={item} className="mt-2 text-lg text-ink/90 sm:text-xl">
        {profile.headline}
        <span className="block text-base text-muted">{profile.roles.join(' · ')}</span>
      </motion.p>

      <motion.p variants={item} className="mt-5 leading-relaxed text-ink/85">
        {profile.summary}
      </motion.p>

      <motion.dl variants={item} className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Studying</dt>
          <dd className="text-ink">
            {degree.degree}
            <span className="block text-muted">
              {degree.institution} · {degree.period}
            </span>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Based in</dt>
          <dd className="text-ink">{profile.location}</dd>
        </div>
      </motion.dl>

      <motion.ul variants={item} className="mt-5 flex flex-wrap gap-2" aria-label="Interests">
        {profile.interests.map((i) => (
          <li key={i} className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-ink/85">
            {i}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={item} className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => goTo('projects')}
          className="rounded-full bg-accent px-5 py-2.5 font-medium text-void transition hover:bg-accent-2"
        >
          Explore the projects
        </button>
        <button
          type="button"
          onClick={() => goTo('about')}
          className="rounded-full border border-line px-5 py-2.5 text-ink transition hover:border-accent-2"
        >
          More about me
        </button>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-3 py-2.5 text-ink/80 underline-offset-4 hover:text-white hover:underline"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="rounded-full px-3 py-2.5 text-ink/80 underline-offset-4 hover:text-white hover:underline"
        >
          LinkedIn
        </a>
      </motion.div>
    </motion.section>
  );
}
