import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
  /** Larger values drift further, which makes the block feel closer to the viewer. */
  depth?: number;
  className?: string;
  as?: 'div' | 'li';
}

/**
 * Scroll-linked text motion: a block rises into place and brightens as it enters the viewport,
 * then drifts on and fades as it leaves. Different depths move at different rates, so the text
 * reads as layers floating in the same space as the galaxy rather than a page laid on top.
 */
export function Reveal({ children, depth = 1, className, as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [70 * depth, -70 * depth]);
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.86, 1], [0, 1, 1, 0.1]);

  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag ref={ref} className={className} style={reduce ? undefined : { y, opacity }}>
      {children}
    </Tag>
  );
}
