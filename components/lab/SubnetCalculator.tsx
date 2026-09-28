'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { labInput, labLabel, labPanel, labRange } from './ui';

function parseIp(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/.test(part)) return null;
    const v = Number(part);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n;
}

const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
const maskFor = (prefix: number) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);

function classify(ip: number) {
  const a = ip >>> 24;
  const b = (ip >>> 16) & 255;
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return 'Private (RFC 1918)';
  if (a === 100 && b >= 64 && b <= 127) return 'Carrier-grade NAT (RFC 6598)';
  if (a === 127) return 'Loopback';
  if (a === 169 && b === 254) return 'Link-local';
  if (a >= 224 && a <= 239) return 'Multicast';
  return 'Public';
}

export function SubnetCalculator() {
  const [cidr, setCidr] = useState('10.42.16.37/20');
  const [addr = '', len = '32'] = cidr.split('/');
  const prefixValid = /^\d{1,2}$/.test(len) && Number(len) <= 32;
  const prefix = prefixValid ? Number(len) : 32;
  const ip = addr;
  const setPrefix = (p: number) => setCidr(`${addr}/${p}`);

  const ipNum = prefixValid ? parseIp(ip) : null;
  const result = useMemo(() => {
    if (ipNum === null) return null;
    const mask = maskFor(prefix);
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const size = 2 ** (32 - prefix);
    const usable = prefix >= 31 ? size : size - 2;
    const first = prefix >= 31 ? network : network + 1;
    const last = prefix >= 31 ? broadcast : broadcast - 1;
    return {
      network: toIp(network),
      broadcast: prefix >= 31 ? '—' : toIp(broadcast),
      mask: toIp(mask),
      wildcard: toIp(~mask >>> 0),
      range: `${toIp(first)} – ${toIp(last)}`,
      usable: usable.toLocaleString('en-US'),
      total: size.toLocaleString('en-US'),
      type: classify(ipNum),
    };
  }, [ipNum, prefix]);

  const bits = ipNum === null ? null : ipNum.toString(2).padStart(32, '0');

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <label htmlFor="cidr" className={labLabel}>
            IPv4 CIDR
          </label>
          <input
            id="cidr"
            value={cidr}
            onChange={(e) => setCidr(e.target.value)}
            spellCheck={false}
            aria-invalid={ipNum === null}
            className={labInput}
          />
          {ipNum === null && <p className="mt-2 text-[13px] text-[var(--color-accent)]">Enter a valid IPv4 CIDR, like 192.168.1.10/24.</p>}
        </div>
        <div>
          <label htmlFor="prefix" className={cn(labLabel, 'flex justify-between')}>
            <span>Prefix length</span>
            <span className="font-tabular text-[var(--color-fg)]">/{prefix}</span>
          </label>
          <input
            id="prefix"
            type="range"
            min={0}
            max={32}
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
            className={cn(labRange, 'mt-2')}
          />
        </div>
      </div>

      <div>
        <p className={labLabel}>Address bits</p>
        <div className={cn(labPanel, 'grid grid-cols-4 gap-2 p-3 sm:gap-3 sm:p-4')}>
          {[0, 1, 2, 3].map((octet) => (
            <div key={octet}>
              <div className="grid grid-cols-8 gap-[3px]">
                {Array.from({ length: 8 }, (_, b) => {
                  const i = octet * 8 + b;
                  const isNet = i < prefix;
                  return (
                    <span
                      key={b}
                      style={{ transitionDelay: `${i * 8}ms` }}
                      className={cn(
                        'flex aspect-[3/4] items-center justify-center rounded-[3px] font-mono text-[10px] transition-[background-color,color,border-color] duration-300 sm:text-[11px]',
                        isNet
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'border border-[var(--color-rule)] text-[var(--color-muted)]',
                      )}
                    >
                      {bits ? bits[i] : '·'}
                    </span>
                  );
                })}
              </div>
              <p className="font-tabular mt-2 text-center font-mono text-xs text-[var(--color-muted)]">
                {ipNum === null ? '—' : (ipNum >>> (24 - octet * 8)) & 255}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-4 text-[13px] text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--color-accent)]" /> Network bits ({prefix})
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] border border-[var(--color-rule)]" /> Host bits ({32 - prefix})
          </span>
        </p>
      </div>

      {result && (
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
          {[
            ['Network', `${result.network}/${prefix}`],
            ['Broadcast', result.broadcast],
            ['Usable range', result.range],
            ['Usable hosts', result.usable],
            ['Subnet mask', result.mask],
            ['Wildcard mask', result.wildcard],
            ['Total addresses', result.total],
            ['Address type', result.type],
          ].map(([k, v]) => (
            <div key={k} className="bg-[var(--color-bg)] px-4 py-3">
              <dt className="eyebrow">{k}</dt>
              <dd className="font-tabular mt-1 break-all font-mono text-sm text-[var(--color-fg)]">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
