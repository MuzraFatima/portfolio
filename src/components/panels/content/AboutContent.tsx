import { profile } from '@/data/profile';

export function AboutContent() {
  return (
    <div className="mt-4 space-y-6 text-ink/85">
      <p data-reveal className="text-lg leading-relaxed">
        {profile.summary}
      </p>

      <section data-reveal>
        <h3 className="mb-3 font-display text-xs tracking-[0.2em] text-muted uppercase">Education</h3>
        <ul className="space-y-3">
          {profile.education.map((e) => (
            <li key={e.degree} className="rounded-2xl border border-line bg-white/5 p-4">
              <p className="font-medium text-white">{e.degree}</p>
              <p className="text-sm">{e.institution}</p>
              <p className="text-sm text-muted">{[e.period, e.detail].filter(Boolean).join(' · ')}</p>
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal>
        <h3 className="mb-3 font-display text-xs tracking-[0.2em] text-muted uppercase">Interests</h3>
        <ul className="flex flex-wrap gap-2">
          {profile.interests.map((i) => (
            <li key={i} className="rounded-full border border-line bg-white/5 px-3 py-1 text-sm">
              {i}
            </li>
          ))}
        </ul>
      </section>

      <section data-reveal>
        <h3 className="mb-3 font-display text-xs tracking-[0.2em] text-muted uppercase">Career goals</h3>
        <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
          {profile.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <section data-reveal>
        <h3 className="mb-3 font-display text-xs tracking-[0.2em] text-muted uppercase">Research</h3>
        <p className="font-medium text-white">{profile.publication.title}</p>
        <p className="text-sm text-muted">
          {profile.publication.venue}, {profile.publication.year}
        </p>
        <p className="mt-1 text-sm">{profile.publication.summary}</p>
      </section>

      <p data-reveal className="text-sm text-muted">
        {profile.location}
      </p>
    </div>
  );
}
