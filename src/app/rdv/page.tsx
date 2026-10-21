import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Booking } from '@/components/vsw/booking';

export const metadata: Metadata = {
  title: 'Prendre un RDV',
  description:
    "Réservez un appel découverte gratuit de 30 minutes avec Vie Solution Web : automatisation, IA et implantation Zoho pour votre entreprise.",
};

export default function RdvPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Prendre un RDV"
        title={
          <>
            Un appel découverte<br />gratuit, 30 minutes.
          </>
        }
        lede="Échangeons sur votre projet, vos objectifs et votre contexte. Sans engagement, en visio ou par téléphone. Vous repartez avec une vision claire des prochaines étapes."
      />
      <Booking showHead={false} />
    </>
  );
}
