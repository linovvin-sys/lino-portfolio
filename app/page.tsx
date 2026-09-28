import { Preloader } from '@/components/sections/Preloader';
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { MetricsBanner } from '@/components/sections/MetricsBanner';
import { Capabilities } from '@/components/sections/Capabilities';
import { Experience } from '@/components/sections/Experience';
import { Research } from '@/components/sections/Research';
import { OpenSource } from '@/components/sections/OpenSource';
import { Lab } from '@/components/sections/Lab';
import { Testimonials } from '@/components/sections/Testimonials';
import { About } from '@/components/sections/About';
import { Education } from '@/components/sections/Education';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { LenisProvider } from '@/hooks/useLenis';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SkipLink } from '@/components/ui/SkipLink';
import { CommandPalette } from '@/components/sections/CommandPalette';

export default function Home() {
  return (
    <LenisProvider>
      <GrainOverlay />
      <CustomCursor />
      <SkipLink />
      <Preloader />
      
      <Nav />
      <CommandPalette />
      
      <main id="main" className="flex min-h-screen flex-col items-center justify-between">
        <Hero id="hero" />
        <SelectedWork id="work" />
        <MetricsBanner />
        <Capabilities id="capabilities" />
        <Experience id="experience" />
        <Research id="research" />
        <OpenSource id="oss" />
        <Lab id="lab" />
        <Testimonials id="testimonials" />
        <About id="about" />
        <Education id="education" />
        <Contact id="contact" />
      </main>
      
      <Footer />
    </LenisProvider>
  );
}
