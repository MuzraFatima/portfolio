import type { Project } from '@/types/content';

/**
 * The six project planets, in the fixed order from the blueprint.
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
    tagline: 'A combinatorial auction market where AI agents bid for compute',
    repo: 'https://github.com/MuzraFatima/Compute-bazar',
    team: false,
    overview:
      'An AI-agent compute marketplace where agents place budget-aware bundle bids for GPU, CPU, RAM and API budget, and allocation is solved as a combinatorial auction with VCG pricing.',
    problem:
      'Queue-based schedulers block high-value jobs behind early arrivals, and per-unit spot markets can leave agents holding half a bundle they cannot use.',
    solution:
      'Treat allocation as a winner-determination problem solved by binary integer linear programming, with VCG Clarke-pivot pricing so truthful bidding pays off, plus fairness tracking against starvation.',
    architecture: [
      'Agent layer: Coding, Research, Data and Analysis agents with optional Groq reasoning',
      'Auction engine: PuLP / CBC ILP solver and VCG pricing',
      'Marketplace with scarcity pricing and a fairness tracker',
      'FastAPI gateway with JWT / API-key auth and a WebSocket feed',
      'SQLAlchemy persistence and a Chart.js dashboard',
    ],
    technologies: [
      'Python',
      'FastAPI',
      'Groq',
      'PuLP (ILP)',
      'WebSocket',
      'SQLAlchemy',
      'Chart.js',
      'Docker',
      'pytest',
    ],
    features: [
      'Atomic bundle bids, so no agent is left with a partial allocation',
      'VCG pricing with adaptive bidding strategies',
      'Jain fairness index and anti-starvation guards',
      'In a seeded 25-round simulation, the highest social welfare and utilisation of five schedulers (38% above round-robin)',
      'Live WebSocket dashboard with a bidding ticker and round history',
    ],
    contribution: ['Sole author: auction engine, agents, API, dashboard and benchmarks'],
    images: [
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/computebazaar-hero.webp`,
        alt: 'Compute Bazaar dashboard with live market metrics and utilisation charts',
      },
      {
        src: `${import.meta.env.BASE_URL}assets/images/projects/computebazaar-ticker.webp`,
        alt: 'Compute Bazaar live bidding ticker and closed auction rounds',
      },
    ],
    palette: ['#fb923c', '#9333ea', '#3b82f6'],
    visual: 'Interplanetary compute marketplace: resource stations and agent bidding displays.',
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
];

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p])) as Record<
  Project['id'],
  Project
>;
