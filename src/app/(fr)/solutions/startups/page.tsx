import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Solutions pour startups',
  description: 'MVP, dashboards, outils admin et architecture évolutive pour startups en croissance.',
};

export default function StartupsPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Startups', title: 'Lancez et développez votre startup', subtitle: 'Développez votre MVP rapidement avec une architecture prête à évoluer.' }}
      problems={['Besoin de valider votre idée rapidement', 'Budget limité pour un premier développement', 'Difficulté à trouver des développeurs fiables', 'Architecture qui ne suivra pas la croissance', 'Manque d\'outils pour gérer les opérations', 'Pas de tableau de bord pour piloter l\'activité']}
      solutions={[
        { title: 'MVP / Prototype', description: 'Version minimale de votre produit pour valider rapidement avec de vrais utilisateurs.' },
        { title: 'Dashboards', description: 'Tableaux de bord pour suivre vos KPI et prendre des décisions éclairées.' },
        { title: 'Outils admin', description: 'Back-office sur mesure pour gérer votre activité au quotidien.' },
        { title: 'Architecture évolutive', description: 'Code propre et modulaire, prêt à supporter votre croissance.' },
      ]}
      benefits={['Mise sur le marché rapide', 'Validation avec de vrais utilisateurs', 'Architecture prête à scaler', 'Coûts maîtrisés', 'Code propre et maintenable', 'Partenaire technique fiable']}
      cta={{ title: 'Construisons votre startup ensemble', subtitle: 'Du MVP à la V2, nous vous accompagnons dans chaque étape de votre croissance.' }}
    />
  );
}
