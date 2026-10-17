import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { CommentPrixSection } from '@/components/vsw/comment-prix-section';
import { SituationForm } from '@/components/vsw/situation-form';
import { PricingSection } from '@/components/vsw/pricing-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Combien ça coûte ?',
  description:
    'Un prix clair avant de commencer, sans frais cachés : on regarde votre situation, on propose un premier pas, vous décidez.',
};

export default function DevisPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// Combien ça coûte ?"
        title={
          <>
            Un prix clair,<br />avant de commencer.
          </>
        }
        lede="Chaque entreprise est différente, alors chaque prix l'est aussi. On regarde votre situation, on vous propose un premier pas, et vous connaissez le prix avant de dire oui. Pas de frais cachés."
      />
      <CommentPrixSection />
      <SituationForm />
      <PricingSection />
      <CTASection
        text={
          <>
            Une question sur le prix ? On y répond <em>franchement</em>, à l&apos;appel
            découverte gratuit.
          </>
        }
        primaryLabel="Réserver un appel"
      />
    </>
  );
}
