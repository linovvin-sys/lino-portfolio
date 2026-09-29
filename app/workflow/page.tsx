import { PageShell } from '@/components/ui/PageShell';
import { Workflow } from '@/components/sections/Workflow';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Workflow | ${profile.name}`,
  description: `How ${profile.name} plans, builds, tests, deploys and verifies work.`,
};

export default function WorkflowPage() {
  return (
    <PageShell container={false}>
      <Workflow id="workflow" />
    </PageShell>
  );
}
