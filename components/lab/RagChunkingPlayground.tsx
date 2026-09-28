'use client';

import { useMemo, useState } from 'react';
import { clamp } from '@/lib/utils';

const DEFAULT_TEXT = `Retrieval-augmented generation (RAG) grounds a language model's output in an external corpus. At index time, documents are split into chunks, embedded, and stored in a vector index. At query time, the user's question is embedded and the nearest chunks are retrieved and stuffed into the prompt as context. Chunk size and overlap are the two levers that most affect retrieval quality: chunks that are too large dilute relevance and blow the context budget, while chunks that are too small lose surrounding context and fragment ideas across boundaries. Overlap between consecutive chunks helps preserve continuity for ideas that straddle a chunk boundary, at the cost of redundant tokens in the index.`;

interface Chunk {
  index: number;
  text: string;
  start: number;
  end: number;
  overlapWithNext: string;
}

function computeChunks(text: string, chunkSize: number, overlap: number): Chunk[] {
  if (text.length === 0 || chunkSize <= 0) return [];
  const safeOverlap = clamp(overlap, 0, chunkSize - 1);
  const step = chunkSize - safeOverlap;
  if (step <= 0) return [];

  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const slice = text.slice(start, end);
    chunks.push({ index, text: slice, start, end, overlapWithNext: '' });
    index++;
    if (end >= text.length) break;
    start += step;
  }

  // Compute the actual overlapping substring shared with the next chunk.
  for (let i = 0; i < chunks.length - 1; i++) {
    const current = chunks[i];
    const next = chunks[i + 1];
    if (!current || !next) continue;
    const overlapLen = Math.max(0, current.end - next.start);
    current.overlapWithNext = overlapLen > 0 ? current.text.slice(current.text.length - overlapLen) : '';
  }

  return chunks;
}

export function RagChunkingPlayground() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [chunkSize, setChunkSize] = useState(220);
  const [overlap, setOverlap] = useState(40);

  const chunks = useMemo(() => computeChunks(text, chunkSize, overlap), [text, chunkSize, overlap]);

  return (
    <div>
      <label htmlFor="rag-input" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
        Source text
      </label>
      <textarea
        id="rag-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full resize-y bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-body text-base text-[var(--color-fg)]"
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="chunk-size" className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Chunk size (chars)
            </label>
            <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{chunkSize}</span>
          </div>
          <input
            id="chunk-size"
            type="range"
            min={20}
            max={600}
            step={10}
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="chunk-overlap" className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Overlap (chars)
            </label>
            <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{overlap}</span>
          </div>
          <input
            id="chunk-overlap"
            type="range"
            min={0}
            max={Math.max(0, chunkSize - 1)}
            step={5}
            value={Math.min(overlap, Math.max(0, chunkSize - 1))}
            onChange={(e) => setOverlap(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
          {chunks.length} chunk{chunks.length === 1 ? '' : 's'}
        </span>
        <span className="font-mono text-xs text-[var(--color-muted)]">
          Highlighted text is shared with the next chunk
        </span>
      </div>

      <div className="mt-4 space-y-3 max-h-[32rem] overflow-y-auto pr-1">
        {chunks.map((chunk) => (
          <div key={chunk.index} className="border border-[var(--color-rule)] bg-[var(--color-bg)] p-4">
            <div className="flex items-baseline justify-between mb-2 font-mono text-xs text-[var(--color-muted)]">
              <span>
                Chunk {chunk.index + 1} · chars {chunk.start}–{chunk.end}
              </span>
              <span className="font-tabular">{chunk.text.length} chars</span>
            </div>
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-fg)]">
              {chunk.overlapWithNext && chunk.text.endsWith(chunk.overlapWithNext) ? (
                <>
                  {chunk.text.slice(0, chunk.text.length - chunk.overlapWithNext.length)}
                  <span className="bg-[var(--color-accent)]/20 text-[var(--color-fg)]">{chunk.overlapWithNext}</span>
                </>
              ) : (
                chunk.text
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
