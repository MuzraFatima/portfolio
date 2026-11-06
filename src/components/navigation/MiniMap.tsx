import { projects } from '@/data/projects';
import { regions } from '@/data/regions';
import { planetConfigs } from '@/scenes/ProjectSolarSystem/planetConfigs';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const SIZE = 132;
const SCALE = SIZE / 2 / 125; // world units → pixels

/** A top-down chart of the galaxy. Every marker is a button, so it doubles as navigation. */
export function MiniMap() {
  const region = useGalaxyStore((s) => s.region);
  const selected = useGalaxyStore((s) => s.selectedProject);
  const goTo = useGalaxyStore((s) => s.goTo);
  const selectProject = useGalaxyStore((s) => s.selectProject);

  if (!['projects'].includes(region)) return null;
  const c = SIZE / 2;
  const px = (x: number) => c + x * SCALE;

  return (
    <nav
      aria-label="Galaxy map"
      className="glass pointer-events-auto fixed bottom-4 left-4 z-30 hidden rounded-2xl p-2 md:block"
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Map of regions">
        {projects.map((p) => (
          <circle
            key={p.id}
            cx={c}
            cy={c}
            r={planetConfigs[p.id].orbit.radius * SCALE}
            fill="none"
            stroke="rgba(150,165,230,0.18)"
          />
        ))}
        <circle cx={c} cy={c} r={3.5} fill="#ffd27a" />
        {regions
          .filter((r) => r.position[0] !== 0 || r.position[2] !== 0)
          .map((r) => (
            <circle
              key={r.id}
              cx={px(r.position[0])}
              cy={px(r.position[2])}
              r={region === r.id ? 5 : 3.5}
              fill={r.color}
              opacity={region === r.id ? 1 : 0.6}
            />
          ))}
      </svg>
      <ul className="mt-1 grid grid-cols-1 gap-0.5 text-[11px]">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => selectProject(p.id)}
              className={`w-full truncate rounded px-1.5 py-0.5 text-left ${
                selected === p.id ? 'bg-white/12 text-white' : 'text-ink/70 hover:text-white'
              }`}
            >
              <span style={{ color: planetConfigs[p.id].glow }}>●</span> {p.shortName ?? p.name}
            </button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => goTo('projects')}
            className="w-full rounded px-1.5 py-0.5 text-left text-ink/70 hover:text-white"
          >
            ↺ Whole system
          </button>
        </li>
      </ul>
    </nav>
  );
}
