import { PageShell } from '@/components/ui/PageShell';
import { Roadmap } from '@/components/sections/Roadmap';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Roadmap | ${profile.name}`,
  description: `What ${profile.name} has checked off and what's next.`,
};

export default function RoadmapPage() {
  return (
    <PageShell container={false}>
      <Roadmap id="roadmap" />
    </PageShell>
  );
}
