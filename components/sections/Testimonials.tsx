'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StackingCards } from '@/components/motion/StackingCards';
import { testimonials } from '@/content/testimonials';

interface TestimonialsProps {
  id?: string;
}

export function Testimonials({ id }: TestimonialsProps) {
  return (
    <section id={id} className="py-24 md:py-32 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Container>
        <SectionHeader index={7} title="Select Endorsements" />
      </Container>

      <div className="mt-16">
        <StackingCards>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="w-full min-h-[60vh] bg-[var(--color-surface)] border-y border-[var(--color-rule)] flex flex-col justify-center px-6 md:px-[var(--space-16)] py-20"
            >
              <div className="max-w-5xl mx-auto w-full">
                <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl leading-tight mb-12">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex flex-col font-mono text-sm uppercase tracking-wide">
                  <span className="font-bold text-[var(--color-fg)] mb-1">{testimonial.author}</span>
                  <span className="text-[var(--color-muted)]">{testimonial.role}, {testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </StackingCards>
      </div>
    </section>
  );
}
