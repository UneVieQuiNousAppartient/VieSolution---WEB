import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Sites personnels',
  description: 'Créez votre portfolio, site personnel ou page professionnelle. Présence en ligne simple et efficace.',
};

export default function SitesPersonnelsPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Particuliers', title: 'Votre site personnel en ligne', subtitle: 'Portfolio, site personnel ou page professionnelle pour marquer votre présence sur le web.' }}
      problems={['Vous n\'avez pas de présence en ligne', 'Les plateformes gratuites sont limitées et peu professionnelles', 'Vous ne savez pas par où commencer', 'Les développeurs coûtent trop cher pour un petit projet']}
      solutions={[
        { title: 'Portfolio en ligne', description: 'Présentez vos travaux, compétences et réalisations de manière professionnelle.' },
        { title: 'Site personnel', description: 'Un espace en ligne qui vous ressemble, avec votre contenu et votre style.' },
        { title: 'Page professionnelle', description: 'Une page de présentation pour vos services, votre CV ou votre activité.' },
        { title: 'Blog personnel', description: 'Partagez vos idées, expériences et passions avec le monde.' },
      ]}
      benefits={['Présence en ligne professionnelle', 'Facile à partager avec un lien', 'Design moderne et responsive', 'Vous vous démarquez', 'Simple à utiliser et à mettre à jour', 'Prix accessible']}
      cta={{ title: 'Créez votre site personnel', subtitle: 'Un site simple, beau et efficace. À partir de 500 $.' }}
    />
  );
}
