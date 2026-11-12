import { describe, expect, it } from 'vitest';
import { achievements } from '@/data/achievements';
import { certificates } from '@/data/certificates';
import { profile } from '@/data/profile';
import { projectById, projects } from '@/data/projects';
import { resume } from '@/data/resume';
import { skillCategories } from '@/data/skills';

describe('projects', () => {
  it('puts GateOrchestra first and HorizonGuard second, then the blueprint projects in order', () => {
    expect(projects.map((p) => p.id)).toEqual([
      'gateorchestra',
      'horizonguard',
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

describe('project deep dives', () => {
  it('fills every section of a deep dive and keeps research apart from what is implemented', () => {
    for (const p of projects) {
      const d = p.deepDive;
      if (!d) continue;
      expect(d.whyItMatters.length, p.id).toBeGreaterThan(40);
      expect(d.pipeline.length, p.id).toBeGreaterThanOrEqual(4);
      expect(d.methodology.length, p.id).toBeGreaterThan(0);
      expect(d.innovations.length, p.id).toBeGreaterThan(0);
      expect(d.status.implemented.length, p.id).toBeGreaterThan(0);
      for (const r of d.status.research ?? []) expect(d.status.implemented, p.id).not.toContain(r);
    }
  });

  it('describes Compute Bazaar and HorizonGuard from their latest repositories', () => {
    expect(projectById['compute-bazaar'].deepDive).toBeDefined();
    expect(projectById.horizonguard.deepDive).toBeDefined();
    expect(projectById.horizonguard.repo).toBe('https://github.com/MuzraFatima/HorizonGuard');
    // The old 25-round figure was replaced by the current results.
    expect(JSON.stringify(projectById['compute-bazaar'])).not.toContain('38%');
    // Figures Muzra asked to keep off the site.
    expect(JSON.stringify(projectById['compute-bazaar'])).not.toContain('78.0%');
    expect(JSON.stringify(projectById.horizonguard)).not.toContain('65%');
    // HorizonGuard results come from synthetic agents, and the page must say so.
    expect(JSON.stringify(projectById.horizonguard.deepDive)).toMatch(/synthetic agents/);
  });

  it('reports the verified GateOrchestra benchmark with its caveats', () => {
    const go = JSON.stringify(projectById.gateorchestra);
    expect(go).toContain('97.9%');
    expect(go).toContain('was not met');
    expect(projectById.gateorchestra.team).toBe(true);
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
