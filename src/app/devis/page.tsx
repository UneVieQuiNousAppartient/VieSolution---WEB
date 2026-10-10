import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { QuoteCalculator } from '@/components/vsw/quote-calculator';
import { PricingSection } from '@/components/vsw/pricing-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Devis en ligne',
  description:
    "Estimez votre projet d'automatisation, d'agent IA, d'implantation Zoho ou de formation en 30 secondes. Fourchette indicative, tarif confirmé lors d'un appel découverte.",
};

export default function DevisPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// Devis en ligne"
        title={
          <>
            Combien ça coûte ?<br />Voyez par vous-même.
          </>
        }
        lede="Un outil transparent pour obtenir une fourchette indicative en 30 secondes. Le tarif final est toujours confirmé lors d'un appel découverte gratuit."
      />
      <QuoteCalculator showHead={false} />
      <PricingSection />
      <CTASection
        text={
          <>
            Votre estimation vous convient ? <em>Confirmez-la</em> lors d&apos;un appel
            découverte gratuit.
          </>
        }
      />
    </>
  );
}
