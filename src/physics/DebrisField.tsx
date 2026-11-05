import { useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BallCollider, Physics, type RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import { IcosahedronGeometry, type Vector3 } from 'three';
import { usePlanetTexture } from '@/components/galaxy/textures';

interface Rock {
  position: [number, number, number];
  scale: number;
}

function makeRocks(count: number, spread: number): Rock[] {
  return Array.from({ length: count }, () => ({
    position: [
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.5,
      (Math.random() - 0.5) * spread * 0.6,
    ],
    scale: 0.35 + Math.random() * 0.55,
  }));
}

function DebrisRock({ rock, geometry }: { rock: Rock; geometry: IcosahedronGeometry }) {
  const body = useRef<RapierRigidBody>(null);
  const texture = usePlanetTexture('mercury');
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // A weak spring toward the rock's home position keeps the cluster together over time.
  useFrame(() => {
    const b = body.current;
    if (!b) return;
    const p = b.translation();
    const k = 0.0025 * b.mass();
    b.applyImpulse(
      { x: (rock.position[0] - p.x) * k, y: (rock.position[1] - p.y) * k, z: (rock.position[2] - p.z) * k },
      true,
    );
  });

  // A click pushes the rock away from the camera with a little spin; it then drifts,
  // collides with its neighbours and slows down under light damping.
  const push = (direction: Vector3) => {
    const b = body.current;
    if (!b) return;
    const impulse = direction
      .clone()
      .normalize()
      .multiplyScalar(3.5 * rock.scale ** 3);
    b.applyImpulse(impulse, true);
    b.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }, true);
  };

  return (
    <RigidBody
      ref={body}
      position={rock.position}
      colliders={false}
      linearDamping={0.35}
      angularDamping={0.4}
      restitution={0.6}
      gravityScale={0}
    >
      <BallCollider args={[rock.scale * 0.9]} />
      <mesh
        geometry={geometry}
        scale={rock.scale}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          push(e.ray.direction);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial map={texture} roughness={0.95} color={hovered ? '#ffe0c0' : '#ffffff'} />
      </mesh>
    </RigidBody>
  );
}

/**
 * A small zero-gravity debris cluster that visitors can flick. This is the one place where real
 * rigid-body simulation adds something; everything else uses cheap closed-form motion.
 */
export default function DebrisField({ position }: { position: [number, number, number] }) {
  const rocks = useMemo(() => makeRocks(14, 9), []);
  const geometry = useMemo(() => {
    const g = new IcosahedronGeometry(1, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const s = 0.82 + (Math.sin(p.getX(i) * 9.1 + p.getY(i) * 4.7 + p.getZ(i) * 6.3) * 0.5 + 0.5) * 0.3;
      p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * 0.85, p.getZ(i) * s);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={position}>
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        {rocks.map((rock, i) => (
          <DebrisRock key={i} rock={rock} geometry={geometry} />
        ))}
      </Physics>
    </group>
  );
}
