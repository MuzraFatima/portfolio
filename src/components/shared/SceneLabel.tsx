import { Html } from '@react-three/drei';
import type { ReactNode } from 'react';

interface Props {
  position?: [number, number, number];
  title: string;
  kicker?: string;
  color?: string;
  active?: boolean;
  onActivate?: () => void;
  children?: ReactNode;
}

/**
 * A floating label anchored to a 3D object. It is a real button, so keyboard and screen-reader
 * users can reach every planet and region without using the pointer.
 */
export function SceneLabel({
  position = [0, 0, 0],
  title,
  kicker,
  color = '#9aa3c7',
  active,
  onActivate,
}: Props) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        onClick={onActivate}
        className={`pointer-events-auto whitespace-nowrap rounded-full border px-3 py-1 text-left font-display text-[11px] tracking-[0.14em] uppercase backdrop-blur-md transition-colors ${
          active
            ? 'border-white/60 bg-white/15 text-white'
            : 'border-white/15 bg-black/35 text-ink/85 hover:border-white/40'
        }`}
        style={{ boxShadow: active ? `0 0 18px ${color}66` : undefined }}
      >
        {kicker && (
          <span className="mr-2 opacity-70" style={{ color }}>
            {kicker}
          </span>
        )}
        {title}
      </button>
    </Html>
  );
}
