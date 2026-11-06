import { useGLTF } from '@react-three/drei';
import { NasaModel } from './NasaModel';

const URL = `${import.meta.env.BASE_URL}assets/models/hubble.glb`;

/** The Observatory: NASA's model of the Hubble Space Telescope. */
export function Telescope() {
  return <NasaModel url={URL} size={11} rotation={[0.25, -0.9, 0.35]} spin={0.03} />;
}

useGLTF.preload(URL);
