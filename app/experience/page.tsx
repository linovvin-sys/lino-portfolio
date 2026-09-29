import { PageShell } from '@/components/ui/PageShell';
import { Experience } from '@/components/sections/Experience';
import { profile } from '@/content/profile';

export const metadata = {
  title: 'Journey',
  description: `${profile.name}'s experience timeline.`,
};

export default function ExperiencePage() {
  return (
    <PageShell container={false}>
      <Experience id="experience" />
    </PageShell>
  );
}
