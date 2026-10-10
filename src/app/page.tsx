import { RevealInit } from '@/components/vsw/reveal-init';
import { Hero } from '@/components/vsw/hero';
import { Services } from '@/components/vsw/services';
import { BenefitsSection } from '@/components/vsw/benefits-section';
import { ComparisonSection } from '@/components/vsw/comparison-section';
import { ProcessSection } from '@/components/vsw/process-section';
import { Testimonials } from '@/components/vsw/testimonials';
import { InternsSection } from '@/components/vsw/interns-section';
import { FAQSection } from '@/components/vsw/faq-section';
import { CTASection } from '@/components/vsw/cta-section';

export default function HomePage() {
  return (
    <>
      <RevealInit />
      <Hero />
      <Services />
      <BenefitsSection />
      <ProcessSection />
      <ComparisonSection />
      <Testimonials />
      <InternsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
