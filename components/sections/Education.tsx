import { education, certifications } from '@/content/education';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface EducationProps {
  id?: string;
}

export function Education({ id }: EducationProps) {
  return (
    <Section id={id}>
      <SectionHeader index={10} eyebrow="Education" title="Education & certifications." />

      <div className="mt-14 grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-14 md:mt-20">
        <div data-reveal className="col-span-12 md:col-span-6">
          <h3 className="eyebrow">Academic</h3>
          <ul className="mt-5 border-t border-[var(--color-rule)]">
            {education.map((edu) => (
              <li key={edu.id} className="flex items-baseline justify-between gap-6 border-b border-[var(--color-rule)] py-6">
                <div>
                  <p className="font-display text-[1.625rem] leading-[1.15] text-[var(--color-fg)]">{edu.institution}</p>
                  <p className="mt-1.5 text-[15px] text-[var(--color-muted)]">
                    {edu.degree}
                    {edu.field && !edu.degree.includes(edu.field) ? `, ${edu.field}` : ''}
                  </p>
                  {edu.honors && <p className="mt-1 text-[13px] text-[var(--color-accent)]">{edu.honors}</p>}
                </div>
                <span className="font-tabular shrink-0 text-[13px] text-[var(--color-muted)]">
                  {edu.period.start} — {edu.period.end}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal style={{ ['--reveal-delay' as string]: '60ms' }} className="col-span-12 md:col-span-6">
          <h3 className="eyebrow">Certifications</h3>
          <ul className="mt-5 border-t border-[var(--color-rule)]">
            {certifications.map((cert) => (
              <li key={cert.id} className="flex items-baseline justify-between gap-6 border-b border-[var(--color-rule)] py-6">
                <div>
                  <p className="text-[15px] font-medium text-[var(--color-fg)]">{cert.name}</p>
                  <p className="mt-1 text-[13px] text-[var(--color-muted)]">{cert.issuer}</p>
                </div>
                <span className="font-tabular shrink-0 text-[13px] text-[var(--color-muted)]">{cert.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
