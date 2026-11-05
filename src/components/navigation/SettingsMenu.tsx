import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { type QualitySetting, useGalaxyStore } from '@/store/useGalaxyStore';

const QUALITY: { value: QualitySetting; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1.5">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--color-accent)]"
      />
    </label>
  );
}

/** Rendering quality, motion, guide and sound preferences — all remembered between visits. */
export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const quality = useGalaxyStore((s) => s.quality);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const guideEnabled = useGalaxyStore((s) => s.guideEnabled);
  const textMode = useGalaxyStore((s) => s.textMode);
  const setPreference = useGalaxyStore((s) => s.setPreference);
  const setTextMode = useGalaxyStore((s) => s.setTextMode);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (panel.current && !panel.current.parentElement?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="settings-panel"
        onClick={() => setOpen((o) => !o)}
        className="glass rounded-full px-4 py-2 text-sm text-white"
      >
        Settings
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="settings-panel"
            ref={panel}
            role="dialog"
            aria-label="Settings"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass absolute top-12 right-0 w-64 rounded-2xl p-4 text-sm text-ink"
          >
            <fieldset>
              <legend className="mb-2 text-xs tracking-[0.18em] text-muted uppercase">
                Graphics quality
              </legend>
              <div className="grid grid-cols-4 gap-1">
                {QUALITY.map((q) => (
                  <button
                    key={q.value}
                    type="button"
                    aria-pressed={quality === q.value}
                    onClick={() => setPreference('quality', q.value)}
                    className={`rounded-lg px-1 py-1.5 text-xs ${
                      quality === q.value ? 'bg-accent text-void' : 'border border-line hover:border-accent-2'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-3 border-t border-line pt-2">
              <Toggle
                label="Reduce motion"
                checked={reducedMotion}
                onChange={(v) => setPreference('reducedMotion', v)}
              />
              <Toggle
                label="Astronaut guide"
                checked={guideEnabled}
                onChange={(v) => setPreference('guideEnabled', v)}
              />
              <Toggle label="Text-only view" checked={textMode} onChange={setTextMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
