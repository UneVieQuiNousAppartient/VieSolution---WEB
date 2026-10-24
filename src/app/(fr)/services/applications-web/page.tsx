import type { Metadata } from 'next';
import { ServicePageLayout } from '@/components/landing/service-page-layout';

export const metadata: Metadata = {
  title: 'Applications web sur mesure',
  description: 'Applications web conçues pour répondre exactement à vos besoins métier. Solutions sur mesure pour PME et entreprises.',
};

export default function ApplicationsWebPage() {
  return (
    <ServicePageLayout
      hero={{
        title: 'Applications web sur mesure',
        subtitle: 'Des applications conçues pour répondre exactement à vos besoins métier.',
      }}
      problem={{
        title: 'Les logiciels standards ne répondent pas à vos besoins ?',
        items: [
          'Vous payez pour des fonctionnalités que vous n\'utilisez pas',
          'Les logiciels du marché ne s\'adaptent pas à vos processus',
          'Vous contournez les limites de vos outils avec des bricolages',
          'La gestion de votre activité nécessite trop d\'outils différents',
          'Vos besoins spécifiques ne sont couverts par aucun logiciel',
          'La croissance de votre entreprise est freinée par vos outils actuels',
        ],
      }}
      solution={{
        title: 'Une application pensée pour vous',
        description: 'Nous développons des applications web sur mesure qui s\'adaptent parfaitement à votre façon de travailler.',
        features: [
          'Interface intuitive et sur mesure',
          'Fonctionnalités adaptées à vos processus',
          'Accessible depuis n\'importe quel appareil',
          'Base de données sécurisée',
          'Gestion des utilisateurs et des droits',
          'Évolutive selon vos besoins futurs',
          'Performances optimisées',
          'Support et maintenance inclus',
        ],
      }}
      useCases={{
        title: 'Types d\'applications que nous développons',
        items: [
          { title: 'Plateforme de gestion', description: 'Application complète pour gérer vos clients, projets, équipes et factures.' },
          { title: 'Portail client', description: 'Espace sécurisé pour vos clients avec suivi de projets et documents.' },
          { title: 'Application métier', description: 'Outil spécialisé pour votre secteur avec les fonctionnalités exactes dont vous avez besoin.' },
          { title: 'MVP pour startup', description: 'Version minimale viable de votre produit pour valider votre idée rapidement.' },
        ],
      }}
      benefits={[
        'Solution 100% adaptée à vos besoins',
        'Gain de productivité significatif',
        'Un seul outil au lieu de plusieurs',
        'Évolutive avec votre croissance',
        'Données centralisées et sécurisées',
        'Avantage concurrentiel',
      ]}
      faq={[
        { question: 'Combien de temps pour développer une application ?', answer: 'Un MVP peut être livré en 4 à 8 semaines. Une application complète prend généralement 2 à 4 mois.' },
        { question: 'Puis-je faire évoluer l\'application plus tard ?', answer: 'Oui, nous concevons des architectures évolutives. Vous pouvez ajouter des fonctionnalités au fil du temps.' },
        { question: 'Comment fonctionne la maintenance ?', answer: 'Nous proposons des forfaits de maintenance pour les mises à jour, corrections de bugs et petites améliorations.' },
        { question: 'L\'application sera-t-elle sécurisée ?', answer: 'Absolument. Nous suivons les meilleures pratiques de sécurité : chiffrement, authentification, validation des données, etc.' },
      ]}
    />
  );
}
