import { type FormEvent, type ReactNode, useRef, useState } from 'react';
import { ResumeButton } from '@/components/resume/ResumeDialog';
import { profile } from '@/data/profile';
import { Kicker, Section } from '@/journey/ui/Section';
import { Reveal } from '@/journey/ui/Reveal';
import { linkClass } from '@/journey/ui/styles';
import { type ContactErrors, contactConfigured, sendContact, validateContact } from '@/services/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const MIN_FILL_MS = 3000; // bots submit instantly; people take a few seconds

const fieldClass =
  'w-full border-0 border-b border-line bg-transparent px-0 py-2 text-lg text-ink placeholder:text-muted/50 focus:border-sun focus:outline-none focus-visible:outline-none';

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[11px] tracking-[0.2em] text-ice uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

/** A message form that only reports success once delivery is confirmed. */
function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '', botcheck: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');
  const openedAt = useRef(Date.now());

  const update = (k: keyof typeof values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (values.botcheck || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('error');
      setFailure('Please wait a moment and try again.');
      return;
    }
    setStatus('sending');
    try {
      await sendContact(values);
      setStatus('sent');
      setValues({ name: '', email: '', message: '', botcheck: '' });
    } catch (err) {
      setStatus('error');
      setFailure(err instanceof Error ? err.message : 'The message could not be sent.');
    }
  };

  return (
    <form noValidate onSubmit={submit} className="space-y-7" aria-describedby="form-status">
      {!contactConfigured && (
        <p className="text-[15px] text-amber-100/90">
          The message form is not connected yet. Please email{' '}
          <a className="underline" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{' '}
          directly.
        </p>
      )}
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={fieldClass}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={fieldClass}
          />
        </Field>
      </div>
      <Field id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          rows={3}
          value={values.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${fieldClass} resize-y`}
        />
      </Field>
      {/* Honeypot, hidden from people and assistive technology. */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        value={values.botcheck}
        onChange={update('botcheck')}
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={!contactConfigured || status === 'sending'}
          className="border-b border-sun pb-1 font-mono text-[13px] text-sun transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        <p id="form-status" role="status" aria-live="polite" className="text-sm">
          {status === 'sent' && (
            <span className="text-emerald-300">
              Thank you, your message was delivered. I will reply by email.
            </span>
          )}
          {status === 'error' && <span className="text-rose-300">{failure}</span>}
        </p>
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <Section id="contact" side="left" minHeight="min-h-[120vh]">
      <Reveal depth={0.6}>
        <Kicker>07 / The space station · Contact</Kicker>
      </Reveal>
      <Reveal depth={0.9}>
        <h2
          id="contact-title"
          className="mt-6 font-serif text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.02] text-ink"
        >
          Let&rsquo;s build something <em className="text-sun">intelligent.</em>
        </h2>
      </Reveal>
      <Reveal depth={0.7}>
        <p className="mt-6 text-lg leading-relaxed text-ink/85">
          I&rsquo;m looking for entry-level AI/ML and Generative AI roles, internships and research
          collaborations. Email is the quickest way to reach me.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-6 inline-block font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] break-all text-ink italic underline decoration-sun/50 decoration-1 underline-offset-8 hover:decoration-sun"
        >
          {profile.email}
        </a>
        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[13px] text-sun">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
            LinkedIn ↗
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub ↗
          </a>
          <ResumeButton className={linkClass} />
        </p>
      </Reveal>

      <Reveal depth={0.5} className="mt-14">
        <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Or send a message</p>
        <ContactForm />
      </Reveal>
    </Section>
  );
}
