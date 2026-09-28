import { experienceListSchema } from './schemas';

const data = [
  {
    id: 'techflow-ai',
    company: 'TechFlow AI',
    role: 'Senior GenAI Engineer',
    location: 'San Francisco, CA',
    type: 'full-time' as const,
    period: { start: '2023', end: 'Present' },
    description: 'Leading the AI infrastructure team to build scalable serving platforms and multi-agent workflows for enterprise automation products.',
    impacts: [
      { metric: '-45% p90 latency', description: 'Cut inference latency using continuous batching and vLLM deployments.' },
      { metric: '65% -> 88% task success', description: 'Designed a multi-agent orchestration layer that increased end-to-end task success rate.' },
    ],
    stack: ['Python', 'Rust', 'Kubernetes', 'vLLM', 'PostgreSQL'],
  },
  {
    id: 'datasphere',
    company: 'DataSphere',
    role: 'Machine Learning Engineer',
    location: 'New York, NY',
    type: 'full-time' as const,
    period: { start: '2021', end: '2023' },
    description: 'Developed traditional NLP and early generative pipelines for content summarization and semantic search.',
    impacts: [
      { metric: '+22% CTR', description: 'Deployed an embedding-based search system that improved click-through rate.' },
      { metric: '15 hrs/week saved', description: 'Integrated fine-tuned language models that reduced editorial team workload.' },
    ],
    stack: ['Python', 'PyTorch', 'Hugging Face', 'Elasticsearch'],
  },
  {
    id: 'cognitive-insights',
    company: 'Cognitive Insights',
    role: 'Data Scientist',
    location: 'Boston, MA',
    type: 'full-time' as const,
    period: { start: '2019', end: '2021' },
    description: 'Trained predictive models and performed exploratory data analysis on large-scale consumer datasets.',
    impacts: [
      { metric: '83% precision', description: 'Built a churn prediction model that led to targeted retention campaigns.' },
      { metric: '-40% manual processing', description: 'Automated reporting pipelines, reducing manual data processing time.' },
    ],
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'SQL'],
  },
  {
    id: 'university-ai-lab',
    company: 'University AI Lab',
    role: 'Research Assistant',
    location: 'Cambridge, MA',
    type: 'research' as const,
    period: { start: '2018', end: '2019' },
    description: 'Assisted in research focused on natural language processing and neural network architectures.',
    impacts: [
      { metric: 'Co-authored paper', description: 'Published research on attention mechanisms in low-resource languages.' },
      { metric: '+15% faster convergence', description: 'Optimized training scripts, speeding up model convergence.' },
    ],
    stack: ['Python', 'TensorFlow', 'Bash'],
  },
];

export const experience = experienceListSchema.parse(data);
