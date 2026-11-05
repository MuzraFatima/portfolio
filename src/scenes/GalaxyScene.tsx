import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { AsteroidField } from '@/components/galaxy/AsteroidField';
import { CentralStar } from '@/components/galaxy/CentralStar';
import { DeepSpaceImage } from '@/components/galaxy/DeepSpaceImage';
import { Effects } from '@/components/galaxy/Effects';
import { SkySphere } from '@/components/galaxy/SkySphere';
import { SpaceDust } from '@/components/galaxy/SpaceDust';
import { StarField } from '@/components/galaxy/StarField';
import { regionById } from '@/data/regions';
import type { RegionId } from '@/types/content';

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
  return (
    <>
      <ambientLight intensity={0.035} color="#8fa4ff" />
      <hemisphereLight args={['#2a3566', '#05060c', 0.12]} />

      <Suspense fallback={null}>
        <SkySphere />
      </Suspense>
      <StarField />
      <SpaceDust />

      <Suspense fallback={null}>
        <CentralStar />
      </Suspense>
      <Suspense fallback={null}>
        <AsteroidField />
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

      {/* Temporary free camera until the camera rig arrives in Phase 07. */}
      <OrbitControls enableDamping dampingFactor={0.06} minDistance={8} maxDistance={420} makeDefault />

      <Effects />
    </>
  );
}
