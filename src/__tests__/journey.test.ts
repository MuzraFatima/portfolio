import { describe, expect, it } from 'vitest';
import { projects } from '@/data/projects';
import { progressAt } from '@/journey/progress';
import { navStops, stopIndex, stops } from '@/journey/stops';

describe('journey stops', () => {
  it('visits every section once, starting at home and ending at contact', () => {
    expect(stops[0].id).toBe('home');
    expect(stops.at(-1)?.id).toBe('contact');
    expect(new Set(stops.map((s) => s.id)).size).toBe(stops.length);
    for (const id of navStops) expect(stopIndex[id]).toBeDefined();
  });

  it('flies past the six planets in blueprint order, GateOrchestra first', () => {
    const planetStops = stops.filter((s) => s.id.startsWith('project-')).map((s) => s.id);
    expect(planetStops).toEqual(projects.map((p) => `project-${p.id}`));
    expect(stopIndex['project-gateorchestra']).toBe(stopIndex.projects + 1);
  });

  it('keeps the camera clear of the subject at every stop', () => {
    for (const s of stops) {
      const d = Math.hypot(...s.camera.map((c, i) => c - s.target[i]));
      expect(d, s.id).toBeGreaterThan(6);
    }
  });

  it('alternates text sides between neighbouring planets', () => {
    const sides = stops.filter((s) => s.id.startsWith('project-')).map((s) => s.side);
    for (let i = 1; i < sides.length; i++) expect(sides[i]).not.toBe(sides[i - 1]);
  });
});

describe('scroll to journey mapping', () => {
  const anchors = [0, 1000, 2500, 4000];

  it('rests exactly on a stop when its section is centred', () => {
    anchors.forEach((a, i) => expect(progressAt(a, anchors)).toBe(i));
  });

  it('never moves backwards as the page scrolls down', () => {
    let last = -1;
    for (let y = 0; y <= 4000; y += 25) {
      const p = progressAt(y, anchors);
      expect(p).toBeGreaterThanOrEqual(last);
      last = p;
    }
  });

  it('holds still near a stop so its text can be read', () => {
    expect(progressAt(60, anchors)).toBe(0);
    expect(progressAt(960, anchors)).toBe(1);
  });

  it('stays within the journey beyond either end', () => {
    expect(progressAt(-200, anchors)).toBe(0);
    expect(progressAt(9999, anchors)).toBe(3);
  });
});
