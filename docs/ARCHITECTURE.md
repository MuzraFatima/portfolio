# Architecture

## The big picture

The portfolio is **one scrolling page laid over one 3D world**.

```
┌──────────────────────────── browser window ────────────────────────────┐
│  Fixed WebGL canvas (React Three Fiber) — the galaxy, behind everything │
│  Side wash + edge fades (CSS gradients) — keep text readable            │
│  Scrolling HTML page — every section's text, straight on the galaxy     │
│  Fixed top bar, place title, progress line, résumé dialog               │
└─────────────────────────────────────────────────────────────────────────┘
```

- **The page is the content.** Every word is ordinary, semantic HTML in normal document flow, so it is
  readable, selectable, searchable and accessible without the 3D scene. With no WebGL, the same page is
  shown over a still photograph of the Milky Way.
- **Scrolling is the only control.** `src/journey/progress.ts` measures where each section sits and turns
  the scroll position into a journey value from 0 (first stop) to 12 (last stop). The camera reads that
  value every frame. There are no modes, toggles or settings.
- **One camera path.** `src/journey/stops.ts` lists the 13 stops in page order, each with a camera
  position, a look-at target and the side its text sits on. `JourneyCamera` threads a centripetal
  Catmull-Rom spline through the camera positions and another through the targets.

## Folders

| Folder                       | Contents                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/journey/`               | The journey: world layout, stops, scroll mapping, page sections and fixed interface                 |
| `src/journey/sections/`      | Hero, About, Skills, Projects (intro + one section per planet), Achievements, Certificates, Contact |
| `src/journey/ui/`            | Section/kicker/label typography, scroll-linked `Reveal`, top bar, place title, progress, washes     |
| `src/camera/`                | `JourneyCamera` — scroll-driven flight along the path                                               |
| `src/scenes/`                | Canvas, scene root, project solar system, non-planet places                                         |
| `src/components/galaxy/`     | Sky, stars, dust, star, asteroid belt, rings, constellation, particle nebulae, bloom                |
| `src/components/planets/`    | Realistic planet (surface, clouds, night lights, atmosphere, rings) and moons                       |
| `src/components/spacecraft/` | NASA Hubble and ISS models, small satellites                                                        |
| `src/components/characters/` | The astronaut                                                                                       |
| `src/components/resume/`     | Résumé dialog and button                                                                            |
| `src/data/`                  | All content: profile, projects, skills, achievements, certificates, résumé                          |
| `src/physics/`               | Orbit maths, damping and springs                                                                    |

## Key decisions

- **Camera rests while text is read.** Between two stops the journey value is eased with a hold at each
  end (`progressAt`), so the camera settles on a subject for the middle of its section and travels in
  between. The camera then damps toward that value, so fast scrolling still looks like flight.
- **Framing instead of overlap.** Each stop names a text side. The camera shifts its frame sideways with
  `filmOffset` so the subject sits on the other side, and a soft gradient darkens only the text side.
- **Text moves with the scene.** `Reveal` ties each block's position and opacity to its own scroll
  progress (Framer Motion `useScroll`), at slightly different depths, so text drifts like layers in space.
- **Real images in 3D.** `ParticleNebula` samples a Hubble photograph's pixels and places particles in the
  photo's colours through depth, so nebulae and galaxies show true parallax instead of being flat cards.
- **Physical astronaut motion.** The astronaut follows the camera through an under-damped spring in camera
  space, faces its direction of flight, leans and banks with speed, and turns back to the viewer at rest.
- **Fixed planets.** Planets stay at fixed points on their orbits (spin, moons and satellites still move)
  so the path past them is stable and they are always where the text says they are.
- **Events from the page root.** The canvas ignores pointer events; R3F listens on `#root`, so text stays
  selectable and scrolling works everywhere, while planets can still be clicked to jump to their section.
- **Quality by device.** Screen size, CPU cores and memory pick high, medium or low budgets (pixel ratio,
  particle counts, sphere detail, texture resolution, bloom); `PerformanceMonitor` lowers resolution if
  frames drop.
- **Reduced motion.** With the operating-system setting on, the camera follows scroll without easing and
  all idle motion stops.
