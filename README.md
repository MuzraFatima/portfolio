# Muzra Fatima — The Galaxy of Intelligence

An explorable 3D portfolio: a realistic galaxy built from real NASA, ESA and ESO imagery, where each
of my six AI/ML projects is a planet you can fly to.

**Aspiring AI/ML Engineer · Generative AI · Multi-Agent Systems · Intelligent Systems**
[GitHub](https://github.com/MuzraFatima) · [LinkedIn](https://www.linkedin.com/in/muzra-fatima-7150452bb/) · muzrafatima@gmail.com

## What you can do

- **Start with About Me**, beside a floating astronaut guide who can show you around (or be hidden).
- **Fly to six project planets**, in this order: **GateOrchestra** (flagship), WhoToTrust, NeuroLens,
  Cost-Aware Agent Router, Compute Bazaar and JOCKY Forensics. Click a planet to land and read its overview,
  problem, solution, architecture, verified features, my contribution and technologies.
- **Visit the regions**: Skill Nebula, Achievement Constellation, Certificate Observatory and Contact Space Station.
- **Explore your way**: a guided tour (scroll or swipe between stops), free orbit mode, a top menu, a mini-map and
  keyboard shortcuts (1–7, ← →, Esc).
- **Read everything without 3D**: the text-only view (Settings) and automatic fallback when WebGL is unavailable.

## Built with

React 19 · TypeScript · Vite 6 · three.js · React Three Fiber · Drei · Rapier · GSAP + ScrollTrigger ·
Framer Motion · Zustand · Tailwind CSS 4 · Web Audio API · Vitest

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
Google (CC BY 2.0). Use of these images does not imply endorsement by NASA, ESA or ESO. Full details in
[docs/ASSET_LICENSES.md](docs/ASSET_LICENSES.md).

## Licence

Code © 2026 Muzra Fatima. Third-party assets keep their own licences as listed above.
