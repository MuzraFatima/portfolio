# Asset License Register

Every third-party asset shipped with the portfolio is listed here with its source, licence, required
credit and optimisation. Nothing is committed before it is logged here. The same credits are shown to
visitors in the site's "Image credits" dialog.

Last updated: 5 November 2026.

## Space imagery (`public/assets/textures/space/`)

| File                                   | Subject                                                               | Source                                                                                                             | Credit (as required)                                | Licence / terms                                                                                                                   | Optimisation                           |
| -------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `milkyway-4k.webp`, `milkyway-2k.webp` | The Milky Way panorama (360° all-sky photograph)                      | [ESO eso0932a](https://www.eso.org/public/images/eso0932a/)                                                        | ESO/S. Brunier                                      | [CC BY 4.0](https://www.eso.org/public/copyright/)                                                                                | 6000×3000 JPEG → 4096 and 2048 px WebP |
| `carina-nebula.webp`                   | "Cosmic Cliffs", Carina Nebula (NGC 3324), James Webb Space Telescope | [NASA Image Library: carina_nebula](https://images.nasa.gov/details/carina_nebula)                                 | NASA, ESA, CSA, STScI                               | NASA media guidelines: not copyrighted; credit requested ([guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/)) | 1920 px JPEG → 1600 px WebP            |
| `helix-nebula.webp`                    | NGC 7293, the Helix Nebula                                            | [NASA Image Library: PIA15658](https://images.nasa.gov/details/PIA15658)                                           | NASA/JPL-Caltech                                    | [JPL image use policy](https://www.jpl.nasa.gov/jpl-image-use-policy): free use with credit                                       | 2920 px JPEG → 1400 px WebP            |
| `pillars-of-creation.webp`             | Pillars of Creation, Eagle Nebula (Hubble, high definition)           | [NASA Image Library: GSFC_20171208_Archive_e000842](https://images.nasa.gov/details/GSFC_20171208_Archive_e000842) | NASA, ESA and the Hubble Heritage Team (STScI/AURA) | NASA media guidelines: not copyrighted; credit requested                                                                          | 3249 px JPEG (13 MB) → 1400 px WebP    |
| `sombrero-galaxy.webp`                 | Messier 104, the Sombrero Galaxy (Hubble)                             | [NASA Image Library: PIA15226](https://images.nasa.gov/details/PIA15226)                                           | NASA/STScI/AURA                                     | NASA media guidelines: not copyrighted; credit requested                                                                          | 3000 px JPEG → 1400 px WebP            |
| `whirlpool-galaxy.webp`                | Messier 51, the Whirlpool Galaxy (Hubble)                             | [NASA Image Library: PIA04230](https://images.nasa.gov/details/PIA04230)                                           | NASA and The Hubble Heritage Team (STScI/AURA)      | NASA media guidelines: not copyrighted; credit requested                                                                          | Original size, WebP                    |
| `webb-deep-field.webp`                 | Webb's First Deep Field, SMACS 0723                                   | [NASA Image Library: webb_first_deep_field](https://images.nasa.gov/details/webb_first_deep_field)                 | NASA, ESA, CSA, STScI                               | NASA media guidelines: not copyrighted; credit requested                                                                          | 1920 px JPEG → 1200 px WebP            |

## Planet and star surface maps (`public/assets/textures/planets/`)

All from [Solar System Scope textures](https://www.solarsystemscope.com/textures/), which are based on
NASA mission imagery and elevation data and released under **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**.
Required credit: **"Textures: Solar System Scope (solarsystemscope.com), CC BY 4.0"**.

| File(s)                                                                           | Original                                | Used for                                                          | Optimisation            |
| --------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- | ----------------------- |
| `sun-2k/1k.webp`                                                                  | 2k_sun.jpg                              | Central Star                                                      | 2048 and 1024 px WebP   |
| `neptune-2k/1k.webp`                                                              | 2k_neptune.jpg                          | GateOrchestra planet                                              | 2048 and 1024 px WebP   |
| `uranus-2k/1k.webp`                                                               | 2k_uranus.jpg                           | WhoToTrust planet                                                 | 2048 and 1024 px WebP   |
| `earth-daymap-2k/1k.webp`, `earth-nightmap-2k/1k.webp`, `earth-clouds-2k/1k.webp` | 2k_earth_daymap / nightmap / clouds.jpg | NeuroLens planet; clouds also reused for WhoToTrust's cloud layer | 2048 and 1024 px WebP   |
| `venus-atmosphere-2k/1k.webp`                                                     | 2k_venus_atmosphere.jpg                 | Cost-Aware Agent Router planet                                    | 2048 and 1024 px WebP   |
| `jupiter-2k/1k.webp`                                                              | 2k_jupiter.jpg                          | Compute Bazaar planet                                             | 2048 and 1024 px WebP   |
| `mars-2k/1k.webp`                                                                 | 2k_mars.jpg                             | JOCKY Forensics planet                                            | 2048 and 1024 px WebP   |
| `moon-2k/1k.webp`, `mercury-2k/1k.webp`                                           | 2k_moon.jpg, 2k_mercury.jpg             | Moons and asteroid surfaces                                       | 2048 and 1024 px WebP   |
| `ring-alpha.webp`                                                                 | 2k_saturn_ring_alpha.png                | Planetary rings                                                   | 1024 px WebP with alpha |

## 3D models (`public/assets/models/`)

| File            | Model     | Source                                                                                                                                     | Credit (as required)       | Licence                                                   | Optimisation                                                                            |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `astronaut.glb` | Astronaut | [Google model-viewer shared assets](https://github.com/google/model-viewer/tree/master/packages/shared-assets) (originally Poly by Google) | "Astronaut" by Poly, CC BY | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | 2.87 MB → 212 KB (texture resized to 1024 px and converted to WebP with glTF-Transform) |

The model is a single unrigged mesh, so its idle, floating, head-turn, wave and pointing motions are
whole-body procedural animations written for this site.

## Project screenshots (`public/assets/images/projects/`)

Screenshots from Muzra Fatima's own MIT-licensed repositories (WhoToTrust, NeuroLens, Cost-aware-agent,
Compute-bazar), resized to 1200 px WebP. GateOrchestra screenshots are not used until the team agrees,
and JOCKY Forensics has none in its repository.

## Fonts

| Font                 | Source       | Licence                   |
| -------------------- | ------------ | ------------------------- |
| Space Grotesk, Inter | Google Fonts | SIL Open Font License 1.1 |

## Original work (no licence needed)

- Favicon (`public/favicon.svg`)
- All code, shaders, atmosphere glows, lens flares and procedural particles
- Ambient pad, flight whoosh and interface sounds (all synthesised at runtime with the Web Audio API — no audio files)

## Rules for adding assets

1. Use only public-domain, CC0, CC BY or similarly permissive sources; record the exact credit line.
2. Never use NASA logos or insignia, and never imply NASA, ESA or ESO endorsement.
3. Convert to WebP (or KTX2 for very large textures) and provide a lighter variant for low-quality mode.
4. Add the row to this file in the same commit as the asset.
