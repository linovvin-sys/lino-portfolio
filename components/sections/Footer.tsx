import { Container } from '@/components/ui/Container';
import { BackToTopButton } from '@/components/ui/BackToTopButton';
import { navigation } from '@/content/navigation';
import { profile } from '@/content/profile';

const SOCIALS = [
  { label: 'GitHub', href: profile.links.github },
  { label: 'LinkedIn', href: profile.links.linkedin },
  { label: 'X', href: profile.links.x },
].filter((s): s is { label: string; href: string } => Boolean(s.href));

export function Footer({ bordered = false }: { bordered?: boolean }) {
  return (
    <footer
      className={`bg-[var(--color-bg)] pb-10 pt-16 md:pt-20 lg:pl-[var(--sidebar-width)] ${bordered ? 'border-t border-[var(--color-rule)]' : ''}`}
    >
      <Container>
        <div className="grid grid-cols-12 gap-x-[var(--grid-gap)] gap-y-12">
          <div className="col-span-12 md:col-span-6">
            <p className="font-display text-[length:var(--text-2xl)] leading-[1.1] text-[var(--color-fg)]">{profile.name}</p>
            <p className="mt-2 text-[15px] text-[var(--color-muted)]">
              {profile.title} · {profile.location}
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-3">
            <h2 className="eyebrow">Sitemap</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3">
            <h2 className="eyebrow">Connect</h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {SOCIALS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${profile.links.email}`}
                  className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
                >
                  Email
                </a>
              </li>
              {profile.links.resume && (
                <li>
                  <a href={profile.links.resume} className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                    Résumé
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-[var(--color-rule)] pt-6 text-[13px] text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <BackToTopButton />
        </div>
      </Container>
    </footer>
  );
}
