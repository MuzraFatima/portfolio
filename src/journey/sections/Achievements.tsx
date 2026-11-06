import { achievements } from '@/data/achievements';
import { profile } from '@/data/profile';
import { Kicker, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';

export function Achievements() {
  return (
    <Section id="achievements" side="left">
      <Reveal depth={0.6}>
        <Kicker>05 / The achievement constellation</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="achievements-title"
          className="mt-6 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1.04] text-ink"
        >
          Milestones <em className="text-sun">so far.</em>
        </h2>
      </Reveal>

      <ol className="mt-4">
        {achievements.map((a) => (
          <Reveal key={a.id} as="li" depth={0.6} className="mt-10">
            <p className="font-mono text-xs text-sun">{a.year}</p>
            <h3 className="mt-1 font-serif text-[1.9rem] leading-tight text-ink">{a.title}</h3>
            <p className="mt-2 text-[16px] leading-relaxed text-ink/80">{a.detail}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal depth={0.5} className="mt-12">
        <p className="font-mono text-[11px] tracking-[0.2em] text-ice uppercase">Research publication</p>
        <p className="mt-2 font-serif text-2xl text-ink italic">{profile.publication.title}</p>
        <p className="mt-2 text-[15px] text-ink/75">
          {profile.publication.venue}, {profile.publication.year}. {profile.publication.summary}
        </p>
      </Reveal>
    </Section>
  );
}
