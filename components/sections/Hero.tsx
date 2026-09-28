'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AvailabilityDot } from '@/components/ui/AvailabilityDot';
import { ArrowRight } from '@/components/ui/Icons';
import { Magnetic } from '@/components/motion/Magnetic';
import { TokenStream } from '@/components/motion/TokenStream';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { TechMarquee } from '@/components/motion/TechMarquee';
import { EmbeddingSpaceScene } from '@/components/three/EmbeddingSpaceScene';
import { useLocalTime } from '@/hooks/useLocalTime';
import { profile } from '@/content/profile';
import { metricsStrip } from '@/content/metrics';
import { projects } from '@/content/projects';

interface HeroProps {
  id?: string;
}

const STREAM = [
  { p: 0.94, text: 'Building intelligent systems.' },
  { p: 0.88, text: 'Bridging models and interfaces.' },
  { p: 0.99, text: 'Shipping them to production.' },
];

const STACK = Array.from(new Set(projects.flatMap((p) => p.stack)));

/** Split the name into two balanced lines for the masked line-by-line intro. */
function nameLines(name: string) {
  const words = name.split(' ');
  const cut = Math.floor(words.length / 2);
  return [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);
}

const delay = (ms: number) => ({ ['--delay' as string]: `${ms}ms` });

export function Hero({ id }: HeroProps) {
  const time = useLocalTime(profile.timezone);

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
                <span className="eyebrow">Fig. 01 — Embedding space</span>
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-rule)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-rule)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                </span>
              </div>
              <div className="relative aspect-[4/3] w-full">
                <EmbeddingSpaceScene />
              </div>
              <div className="border-t border-[var(--color-rule)] px-5 py-4">
                <p className="eyebrow mb-2.5">Sampled output</p>
                <TokenStream lines={STREAM} startDelay={1100} />
              </div>
            </div>
            <figcaption className="mt-3 text-[13px] text-[var(--color-muted)]">
              Four concept clusters I work across. Move your cursor over the field.
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
                {metric.suffix && (
                  <span className="ml-1 font-body text-base tracking-normal text-[var(--color-muted)] md:text-lg">
                    {metric.suffix}
                  </span>
                )}
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
