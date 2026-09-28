import { testimonials } from '@/content/testimonials';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface TestimonialsProps {
  id?: string;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export function Testimonials({ id }: TestimonialsProps) {
  return (
    <Section id={id}>
      <SectionHeader index={7} eyebrow="Endorsements" title="What collaborators say." />

      <ul className="mt-14 grid grid-cols-1 gap-[var(--grid-gap)] md:mt-20 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <li key={t.id} data-reveal style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}>
            <figure className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-card)] md:p-8">
              <span aria-hidden="true" className="font-display h-6 text-5xl leading-none text-[var(--color-accent)]">
                &ldquo;
              </span>
              <blockquote className="mt-4 text-[length:var(--text-md)] leading-relaxed text-[var(--color-fg)]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-subtle)] text-[13px] font-medium text-[var(--color-fg)]">
                  {initials(t.author)}
                </span>
                <span>
                  <span className="block text-sm font-medium text-[var(--color-fg)]">{t.author}</span>
                  <span className="block text-[13px] text-[var(--color-muted)]">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
