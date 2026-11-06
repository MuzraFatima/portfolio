import { achievements } from '@/data/achievements';
import { projectById } from '@/data/projects';
import { useGalaxyStore } from '@/store/useGalaxyStore';

export function AchievementsContent() {
  const selectProject = useGalaxyStore((s) => s.selectProject);

  return (
    <ol className="mt-5 space-y-4">
      {achievements.map((a) => (
        <li key={a.id} data-reveal className="rounded-2xl border border-amber-200/20 bg-amber-200/[0.06] p-5">
          <p className="font-display text-xs tracking-[0.2em] text-amber-200/80">{a.year}</p>
          <h3 className="mt-1 font-display text-xl text-white">{a.title}</h3>
          <p className="mt-2 text-ink/85">{a.detail}</p>
          {a.project && (
            <button
              type="button"
              onClick={() => selectProject(a.project!)}
              className="mt-3 rounded-full border border-line px-3 py-1.5 text-sm text-ink hover:border-accent-2"
            >
              Visit {projectById[a.project].name} →
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}
