import Link from 'next/link';
import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { education } from '@/content/education';

export const metadata = {
  title: `Resume | ${profile.name}`,
  description: `Professional experience and education for ${profile.name}, ${profile.title}.`,
};

export default function ResumePage() {
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto pt-24 font-body text-[var(--color-fg)] bg-[var(--color-bg)]">
      <div className="flex justify-between items-center mb-12">
        <Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-fg)]">
          &larr; Back to Home
        </Link>
        <a href="/resume.pdf" className="font-mono text-sm underline underline-offset-4 decoration-[var(--color-rule)] hover:decoration-[var(--color-fg)]">
          Download PDF
        </a>
      </div>

      <header className="mb-16">
        <h1 className="text-5xl font-display mb-4">{profile.name}</h1>
        <p className="text-xl text-[var(--color-muted)]">{profile.title}</p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-display mb-8 pb-2 border-b border-[var(--color-rule)]">Experience</h2>
        <div className="space-y-12">
          {experience.map((role) => (
            <div key={role.id}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-medium">{role.role}</h3>
                <span className="font-mono text-sm text-[var(--color-muted)]">{role.period.start} - {role.period.end}</span>
              </div>
              <p className="text-[var(--color-muted)] mb-4">{role.company}</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-[var(--color-fg)]">
                {role.impacts.map((impact) => (
                  <li key={impact.metric}>{impact.description}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-display mb-8 pb-2 border-b border-[var(--color-rule)]">Education</h2>
        <div className="space-y-8">
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg font-medium">{edu.degree}</h3>
                <span className="font-mono text-sm text-[var(--color-muted)]">{edu.period.start} - {edu.period.end}</span>
              </div>
              <p className="text-[var(--color-muted)]">{edu.institution}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
