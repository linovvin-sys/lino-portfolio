import { labListSchema } from './schemas';

/* PLACEHOLDER */
const data = [
  {
    id: 'tokenizer-visualizer',
    title: 'Tokenizer Visualizer',
    description: 'Type any string and watch it split into subword tokens in real time, with per-token ids color-coded by boundary.',
    category: 'tokenizer',
    status: 'live',
    component: 'TokenizerVisualizer',
    techStack: ['TypeScript', 'Regex BPE'],
  },
  {
    id: 'prompt-diff-viewer',
    title: 'Prompt Diff Viewer',
    description: 'Paste two prompt revisions and get a token-level diff, useful for auditing prompt-engineering changes before a deploy.',
    category: 'prompting',
    status: 'live',
    component: 'PromptDiffViewer',
    techStack: ['TypeScript', 'Myers diff'],
  },
  {
    id: 'attention-heatmap',
    title: 'Attention Heatmap',
    description: 'A toy single-head self-attention computed client-side over your input, rendered as a query x key heatmap.',
    category: 'attention',
    status: 'live',
    component: 'AttentionHeatmap',
    techStack: ['TypeScript', 'Canvas'],
  },
  {
    id: 'rag-chunking-playground',
    title: 'RAG Chunking Playground',
    description: 'Tune chunk size and overlap against pasted text and see exactly how a retrieval pipeline would split it.',
    category: 'rag',
    status: 'live',
    component: 'RagChunkingPlayground',
    techStack: ['TypeScript'],
  },
  {
    id: 'embedding-nearest-neighbors',
    title: 'Embedding Nearest Neighbors',
    description: 'Query a small fixed vocabulary of toy embeddings and rank neighbors by cosine similarity.',
    category: 'embeddings',
    status: 'live',
    component: 'EmbeddingNearestNeighbors',
    techStack: ['TypeScript', 'Cosine similarity'],
  },
  {
    id: 'inference-latency-simulator',
    title: 'Inference Latency Simulator',
    description: 'Adjust batch size, sequence length, and KV-cache assumptions to see a rough p50/p95 latency estimate.',
    category: 'inference',
    status: 'live',
    component: 'InferenceLatencySimulator',
    techStack: ['TypeScript'],
  },
];

export const lab = labListSchema.parse(data);
