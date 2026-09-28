'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AvailabilityDot } from '@/components/ui/AvailabilityDot';
import { ArrowRight } from '@/components/ui/Icons';
import { Magnetic } from '@/components/motion/Magnetic';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { TechMarquee } from '@/components/motion/TechMarquee';
import { NetworkTopology, type TopologyEvent } from '@/components/network/NetworkTopology';
import { Terminal, type TerminalLine } from '@/components/network/Terminal';
import { useLocalTime } from '@/hooks/useLocalTime';
import { profile } from '@/content/profile';
import { metricsStrip } from '@/content/metrics';
import { cn } from '@/lib/utils';

interface HeroProps {
  id?: string;
}

/** Plays once on load: a deploy run, a health check, then a hint to interact. */
const BOOT: Omit<TerminalLine, 'id'>[] = [
  { text: 'ping -c 3 10.42.1.10', tone: 'command' },
  { text: '3 packets transmitted, 3 received, 0% packet loss', tone: 'ok' },
  { text: 'show ip interface brief | include up', tone: 'command' },
  { text: '8 interfaces up/up · network healthy', tone: 'ok' },
  { text: '# hover the map · click a spine or edge to fail it · click a server to ping', tone: 'muted' },
];

const STACK = [
  'Bootstrap',
  'Tailwind CSS',
  'React',
  'Next.js',
  'TypeScript',
  'PHP',
  'Java',
  'Python',
  'C++',
  'MySQL',
  'Docker',
  'GitHub Actions',
  'Git',
  'GitHub',
  'Linux',
  'Cisco Packet Tracer',
];

/** Split the name into two balanced lines for the masked line-by-line intro. */
function nameLines(name: string) {
  const words = name.split(' ');
  const cut = Math.floor(words.length / 2);
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);
}

const delay = (ms: number) => ({ ['--delay' as string]: `${ms}ms` });

export function Hero({ id }: HeroProps) {
  const time = useLocalTime(profile.timezone);
  const nextId = useRef(BOOT.length);
  const [lines, setLines] = useState<TerminalLine[]>(() => BOOT.map((l, i) => ({ ...l, id: i })));
  const [health, setHealth] = useState({ up: 0, total: 0 });

  // Replay the boot sequence line by line (the server HTML already holds the final text)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLines([]);
    let at = 1000;
    const timers = BOOT.map((line, i) => {
      const timer = setTimeout(() => setLines((prev) => [...prev, { ...line, id: i }]), at);
      // commands type at ~22ms/char (see Terminal); give output a beat after that
      at += line.tone === 'command' ? line.text.length * 22 + 450 : 700;
      return timer;
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const onEvent = useCallback((event: TopologyEvent) => {
    setLines((prev) => [...prev.slice(-20), { id: nextId.current++, text: event.text, tone: event.tone }]);
  }, []);
  const onHealthChange = useCallback((up: number, total: number) => setHealth({ up, total }), []);
  const degraded = health.total > 0 && health.up < health.total;

  return (
    <section id={id} className="relative w-full pt-[calc(var(--nav-height)+56px)] md:pt-[calc(var(--nav-height)+88px)]">
      <Container>
        <div className="grid grid-cols-12 items-center gap-x-[var(--grid-gap)] gap-y-14">
          <div className="col-span-12 lg:col-span-7">
            <p
              style={delay(0)}
              className="animate-rise-in inline-flex items-center gap-2.5 rounded-full border border-[var(--color-rule)] bg-[var(--color-surface)] py-1.5 pl-3 pr-3.5 text-[13px] text-[var(--color-muted)] shadow-[var(--shadow-card)]"
            >
              <AvailabilityDot status={profile.availability.status} />
              {profile.availability.message}
            </p>

            <h1 className="font-display mt-8 text-[length:var(--text-hero)] leading-[0.98] text-[var(--color-fg)]">
              <span className="sr-only">{profile.name}</span>
              {nameLines(profile.name).map((line, i) => (
                <span key={line} aria-hidden="true" className="mask">
                  <span className="animate-line-up" style={delay(120 + i * 110)}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              style={delay(420)}
              className="animate-rise-in mt-8 max-w-xl text-[length:var(--text-lg)] leading-relaxed text-[var(--color-muted)]"
            >
              <span className="text-[var(--color-fg)]">{profile.title}.</span>{' '}
              {profile.bio.split('. ').slice(0, 2).join('. ')}.
            </p>

            <div style={delay(520)} className="animate-rise-in mt-10 flex flex-wrap items-center gap-3">
              <Magnetic className="w-full sm:w-auto">
                <Button href="#work" size="lg" className="w-full sm:w-auto">
                  View selected work
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/button:translate-x-0.5" />
                </Button>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Button href="#contact" size="lg" variant="secondary" className="w-full sm:w-auto">
                  Get in touch
                </Button>
              </Magnetic>
            </div>

            <dl style={delay(620)} className="animate-rise-in mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm">
              <div>
                <dt className="eyebrow">Based in</dt>
                <dd className="mt-1.5 text-[var(--color-fg)]">{profile.location}</dd>
              </div>
              <div>
                <dt className="eyebrow">Local time</dt>
                <dd className="font-tabular mt-1.5 min-w-[5.5rem] text-[var(--color-fg)]">{time || '—'}</dd>
              </div>
            </dl>
          </div>

          <figure style={delay(300)} className="animate-rise-in col-span-12 lg:col-span-5">
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-[var(--color-rule)] px-5 py-3">
                <span className="eyebrow">Fig. 01 — Network lab</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-300',
                    degraded
                      ? 'bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[var(--color-accent)]'
                      : 'bg-[color-mix(in_oklab,#10b981_12%,transparent)] text-emerald-700 dark:text-emerald-400',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', degraded ? 'bg-[var(--color-accent)]' : 'bg-emerald-500')} />
                  <span className="font-tabular">
                    {health.total ? `${health.up}/${health.total} links up` : 'all links up'}
                  </span>
                </span>
              </div>
              <NetworkTopology className="aspect-[480/330] w-full px-2 pt-2" onEvent={onEvent} onHealthChange={onHealthChange} />
              <Terminal lines={lines} rows={5} />
            </div>
            <figcaption className="mt-3 text-[13px] text-[var(--color-muted)]">
              A small data-center network like the ones I’m learning to build. Break something and watch it route around the failure.
            </figcaption>
          </figure>
        </div>

        <dl
          data-reveal
          className="mt-20 grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-rule)] md:mt-28 md:grid-cols-4"
          style={{ gap: '1px' }}
        >
          {metricsStrip.map((metric) => (
            <div key={metric.label} className="flex flex-col justify-between gap-6 bg-[var(--color-bg)] p-6 md:p-8">
              <dt className="eyebrow">{metric.label}</dt>
              <dd className="font-display font-tabular text-[length:var(--text-3xl)] leading-none text-[var(--color-fg)] md:text-[3.25rem]">
                {metric.numericValue !== undefined ? <AnimatedNumber value={metric.numericValue} /> : metric.value}
                {metric.suffix &&
                  (metric.suffix.length > 4 ? (
                    // longer notes (e.g. a list of languages) sit on their own line
                    <span className="mt-3 block font-body text-[13px] leading-snug tracking-normal text-[var(--color-muted)]">
                      {metric.suffix}
                    </span>
                  ) : (
                    <span className="ml-1 font-body text-base tracking-normal text-[var(--color-muted)] md:text-lg">{metric.suffix}</span>
                  ))}
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      <div data-reveal className="mt-20 border-y border-[var(--color-rule)] py-6 md:mt-24 md:py-8">
        <p className="sr-only">Technologies I work with: {STACK.join(', ')}</p>
        <TechMarquee items={STACK} />
      </div>
    </section>
  );
}
