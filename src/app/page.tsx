import { ContactSection } from '@/sections/contact-section';
import { ExperienceSection } from '@/sections/experience-section';
import { HeroSection } from '@/sections/hero-section';
import { ProjectsSection } from '@/sections/projects-section';
import { ResearchSection } from '@/sections/research-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ResearchSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
