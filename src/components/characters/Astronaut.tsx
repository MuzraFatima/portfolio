import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  type Group,
  MathUtils,
  Matrix4,
  type Mesh,
  type MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three';
import { useActiveStop } from '@/journey/progress';
import { stops } from '@/journey/stops';
import { damp } from '@/physics/motion';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const MODEL_URL = `${import.meta.env.BASE_URL}assets/models/astronaut.glb`;

const camVel = new Vector3();
const camLocalVel = new Vector3();
const prevCam = new Vector3();
const target = new Vector3();
const lookPoint = new Vector3();
const restQ = new Quaternion();
const flightQ = new Quaternion();
const goalQ = new Quaternion();
const invCam = new Quaternion();
const tmpQ = new Quaternion();
const m4 = new Matrix4();
const UP = new Vector3(0, 1, 0);
const X_AXIS = new Vector3(1, 0, 0);

/**
 * The astronaut travels the whole journey with you, a little ahead of the camera on the side
 * away from the text. The model is one unrigged mesh, so its motion is whole-body and physical:
 * - while travelling it turns to face the direction of flight, leans into it and banks on turns;
 * - it lags and catches up with the camera through a spring, which gives it weight;
 * - at a stop it slows, turns back to face you, floats in zero gravity and follows the pointer;
 * - on the first page it greets you with a wave.
 */
export function Astronaut() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const camera = useThree((s) => s.camera);
  const pointer = useThree((s) => s.pointer);
  const width = useThree((s) => s.size.width);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);
  const active = useActiveStop((s) => s.active);

  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const local = useRef(new Vector3(4, -1.5, -13));
  const localVel = useRef(new Vector3());
  const smoothVel = useRef(new Vector3());
  const lean = useRef(0);
  const bank = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    model.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      const m = mesh.material as MeshStandardMaterial;
      m.roughness = 0.6;
      m.metalness = 0.08;
    });
  }, [model]);

  useFrame(({ clock }, rawDelta) => {
    const g = root.current;
    const b = body.current;
    if (!g || !b) return;
    const delta = Math.min(rawDelta, 1 / 20);
    const t = reducedMotion ? 0 : clock.elapsedTime;

    // Camera velocity, in world space and in the camera's own frame.
    if (!started.current) {
      prevCam.copy(camera.position);
      started.current = true;
    }
    camVel.copy(camera.position).sub(prevCam).divideScalar(Math.max(delta, 1e-3));
    prevCam.copy(camera.position);
    smoothVel.current.lerp(camVel, 1 - Math.exp(-5 * delta));
    invCam.copy(camera.quaternion).invert();
    camLocalVel.copy(smoothVel.current).applyQuaternion(invCam);
    const speed = smoothVel.current.length();
    const flying = reducedMotion ? 0 : MathUtils.smoothstep(speed, 3, 22);

    // Where it wants to be relative to the camera: beside the name on the first page, otherwise
    // on the side opposite the text. While flying it leads slightly in the direction of travel.
    const wide = width >= 900;
    const home = active === 0;
    const side = stops[active].side === 'left' ? 1 : -1;
    const anchorX = wide ? (home ? 3.4 : 4.6 * side) : 1.7;
    const anchorY = wide ? (home ? -1.1 : -2.1) : 2.4;
    const anchorZ = home ? -11 : -13.5;
    target.set(
      anchorX + MathUtils.clamp(camLocalVel.x * 0.05, -2, 2),
      anchorY + MathUtils.clamp(camLocalVel.y * 0.05, -1.5, 1.5),
      anchorZ + MathUtils.clamp(camLocalVel.z * 0.05, -4, 1),
    );

    // Slightly under-damped spring in camera space: it drifts, overshoots a touch and settles.
    if (reducedMotion) {
      local.current.copy(target);
      localVel.current.set(0, 0, 0);
    } else {
      const k = 9;
      const c = 5;
      localVel.current.x += ((target.x - local.current.x) * k - localVel.current.x * c) * delta;
      localVel.current.y += ((target.y - local.current.y) * k - localVel.current.y * c) * delta;
      localVel.current.z += ((target.z - local.current.z) * k - localVel.current.z * c) * delta;
      local.current.addScaledVector(localVel.current, delta);
    }
    g.position.copy(local.current).applyQuaternion(camera.quaternion).add(camera.position);

    const scaleGoal = wide ? (home ? 2.1 : 1.35) : 1.0;
    g.scale.setScalar(damp(g.scale.x, scaleGoal, 3, delta));

    // Resting pose: face the camera, turned a little toward the text and the pointer.
    // (The model's front is +Z, so the matrix is built to point +Z from the astronaut to the camera.)
    restQ.setFromRotationMatrix(m4.lookAt(camera.position, g.position, UP));
    const lookYaw = reducedMotion ? 0 : pointer.x * 0.35 - side * 0.25;
    const lookPitch = reducedMotion ? 0 : -pointer.y * 0.18;
    restQ.multiply(tmpQ.setFromAxisAngle(UP, lookYaw));
    restQ.multiply(tmpQ.setFromAxisAngle(X_AXIS, lookPitch));

    // Flight pose: face the direction of travel.
    if (speed > 0.5) {
      lookPoint.copy(g.position).add(smoothVel.current);
      flightQ.setFromRotationMatrix(m4.lookAt(lookPoint, g.position, UP));
    } else {
      flightQ.copy(restQ);
    }

    goalQ.slerpQuaternions(restQ, flightQ, flying);
    g.quaternion.slerp(goalQ, 1 - Math.exp(-3.5 * delta));

    // Lean into the motion and bank into sideways movement, like a body pushed by a jetpack.
    lean.current = damp(lean.current, flying * 0.55, 3, delta);
    bank.current = damp(bank.current, MathUtils.clamp(-camLocalVel.x * 0.02, -0.5, 0.5) * flying, 3, delta);

    // Zero-gravity float, and a wave on the first page.
    let roll = Math.sin(t * 0.5) * 0.06 + bank.current;
    if (home && !reducedMotion && flying < 0.2)
      roll += Math.sin(t * 2.4) * 0.12 * Math.max(0, Math.sin(t * 0.4));
    b.position.set(Math.sin(t * 0.37) * 0.08, Math.sin(t * 0.8) * 0.14 - 1, 0);
    b.rotation.set(lean.current + Math.sin(t * 0.43) * 0.04, Math.sin(t * 0.29) * 0.08, roll);
  });

  return (
    <group ref={root}>
      {/* Fill lights travel with the astronaut so the suit stays readable away from the star. */}
      <pointLight position={[1.2, 1.6, 2.6]} intensity={14} distance={10} decay={1} color="#e4eaff" />
      <pointLight position={[-1.8, 0.6, 1.4]} intensity={6} distance={8} decay={1} color="#ffd9b0" />
      <pointLight position={[0, 1.2, -2.2]} intensity={9} distance={8} decay={1} color="#ffcf8a" />
      <group ref={body}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
