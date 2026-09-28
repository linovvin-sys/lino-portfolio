'use client';

import { useMemo, useState } from 'react';
import { diffLines } from '@/lib/lab-diff';
import { cn } from '@/lib/utils';
import { labInput, labLabel, labPanel } from './ui';

const RUNNING = `hostname leaf-03
!
interface Ethernet1
 description uplink-spine-01
 mtu 9214
 no switchport
 ip address 10.0.1.5/31
!
interface Ethernet2
 description uplink-spine-02
 mtu 9214
 no switchport
 ip address 10.0.2.5/31
!
router bgp 65103
 neighbor 10.0.1.4 remote-as 65000
 neighbor 10.0.2.4 remote-as 65000
 maximum-paths 2`;

const CANDIDATE = `hostname leaf-03
!
interface Ethernet1
 description uplink-spine-01
 mtu 9214
 no switchport
 ip address 10.0.1.5/31
!
interface Ethernet2
 description uplink-spine-02
 mtu 9214
 no switchport
 ip address 10.0.2.5/31
!
interface Ethernet3
 description uplink-spine-03
 mtu 9214
 no switchport
 ip address 10.0.3.5/31
!
router bgp 65103
 neighbor 10.0.1.4 remote-as 65000
 neighbor 10.0.2.4 remote-as 65000
 neighbor 10.0.3.4 remote-as 65000
 maximum-paths 3`;

const MAX_LINES = 600;

export function ConfigDiffViewer() {
  const [before, setBefore] = useState(RUNNING);
  const [after, setAfter] = useState(CANDIDATE);

  const { lines, tooLong } = useMemo(() => {
    const tooLong = before.split('\n').length > MAX_LINES || after.split('\n').length > MAX_LINES;
    return { lines: tooLong ? [] : diffLines(before, after), tooLong };
  }, [before, after]);

  const added = lines.filter((l) => l.op === 'insert').length;
  const removed = lines.filter((l) => l.op === 'delete').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="diff-before" className={labLabel}>
            Running config
          </label>
          <textarea
            id="diff-before"
            value={before}
            onChange={(e) => setBefore(e.target.value)}
            rows={10}
            spellCheck={false}
            className={cn(labInput, 'resize-y leading-relaxed')}
          />
        </div>
        <div>
          <label htmlFor="diff-after" className={labLabel}>
            Candidate config
          </label>
          <textarea
            id="diff-after"
            value={after}
            onChange={(e) => setAfter(e.target.value)}
            rows={10}
            spellCheck={false}
            className={cn(labInput, 'resize-y leading-relaxed')}
          />
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="eyebrow">Pre-change review</span>
          <span className="font-tabular font-mono text-xs">
            <span className="text-emerald-600 dark:text-emerald-400">+{added}</span>{' '}
            <span className="text-[var(--color-accent)]">−{removed}</span>
          </span>
        </div>
        <div className={cn(labPanel, 'overflow-x-auto py-2 font-mono text-[13px] leading-6')}>
          {tooLong && <p className="px-4 text-[var(--color-muted)]">Configs over {MAX_LINES} lines are too long for the live view.</p>}
          {!tooLong && added + removed === 0 && (
            <p className="px-4 text-[var(--color-muted)]">No changes. The candidate matches the running config.</p>
          )}
          {!tooLong &&
            added + removed > 0 &&
            lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'grid min-w-max grid-cols-[2.5rem_2.5rem_1.25rem_1fr] pr-4',
                  line.op === 'insert' && 'bg-[color-mix(in_oklab,#10b981_12%,transparent)]',
                  line.op === 'delete' && 'bg-[color-mix(in_oklab,var(--color-accent)_10%,transparent)]',
                )}
              >
                <span className="select-none pr-2 text-right text-[var(--color-muted)] opacity-60">{line.oldLine ?? ''}</span>
                <span className="select-none pr-2 text-right text-[var(--color-muted)] opacity-60">{line.newLine ?? ''}</span>
                <span
                  className={cn(
                    'select-none',
                    line.op === 'insert' && 'text-emerald-600 dark:text-emerald-400',
                    line.op === 'delete' && 'text-[var(--color-accent)]',
                  )}
                >
                  {line.op === 'insert' ? '+' : line.op === 'delete' ? '−' : ' '}
                </span>
                <span className="whitespace-pre text-[var(--color-fg)]">{line.value || ' '}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
