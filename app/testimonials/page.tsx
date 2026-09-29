import { PageShell } from '@/components/ui/PageShell';
import { Testimonials } from '@/components/sections/Testimonials';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Friends & classmates | ${profile.name}`,
  description: `What ${profile.name}'s friends and classmates have to say.`,
};

export default function TestimonialsPage() {
  return (
    <PageShell container={false}>
      <Testimonials id="testimonials" />
    </PageShell>
  );
}
