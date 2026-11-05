# Asset Discovery

## Decision: procedural first

The galaxy, planets, rings, asteroids, nebula, satellites, space station and astronaut guide will be
**generated in code** (Three.js geometry and GLSL shaders). Reasons:

- **No licence risk** — nothing third-party ships in the 3D scene.
- **Small download** — a few kilobytes of shader code instead of tens of megabytes of GLB and HDRI files, which matters on mobile.
- **Unique planets** — each project planet gets its own shader and palette from the blueprint, so they are never six identical spheres.
- **Easy quality scaling** — particle counts and detail can drop on low-end devices.

External models (Sketchfab, Poly Haven, Kenney) stay optional. Any that are added later must be logged
in `docs/ASSET_LICENSES.md` with source, licence, attribution and optimisation status before they are committed.

## Project screenshots available in the repositories

| Project         | Files                                         | Licence                                  |
| --------------- | --------------------------------------------- | ---------------------------------------- |
| GateOrchestra   | `docs/screenshots/` ×5, `reports/figures/` ×2 | None (team repo) — needs team permission |
| WhoToTrust      | `docs/screenshots/` ×6                        | MIT                                      |
| NeuroLens       | `demo/screenshots/` ×4, `results/figures/` ×5 | MIT                                      |
| CAAR            | `docs/dashboard_*.png` ×3, `docs/pareto.png`  | MIT                                      |
| Compute Bazaar  | `docs/screenshots/` ×4                        | MIT                                      |
| JOCKY Forensics | none                                          | None                                     |

The MIT-licensed screenshots are Muzra's own work and will be converted to WebP and stored in
`public/assets/images/projects/`.

## Other assets

| Asset              | Plan                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| Fonts              | Google Fonts (SIL Open Font License): a display face for headings and Inter for body text                       |
| Audio              | Ambient pad and UI sounds synthesised in the browser with the Web Audio API — no audio files, no licence needed |
| Favicon            | Original SVG in `public/favicon.svg`                                                                            |
| Resume             | Supplied PDF — pending permission (see MISSING_INFORMATION #3)                                                  |
| Certificate images | Not supplied yet                                                                                                |

## Recommended technology (confirmed)

React 19 + TypeScript + Vite, three.js with React Three Fiber and Drei, Rapier for a few physical
interactions, GSAP for camera timelines, Framer Motion for interface transitions, Zustand for shared
state, Tailwind CSS for layout, Vercel for hosting.
