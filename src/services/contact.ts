/**
 * Contact form submission through Web3Forms (https://web3forms.com).
 * The access key is designed to be public (it only allows sending to the owner's inbox) but is
 * still kept out of the repository and supplied as VITE_WEB3FORMS_KEY at build time.
 */
const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const contactConfigured = Boolean(ACCESS_KEY);

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  /** Honeypot: real visitors never fill this hidden field. */
  botcheck: string;
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(m: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  if (m.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL.test(m.email.trim())) errors.email = 'Please enter a valid email address.';
  if (m.message.trim().length < 10) errors.message = 'Please write at least a sentence (10+ characters).';
  if (m.message.length > 4000) errors.message = 'Please keep the message under 4,000 characters.';
  return errors;
}

/** Resolves only when the service confirms the message was accepted; otherwise throws. */
export async function sendContact(m: ContactMessage): Promise<void> {
  if (!ACCESS_KEY) throw new Error('The contact form is not connected yet.');
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `Portfolio message from ${m.name.trim()}`,
        from_name: 'Galaxy of Intelligence portfolio',
        name: m.name.trim(),
        email: m.email.trim(),
        message: m.message.trim(),
        botcheck: m.botcheck,
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || !data.success)
      throw new Error(data.message || `The message could not be sent (${res.status}).`);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError')
      throw new Error('The request timed out. Please try again.');
    throw e;
  } finally {
    window.clearTimeout(timeout);
  }
}
