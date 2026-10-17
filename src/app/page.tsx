import { RevealInit } from '@/components/vsw/reveal-init';
import { Hero } from '@/components/vsw/hero';
import { PourVousSection } from '@/components/vsw/pour-vous-section';
import { MetiersSection } from '@/components/vsw/metiers-section';
import { AvantApresSection } from '@/components/vsw/avant-apres-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { Services } from '@/components/vsw/services';
import { BenefitsSection } from '@/components/vsw/benefits-section';
import { ComparisonSection } from '@/components/vsw/comparison-section';
import { ProcessSection } from '@/components/vsw/process-section';
import { PartnersSection } from '@/components/vsw/partners-section';
import { Testimonials } from '@/components/vsw/testimonials';
import { InternsSection } from '@/components/vsw/interns-section';
import { FAQSection } from '@/components/vsw/faq-section';
import { CTASection } from '@/components/vsw/cta-section';

export default function HomePage() {
  return (
    <>
      <RevealInit />
      <Hero />
      <PourVousSection />
      <MetiersSection />
      <AvantApresSection />
      <DemarrerSection variant="accueil" />
      <Services />
      <ProcessSection />
      <BenefitsSection />
      <ComparisonSection />
      <PartnersSection />
      <Testimonials />
      <InternsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
