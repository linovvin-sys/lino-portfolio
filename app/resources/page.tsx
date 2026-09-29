import { PageShell } from '@/components/ui/PageShell';
import { Resources } from '@/components/sections/Resources';
import { profile } from '@/content/profile';

export const metadata = {
  title: 'Resources',
  description: `Resources ${profile.name} keeps coming back to for building software and learning AI engineering.`,
};

export default function ResourcesPage() {
  return (
    <PageShell container={false}>
      <Resources id="resources" />
    </PageShell>
  );
}
