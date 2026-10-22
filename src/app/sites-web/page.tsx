import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ServiceDetailSection } from '@/components/vsw/service-detail-section';
import { RealisationsGrid } from '@/components/vsw/realisations-grid';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Sites et applications web',
  description:
    "Sites vitrines, pages de destination et applications web pour PME et travailleurs autonomes québécois, reliés à vos outils : formulaires, rendez-vous, carnet de clients.",
};

export default function SitesWebPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Sites et applications web"
        title={
          <>
            Un site qui travaille<br />pour votre entreprise.
          </>
        }
        lede="Un site clair qui donne confiance, une page pour lancer une offre, ou une application web pour vos clients et votre équipe. Bâti pour vous et relié à vos outils."
      />
      <ServiceDetailSection
        id="sites"
        eyebrow="Ce qu'on bâtit"
        titre="Trois façons d'être en ligne."
        accroche="Reliées à vos outils."
        intro="Votre site est relié à vos outils : formulaires, rendez-vous, carnet de clients. Chaque information entre une seule fois."
        piliers={[
          {
            titre: 'Sites vitrines',
            desc: "Un site clair qui donne confiance : qui vous êtes, ce que vous faites, comment vous joindre.",
            items: ['Pages claires', 'Formulaire de contact relié à vos outils', 'Prise de rendez-vous'],
          },
          {
            titre: 'Pages de destination',
            desc: "Une page pour lancer une offre, avec un seul but : que la personne vous écrive ou prenne rendez-vous.",
            items: ['Une offre, une page', 'Prise de rendez-vous', 'Suivi des demandes'],
          },
          {
            titre: 'Applications web',
            desc: "Une application web pour vos clients et votre équipe, bâtie pour vous et reliée à vos outils : formulaires, rendez-vous, carnet de clients.",
            items: ['Pour vos clients', 'Pour votre équipe', 'Reliée à vos outils'],
          },
        ]}
        bandeau={
          <>
            Un site, c&apos;est aussi être <em>trouvé sur Google et par les IA</em> : on s&apos;en
            occupe avec le site.
          </>
        }
        boutonLibelle="Voir le référencement"
        boutonLien="/referencement"
      />
      <RealisationsGrid />
      <CTASection
        text={
          <>
            Un site à <em>créer ou à refaire</em> ? On en parle lors d&apos;un appel gratuit de 30
            minutes.
          </>
        }
      />
    </>
  );
}
