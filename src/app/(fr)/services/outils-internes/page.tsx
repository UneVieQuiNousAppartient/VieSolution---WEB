import type { Metadata } from 'next';
import { ServicePageLayout } from '@/components/landing/service-page-layout';

export const metadata: Metadata = {
  title: 'Outils internes pour entreprises',
  description: 'Tableaux de bord, outils de gestion et solutions internes pour optimiser vos opérations au quotidien.',
};

export default function OutilsInternesPage() {
  return (
    <ServicePageLayout
      hero={{
        title: 'Outils internes sur mesure',
        subtitle: 'Tableaux de bord, outils de gestion et solutions internes pour optimiser vos opérations.',
      }}
      problem={{
        title: 'Vous gérez encore tout avec des fichiers Excel ?',
        items: [
          'Vos données sont dispersées dans des dizaines de fichiers',
          'Les erreurs de saisie s\'accumulent',
          'Il est impossible d\'avoir une vue d\'ensemble en temps réel',
          'Plusieurs personnes modifient le même fichier en même temps',
          'Les rapports sont longs et pénibles à produire',
          'Vous perdez du temps à chercher l\'information',
        ],
      }}
      solution={{
        title: 'Des outils internes qui simplifient tout',
        description: 'Nous créons des outils web internes adaptés à votre entreprise pour centraliser vos données et optimiser vos opérations.',
        features: [
          'Tableaux de bord en temps réel',
          'Gestion des équipes et plannings',
          'Suivi des indicateurs clés (KPI)',
          'Rapports automatisés',
          'Gestion des tâches et projets',
          'Base de données centralisée',
          'Accès multi-utilisateurs avec droits',
          'Interface simple et intuitive',
        ],
      }}
      useCases={{
        title: 'Exemples d\'outils internes',
        items: [
          { title: 'Dashboard de ventes', description: 'Tableau de bord visuel avec chiffre d\'affaires, pipeline et indicateurs de performance.' },
          { title: 'Gestionnaire d\'inventaire', description: 'Suivi des stocks en temps réel avec alertes et historique des mouvements.' },
          { title: 'Planificateur d\'équipe', description: 'Outil de gestion des horaires et disponibilités avec notifications.' },
          { title: 'Suivi de projets', description: 'Plateforme de gestion de projets avec tâches, échéances et collaboration.' },
        ],
      }}
      benefits={[
        'Données centralisées et fiables',
        'Décisions basées sur les données',
        'Fin des fichiers Excel perdus',
        'Gain de temps considérable',
        'Meilleure collaboration d\'équipe',
        'Processus standardisés',
      ]}
      faq={[
        { question: 'Qui peut accéder à l\'outil ?', answer: 'Vous définissez les droits d\'accès. Chaque utilisateur a un compte avec des permissions adaptées à son rôle.' },
        { question: 'Est-ce accessible depuis un téléphone ?', answer: 'Oui, tous nos outils sont responsive et accessibles depuis n\'importe quel appareil connecté à Internet.' },
        { question: 'Peut-on migrer nos données Excel ?', answer: 'Oui, nous prenons en charge la migration de vos données existantes vers le nouvel outil.' },
        { question: 'Combien ça coûte ?', answer: 'Le prix dépend de la complexité de l\'outil. Un dashboard simple démarre autour de 3 000 $.' },
      ]}
    />
  );
}
