import { Billboard, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { AdditiveBlending, type Texture } from 'three';
import { spaceImageUrl, type SpaceImage, useColorTextures } from './textures';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Black sky in the photograph becomes transparent, and the edges fade out softly so the
// rectangle of the original image is never visible.
const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float opacity;
  uniform float edge;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(map, vUv);
    vec2 centred = vUv - 0.5;
    float radial = 1.0 - smoothstep(0.5 - edge, 0.5, length(centred));
    float frame = smoothstep(0.0, edge * 0.6, vUv.x) * smoothstep(0.0, edge * 0.6, 1.0 - vUv.x)
                * smoothstep(0.0, edge * 0.6, vUv.y) * smoothstep(0.0, edge * 0.6, 1.0 - vUv.y);
    float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    // Faint haze fades out first, so only the bright structure reaches the edge of the fade.
    float mask = pow(radial * frame, 1.0 + (1.0 - smoothstep(0.08, 0.45, luma)) * 2.5);
    vec3 col = max(tex.rgb - 0.025, 0.0);
    gl_FragColor = vec4(col * mask * opacity, 1.0);
    #include <colorspace_fragment>
  }
`;

interface Props {
  image: SpaceImage;
  position: [number, number, number];
  /** Width in world units; height follows the image's aspect ratio. */
  size: number;
  opacity?: number;
  /** How far in from the edge the fade starts (0–0.5). */
  edge?: number;
  rotation?: number;
}

/**
 * A real Hubble or Webb photograph placed in the scene as a camera-facing, additively blended
 * billboard, so nebulae and galaxies sit at depth instead of being painted on a backdrop.
 */
export function DeepSpaceImage({ image, position, size, opacity = 1, edge = 0.45, rotation = 0 }: Props) {
  const texture = useTexture(spaceImageUrl(image)) as Texture;
  useColorTextures(texture);

  const aspect = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    return img?.width && img?.height ? img.height / img.width : 1;
  }, [texture]);

  const uniforms = useMemo(
    () => ({ map: { value: texture }, opacity: { value: opacity }, edge: { value: edge } }),
    [texture, opacity, edge],
  );

  return (
    <Billboard position={position}>
      <mesh rotation={[0, 0, rotation]} renderOrder={-5}>
        <planeGeometry args={[size, size * aspect]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}
