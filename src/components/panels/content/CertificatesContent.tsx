import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { certificateIssuers, certificates } from '@/data/certificates';
import type { Certificate } from '@/types/content';

const ISSUER_COLOR: Record<string, string> = {
  Anthropic: '#d4a27f',
  'AWS Academy': '#ff9900',
  'Cisco Networking Academy': '#49b6e8',
  freeCodeCamp: '#7ee787',
  'Telangana Academy for Skill and Knowledge': '#c4b5fd',
};

function CertificateCard({ cert, onPreview }: { cert: Certificate; onPreview: (c: Certificate) => void }) {
  const color = ISSUER_COLOR[cert.issuer] ?? '#9aa3c7';
  return (
    <li className="flex flex-col rounded-2xl border border-line bg-white/[0.04] p-4">
      <p className="text-xs tracking-wide" style={{ color }}>
        {cert.issuer}
      </p>
      <h3 className="mt-1 font-medium text-white">{cert.name}</h3>
      {/* Only fields that have been verified are rendered. */}
      <dl className="mt-2 space-y-0.5 text-xs text-muted">
        {cert.issued && (
          <div>
            <dt className="inline">Issued: </dt>
            <dd className="inline text-ink/80">{cert.issued}</dd>
          </div>
        )}
        {cert.credentialId && (
          <div>
            <dt className="inline">Credential ID: </dt>
            <dd className="inline text-ink/80">{cert.credentialId}</dd>
          </div>
        )}
      </dl>
      {(cert.verifyUrl || cert.image) && (
        <div className="mt-3 flex gap-2">
          {cert.verifyUrl && (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line px-3 py-1 text-xs text-ink hover:border-accent-2"
            >
              Verify credential
            </a>
          )}
          {cert.image && (
            <button
              type="button"
              onClick={() => onPreview(cert)}
              className="rounded-full border border-line px-3 py-1 text-xs text-ink hover:border-accent-2"
            >
              View certificate
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/** R06 — every certificate, filterable by issuer. */
export function CertificatesContent() {
  const [issuer, setIssuer] = useState<string>('All');
  const [preview, setPreview] = useState<Certificate | null>(null);
  const visible = useMemo(
    () => (issuer === 'All' ? certificates : certificates.filter((c) => c.issuer === issuer)),
    [issuer],
  );
  const pendingVerification = certificates.every((c) => !c.verifyUrl);

  return (
    <div className="mt-4">
      <p data-reveal className="text-sm text-ink/80">
        {certificates.length} certificates from {certificateIssuers.length} issuers.
        {pendingVerification &&
          ' Issue dates, credential IDs and verification links will appear here as they are added.'}
      </p>

      <div data-reveal role="group" aria-label="Filter by issuer" className="mt-4 flex flex-wrap gap-2">
        {['All', ...certificateIssuers].map((i) => (
          <button
            key={i}
            type="button"
            aria-pressed={issuer === i}
            onClick={() => setIssuer(i)}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              issuer === i ? 'bg-accent text-void' : 'border border-line text-ink/80 hover:border-accent-2'
            }`}
          >
            {i === 'Telangana Academy for Skill and Knowledge' ? 'TASK' : i}
            <span className="ml-1 opacity-60">
              {i === 'All' ? certificates.length : certificates.filter((c) => c.issuer === i).length}
            </span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-4 grid gap-3 sm:grid-cols-2" aria-live="polite">
        {visible.map((c) => (
          <CertificateCard key={c.id} cert={c} onPreview={setPreview} />
        ))}
      </motion.ul>

      <AnimatePresence>
        {preview?.image && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={preview.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setPreview(null)}
          >
            <img
              src={preview.image}
              alt={`${preview.name} certificate`}
              className="max-h-[85vh] rounded-xl"
            />
            <button
              type="button"
              ref={(el) => el?.focus()}
              onClick={() => setPreview(null)}
              className="absolute top-4 right-4 rounded-full bg-white/10 px-4 py-2 text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
