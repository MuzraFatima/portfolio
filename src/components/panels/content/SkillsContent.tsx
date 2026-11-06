import { projectById } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const LEVEL_STYLE = {
  Proficient: 'border-emerald-300/40 text-emerald-100',
  Intermediate: 'border-sky-300/30 text-sky-100',
  Beginner: 'border-white/15 text-ink/70',
} as const;

/** Skill areas with the projects that actually use them. Levels are as stated on the resume. */
export function SkillsContent() {
  const selectProject = useGalaxyStore((s) => s.selectProject);

  return (
    <div className="mt-4 space-y-5">
      <p data-reveal className="text-sm text-muted">
        Levels are self-assessed (Proficient, Intermediate, Beginner). Each area links to the projects where
        it was used.
      </p>
      {skillCategories.map((c) => (
        <section key={c.id} data-reveal className="rounded-2xl border border-line bg-white/[0.04] p-4">
          <h3 className="flex items-center gap-2 font-display text-lg text-white">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
            />
            {c.name}
          </h3>
          <p className="mt-1 text-sm text-ink/75">{c.description}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {c.skills.map((s) => (
              <li
                key={s.name}
                className={`rounded-full border px-3 py-1 text-xs ${s.level ? LEVEL_STYLE[s.level] : 'border-white/15 text-ink/80'}`}
              >
                {s.name}
                {s.level && <span className="ml-1.5 opacity-60">· {s.level}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Used in:{' '}
            {c.projects.map((id, i) => (
              <span key={id}>
                <button
                  type="button"
                  onClick={() => selectProject(id)}
                  className="text-ink/85 underline decoration-white/20 underline-offset-2 hover:text-white"
                >
                  {projectById[id].shortName ?? projectById[id].name}
                </button>
                {i < c.projects.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        </section>
      ))}
    </div>
  );
}
