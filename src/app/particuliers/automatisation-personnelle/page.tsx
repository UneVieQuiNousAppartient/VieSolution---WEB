import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Automatisation personnelle',
  description: 'Automatisez vos tâches quotidiennes, centralisez vos informations et organisez-vous mieux numériquement.',
};

export default function AutomatisationPersonnellePage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Particuliers', title: 'Automatisez votre quotidien', subtitle: 'Gagnez du temps en automatisant certaines tâches et en centralisant vos informations.' }}
      problems={['Vous faites les mêmes tâches chaque jour manuellement', 'Vos informations sont dispersées partout', 'Vous oubliez régulièrement des choses importantes', 'L\'organisation numérique vous semble compliquée']}
      solutions={[
        { title: 'Automatisation des rappels', description: 'Ne ratez plus jamais une échéance ou un rendez-vous important.' },
        { title: 'Centralisation d\'informations', description: 'Un seul endroit pour retrouver toutes vos informations importantes.' },
        { title: 'Organisation numérique', description: 'Systèmes simples pour organiser vos fichiers, contacts et tâches.' },
        { title: 'Notifications intelligentes', description: 'Recevez les bonnes informations au bon moment.' },
      ]}
      benefits={['Gain de temps au quotidien', 'Moins de stress et d\'oublis', 'Tout au même endroit', 'Simple à utiliser', 'Fonctionne en arrière-plan', 'Adapté à vos besoins']}
      cta={{ title: 'Simplifiez votre quotidien', subtitle: 'Des automatisations simples qui vous changent la vie.' }}
    />
  );
}
