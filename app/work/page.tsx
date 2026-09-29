import { PageShell } from '@/components/ui/PageShell';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { profile } from '@/content/profile';

export const metadata = {
  title: 'Projects',
  description: `Selected projects built by ${profile.name}.`,
};

export default function WorkPage() {
  return (
    <PageShell container={false}>
      <SelectedWork id="work" />
    </PageShell>
  );
}
