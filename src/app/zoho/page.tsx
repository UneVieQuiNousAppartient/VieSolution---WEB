import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ZohoSection } from '@/components/vsw/zoho-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Implantation Zoho',
  description:
    "Implantation, configuration et formation Zoho (CRM, Books, Desk, Campaigns) chez les PME québécoises. Votre gestion centralisée au même endroit.",
};

export default function ZohoPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Zoho, simplement"
        title={
          <>
            Toute votre gestion,<br />au même endroit.
          </>
        }
        lede="Vos clients, vos factures, votre soutien client, vos infolettres : on installe Zoho chez vous, on le règle selon votre façon de travailler et on vous forme jusqu'à ce que vous soyez à l'aise."
      />
      <DemarrerSection variant="zoho" />
      <ZohoSection />
      <CTASection
        text={
          <>
            <em>Une vie qui nous appartient</em> — reprenez la main sur la gestion de
            votre entreprise.
          </>
        }
      />
    </>
  );
}
