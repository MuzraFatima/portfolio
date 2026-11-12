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

export type ProjectId =
  'gateorchestra' | 'whototrust' | 'neurolens' | 'caar' | 'compute-bazaar' | 'jocky' | 'horizonguard';

export interface ProjectImage {
  src: string;
  alt: string;
}

/** A stage of a project's pipeline, drawn as the architecture diagram in the project detail view. */
export interface PipelineStage {
  label: string;
  detail: string;
}

export interface ProjectResult {
  value: string;
  label: string;
  /** Caveat or comparison that must travel with the number. */
  note?: string;
}

/**
 * The deeper explanation shown in a project's detail view. Optional: projects without it still
 * get a detail view built from their core fields.
 */
export interface ProjectDeepDive {
  whyItMatters: string;
  pipeline: PipelineStage[];
  methodology: string[];
  innovations: string[];
  results?: ProjectResult[];
  status: {
    /** Working, tested functionality in the repository. */
    implemented: string[];
    /** Research directions or work in progress, kept separate from what is implemented. */
    research?: string[];
    limits?: string[];
  };
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
  deepDive?: ProjectDeepDive;
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
