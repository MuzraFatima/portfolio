import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReveal } from '@/animations/useReveal';
import { projectById, projects } from '@/data/projects';
import { planetConfigs } from '@/scenes/ProjectSolarSystem/planetConfigs';
import { useGalaxyStore } from '@/store/useGalaxyStore';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6" data-reveal>
      <h3 className="mb-2 font-display text-xs tracking-[0.2em] text-muted uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** The detailed project panel that slides in when a planet is selected. */
export function ProjectPanel() {
  const selected = useGalaxyStore((s) => s.selectedProject);
  const selectProject = useGalaxyStore((s) => s.selectProject);
  const goTo = useGalaxyStore((s) => s.goTo);
  const heading = useRef<HTMLHeadingElement>(null);
  const scroller = useRef<HTMLElement>(null);

  const project = selected ? projectById[selected] : null;
  const index = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  useReveal(scroller, [selected]);

  // Move keyboard focus into the panel when it opens, for screen-reader and keyboard users.
  useEffect(() => {
    if (project) heading.current?.focus({ preventScroll: true });
  }, [project]);

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.aside
          key={project.id}
          ref={scroller}
          aria-labelledby="project-title"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ x: 40, opacity: 0, transition: { duration: 0.25 } }}
          className="glass pointer-events-auto fixed inset-x-3 top-20 bottom-3 z-30 overflow-y-auto rounded-3xl p-6 sm:inset-x-auto sm:right-4 sm:w-[min(32rem,calc(100vw-2rem))] sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                selectProject(null);
                goTo('projects');
              }}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:border-accent-2"
            >
              ← Back to the solar system
            </button>
            <span className="font-display text-xs tracking-[0.2em] text-muted">
              {String(project.order).padStart(2, '0')} / 06
            </span>
          </div>

          <p
            className="mt-6 font-display text-xs tracking-[0.24em] uppercase"
            style={{ color: planetConfigs[project.id].glow }}
          >
            {project.flagship ? 'Flagship project' : 'Project'}
            {project.team ? ' · Team project' : ''}
          </p>
          <h2
            id="project-title"
            ref={heading}
            tabIndex={-1}
            className="mt-1 font-display text-3xl font-bold text-white outline-none sm:text-4xl"
          >
            {project.name}
          </h2>
          {project.subtitle && <p className="text-sm text-muted">Repository title: {project.subtitle}</p>}
          <p className="mt-2 text-lg text-ink/90">{project.tagline}</p>

          {project.award && (
            <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100">
              🏆 {project.award}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-void hover:bg-accent-2"
            >
              View repository
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-accent-2"
              >
                Live demo
              </a>
            )}
          </div>

          {project.images.length > 0 && (
            <div className="mt-6 grid gap-3">
              {project.images.map((img) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full rounded-xl border border-line"
                />
              ))}
            </div>
          )}

          <Section title="Overview">
            <p className="leading-relaxed text-ink/85">{project.overview}</p>
          </Section>
          <Section title="Problem">
            <p className="leading-relaxed text-ink/85">{project.problem}</p>
          </Section>
          <Section title="Solution">
            <p className="leading-relaxed text-ink/85">{project.solution}</p>
          </Section>
          <Section title="Architecture">
            <ol className="list-decimal space-y-1 pl-5 text-ink/85 marker:text-muted">
              {project.architecture.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </Section>
          <Section title="Verified features">
            <ul className="list-disc space-y-1 pl-5 text-ink/85 marker:text-muted">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Section>
          <Section title={project.team ? 'My contribution' : 'Role'}>
            <ul className="list-disc space-y-1 pl-5 text-ink/85 marker:text-muted">
              {project.contribution.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Section>
          <Section title="Technologies">
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-ink/85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Section>

          <div className="mt-8 flex justify-between gap-3 border-t border-line pt-4 text-sm">
            {prev ? (
              <button
                type="button"
                onClick={() => selectProject(prev.id)}
                className="text-ink/80 hover:text-white"
              >
                ← {prev.shortName ?? prev.name}
              </button>
            ) : (
              <span />
            )}
            {next && (
              <button
                type="button"
                onClick={() => selectProject(next.id)}
                className="text-ink/80 hover:text-white"
              >
                {next.shortName ?? next.name} →
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
