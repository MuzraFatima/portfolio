import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  onSkip: () => void;
}

/**
 * Branded progress indicator. It never blocks content: the skip button (and the always-present
 * quick navigation) let visitors move on while the galaxy is still loading.
 */
export function LoadingScreen({ onSkip }: Props) {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = window.setTimeout(() => setVisible(false), 400);
      return () => window.clearTimeout(t);
    }
    // Procedural scenes load almost instantly; hide after a short grace period regardless.
    const fallback = window.setTimeout(() => setVisible(false), 2500);
    return () => window.clearTimeout(fallback);
  }, [active, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          role="status"
          aria-live="polite"
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent/20 border-t-accent-2 [animation-duration:1.6s]" />
            <div className="absolute inset-5 rounded-full bg-star shadow-[0_0_40px_10px_rgba(255,214,140,0.45)]" />
          </div>
          <p className="font-display text-sm tracking-[0.3em] text-muted uppercase">
            Entering the galaxy · {Math.round(progress)}%
          </p>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onSkip();
            }}
            className="rounded-full border border-line px-5 py-2 text-sm text-ink transition hover:border-accent-2"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
