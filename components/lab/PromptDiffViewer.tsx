'use client';

import { useMemo, useState } from 'react';
import { diffWords, type DiffSegment } from '@/lib/lab-diff';

const DEFAULT_BEFORE = 'You are a helpful assistant. Answer the user question concisely.';
const DEFAULT_AFTER = 'You are a precise, technical assistant. Answer the user question concisely and cite sources when possible.';

const MAX_DIFF_TOKENS = 1500;

export function PromptDiffViewer() {
  const [before, setBefore] = useState(DEFAULT_BEFORE);
  const [after, setAfter] = useState(DEFAULT_AFTER);

  const { segments, truncated } = useMemo(() => {
    const tooLong = before.length > MAX_DIFF_TOKENS * 6 || after.length > MAX_DIFF_TOKENS * 6;
    if (tooLong) {
      return {
        segments: [] as DiffSegment[],
        truncated: true,
      };
    }
    return { segments: diffWords(before, after), truncated: false };
  }, [before, after]);

  const additions = segments.filter((s) => s.op === 'insert').length;
  const deletions = segments.filter((s) => s.op === 'delete').length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="diff-before" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
            Before
          </label>
          <textarea
            id="diff-before"
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={6}
            className="w-full resize-y bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-mono text-sm text-[var(--color-fg)]"
          />
        </div>
        <div>
          <label htmlFor="diff-after" className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-3">
            After
          </label>
          <textarea
            id="diff-after"
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            rows={6}
            className="w-full resize-y bg-[var(--color-bg)] border border-[var(--color-rule)] p-4 font-mono text-sm text-[var(--color-fg)]"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">Word-level diff</span>
          <span className="font-mono font-tabular text-xs text-[var(--color-muted)]">
            +{additions} / -{deletions} segments
          </span>
        </div>

        <div className="border border-[var(--color-rule)] bg-[var(--color-bg)] p-4 font-body text-base leading-relaxed whitespace-pre-wrap">
          {truncated && (
            <span className="font-mono text-xs text-[var(--color-muted)]">
              Input too long for the live diff view ({MAX_DIFF_TOKENS * 6}+ characters) — trim either side to see the diff.
            </span>
          )}
          {!truncated && segments.length === 0 && (
            <span className="font-mono text-xs text-[var(--color-muted)]">Nothing to diff yet.</span>
          )}
          {!truncated &&
            segments.map((segment, i) => {
              if (segment.op === 'equal') {
                return <span key={i}>{segment.value}</span>;
              }
              if (segment.op === 'insert') {
                return (
                  <span
                    key={i}
                    className="bg-[var(--color-accent)]/15 text-[var(--color-fg)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-2"
                  >
                    {segment.value}
                  </span>
                );
              }
              return (
                <span key={i} className="text-[var(--color-muted)] line-through decoration-1">
                  {segment.value}
                </span>
              );
            })}
        </div>
      </div>
    </div>
  );
}
