'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Grid } from '@/components/ui/Grid';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { ScrollFill } from '@/components/motion/ScrollFill';
import { profile } from '@/content/profile';

interface AboutProps {
  id?: string;
}

export function About({ id }: AboutProps) {
  return (
    <section id={id} className="py-24 md:py-32 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Container>
        <SectionHeader index={8} title="Background" />

        <Grid className="mt-16 md:mt-24 gap-12 md:gap-8 items-start">
          <div className="col-span-12 md:col-span-6 lg:col-span-5 order-2 md:order-1">
            <ScrollFill className="font-body text-lg md:text-xl leading-relaxed mb-16">
              {profile.bio}
            </ScrollFill>

            <ClipReveal delay={0.3}>
              <div>
                <h3 className="font-mono text-sm uppercase tracking-widest text-[var(--color-fg)] mb-6 border-b border-[var(--color-rule)] pb-4">Operating Principles</h3>
                <ul className="space-y-4">
                  {profile.principles.map((principle, i) => (
                    <li key={principle.title} className="flex gap-4 font-mono text-sm">
                      <span className="text-[var(--color-accent)]">0{i + 1}</span>
                      <span className="text-[var(--color-muted)]">
                        <span className="text-[var(--color-fg)]">{principle.title}.</span> {principle.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ClipReveal>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7 order-1 md:order-2">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:ml-auto md:mr-0 group">
              <div className="absolute inset-0 bg-[var(--color-surface)] translate-x-4 translate-y-4 border border-[var(--color-rule)] z-0" />

              <div className="absolute inset-0 z-10 overflow-hidden bg-[var(--color-surface)]">
                <ParallaxImage
                  src="/images/portrait.jpg"
                  alt={profile.name}
                  width={800}
                  height={1067}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[var(--dur-slow)]"
                />
              </div>

              <div className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/noise.png')]" />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
