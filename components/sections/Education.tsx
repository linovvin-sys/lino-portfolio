'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { education, certifications } from '@/content/education';

interface EducationProps {
  id?: string;
}

export function Education({ id }: EducationProps) {
  return (
    <section id={id} className="py-24 bg-[var(--color-bg)] text-[var(--color-fg)]">
      <Container>
        <SectionHeader index={9} title="Education & Certifications" />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest mb-8 border-b border-[var(--color-rule)] pb-4">Academic Background</h3>
            <div className="space-y-12">
              {education.map((edu, i) => (
                <ClipReveal key={edu.id} delay={i * 0.1}>
                  <div className="relative pl-6 border-l border-[var(--color-rule)]">
                    <div className="absolute top-0 left-0 -translate-x-[0.5px] w-[1px] h-4 bg-[var(--color-accent)]" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h4 className="font-display text-2xl">{edu.institution}</h4>
                      <span className="font-mono text-xs text-[var(--color-muted)] mt-1 sm:mt-0">
                        {edu.period.start} — {edu.period.end}
                      </span>
                    </div>
                    <p className="font-body text-lg">{edu.degree}</p>
                    <p className="font-mono text-sm text-[var(--color-muted)] mt-2">{edu.field}</p>
                    {edu.honors && (
                      <p className="font-mono text-xs text-[var(--color-accent)] mt-2 italic">{edu.honors}</p>
                    )}
                  </div>
                </ClipReveal>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest mb-8 border-b border-[var(--color-rule)] pb-4">Certifications</h3>
            <div className="space-y-8">
              {certifications.map((cert, i) => (
                <ClipReveal key={cert.id} delay={i * 0.1 + 0.2}>
                  <div className="flex flex-col border border-[var(--color-rule)] p-6 hover:bg-[var(--color-surface)] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-body font-bold">{cert.name}</h4>
                      <span className="font-mono text-xs text-[var(--color-muted)]">{cert.date}</span>
                    </div>
                    <p className="font-mono text-sm text-[var(--color-muted)]">{cert.issuer}</p>
                  </div>
                </ClipReveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
