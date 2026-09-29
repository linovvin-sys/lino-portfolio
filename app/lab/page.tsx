import { PageShell } from '@/components/ui/PageShell';
import { Lab } from '@/components/sections/Lab';
import { profile } from '@/content/profile';

export const metadata = {
  title: 'Lab',
  description: `Interactive experiments built by ${profile.name}.`,
};

export default function LabIndexPage() {
  return (
    <PageShell container={false}>
      <Lab id="lab" />
    </PageShell>
  );
}
