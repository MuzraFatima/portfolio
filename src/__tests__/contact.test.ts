import { describe, expect, it } from 'vitest';
import { validateContact } from '@/services/contact';

const valid = { name: 'Ada', email: 'ada@example.com', message: 'Hello, I liked your work.', botcheck: '' };

describe('contact form validation', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('rejects missing name, bad email and short message', () => {
    const errors = validateContact({ name: ' ', email: 'not-an-email', message: 'hi', botcheck: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });

  it('rejects overly long messages', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(4001) }).message).toBeDefined();
  });
});
