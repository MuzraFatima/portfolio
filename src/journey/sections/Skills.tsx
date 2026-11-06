import { skillCategories } from '@/data/skills';
import { DotList, Kicker, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';

export function Skills() {
  return (
    <Section id="skills" side="left" minHeight="min-h-[160vh]">
      <Reveal depth={0.6}>
        <Kicker>03 / The skill nebula · Skills</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="skills-title"
          className="mt-6 font-serif text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08] text-ink"
        >
          The toolkit behind the work, <em className="text-sun">from Python to multi-agent systems.</em>
        </h2>
      </Reveal>
      <Reveal depth={0.5}>
        <p className="mt-5 font-mono text-xs text-muted">Levels as stated on my résumé.</p>
      </Reveal>

      <div className="mt-6">
        {skillCategories.map((c, i) => (
          <Reveal key={c.id} depth={0.45 + (i % 3) * 0.12} className="mt-10">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
              Cluster {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-1 font-serif text-[2rem] leading-tight text-ink">{c.name}</h3>
            <p className="mt-1 text-[15px] text-ink/70">{c.description}</p>
            <DotList
              className="mt-3"
              items={c.skills.map((s) => (
                <>
                  {s.name}
                  {s.level && <span className="text-muted"> — {s.level}</span>}
                </>
              ))}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
