import { useEffect, useRef } from 'react';
import { guidedTour } from '@/data/regions';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const COOLDOWN_MS = 1400;
const WHEEL_THRESHOLD = 40;
const SWIPE_THRESHOLD = 60;

/**
 * Scroll storytelling for guided mode: one wheel gesture or vertical swipe moves to the next or
 * previous stop on the tour. Scrolling inside a panel still scrolls the panel.
 */
export function useScrollJourney() {
  const last = useRef(0);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    const step = (dir: 1 | -1) => {
      const s = useGalaxyStore.getState();
      if (s.mode !== 'guided' || s.selectedProject || s.travelling || s.textMode) return;
      const now = performance.now();
      if (now - last.current < COOLDOWN_MS) return;
      const i = guidedTour.indexOf(s.region);
      const next = guidedTour[i + dir];
      if (!next) return;
      last.current = now;
      s.goTo(next);
    };

    // Ignore gestures that start over scrollable interface elements.
    const overInterface = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('aside, section, nav, [role="dialog"], header'));

    const onWheel = (e: WheelEvent) => {
      if (overInterface(e.target) || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = overInterface(e.target) ? null : e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      touchY.current = null;
      if (Math.abs(dy) > SWIPE_THRESHOLD) step(dy > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}
