import { type FormEvent, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import { type ContactErrors, contactConfigured, sendContact, validateContact } from '@/services/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const MIN_FILL_MS = 3000; // bots submit instantly; people take a few seconds

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-ink/85">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-line bg-black/30 px-3 py-2.5 text-ink placeholder:text-muted/60 focus:border-accent-2 focus:outline-none';

/** R07 — direct links plus a contact form that only reports success when delivery is confirmed. */
export function ContactContent() {
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
    // Silently drop likely bots without telling them why.
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
    <div className="mt-4 space-y-6">
      <p data-reveal className="text-ink/85">
        Open to entry-level AI/ML and Generative AI roles, internships and research collaborations.
      </p>

      <ul data-reveal className="grid gap-2 sm:grid-cols-3">
        <li>
          <a
            href={`mailto:${profile.email}`}
            className="block rounded-2xl border border-line bg-white/5 p-3 text-sm hover:border-accent-2"
          >
            <span className="block text-xs text-muted">Email</span>
            <span className="break-all text-white">{profile.email}</span>
          </a>
        </li>
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-line bg-white/5 p-3 text-sm hover:border-accent-2"
          >
            <span className="block text-xs text-muted">GitHub</span>
            <span className="text-white">MuzraFatima</span>
          </a>
        </li>
        <li>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-line bg-white/5 p-3 text-sm hover:border-accent-2"
          >
            <span className="block text-xs text-muted">LinkedIn</span>
            <span className="text-white">muzra-fatima</span>
          </a>
        </li>
      </ul>

      <form data-reveal noValidate onSubmit={submit} className="space-y-4" aria-describedby="form-status">
        <h3 className="font-display text-lg text-white">Send a message</h3>
        {!contactConfigured && (
          <p className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
            The message form is not connected yet. Please email{' '}
            <a className="underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>{' '}
            directly.
          </p>
        )}
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={inputClass}
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
            className={inputClass}
          />
        </Field>
        <Field id="contact-message" label="Message" error={errors.message}>
          <textarea
            id="contact-message"
            rows={5}
            value={values.message}
            onChange={update('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={inputClass}
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
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!contactConfigured || status === 'sending'}
            className="rounded-full bg-accent px-5 py-2.5 font-medium text-void transition hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p id="form-status" role="status" aria-live="polite" className="text-sm">
            {status === 'sent' && (
              <span className="text-emerald-300">
                Thank you, your message was delivered. Muzra will reply by email.
              </span>
            )}
            {status === 'error' && <span className="text-rose-300">{failure}</span>}
          </p>
        </div>
      </form>
    </div>
  );
}
