# Project Audit

Audit date: 5 November 2026; Compute Bazaar and GateOrchestra re-audited and HorizonGuard added on
12 November 2026; AstroLM audited and the Cost-Aware Agent Router removed on 27 November 2026.
The table and headings keep their audit numbers; on the site the order is GateOrchestra, WhoToTrust,
NeuroLens, AstroLM, Compute Bazaar, JOCKY Forensics, HorizonGuard.
Every statement below was checked against the repository's README,
file tree, contributor list and (for GateOrchestra) pull-request history through the GitHub API.
Where the blueprint and the repository disagree, the repository wins.

| #   | Project         | Repository                                                                    | Author(s)                       | Live demo                                                                                 |
| --- | --------------- | ----------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| 01  | GateOrchestra   | [FarhanAaqil/GateOrchestra](https://github.com/FarhanAaqil/GateOrchestra)     | Team of 4 (Muzra: agent layer)  | None                                                                                      |
| 07  | HorizonGuard    | [MuzraFatima/HorizonGuard](https://github.com/MuzraFatima/HorizonGuard)       | Muzra Fatima (sole contributor) | None (local dashboard only)                                                               |
| 02  | WhoToTrust      | [MuzraFatima/WhoToTrust](https://github.com/MuzraFatima/WhoToTrust)           | Muzra Fatima (sole contributor) | None                                                                                      |
| 03  | NeuroLens       | [MuzraFatima/NeuroLens](https://github.com/MuzraFatima/NeuroLens)             | Muzra Fatima (sole contributor) | None (local explorer only)                                                                |
| 04  | AstroLM         | [MuzraFatima/AstroLM](https://github.com/MuzraFatima/AstroLM)                 | Muzra Fatima (sole contributor) | None (localhost-only interface; trained weights are not distributed)                      |
| 05  | Compute Bazaar  | [MuzraFatima/Compute-bazar](https://github.com/MuzraFatima/Compute-bazar)     | Muzra Fatima (sole contributor) | None                                                                                      |
| 06  | JOCKY Forensics | [MuzraFatima/jocky-forensics](https://github.com/MuzraFatima/jocky-forensics) | Muzra Fatima (sole contributor) | [jocky-forensic.netlify.app](https://jocky-forensic.netlify.app) (HTTP 200 on audit date) |

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
- MASBench-mini dataset: now 225 tasks (97 train / 32 validation / 96 test), with a leakage audit
- Chat assistant routed by the probe and gate, with tool-using research agents and Groq → Gemini → Ollama
  fallback; Docker deployment with token auth, rate limits and Prometheus metrics (added by the team in November)

**Results status (re-audited 12 November 2026, commit `0dc7f5b`):** the final real-LLM benchmark has run and
passes `scripts/verify_final_results.py`. Qwen2.5-3B, 96 test tasks × 2 seeds: GateOrchestra 97.9% accuracy
at 784 tokens/task (−33% vs Always-MAS at 92.2%), 3% escalation; CoT-SC-only 96.9%. The research goal
(≥40% saving at ≤2 points cost) was not met, and multi-agent was less accurate than the probe at this scale.
Reduced runs (1 seed) on Qwen3.8-27B and gpt-oss-120b: the gate escalates nothing and matches CoT-SC, 54%
fewer tokens than Always-MAS on gpt-oss-120b. The portfolio quotes these figures with their caveats; the
simulated "78% savings" figure is still never used.

**Muzra's contribution (verified from her merged PRs #4, #8, #14, #22, #27, #29 — branch `person2-agent`)**

- Implemented the CoT-SC probe agent and its tests (PR #4)
- Implemented the MAS orchestrator, ReAct / Debate / Reflexion sub-agents and the Always-MAS and CoT-SC baselines (PR #4)
- Added the LinUCB contextual bandit router, sequential early exit and semantic soft voting (PR #8); the router is available but the final benchmark uses the text heuristic
- Added the Groq cloud provider with Ollama local fallback (PR #8)
- Retrained the GBT gate on real Groq traces, added 429 back-off and better answer extraction (PR #14)
- Added LinUCB online reward updates, bandit state persistence and end-to-end Probe → Gate → MAS tests (PR #22)
- Built the batch evaluation pipeline, LinUCB warm-start and strategy-allocation metrics (PR #27)
- Wrote the agent performance and error analysis modules and experiment reports (PR #29)

Muzra's commits end on 23 September 2026; the November benchmark, chat assistant and Docker work are the
team's, and the portfolio does not credit them to her.

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

## 04 — AstroLM

Audited on 27 November 2026 against `main` (18 commits, all by Muzra Fatima; MIT; renamed from
"NebulaLM" in the same session). It replaces the Cost-Aware Agent Router in this slot, which has been
removed from the site at Muzra's request.

**What it is:** A decoder-only language model for astronomy, written from scratch, together with a
preregistered study of what a 4.5M–29M model learns, stores and leaks when trained on repeated text.

**Confirmed in code**

- Corpus pipeline: pinned `wikimedia/wikipedia` 20231101.en dump, cleaning, quality filters,
  cluster-based splits — `src/astrolm/data/`
- Byte-level BPE tokenizer training, comparison and selection — `src/astrolm/tokenizer/`,
  `artifacts/tokenizer/`
- Pre-LayerNorm decoder with exact GELU, learned positions and a tied head — `src/astrolm/model/`
- Training with FP16 AdamW, warmup-stable-decay schedules, atomic hashed checkpoints and a run queue —
  `src/astrolm/training/`, `scripts/run_queue.py`
- 5-gram Kneser-Ney baseline — `src/astrolm/baselines/`
- Learn / Store / Leak audit kit — `scripts/audit_checkpoint.py`, `src/astrolm/evaluation/`
- Localhost-only web interface and generation script on the standard library — `scripts/web_ui.py`,
  `scripts/generate.py`
- 21 test files under `tests/`; dependencies pinned in `requirements.lock` (PyTorch 2.10, NumPy,
  Hugging Face `tokenizers`, PyArrow, jsonschema, PyYAML, pytest)

**Results** (`reports/final_report.md`, dated 2026-11-14; every number traced to a checkpoint hash in
`reports/study/results.json`):

- 29.4M model reaches **1.060 test bits per byte**, 5.53% below the 10.3M model (1.1218, interval
  5.34–5.77%) and 18.67% below the 5-gram baseline (1.3792, interval 17.96–19.34%). One main seed at
  E* = 8.
- Membership AUC rises to 0.660 (29.4M, 8 passes); verbatim extraction stays under 1%; canaries
  inserted 16 times saturate the exposure cap.
- An edited copy sharing only half its word 5-grams transfers **71–83%** of an exact copy's benefit.
- Reported as **not supported**: H2a, the monotonicity half of H3a, H2c, H3c. H1c open (needs human
  raters); H3b, H4 and H5 not run.
- Corpus: 15,541 Wikipedia astronomy articles, 13,946,044 unique training tokens. 46 registered runs,
  about 2.9 hours of training on one RTX 3050 laptop GPU.

**Gaps:** no continuous integration (the repository has no `.github/`), and no public demo — the
interface binds to `127.0.0.1` and `runs/` is gitignored, so a fresh clone has no weights.

**Visual assets:** 4 screenshots in `docs/demo/` (light and dark), MIT. The README states they were
captured against a small checkpoint trained on the sample slice, not the 29.4M model; the two used on
the site repeat that caveat in their alt text.

---

## 05 — Compute Bazaar

Re-audited on 12 November 2026 against the latest `main` (commit `eb461f5`, 68 commits, all by Muzra).
The earlier description and its 25-round benchmark are out of date and have been replaced.

**What it is now:** a combinatorial compute market for LLM agents that only estimate what their tasks are
worth: an exact multi-unit winner-determination ILP (PuLP with CBC or HiGHS), agent-level VCG pricing,
and mechanisms designed for estimated values (calibrated, risk-adjusted XOR menus).

**Confirmed in code**

- Autonomous agents: Coding, Research, Data and Analysis agents (`compute_bazaar/agents/`), Groq client with
  a configurable model (`compute_bazaar/llm/client.py`) and an offline rule-based mode ✔
- Agent-based bidding on resource bundles with quantities and XOR groups (`backend/app/auction/engine.py`) ✔
- Exact ILP winner determination; agent-level VCG with parallel counterfactual solves (`ThreadPoolExecutor`) ✔
- Adaptive bidding strategies: truthful, budget-aware shading, urgency, Q-learning, contextual bandit
  (`compute_bazaar/autobid/strategies.py`) ✔
- Scarcity-based dynamic reserve pricing (`compute_bazaar/marketplace/manager.py`), tier discounts and
  reserves (`backend/app/auction/pricing.py`) ✔
- FastAPI with JWT / API-key auth, WebSocket feed, dashboard (`backend/app/`) ✔
- Evaluation: learned predictor, trace-driven cluster simulator, core payments and strategic games,
  incentive verification, Hypothesis property tests; 206 test functions in `tests/` ✔

**Results used on the portfolio (from the README, reproducible with `scripts/reproduce.py`):** 0 of 40,000 profitable
misreports under agent-level VCG vs 7.3% for the per-bid shortcut; highest welfare of seven scheduling
policies on PAI-shaped traces (margin over greedy within seed variance); predictor MAPE 232% → 21.7%.
Limitations are shown with them.

**Live demo:** none. **Visual assets:** 4 dashboard screenshots in `docs/screenshots/` (MIT); 3 used.

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

## 07 — HorizonGuard

Audited on 12 November 2026 against `main` (commit `356676a`, 62 commits, all by Muzra). MIT licence.

**What it is:** recoverability-aware early warning of goal drift in long-horizon agents. It forecasts per
step whether a goal re-anchoring intervention would rescue or disrupt a run, acts only when the rescue wins,
and certifies how often its interventions cause harm.

**Implemented (confirmed in `src/horizonguard/`)**

- Fork engine and DriftBench-CF counterfactual labels (`fork/`, `bench/`) ✔
- Step encoder: signed feature-hashing bag of words plus goal-relative geometry (`embeddings/encoders.py`) ✔
- Multi-state hazard model and comparators: single-event classifier, logistic hazard, PCA anomaly
  detector (`hazard/`), plus Markov and trajectory-feature baselines (`baselines/`) ✔
- Effect learners and the effect-aware policy (`effects/`) ✔
- Conformal risk control, Learn-then-Test and an e-process (`guarantees/`) ✔
- Transfer, cold-start and stress studies (`transfer/`, `adversary/`, gated and simulation-only) ✔
- Live monitor, closed loop and an HTTP API on the standard library (`monitor/`) ✔
- React + Vite + TypeScript dashboard with a Puppeteer end-to-end suite (`dashboard/`) ✔
- Models are implemented from scratch in NumPy and SciPy (`models/`: logistic, softmax, ridge). Runtime
  dependencies are only NumPy, SciPy and PyYAML.

**Research objectives, not yet implemented — shown as such on the portfolio**

- Learned (sentence-embedding) action encoders: the `encode` interface allows them, but the shipped encoder
  is feature hashing.
- Validation on real LLM agents: `agents/llm.py` wraps a seeded, cached backend, but every reported result
  uses synthetic agents.
- Benchmark and method papers are drafts.

**Results used on the portfolio (README, preregistered):** 25 vs 11 rescues against a probability-only alarm
on an unseen environment and agent family over 40 seeds; 0 of 200 resamples above the disruption target with 96% of rescues kept; median AUROC
drop 0.03 on unseen agents. Unsupported hypotheses (hazard lead time, scaling law) are also stated.

**Test count:** the README reports 218 tests run in CI; `tests/` defines 194 test functions (the difference is
likely parameterised cases). The repository's code was not executed during this audit.

**Live demo:** none (the dashboard runs locally). **Visual assets:** 8 screenshots in `docs/screenshots/`
(MIT); 3 used.

---

## Summary of blueprint corrections

1. **NeuroLens** is a sparse-autoencoder interpretability project, not computer vision.
2. **WhoToTrust** covers images (CIFAR-10H) as well as ChaosNLI text.
3. **GateOrchestra** is a team repository; Muzra's part is the agent layer, evaluation pipeline and analysis.
4. **GateOrchestra** has no verified real-LLM headline number; simulated figures must not be shown.
5. Only **JOCKY Forensics** has a live demo.
6. **Compute Bazaar**'s 25-round benchmark (38% above round-robin) is superseded by the current results.

**Note (12 November 2026):** at Muzra's request the site no longer shows Compute Bazaar's 78.0% welfare
figure or HorizonGuard's 65% → 10% violation-rate figure.
