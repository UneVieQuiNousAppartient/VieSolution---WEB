import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ZohoSection } from '@/components/vsw/zoho-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Implantation Zoho',
  description:
    "Implantation, configuration et formation Zoho (CRM, Books, Desk, Campaigns) chez les PME québécoises. Votre gestion centralisée dans un seul écosystème.",
};

export default function ZohoPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// Écosystème Zoho"
        title={
          <>
            Toute votre gestion,<br />un seul écosystème.
          </>
        }
        lede="CRM, facturation, soutien client, marketing, inventaire : on implante Zoho chez vous, on l'adapte à vos processus et on forme votre équipe jusqu'à l'autonomie."
      />
      <ZohoSection />
      <CTASection
        text={
          <>
            <em>Une vie qui nous appartient</em> — reprenez la main sur la gestion de
            votre business.
          </>
        }
        primaryLabel="Discuter d'un projet Zoho"
      />
    </>
  );
}
