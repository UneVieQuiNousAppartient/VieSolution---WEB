import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ServiceDetailSection } from '@/components/vsw/service-detail-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'CRM et outils sur mesure',
  description:
    "CRM maison, outils internes et tableaux de suivi pour PME québécoises, quand aucun logiciel tout fait ne convient. On part de ce que vous avez : votre logiciel, Zoho ou un outil bâti pour vous.",
};

export default function CrmSurMesurePage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="CRM et outils sur mesure"
        title={
          <>
            Un outil fait pour<br />votre façon de travailler.
          </>
        }
        lede="Quand aucun logiciel tout fait ne colle à votre façon de travailler, on vous bâtit le vôtre : un carnet de clients maison, un formulaire, un tableau de suivi. Simple, à votre image, et relié à vos outils actuels."
      />
      <ServiceDetailSection
        id="sur-mesure"
        eyebrow="Ce qu'on bâtit"
        titre="Le bon outil, pas le plus gros."
        accroche="On part de ce que vous avez."
        intro="Pas besoin de tout changer. Si votre logiciel actuel fait l'affaire, on le garde et on le relie à vos autres outils. S'il vous manque des choses, on installe Zoho ou on vous bâtit un outil maison."
        piliers={[
          {
            titre: 'On part de ce que vous avez',
            desc: "On regarde votre logiciel actuel avec vous, puis on choisit ensemble : le garder et le relier, installer Zoho, ou bâtir un outil maison, selon votre façon de travailler et votre budget.",
            items: ['Votre logiciel actuel', 'Zoho', 'Un outil maison'],
          },
          {
            titre: 'CRM maison',
            desc: "Un carnet de clients pensé pour votre métier : vos fiches, vos étapes de suivi, vos relances, et rien de plus.",
            items: ['Fiches clients', 'Étapes de suivi', 'Rappels de relance'],
          },
          {
            titre: 'Outils internes et tableaux de suivi',
            desc: "Les petits outils qui vous manquent : un formulaire relié à vos fiches, un tableau qui se met à jour seul.",
            items: ['Formulaires', 'Tableaux de suivi', 'Liens avec vos outils'],
          },
        ]}
        bandeau={
          <>
            <em>Vos données vous appartiennent</em> : accès configurés selon la Loi 25, et on vous
            explique clairement où elles sont hébergées.
          </>
        }
        boutonLibelle="Décrire votre situation"
        boutonLien="/devis#situation"
      />
      <CTASection
        text={
          <>
            Un outil qui vous <em>manque</em> ? Décrivez-le-nous lors d&apos;un appel gratuit de 30
            minutes.
          </>
        }
      />
    </>
  );
}
