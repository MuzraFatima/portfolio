import { describe, expect, it } from 'vitest';
import { achievements } from '@/data/achievements';
import { certificates } from '@/data/certificates';
import { profile } from '@/data/profile';
import { projectById, projects } from '@/data/projects';
import { resume } from '@/data/resume';
import { skillCategories } from '@/data/skills';

describe('projects', () => {
  it('has exactly six projects in the blueprint order, GateOrchestra first', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'gateorchestra',
      'whototrust',
      'neurolens',
      'caar',
      'compute-bazaar',
      'jocky',
    ]);
    expect(projects[0].flagship).toBe(true);
    expect(projects.filter((p) => p.flagship)).toHaveLength(1);
    projects.forEach((p, i) => expect(p.order).toBe(i + 1));
  });

  it('fills every required panel section', () => {
    for (const p of projects) {
      for (const field of ['overview', 'problem', 'solution', 'tagline'] as const) {
        expect(p[field].length, `${p.id}.${field}`).toBeGreaterThan(20);
      }
      for (const list of ['architecture', 'technologies', 'features', 'contribution'] as const) {
        expect(p[list].length, `${p.id}.${list}`).toBeGreaterThan(0);
      }
      expect(p.repo).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it('only shows a live demo where one genuinely exists', () => {
    const withDemo = projects.filter((p) => p.demo).map((p) => p.id);
    expect(withDemo).toEqual(['jocky']);
  });

  it('marks GateOrchestra as a team project hosted on the team repository', () => {
    expect(projectById.gateorchestra.team).toBe(true);
    expect(projectById.gateorchestra.repo).toContain('FarhanAaqil/GateOrchestra');
  });
});

describe('skills', () => {
  it('only links to projects that exist', () => {
    for (const c of skillCategories) for (const id of c.projects) expect(projectById[id]).toBeDefined();
  });

  it('never uses percentages', () => {
    const text = JSON.stringify(skillCategories);
    expect(text).not.toMatch(/\d+\s*%/);
  });
});

describe('certificates', () => {
  it('lists 15 certificates with name and issuer only until verified fields are supplied', () => {
    expect(certificates).toHaveLength(15);
    for (const c of certificates) {
      expect(c.name && c.issuer).toBeTruthy();
      if (c.verifyUrl) expect(c.verifyUrl).toMatch(/^https:\/\//);
    }
  });

  it('has unique ids', () => {
    expect(new Set(certificates.map((c) => c.id)).size).toBe(certificates.length);
  });
});

describe('profile', () => {
  it('uses the verified public contact details', () => {
    expect(profile.email).toBe('muzrafatima@gmail.com');
    expect(profile.github).toBe('https://github.com/MuzraFatima');
    expect(profile.linkedin).toContain('muzra-fatima-7150452bb');
  });

  it('links achievements only to real projects', () => {
    for (const a of achievements) if (a.project) expect(projectById[a.project]).toBeDefined();
  });
});

describe('resume', () => {
  it('never publishes the phone number', () => {
    expect(JSON.stringify(resume)).not.toMatch(/\+?91[\s-]?\d{5}|\d{10}/);
  });

  it('agrees with the verified profile', () => {
    expect(resume.contact.email).toBe(profile.email);
    expect(resume.name).toBe(profile.name);
    for (const p of resume.projects)
      if (p.link) expect(p.link).toMatch(/^https:\/\/github\.com\/MuzraFatima\//);
  });
});
