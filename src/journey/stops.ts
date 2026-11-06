import { Vector3 } from 'three';
import { projects } from '@/data/projects';
import { planetConfigs } from '@/scenes/ProjectSolarSystem/planetConfigs';
import { planetPosition, type Vec3, WORLD } from './world';

/** Which side of the screen the text sits on. The 3D subject is framed on the other side. */
export type TextSide = 'left' | 'right';

export interface Stop {
  /** Matches the id of the HTML section that holds this stop's text. */
  id: string;
  /** The place in the galaxy, shown as the location title. */
  place: string;
  /** What the stop is about, shown in navigation. */
  label: string;
  side: TextSide;
  camera: Vec3;
  target: Vec3;
}

const v = (p: Vec3) => new Vector3(...p);

/** Camera placement for a planet: approaching along the spiral, on the sunlit side, close enough to fill the frame. */
function planetStop(index: number): Stop {
  const project = projects[index];
  const config = planetConfigs[project.id];
  const pos = planetPosition(project.id);
  const angle = Math.atan2(pos.z, pos.x);
  const radial = new Vector3(Math.cos(angle), 0, Math.sin(angle));
  const forward = new Vector3(-Math.sin(angle), 0, Math.cos(angle));
  const ringOuter = config.planet.rings?.outer ?? 0;
  const distance = Math.max(config.planet.radius * 4.6, ringOuter * 3.1);
  const dir = forward
    .multiplyScalar(-0.8)
    .addScaledVector(radial, -0.38)
    .add(new Vector3(0, 0.32, 0));
  const camera = pos.clone().addScaledVector(dir.normalize(), distance);
  return {
    id: `project-${project.id}`,
    place: project.name,
    label: project.shortName ?? project.name,
    side: index % 2 === 0 ? 'left' : 'right',
    camera: camera.toArray() as Vec3,
    target: pos.toArray() as Vec3,
  };
}

function offset(target: Vec3, by: Vec3): Vec3 {
  return v(target).add(v(by)).toArray() as Vec3;
}

/** The journey, in scroll order. Each stop has a matching section in the page. */
export const stops: Stop[] = [
  {
    id: 'home',
    place: 'The Edge of the System',
    label: 'Home',
    side: 'left',
    camera: [46, 30, 196],
    target: [0, 4, 0],
  },
  {
    id: 'about',
    place: 'The Central Star',
    label: 'About',
    side: 'right',
    camera: [2, 14, -26],
    target: [0, 0, 0],
  },
  {
    id: 'skills',
    place: 'The Skill Nebula',
    label: 'Skills',
    side: 'left',
    camera: offset(WORLD.skillNebula, [12, -24, 88]),
    target: WORLD.skillNebula,
  },
  {
    id: 'projects',
    place: 'The Project System',
    label: 'Projects',
    side: 'left',
    camera: [-10, 112, -84],
    target: [0, 0, 0],
  },
  ...projects.map((_, i) => planetStop(i)),
  {
    id: 'achievements',
    place: 'The Achievement Constellation',
    label: 'Achievements',
    side: 'left',
    camera: offset(WORLD.achievements, [-12, -2, 30]),
    target: WORLD.achievements,
  },
  {
    id: 'certificates',
    place: 'The Observatory',
    label: 'Certificates',
    side: 'right',
    camera: offset(WORLD.observatory, [-16, 5, 18]),
    target: WORLD.observatory,
  },
  {
    id: 'contact',
    place: 'The Space Station',
    label: 'Contact',
    side: 'left',
    camera: offset(WORLD.station, [14, 5, 20]),
    target: WORLD.station,
  },
];

export const stopIndex = Object.fromEntries(stops.map((s, i) => [s.id, i])) as Record<string, number>;

/** Top-level stops shown in the navigation. */
export const navStops = ['about', 'skills', 'projects', 'achievements', 'certificates', 'contact'];
