'use client';

import { useMemo, useState } from 'react';
import { tokenize, stableTokenId, TOKEN_PALETTE } from '@/lib/lab-math';

const DEFAULT_TEXT = 'Transformers tokenize text into subword pieces before embedding them.';

export function TokenizerVisualizer() {
  const [text, setText] = useState(DEFAULT_TEXT);

  const tokens = useMemo(() => tokenize(text), [text]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
      <div>
        <label htmlFor="tokenizer-input" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
          Input text
        </label>
        <textarea
          id="tokenizer-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full resize-y bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-body text-base text-[var(--color-fg)] focus-visible:outline-offset-2"
          placeholder="Type something to tokenize…"
        />
        <p className="mt-3 font-mono text-xs text-[var(--color-muted)]">
          Simplified WordPiece-style pass: words/punctuation split first, then any piece longer than 4
          characters is broken into 4-character chunks, continuation chunks prefixed with{' '}
          <span className="text-[var(--color-fg)]">##</span>.
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">Tokens</span>
          <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{tokens.length} total</span>
        </div>

        <div className="min-h-[8rem] flex flex-wrap gap-2 p-4 border border-[var(--color-rule)] bg-[var(--color-bg)]">
          {tokens.length === 0 && (
            <span className="font-mono text-sm text-[var(--color-muted)]">No tokens yet — type in the input.</span>
          )}
          {tokens.map((token, i) => {
            const color = TOKEN_PALETTE[i % TOKEN_PALETTE.length];
            const id = stableTokenId(token);
            return (
              <div
                key={`${token}-${i}`}
                className="flex flex-col items-center gap-1 border px-2 py-1.5"
                style={{ borderColor: color }}
              >
                <span className="font-mono text-sm" style={{ color }}>
                  {token}
                </span>
                <span className="font-mono font-tabular text-[10px] text-[var(--color-muted)]">
                  #{id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
