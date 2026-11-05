import { CameraControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { regionById } from '@/data/regions';
import { planetPositions } from '@/physics/orbits';
import { planetConfigs } from '@/scenes/ProjectSolarSystem/planetConfigs';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import type { ProjectId, RegionId } from '@/types/content';

type Vec = [number, number, number];

const v = {
  fromPos: new Vector3(),
  fromTarget: new Vector3(),
  toPos: new Vector3(),
  toTarget: new Vector3(),
  pos: new Vector3(),
  target: new Vector3(),
  lastPlanet: new Vector3(),
  delta: new Vector3(),
};

function regionView(id: RegionId) {
  const r = regionById[id];
  const target = new Vector3(...r.position);
  return { pos: target.clone().add(new Vector3(...(r.cameraOffset as Vec))), target };
}

/** A view of a planet from its sunlit side, slightly above the orbital plane. */
function planetView(id: ProjectId, out: { pos: Vector3; target: Vector3 }) {
  const p = planetPositions.get(id) ?? new Vector3();
  const radius = planetConfigs[id].planet.radius;
  const outward = p.clone().setY(0).normalize();
  const side = new Vector3(-outward.z, 0, outward.x);
  const dist = radius * 4.6 + 4;
  out.target.copy(p);
  out.pos
    .copy(p)
    .addScaledVector(outward, -dist * 0.55)
    .addScaledVector(side, dist * 0.75)
    .add(new Vector3(0, dist * 0.32, 0));
  return out;
}

/**
 * Owns the camera. GSAP drives every flight (so there is exactly one animation system on the
 * camera), camera-controls handles free orbiting and zoom between flights, and the rig follows a
 * selected planet along its orbit so it never drifts out of frame.
 */
export function CameraRig() {
  const controls = useRef<CameraControls>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const size = useThree((s) => s.size);

  const region = useGalaxyStore((s) => s.region);
  const selected = useGalaxyStore((s) => s.selectedProject);
  const mode = useGalaxyStore((s) => s.mode);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const travelling = useGalaxyStore((s) => s.travelling);
  const setTravelling = useGalaxyStore((s) => s.setTravelling);
  const introActive = useGalaxyStore((s) => s.introActive);
  const firstFlight = useRef(true);

  // Fly whenever the destination changes.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.getPosition(v.fromPos);
    c.getTarget(v.fromTarget);
    const from = { pos: v.fromPos.clone(), target: v.fromTarget.clone() };
    const dest = { pos: new Vector3(), target: new Vector3() };
    const resolve = () => {
      if (selected) planetView(selected, dest);
      else {
        const r = regionView(region);
        dest.pos.copy(r.pos);
        dest.target.copy(r.target);
      }
    };
    resolve();

    // Longer trips take a little longer, within limits.
    const distance = from.pos.distanceTo(dest.pos);
    let duration = reducedMotion ? 0.01 : Math.min(3.2, 1.4 + distance / 140);
    // The first flight is the cinematic intro: a slow approach from deep space.
    const { introSeen, introActive: introPlaying, finishIntro } = useGalaxyStore.getState();
    const isIntro = firstFlight.current;
    firstFlight.current = false;
    if (isIntro && !reducedMotion) duration = introSeen || !introPlaying ? 1.6 : 6;
    // Arc above the straight line so long flights sweep past the system instead of through it.
    const lift = Math.min(40, distance * 0.18);

    tween.current?.kill();
    const progress = { k: 0 };
    setTravelling(true);
    tween.current = gsap.to(progress, {
      k: 1,
      duration,
      ease: isIntro ? 'power3.inOut' : 'power2.inOut',
      onUpdate: () => {
        resolve(); // planets keep moving during the flight
        const k = progress.k;
        v.pos.lerpVectors(from.pos, dest.pos, k);
        v.pos.y += Math.sin(Math.PI * k) * lift;
        v.target.lerpVectors(from.target, dest.target, k);
        c.setLookAt(v.pos.x, v.pos.y, v.pos.z, v.target.x, v.target.y, v.target.z, false);
      },
      onComplete: () => {
        if (selected) v.lastPlanet.copy(planetPositions.get(selected) ?? v.target);
        setTravelling(false);
        if (isIntro) finishIntro();
      },
    });
    return () => {
      tween.current?.kill();
    };
  }, [region, selected, reducedMotion, setTravelling]);

  // "Skip intro" ends the intro flight immediately.
  useEffect(() => {
    if (!introActive && tween.current?.isActive()) tween.current.progress(1);
  }, [introActive]);

  // On wide screens the project panel covers the right side, so shift the view to keep the planet
  // visible on the left.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const shift = selected && size.width >= 900 ? planetConfigs[selected].planet.radius * 1.6 : 0;
    void c.setFocalOffset(shift, 0, 0, !reducedMotion);
  }, [selected, size.width, reducedMotion]);

  // Follow the selected planet along its orbit while keeping any orbiting the visitor has done.
  useFrame(() => {
    const c = controls.current;
    if (!c || !selected || travelling) return;
    const p = planetPositions.get(selected);
    if (!p) return;
    v.delta.subVectors(p, v.lastPlanet);
    v.lastPlanet.copy(p);
    if (v.delta.lengthSq() === 0) return;
    c.getPosition(v.pos).add(v.delta);
    c.getTarget(v.target).add(v.delta);
    c.setLookAt(v.pos.x, v.pos.y, v.pos.z, v.target.x, v.target.y, v.target.z, false);
  });

  const freeInput = mode === 'free' || Boolean(selected);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      enabled={!travelling && freeInput}
      smoothTime={reducedMotion ? 0 : 0.35}
      minDistance={selected ? planetConfigs[selected].planet.radius * 1.8 : 6}
      maxDistance={420}
      dollySpeed={0.6}
      truckSpeed={0}
    />
  );
}
