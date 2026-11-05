import type { Region, RegionId } from '@/types/content';

/**
 * The seven galaxy regions. The project solar system orbits the central star at the origin;
 * the other regions sit far enough out that camera flights between them read clearly.
 */
export const regions: Region[] = [
  {
    id: 'gateway',
    code: 'R01',
    name: 'Cosmic Gateway',
    label: 'Home',
    description: 'Introduction and navigation.',
    position: [0, 0, 0],
    cameraOffset: [0, 62, 150],
    color: '#7c8cff',
  },
  {
    id: 'about',
    code: 'R02',
    name: 'Central Star',
    label: 'About',
    description: 'About, education, interests and goals.',
    position: [0, 0, 0],
    cameraOffset: [-4, 2.5, 15],
    color: '#ffe7a8',
  },
  {
    id: 'skills',
    code: 'R03',
    name: 'Skill Nebula',
    label: 'Skills',
    description: 'Technical skills as constellations.',
    position: [-98, 16, -58],
    cameraOffset: [8, 2, 34],
    color: '#c084fc',
  },
  {
    id: 'projects',
    code: 'R04',
    name: 'Project Solar System',
    label: 'Projects',
    description: 'Six project planets.',
    position: [0, 0, 0],
    cameraOffset: [0, 70, 118],
    color: '#5ee1ff',
  },
  {
    id: 'achievements',
    code: 'R05',
    name: 'Achievement Constellation',
    label: 'Achievements',
    description: 'Verified achievements.',
    position: [94, 24, -62],
    cameraOffset: [-6, 2, 26],
    color: '#fde68a',
  },
  {
    id: 'certificates',
    code: 'R06',
    name: 'Certificate Observatory',
    label: 'Certificates',
    description: 'Credential gallery.',
    position: [-84, -18, 66],
    cameraOffset: [12, 5, 22],
    color: '#34d399',
  },
  {
    id: 'contact',
    code: 'R07',
    name: 'Contact Space Station',
    label: 'Contact',
    description: 'Ways to get in touch.',
    position: [86, -16, 70],
    cameraOffset: [-10, 5, 22],
    color: '#fb923c',
  },
];

export const regionById = Object.fromEntries(regions.map((r) => [r.id, r])) as Record<RegionId, Region>;

/** Recommended order for guided mode. */
export const guidedTour: RegionId[] = [
  'gateway',
  'about',
  'skills',
  'projects',
  'achievements',
  'certificates',
  'contact',
];
