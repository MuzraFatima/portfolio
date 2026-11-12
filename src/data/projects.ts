import type { Project } from '@/types/content';

/**
 * The project planets: the six from the blueprint in their fixed order (GateOrchestra first),
 * followed by later projects.
 * Every claim here was checked against the repository — see docs/PROJECT_AUDIT.md.
 */
export const projects: Project[] = [
  {
    id: 'gateorchestra',
    order: 1,
    flagship: true,
    name: 'GateOrchestra',
    tagline: 'Token-budget-calibrated gating for multi-agent orchestration',
    repo: 'https://github.com/FarhanAaqil/GateOrchestra',
    team: true,
    overview:
      'A lightweight, trainable gate that sits in front of a multi-agent orchestrator and decides, before any expensive compute is spent, whether a cheap single-agent answer is good enough.',
    problem:
      'Multi-agent strategies such as ReAct, Debate and Reflexion can improve answers, but running them on every task burns far more tokens than a single agent, often for no gain.',
    solution:
      "A CoT self-consistency probe answers first. A gate trained on pre-execution signals then chooses STOP (keep the probe answer) or ESCALATE to the full multi-agent orchestrator, with the escalation budget capped at k × the probe's tokens.",
    architecture: [
      'Probe agent: CoT self-consistency with 3 samples',
      'Feature extractor: 8 pre-execution features',
      'Gate: learned (LogReg / GBT / MLP), rule-based or random',
      'MAS orchestrator: ReAct, Debate and Reflexion sub-agents',
      'Token accountant: budgets enforced before every call',
      'FastAPI backend and React + three.js console',
    ],
    technologies: [
      'Python',
      'Groq',
      'Ollama',
      'FastAPI',
      'scikit-learn',
      'React',
      'TypeScript',
      'three.js',
      'pytest',
    ],
    features: [
      'STOP / ESCALATE gating calibrated over accuracy tolerance and budget multiplier',
      'ReAct, Debate and Reflexion sub-agents behind one orchestrator',
      'Optional LinUCB contextual-bandit strategy router',
      'True provider token totals with pre-call budget enforcement',
      'Wilson confidence intervals and exact McNemar tests',
      'Honest reporting: simulated figures are labelled, and no real-LLM headline is claimed before the final benchmark',
    ],
    contribution: [
      'Owned the agent layer: the CoT-SC probe agent, the MAS orchestrator and the ReAct, Debate and Reflexion sub-agents',
      'Added the LinUCB contextual bandit router, sequential early exit and semantic soft voting',
      'Integrated the Groq cloud provider with an Ollama local fallback',
      'Retrained the GBT gate on real Groq traces',
      'Built the batch evaluation pipeline and the agent performance and error analysis modules',
    ],
    images: [],
    palette: ['#3b6bff', '#8b5cf6', '#c4b5fd'],
    visual: 'Multi-agent command centre: neural pathways, agent satellites and a central orchestration hub.',
  },
  {
    id: 'whototrust',
    order: 2,
    name: 'WhoToTrust',
    tagline: 'When labels disagree, who should you trust?',
    repo: 'https://github.com/MuzraFatima/WhoToTrust',
    team: false,
    overview:
      'LabelTriage decides, vote by vote, whether a disagreement between human annotators is a mistake or a genuine difference of opinion, then trains on each differently.',
    problem:
      'Pipelines either delete minority votes as noise or keep every vote as a soft label. Both are wrong part of the time: some disagreement is error, some is real ambiguity.',
    solution:
      "Score each vote's probability of being an error from five evidence groups, then route each item to a hard label (clear), a soft label (ambiguous) or a down-weighted target (unreliable).",
    architecture: [
      'AmbiNoise benchmark: real many-annotator votes with injected, labelled errors',
      'Five evidence groups: vote split, annotator reliability, model plausibility, neighbours, probe learning',
      'Calibrated out-of-fold error model and a three-way router',
      'Harm analysis through counterfactual retraining',
      'Python API and React explorer',
    ],
    technologies: [
      'Python',
      'PyTorch',
      'Hugging Face Transformers',
      'LightGBM',
      'scikit-learn',
      'Hydra',
      'FastAPI',
      'React',
      'Vite',
    ],
    features: [
      'Benchmark over CIFAR-10H images and ChaosNLI text, with VariErr NLI as a transfer test',
      'Spammer, swap, lazy and plausible-wrong error processes',
      'On images, beats majority vote and soft labels for every error type, within about 1 point of the oracle',
      'Web explorer for every item, vote, error score and the reasons behind it',
      'Runs end to end on a laptop CPU, with 219 Python tests plus unit and end-to-end web tests',
    ],
    contribution: ['Sole author: method, benchmark, experiments, web app and tests'],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/whototrust-overview.webp`,
        alt: 'WhoToTrust web app overview page showing results summary',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/whototrust-explorer.webp`,
        alt: 'WhoToTrust explorer showing items, votes and error scores',
      },
    ],
    palette: ['#22d3ee', '#f1f5f9', '#a855f7'],
    visual: 'Data reliability world: conflicting data streams and reliability visualisations.',
  },
  {
    id: 'neurolens',
    order: 3,
    name: 'NeuroLens',
    subtitle: 'TopoCircuit-SAE',
    tagline: 'Looking inside language models: multi-parent feature absorption in sparse autoencoders',
    repo: 'https://github.com/MuzraFatima/NeuroLens',
    team: false,
    overview:
      'A mechanistic-interpretability study that measures how sparse autoencoders hide general concepts inside specific ones when a token has several parents, and tests whether DAG routing reduces it.',
    problem:
      'Feature absorption, where a specific latent silently takes over a general one, has only been measured with single-parent tasks, yet real concepts have several parents at once.',
    solution:
      "MPAbs, a benchmark with three parents per token on real Pythia-70M activations, and DR-SAE, an autoencoder that learns an acyclic parent graph between latents and routes each child's activation to its ancestors.",
    architecture: [
      'Activation extraction from Pythia-70M, layer 3',
      'Seven sparse-autoencoder variants trained on identical data',
      'MPAbs benchmark scored per parent and jointly',
      'Synthetic tier with a known ground-truth graph',
      'Circuit faithfulness test on subject–verb agreement',
      'Local API, SQLite and an interactive explorer',
    ],
    technologies: ['Python', 'PyTorch', 'Pythia-70M', 'NLTK / WordNet', 'SQLite', 'LaTeX'],
    features: [
      'Pre-registered hypotheses, with falsified results reported openly',
      'DR-SAE leaves a parent latent silent 37% less often than Matryoshka at matched effective L0 (exploratory)',
      'Interactive DAG hierarchy explorer and routing simulator',
      'Runs entirely on CPU; the paper source is generated from the results',
    ],
    contribution: ['Sole author: research design, models, benchmark, experiments, explorer and paper'],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/neurolens-dag.webp`,
        alt: 'NeuroLens DAG hierarchy explorer showing learned parent edges between latents',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/neurolens-routing.webp`,
        alt: 'NeuroLens routing simulator showing activation travelling to ancestor latents',
      },
    ],
    palette: ['#10b981', '#22d3ee', '#a7f3d0'],
    visual: 'Optical and neural-vision laboratory: a lens world revealing hidden structure.',
  },
  {
    id: 'caar',
    order: 4,
    name: 'Cost-Aware Agent Router',
    shortName: 'CAAR',
    tagline: 'Route every query to the cheapest agent that can handle it',
    repo: 'https://github.com/MuzraFatima/Cost-aware-agent',
    team: false,
    overview:
      'A confidence-based, four-tier LLM routing cascade that starts each query at the lowest-cost capable tier and escalates only when confidence is too low and budget allows.',
    problem:
      'Sending every query to a frontier model wastes money; sending everything to a small model fails on reasoning, code and strict structured output.',
    solution:
      "Classify complexity to pick a starting tier, score the answer's confidence from syntax checks and hedging detection, and escalate through Cheap → RAG → Frontier → Consensus only when needed.",
    architecture: [
      'Complexity pre-classifier',
      'Four agent tiers: Cheap, RAG, Frontier and Consensus',
      'Confidence evaluator: syntactic checks plus semantic hedging',
      'Cost tracker and per-step latency profiling',
      'FastAPI service with SQLite audit logs and a live dashboard',
    ],
    technologies: ['Python', 'FastAPI', 'LiteLLM', 'Groq', 'SQLite', 'SQLAlchemy', 'pytest'],
    features: [
      'Dynamic escalation with a step-by-step audit trail',
      'Token-level cost and latency tracking',
      'Daily and monthly budget controls with policy sliders',
      'Offline deterministic mock mode plus live providers',
      'Benchmark harness with Wilson confidence intervals (mock mode validates routing and cost, not real accuracy)',
    ],
    contribution: ['Sole author: router, agents, evaluation, API and dashboard'],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/caar-sandbox.webp`,
        alt: 'CAAR gateway playground showing an accepted routing cascade with cost and latency',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/caar-analytics.webp`,
        alt: 'CAAR analytics dashboard with spend, savings and tier distribution',
      },
    ],
    palette: ['#f5b301', '#2f80ff', '#fde68a'],
    visual: 'Intelligent routing network: model nodes, routing paths and cost/performance displays.',
  },
  {
    id: 'compute-bazaar',
    order: 5,
    name: 'Compute Bazaar',
    tagline: 'A combinatorial compute market for LLM agents that only estimate what their tasks are worth',
    repo: 'https://github.com/MuzraFatima/Compute-bazar',
    team: false,
    overview:
      'A multi-agent marketplace where autonomous AI agents bid for bundles of GPU, CPU, memory and LLM API budget. Allocation is solved exactly as a multi-unit combinatorial auction with agent-level VCG pricing, and the mechanism is redesigned for the case LLM bidders create: values that are estimated, not known.',
    problem:
      'AI agents increasingly compete for the same scarce compute. Queues and per-unit spot markets block high-value jobs or leave agents holding half a bundle, and classic truthful auctions assume bidders know their own value, which LLM agents do not.',
    solution:
      "Solve winner determination exactly with integer programming, charge agent-level VCG (a Clarke pivot over all of an agent's bids), and let each task bid a calibrated, risk-adjusted XOR menu of reservation sizes priced at calibrated value × empirical success probability.",
    architecture: [
      'LLM agents (Groq): value estimate and resource-need forecast with 90% intervals',
      'Bids: resource bundles with quantities and optional XOR menus of reservation sizes',
      'Winner determination: exact multi-unit integer program (PuLP with CBC or HiGHS)',
      'Pricing: agent-level VCG, execution-contingent VCG, core-selecting payments, tiers and reserves',
      'Feedback: realised value and usage drive per-agent calibration, memory and fairness tracking',
      'Serving: FastAPI, SQLAlchemy and WebSocket feeding a live dashboard',
    ],
    technologies: [
      'Python',
      'FastAPI',
      'Groq',
      'PuLP (ILP)',
      'NumPy',
      'SQLAlchemy',
      'WebSocket',
      'JWT',
      'Chart.js',
      'Docker',
      'pytest',
      'Hypothesis',
    ],
    features: [
      'Autonomous Groq-powered Coding, Research, Data and Analysis agents that estimate value and bid; a rule-based mode runs offline',
      'Exact combinatorial auction with XOR menus; winner determination stays around a second at 400 bids',
      'Agent-level VCG with 0 profitable deviations in 40,000 misreport searches, against 7.3% exploitable for the common per-bid shortcut',
      'Adaptive bidding strategies: truthful, budget-aware shading, urgency, Q-learning and contextual bandits',
      'Scarcity-based dynamic reserve pricing, tier discounts and budget checks',
      'Learned resource predictor: runtime error down from 232% to 21.7% MAPE, with 90% intervals covering 89% of outcomes',
      'Live FastAPI dashboard over WebSocket, with JWT and API-key authentication',
      'Evaluation framework: trace-driven cluster simulator, property-based mechanism tests and one-command reproduction',
    ],
    contribution: [
      'Sole author: auction engine and mechanism design, LLM agents, resource predictor, cluster simulator, API, dashboard and experiments',
    ],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/computebazaar-hero.webp`,
        alt: 'Compute Bazaar live dashboard with market KPIs and analytics',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/computebazaar-charts.webp`,
        alt: 'Compute Bazaar market charts',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/computebazaar-ticker.webp`,
        alt: 'Compute Bazaar live bidding ticker and closed auction rounds',
      },
    ],
    palette: ['#fb923c', '#9333ea', '#3b82f6'],
    visual: 'Interplanetary compute marketplace: resource stations and agent bidding displays.',
    deepDive: {
      whyItMatters:
        'As more work is done by LLM agents, compute becomes something agents negotiate for. A mechanism that is truthful on paper can lose welfare or break individual rationality once its bidders misjudge their own value, so the allocation rules have to be designed for estimated values.',
      pipeline: [
        { label: 'Task', detail: 'A natural-language task arrives' },
        { label: 'LLM agent', detail: 'A Groq agent estimates value and resource needs with a 90% interval' },
        { label: 'Bids', detail: 'Bundles × quantities, optionally an XOR menu of reservation sizes' },
        { label: 'Winner determination', detail: 'Exact multi-unit integer program (PuLP, CBC / HiGHS)' },
        {
          label: 'Pricing',
          detail: 'Agent-level VCG with parallel counterfactual solves, reserves and tiers',
        },
        { label: 'Execution', detail: 'Realised value and usage update calibration, memory and fairness' },
        { label: 'Dashboard', detail: 'FastAPI, SQLAlchemy and a WebSocket feed to the live dashboard' },
      ],
      methodology: [
        'Winner determination as a binary integer program with capacity and XOR constraints',
        'Clarke-pivot VCG computed per agent, with counterfactual solves run in parallel',
        'Calibrated value estimates and empirical success probabilities feeding risk-adjusted XOR menus',
        'Learning bidders (Hedge, Q-learning, contextual bandits) and live Groq LLM bidders in repeated auctions',
        'Trace-shaped GPU cluster simulation (Alibaba-PAI-like workloads) against FIFO, DRF and a Themis-style scheduler',
      ],
      innovations: [
        "Shows that only the heterogeneous part of agents' value bias costs welfare",
        'Risk-adjusted XOR menus, which provably maximise expected realised welfare',
        'A correct agent-level VCG, with evidence that the common per-bid shortcut is manipulable',
        'A fairness knob (an affine maximiser) that trades welfare for finish-time fairness while staying truthful',
      ],
      results: [
        {
          value: '78.0%',
          label: 'of oracle welfare with calibrated XOR menus',
          note: 'vs 72.1% for VCG on point estimates; 3 seeds × 200 rounds',
        },
        { value: '0 of 40,000', label: 'profitable misreports under agent-level VCG' },
        {
          value: '7 policies',
          label: 'compared on GPU traces; the auction has the highest welfare',
          note: 'its margin over greedy is within seed variance',
        },
        { value: '21.7%', label: 'MAPE of the learned resource predictor', note: 'down from 232%' },
      ],
      status: {
        implemented: [
          'Working system: FastAPI backend, live dashboard, rule-based and Groq agent modes',
          'Auction engine with VCG, execution-contingent and core-selecting payments; resource predictor; cluster simulator',
          'One-command reproduction of every result; lint and tests in CI on Python 3.11 and 3.12',
        ],
        research: ['Paper draft with propositions and proofs'],
        limits: [
          'The estimated-value agents are a parametric model of LLM miscalibration, and the cluster workload is calibrated to the PAI trace rather than replayed',
          'The live LLM study is small because of Groq free-tier limits',
          'Single-node deployment (SQLite by default)',
        ],
      },
    },
  },
  {
    id: 'jocky',
    order: 6,
    name: 'JOCKY Forensics',
    tagline: 'A domain-specific language for safe, verifiable forensic triage',
    repo: 'https://github.com/MuzraFatima/jocky-forensics',
    demo: 'https://jocky-forensic.netlify.app',
    team: false,
    award: 'Winner, Smart India Hackathon 2026 Internal Hackathon',
    overview:
      'A domain-specific language and execution framework for authorized, read-only computer and network forensic analysis across Windows, Linux and macOS, built for SIH problem statement SIH26148.',
    problem:
      'Ad-hoc admin scripts used during incident response are fragile, hard to reproduce and frequently trip antivirus and EDR alerts.',
    solution:
      'Investigators write declarative JOCKY scripts that compile to a validated intermediate representation and run only read-only collectors. Evidence is sealed with SHA-256 and tracked through a chain of custody.',
    architecture: [
      'JOCKY DSL: lexer, recursive-descent parser, validator and IR v1.0',
      'IR executor with a read-only policy and hardening',
      'Cross-platform collectors and an authenticated endpoint agent',
      'Evidence vault with SHA-256 verification and custody log',
      'Correlation, timeline and MITRE ATT&CK mapping',
      'Report engine and React dashboard',
    ],
    technologies: ['Python', 'FastAPI', 'psutil', 'SHA-256', 'React', 'Vite', 'pytest'],
    features: [
      'Windows, Linux and macOS evidence collection',
      'SHA-256 integrity sealing and tamper detection',
      'Chain-of-custody tracking',
      'Endpoint agent with pairing, heartbeat and job polling',
      'JSON, HTML and Markdown forensic reports',
    ],
    contribution: [
      'Sole author of the repository: language, engine, collectors, vault, analysis and dashboard',
    ],
    images: [],
    palette: ['#ef4444', '#1e3a8a', '#cbd5e1'],
    visual: 'Digital investigation station: evidence vaults, integrity scanner and telemetry displays.',
  },
  {
    id: 'horizonguard',
    order: 7,
    name: 'HorizonGuard',
    tagline: 'Recoverability-aware early warning of goal drift in long-horizon AI agents',
    repo: 'https://github.com/MuzraFatima/HorizonGuard',
    team: false,
    overview:
      'An AI-safety research system that watches a long-running agent step by step, forecasts whether it is drifting from its goal, and predicts whether a corrective intervention would rescue the run or disrupt it. It acts only when the rescue wins, and certifies how often its own interventions cause harm.',
    problem:
      'Agents on long tasks can drift away from their intended goal. Most monitors only predict failure, and an accurate predictor can still make agents worse: a reminder fired at the wrong moment can break a run that was going to succeed.',
    solution:
      'Model each run as moving between aligned, drifting and violated states, predict for every intervention strength whether it would rescue or disrupt the run, take the action with the best rescue − 2 × disruption (or wait), and bound the disruption rate with conformal risk control.',
    architecture: [
      'Trajectory logging: observable step records from the agent',
      'Step encoder: feature-hashing action embeddings with goal-relative geometry',
      'Multi-state hazard model: drift onset, violation and recovery as competing transitions',
      'Effect model: rescue vs disruption for four intervention strengths',
      'Certificates: conformal risk control, Learn-then-Test and a betting e-process',
      'Serving: a live monitor and HTTP API, with a React and Vite dashboard',
    ],
    technologies: [
      'Python',
      'NumPy',
      'SciPy',
      'PyYAML',
      'React',
      'TypeScript',
      'Vite',
      'pytest',
      'Puppeteer',
      'Docker',
    ],
    features: [
      'DriftBench-CF: counterfactual fork labels in which every arm shares the same seeds, so rescue and disruption are measurable for each prefix',
      'Live monitor that turns each step into risk, drift belief, net benefit per intervention and a certified decision',
      'Effect-aware policy choosing between a reminder, restatement, constraint gate or escalation, or waiting',
      'Disruption-controlled guarantees: 0 of 200 resamples above the target rate, keeping 96% of rescues',
      'Transfer tests on unseen agent families and environments, plus a gated stealth-drift stress test in simulation',
      'Dashboard with live monitor, run replay, closed-loop A/B and guarantees pages; 218 Python tests and a Chrome end-to-end suite',
    ],
    contribution: [
      'Sole author: benchmark and fork engine, models, guarantees, live monitor, dashboard and the preregistered study',
    ],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/horizonguard-overview.webp`,
        alt: 'HorizonGuard dashboard overview with closed-loop A/B results',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/horizonguard-live-monitor.webp`,
        alt: 'HorizonGuard live monitor scoring an agent step by step',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/horizonguard-ab-test.webp`,
        alt: 'HorizonGuard closed-loop A/B test across seed-paired runs',
      },
    ],
    palette: ['#d9b26a', '#4f6f41', '#f3e2b3'],
    visual: 'A ringed sentinel world with watch satellites: an observatory for drifting agents.',
    deepDive: {
      whyItMatters:
        'Long-horizon agents are being given more autonomy, and a monitor that interrupts at the wrong time can cause the very failures it is meant to prevent. Knowing when an intervention helps, and bounding how often it harms, is what makes monitoring safe to deploy.',
      pipeline: [
        { label: 'Agent', detail: 'A long-horizon agent acts in an environment' },
        { label: 'Trajectory log', detail: 'Observable step records only: a black-box view of the agent' },
        { label: 'Embeddings', detail: 'Feature-hashing step encoder and goal-relative geometry' },
        { label: 'Hazard model', detail: 'Aligned, drifting and violated states, with recovery' },
        { label: 'Effect model', detail: 'Rescue vs disruption for each intervention strength' },
        {
          label: 'Certificate',
          detail: 'Disruption risk ≤ α via conformal risk control and Learn-then-Test',
        },
        { label: 'Policy', detail: 'Intervene only when rescue − 2 × disruption is best; otherwise wait' },
      ],
      methodology: [
        'Fork engine: snapshot a run prefix and branch seed-paired continuations with and without each intervention',
        'Sequential, per-step scoring of agent trajectories from black-box action embeddings',
        'Temporal modelling of drift onset, violation and recovery as a multi-state hazard',
        'Effect learners that predict rescue and disruption per intervention strength',
        'Conformal risk control and Learn-then-Test on run-level disruption, plus an e-process for time-uniform false alarms',
        'Models written from scratch in NumPy and SciPy (logistic, softmax and ridge regression), compared with Markov, trajectory-feature and anomaly-detection baselines',
      ],
      innovations: [
        'Asks not only "will this agent drift?" but "is it still fixable, and will fixing it help more than it hurts?"',
        'Counterfactual rescue and disruption labels from seed-paired forks',
        "A certified bound on how often the monitor's own interventions cause harm",
        'Preregistered research questions, with negative results reported alongside the positive ones',
      ],
      results: [
        {
          value: '65% → 10%',
          label: 'goal-violation rate, no monitor vs HorizonGuard',
          note: 'unseen environment and agent family, 40 seeds; a probability-only alarm reaches 40%',
        },
        { value: '25 vs 11', label: 'runs rescued vs a probability-only alarm', note: '3 vs 1 disrupted' },
        { value: '0 of 200', label: 'resamples above the disruption target', note: '96% of rescues kept' },
        { value: '0.03', label: 'median AUROC drop on unseen agent families' },
      ],
      status: {
        implemented: [
          'DriftBench-CF generation, fork engine, hazard and effect models, certificates, transfer and stress studies',
          'Live monitor, HTTP API and dashboard; one-command reproduction with a Makefile and Docker',
          '218 Python tests in CI on Python 3.10 and 3.12, and a Chrome end-to-end suite for the dashboard',
        ],
        research: [
          'Learned (sentence-embedding) action encoders: the encoder interface is in place, while the shipped encoder uses feature hashing',
          'Validation on real LLM agents: a seeded, cached LLM-agent wrapper exists, but every reported result uses synthetic agents',
          'Benchmark and method papers, in draft',
        ],
        limits: [
          'All drift is studied in simulation, so the numbers describe the method, not any real model',
          'Not supported by the data: a lead-time gain from the hazard model (−1.5 steps) and a simple lead-time scaling law',
        ],
      },
    },
  },
];

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p])) as Record<
  Project['id'],
  Project
>;
