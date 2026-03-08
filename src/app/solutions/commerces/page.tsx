import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Solutions pour commerces',
  description: 'Solutions numériques pour commerces : suivi clients, inventaire, processus de vente et automatisation.',
};

export default function CommercesPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Commerces', title: 'Digitalisez votre commerce', subtitle: 'Suivez vos clients, gérez votre inventaire et optimisez vos processus de vente.' }}
      problems={['Inventaire géré sur papier ou Excel', 'Pas de suivi client structuré', 'Processus de vente non optimisés', 'Gestion manuelle des commandes', 'Données de vente difficiles à analyser', 'Communication client limitée']}
      solutions={[
        { title: 'Suivi clients', description: 'Base de données clients avec historique d\'achats et préférences.' },
        { title: 'Gestion d\'inventaire', description: 'Suivi des stocks en temps réel avec alertes et rapports.' },
        { title: 'Automatisation des ventes', description: 'Processus de vente optimisés avec suivi et relances automatiques.' },
        { title: 'Outils internes', description: 'Tableaux de bord et outils de gestion adaptés à votre commerce.' },
      ]}
      benefits={['Meilleure connaissance client', 'Stock toujours à jour', 'Ventes optimisées', 'Moins de tâches manuelles', 'Décisions basées sur les données', 'Fidélisation améliorée']}
      cta={{ title: 'Modernisez votre commerce', subtitle: 'Découvrez comment le numérique peut booster votre activité.' }}
    />
  );
}
