import { ossListSchema } from './schemas';

/* PLACEHOLDER: repo urls point to a placeholder GitHub username */
const data = [
  {
    id: 'rag-eval-suite',
    name: 'rag-eval-suite',
    description: 'A comprehensive toolkit for evaluating Retrieval-Augmented Generation pipelines across multiple dimensions.',
    language: 'Python',
    stars: 1240,
    url: 'https://github.com/placeholder/rag-eval-suite',
    purpose: 'Standardize RAG quality measurement across chunking, retrieval, and generation stages.',
    featured: true,
  },
  {
    id: 'agent-orchestrator-core',
    name: 'agent-orchestrator-core',
    description: 'Lightweight and resilient state machine framework for orchestrating LLM-powered multi-agent systems.',
    language: 'TypeScript',
    stars: 850,
    url: 'https://github.com/placeholder/agent-orchestrator-core',
    purpose: 'Give multi-agent systems predictable failure recovery and context sharing.',
    featured: true,
  },
  {
    id: 'fast-inference-gateway',
    name: 'fast-inference-gateway',
    description: 'A dynamic routing gateway built to efficiently distribute inference requests across multiple model serving backends.',
    language: 'Rust',
    stars: 620,
    url: 'https://github.com/placeholder/fast-inference-gateway',
    purpose: 'Route inference traffic across heterogeneous serving clusters with minimal overhead.',
    featured: false,
  },
  {
    id: 'prompt-versioning-cli',
    name: 'prompt-versioning-cli',
    description: 'A CLI tool to track, version, and collaborate on prompts, fully integrated with Git workflows.',
    language: 'Go',
    stars: 415,
    url: 'https://github.com/placeholder/prompt-versioning-cli',
    purpose: 'Bring version control discipline to prompt engineering.',
    featured: false,
  },
  {
    id: 'synthetic-data-gen',
    name: 'synthetic-data-gen',
    description: 'Pipeline for generating high-quality synthetic datasets using open-weight models for fine-tuning.',
    language: 'Python',
    stars: 390,
    url: 'https://github.com/placeholder/synthetic-data-gen',
    purpose: 'Produce labeled fine-tuning data without a human annotation pipeline.',
    featured: false,
  },
];

export const oss = ossListSchema.parse(data);
