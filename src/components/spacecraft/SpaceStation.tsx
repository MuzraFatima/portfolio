import { useGLTF } from '@react-three/drei';
import { NasaModel } from './NasaModel';

const URL = `${import.meta.env.BASE_URL}assets/models/iss.glb`;

/** The Space Station: NASA's model of the International Space Station. */
export function SpaceStation() {
  return <NasaModel url={URL} size={12} rotation={[0.35, 0.6, -0.15]} spin={0.015} />;
}

useGLTF.preload(URL);
