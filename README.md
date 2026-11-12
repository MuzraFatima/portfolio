# Muzra Fatima — The Galaxy of Intelligence

An explorable 3D portfolio: a realistic galaxy built from real NASA, ESA and ESO imagery, where each
of my AI/ML projects is a planet you can fly to.

**Aspiring AI/ML Engineer · Generative AI · Multi-Agent Systems · Intelligent Systems**
**Live:** [muzraporfolio.vercel.app](https://muzraporfolio.vercel.app/) ·
[GitHub](https://github.com/MuzraFatima) · [LinkedIn](https://www.linkedin.com/in/muzra-fatima-7150452bb/) · muzrafatima@gmail.com

## What you can do

- **Scroll to travel.** The whole portfolio is one page. Scrolling flies the camera along a single path
  through a realistic galaxy, and the text for each stop sits right on the scene, with no boxes or panels.
- **Start with About Me**, beside the astronaut who travels the whole journey with you.
- **Pass seven project planets** in order: **GateOrchestra** (flagship), HorizonGuard, WhoToTrust,
  NeuroLens, Cost-Aware Agent Router, Compute Bazaar and JOCKY Forensics, each with its overview,
  problem, approach, features, my contribution and technologies. Click a planet to jump to it.
- **Explore a project** to open its deep dive: why it matters, an architecture diagram, AI/ML methodology,
  key innovations, results with their caveats, and implementation status (implemented vs research direction).
- **Visit** the Skill Nebula, the Achievement Constellation, the Observatory (certificates) and the Space
  Station (contact).
- **Read the résumé** as text from the "Résumé" link, and print or save it as a PDF.
- **No 3D needed.** Every word is plain HTML; without WebGL the page shows over a still Milky Way photo.

## Built with

React 19 · TypeScript · Vite 6 · three.js · React Three Fiber · Drei · Framer Motion · Zustand ·
Tailwind CSS 4 · Vitest

## Run locally

Requires Node.js 20.18 or newer.

```bash
git clone https://github.com/MuzraFatima/portfolio.git
cd portfolio
npm ci
npm run dev          # http://localhost:5173
```

| Command                                                       | What it does                              |
| ------------------------------------------------------------- | ----------------------------------------- |
| `npm run dev`                                                 | Development server                        |
| `npm run build`                                               | Typecheck and production build to `dist/` |
| `npm run preview`                                             | Serve the production build                |
| `npm test`                                                    | Unit tests                                |
| `npm run lint` / `npm run format:check` / `npm run typecheck` | Quality checks (all run in CI)            |

Optional: copy `.env.example` to `.env` and add a Web3Forms key to enable the contact form locally.

## Documentation

| Document                                                   | Contents                                             |
| ---------------------------------------------------------- | ---------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)               | How the 3D layer, interface and data fit together    |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)                   | Deploying to Vercel, step by step                    |
| [docs/PROJECT_AUDIT.md](docs/PROJECT_AUDIT.md)             | How every project claim was verified                 |
| [docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md)           | Source, licence and credit for every image and model |
| [docs/TEST_REPORT.md](docs/TEST_REPORT.md)                 | Automated and browser test results, performance      |
| [docs/DEVELOPMENT_LOG.md](docs/DEVELOPMENT_LOG.md)         | Phase-by-phase build log                             |
| [docs/MISSING_INFORMATION.md](docs/MISSING_INFORMATION.md) | What is still to be supplied                         |

## Image credits

Space imagery: NASA, ESA, CSA, STScI and the Hubble Heritage Team (STScI/AURA); NASA/JPL-Caltech;
ESO/S. Brunier (CC BY 4.0). Planet textures: Solar System Scope (CC BY 4.0). Astronaut model: Poly by
Google (CC BY 2.0). Hubble and ISS models: NASA 3D Resources. Use of these images does not imply endorsement by NASA, ESA or ESO. Full details in
[docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md).

## Licence

Code © 2026 Muzra Fatima. Third-party assets keep their own licences as listed above.
