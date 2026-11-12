# Test Report

Date: 6 November 2026 · Build: production (`npm run build`) served with `vite preview`.

## 1. Automated checks (run in CI on every pull request)

| Check                                                               | Tool              | Result       |
| ------------------------------------------------------------------- | ----------------- | ------------ |
| Formatting                                                          | Prettier          | Pass         |
| Lint (zero warnings, incl. React Hooks and JSX accessibility rules) | ESLint            | Pass         |
| Type safety                                                         | `tsc -b` (strict) | Pass         |
| Unit tests                                                          | Vitest — 28 tests | 28 / 28 pass |
| Production build                                                    | Vite              | Pass         |

The unit tests guard the portfolio's honesty rules as well as the code:

- exactly six projects in blueprint order, GateOrchestra first and the only flagship;
- every project panel section filled; repository links point to GitHub;
- a live-demo link exists only for JOCKY Forensics (the only real demo);
- GateOrchestra is marked as a team project on the team repository;
- skill areas link only to real projects and never use percentages;
- 15 certificates with unique ids; verification URLs, when added, must be HTTPS;
- verified contact details; seven regions all on the guided tour;
- orbits stay on their radius and repeat exactly after one period, even after a week; Kepler-style period scaling;
- contact form validation (missing name, invalid email, short and over-long messages).

## 2. Browser test — scroll journey (headless Chrome, SwiftShader software WebGL)

Run on 6 November 2026 after the Phase 16 redesign.

| Scenario                                                                                                       | Result |
| -------------------------------------------------------------------------------------------------------------- | ------ |
| Screenshots of all 13 stops at 1440 × 900: subject framed opposite the text, place title correct               | Pass   |
| Résumé opens from the header, shows summary, skills and projects, contains no phone number, closes with Escape | Pass   |
| Header link "Projects" scrolls the journey to the project system                                               | Pass   |
| No Guided/Free, Sound or Settings controls anywhere                                                            | Pass   |
| A live-demo link appears only for JOCKY Forensics                                                              | Pass   |
| Phone 390 × 844: no horizontal overflow, menu opens, hero/about/GateOrchestra/contact readable                 | Pass   |
| WebGL disabled: every section still present over the still Milky Way photo                                     | Pass   |
| No console errors or failed requests (desktop, phone, no-WebGL)                                                | Pass   |

The project order (GateOrchestra first) is asserted by the unit tests; one browser assertion for it read
the Skills headings by mistake (script issue, not a site defect).

## 2b. Browser test — Compute Bazaar update and HorizonGuard (12 November 2026)

| Scenario                                                                                                                                                                                                               | Result |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Seven project sections in order: GateOrchestra first, HorizonGuard last; intro reads "Seven worlds"                                                                                                                    | Pass   |
| HorizonGuard detail opens with problem, why it matters, solution, architecture diagram, methodology, innovations, implementation status (implemented / research direction / limits) and GitHub link; no live-demo link | Pass   |
| Compute Bazaar detail shows the current results (78.0%, 0 of 40,000)                                                                                                                                                   | Pass   |
| An existing project (JOCKY) gets a detail view built from its own fields, with its live demo link                                                                                                                      | Pass   |
| Detail closes with Escape                                                                                                                                                                                              | Pass   |
| Phone 390 × 844: detail and page have no horizontal overflow                                                                                                                                                           | Pass   |
| No console errors or failed requests (desktop and phone)                                                                                                                                                               | Pass   |
| All GitHub repository links and the JOCKY demo return HTTP 200                                                                                                                                                         | Pass   |

## 3. Performance

### JavaScript (gzip)

| Chunk                     | Size         | When it loads          |
| ------------------------- | ------------ | ---------------------- |
| App shell (`index`) + CSS | 20 kB + 6 kB | Immediately            |
| Framer Motion             | 48 kB        | Immediately            |
| three.js                  | 182 kB       | With the canvas (lazy) |
| React Three Fiber + Drei  | 148 kB       | With the canvas (lazy) |
| Galaxy scene              | 32 kB        | With the canvas (lazy) |

GSAP and the 839 kB Rapier physics bundle were removed in Phase 16. NASA models: Hubble 398 kB, ISS 477 kB.

### Imagery downloaded per visit

| Quality      | Sky         | Planet maps | Total (approx.) |
| ------------ | ----------- | ----------- | --------------- |
| High         | 4K (1.5 MB) | 2K          | ≈ 4.0 MB        |
| Medium       | 2K (0.2 MB) | 2K          | ≈ 2.8 MB        |
| Low (phones) | 2K          | 1K          | ≈ 1.6 MB        |

Project screenshots (≈ 0.5 MB total) load lazily only when a panel opens.

### Runtime

- **Memory:** JS heap 17 MB after visiting every region and all six planets — no growth pattern observed. Geometries created in code are disposed on unmount; textures are cached and shared by drei's loader.
- **Frame rate:** 6–7 fps in the headless software renderer (no GPU available in the test environment). This is not representative of real devices; on any GPU the scene uses instancing (asteroids: one draw call), a single shadow-casting light, adaptive resolution (`PerformanceMonitor` lowers pixel ratio when frames drop) and no bloom on low quality. A real-device check on desktop and phone is recommended after deployment.

## 4. Known limitations

- No real-GPU frame-rate measurement in this environment (see above).
- Contact form delivery cannot be tested end to end until `VITE_WEB3FORMS_KEY` is configured.
- Certificate verification links and resume download await Muzra's input (`docs/MISSING_INFORMATION.md`).
- `npm audit` reports a moderate advisory in a development-only lint dependency; nothing shipped to visitors is affected.
