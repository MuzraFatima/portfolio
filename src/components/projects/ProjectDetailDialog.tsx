import { type ReactNode, useEffect, useRef } from 'react';
import { projectById, projects } from '@/data/projects';
import type { PipelineStage, Project } from '@/types/content';
import { pipelineOf } from './pipeline';
import { useProjectDetail } from './projectDetailStore';

function Heading({ children }: { children: ReactNode }) {
  return <h3 className="mb-4 font-mono text-[11px] tracking-[0.22em] text-sun uppercase">{children}</h3>;
}

function Bullets({
  items,
  marker = '✦',
  tone = 'text-sun',
}: {
  items: string[];
  marker?: string;
  tone?: string;
}) {
  return (
    <ul className="space-y-2.5 text-[15px] leading-relaxed text-ink/85">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1.25rem_1fr]">
          <span aria-hidden="true" className={tone}>
            {marker}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The architecture as a flow of numbered stages joined by a guide line: vertical on phones, a
 * wrapping row of stages on wide screens. Plain HTML, so it reads correctly to screen readers.
 */
function PipelineDiagram({ stages, accent }: { stages: PipelineStage[]; accent: string }) {
  return (
    <ol
      className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="System architecture, in order"
    >
      {stages.map((s, i) => (
        <li
          key={s.label}
          className="relative rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] text-void"
              style={{ background: accent }}
            >
              {i + 1}
            </span>
            <span className="font-serif text-lg leading-tight text-ink">{s.label}</span>
          </div>
          {s.detail && <p className="mt-2 text-[13px] leading-snug text-ink/70">{s.detail}</p>}
          {i < stages.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-7 font-mono text-xs text-muted sm:hidden"
            >
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Detail({ project }: { project: Project }) {
  const close = useProjectDetail((s) => s.close);
  const d = project.deepDive;
  const accent = project.palette[0];
  const tags = [
    `World ${String(project.order).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`,
    project.flagship && 'Flagship',
    project.team ? 'Team project' : 'Solo project',
  ].filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-5 pb-16 sm:px-10">
      <div className="sticky top-0 z-10 -mx-5 mb-8 flex items-center justify-between gap-6 bg-void/80 px-5 py-3 font-mono text-xs backdrop-blur sm:-mx-10 sm:px-10">
        <span className="truncate text-muted">{project.name} · project detail</span>
        <button type="button" onClick={close} className="shrink-0 text-sun hover:text-ink">
          Close ✕
        </button>
      </div>

      <header className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: accent }}>
          {tags.join(' · ')}
        </p>
        <h2
          id="project-detail-title"
          className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.4rem)] leading-[1] text-ink"
        >
          {project.name}
        </h2>
        <p className="mt-4 text-xl leading-snug text-ink/85">{project.tagline}</p>
        {project.award && (
          <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-amber-200 uppercase">
            ★ {project.award}
          </p>
        )}
        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] text-sun">
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="border-b border-sun/40 pb-0.5 hover:text-ink"
          >
            {project.team ? 'Team repository ↗' : 'GitHub repository ↗'}
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="border-b border-sun/40 pb-0.5 hover:text-ink"
            >
              Live demo ↗
            </a>
          )}
        </p>
      </header>

      {d?.results && (
        <section aria-label="Key results" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.results.map((r) => (
            <div
              key={r.label}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md"
            >
              <p className="font-serif text-[2rem] leading-none" style={{ color: accent }}>
                {r.value}
              </p>
              <p className="mt-2 text-[14px] leading-snug text-ink/85">{r.label}</p>
              {r.note && <p className="mt-1.5 font-mono text-[10.5px] leading-snug text-muted">{r.note}</p>}
            </div>
          ))}
        </section>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-3">
        <section>
          <Heading>The problem</Heading>
          <p className="text-[15px] leading-relaxed text-ink/85">{project.problem}</p>
        </section>
        {d && (
          <section>
            <Heading>Why it matters</Heading>
            <p className="text-[15px] leading-relaxed text-ink/85">{d.whyItMatters}</p>
          </section>
        )}
        <section>
          <Heading>The solution</Heading>
          <p className="text-[15px] leading-relaxed text-ink/85">{project.solution}</p>
        </section>
      </div>

      <section className="mt-14">
        <Heading>System architecture</Heading>
        <PipelineDiagram stages={pipelineOf(project)} accent={accent} />
      </section>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        {d && (
          <section>
            <Heading>AI / ML methodology</Heading>
            <Bullets items={d.methodology} marker="→" tone="text-ice" />
          </section>
        )}
        {d && (
          <section>
            <Heading>Key innovations</Heading>
            <Bullets items={d.innovations} />
          </section>
        )}
        <section>
          <Heading>What it does</Heading>
          <Bullets items={project.features} />
        </section>
        <section>
          <Heading>{project.team ? 'My contribution' : 'What I built'}</Heading>
          <Bullets items={project.contribution} marker="→" tone="text-ice" />
          <div className="mt-10">
            <Heading>Technologies</Heading>
            <ul className="flex flex-wrap gap-2 font-mono text-[12px] text-ink/85">
              {project.technologies.map((t) => (
                <li key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {d && (
        <section className="mt-14">
          <Heading>Implementation status</Heading>
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.05] p-5">
              <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-emerald-200 uppercase">
                Implemented
              </p>
              <Bullets items={d.status.implemented} marker="✓" tone="text-emerald-300" />
            </div>
            {d.status.research && (
              <div className="rounded-xl border border-sky-300/20 bg-sky-300/[0.05] p-5">
                <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-sky-200 uppercase">
                  Research direction / in progress
                </p>
                <Bullets items={d.status.research} marker="◌" tone="text-sky-300" />
              </div>
            )}
            {d.status.limits && (
              <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-5">
                <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-amber-200 uppercase">
                  Limits, stated openly
                </p>
                <Bullets items={d.status.limits} marker="!" tone="text-amber-300" />
              </div>
            )}
          </div>
        </section>
      )}

      {project.images.length > 0 && (
        <section className="mt-14">
          <Heading>Screenshots</Heading>
          <div className="grid gap-5 md:grid-cols-2">
            {project.images.map((img) => (
              <figure key={img.src}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full rounded-lg object-cover object-top ring-1 ring-white/10"
                />
                <figcaption className="mt-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  {img.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/**
 * The full project deep dive in a native modal dialog (focus is trapped and Escape closes it).
 * Opened from "Explore project" on any project; the journey stays where it was underneath.
 */
export function ProjectDetailDialog() {
  const openId = useProjectDetail((s) => s.openId);
  const close = useProjectDetail((s) => s.close);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = openId ? projectById[openId] : null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (project && !d.open) {
      d.showModal();
      d.scrollTop = 0;
    }
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={dialog}
      onClose={close}
      aria-labelledby="project-detail-title"
      className="m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 text-ink"
    >
      {project && <Detail project={project} />}
    </dialog>
  );
}
