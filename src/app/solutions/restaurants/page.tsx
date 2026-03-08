import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Solutions pour restaurants',
  description: 'Outils numériques pour restaurants : gestion d\'horaires, inventaire, fournisseurs et tableaux de bord.',
};

export default function RestaurantsPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Restaurants', title: 'Des outils numériques pour votre restaurant', subtitle: 'Gérez horaires, inventaire, fournisseurs et équipes avec des outils simples et efficaces.' }}
      problems={['Gestion des horaires compliquée et manuelle', 'Inventaire approximatif et pertes fréquentes', 'Suivi des fournisseurs désorganisé', 'Pas de vue d\'ensemble sur les coûts', 'Communication difficile avec l\'équipe', 'Trop de paperasse administrative']}
      solutions={[
        { title: 'Gestion des horaires', description: 'Planification des shifts, gestion des disponibilités et notifications automatiques.' },
        { title: 'Suivi d\'inventaire', description: 'Stock en temps réel avec alertes de réapprovisionnement et historique.' },
        { title: 'Gestion fournisseurs', description: 'Suivi des commandes, comparaison des prix et historique des achats.' },
        { title: 'Tableau de bord', description: 'Vue d\'ensemble des coûts, revenus et indicateurs clés de performance.' },
      ]}
      benefits={['Fin de la paperasse', 'Inventaire toujours à jour', 'Réduction du gaspillage', 'Meilleure gestion des coûts', 'Équipe mieux organisée', 'Décisions basées sur les données']}
      cta={{ title: 'Modernisez la gestion de votre restaurant', subtitle: 'Découvrez comment nos outils peuvent simplifier votre quotidien.' }}
    />
  );
}
