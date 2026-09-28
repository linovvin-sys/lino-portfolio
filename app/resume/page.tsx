import { profile } from '@/content/profile';
import { experience } from '@/content/experience';
import { education, certifications } from '@/content/education';
import { PageShell } from '@/components/ui/PageShell';

export const metadata = {
  title: `Resume | ${profile.name}`,
  description: `Professional experience and education for ${profile.name}, ${profile.title}.`,
};

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow border-b border-[var(--color-rule)] pb-3">{children}</h2>;
}

export default function ResumePage() {
  return (
    <PageShell back={{ href: '/', label: 'Home' }} size="narrow">
      <header>
        <h1 className="font-display text-[clamp(2.5rem,1.8rem+3vw,4rem)] leading-[1.02] text-[var(--color-fg)]">
          {profile.name}
        </h1>
        <p className="mt-3 text-[length:var(--text-lg)] text-[var(--color-muted)]">
          {profile.title} · {profile.location}
        </p>
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-fg)]">{profile.bio}</p>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href={`mailto:${profile.links.email}`} className="link-underline text-[var(--color-fg)]">
            {profile.links.email}
          </a>
          {profile.links.linkedin && (
            <a href={profile.links.linkedin} className="link-underline text-[var(--color-fg)]" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          )}
          {profile.links.github && (
            <a href={profile.links.github} className="link-underline text-[var(--color-fg)]" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
        </p>
      </header>

      <section className="mt-16">
        <Heading>Experience</Heading>
        <ol>
          {experience.map((role) => (
            <li key={role.id} className="border-b border-[var(--color-rule)] py-7">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="text-[length:var(--text-md)] font-medium text-[var(--color-fg)]">
                  {role.role} <span className="font-normal text-[var(--color-muted)]">· {role.company}</span>
                </h3>
                <span className="font-tabular shrink-0 text-[13px] text-[var(--color-muted)]">
                  {role.period.start} — {role.period.end}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted)]">{role.description}</p>
              <ul className="mt-3 space-y-1.5">
                {role.impacts.map((impact) => (
                  <li key={impact.metric} className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-fg)]">
                    <span aria-hidden="true" className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>
                      <span className="font-medium">{impact.metric}.</span> {impact.description}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <Heading>Education</Heading>
        <ul>
          {education.map((edu) => (
            <li key={edu.id} className="flex flex-col gap-1 border-b border-[var(--color-rule)] py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <p className="text-[15px] text-[var(--color-fg)]">
                <span className="font-medium">{edu.degree}</span>
                <span className="text-[var(--color-muted)]"> · {edu.institution}</span>
              </p>
              <span className="font-tabular shrink-0 text-[13px] text-[var(--color-muted)]">
                {edu.period.start} — {edu.period.end}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <Heading>Certifications</Heading>
        <ul>
          {certifications.map((cert) => (
            <li key={cert.id} className="flex flex-col gap-1 border-b border-[var(--color-rule)] py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <p className="text-[15px] text-[var(--color-fg)]">
                <span className="font-medium">{cert.name}</span>
                <span className="text-[var(--color-muted)]"> · {cert.issuer}</span>
              </p>
              <span className="font-tabular shrink-0 text-[13px] text-[var(--color-muted)]">{cert.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
