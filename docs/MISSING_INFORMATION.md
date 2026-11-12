# Missing Information

Things the portfolio cannot show accurately until Muzra supplies or confirms them. Nothing below is
invented in the meantime — the site simply leaves the field out.

| #   | Item                                                            | Why it matters                                                                                                        | What to send                                                                                                  |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Certificate dates, credential IDs, verification URLs and images | Certificate Observatory can only show name + issuer                                                                   | Any of these per certificate; images go in `public/certificates/`                                             |
| 2   | Contact form service                                            | Blueprint requires real submissions, never fake success                                                               | A free Web3Forms access key (or Formspree form ID) — added as `VITE_WEB3FORMS_KEY` in Vercel, never committed |
| 3   | Phone number on the résumé                                      | The résumé is now shown as text on the site, without the phone number                                                 | Say so if the phone number should be shown as well                                                            |
| 5   | GateOrchestra screenshot permission                             | The team repo has no licence                                                                                          | Confirmation that the team is fine with screenshots appearing on the portfolio                                |
| 6   | JOCKY Forensics screenshots                                     | The repo has none; the planet panel would be text-only                                                                | 2–3 screenshots of the live demo, or permission to capture them                                               |
| 7   | CAAR benchmark figures                                          | Resume says 20 queries / 100% / 84.9%; the repo now says 38 queries / 57.9% / 85.3% (mock mode)                       | The site uses the current repo figures with the mock-mode caveat unless told otherwise                        |
| 8   | Publication link                                                | HBRP paper has no URL or DOI yet                                                                                      | DOI or journal page link                                                                                      |
| 9   | LinkedIn details                                                | LinkedIn blocks automated reading                                                                                     | Nothing required — resume was used instead                                                                    |
| 10  | Résumé text for Compute Bazaar                                  | The résumé on the site is transcribed from the PDF and still quotes the older 25-round result (38% above round-robin) | An updated résumé PDF, or approval to update that line in the résumé text                                     |
| 11  | Demos for Compute Bazaar and HorizonGuard                       | Neither has a public deployment; both dashboards run locally                                                          | A deployment URL for either, if one is published                                                              |

## Resolved during the audit

- **Hackathon:** confirmed by the resume — Winner, SIH 2026 Internal Hackathon, for JOCKY Forensics.
- **Email:** `muzrafatima@gmail.com` is public on the GitHub profile and on the resume.
- **Vercel:** connected; the site is live at https://muzraporfolio.vercel.app/ and every merge to `main` deploys.
- **Résumé:** shown as selectable, printable text from the "Résumé" link (phone number left out).
- **NeuroLens scope:** it is an interpretability project (TopoCircuit-SAE), not computer vision.
