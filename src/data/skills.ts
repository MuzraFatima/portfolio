import type { SkillCategory } from '@/types/content';

/** Levels come from Muzra's resume. No percentages are shown anywhere. */
export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Languages I write day to day, with Python at the centre of almost every project.',
    color: '#7c8cff',
    skills: [
      { name: 'Python', level: 'Proficient' },
      { name: 'SQL', level: 'Intermediate' },
      { name: 'Java', level: 'Beginner' },
      { name: 'C', level: 'Beginner' },
    ],
    projects: ['gateorchestra', 'whototrust', 'neurolens', 'caar', 'compute-bazaar', 'jocky'],
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description:
      'Classical ML, deep learning and the evaluation work that shows whether a model really helps.',
    color: '#5ee1ff',
    skills: [
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'Generative AI', level: 'Intermediate' },
      { name: 'Model Evaluation', level: 'Intermediate' },
      { name: 'Feature Engineering', level: 'Intermediate' },
      { name: 'Deep Learning', level: 'Beginner' },
      { name: 'Computer Vision', level: 'Beginner' },
    ],
    projects: ['whototrust', 'neurolens', 'gateorchestra'],
  },
  {
    id: 'llm',
    name: 'LLM Engineering',
    description: 'Large language models inside real systems: retrieval, prompting and evaluation.',
    color: '#c084fc',
    skills: [
      { name: 'LLMs', level: 'Intermediate' },
      { name: 'RAG', level: 'Intermediate' },
      { name: 'Prompt Engineering', level: 'Intermediate' },
      { name: 'LLM Evaluation' },
    ],
    projects: ['caar', 'gateorchestra'],
  },
  {
    id: 'agentic',
    name: 'Agentic AI',
    description:
      'Agents that reason, debate and reflect, and the orchestration that decides when to use them.',
    color: '#8b5cf6',
    skills: [
      { name: 'AI Agents', level: 'Intermediate' },
      { name: 'Multi-Agent Systems', level: 'Intermediate' },
      { name: 'ReAct', level: 'Intermediate' },
      { name: 'Reflexion', level: 'Intermediate' },
      { name: 'Debate Agents', level: 'Intermediate' },
    ],
    projects: ['gateorchestra', 'compute-bazaar', 'caar'],
  },
  {
    id: 'optimisation',
    name: 'AI Optimisation',
    description: 'Spending compute wisely: adaptive routing, bandits and market-based resource allocation.',
    color: '#f5b301',
    skills: [
      { name: 'Adaptive LLM Routing', level: 'Intermediate' },
      { name: 'Reinforcement Learning' },
      { name: 'Resource Allocation' },
    ],
    projects: ['caar', 'compute-bazaar', 'gateorchestra'],
  },
  {
    id: 'backend',
    name: 'Backend',
    description: 'APIs and persistence that turn research code into services people can use.',
    color: '#34d399',
    skills: [
      { name: 'FastAPI', level: 'Proficient' },
      { name: 'REST APIs' },
      { name: 'SQLite' },
      { name: 'SQLAlchemy' },
    ],
    projects: ['caar', 'compute-bazaar', 'jocky', 'gateorchestra'],
  },
  {
    id: 'data',
    name: 'Data Science',
    description: 'Exploring, cleaning and visualising data before any model sees it.',
    color: '#fb923c',
    skills: [
      { name: 'NumPy', level: 'Intermediate' },
      { name: 'Pandas', level: 'Intermediate' },
      { name: 'scikit-learn', level: 'Intermediate' },
      { name: 'Matplotlib', level: 'Beginner' },
      { name: 'Seaborn', level: 'Beginner' },
    ],
    projects: ['whototrust', 'neurolens'],
  },
  {
    id: 'tools',
    name: 'Developer Tools',
    description: 'The everyday toolkit, including AI assistants used as part of the workflow.',
    color: '#94a3b8',
    skills: [
      { name: 'Git & GitHub', level: 'Intermediate' },
      { name: 'Pytest', level: 'Intermediate' },
      { name: 'Jupyter Notebook', level: 'Intermediate' },
      { name: 'Groq API, LiteLLM', level: 'Intermediate' },
      { name: 'VS Code' },
      { name: 'Claude AI' },
      { name: 'OpenAI' },
    ],
    projects: ['gateorchestra', 'whototrust', 'neurolens', 'caar', 'compute-bazaar', 'jocky'],
  },
];
