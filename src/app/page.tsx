import { HeroSection } from '@/components/home/hero-section';
import { ProblemsSection } from '@/components/home/problems-section';
import { ServicesSection } from '@/components/home/services-section';
import { SectorsSection } from '@/components/home/sectors-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { ProcessSection } from '@/components/home/process-section';
import { CTABlockSection } from '@/components/home/cta-block-section';
import { FAQSection } from '@/components/home/faq-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemsSection />
      <ServicesSection />
      <SectorsSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <CTABlockSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
