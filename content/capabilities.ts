import { capabilitiesSchema } from './schemas';

const data = [
  {
    id: 'models-training',
    index: 1,
    title: 'Models & Training',
    description: 'Adapting and aligning open-weight and frontier models for production workloads.',
    items: [
      { name: 'LoRA / QLoRA Fine-tuning', detail: 'Parameter-efficient adaptation' },
      { name: 'DPO / RLHF', detail: 'Alignment and preference tuning' },
      { name: 'Model Distillation', detail: 'Compressing capabilities' },
      { name: 'Synthetic Data Gen', detail: 'Generating high-quality training sets' },
      { name: 'PyTorch / JAX', detail: 'Deep learning frameworks' },
    ],
  },
  {
    id: 'retrieval-agents',
    index: 2,
    title: 'Retrieval & Agents',
    description: 'Grounding generation in real data and coordinating multi-step agent behavior.',
    items: [
      { name: 'Advanced RAG', detail: 'Hybrid search, re-ranking, query routing' },
      { name: 'Vector Databases', detail: 'Pinecone, Qdrant, Milvus' },
      { name: 'Multi-Agent Orchestration', detail: 'Autogen, LangGraph' },
      { name: 'Tool Use / Function Calling', detail: 'API integration' },
      { name: 'Graph RAG', detail: 'Knowledge graph augmented retrieval' },
    ],
  },
  {
    id: 'evals-observability',
    index: 3,
    title: 'Evals & Observability',
    description: 'Measuring quality continuously so regressions get caught before users do.',
    items: [
      { name: 'Automated Red Teaming', detail: 'Vulnerability testing' },
      { name: 'LLM-as-a-Judge', detail: 'Scalable evaluation metrics' },
      { name: 'Tracing & Logging', detail: 'LangSmith, Phoenix' },
      { name: 'Regression Testing', detail: 'CI/CD for prompt engineering' },
      { name: 'Prompt Versioning', detail: 'Managing prompt lifecycle' },
    ],
  },
  {
    id: 'infra-serving',
    index: 4,
    title: 'Infra & Serving',
    description: 'Running inference at scale without blowing the latency or cost budget.',
    items: [
      { name: 'vLLM / TGI', detail: 'High-throughput serving engines' },
      { name: 'Continuous Batching', detail: 'Inference optimization' },
      { name: 'Model Quantization', detail: 'AWQ, GPTQ, GGUF' },
      { name: 'Kubernetes / Docker', detail: 'Container orchestration' },
      { name: 'GPU Provisioning', detail: 'AWS, GCP, RunPod' },
    ],
  },
  {
    id: 'product-engineering',
    index: 5,
    title: 'Product Engineering',
    description: 'Turning model capability into interfaces people can actually use.',
    items: [
      { name: 'TypeScript / React', detail: 'Frontend development' },
      { name: 'Next.js', detail: 'Full-stack React framework' },
      { name: 'Tailwind CSS', detail: 'Rapid UI styling' },
      { name: 'API Design', detail: 'REST, GraphQL, gRPC' },
      { name: 'System Architecture', detail: 'Scalable system design' },
    ],
  },
];

export const capabilities = capabilitiesSchema.parse(data);
