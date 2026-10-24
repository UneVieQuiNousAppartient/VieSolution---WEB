import type { Metadata } from 'next';
import { ServicePageLayout } from '@/components/landing/service-page-layout';

export const metadata: Metadata = {
  title: 'Automatisation des processus',
  description: 'Automatisez vos tâches répétitives et gagnez des heures chaque semaine. Solutions d\'automatisation pour PME.',
};

export default function AutomatisationPage() {
  return (
    <ServicePageLayout
      hero={{
        title: 'Automatisation des processus',
        subtitle: 'Éliminez les tâches répétitives et concentrez-vous sur ce qui compte vraiment.',
      }}
      problem={{
        title: 'Vous perdez du temps sur des tâches répétitives ?',
        items: [
          'Vous copiez-collez des données entre plusieurs outils',
          'Vos rapports sont faits manuellement chaque semaine',
          'Les suivis clients passent entre les mailles du filet',
          'Vos e-mails de relance sont envoyés un par un',
          'Vous saisissez les mêmes informations à plusieurs endroits',
          'Les erreurs manuelles vous coûtent du temps et de l\'argent',
        ],
      }}
      solution={{
        title: 'Des automatisations qui travaillent pour vous',
        description: 'Nous identifions et automatisons vos processus répétitifs pour que votre équipe se concentre sur des tâches à forte valeur ajoutée.',
        features: [
          'Automatisation des e-mails et notifications',
          'Synchronisation automatique des données',
          'Rapports générés automatiquement',
          'Workflows de suivi clients',
          'Intégration avec vos outils existants',
          'Alertes et rappels automatiques',
          'Traitement automatisé des formulaires',
          'Archivage et organisation automatique',
        ],
      }}
      useCases={{
        title: 'Cas d\'usage concrets',
        items: [
          { title: 'Suivi des prospects', description: 'Automatisation du pipeline de vente avec rappels et relances programmées.' },
          { title: 'Rapports hebdomadaires', description: 'Génération et envoi automatique de rapports de performance chaque lundi.' },
          { title: 'Onboarding clients', description: 'Séquence automatisée d\'accueil avec documents, e-mails et tâches.' },
          { title: 'Facturation', description: 'Génération automatique des factures et suivi des paiements.' },
        ],
      }}
      benefits={[
        'Gain de temps mesurable (5 à 15h par semaine)',
        'Réduction des erreurs humaines',
        'Meilleur suivi des clients',
        'Processus fiables et reproductibles',
        'Équipe libérée pour des tâches à valeur ajoutée',
        'Retour sur investissement rapide',
      ]}
      faq={[
        { question: 'Quels types de processus peut-on automatiser ?', answer: 'Presque tout ce qui est répétitif : e-mails, rapports, saisie de données, notifications, suivis clients, facturation, archivage, etc.' },
        { question: 'Faut-il changer mes outils actuels ?', answer: 'Non, nous travaillons avec vos outils existants et les connectons entre eux pour créer des automatisations fluides.' },
        { question: 'Combien de temps faut-il pour mettre en place une automatisation ?', answer: 'Les automatisations simples peuvent être en place en quelques jours. Les projets plus complexes prennent 2 à 4 semaines.' },
        { question: 'Est-ce que c\'est fiable ?', answer: 'Oui, les automatisations sont testées rigoureusement et surveillées. En cas de problème, des alertes sont en place pour réagir rapidement.' },
      ]}
    />
  );
}
