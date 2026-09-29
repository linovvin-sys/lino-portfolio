import { PageShell } from '@/components/ui/PageShell';
import { Capabilities } from '@/components/sections/Capabilities';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Stack | ${profile.name}`,
  description: `The languages, frameworks and tools ${profile.name} works with.`,
};

export default function StackPage() {
  return (
    <PageShell container={false}>
      <Capabilities id="stack" />
    </PageShell>
  );
}
