import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { AboutContent } from './content/AboutContent';
import { AchievementsContent } from './content/AchievementsContent';
import { CertificatesContent } from './content/CertificatesContent';
import { ContactContent } from './content/ContactContent';
import { SkillsContent } from './content/SkillsContent';

const SECTIONS = [
  { id: 'about', title: 'About' },
  { id: 'skills', title: 'Skills' },
  { id: 'projects', title: 'Projects' },
  { id: 'achievements', title: 'Achievements' },
  { id: 'certificates', title: 'Certificates' },
  { id: 'contact', title: 'Contact' },
] as const;

/**
 * The whole portfolio as one plain, semantic page. Used when a visitor turns on "Text-only view"
 * or when the device cannot run WebGL, so professional information never depends on the 3D scene.
 */
export function TextView() {
  const webglAvailable = useGalaxyStore((s) => s.webglAvailable);
  const setTextMode = useGalaxyStore((s) => s.setTextMode);

  return (
    <div className="relative z-20 min-h-full bg-void/95 px-4 pt-20 pb-16 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-lg text-ink/90">
            {profile.headline} · {profile.roles.join(' · ')}
          </p>
          <nav aria-label="Sections" className="mt-5">
            <ul className="flex flex-wrap gap-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#tv-${s.id}`}
                    className="rounded-full border border-line px-3 py-1 text-ink hover:border-accent-2"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {webglAvailable && (
            <button
              type="button"
              onClick={() => setTextMode(false)}
              className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-void"
            >
              Back to the 3D galaxy
            </button>
          )}
        </header>

        <section id="tv-about" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">About</h2>
          <AboutContent />
        </section>
        <section id="tv-skills" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">Skills</h2>
          <SkillsContent />
        </section>
        <section id="tv-projects" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">Projects</h2>
          {projects.map((p) => (
            <article key={p.id} className="mt-6 rounded-2xl border border-line bg-white/[0.04] p-5">
              <p className="font-display text-xs tracking-[0.2em] text-muted uppercase">
                {String(p.order).padStart(2, '0')}
                {p.flagship ? ' · Flagship' : ''}
                {p.team ? ' · Team project' : ''}
              </p>
              <h3 className="mt-1 font-display text-xl text-white">{p.name}</h3>
              <p className="text-ink/85">{p.tagline}</p>
              {p.award && <p className="mt-2 text-sm text-amber-100">{p.award}</p>}
              <p className="mt-3 text-ink/85">{p.overview}</p>
              <h4 className="mt-3 text-sm font-semibold text-white">Problem</h4>
              <p className="text-ink/85">{p.problem}</p>
              <h4 className="mt-3 text-sm font-semibold text-white">Solution</h4>
              <p className="text-ink/85">{p.solution}</p>
              <h4 className="mt-3 text-sm font-semibold text-white">Verified features</h4>
              <ul className="list-disc pl-5 text-ink/85">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <h4 className="mt-3 text-sm font-semibold text-white">{p.team ? 'My contribution' : 'Role'}</h4>
              <ul className="list-disc pl-5 text-ink/85">
                {p.contribution.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">{p.technologies.join(' · ')}</p>
              <p className="mt-3 flex gap-4 text-sm">
                <a href={p.repo} target="_blank" rel="noreferrer" className="text-accent-2 underline">
                  Repository
                </a>
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="text-accent-2 underline">
                    Live demo
                  </a>
                )}
              </p>
            </article>
          ))}
        </section>
        <section id="tv-achievements" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">Achievements</h2>
          <AchievementsContent />
        </section>
        <section id="tv-certificates" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">Certificates</h2>
          <CertificatesContent />
        </section>
        <section id="tv-contact" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-2xl text-white">Contact</h2>
          <ContactContent />
        </section>
      </div>
    </div>
  );
}
