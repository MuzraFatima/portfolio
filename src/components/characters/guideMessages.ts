import type { RegionId } from '@/types/content';

/** What the guide says in each region. Short, optional and never required reading. */
export const guideMessages: Record<RegionId, string> = {
  gateway:
    "Hi, I'm your guide. This galaxy is Muzra's portfolio. Take the tour, or fly anywhere with the menu at the top.",
  about: 'This star is where it all starts: background, education and what Muzra wants to build next.',
  skills:
    'Each star in this nebula is a skill area. The lines connect skills that are used together in real projects.',
  projects:
    'Six worlds, six projects. GateOrchestra, the ringed planet nearest the star, is the flagship. Click any planet to land.',
  achievements: 'A small constellation, but every star in it is verified.',
  certificates: 'The observatory keeps every certificate, grouped by issuer.',
  contact: 'Last stop: the station. Send a message or find Muzra on GitHub and LinkedIn.',
};
