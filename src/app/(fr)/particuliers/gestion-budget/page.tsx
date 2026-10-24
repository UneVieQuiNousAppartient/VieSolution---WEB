import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Gestion de budget personnel',
  description: 'Outils simples pour suivre votre budget, vos dépenses et mieux gérer vos finances personnelles.',
};

export default function GestionBudgetPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Particuliers', title: 'Gérez votre budget simplement', subtitle: 'Des outils simples et visuels pour suivre vos finances et prendre le contrôle de votre budget.' }}
      problems={['Vous ne savez pas où part votre argent', 'Les applications de budget sont trop compliquées', 'Vous voulez un outil adapté à votre situation', 'Les fichiers Excel ne suffisent plus']}
      solutions={[
        { title: 'Tableau de bord budget', description: 'Vue d\'ensemble claire de vos revenus, dépenses et économies.' },
        { title: 'Suivi des dépenses', description: 'Catégorisez et suivez vos dépenses facilement.' },
        { title: 'Objectifs d\'épargne', description: 'Définissez et suivez vos objectifs financiers.' },
        { title: 'Rapports mensuels', description: 'Analysez vos habitudes de dépenses mois après mois.' },
      ]}
      benefits={['Meilleure visibilité sur vos finances', 'Interface simple et intuitive', 'Adapté à votre situation', 'Accessible depuis votre téléphone', 'Données privées et sécurisées', 'Prise de décision éclairée']}
      cta={{ title: 'Prenez le contrôle de votre budget', subtitle: 'Un outil simple pour mieux gérer vos finances au quotidien.' }}
    />
  );
}
