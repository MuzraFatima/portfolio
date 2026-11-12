import type { MouseEvent } from 'react';
import { projects } from '@/data/projects';
import { scrollToStop } from '@/journey/progress';
import { stops, stopIndex } from '@/journey/stops';
import { DotList, Kicker, Label, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';
import { linkClass } from '@/journey/ui/styles';
import { useProjectDetail } from '@/components/projects/projectDetailStore';
import type { Project } from '@/types/content';
import { inWords } from '@/utils/words';

export function ProjectsIntro() {
  return (
    <Section id="projects" side="left" minHeight="min-h-[120vh]">
      <Reveal depth={0.6}>
        <Kicker>04 / The project system · {inWords(projects.length, true)} worlds</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="projects-title"
          className="mt-6 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.04] text-ink"
        >
          {inWords(projects.length, true)} projects, <em className="text-sun">one orbit.</em>
        </h2>
      </Reveal>
      <Reveal depth={0.7}>
        <p className="mt-6 text-lg leading-relaxed text-ink/85">
          Each project is a planet circling the central star. GateOrchestra, the flagship, orbits closest.
          Keep scrolling to visit them in order, or jump to one.
        </p>
      </Reveal>
      <Reveal depth={0.5}>
        <ol className="mt-8 space-y-2">
          {projects.map((p) => (
            <li key={p.id}>
              <a
                href={`#project-${p.id}`}
                onClick={(e: MouseEvent) => {
                  e.preventDefault();
                  scrollToStop(`project-${p.id}`);
                }}
                className="group flex items-baseline gap-4 text-ink/85 hover:text-ink"
              >
                <span className="font-mono text-xs text-sun">{String(p.order).padStart(2, '0')}</span>
                <span className="font-serif text-2xl group-hover:italic">{p.name}</span>
                {p.flagship && (
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                    Flagship
                  </span>
                )}
              </a>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

export function ProjectSection({ project }: { project: Project }) {
  const id = `project-${project.id}`;
  const stop = stops[stopIndex[id]];
  const tags = [
    `World ${String(project.order).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`,
    project.flagship && 'Flagship',
    project.team && 'Team project',
  ].filter(Boolean);
  const image = project.images[0];
  const highlights = project.deepDive?.results?.slice(0, 2);
  const openDetail = useProjectDetail((st) => st.open);

  return (
    <Section id={id} side={stop.side} minHeight="min-h-[150vh]">
      <Reveal depth={0.6}>
        <Kicker>{tags.join(' · ')}</Kicker>
      </Reveal>
      <Reveal depth={1}>
        <h3
          id={`${id}-title`}
          className="mt-5 font-serif text-[clamp(2.8rem,6vw,4.6rem)] leading-[0.98] text-ink"
        >
          {project.name}
        </h3>
        {project.subtitle && <p className="mt-2 font-serif text-xl text-ink/70 italic">{project.subtitle}</p>}
      </Reveal>
      <Reveal depth={0.8}>
        <p className="mt-5 text-xl leading-snug text-sun/95">{project.tagline}</p>
        {project.award && (
          <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-amber-200 uppercase">
            ★ {project.award}
          </p>
        )}
      </Reveal>
      <Reveal depth={0.6}>
        <p className="mt-6 text-[17px] leading-relaxed text-ink/85">{project.overview}</p>
      </Reveal>

      {highlights && (
        <Reveal depth={0.55}>
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5">
            {highlights.map((r) => (
              <div key={r.label}>
                <dt className="sr-only">{r.label}</dt>
                <dd>
                  <span className="block font-serif text-[2.1rem] leading-none text-sun">{r.value}</span>
                  <span className="mt-1.5 block text-[13px] leading-snug text-ink/75">{r.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}

      <Reveal depth={0.5}>
        <Label>The problem</Label>
        <p className="text-[16px] leading-relaxed text-ink/80">{project.problem}</p>
        <Label>The approach</Label>
        <p className="text-[16px] leading-relaxed text-ink/80">{project.solution}</p>
      </Reveal>

      <Reveal depth={0.5}>
        <Label>What it does</Label>
        <ul className="space-y-2 text-[15px] leading-relaxed text-ink/85">
          {project.features.map((f) => (
            <li
              key={f}
              className="relative pl-6 before:absolute before:left-0 before:text-sun before:content-['✦']"
            >
              {f}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal depth={0.5}>
        <Label>{project.team ? 'My contribution' : 'My role'}</Label>
        <ul className="space-y-2 text-[15px] leading-relaxed text-ink/85">
          {project.contribution.map((c) => (
            <li
              key={c}
              className="relative pl-6 before:absolute before:left-0 before:text-ice before:content-['→']"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal depth={0.45}>
        <details className="group mt-8">
          <summary className="cursor-pointer list-none font-mono text-[11px] tracking-[0.2em] text-ice uppercase hover:text-ink">
            Architecture <span className="inline-block transition group-open:rotate-90">›</span>
          </summary>
          <ul className="mt-3 space-y-1.5 font-mono text-[13px] leading-relaxed text-ink/75">
            {project.architecture.map((a) => (
              <li key={a}>— {a}</li>
            ))}
          </ul>
        </details>
      </Reveal>

      <Reveal depth={0.45}>
        <Label>Built with</Label>
        <DotList items={project.technologies} />
        <p className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[13px] text-sun">
          <button
            type="button"
            onClick={() => openDetail(project.id)}
            aria-haspopup="dialog"
            className="rounded-full border border-sun/50 bg-sun/10 px-5 py-2 text-sun backdrop-blur-md transition hover:bg-sun hover:text-void"
          >
            Explore project →
          </button>
          <a href={project.repo} target="_blank" rel="noreferrer" className={linkClass}>
            {project.team ? 'Team repository ↗' : 'Repository ↗'}
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className={linkClass}>
              Live demo ↗
            </a>
          )}
        </p>
      </Reveal>

      {image && (
        <Reveal depth={0.35}>
          <figure className="mt-10">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full rounded-sm object-cover object-top opacity-90 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
            />
            <figcaption className="mt-2 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {image.alt}
            </figcaption>
          </figure>
        </Reveal>
      )}
    </Section>
  );
}
