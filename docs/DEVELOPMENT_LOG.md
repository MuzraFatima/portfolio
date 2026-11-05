# Development Log

A running record of each phase: what was done, what was checked and what is still open.

## Phase 0 — Repository foundation

**Objective:** Prepare a clean repository with automated quality checks before any feature work.

**Work completed**

- Git repository connected to `MuzraFatima/portfolio`. Day-to-day work happens on `master`; each finished phase is merged into `main` through a pull request.
- React 19 + TypeScript + Vite 6 scaffold with a `@/` import alias.
- ESLint (TypeScript, React Hooks, JSX accessibility rules) and Prettier, with zero warnings allowed.
- GitHub Actions workflow that runs format check, lint, typecheck and a production build on every pull request to `main`.
- `.gitattributes` and `.editorconfig` so Windows line endings never break the format check in CI.

**Checks run locally**

| Check                  | Result |
| ---------------------- | ------ |
| `npm run format:check` | Pass   |
| `npm run lint`         | Pass   |
| `npm run typecheck`    | Pass   |
| `npm run build`        | Pass   |

**Open items:** none.

**Next:** Phase 01 — repository audit and research.

## Phase 01 — Repository audit and research

**Objective:** Establish verified facts about every project, credential and asset before building anything.

**Work completed**

- Audited all six repositories through the GitHub API: README, file tree, languages, contributors and, for the team project, every pull request.
- Confirmed Muzra's GateOrchestra contribution from her six merged PRs (agent layer, evaluation pipeline, analysis).
- Reconciled the blueprint with the repositories and the supplied resume.

**Deliverables:** `PROJECT_AUDIT.md`, `PROJECT_CONTENT.json`, `CERTIFICATE_AUDIT.md`, `MISSING_INFORMATION.md`, `ASSET_DISCOVERY.md`.

**Key findings**

- NeuroLens is a sparse-autoencoder interpretability study (TopoCircuit-SAE), not a vision project.
- WhoToTrust covers images and text, not only ChaosNLI.
- Only JOCKY Forensics has a live demo; it was reachable on the audit date.
- The SIH 2026 internal hackathon win is confirmed by the resume as being for JOCKY Forensics.
- LinkedIn cannot be read automatically; the resume was used instead.

**Checkpoint:** All six descriptions and repository links are verified; missing information is listed. **Passed.**

**Next:** Phase 02 — technical architecture.

## Phase 02 — Technical architecture

**Objective:** A stable foundation: dependencies, state, data, a shared 3D canvas and safe failure modes.

**Work completed**

- Added three.js, React Three Fiber 9, Drei 10, Zustand 5, GSAP 3, Framer Motion 12 and Tailwind CSS 4.
- Deep-space design tokens and typography (Space Grotesk, Inter).
- Typed content files for profile, projects, skills, achievements, certificates and regions.
- Zustand store for region, selected planet, explore mode, intro state and persisted preferences.
- Device-based quality profiles (high / medium / low) with a manual override.
- One persistent, lazy-loaded canvas with adaptive resolution, an error boundary, WebGL detection and a skippable loading screen.
- `docs/ARCHITECTURE.md`.

**Dependencies installed:** `three`, `@react-three/fiber`, `@react-three/drei`, `zustand`, `gsap`, `framer-motion`, `tailwindcss`, `@tailwindcss/vite`, `@types/three`.

**Checks**

| Check                               | Result                            |
| ----------------------------------- | --------------------------------- |
| Typecheck, lint, format             | Pass                              |
| Production build                    | Pass                              |
| Headless Chrome render of the build | Canvas renders, no console errors |

**Known limitations:** `npm audit` reports a moderate advisory in a dev-only dependency of `typescript-eslint` (not shipped to visitors). Career goals in `src/data/profile.ts` are drawn from the resume summary and GitHub profile — Muzra should confirm the wording.

**Checkpoint:** The app starts and displays a functioning 3D canvas. **Passed.**

**Next:** Phase 03 — galaxy environment.

## Phase 03 — Galaxy environment (realistic imagery)

**Objective:** Build the universe — now using real astronomical imagery, per Muzra's added visual requirement.

**Work completed**

- 360° sky from ESO's Milky Way photograph (4K on high quality, 2K otherwise).
- Real NASA Hubble and Webb photographs (Carina "Cosmic Cliffs", Helix, Pillars of Creation, Webb Deep Field, Sombrero, Whirlpool) placed at depth as soft-edged billboards behind their regions.
- Foreground stars coloured by spectral class, with twinkle, for parallax; fine drifting space dust.
- Central star with a real solar surface map, animated corona and a shadow-casting light.
- Instanced asteroid belt textured with real lunar surface imagery (up to 2,600 rocks in one draw call).
- Reusable `Planet` (surface map, clouds, sunlit-side atmosphere, rings, moons as children) and `PlanetaryRings` using a real ring-brightness profile.
- Bloom and vignette on medium/high quality only.
- All assets optimised to WebP and recorded in `docs/ASSET_LICENSES.md`.

**Checks:** typecheck, lint, format, build pass; headless Chrome render shows the full environment with no console errors.

**Checkpoint:** A complete galaxy is visible with convincing depth and lighting. **Passed.**

**Next:** Phase 04 — planets and 3D objects.
