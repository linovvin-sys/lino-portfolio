import { PageShell } from '@/components/ui/PageShell';
import { About } from '@/components/sections/About';
import { profile } from '@/content/profile';

export const metadata = {
  title: 'About',
  description: `How ${profile.name} works, and how it all connects.`,
};

export default function AboutPage() {
  return (
    <PageShell container={false}>
      <About id="about" />
    </PageShell>
  );
}
