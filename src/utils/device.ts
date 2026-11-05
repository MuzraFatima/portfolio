export type QualityLevel = 'high' | 'medium' | 'low';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(pointer: coarse)').matches ?? false;
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

let cachedQuality: QualityLevel | null = null;

/**
 * A cheap first guess at what the device can handle. Small screens and low core counts
 * get lighter scenes; the visitor can always override it in the settings.
 */
export function detectQuality(): QualityLevel {
  if (cachedQuality) return cachedQuality;
  if (typeof window === 'undefined') return 'medium';

  const width = Math.min(window.innerWidth, window.screen?.width ?? window.innerWidth);
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  if (width < 640 || cores <= 4 || memory <= 4) cachedQuality = 'low';
  else if (width < 1100 || cores <= 6) cachedQuality = 'medium';
  else cachedQuality = 'high';

  return cachedQuality;
}

/** Rendering budgets per quality level. */
export const QUALITY_PROFILES = {
  high: { dpr: [1, 2] as [number, number], stars: 4500, dust: 900, asteroids: 2600, segments: 96 },
  medium: { dpr: [1, 1.5] as [number, number], stars: 3000, dust: 500, asteroids: 1400, segments: 64 },
  low: { dpr: [1, 1] as [number, number], stars: 1500, dust: 200, asteroids: 500, segments: 40 },
} as const;
