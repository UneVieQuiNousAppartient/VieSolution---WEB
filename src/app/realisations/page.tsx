import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { RealisationsGrid } from '@/components/vsw/realisations-grid';
import { OutilsGalerie } from '@/components/vsw/outils-galerie';
import { CTASection } from '@/components/vsw/cta-section';

/* Réalisations (refonte du 2026-10-23, maquette validée par Camille) : seulement les vrais projets,
   rangés par pilier : les sites, puis les écrans des CRM sur mesure. Les cas d'usage d'exemple
   (cadres d'image vides) sont retirés ; les captures Zoho s'ajouteront quand Camille les donnera. */
export const metadata: Metadata = {
  title: 'Réalisations',
  description:
    "Les sites et les CRM sur mesure bâtis par Vie Solution Web pour des entreprises québécoises.",
};

export default function RealisationsPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Réalisations"
        title={
          <>
            Ce qu&apos;on a<br />déjà bâti.
          </>
        }
        lede="Des sites et des CRM sur mesure, bâtis pour des entreprises d'ici. Chaque projet part de leur façon de travailler."
      />
      <RealisationsGrid />
      <OutilsGalerie />
      <CTASection
        text={
          <>
            Votre entreprise a besoin d&apos;un outil comme ceux-ci ? <em>Parlons-en</em> : l&apos;appel
            découverte est gratuit.
          </>
        }
      />
    </>
  );
}
