import { Suspense } from 'react';
import { Vector3 } from 'three';
import { JourneyCamera } from '@/camera/JourneyCamera';
import { Astronaut } from '@/components/characters/Astronaut';
import { AsteroidField } from '@/components/galaxy/AsteroidField';
import { CentralStar } from '@/components/galaxy/CentralStar';
import { Effects } from '@/components/galaxy/Effects';
import { ParticleNebula } from '@/components/galaxy/ParticleNebula';
import { SkySphere } from '@/components/galaxy/SkySphere';
import { SpaceDust } from '@/components/galaxy/SpaceDust';
import { StarField } from '@/components/galaxy/StarField';
import { stopIndex, stops } from '@/journey/stops';
import { type Vec3, WORLD } from '@/journey/world';
import { ProjectSolarSystem } from './ProjectSolarSystem';
import { Regions } from './Regions';

/** A point behind a stop's subject, as seen from where the camera views it. */
function behind(id: string, distance: number): Vec3 {
  const s = stops[stopIndex[id]];
  const target = new Vector3(...s.target);
  const dir = target
    .clone()
    .sub(new Vector3(...s.camera))
    .normalize();
  return target.addScaledVector(dir, distance).toArray() as Vec3;
}

const cameraOf = (id: string) => stops[stopIndex[id]].camera;

/**
 * Root of the 3D world. Each part has its own Suspense boundary so the sky, star and planets
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
        <AsteroidField inner={44} outer={54} />
      </Suspense>

      {/* Real Hubble photographs rebuilt as particle volumes, so they have depth and parallax. */}
      <ParticleNebula
        image="carina-nebula"
        position={WORLD.skillNebula}
        size={150}
        depth={34}
        faceToward={cameraOf('skills')}
        opacity={0.8}
      />
      <ParticleNebula
        image="helix-nebula"
        position={behind('achievements', 70)}
        size={70}
        depth={16}
        faceToward={cameraOf('achievements')}
        opacity={0.7}
      />
      <ParticleNebula
        image="pillars-of-creation"
        position={behind('certificates', 75)}
        size={80}
        depth={20}
        faceToward={cameraOf('certificates')}
        opacity={0.65}
      />
      <ParticleNebula
        image="whirlpool-galaxy"
        position={behind('contact', 150)}
        size={110}
        depth={10}
        shape="disk"
        faceToward={cameraOf('contact')}
        opacity={0.8}
      />
      <ParticleNebula
        image="sombrero-galaxy"
        position={[-330, 150, -430]}
        size={170}
        depth={14}
        shape="disk"
        faceToward={[0, 60, 0]}
        opacity={0.75}
      />

      <ProjectSolarSystem />
      <Regions />

      <Suspense fallback={null}>
        <Astronaut />
      </Suspense>

      <JourneyCamera />
      <Effects />
    </>
  );
}
