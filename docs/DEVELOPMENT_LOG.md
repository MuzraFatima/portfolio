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

## Phase 04 — Planets and 3D objects

**Work completed**

- Six project planets in blueprint order, each built from a real planetary surface map graded to its palette: GateOrchestra (Neptune map, violet atmosphere, rings, two moons, four agent satellites), WhoToTrust (Uranus map with white cloud bands and faint rings), NeuroLens (Earth map with clouds and an emerald-cyan atmosphere), CAAR (Venus cloud tops in gold), Compute Bazaar (Jupiter with four moons), JOCKY Forensics (Mars with two small moons).
- Sunlit-side atmospheres, cloud layers, ring systems and shadow casting from the central star.
- Generous invisible hit areas, hover highlighting of planet and orbit path, and label buttons for keyboard access.
- Region landmarks: Skill Nebula constellation (one star per skill category), Achievement Constellation, a Hubble-style observatory and a modular space station with a rotating habitat ring.

**Checks:** typecheck, lint, build pass; headless Chrome render shows all planets, orbits, belt and labels with no console errors.

**Checkpoint:** All major locations are identifiable and selectable; planets are distinct real-world-looking worlds. **Passed.**

## Phase 05 — Physics and motion

**Work completed**

- Closed-form circular orbits with Kepler-style periods (period ∝ r^1.5) for planets; moons and satellites on their own local orbits — perfectly stable over any session length.
- `Spring` and `damp` utilities for inertia, acceleration/deceleration and spring-like settling.
- Pointer parallax with inertia on two depth layers (foreground dust sways more than distant stars).
- Rapier used only where it adds something: a zero-gravity debris cluster visitors can flick; rocks collide, spin, slow under damping and are pulled home by a weak spring.
- Rapier's WebAssembly bundle is lazy-loaded 3.5 s after start and never on low quality.
- All motion stops under reduced-motion preference.

**Checks:** typecheck, lint, build; headless render with no console errors.

**Known limitation:** the Rapier chunk is large (~840 kB gzip); it is deferred and optional.

**Checkpoint:** Motion is stable and smooth without unnecessary simulation cost. **Passed.**

## Phase 06 — Astronaut guide and About-first landing

**Work completed**

- Licensed astronaut model (CC BY 2.0), compressed 2.87 MB → 212 KB.
- Procedural animation states (the model has no rig): zero-gravity idle float, pointer-following head/body turn with spring inertia, wave gesture on arrival or click, and pointing toward the region the guide suggests.
- The astronaut follows the camera with lag (feels like it has mass), sits beside the About panel on the landing view and moves to a small corner position elsewhere so it never covers content.
- Guide speech bubble with region-specific messages, "Start the tour", "Explore freely" and "Hide guide". Hiding the guide removes the astronaut too; the choice is remembered.
- At Muzra's request, the first page now opens with an About Me panel (summary, studies, location, interests, links) beside the astronaut.

**Checks:** typecheck, lint, build; headless render shows the About panel, lit astronaut and guide with no console errors.

**Checkpoint:** Character animations work and guidance can be disabled. **Passed.**

## Phase 07 — Camera and navigation

**Work completed**

- `CameraRig`: GSAP-driven flights (one animation system owns the camera) with an arc over long trips; camera-controls for orbit and zoom between flights; follows a selected planet along its orbit; shifts the view so the planet stays visible beside the panel.
- Guided mode (camera locked to the tour) and Free mode (drag to orbit, scroll to zoom); input is disabled mid-flight.
- Top navigation with every region, mode switch and settings (quality, reduced motion, guide, text-only view); mobile menu.
- Keyboard: 1–7 jump to regions, ← → step through the tour, Esc goes back.
- Mini-map: top-down chart with one-click project and system navigation.
- Project panel with overview, problem, solution, architecture, features, contribution, technologies, repository link, live demo only where one exists, and previous / next planet.

**Checks:** typecheck, lint, build; headless Chrome: clicking a planet label flies to the planet and opens its panel; no console errors.

**Checkpoint:** All regions reachable; navigation always recovers to the solar system. **Passed.**

## Phase 08 — Animations and interactions

**Work completed**

- Cinematic intro: a six-second GSAP approach from deep space on first visit; 1.6 s on later visits; instant under reduced motion; "Skip intro" ends it at once.
- Scroll storytelling in guided mode: one wheel step or vertical swipe moves to the next/previous tour stop, with a cooldown; panels still scroll normally.
- Tour progress rail (Framer Motion) whose dots double as shortcuts.
- ScrollTrigger reveals of panel sections, scoped to the panel's own scroller.
- Spring-based hover swell on planets; orbit paths brighten on hover (Phase 04); pointer parallax (Phase 05).
- Animation ownership: GSAP owns the camera and in-panel reveals; Framer Motion owns panels, buttons and the progress rail; per-frame springs own 3D object motion. No property has two owners.

**Checks:** typecheck, lint, build; headless Chrome: a wheel event advances the tour from Home to About; no console errors.

**Checkpoint:** No abrupt transitions or conflicting animation controllers. **Passed.**

## Phase 09 — Portfolio content

**Work completed**

- Region panel system (left side, ScrollTrigger reveals, focus moved to the heading).
- About: summary, education (B.Tech with CGPA, Intermediate), interests, career goals, research publication, location.
- Skills: eight areas with resume-stated levels (no percentages) and links to the projects that use each area.
- Achievements: SIH 2026 Internal Hackathon win (linked to JOCKY Forensics) and the HBRP 2025 publication.
- Project panels now show real screenshots from the four MIT-licensed repositories.
- The camera shifts each region's landmark to the right of the screen so it is not hidden by the panel.

**Checks:** typecheck, lint, build; headless Chrome render of the Skills region; no console errors.

**Checkpoint:** All information is accurate, readable and linked correctly. **Passed.**

## Phase 10 — Certificate observatory

**Work completed**

- Gallery of all 15 certificates, filterable by issuer (Anthropic, AWS Academy, Cisco Networking Academy, freeCodeCamp, TASK).
- Only verified fields render. Issue date, credential ID, "Verify credential" and "View certificate" appear automatically once real values are added to `src/data/certificates.ts`; nothing is invented meanwhile.
- Accessible image preview dialog for when certificate images are supplied (`public/certificates/README.md` explains how).
- Fill lighting and less mirror-like materials so the observatory, station and satellites are readable far from the star.
- `vercel.json` added for deployment (Vite preset, SPA rewrite, asset caching, security headers).

**Checks:** typecheck, lint, build; headless render of the observatory; no console errors.

**Checkpoint:** Every displayed certificate comes from Muzra's own records; no fabricated IDs or links. **Passed** — verification links pending from Muzra.

## Phase 11 — Contact station

**Work completed**

- Direct links: verified email (`muzrafatima@gmail.com`), GitHub and LinkedIn.
- Contact form with field validation, accessible error messages, sending / delivered / failed states and a 15 s timeout.
- Real submission through Web3Forms. Success is shown only when the service returns `success: true`; any failure is shown as a failure.
- Spam protection: hidden honeypot field and a minimum fill time.
- Until `VITE_WEB3FORMS_KEY` is set in Vercel, the form is disabled and says so, pointing to email instead — it never pretends to send.
- Resume download intentionally withheld until Muzra confirms the PDF (which contains a phone number) may be published.

**Checks:** typecheck, lint, build.

**Checkpoint:** No fake success path exists; submissions are processed by a real service once the key is configured. **Passed** — key pending from Muzra.

## Phase 12 — Sound and atmosphere

**Work completed**

- Web Audio engine: slow evolving ambient pad (detuned sines, breathing low-pass, echo), filtered-noise whoosh on every camera flight, soft blip on planet selection.
- No audio files at all, so there is nothing to license (recorded in `docs/ASSET_LICENSES.md`).
- Sound is off on every visit; the AudioContext is created only inside the "Sound off/on" click; fades in and out smoothly; suspended when muted.

**Checks:** typecheck, lint, build.

**Checkpoint:** Audio controls work and nothing plays without a user action. **Passed.**

## Phase 13 — Responsive design and accessibility

**Work completed**

- Quality profiles (from Phase 02/03): high / medium / low with auto-detection and a manual override; low quality drops bloom, shadows, physics and halves particles and texture resolution.
- Phone layout: compact header (sound, settings and mode inside the menu), landing panel that scrolls within the viewport, guide bubble hidden below tablet width so it never covers content; panels go full-width on phones.
- Text-only view: the entire portfolio as one semantic page (headings, lists, articles). Opened from Settings, from the WebGL error notice, or automatically when WebGL is unavailable.
- Keyboard: skip link, every planet and region reachable by labelled buttons, 1–7 / ← → / Esc shortcuts, visible focus rings, focus moved into opened panels.
- Reduced motion: honours the OS setting at load and when it changes; a manual toggle in Settings.
- Contrast: light text on dark glass panels throughout.

**Checks:** typecheck, lint, build; headless Chrome at 390 × 844 shows a clean, scrollable landing view; no console errors.

**Checkpoint:** All professional sections are usable on desktop, tablet and phone. **Passed.**

## Phase 14 — Testing and optimisation

**Work completed**

- 17 Vitest unit tests (content honesty rules, orbit stability, form validation), added to CI.
- 24-step headless browser test of every navigation path, planet, panel, keyboard shortcut, scroll gesture, text view, no-WebGL fallback, console errors and failed requests.
- Fixed a critical `removeChild` crash when switching to text view.
- Measured bundle sizes, per-quality imagery weight and heap usage — see `docs/TEST_REPORT.md`.

**Checkpoint:** Production build succeeds; no critical errors or broken navigation remain. **Passed.**

## Phase 15 — Deployment and final delivery

**Work completed**

- Production configuration: `vercel.json` (Vite preset, SPA rewrite, asset caching, security headers) and `.env.example`.
- `README.md` rewritten for visitors and developers; `docs/DEPLOYMENT.md` with exact Vercel and Web3Forms steps.
- Documentation set complete: architecture, audit, asset licences, test report, development log, missing information.

**Status:** the production build passes all checks. The public URL will exist as soon as the repository
is imported into Vercel (one-minute step for Muzra, `docs/DEPLOYMENT.md` §1). The live site will then be
verified on desktop and phone.

**Checkpoint:** Ready to deploy. Public deployment **pending Vercel import by Muzra**.

## Phase 16 — Scroll journey redesign

Requested by Muzra after reviewing the first version, using another portfolio only as a reference for
scroll behaviour, typography and text placement.

**Work completed**

- Rebuilt the experience as one scrolling page over one 3D world: scrolling flies the camera along a single
  spline through 13 stops (home, about, skills, project overview, six planets, achievements, certificates,
  contact). The camera rests while a stop's text is read and frames the subject opposite the text.
- Text now sits directly on the galaxy with no cards or panels: large serif headings with italic accents,
  small spaced monospace labels and comfortable body text, each block drifting with the scroll.
- Removed the Guided/Free toggle, sound button, settings menu, mini-map, tour dots, guide bubble, loading
  screen, floating labels and text-only view. The page itself is the accessible version; without WebGL it is
  shown over a still Milky Way photograph.
- Replaced the flat Hubble pictures with particle nebulae sampled from the same photographs, giving real
  depth and parallax; the Whirlpool and Sombrero galaxies are particle disks far in the background.
- Swapped the hand-built telescope and station for NASA's Hubble and ISS models (NASA 3D Resources).
- Added night-side city lights to NeuroLens and surface relief to Mars and the moons.
- Rewrote the astronaut's motion: it travels with the camera on a spring, faces its direction of flight,
  leans and banks with speed, and turns back to the viewer and floats at each stop.
- Added the résumé as selectable, printable text in a dialog ("Résumé" link in the header, hero and contact),
  transcribed from the PDF without the phone number.
- Removed GSAP and Rapier, which the new design no longer uses.
- Tests: journey stop order, camera clearance, scroll-to-journey mapping, and a guard that the phone number
  never reaches the page.

## Phase 17 — Compute Bazaar update and HorizonGuard

**Work completed**

- Re-audited Compute Bazaar against its latest `main` and replaced the outdated description and 25-round
  benchmark with the current system: estimated-value mechanisms, agent-level VCG, XOR menus, adaptive bidding,
  scarcity pricing, learned predictor, trace-driven evaluation, with results and limitations from the README.
- Added HorizonGuard as world 07 after JOCKY Forensics, keeping the six blueprint projects in their order with
  GateOrchestra first. Implemented features and research directions are kept apart (`docs/PROJECT_AUDIT.md`).
- New planet for HorizonGuard: Saturn's surface map (Solar System Scope, CC BY 4.0) with rings, a moon and
  watch satellites, on the next orbit of the spiral, so the camera path continues past it.
- Optional `deepDive` data for projects and an "Explore project" detail view for every project: results,
  problem, why it matters, solution, an architecture pipeline diagram, AI/ML methodology, key innovations,
  implementation status, technologies and screenshots. Projects with a deep dive also show two headline
  results on the journey.
- Project counts on the page now follow the data instead of the fixed word "six".
- Fresh screenshots from both repositories; README, audit, asset licences, test report and missing
  information updated.

## Phase 18 — HorizonGuard second, GateOrchestra update

- HorizonGuard now follows GateOrchestra as world 02; the other projects keep their order. Its planet moved
  to the second orbit from the star and the others shifted outward, all clear of the asteroid belt.
- GateOrchestra re-audited: the final real-LLM benchmark is now complete and verified, so the site shows
  its results (97.9% vs 92.2% for Always-MAS at 33% fewer tokens), the unmet 40% goal, the larger-model
  reduced runs and the test-set caveats, plus a deep dive and the new chat assistant and Docker deployment.
  Muzra's credited contribution is unchanged (agent layer, August–September).
