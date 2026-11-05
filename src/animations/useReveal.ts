import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type RefObject, useLayoutEffect } from 'react';
import { useGalaxyStore } from '@/store/useGalaxyStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveals `[data-reveal]` children of a scrollable panel as they scroll into view.
 * GSAP owns these elements' opacity and position; Framer Motion only animates the panel itself,
 * so the two systems never fight over the same property.
 */
export function useReveal(scroller: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  useLayoutEffect(() => {
    const root = scroller.current;
    if (!root || reducedMotion) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, scroller: root, start: 'top 92%', once: true },
        });
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroller, reducedMotion, ...deps]);
}
