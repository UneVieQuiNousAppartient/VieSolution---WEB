import type { Metadata } from 'next';
import { ServicePageLayout } from '@/components/landing/service-page-layout';

export const metadata: Metadata = {
  title: 'Développement web sur mesure',
  description: 'Sites web professionnels, rapides et optimisés SEO. VieSolution Web crée des sites qui convertissent vos visiteurs en clients.',
};

export default function DeveloppementWebPage() {
  return (
    <ServicePageLayout
      hero={{
        title: 'Développement web sur mesure',
        subtitle: 'Des sites web professionnels, rapides et conçus pour convertir vos visiteurs en clients.',
      }}
      problem={{
        title: 'Votre site web vous freine ?',
        items: [
          'Votre site est lent et les visiteurs partent avant de le voir',
          'Il ne reflète pas le professionnalisme de votre entreprise',
          'Vous ne recevez aucun contact via votre site',
          'Votre site n\'est pas adapté aux mobiles',
          'Vous ne pouvez pas le modifier facilement',
          'Il n\'apparaît pas dans les résultats Google',
        ],
      }}
      solution={{
        title: 'Un site web qui travaille pour vous',
        description: 'Nous créons des sites web modernes et performants qui attirent, engagent et convertissent vos visiteurs.',
        features: [
          'Design moderne et professionnel',
          'Optimisé pour le SEO',
          'Responsive (mobile, tablette, desktop)',
          'Formulaires de contact intégrés',
          'Chargement ultra-rapide',
          'Facile à maintenir et à faire évoluer',
          'Hébergement et domaine inclus',
          'Formation à l\'utilisation',
        ],
      }}
      useCases={{
        title: 'Exemples de réalisations',
        items: [
          { title: 'Site vitrine pour cabinet de conseil', description: 'Un site professionnel avec blog intégré qui a augmenté les demandes de 40%.' },
          { title: 'Site pour entrepreneur', description: 'Page de services avec tunnel de conversion et formulaire de prise de contact.' },
          { title: 'Portail pour franchise', description: 'Site multi-pages avec gestion de contenu et espace partenaires.' },
          { title: 'Landing page produit', description: 'Page de vente optimisée avec témoignages et CTA stratégiques.' },
        ],
      }}
      benefits={[
        'Plus de visibilité en ligne',
        'Image professionnelle renforcée',
        'Plus de contacts et de leads',
        'Meilleur référencement Google',
        'Site rapide et performant',
        'Autonomie sur le contenu',
      ]}
      faq={[
        { question: 'Combien coûte un site web ?', answer: 'Un site vitrine démarre à 1 500 $. Le prix varie selon la complexité, le nombre de pages et les fonctionnalités souhaitées.' },
        { question: 'Combien de temps faut-il ?', answer: 'Un site vitrine est généralement livré en 2 à 4 semaines. Pour un projet plus complexe, comptez 4 à 8 semaines.' },
        { question: 'Mon site sera-t-il optimisé pour Google ?', answer: 'Oui, chaque site est développé avec les meilleures pratiques SEO : structure propre, meta-données, vitesse de chargement, responsive design.' },
        { question: 'Puis-je modifier le contenu moi-même ?', answer: 'Oui, nous vous fournissons un accès et une formation pour que vous puissiez mettre à jour votre contenu de manière autonome.' },
      ]}
    />
  );
}
