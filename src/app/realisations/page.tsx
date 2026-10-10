import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Portfolio } from '@/components/vsw/portfolio';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: "Cas d'usage",
  description:
    "Exemples concrets de mandats IA et Zoho : automatisation, agents, implantation CRM et formation pour entreprises québécoises.",
};

export default function RealisationsPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// Cas d'usage"
        title={
          <>
            Ce qu&apos;on peut<br />bâtir ensemble.
          </>
        }
        lede="Des exemples concrets de mandats IA et Zoho pour des entreprises québécoises de toutes tailles — du travailleur autonome à la PME établie."
      />
      <Portfolio showHead={false} />
      <CTASection
        text={
          <>
            Votre entreprise ressemble à l&apos;un de ces cas ? <em>Parlons-en</em> — l&apos;appel
            découverte est gratuit.
          </>
        }
      />
    </>
  );
}
