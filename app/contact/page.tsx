import { PageShell } from '@/components/ui/PageShell';
import { Contact } from '@/components/sections/Contact';
import { profile } from '@/content/profile';

export const metadata = {
  title: `Contact | ${profile.name}`,
  description: `Get in touch with ${profile.name}.`,
};

export default function ContactPage() {
  return (
    <PageShell container={false}>
      <Contact id="contact" />
    </PageShell>
  );
}
