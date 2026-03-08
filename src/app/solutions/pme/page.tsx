import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Solutions pour PME',
  description: 'Centralisez vos outils, automatisez l\'administratif et accélérez la croissance de votre PME.',
};

export default function PMEPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'PME', title: 'Simplifiez la gestion de votre PME', subtitle: 'Centralisez vos outils, automatisez l\'administratif et concentrez-vous sur votre croissance.' }}
      problems={['Trop de temps passé sur l\'administratif', 'Données dispersées entre plusieurs outils', 'Processus manuels source d\'erreurs', 'Difficulté à avoir une vue d\'ensemble', 'Outils trop complexes ou trop limités', 'Manque de temps pour innover']}
      solutions={[
        { title: 'Site web professionnel', description: 'Un site qui reflète le professionnalisme de votre entreprise et génère des contacts.' },
        { title: 'Tableau de bord centralisé', description: 'Une vue d\'ensemble de votre activité avec les indicateurs clés en temps réel.' },
        { title: 'Automatisation administrative', description: 'Automatisez la facturation, les relances, les rapports et les tâches répétitives.' },
        { title: 'Outils de gestion internes', description: 'Des outils sur mesure pour gérer vos projets, clients et équipes.' },
      ]}
      benefits={['Gain de 5 à 15 heures par semaine', 'Réduction des erreurs de 90%', 'Vue d\'ensemble en temps réel', 'Meilleure satisfaction client', 'Processus fiables et reproductibles', 'Plus de temps pour développer votre activité']}
      cta={{ title: 'Prêt à simplifier votre PME ?', subtitle: 'Demandez un audit gratuit et découvrez comment nous pouvons vous aider.' }}
    />
  );
}
