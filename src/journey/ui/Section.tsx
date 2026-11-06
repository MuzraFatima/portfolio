import type { ReactNode } from 'react';
import type { TextSide } from '@/journey/stops';

/**
 * One stop's text. It sits straight on the galaxy (no card or box) on its side of the screen,
 * leaving the other side to the 3D subject the camera is framing.
 */
export function Section({
  id,
  side,
  children,
  minHeight = 'min-h-[130vh]',
}: {
  id: string;
  side: TextSide;
  children: ReactNode;
  minHeight?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`on-sky relative flex items-center px-5 py-28 sm:px-12 lg:px-20 ${minHeight} ${
        side === 'right' ? 'md:justify-end' : ''
      }`}
    >
      <div className="w-full max-w-[37rem]">{children}</div>
    </section>
  );
}

/** The small spaced monospace line above a heading, e.g. "02 / The central star · About me". */
export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] tracking-[0.2em] text-sun uppercase ${className}`}>{children}</p>
  );
}

/** A sub-heading inside a stop, in the same monospace voice as the kicker but quieter. */
export function Label({ children }: { children: ReactNode }) {
  return <h4 className="mt-9 mb-3 font-mono text-[11px] tracking-[0.2em] text-ice uppercase">{children}</h4>;
}

/** A list written as running monospace text, separated by dots, instead of chips or boxes. */
export function DotList({ items, className = '' }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-y-1.5 font-mono text-[13px] leading-relaxed text-ink/85 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="after:mx-2.5 after:text-muted after:content-['·'] last:after:content-none">
          {item}
        </li>
      ))}
    </ul>
  );
}
