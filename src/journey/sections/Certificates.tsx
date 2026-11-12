import { certificateIssuers, certificates } from '@/data/certificates';
import { Kicker, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';
import { linkClass } from '@/journey/ui/styles';
import { inWords } from '@/utils/words';

export function Certificates() {
  return (
    <Section id="certificates" side="right" minHeight="min-h-[140vh]">
      <Reveal depth={0.6}>
        <Kicker>06 / The observatory · Certificates</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="certificates-title"
          className="mt-6 font-serif text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.08] text-ink"
        >
          {certificates.length} certificates,{' '}
          <em className="text-sun">{inWords(certificateIssuers.length)} issuers.</em>
        </h2>
      </Reveal>

      {certificateIssuers.map((issuer) => (
        <Reveal key={issuer} depth={0.5} className="mt-9">
          <h3 className="font-mono text-[11px] tracking-[0.2em] text-ice uppercase">{issuer}</h3>
          <ul className="mt-2 space-y-1.5">
            {certificates
              .filter((c) => c.issuer === issuer)
              .map((c) => (
                <li key={c.id} className="font-serif text-xl leading-snug text-ink/90">
                  {c.verifyUrl ? (
                    <a href={c.verifyUrl} target="_blank" rel="noreferrer" className={linkClass}>
                      {c.name} ↗
                    </a>
                  ) : (
                    c.name
                  )}
                  {(c.issued || c.credentialId) && (
                    <span className="ml-2 font-mono text-xs text-muted">
                      {[c.issued, c.credentialId].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </Reveal>
      ))}
    </Section>
  );
}
