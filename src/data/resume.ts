/**
 * Muzra's resume, transcribed from Muzra_Fatima_Resume.pdf. Shown as text when a visitor opens
 * "Résumé". The phone number is deliberately left out of the public site.
 */
export interface ResumeSkillGroup {
  title: string;
  items: [name: string, level: string][];
}

export interface ResumeProject {
  name: string;
  note?: string;
  link?: string;
  stack: string;
  bullets: string[];
}

export const resume = {
  name: 'Muzra Fatima',
  headline: 'Aspiring AI/ML Engineer | Generative AI | Intelligent Systems',
  contact: {
    location: 'Mahbubnagar, Telangana, India',
    email: 'muzrafatima@gmail.com',
    linkedin: 'linkedin.com/in/muzra-fatima-7150452bb',
    github: 'github.com/MuzraFatima',
  },
  summary:
    'Final-year B.Tech student in Artificial Intelligence and Machine Learning seeking entry-level AI/ML and Generative AI roles. Python developer experienced in building LLM-powered multi-agent systems, confidence-based model routing and Retrieval-Augmented Generation (RAG) pipelines, with FastAPI backends and automated test suites. Published an ML research paper on smartphone-addiction prediction.',
  skills: [
    {
      title: 'Programming Languages',
      items: [
        ['Python', 'Proficient'],
        ['SQL', 'Intermediate'],
        ['Java', 'Beginner'],
        ['C', 'Beginner'],
      ],
    },
    {
      title: 'AI & Machine Learning',
      items: [
        ['Machine Learning', 'Intermediate'],
        ['Generative AI', 'Intermediate'],
        ['LLMs', 'Intermediate'],
        ['RAG', 'Intermediate'],
        ['Feature Engineering', 'Intermediate'],
        ['Model Evaluation', 'Intermediate'],
        ['Deep Learning', 'Beginner'],
        ['Computer Vision', 'Beginner'],
      ],
    },
    {
      title: 'Agentic AI & Intelligent Systems',
      items: [
        ['AI Agents', 'Intermediate'],
        ['Multi-Agent Systems', 'Intermediate'],
        ['Prompt Engineering', 'Intermediate'],
        ['Adaptive LLM Routing', 'Intermediate'],
        ['ReAct, Reflexion, Debate', 'Intermediate'],
      ],
    },
    {
      title: 'Frameworks, Libraries & Tools',
      items: [
        ['FastAPI', 'Proficient'],
        ['scikit-learn', 'Intermediate'],
        ['Pandas', 'Intermediate'],
        ['NumPy', 'Intermediate'],
        ['Pytest', 'Intermediate'],
        ['Groq API, LiteLLM', 'Intermediate'],
        ['Git & GitHub', 'Intermediate'],
        ['Jupyter Notebook', 'Intermediate'],
        ['Matplotlib', 'Beginner'],
        ['Seaborn', 'Beginner'],
        ['OpenCV', 'Beginner'],
      ],
    },
  ] satisfies ResumeSkillGroup[],
  projects: [
    {
      name: 'Cost-Aware Agent Router (CAAR)',
      link: 'https://github.com/MuzraFatima/Cost-aware-agent',
      stack: 'Python · FastAPI · LiteLLM · Groq · SQLite · TF-IDF Retrieval',
      bullets: [
        'Built a confidence-based, four-tier LLM routing cascade (cheap, RAG, frontier, consensus) that picks a starting tier by task complexity and escalates when domain-weighted confidence (syntax, hedging, LLM-judge) is too low and budget allows.',
        'Delivered it as a FastAPI service with SQLite audit logs, budget controls and a live dashboard; 68 automated tests pass offline. On a 20-query simulated benchmark it matched frontier-only accuracy (100%) at 84.9% lower cost.',
      ],
    },
    {
      name: 'Compute Bazaar 2.0',
      link: 'https://github.com/MuzraFatima/Compute-bazar',
      stack: 'Python · FastAPI · Groq · PuLP (ILP) · WebSocket · SQLAlchemy · Pytest',
      bullets: [
        'Built an AI-agent compute marketplace where Groq-powered agents place budget-aware bundle bids for GPU, CPU, RAM and API-budget resources; allocation is solved as a combinatorial auction with integer linear programming and VCG pricing.',
        'Added JWT-secured FastAPI endpoints, a live WebSocket dashboard, fairness tracking and a resource predictor; 149 passing tests with CI. In a seeded 25-round simulation, ILP+VCG gave 38% higher social welfare than round-robin.',
      ],
    },
    {
      name: 'GateOrchestra',
      note: 'team project',
      stack: 'Python · Groq · Multi-Agent Systems · ReAct · Reflexion · Debate',
      bullets: [
        'Contributed to an adaptive multi-agent gateway that escalates requests across reasoning strategies; my scope was the agent layer: ReAct-based search, Reflexion and Debate agents.',
        'Built a Groq-powered evaluation pipeline to benchmark agent decisions and routing quality.',
      ],
    },
    {
      name: 'JOCKY Forensics',
      note: 'SIH 2026',
      stack: 'Python · FastAPI · React · SHA-256 · REST APIs · Digital Forensics',
      bullets: [
        'Built a cross-platform (Windows, Ubuntu, macOS) digital forensics platform that collects, analyzes and preserves evidence, with system telemetry, process and network analysis, and an endpoint agent.',
        'Implemented a secure evidence vault (SHA-256 hashing, integrity verification, chain-of-custody tracking, automated report generation) and designed a custom domain-specific language (DSL) for investigation workflows.',
      ],
    },
  ] satisfies ResumeProject[],
  publication: {
    title: 'Smartphone Usage to Addiction: A Predictive Approach Using Machine Learning',
    venue: 'HBRP Publication, 2025',
    summary:
      'Explored predictive machine-learning techniques and behavioral/usage features to support early risk assessment.',
  },
  achievements: [
    'Winner, Smart India Hackathon (SIH) 2026 Internal Hackathon for JOCKY Forensics, a digital forensics platform.',
  ],
  education: [
    {
      degree: 'B.Tech, Artificial Intelligence and Machine Learning',
      school: 'Jayaprakash Narayan College of Engineering',
      detail: '2023–2027 | CGPA: 7.97 (through Sem 3-2)',
    },
    { degree: 'Intermediate (MPC)', school: 'ARK Junior College', detail: '90.2%' },
  ],
  certifications: [
    {
      issuer: 'AWS Academy',
      names:
        'Generative AI Foundations; Machine Learning Foundation; Machine Learning for NLP; Data Engineering',
    },
    {
      issuer: 'Cisco',
      names: 'Introduction to Modern AI; Introduction to Data Science; Python Essentials 2',
    },
    {
      issuer: 'Anthropic',
      names:
        'Claude with the Anthropic API; Introduction to Agent Skills; AI Fluency: Framework & Foundations',
    },
    { issuer: 'freeCodeCamp', names: 'Scientific Computing with Python' },
  ],
};
