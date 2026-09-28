'use client';

import { useMemo, useState } from 'react';
import { embed, cosineSimilarity } from '@/lib/lab-math';

const VOCAB = [
  'transformer', 'attention', 'self-attention', 'embedding', 'tokenizer',
  'gradient descent', 'backpropagation', 'loss function', 'fine-tuning',
  'pretraining', 'quantization', 'distillation', 'RAG', 'retrieval',
  'vector database', 'cosine similarity', 'softmax', 'layer norm',
  'residual connection', 'positional encoding', 'multi-head attention',
  'cross-entropy', 'perplexity', 'hallucination', 'prompt engineering',
  'few-shot learning', 'zero-shot learning', 'chain of thought',
  'reinforcement learning', 'RLHF', 'reward model', 'policy gradient',
  'diffusion model', 'autoencoder', 'latent space', 'convolution',
  'recurrent network', 'LSTM', 'dropout', 'batch normalization',
  'overfitting', 'regularization', 'hyperparameter', 'learning rate',
  'KV cache', 'inference latency', 'beam search', 'top-k sampling',
  'temperature', 'MoE', 'sparse expert', 'context window',
  'instruction tuning', 'alignment', 'guardrails', 'agentic workflow',
  'function calling', 'multimodal', 'CLIP', 'LoRA',
];

const EMBED_DIM = 24;
const TOP_K = 8;

interface Neighbor {
  term: string;
  similarity: number;
  vector: number[];
}

const vocabVectors: Record<string, number[]> = Object.fromEntries(
  VOCAB.map((term) => [term, embed(term, EMBED_DIM)]),
);

function rank(query: string): Neighbor[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const queryVec = vocabVectors[trimmed.toLowerCase()] ?? embed(trimmed, EMBED_DIM);

  return VOCAB
    .filter((term) => term.toLowerCase() !== trimmed.toLowerCase())
    .map((term) => {
      const vector = vocabVectors[term] ?? embed(term, EMBED_DIM);
      return { term, similarity: cosineSimilarity(queryVec, vector), vector };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, TOP_K);
}

/** Deterministic 2D projection: use dims 0/1 for placement, similarity for radius weighting. */
function scatterPosition(vector: number[], similarity: number): { x: number; y: number } {
  const vx = vector[0] ?? 0;
  const vy = vector[1] ?? 0;
  // Blend the raw embedding direction with a similarity-driven radius so
  // closer neighbors sit nearer the center — a legible, deterministic
  // "embedding space" reading rather than a plain table.
  const angle = Math.atan2(vy, vx);
  const radius = (1 - similarity) * 46; // percent from center
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  return { x: Math.min(96, Math.max(4, x)), y: Math.min(96, Math.max(4, y)) };
}

export function EmbeddingNearestNeighbors() {
  const [query, setQuery] = useState('transformer');

  const neighbors = useMemo(() => rank(query), [query]);

  return (
    <div>
      <label htmlFor="embedding-query" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
        Query term
      </label>
      <input
        id="embedding-query"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-mono text-base text-[var(--color-fg)]"
        placeholder="e.g. quantization, RAG, gradient descent…"
      />
      <p className="mt-3 font-mono text-xs text-[var(--color-muted)]">
        {VOCAB.length}-term fixed vocabulary, each with a deterministic {EMBED_DIM}-dim toy embedding (hash-seeded,
        not learned). Any query term is embedded the same way and ranked by cosine similarity.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
            Top {TOP_K} nearest neighbors
          </span>
          {neighbors.length === 0 ? (
            <p className="font-mono text-sm text-[var(--color-muted)]">Type a term to query the vocabulary.</p>
          ) : (
            <ol className="border border-[var(--color-rule)] divide-y divide-[var(--color-rule)]">
              {neighbors.map((n, i) => (
                <li key={n.term} className="flex items-center gap-4 px-4 py-2.5">
                  <span className="font-mono font-tabular text-xs text-[var(--color-muted)] w-5">{i + 1}</span>
                  <span className="font-mono text-sm text-[var(--color-fg)] flex-1">{n.term}</span>
                  <span className="font-mono font-tabular text-sm text-[var(--color-accent)]">
                    {n.similarity.toFixed(3)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
            2D projection (dims 0/1, radius = 1&minus;similarity)
          </span>
          <div className="relative w-full aspect-square border border-[var(--color-rule)] bg-[var(--color-bg)]">
            {/* center = query */}
            {neighbors.length > 0 && (
              <div
                className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-fg)]"
                style={{ left: '50%', top: '50%' }}
                title={query}
              />
            )}
            {neighbors.map((n) => {
              const { x, y } = scatterPosition(n.vector, n.similarity);
              return (
                <div
                  key={n.term}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)', opacity: 0.4 + n.similarity * 0.6 }}
                  />
                  <span className="mt-1 font-mono text-[9px] text-[var(--color-muted)] whitespace-nowrap">
                    {n.term}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
