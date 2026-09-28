import { testimonials } from '@/content/testimonials';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArrowUpRight } from '@/components/ui/Icons';

interface TestimonialsProps {
  id?: string;
}

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s]/gu, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Testimonials({ id }: TestimonialsProps) {
  return (
    <Section id={id} tone="surface">
      <SectionHeader
        index={7}
        eyebrow="Friends & classmates"
        title="What my friends say."
        subtitle="People I’ve built projects and survived lab exams with. Check out their work too."
      />

      <ul className="mt-14 grid grid-cols-1 gap-[var(--grid-gap)] md:mt-20 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <li key={t.id} data-reveal style={{ ['--reveal-delay' as string]: `${i * 60}ms` }}>
            <figure className="spotlight flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-rule)] bg-[var(--color-bg)] p-7 md:p-8">
              <span aria-hidden="true" className="font-display h-6 text-5xl leading-none text-[var(--color-accent)]">
                &ldquo;
              </span>
              <blockquote className="mt-4 text-[length:var(--text-md)] leading-relaxed text-[var(--color-fg)]">{t.quote}</blockquote>
              <figcaption className="mt-auto flex items-center justify-between gap-3 pt-8">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-subtle)] text-[13px] font-medium text-[var(--color-fg)]">
                    {initials(t.author) || '?'}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-[var(--color-fg)]">{t.author}</span>
                    <span className="block text-[13px] leading-snug text-[var(--color-muted)]">
                      {t.role} · {t.relationship ?? t.company}
                    </span>
                  </span>
                </span>
                {t.url && (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${t.author}’s portfolio`}
                    className="group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-rule)] px-3 text-[13px] font-medium text-[var(--color-fg)] transition-[border-color,background-color,color] duration-200 hover:border-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]"
                  >
                    Portfolio
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
