/**
 * Lab math helpers — pure, deterministic, dependency-free utilities shared
 * by the client-side Lab experiments. No Math.random() anywhere: every
 * "randomized" value here is derived from a stable string/number hash so
 * output is reproducible for a given input.
 */

/** 32-bit FNV-1a string hash. Deterministic, fast, good-enough distribution. */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Force unsigned 32-bit
  return hash >>> 0;
}

/** Short stable "token id" for display, e.g. 5-digit decimal. */
export function stableTokenId(token: string): number {
  return fnv1a(token) % 100000;
}

/**
 * Deterministic pseudo-random stream seeded by a string, using a mulberry32
 * PRNG. Used only to derive stable toy embedding vectors — never to affect
 * anything that should look "random" to the user; the same input always
 * yields the same output.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic unit-ish embedding vector for a string, given a dimension. */
export function embed(text: string, dim: number): number[] {
  const seed = fnv1a(text.toLowerCase().trim());
  const rand = mulberry32(seed);
  const vec: number[] = [];
  for (let i = 0; i < dim; i++) {
    vec.push(rand() * 2 - 1); // [-1, 1]
  }
  return vec;
}

export function dot(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    sum += (a[i] ?? 0) * (b[i] ?? 0);
  }
  return sum;
}

export function norm(a: number[]): number {
  return Math.sqrt(dot(a, a));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const denom = norm(a) * norm(b);
  if (denom === 0) return 0;
  return dot(a, b) / denom;
}

/** Numerically stable softmax over an array. */
export function softmax(values: number[]): number[] {
  if (values.length === 0) return [];
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((acc, v) => acc + v, 0);
  if (sum === 0) return values.map(() => 1 / values.length);
  return exps.map((v) => v / sum);
}

/** Simple whitespace/punctuation-aware word tokenizer (used as a base pass). */
export function splitWords(text: string): string[] {
  const matches = text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?|[^\sA-Za-z0-9]/g);
  return matches ?? [];
}

/**
 * Simplified WordPiece-style tokenizer: split text into words/punctuation,
 * then break words longer than `chunkSize` into fixed-length subword
 * pieces, prefixing continuation pieces with "##" (as in WordPiece/BERT).
 * Deterministic — no vocabulary lookup, purely structural — but a real,
 * inspectable segmentation, not a mock.
 */
export function tokenize(text: string, chunkSize = 4): string[] {
  const words = splitWords(text);
  const tokens: string[] = [];
  for (const word of words) {
    if (word.length <= chunkSize) {
      tokens.push(word);
      continue;
    }
    let i = 0;
    let first = true;
    while (i < word.length) {
      const piece = word.slice(i, i + chunkSize);
      tokens.push(first ? piece : `##${piece}`);
      first = false;
      i += chunkSize;
    }
  }
  return tokens;
}

/** Fixed palette of CSS custom properties to cycle chips/cells through. */
export const TOKEN_PALETTE = [
  'var(--color-accent)',
  'var(--color-fg)',
  'var(--color-muted)',
] as const;
