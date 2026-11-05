# Architecture

## The big picture

The site is two layers stacked on top of each other:

```text
┌──────────────────────────────────────────────┐
│  HTML interface (React + Tailwind)           │  ← navigation, panels, all text content
│  always readable, keyboard and screen-reader │
├──────────────────────────────────────────────┤
│  One WebGL canvas (React Three Fiber)        │  ← the galaxy: star, planets, nebula…
│  lazy-loaded, decorative, can fail safely    │
└──────────────────────────────────────────────┘
            ▲                     ▲
            └──── Zustand store ──┘   ← single source of truth for both layers
```

- **All professional information lives in the HTML layer.** A recruiter never has to fly a camera to read a project; the 3D layer is the experience, not the container.
- **The canvas is created once.** Regions are places in one world, so moving between them only moves the camera — nothing reloads.
- **Content is data.** Everything shown comes from typed files in `src/data/`, checked against the audit in `docs/PROJECT_AUDIT.md`.

## Folders

| Folder            | Purpose                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Application shell (`App.tsx`)                                                                                     |
| `src/scenes/`     | The canvas and the root scene that composes the regions                                                           |
| `src/components/` | Reusable pieces, grouped: `galaxy`, `planets`, `characters`, `spacecraft`, `navigation`, `panels`, `ui`, `shared` |
| `src/camera/`     | Camera rig and flight paths                                                                                       |
| `src/animations/` | GSAP timelines                                                                                                    |
| `src/physics/`    | Orbital maths and the few Rapier interactions                                                                     |
| `src/hooks/`      | Shared React hooks                                                                                                |
| `src/store/`      | Zustand store                                                                                                     |
| `src/data/`       | Profile, projects, skills, achievements, certificates, regions                                                    |
| `src/types/`      | Content types                                                                                                     |
| `src/utils/`      | Device detection and quality profiles                                                                             |
| `src/services/`   | External services (contact form submission)                                                                       |
| `src/styles/`     | Tailwind theme tokens and global CSS                                                                              |

## Key decisions

| Decision                                          | Why                                                                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React 19 + TypeScript + Vite 6**                | Typed components, fast builds, first-class support in React Three Fiber 9.                                                                         |
| **One persistent canvas**                         | Rebuilding a WebGL scene on every navigation is slow and leaks GPU memory.                                                                         |
| **Canvas is lazy-loaded**                         | The name, headline and navigation paint before the ~300 kB (gzip) 3D bundle arrives.                                                               |
| **Error boundary around the canvas**              | If WebGL crashes, visitors see a short notice and every section still works.                                                                       |
| **WebGL detection**                               | No WebGL means no canvas at all — the HTML interface carries the whole site.                                                                       |
| **Zustand store**                                 | Camera, scene and panels read the same `region` / `selectedProject` values, so they cannot disagree.                                               |
| **Preferences persisted, audio never**            | Quality, reduced motion and guide choice are remembered; sound always waits for a new click.                                                       |
| **Quality profiles (high / medium / low / auto)** | Star counts, particle counts, geometry detail and pixel ratio scale with the device; `PerformanceMonitor` lowers resolution when frame rate drops. |
| **Procedural 3D assets**                          | No licence risk and a tiny download (see `docs/ASSET_DISCOVERY.md`).                                                                               |
| **Animation ownership**                           | GSAP owns the camera and scene timelines; Framer Motion owns HTML panels and buttons. They never animate the same property.                        |

## Data flow for a planet click

1. The planet's `onClick` calls `selectProject(id)` in the store.
2. The camera rig sees `selectedProject` change and flies to that planet (GSAP).
3. The project panel sees the same value and slides in (Framer Motion).
4. "Back to system" calls `selectProject(null)`; both layers return together.
