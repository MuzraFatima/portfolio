import { profile } from '@/data/profile';
import { DotList, Kicker, Label, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';

export function About() {
  return (
    <Section id="about" side="right">
      <Reveal depth={0.6}>
        <Kicker>02 / The central star · About me</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="about-title"
          className="mt-6 font-serif text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08] text-ink"
        >
          I build AI systems that decide <em className="text-sun">how much thinking</em> a task deserves.
        </h2>
      </Reveal>
      <Reveal depth={0.7}>
        <p className="mt-7 text-lg leading-relaxed text-ink/85 sm:text-xl">{profile.summary}</p>
      </Reveal>

      <Reveal depth={0.5}>
        <Label>Education</Label>
        <ul className="space-y-4">
          {profile.education.map((e) => (
            <li key={e.degree}>
              <p className="font-serif text-2xl text-ink">{e.degree}</p>
              <p className="text-ink/80">{e.institution}</p>
              <p className="font-mono text-xs text-muted">
                {[e.period, e.detail].filter(Boolean).join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal depth={0.5}>
        <Label>Interests</Label>
        <DotList items={profile.interests} />
      </Reveal>

      <Reveal depth={0.5}>
        <Label>Working towards</Label>
        <ul className="space-y-2 text-ink/85">
          {profile.goals.map((g) => (
            <li
              key={g}
              className="relative pl-6 before:absolute before:left-0 before:text-sun before:content-['→']"
            >
              {g}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
