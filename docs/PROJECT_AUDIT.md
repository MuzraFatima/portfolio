# Project Audit

Audit date: 5 November 2026. Every statement below was checked against the repository's README,
file tree, contributor list and (for GateOrchestra) pull-request history through the GitHub API.
Where the blueprint and the repository disagree, the repository wins.

| #   | Project                 | Repository                                                                      | Author(s)                       | Live demo                                                                                 |
| --- | ----------------------- | ------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| 01  | GateOrchestra           | [FarhanAaqil/GateOrchestra](https://github.com/FarhanAaqil/GateOrchestra)       | Team of 4 (Muzra: agent layer)  | None                                                                                      |
| 02  | WhoToTrust              | [MuzraFatima/WhoToTrust](https://github.com/MuzraFatima/WhoToTrust)             | Muzra Fatima (sole contributor) | None                                                                                      |
| 03  | NeuroLens               | [MuzraFatima/NeuroLens](https://github.com/MuzraFatima/NeuroLens)               | Muzra Fatima (sole contributor) | None (local explorer only)                                                                |
| 04  | Cost-Aware Agent Router | [MuzraFatima/Cost-aware-agent](https://github.com/MuzraFatima/Cost-aware-agent) | Muzra Fatima (sole contributor) | None                                                                                      |
| 05  | Compute Bazaar          | [MuzraFatima/Compute-bazar](https://github.com/MuzraFatima/Compute-bazar)       | Muzra Fatima (sole contributor) | None                                                                                      |
| 06  | JOCKY Forensics         | [MuzraFatima/jocky-forensics](https://github.com/MuzraFatima/jocky-forensics)   | Muzra Fatima (sole contributor) | [jocky-forensic.netlify.app](https://jocky-forensic.netlify.app) (HTTP 200 on audit date) |

---

## 01 — GateOrchestra (flagship)

**What it is:** A token-budget-calibrated gating layer placed in front of a multi-agent orchestrator.
A cheap CoT self-consistency probe runs first; a trained gate then decides from pre-execution signals
whether to **STOP** (return the probe answer) or **ESCALATE** to the full multi-agent system, capped at
`k × probe_tokens`.

**Confirmed in code**

- Probe agent with CoT self-consistency (3 samples) — `agents/probe_agent.py`
- MAS orchestrator with ReAct, Debate and Reflexion sub-agents — `agents/orchestrator/`
- LinUCB contextual-bandit router (optional; text heuristic is the benchmark default) — `agents/orchestrator/bandit_router.py`
- Learned gates (logistic regression, GBT, MLP), rule-based and random gates — `gate/`
- Token accounting with budgets enforced before each call — `shared/token_logger.py`
- Wilson confidence intervals and exact McNemar tests — `evaluation/metrics.py`
- FastAPI backend and React + TypeScript console with three.js scenes — `api/`, `frontend-react/`
- MASBench-mini dataset: 161 tasks (97 / 32 / 32)
- 542-test pytest suite, ~87% coverage (README)

**Results status (stated honestly by the repo):** there is no verified real-LLM result yet. The only
real run is a 5-task smoke test whose confidence intervals overlap completely. The portfolio must not
quote the simulated "78% savings" figure.

**Muzra's contribution (verified from her merged PRs #4, #8, #14, #22, #27, #29 — branch `person2-agent`)**

- Implemented the CoT-SC probe agent and its tests (PR #4)
- Implemented the MAS orchestrator, ReAct / Debate / Reflexion sub-agents and the Always-MAS and CoT-SC baselines (PR #4)
- Added the LinUCB contextual bandit router, sequential early exit and semantic soft voting (PR #8)
- Added the Groq cloud provider with Ollama local fallback (PR #8)
- Retrained the GBT gate on real Groq traces, added 429 back-off and better answer extraction (PR #14)
- Added LinUCB online reward updates, bandit state persistence and end-to-end Probe → Gate → MAS tests (PR #22)
- Built the batch evaluation pipeline, LinUCB warm-start and strategy-allocation metrics (PR #27)
- Wrote the agent performance and error analysis modules and experiment reports (PR #29)

**Team:** FarhanAaqil (repository owner), umaruddinmsheikh (dataset), Kounainsanalliyakhan (evaluation / dashboard), MuzraFatima (agents).

**Visual assets:** `docs/screenshots/` (5 console screenshots), `reports/figures/` (Pareto plots). The repo has no LICENSE file, so screenshots should be used only with the team's agreement.

---

## 02 — WhoToTrust

**What it is:** A method (**LabelTriage**) that decides vote by vote whether an annotator disagreement is
an error or genuine ambiguity, then trains on each differently.

**Blueprint correction:** the blueprint describes a ChaosNLI pipeline. The repository uses ChaosNLI **and**
CIFAR-10H (images), with VariErr NLI as a transfer test.

**Confirmed in code**

- **AmbiNoise** benchmark: real many-annotator votes with injected spammer, swap, lazy and plausible-wrong errors
- Five evidence groups per vote (vote split, annotator reliability, frozen-model plausibility, neighbours, probe learning)
- Calibrated out-of-fold p(error) and a three-way router (clear → hard label, ambiguous → soft, unreliable → down-weighted)
- Harm analysis via counterfactual retraining
- React (Vite) explorer over a Python API
- 219 pytest tests, Vitest unit tests, Chrome end-to-end tests; MIT licence

**Headline (laptop edition, validation data, mean of 3 seeds):** on images LabelTriage beats majority
vote and soft labels for every error type and lands within ~1 point of the oracle; on text the clear
gain is +9 points for lazy errors. The repo states these are indicative, not confirmatory.

**Visual assets:** 6 screenshots in `docs/screenshots/` (MIT).

---

## 03 — NeuroLens (repository title: TopoCircuit-SAE)

**Blueprint correction — important:** the blueprint calls this "AI-powered vision and intelligent analysis".
The repository is **not** a vision project. It is a mechanistic-interpretability study: measuring
multi-parent feature absorption in sparse autoencoders and testing whether frequency-ordered DAG routing
reduces it. The portfolio will describe it accurately and keep the name NeuroLens with the repo title shown.

**Confirmed in code**

- **MPAbs** benchmark: three parents per token (letter, WordNet category, case) on real Pythia-70M activations
- **DR-SAE**: an SAE that learns an acyclic parent graph and routes child activations to ancestors
- Synthetic tier with known ground truth and a test of Proposition 2
- Circuit test on subject–verb agreement
- Seven SAE variants compared (BatchTopK, Matryoshka, tree prior, AG-SAE-lite, post-hoc DR, DR-SAE ×2)
- Pre-registered hypotheses, reported honestly: H1 not supported, H2 and H3 falsified, H4 not supported
- Exploratory finding: DR-SAE leaves a parent latent silent 37% less often than Matryoshka at matched effective L0
- Runs on CPU; LaTeX paper source; interactive local explorer; MIT licence

**Visual assets:** 4 explorer screenshots in `demo/screenshots/`, 5 result figures in `results/figures/` (MIT).

---

## 04 — Cost-Aware Agent Router (CAAR)

**What it is:** A confidence-based multi-tier LLM router that starts each query at the cheapest capable tier
and escalates only when confidence is insufficient.

**Confirmed in code (blueprint items verified)**

- Complexity pre-classification — `backend/app/core/router_engine.py` ✔
- Confidence evaluation: syntactic checks (JSON / Python) plus semantic hedging detection — `core/confidence.py` ✔
- Four routing tiers: Cheap → RAG → Frontier → Consensus — `backend/app/agents/` ✔
- Token / cost tracking — `utils/cost_tracker.py` ✔
- Latency tracking per execution step ✔
- FastAPI + SQLite / SQLAlchemy persistence, LiteLLM client, offline mock mode, dashboard SPA, benchmark harness

**Results (mock mode, 38 queries, 3 runs):** 57.9% accuracy at 85.3% lower cost than the Tier-4
consensus baseline. The repo itself states mock mode validates routing and cost accounting, **not** real
accuracy — the portfolio must repeat that caveat if it quotes the number.

**Visual assets:** 3 dashboard screenshots and a Pareto plot in `docs/` (MIT).

---

## 05 — Compute Bazaar

**What it is:** A multi-agent compute marketplace that solves allocation as a combinatorial winner-determination
problem (binary ILP via PuLP / CBC) with VCG Clarke-pivot pricing.

**Confirmed in code (blueprint items verified)**

- Agent bidding: four agent classes (Coding, Research, Data, Analysis) with optional Groq LLM reasoning ✔
- Combinatorial auctions over atomic resource bundles ✔
- Compute allocation maximising social welfare under capacity limits ✔
- Optimisation: ILP solver, VCG pricing, adaptive bidding, scarcity pricing ✔
- Jain fairness tracking and anti-starvation, agent memory, resource predictor (historical averaging)
- FastAPI with JWT / API-key auth, WebSocket live feed, Chart.js dashboard, Docker

**Results (25 rounds, seed 42, simulated agents):** highest social welfare ($7,647 vs $7,363 greedy) and
utilisation (87.2%) of five schedulers, with lower fairness than round-robin and ~272 ms solve time.
Agents and valuations are synthetic.

**Visual assets:** 4 dashboard screenshots in `docs/screenshots/` (MIT).

---

## 06 — JOCKY Forensics

**What it is:** A domain-specific language and execution framework for authorized, read-only computer and
network forensic triage, built for Smart India Hackathon problem statement **SIH26148**.

**Confirmed in code (blueprint items verified)**

- Cross-platform investigation: Windows, Linux and macOS collectors behind a platform dispatcher ✔
- Evidence collection: system, processes, network, users, file metadata ✔
- SHA-256 integrity sealing and vault-wide verification — `backend/app/evidence/hashing.py` ✔
- Chain of custody — `backend/app/evidence/custody.py` ✔
- Telemetry via psutil and an endpoint agent with pairing, heartbeat and job polling ✔
- JOCKY DSL: lexer, recursive-descent parser, validator, IR v1.0 compiler and IR executor
- Correlation graph, forensic timeline, MITRE ATT&CK mapping, JSON / HTML / Markdown reports
- FastAPI backend, React 18 + Vite dashboard, 359 tests (README badge)

**Live demo:** https://jocky-forensic.netlify.app — reachable on the audit date.

**Visual assets:** no screenshots in the repository; no LICENSE file.

---

## Summary of blueprint corrections

1. **NeuroLens** is a sparse-autoencoder interpretability project, not computer vision.
2. **WhoToTrust** covers images (CIFAR-10H) as well as ChaosNLI text.
3. **GateOrchestra** is a team repository; Muzra's part is the agent layer, evaluation pipeline and analysis.
4. **GateOrchestra** has no verified real-LLM headline number; simulated figures must not be shown.
5. Only **JOCKY Forensics** has a live demo.
