export type RegionId =
  'gateway' | 'about' | 'skills' | 'projects' | 'achievements' | 'certificates' | 'contact';

export interface Region {
  id: RegionId;
  code: string;
  name: string;
  label: string;
  description: string;
  /** World-space centre of the region. */
  position: [number, number, number];
  /** Where the camera sits when it visits the region, relative to the centre. */
  cameraOffset: [number, number, number];
  color: string;
}

export interface Education {
  degree: string;
  institution: string;
  period?: string;
  detail?: string;
}

export interface Publication {
  title: string;
  venue: string;
  year: number;
  summary: string;
  url?: string;
}

export interface Profile {
  name: string;
  headline: string;
  roles: string[];
  summary: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  interests: string[];
  goals: string[];
  education: Education[];
  publication: Publication;
}

export type ProjectId = 'gateorchestra' | 'whototrust' | 'neurolens' | 'caar' | 'compute-bazaar' | 'jocky';

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  id: ProjectId;
  order: number;
  flagship?: boolean;
  name: string;
  shortName?: string;
  subtitle?: string;
  tagline: string;
  repo: string;
  /** Only set when a genuine, working demo exists. */
  demo?: string;
  team: boolean;
  award?: string;
  overview: string;
  problem: string;
  solution: string;
  architecture: string[];
  technologies: string[];
  features: string[];
  contribution: string[];
  images: ProjectImage[];
  /** Planet colours, primary first. */
  palette: string[];
  /** Short description of the planet's visual identity. */
  visual: string;
}

export type SkillLevel = 'Proficient' | 'Intermediate' | 'Beginner';

export interface Skill {
  name: string;
  level?: SkillLevel;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  skills: Skill[];
  projects: ProjectId[];
}

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  year: number;
  project?: ProjectId;
  url?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  /** Optional verified fields — left undefined until supplied. */
  issued?: string;
  credentialId?: string;
  verifyUrl?: string;
  image?: string;
}
