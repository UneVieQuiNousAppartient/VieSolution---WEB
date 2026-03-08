import type { Metadata } from 'next';
import { ServicePageLayout } from '@/components/landing/service-page-layout';

export const metadata: Metadata = {
  title: 'Intégration API et systèmes',
  description: 'Connectez vos outils et systèmes entre eux pour un flux de travail unifié et sans friction.',
};

export default function IntegrationApiPage() {
  return (
    <ServicePageLayout
      hero={{
        title: 'Intégration API et systèmes',
        subtitle: 'Connectez vos outils entre eux pour un flux de travail unifié et sans friction.',
      }}
      problem={{
        title: 'Vos outils ne communiquent pas entre eux ?',
        items: [
          'Vous utilisez 5, 10, 15 outils qui ne se parlent pas',
          'Les données sont saisies en double dans plusieurs systèmes',
          'Impossible d\'avoir une vue d\'ensemble de votre activité',
          'Les erreurs de synchronisation vous coûtent du temps',
          'Vos équipes jonglent entre trop d\'applications',
          'Les transferts de données sont manuels et lents',
        ],
      }}
      solution={{
        title: 'Un écosystème connecté et fluide',
        description: 'Nous connectons vos outils existants via leurs API pour créer un environnement de travail unifié.',
        features: [
          'Connexion entre vos logiciels existants',
          'Synchronisation des données en temps réel',
          'API sur mesure pour vos besoins spécifiques',
          'Webhooks et automatisations événementielles',
          'Migration et transformation de données',
          'Documentation technique complète',
          'Monitoring et alertes',
          'Support et maintenance',
        ],
      }}
      useCases={{
        title: 'Exemples d\'intégrations',
        items: [
          { title: 'CRM + Comptabilité', description: 'Synchronisation automatique des clients et factures entre votre CRM et logiciel comptable.' },
          { title: 'E-commerce + Inventaire', description: 'Mise à jour automatique des stocks entre votre boutique en ligne et votre système d\'inventaire.' },
          { title: 'Formulaires + Base de données', description: 'Les soumissions de formulaires sont automatiquement enregistrées et traitées.' },
          { title: 'Calendrier + Notifications', description: 'Synchronisation des rendez-vous avec envoi automatique de rappels par e-mail et SMS.' },
        ],
      }}
      benefits={[
        'Fin des saisies en double',
        'Données toujours à jour partout',
        'Vue d\'ensemble de votre activité',
        'Gain de temps considérable',
        'Moins d\'erreurs de synchronisation',
        'Meilleure productivité des équipes',
      ]}
      faq={[
        { question: 'Quels outils peut-on connecter ?', answer: 'Tout logiciel disposant d\'une API peut être connecté : CRM, comptabilité, e-commerce, calendrier, e-mail, bases de données, etc.' },
        { question: 'Est-ce sécurisé ?', answer: 'Oui, toutes les connexions utilisent des protocoles sécurisés (HTTPS, OAuth) et les données sont chiffrées en transit.' },
        { question: 'Que se passe-t-il si un outil change ?', answer: 'Nous concevons des intégrations robustes avec gestion d\'erreurs. En cas de changement d\'API, nous mettons à jour la connexion.' },
        { question: 'Combien ça coûte ?', answer: 'Le prix dépend de la complexité de l\'intégration. Contactez-nous pour un devis gratuit.' },
      ]}
    />
  );
}
