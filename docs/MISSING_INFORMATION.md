# Missing Information

Things the portfolio cannot show accurately until Muzra supplies or confirms them. Nothing below is
invented in the meantime — the site simply leaves the field out.

| #   | Item                                                            | Why it matters                                                                                  | What to send                                                                                                  |
| --- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Certificate dates, credential IDs, verification URLs and images | Certificate Observatory can only show name + issuer                                             | Any of these per certificate; images go in `public/certificates/`                                             |
| 2   | Contact form service                                            | Blueprint requires real submissions, never fake success                                         | A free Web3Forms access key (or Formspree form ID) — added as `VITE_WEB3FORMS_KEY` in Vercel, never committed |
| 3   | Permission to publish the resume PDF                            | It contains a phone number; git history is permanent                                            | "Yes, publish as is", or a copy without the phone number                                                      |
| 4   | Vercel account                                                  | Deployment in Phase 15                                                                          | Sign in at vercel.com with GitHub and import the repo (exact clicks will be given)                            |
| 5   | GateOrchestra screenshot permission                             | The team repo has no licence                                                                    | Confirmation that the team is fine with screenshots appearing on the portfolio                                |
| 6   | JOCKY Forensics screenshots                                     | The repo has none; the planet panel would be text-only                                          | 2–3 screenshots of the live demo, or permission to capture them                                               |
| 7   | CAAR benchmark figures                                          | Resume says 20 queries / 100% / 84.9%; the repo now says 38 queries / 57.9% / 85.3% (mock mode) | The site uses the current repo figures with the mock-mode caveat unless told otherwise                        |
| 8   | Publication link                                                | HBRP paper has no URL or DOI yet                                                                | DOI or journal page link                                                                                      |
| 9   | LinkedIn details                                                | LinkedIn blocks automated reading                                                               | Nothing required — resume was used instead                                                                    |

## Resolved during the audit

- **Hackathon:** confirmed by the resume — Winner, SIH 2026 Internal Hackathon, for JOCKY Forensics.
- **Email:** `muzrafatima@gmail.com` is public on the GitHub profile and on the resume.
- **NeuroLens scope:** it is an interpretability project (TopoCircuit-SAE), not computer vision.
