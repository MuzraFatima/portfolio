import { useFrame, useThree } from '@react-three/fiber';
import { type RefObject, useRef } from 'react';
import type { Object3D } from 'three';
import { useGalaxyStore } from '@/store/useGalaxyStore';

/**
 * Frame-rate independent exponential damping: moves `current` toward `target` as if pulled by a
 * critically damped spring. `lambda` controls stiffness (higher = snappier).
 */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
}

/** A one-dimensional spring with velocity, for motion that overshoots slightly and settles. */
export class Spring {
  value: number;
  velocity = 0;
  constructor(
    value = 0,
    public stiffness = 60,
    public damping = 12,
  ) {
    this.value = value;
  }
  step(target: number, delta: number): number {
    const dt = Math.min(delta, 1 / 30); // avoid explosions after a tab was in the background
    const force = (target - this.value) * this.stiffness - this.velocity * this.damping;
    this.velocity += force * dt;
    this.value += this.velocity * dt;
    return this.value;
  }
}

/**
 * Tilts an object gently toward the pointer with inertia. Layers at different depths get
 * different strengths, which produces real parallax. Disabled under reduced motion.
 */
export function usePointerParallax(ref: RefObject<Object3D | null>, strength = 0.02, lambda = 2.5) {
  const pointer = useThree((s) => s.pointer);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const current = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!ref.current) return;
    const tx = reducedMotion ? 0 : pointer.y * strength;
    const ty = reducedMotion ? 0 : -pointer.x * strength;
    current.current.x = damp(current.current.x, tx, lambda, delta);
    current.current.y = damp(current.current.y, ty, lambda, delta);
    ref.current.rotation.x = current.current.x;
    ref.current.rotation.y = current.current.y;
  });
}
