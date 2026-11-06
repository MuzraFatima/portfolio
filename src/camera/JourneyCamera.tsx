import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { CatmullRomCurve3, MathUtils, type PerspectiveCamera, Vector3 } from 'three';
import { journey } from '@/journey/progress';
import { stops } from '@/journey/stops';
import { damp } from '@/physics/motion';
import { useGalaxyStore } from '@/store/useGalaxyStore';

const pos = new Vector3();
const look = new Vector3();
const right = new Vector3();
const up = new Vector3();

/**
 * Flies the camera along one smooth path through every stop, driven by the page scroll.
 * Scrolling is the only control, so the motion always belongs to the visitor: the camera eases
 * toward the scrolled position, and the frame is shifted sideways so the subject sits opposite
 * the text instead of behind it.
 */
export function JourneyCamera() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const pointer = useThree((s) => s.pointer);
  const width = useThree((s) => s.size.width);
  const reducedMotion = useGalaxyStore((s) => s.reducedMotion);

  const { path, aim } = useMemo(
    () => ({
      path: new CatmullRomCurve3(
        stops.map((s) => new Vector3(...s.camera)),
        false,
        'centripetal',
      ),
      aim: new CatmullRomCurve3(
        stops.map((s) => new Vector3(...s.target)),
        false,
        'centripetal',
      ),
    }),
    [],
  );

  const progress = useRef(journey.value);
  const sway = useRef({ x: 0, y: 0 });
  const shift = useRef(0);

  useFrame(({ clock }, delta) => {
    const last = stops.length - 1;
    progress.current = reducedMotion ? journey.value : damp(progress.current, journey.value, 2.6, delta);
    const t = MathUtils.clamp(progress.current / last, 0, 1);
    path.getPoint(t, pos);
    aim.getPoint(t, look);

    // A slight drift and pointer sway keep the view alive and show the depth of the scene.
    const time = reducedMotion ? 0 : clock.elapsedTime;
    sway.current.x = damp(sway.current.x, reducedMotion ? 0 : pointer.x, 2, delta);
    sway.current.y = damp(sway.current.y, reducedMotion ? 0 : pointer.y, 2, delta);
    const scale = pos.distanceTo(look) * 0.03;
    camera.position.copy(pos);
    camera.lookAt(look);
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position
      .addScaledVector(right, (sway.current.x * 1.4 + Math.sin(time * 0.13) * 0.5) * scale)
      .addScaledVector(up, (sway.current.y * 0.9 + Math.sin(time * 0.17) * 0.35) * scale);
    camera.lookAt(look);

    // Frame the subject on the side away from the text (wide screens only).
    const i = Math.round(progress.current);
    const side = width >= 900 ? (stops[i].side === 'left' ? -1 : 1) : 0;
    shift.current = damp(shift.current, side, 2.4, delta);
    const fo =
      shift.current *
      0.4 *
      Math.tan(MathUtils.degToRad(camera.fov / 2)) *
      camera.aspect *
      camera.getFilmWidth();
    if (Math.abs(camera.filmOffset - fo) > 1e-4) {
      camera.filmOffset = fo;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
