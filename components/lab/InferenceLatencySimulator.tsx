'use client';

import { useMemo, useState } from 'react';

const MODEL_SIZES = [
  { label: '7B', params: 7, factor: 1 },
  { label: '13B', params: 13, factor: 13 / 7 },
  { label: '70B', params: 70, factor: 70 / 7 },
] as const;

type ModelSizeLabel = (typeof MODEL_SIZES)[number]['label'];

// Simplified analytical constants (ms), calibrated only to look plausible —
// not measured against a real deployment. Everything downstream is derived
// arithmetic from the inputs, not a lookup table.
const PREFILL_MS_PER_TOKEN_7B = 0.35;
const DECODE_MS_PER_TOKEN_7B = 12;
const KV_CACHE_DISCOUNT = 0.4; // decode cost multiplier when KV cache is on
const BATCH_DECODE_SUBLINEARITY = 0.65; // decode scales with batch^exponent, not linearly
const P95_JITTER = 1.6;

interface LatencyEstimate {
  prefillMs: number;
  decodeMsPerToken: number;
  totalDecodeMs: number;
  p50Ms: number;
  p95Ms: number;
}

function estimateLatency(params: {
  batchSize: number;
  sequenceLength: number;
  outputTokens: number;
  modelFactor: number;
  kvCache: boolean;
}): LatencyEstimate {
  const { batchSize, sequenceLength, outputTokens, modelFactor, kvCache } = params;

  const prefillMs = sequenceLength * PREFILL_MS_PER_TOKEN_7B * modelFactor * Math.pow(batchSize, 0.5);

  const kvMultiplier = kvCache ? KV_CACHE_DISCOUNT : 1;
  const decodeMsPerToken =
    (DECODE_MS_PER_TOKEN_7B * modelFactor * kvMultiplier * Math.pow(batchSize, BATCH_DECODE_SUBLINEARITY)) /
    batchSize;
  const totalDecodeMs = decodeMsPerToken * outputTokens;

  const p50Ms = prefillMs + totalDecodeMs;
  const p95Ms = p50Ms * P95_JITTER;

  return { prefillMs, decodeMsPerToken, totalDecodeMs, p50Ms, p95Ms };
}

function fmt(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${ms.toFixed(1)}ms`;
}

export function InferenceLatencySimulator() {
  const [batchSize, setBatchSize] = useState(4);
  const [sequenceLength, setSequenceLength] = useState(512);
  const [outputTokens, setOutputTokens] = useState(256);
  const [modelSize, setModelSize] = useState<ModelSizeLabel>('13B');
  const [kvCache, setKvCache] = useState(true);

  const model = MODEL_SIZES.find((m) => m.label === modelSize) ?? MODEL_SIZES[0];

  const estimate = useMemo(
    () =>
      estimateLatency({
        batchSize,
        sequenceLength,
        outputTokens,
        modelFactor: model.factor,
        kvCache,
      }),
    [batchSize, sequenceLength, outputTokens, model.factor, kvCache],
  );

  const maxBarMs = Math.max(estimate.p95Ms, 1);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="batch-size" className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Batch size
            </label>
            <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{batchSize}</span>
          </div>
          <input
            id="batch-size"
            type="range"
            min={1}
            max={64}
            step={1}
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="seq-length" className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Prompt length (tokens)
            </label>
            <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{sequenceLength}</span>
          </div>
          <input
            id="seq-length"
            type="range"
            min={16}
            max={4096}
            step={16}
            value={sequenceLength}
            onChange={(e) => setSequenceLength(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="output-tokens" className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Output tokens
            </label>
            <span className="font-mono font-tabular text-sm text-[var(--color-fg)]">{outputTokens}</span>
          </div>
          <input
            id="output-tokens"
            type="range"
            min={1}
            max={2048}
            step={1}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">
            Model size
          </span>
          <div className="flex gap-2">
            {MODEL_SIZES.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setModelSize(m.label)}
                aria-pressed={modelSize === m.label}
                className={`flex-1 font-mono text-sm py-2 border transition-colors ${
                  modelSize === m.label
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3 mb-8 font-mono text-sm text-[var(--color-fg)] cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={kvCache}
          onChange={(e) => setKvCache(e.target.checked)}
          className="accent-[var(--color-accent)] w-4 h-4"
        />
        KV cache enabled
      </label>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-[var(--color-rule)] p-4">
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">
            p50 estimate
          </span>
          <span className="font-mono font-tabular text-3xl text-[var(--color-fg)]">{fmt(estimate.p50Ms)}</span>
        </div>
        <div className="border border-[var(--color-rule)] p-4">
          <span className="block font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">
            p95 estimate
          </span>
          <span className="font-mono font-tabular text-3xl text-[var(--color-accent)]">{fmt(estimate.p95Ms)}</span>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <BarRow label="Prefill" ms={estimate.prefillMs} max={maxBarMs} />
        <BarRow label="Decode" ms={estimate.totalDecodeMs} max={maxBarMs} />
      </div>

      <details className="border border-[var(--color-rule)] p-4">
        <summary className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)] cursor-pointer">
          Model &amp; assumptions
        </summary>
        <div className="mt-3 font-mono text-xs text-[var(--color-muted)] leading-relaxed space-y-2">
          <p>
            This is a simplified analytical model, not a benchmark. Prefill time scales roughly with prompt
            length &times; model-size factor &times; &radic;batch. Per-token decode time scales with model-size
            factor / batch<sup>0.35</sup>, discounted {Math.round((1 - KV_CACHE_DISCOUNT) * 100)}% when KV cache
            is enabled. p95 is p50 &times; {P95_JITTER} to represent scheduling/contention jitter.
          </p>
          <p>
            Decode: {fmt(estimate.decodeMsPerToken)}/token &times; {outputTokens} tokens = {fmt(estimate.totalDecodeMs)}.
            Model factor for {modelSize}: {model.factor.toFixed(2)}&times; the 7B baseline.
          </p>
        </div>
      </details>
    </div>
  );
}

function BarRow({ label, ms, max }: { label: string; ms: number; max: number }) {
  const pct = Math.min(100, (ms / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-mono text-xs text-[var(--color-muted)]">{label}</span>
        <span className="font-mono font-tabular text-xs text-[var(--color-fg)]">{fmt(ms)}</span>
      </div>
      <div className="h-2 bg-[var(--color-code-bg)] border border-[var(--color-rule)]">
        <div className="h-full bg-[var(--color-accent)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
