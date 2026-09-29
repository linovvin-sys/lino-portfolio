import { PageShell } from '@/components/ui/PageShell';
import { Education } from '@/components/sections/Education';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Education | ${profile.name}`,
  description: `${profile.name}'s education and certifications.`,
};

export default function EducationPage() {
  return (
    <PageShell container={false}>
      <Education id="education" />
    </PageShell>
  );
}
