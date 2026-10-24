import type { Metadata } from 'next';
import { SolutionPageLayout } from '@/components/landing/solution-page-layout';

export const metadata: Metadata = {
  title: 'Solutions pour consultants',
  description: 'CRM, automatisation des suivis et tunnel de conversion pour consultants indépendants.',
};

export default function ConsultantsPage() {
  return (
    <SolutionPageLayout
      hero={{ badge: 'Consultants', title: 'Développez votre pratique de consultant', subtitle: 'Automatisez vos suivis clients, votre CRM et votre tunnel de conversion.' }}
      problems={['Suivi des prospects fait à la main', 'Pas de CRM adapté à votre activité', 'E-mails de relance envoyés manuellement', 'Pas de page de services professionnelle', 'Difficulté à convertir les visiteurs en clients', 'Temps perdu sur l\'administratif au lieu du conseil']}
      solutions={[
        { title: 'Page de services professionnelle', description: 'Un site qui présente vos services et convertit les visiteurs en prospects.' },
        { title: 'CRM simple', description: 'Suivi des contacts, pipeline de vente et historique des interactions.' },
        { title: 'Automatisation des e-mails', description: 'Séquences de relance automatiques et newsletters programmées.' },
        { title: 'Tunnel de conversion', description: 'Parcours optimisé pour transformer un visiteur en client.' },
      ]}
      benefits={['Plus de prospects qualifiés', 'Aucun contact oublié', 'Meilleur taux de conversion', 'Image professionnelle renforcée', 'Gain de temps sur l\'administratif', 'Focus sur le conseil et la valeur ajoutée']}
      cta={{ title: 'Développez votre activité de consultant', subtitle: 'Automatisez pour vous concentrer sur ce que vous faites de mieux : conseiller.' }}
    />
  );
}
