import type { Certificate } from '@/types/content';

/**
 * Only verified fields are filled in. Dates, credential IDs, verification links and images
 * stay undefined until Muzra supplies them (see docs/CERTIFICATE_AUDIT.md).
 */
export const certificates: Certificate[] = [
  { id: 'anthropic-ai-fluency', name: 'AI Fluency: Framework & Foundations', issuer: 'Anthropic' },
  { id: 'anthropic-ai-fluency-students', name: 'AI Fluency for Students', issuer: 'Anthropic' },
  { id: 'anthropic-claude-api', name: 'Claude with the Anthropic API', issuer: 'Anthropic' },
  { id: 'anthropic-agent-skills', name: 'Introduction to Agent Skills', issuer: 'Anthropic' },
  { id: 'aws-genai', name: 'Generative AI Foundations', issuer: 'AWS Academy' },
  { id: 'aws-ml', name: 'Machine Learning Foundations', issuer: 'AWS Academy' },
  { id: 'aws-nlp', name: 'Machine Learning for NLP', issuer: 'AWS Academy' },
  { id: 'aws-data-eng', name: 'Data Engineering', issuer: 'AWS Academy' },
  { id: 'cisco-modern-ai', name: 'Introduction to Modern AI', issuer: 'Cisco Networking Academy' },
  { id: 'cisco-data-science', name: 'Introduction to Data Science', issuer: 'Cisco Networking Academy' },
  { id: 'cisco-python-2', name: 'Python Essentials 2', issuer: 'Cisco Networking Academy' },
  { id: 'cisco-apply-ai', name: 'Apply AI: Analyze Customer Reviews', issuer: 'Cisco Networking Academy' },
  { id: 'cisco-ccna-itn', name: 'CCNA: Introduction to Networks', issuer: 'Cisco Networking Academy' },
  { id: 'fcc-sci-python', name: 'Scientific Computing with Python', issuer: 'freeCodeCamp' },
  {
    id: 'task-frontend',
    name: 'Frontend Development with HTML5 & CSS3',
    issuer: 'Telangana Academy for Skill and Knowledge',
  },
];

export const certificateIssuers = [...new Set(certificates.map((c) => c.issuer))];
