import { type ReactNode, useEffect, useRef } from 'react';
import { resume } from '@/data/resume';
import { useResume } from './resumeStore';

function Heading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-9 mb-3 border-b border-line pb-2 font-mono text-[11px] tracking-[0.2em] text-sun uppercase first:mt-0">
      {children}
    </h3>
  );
}

/** Opens the résumé. Use anywhere a "Résumé" link belongs. */
export function ResumeButton({
  className = '',
  children = 'Résumé ↗',
}: {
  className?: string;
  children?: ReactNode;
}) {
  const setOpen = useResume((s) => s.setOpen);
  return (
    <button type="button" onClick={() => setOpen(true)} className={className} aria-haspopup="dialog">
      {children}
    </button>
  );
}

/**
 * The full résumé as readable, selectable text in a native modal dialog (which provides focus
 * trapping and Escape to close). It can be printed or saved as a PDF from the browser.
 */
export function ResumeDialog() {
  const open = useResume((s) => s.open);
  const setOpen = useResume((s) => s.setOpen);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Links such as /#resume open it directly.
  useEffect(() => {
    if (window.location.hash === '#resume') setOpen(true);
  }, [setOpen]);

  const { contact } = resume;

  return (
    <dialog
      ref={dialog}
      onClose={() => setOpen(false)}
      aria-labelledby="resume-title"
      className="m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 text-ink"
    >
      <article id="resume-sheet" className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-14">
        <div className="no-print sticky top-0 z-10 -mx-5 mb-8 flex justify-end gap-6 bg-void/85 px-5 py-3 font-mono text-xs backdrop-blur sm:-mx-10 sm:px-10">
          <button type="button" onClick={() => window.print()} className="text-ice hover:text-ink">
            Print / save as PDF
          </button>
          <button type="button" onClick={() => setOpen(false)} className="text-sun hover:text-ink">
            Close ✕
          </button>
        </div>

        <header>
          <h2 id="resume-title" className="font-serif text-5xl text-ink sm:text-6xl">
            {resume.name}
          </h2>
          <p className="mt-2 font-mono text-sm text-ice">{resume.headline}</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted">
            <li>{contact.location}</li>
            <li>
              <a className="hover:text-ink" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
            <li>
              <a
                className="hover:text-ink"
                href={`https://www.${contact.linkedin}`}
                target="_blank"
                rel="noreferrer"
              >
                {contact.linkedin}
              </a>
            </li>
            <li>
              <a
                className="hover:text-ink"
                href={`https://${contact.github}`}
                target="_blank"
                rel="noreferrer"
              >
                {contact.github}
              </a>
            </li>
          </ul>
        </header>

        <div className="mt-10 grid gap-x-14 lg:grid-cols-[1fr_2fr]">
          <div className="order-2 lg:order-1">
            <Heading>Technical skills</Heading>
            {resume.skills.map((g) => (
              <div key={g.title} className="mb-5">
                <h4 className="mb-1.5 font-mono text-[11px] tracking-[0.12em] text-ice uppercase">
                  {g.title}
                </h4>
                <ul className="space-y-0.5 text-sm">
                  {g.items.map(([name, level]) => (
                    <li key={name}>
                      <span className="text-ink">{name}</span> <span className="text-muted">— {level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <Heading>Education</Heading>
            {resume.education.map((e) => (
              <div key={e.degree} className="mb-4 text-sm">
                <p className="text-ink">{e.degree}</p>
                <p className="text-ink/80">{e.school}</p>
                <p className="font-mono text-xs text-muted">{e.detail}</p>
              </div>
            ))}

            <Heading>Certifications</Heading>
            {resume.certifications.map((c) => (
              <p key={c.issuer} className="mb-3 text-sm text-ink/85">
                <span className="text-ink">{c.issuer}:</span> {c.names}
              </p>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <Heading>Professional summary</Heading>
            <p className="leading-relaxed text-ink/90">{resume.summary}</p>

            <Heading>Featured projects</Heading>
            {resume.projects.map((p) => (
              <section key={p.name} className="mb-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h4 className="font-serif text-2xl text-ink">
                    {p.name} {p.note && <span className="font-sans text-sm text-muted">({p.note})</span>}
                  </h4>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-ice hover:text-ink"
                    >
                      {p.link.replace('https://', '')}
                    </a>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-sun/90">{p.stack}</p>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-ink/85">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="relative pl-4 before:absolute before:left-0 before:text-muted before:content-['—']"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <Heading>Research publication</Heading>
            <p className="font-serif text-xl text-ink">{resume.publication.title}</p>
            <p className="mt-1 text-[15px] text-ink/85">
              <span className="text-muted">{resume.publication.venue}.</span> {resume.publication.summary}
            </p>

            <Heading>Achievements</Heading>
            {resume.achievements.map((a) => (
              <p key={a} className="text-[15px] text-ink/90">
                {a}
              </p>
            ))}
          </div>
        </div>
      </article>
    </dialog>
  );
}
