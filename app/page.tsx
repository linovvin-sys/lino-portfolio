import { Nav } from '@/components/sections/Nav';
import { geminiApiKey } from '@/lib/env';
import { Hero } from '@/components/sections/Hero';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Capabilities } from '@/components/sections/Capabilities';
import { Workflow } from '@/components/sections/Workflow';
import { Experience } from '@/components/sections/Experience';
import { Roadmap } from '@/components/sections/Roadmap';
import { Lab } from '@/components/sections/Lab';
import { Testimonials } from '@/components/sections/Testimonials';
import { About } from '@/components/sections/About';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { SkipLink } from '@/components/ui/SkipLink';
import { RevealObserver } from '@/components/ui/RevealObserver';
import { CommandPalette } from '@/components/sections/CommandPalette';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollProgress } from '@/components/motion/ScrollProgress';

export default function Home() {
  const chatEnabled = Boolean(geminiApiKey);
  return (
    <>
      <SkipLink />
      <Nav chatEnabled={chatEnabled} />
      {chatEnabled && <CommandPalette />}
      <RevealObserver />
      <SmoothScroll />
      <ScrollProgress />

      <main id="main">
        <Hero id="hero" />
        <About id="about" />
        <SelectedWork id="work" />
        <Capabilities id="capabilities" />
        <Workflow id="workflow" />
        <Experience id="experience" />
        <Roadmap id="roadmap" />
        <Lab id="lab" />
        <Testimonials id="testimonials" />
        <Education id="education" />
        <Contact id="contact" />
      </main>

      <Footer />
    </>
  );
}
