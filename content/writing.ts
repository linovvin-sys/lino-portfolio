import { writingListSchema } from './schemas';

/* PLACEHOLDER: urls point to '#' until real posts/talks are published */
const data = [
  {
    id: 'hidden-costs-of-rag',
    title: 'The Hidden Costs of RAG: Latency vs Performance',
    type: 'blog' as const,
    date: '2025-01-15',
    venue: 'Personal Blog',
    description: 'An in-depth analysis of how different chunking strategies and retrieval mechanisms impact user-facing latency and overall generation quality.',
    featured: true,
  },
  {
    id: 'scaling-multi-agent-workflows',
    title: 'Scaling Multi-Agent Workflows in Production',
    type: 'talk' as const,
    date: '2024-11-10',
    venue: 'AI Engineering Summit',
    description: 'A presentation on the architectural patterns required to orchestrate robust, parallel AI agent workflows and handle complex failure modes gracefully.',
    featured: true,
  },
  {
    id: 'eval-driven-development',
    title: 'Eval-Driven Development for LLMs',
    type: 'workshop' as const,
    date: '2024-08-22',
    venue: 'MLOps World',
    description: 'A hands-on workshop teaching teams how to build CI/CD pipelines that incorporate LLM-as-a-judge evaluations and regression testing.',
    featured: false,
  },
  {
    id: 'optimizing-open-weight-models',
    title: 'Optimizing Open-Weight Models on Kubernetes',
    type: 'blog' as const,
    date: '2024-05-05',
    venue: 'Towards Data Science',
    description: 'A technical guide on deploying and scaling vLLM clusters using continuous batching to maximize GPU utilization.',
    featured: false,
  },
  {
    id: 'kv-cache-management',
    title: 'Efficient KV Cache Management Strategies',
    type: 'paper' as const,
    date: '2023-12-01',
    venue: 'ArXiv',
    description: 'A research paper exploring novel techniques for managing the KV cache in transformer-based models to extend context windows without memory explosion.',
    featured: false,
  },
  {
    id: 'reliable-agents-json-schemas',
    title: 'Building Reliable Agents with Strict JSON Schemas',
    type: 'talk' as const,
    date: '2023-09-15',
    venue: 'Developer Meetup SF',
    description: 'A tactical talk on using constrained generation and strict parsing to ensure reliability when using function calling in production.',
    featured: false,
  },
];

export const writing = writingListSchema.parse(data);
