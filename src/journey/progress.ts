import { useEffect } from 'react';
import { create } from 'zustand';
import { stops } from './stops';

/**
 * Scroll position mapped onto the journey. `value` runs from 0 (first stop) to stops.length - 1
 * (last stop) and changes on every scroll, so the 3D scene reads it directly each frame instead of
 * through React state. Only the nearest stop is React state, for the interface.
 */
export const journey = { value: 0, anchors: [] as number[] };

interface ActiveStopState {
  active: number;
  setActive: (i: number) => void;
}

export const useActiveStop = create<ActiveStopState>()((set) => ({
  active: 0,
  setActive: (active) => set({ active }),
}));

// The camera rests at a stop for the middle part of the scroll between two stops and travels
// during the rest, so the text that belongs to a stop is read while its subject is in frame.
const HOLD = 0.14;
function ease(t: number) {
  const x = Math.min(1, Math.max(0, (t - HOLD) / (1 - 2 * HOLD)));
  return x * x * (3 - 2 * x);
}

/** Scroll position at which each stop's section is centred in the viewport. */
function measureAnchors(): number[] {
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const anchors = stops.map((s) => {
    const el = document.getElementById(s.id);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    return Math.min(max, Math.max(0, top + rect.height / 2 - vh / 2));
  });
  anchors[0] = 0;
  anchors[anchors.length - 1] = max;
  for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
  return anchors;
}

export function progressAt(y: number, anchors: number[]): number {
  if (!anchors.length || y <= anchors[0]) return 0;
  for (let i = 0; i < anchors.length - 1; i++) {
    if (y < anchors[i + 1]) return i + ease((y - anchors[i]) / (anchors[i + 1] - anchors[i]));
  }
  return anchors.length - 1;
}

/** Scrolls the page to a stop, e.g. from the navigation or by clicking a planet. */
export function scrollToStop(id: string) {
  const i = stops.findIndex((s) => s.id === id);
  if (i < 0) return;
  const anchors = journey.anchors.length ? journey.anchors : measureAnchors();
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: anchors[i], behavior: reduce ? 'auto' : 'smooth' });
}

/** Keeps `journey.value` and the active stop in sync with the page scroll. */
export function useJourneyScroll() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      journey.value = progressAt(window.scrollY, journey.anchors);
      const nearest = Math.round(journey.value);
      if (useActiveStop.getState().active !== nearest) useActiveStop.getState().setActive(nearest);
    };
    const remeasure = () => {
      journey.anchors = measureAnchors();
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    remeasure();
    // Fonts and images change the page height after first paint.
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', remeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
