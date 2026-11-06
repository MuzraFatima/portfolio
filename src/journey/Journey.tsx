import { projects } from '@/data/projects';
import { useJourneyScroll } from './progress';
import { About } from './sections/About';
import { Achievements } from './sections/Achievements';
import { Certificates } from './sections/Certificates';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { ProjectSection, ProjectsIntro } from './sections/Projects';
import { Skills } from './sections/Skills';

/**
 * The whole portfolio as one scrolling page. Its sections are in the same order as the stops on
 * the camera path, so scrolling the text is what flies the camera. It is complete, readable HTML
 * on its own: without WebGL the same page simply shows over a plain starry background.
 */
export function Journey() {
  useJourneyScroll();
  return (
    <main id="content" className="relative z-10">
      <Hero />
      <About />
      <Skills />
      <ProjectsIntro />
      {projects.map((p) => (
        <ProjectSection key={p.id} project={p} />
      ))}
      <Achievements />
      <Certificates />
      <Contact />
      <footer className="on-sky relative px-5 pt-10 pb-24 font-mono text-[10px] leading-relaxed tracking-[0.08em] text-muted sm:px-12 lg:px-20">
        <p>© 2026 Muzra Fatima. Built with React, three.js and React Three Fiber.</p>
        <p className="mt-2 max-w-3xl">
          Image credits: NASA, ESA, CSA, STScI and the Hubble Heritage Team (STScI/AURA); NASA/JPL-Caltech;
          ESO/S. Brunier (CC BY 4.0). Planet textures: Solar System Scope (CC BY 4.0). Astronaut model: Poly
          by Google (CC BY 2.0). Use of these images does not imply endorsement by NASA, ESA or ESO.
        </p>
      </footer>
    </main>
  );
}
