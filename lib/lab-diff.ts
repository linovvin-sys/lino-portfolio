/**
 * Word-level LCS diff — pure TypeScript, no external diff library.
 *
 * Splits both inputs into word/whitespace tokens, computes the longest
 * common subsequence via dynamic programming, then walks the DP table to
 * produce an ordered list of equal/insert/delete segments.
 */

export type DiffOp = 'equal' | 'insert' | 'delete';

export interface DiffSegment {
  op: DiffOp;
  value: string;
}

/** Split on word boundaries, keeping whitespace as its own tokens so spacing is preserved. */
function tokenizeForDiff(text: string): string[] {
  const matches = text.match(/\s+|[A-Za-z0-9]+|[^\sA-Za-z0-9]/g);
  return matches ?? [];
}

export function diffWords(before: string, after: string): DiffSegment[] {
  const a = tokenizeForDiff(before);
  const b = tokenizeForDiff(after);
  const n = a.length;
  const m = b.length;

  // dp[i][j] = length of LCS of a[i..] and b[j..]
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i--) {
    const rowCur = dp[i];
    const rowNext = dp[i + 1];
    if (!rowCur || !rowNext) continue;
    for (let j = m - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        rowCur[j] = (rowNext[j + 1] ?? 0) + 1;
      } else {
        rowCur[j] = Math.max(rowNext[j] ?? 0, rowCur[j + 1] ?? 0);
      }
    }
  }

  const segments: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  const pushOrMerge = (op: DiffOp, value: string) => {
    const last = segments[segments.length - 1];
    if (last && last.op === op) {
      last.value += value;
    } else {
      segments.push({ op, value });
    }
  };

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pushOrMerge('equal', a[i] ?? '');
      i++;
      j++;
    } else {
      const rowI = dp[i + 1];
      const rowJ = dp[i];
      const downScore = rowI ? (rowI[j] ?? 0) : 0;
      const rightScore = rowJ ? (rowJ[j + 1] ?? 0) : 0;
      if (downScore >= rightScore) {
        pushOrMerge('delete', a[i] ?? '');
        i++;
      } else {
        pushOrMerge('insert', b[j] ?? '');
        j++;
      }
    }
  }
  while (i < n) {
    pushOrMerge('delete', a[i] ?? '');
    i++;
  }
  while (j < m) {
    pushOrMerge('insert', b[j] ?? '');
    j++;
  }

  return segments;
}
