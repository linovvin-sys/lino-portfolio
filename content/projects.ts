import { projectsSchema } from './schemas';

/* PLACEHOLDER: thumbnails point to unshipped image assets. Slugs match content/case-studies/*.mdx 1:1. */
const data = [
  {
    slug: 'rag-pipeline',
    index: 1,
    title: 'Enterprise RAG Pipeline',
    subtitle: 'Sub-200ms retrieval over 2M+ documents with hybrid search and dynamic chunking',
    category: 'Retrieval & Agents',
    year: '2024',
    thumbnail: { src: '/placeholder-project-1.webp', alt: 'RAG Pipeline Architecture', width: 1600, height: 1200 },
    stack: ['Python', 'LangChain', 'pgvector', 'Anthropic Claude', 'FastAPI', 'Redis', 'Kubernetes'],
    metrics: [
      { label: 'p95 Latency', value: '142ms' },
      { label: 'Daily Queries', value: '50K+' },
    ],
    summary: 'Reduced average support resolution time by 34%. The system handles 50K+ queries daily with p95 retrieval latency of 142ms and p95 end-to-end response time of 1.8s.',
  },
  {
    slug: 'eval-framework',
    index: 2,
    title: 'LLM Evaluation Framework',
    subtitle: 'Automated eval pipeline catching 94% of regressions before production',
    category: 'Evals & Observability',
    year: '2024',
    thumbnail: { src: '/placeholder-project-2.webp', alt: 'Eval Framework Dashboard', width: 1600, height: 1200 },
    stack: ['Python', 'TypeScript', 'Braintrust', 'Anthropic Claude', 'OpenAI', 'PostgreSQL', 'GitHub Actions'],
    metrics: [
      { label: 'Regression Detection', value: '94%' },
      { label: 'CI Runtime', value: '< 7min' },
    ],
    summary: 'Zero LLM-related production incidents in 8 months since deployment. The framework runs 1,200+ test cases per PR in under 7 minutes.',
  },
  {
    slug: 'agent-orchestration',
    index: 3,
    title: 'Multi-Agent Orchestration System',
    subtitle: 'Coordinating 12 specialized agents to automate complex financial workflows',
    category: 'Retrieval & Agents',
    year: '2023',
    thumbnail: { src: '/placeholder-project-3.webp', alt: 'Agent Orchestration Graph', width: 1600, height: 1200 },
    stack: ['Python', 'LangGraph', 'Anthropic Claude', 'OpenAI GPT-4', 'Redis', 'PostgreSQL', 'Temporal', 'Kubernetes'],
    metrics: [
      { label: 'Time Saved', value: '87%' },
      { label: 'Task Completion', value: '96.2%' },
    ],
    summary: 'Reduced report preparation time from 6-8 hours to 45 minutes. Data inconsistencies dropped from 12% to 0.3%, and analysts now produce 4x more reports per week.',
  },
  {
    slug: 'inference-optimization',
    index: 4,
    title: 'Inference Optimization Platform',
    subtitle: '3.2x throughput improvement with 60% cost reduction through quantization and batching',
    category: 'Infra & Serving',
    year: '2023',
    thumbnail: { src: '/placeholder-project-4.webp', alt: 'Inference Optimizer Metrics', width: 1600, height: 1200 },
    stack: ['Python', 'vLLM', 'TensorRT-LLM', 'CUDA', 'Kubernetes', 'Prometheus', 'Grafana', 'Terraform'],
    metrics: [
      { label: 'Cost Reduction', value: '60%' },
      { label: 'Throughput', value: '3.2x' },
    ],
    summary: 'Reduced serving costs from $180K to $72K/month. Improved throughput by 3.2x with continuous batching, and p99 latency dropped from 8.2s to 2.1s.',
  },
];

export const projects = projectsSchema.parse(data);
