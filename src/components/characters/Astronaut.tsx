import { useCursor, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type Group, type Mesh, type MeshStandardMaterial, Vector3 } from 'three';
import { regionById } from '@/data/regions';
import { damp, Spring } from '@/physics/motion';
import { useGalaxyStore } from '@/store/useGalaxyStore';
import { useGuideStore } from './guideStore';

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/astronaut.glb`;

// Where the astronaut floats relative to the camera: larger beside the About panel on the
// landing view, smaller in the corner everywhere else so it never covers what you are looking at.
const ANCHORS = {
  hero: { offset: new Vector3(3.6, -1.6, -12.5), scale: 2.0 },
  corner: { offset: new Vector3(6.4, -3.6, -12), scale: 1.25 },
};

const tmpV = new Vector3();
const lookTarget = new Vector3();

/**
 * The guide character. The model is a single, unrigged mesh, so every animation is a
 * whole-body procedural motion:
 * - idle / zero-gravity floating: slow bob, drift and roll
 * - head movement: the body turns to follow the pointer, with spring inertia
 * - gesture: a wave when greeting or when clicked
 * - pointing: leans and turns toward the region the guide is suggesting
 */
export function Astronaut() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const camera = useThree((s) => s.camera);
  const pointer = useThree((s) => s.pointer);

  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const region = useGalaxyStore((s) => s.region);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const gesture = useGuideStore((s) => s.gesture);
  const gestureAt = useGuideStore((s) => s.gestureAt);
  const pointAt = useGuideStore((s) => s.pointAt);
  const wave = useGuideStore((s) => s.wave);

  const yaw = useRef(new Spring(0, 28, 7));
  const pitch = useRef(new Spring(0, 28, 7));

  useEffect(() => {
    model.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const m = mesh.material as MeshStandardMaterial;
      m.roughness = 0.62;
      m.metalness = 0.08;
    });
  }, [model]);

  // Greet on arrival.
  useEffect(() => {
    const t = window.setTimeout(wave, 1200);
    return () => window.clearTimeout(t);
  }, [wave]);

  const anchor = region === 'gateway' ? ANCHORS.hero : ANCHORS.corner;

  useFrame(({ clock }, delta) => {
    const g = root.current;
    const b = body.current;
    if (!g || !b) return;
    const t = reducedMotion ? 0 : clock.elapsedTime;

    // Follow the camera with lag, which gives the astronaut a sense of mass and inertia.
    tmpV.copy(anchor.offset).applyQuaternion(camera.quaternion).add(camera.position);
    const lambda = reducedMotion ? 50 : 3.2;
    g.position.set(
      damp(g.position.x, tmpV.x, lambda, delta),
      damp(g.position.y, tmpV.y, lambda, delta),
      damp(g.position.z, tmpV.z, lambda, delta),
    );
    const s = damp(g.scale.x, anchor.scale, 3, delta);
    g.scale.setScalar(s);

    // Face the camera, then add the look / point offsets on the inner body.
    lookTarget.copy(camera.position);
    g.lookAt(lookTarget);

    let targetYaw = pointer.x * 0.45;
    let targetPitch = -pointer.y * 0.25;
    if (gesture === 'point' && pointAt) {
      // Turn toward the suggested region, expressed in the astronaut's local frame.
      const dest = tmpV.fromArray(regionById[pointAt].position).sub(g.position).normalize();
      dest.applyQuaternion(g.quaternion.clone().invert());
      targetYaw = Math.atan2(dest.x, dest.z) * 0.6;
      targetPitch = -dest.y * 0.4;
    }
    if (reducedMotion) {
      targetYaw = 0;
      targetPitch = 0;
    }

    b.rotation.y = yaw.current.step(targetYaw, delta);
    b.rotation.x = pitch.current.step(targetPitch, delta);

    // Zero-gravity float.
    b.position.y = Math.sin(t * 0.8) * 0.12 - 1;
    b.position.x = Math.sin(t * 0.37) * 0.06;
    let roll = Math.sin(t * 0.5) * 0.06;

    // Wave: a few quick side-to-side rocks that fade out.
    if (gesture === 'wave' && !reducedMotion) {
      const age = (performance.now() - gestureAt) / 1000;
      if (age < 2.4) roll += Math.sin(age * 9) * 0.22 * (1 - age / 2.4);
    }
    // Point: lean forward slightly toward the destination.
    if (gesture === 'point' && !reducedMotion) roll += 0.08;
    b.rotation.z = roll;
  });

  return (
    <group ref={root}>
      {/* Soft fill light so the suit is readable even when the star is behind it. */}
      <pointLight position={[1.2, 1.6, 2.6]} intensity={14} distance={10} decay={1} color="#e4eaff" />
      <pointLight position={[-1.8, 0.6, 1.4]} intensity={6} distance={8} decay={1} color="#ffd9b0" />
      <pointLight position={[0, 1.2, -2.2]} intensity={9} distance={8} decay={1} color="#ffcf8a" />
      <group ref={body}>
        <primitive
          object={model}
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            wave();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
