import { useEffect, useMemo, useRef, useState } from 'react';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, type Group, Vector3 } from 'three';
import { useEffectiveQuality } from '@/store/useGalaxyStore';
import type { Vec3 } from '@/journey/world';
import { type SpaceImage, spaceImageUrl } from './textures';

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  uniform float pixelRatio;
  uniform float opacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = -mv.z;
    gl_PointSize = min(size * pixelRatio * (420.0 / dist), 180.0 * pixelRatio);
    // Fade particles that come very close, so flying through the cloud never fills the screen.
    vAlpha = opacity * smoothstep(2.0, 14.0, dist);
    vColor = color;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c) * 4.0;
    float a = exp(-d * 3.2) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

/** Reads a photograph's pixels at a small size. Cached per image and width. */
const pixelCache = new Map<string, Promise<ImageData>>();
function loadPixels(url: string, width: number): Promise<ImageData> {
  const key = `${url}@${width}`;
  let p = pixelCache.get(key);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const h = Math.max(1, Math.round((img.height / img.width) * width));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return reject(new Error('2D canvas unavailable'));
        ctx.drawImage(img, 0, 0, width, h);
        resolve(ctx.getImageData(0, 0, width, h));
      };
      img.onerror = () => reject(new Error(`Could not load ${url}`));
      img.src = url;
    });
    pixelCache.set(key, p);
  }
  return p;
}

// Deterministic pseudo-random numbers, so a nebula keeps its shape between visits.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gaussian(rand: () => number) {
  return Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
}

interface Layer {
  /** Sampling width in pixels. Coarse layers make soft gas, fine layers make detail. */
  width: number;
  /** Particles per bright pixel. */
  density: number;
  size: number;
}

function buildGeometry(
  layers: { data: ImageData; layer: Layer }[],
  worldWidth: number,
  depth: number,
  shape: 'cloud' | 'disk',
  budget: number,
) {
  const rand = mulberry32(7);
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  for (const { data, layer } of layers) {
    const { width: w, height: h, data: px } = data;
    const scale = worldWidth / w;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const k = (y * w + x) * 4;
        const r = px[k] / 255;
        const g = px[k + 1] / 255;
        const b = px[k + 2] / 255;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (lum < 0.05) continue;
        const expected = Math.pow(lum, 1.35) * layer.density * budget;
        let n = Math.floor(expected) + (rand() < expected % 1 ? 1 : 0);
        while (n-- > 0) {
          const px3 = (x - w / 2 + rand() - 0.5) * scale;
          const py3 = (h / 2 - y + rand() - 0.5) * scale;
          // A cloud has depth everywhere; a galaxy disk is thin, thickest at its bright core.
          const spread = shape === 'disk' ? depth * (0.15 + lum * 0.6) : depth * (0.55 + (1 - lum) * 0.6);
          positions.push(px3, py3, gaussian(rand) * spread);
          const boost = 1.15 + (1 - lum) * 0.5;
          colors.push(Math.min(1, r * boost), Math.min(1, g * boost), Math.min(1, b * boost));
          sizes.push(layer.size * scale * (0.55 + rand() * 0.9) * (0.6 + lum * 0.7));
        }
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

interface Props {
  image: SpaceImage;
  position: Vec3;
  /** Width of the nebula in world units. */
  size: number;
  /** How deep the cloud is along its facing direction. */
  depth?: number;
  shape?: 'cloud' | 'disk';
  /** Point the nebula's face toward this position (usually where the camera views it from). */
  faceToward?: Vec3;
  rotation?: Vec3;
  opacity?: number;
}

/**
 * A real Hubble or Webb photograph turned into a volume. Every bright pixel becomes particles
 * with the photo's own colours, spread through depth, so the nebula has true parallax as the
 * camera flies past or through it — unlike a flat picture, which gives itself away the moment
 * the camera moves.
 */
export function ParticleNebula({
  image,
  position,
  size,
  depth = size * 0.18,
  shape = 'cloud',
  faceToward,
  rotation,
  opacity = 0.75,
}: Props) {
  const quality = useEffectiveQuality();
  const budget = quality === 'high' ? 1 : quality === 'medium' ? 0.6 : 0.3;
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const group = useRef<Group>(null);

  useEffect(() => {
    let cancelled = false;
    const url = spaceImageUrl(image);
    const layers: Layer[] = [
      { width: 120, density: 3.2, size: 3.6 },
      { width: 300, density: 1.4, size: 1.2 },
    ];
    Promise.all(layers.map((l) => loadPixels(url, l.width)))
      .then((data) => {
        if (cancelled) return;
        setGeometry(
          buildGeometry(
            data.map((d, i) => ({ data: d, layer: layers[i] })),
            size,
            depth,
            shape,
            budget,
          ),
        );
      })
      .catch(() => {
        /* The nebula is decoration; the page works without it. */
      });
    return () => {
      cancelled = true;
    };
  }, [image, size, depth, shape, budget]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  useEffect(() => {
    if (group.current && faceToward) group.current.lookAt(new Vector3(...faceToward));
  }, [faceToward, geometry]);

  const uniforms = useMemo(
    () => ({ pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }, opacity: { value: opacity } }),
    [opacity],
  );

  if (!geometry) return null;
  return (
    <group ref={group} position={position} rotation={rotation}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
