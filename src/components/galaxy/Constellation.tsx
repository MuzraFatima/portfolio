import { useMemo } from 'react';
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute } from 'three';

export interface ConstellationNode {
  position: [number, number, number];
  color: string;
  size?: number;
}

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  uniform float pixelRatio;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * pixelRatio * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

// A bright core with diffraction spikes, the way stars appear in Webb and Hubble photographs.
const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    float core = exp(-d * d * 90.0) * 1.6;
    float halo = exp(-d * d * 14.0) * 0.45;
    float spikes = (exp(-abs(p.x) * 70.0) + exp(-abs(p.y) * 70.0)) * smoothstep(0.5, 0.0, d) * 0.5;
    float a = core + halo + spikes;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

interface Props {
  nodes: ConstellationNode[];
  edges: [number, number][];
  lineColor?: string;
}

/** Bright stars joined by faint lines, like a sky-chart constellation. */
export function Constellation({ nodes, edges, lineColor = '#9fb0ff' }: Props) {
  const points = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new Float32BufferAttribute(
        nodes.flatMap((n) => n.position),
        3,
      ),
    );
    g.setAttribute(
      'color',
      new Float32BufferAttribute(
        nodes.flatMap((n) => new Color(n.color).toArray()),
        3,
      ),
    );
    g.setAttribute(
      'size',
      new Float32BufferAttribute(
        nodes.map((n) => n.size ?? 6),
        1,
      ),
    );
    return g;
  }, [nodes]);

  const lines = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      'position',
      new Float32BufferAttribute(
        edges.flatMap(([a, b]) => [...nodes[a].position, ...nodes[b].position]),
        3,
      ),
    );
    return g;
  }, [nodes, edges]);

  const uniforms = useMemo(() => ({ pixelRatio: { value: Math.min(window.devicePixelRatio, 2) } }), []);

  return (
    <group>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={0.28}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={points}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
