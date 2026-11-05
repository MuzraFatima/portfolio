import { OrbitControls } from '@react-three/drei';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import { Astronaut } from '@/components/characters/Astronaut';
import { AsteroidField } from '@/components/galaxy/AsteroidField';
import { CentralStar } from '@/components/galaxy/CentralStar';
import { DeepSpaceImage } from '@/components/galaxy/DeepSpaceImage';
import { Effects } from '@/components/galaxy/Effects';
import { SkySphere } from '@/components/galaxy/SkySphere';
import { SpaceDust } from '@/components/galaxy/SpaceDust';
import { StarField } from '@/components/galaxy/StarField';
import { regionById } from '@/data/regions';
import { ProjectSolarSystem } from './ProjectSolarSystem';
import { Regions } from './Regions';
import { usePointerParallax } from '@/physics/motion';
import { useEffectiveQuality, useGalaxyStore } from '@/store/useGalaxyStore';
import type { RegionId } from '@/types/content';

// Rapier's WebAssembly is only downloaded when the debris field is actually shown.
const DebrisField = lazy(() => import('@/physics/DebrisField'));

/** Puts a backdrop image behind a region, on the far side from where the camera will view it. */
function behind(id: RegionId, distance: number): [number, number, number] {
  const { position, cameraOffset } = regionById[id];
  const len = Math.hypot(...cameraOffset);
  return [
    position[0] - (cameraOffset[0] / len) * distance,
    position[1] - (cameraOffset[1] / len) * distance,
    position[2] - (cameraOffset[2] / len) * distance,
  ];
}

/**
 * Root of the 3D world. Each part has its own Suspense boundary so the sky, star and imagery
 * appear as soon as their own textures arrive instead of waiting for everything.
 */
export function GalaxyScene() {
  const quality = useEffectiveQuality();
  const guideEnabled = useGalaxyStore((s) => s.guideEnabled);
  const nearLayer = useRef<Group>(null);
  const farLayer = useRef<Group>(null);
  // Near layers sway more than far ones, which reads as depth.
  usePointerParallax(nearLayer, 0.035);
  usePointerParallax(farLayer, 0.012);

  // Defer the physics bundle until the galaxy has had time to load, so it never delays first paint.
  const [physicsReady, setPhysicsReady] = useState(false);
  useEffect(() => {
    if (quality === 'low') return;
    const t = window.setTimeout(() => setPhysicsReady(true), 3500);
    return () => window.clearTimeout(t);
  }, [quality]);

  return (
    <>
      <ambientLight intensity={0.035} color="#8fa4ff" />
      <hemisphereLight args={['#2a3566', '#05060c', 0.12]} />

      <Suspense fallback={null}>
        <SkySphere />
      </Suspense>
      <group ref={farLayer}>
        <StarField />
      </group>
      <group ref={nearLayer}>
        <SpaceDust />
      </group>

      <Suspense fallback={null}>
        <CentralStar />
      </Suspense>
      <Suspense fallback={null}>
        <AsteroidField inner={44} outer={54} />
      </Suspense>

      {/* Real Hubble and Webb photographs, placed as backdrops for their regions. */}
      <Suspense fallback={null}>
        <DeepSpaceImage image="carina-nebula" position={behind('skills', 130)} size={125} opacity={0.85} />
        <DeepSpaceImage image="helix-nebula" position={behind('achievements', 130)} size={70} opacity={0.6} />
        <DeepSpaceImage
          image="pillars-of-creation"
          position={behind('certificates', 130)}
          size={85}
          opacity={0.55}
        />
        <DeepSpaceImage image="webb-deep-field" position={behind('contact', 130)} size={80} opacity={0.4} />
        <DeepSpaceImage image="sombrero-galaxy" position={[-420, 170, -640]} size={200} opacity={0.8} />
        <DeepSpaceImage image="whirlpool-galaxy" position={[560, -140, -520]} size={120} opacity={0.75} />
      </Suspense>

      <ProjectSolarSystem />
      {physicsReady && (
        <Suspense fallback={null}>
          <DebrisField position={[10, 52, 128]} />
        </Suspense>
      )}
      <Regions />

      {guideEnabled && (
        <Suspense fallback={null}>
          <Astronaut />
        </Suspense>
      )}

      {/* Temporary free camera until the camera rig arrives in Phase 07. */}
      <OrbitControls enableDamping dampingFactor={0.06} minDistance={8} maxDistance={520} makeDefault />

      <Effects />
    </>
  );
}
