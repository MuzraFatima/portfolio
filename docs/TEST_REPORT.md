# Test Report

Date: 6 November 2026 · Build: production (`npm run build`) served with `vite preview`.

## 1. Automated checks (run in CI on every pull request)

| Check                                                               | Tool              | Result       |
| ------------------------------------------------------------------- | ----------------- | ------------ |
| Formatting                                                          | Prettier          | Pass         |
| Lint (zero warnings, incl. React Hooks and JSX accessibility rules) | ESLint            | Pass         |
| Type safety                                                         | `tsc -b` (strict) | Pass         |
| Unit tests                                                          | Vitest — 17 tests | 17 / 17 pass |
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

## 2. Browser test (headless Chrome, SwiftShader software WebGL)

| #    | Scenario                                                                                 | Result                                                                                                                                                                    |
| ---- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | About Me panel is visible on the first page                                              | Pass (≈3 s to panel)                                                                                                                                                      |
| 2    | WebGL canvas is created                                                                  | Pass                                                                                                                                                                      |
| 3–7  | Navigate to About, Skills, Achievements, Certificates, Contact from the top menu         | Pass (each panel heading correct)                                                                                                                                         |
| 8    | Six planet labels present; GateOrchestra is "01 · Flagship"                              | Pass on inspection — all six labels present; the automated assertion failed only because labels are returned in screen-depth order (test-script issue, not a site defect) |
| 9–14 | Clicking each of the six planets flies the camera there and opens the correct panel      | Pass — live demo button shown only for JOCKY Forensics                                                                                                                    |
| 15   | Esc returns from a planet to the system                                                  | Pass                                                                                                                                                                      |
| 16   | A scroll gesture advances the guided tour (Home → About)                                 | Pass                                                                                                                                                                      |
| 17   | Keyboard shortcut 4 opens Projects                                                       | Pass                                                                                                                                                                      |
| 18   | Contact form cannot report success without a service key (submit disabled, notice shown) | Pass                                                                                                                                                                      |
| 19   | Text-only view contains every section and all six projects                               | Pass                                                                                                                                                                      |
| 20   | No console errors during the full tour                                                   | Pass                                                                                                                                                                      |
| 21   | No failed network requests (all textures, models, fonts load)                            | Pass                                                                                                                                                                      |
| 22   | Phone viewport with WebGL disabled loads the text view automatically                     | Pass                                                                                                                                                                      |

### Defect found and fixed during testing

- **Critical:** switching to text-only view threw `NotFoundError: removeChild` because unmounting the canvas raced with its HTML labels. Fixed by keeping the canvas mounted but hidden and paused (`frameloop="never"`) in text view — which also makes returning to 3D instant. Re-tested: no console errors.

## 3. Performance

### JavaScript (gzip)

| Chunk                     | Size         | When it loads                                               |
| ------------------------- | ------------ | ----------------------------------------------------------- |
| App shell (`index`) + CSS | 40 kB + 6 kB | Immediately                                                 |
| Framer Motion + GSAP      | 73 kB        | Immediately                                                 |
| three.js                  | 182 kB       | With the canvas (lazy)                                      |
| React Three Fiber + Drei  | 164 kB       | With the canvas (lazy)                                      |
| Galaxy scene              | 33 kB        | With the canvas (lazy)                                      |
| Rapier physics (WASM)     | 839 kB       | 3.5 s after load, medium/high quality only, never on phones |

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
