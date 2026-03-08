import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Outils sur mesure pour particuliers',
  description: 'Petits outils web, formulaires personnalisés et tableaux de suivi adaptés à vos besoins personnels.',
};

export default function OutilsSurMesurePage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Particuliers', title: 'Un outil web fait pour vous', subtitle: 'Formulaire personnalisé, tableau de suivi ou mini espace personnel : nous le créons pour vous.' }}
      problems={['Vous avez un besoin spécifique qu\'aucune app ne couvre', 'Les outils existants sont trop complexes pour ce que vous voulez', 'Vous aimeriez un petit outil web simple et personnel', 'Vous gérez quelque chose manuellement qui pourrait être numérisé']}
      solutions={[
        { title: 'Formulaire personnalisé', description: 'Un formulaire web adapté à vos besoins spécifiques (inscriptions, sondages, etc.).' },
        { title: 'Tableau de suivi', description: 'Un tableau de bord simple pour suivre ce qui compte pour vous.' },
        { title: 'Mini espace personnel', description: 'Un petit espace web privé avec les fonctionnalités dont vous avez besoin.' },
        { title: 'Outil de calcul', description: 'Un calculateur ou simulateur web adapté à votre besoin spécifique.' },
      ]}
      benefits={['Exactement ce dont vous avez besoin', 'Simple à utiliser', 'Accessible depuis n\'importe quel appareil', 'Prix abordable', 'Fait sur mesure pour vous', 'Support inclus']}
      cta={{ title: 'Décrivez-nous votre besoin', subtitle: 'Nous trouverons la solution la plus simple et efficace.' }}
    />
  );
}
