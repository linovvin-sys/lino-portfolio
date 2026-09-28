'use client';

import { useMemo, useState } from 'react';
import { embed, dot, softmax, splitWords } from '@/lib/lab-math';

const DEFAULT_SENTENCE = 'the model attends to relevant tokens';
const EMBED_DIM = 16;
const MAX_TOKENS = 24;

interface AttentionResult {
  tokens: string[];
  matrix: number[][];
}

function computeAttention(sentence: string): AttentionResult {
  const rawTokens = splitWords(sentence).slice(0, MAX_TOKENS);
  const tokens = rawTokens.length > 0 ? rawTokens : [];

  // Deterministic per-token embedding, then linear "query"/"key" projections
  // built from a second stable hash pass so Q and K aren't identical to the
  // raw embedding (still fully deterministic, no learned weights involved).
  const queries = tokens.map((t) => embed(`q:${t}`, EMBED_DIM));
  const keys = tokens.map((t) => embed(`k:${t}`, EMBED_DIM));

  const scale = Math.sqrt(EMBED_DIM);
  const matrix: number[][] = queries.map((q) => {
    const scores = keys.map((k) => dot(q, k) / scale);
    return softmax(scores);
  });

  return { tokens, matrix };
}

export function AttentionHeatmap() {
  const [sentence, setSentence] = useState(DEFAULT_SENTENCE);

  const { tokens, matrix } = useMemo(() => computeAttention(sentence), [sentence]);

  return (
    <div>
      <label htmlFor="attention-input" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
        Sentence (max {MAX_TOKENS} tokens)
      </label>
      <input
        id="attention-input"
        type="text"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        className="w-full bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-mono text-base text-[var(--color-fg)]"
        placeholder="Type a short sentence…"
      />
      <p className="mt-3 font-mono text-xs text-[var(--color-muted)]">
        Each token gets a deterministic {EMBED_DIM}-dim toy embedding (hash-seeded, not learned). Query/key
        vectors are dot-producted, scaled by 1/&radic;d, and softmaxed per row — real scaled dot-product
        attention mechanics over toy weights.
      </p>

      <div className="mt-8 overflow-x-auto">
        {tokens.length === 0 ? (
          <p className="font-mono text-sm text-[var(--color-muted)]">Type a sentence to compute attention.</p>
        ) : (
          <div
            className="inline-grid gap-px bg-[var(--color-rule)] border border-[var(--color-rule)]"
            style={{ gridTemplateColumns: `auto repeat(${tokens.length}, minmax(2.5rem, 1fr))` }}
          >
            {/* Header row */}
            <div className="bg-[var(--color-bg)]" />
            {tokens.map((t, j) => (
              <div
                key={`col-${j}`}
                className="bg-[var(--color-bg)] px-2 py-2 font-mono text-[10px] text-[var(--color-muted)] text-center truncate"
                title={t}
              >
                {t}
              </div>
            ))}

            {/* Rows */}
            {matrix.map((row, i) => (
              <RowCells key={`row-${i}`} token={tokens[i] ?? ''} row={row} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RowCells({ token, row }: { token: string; row: number[] }) {
  return (
    <>
      <div className="bg-[var(--color-bg)] px-2 py-2 font-mono text-[10px] text-[var(--color-muted)] text-right whitespace-nowrap" title={token}>
        {token}
      </div>
      {row.map((value, j) => (
        <div
          key={j}
          className="aspect-square flex items-center justify-center font-mono font-tabular text-[9px]"
          style={{
            backgroundColor: `color-mix(in srgb, var(--color-accent) ${Math.round(value * 100)}%, var(--color-bg))`,
            color: value > 0.5 ? 'var(--color-bg)' : 'var(--color-muted)',
          }}
          title={value.toFixed(3)}
        >
          {value >= 0.1 ? value.toFixed(2) : ''}
        </div>
      ))}
    </>
  );
}
