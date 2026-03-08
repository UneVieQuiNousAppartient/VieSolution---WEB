import type { ServiceCard, FAQItem, ProcessStep, PortfolioProject, PricingTier } from '@/types';

export const SERVICES: ServiceCard[] = [
  {
    title: 'Développement web',
    description: 'Sites web professionnels, rapides et optimisés pour convertir vos visiteurs en clients.',
    icon: 'Globe',
    href: '/services/developpement-web',
  },
  {
    title: 'Automatisation des processus',
    description: 'Éliminez les tâches répétitives et gagnez des heures chaque semaine grâce à l\'automatisation.',
    icon: 'Zap',
    href: '/services/automatisation',
  },
  {
    title: 'Intégration API',
    description: 'Connectez vos outils entre eux pour un flux de travail unifié et sans friction.',
    icon: 'Link',
    href: '/services/integration-api',
  },
  {
    title: 'Applications web sur mesure',
    description: 'Des applications conçues pour répondre exactement à vos besoins métier.',
    icon: 'Layout',
    href: '/services/applications-web',
  },
  {
    title: 'Outils internes',
    description: 'Tableaux de bord, outils de gestion et solutions internes pour optimiser vos opérations.',
    icon: 'Settings',
    href: '/services/outils-internes',
  },
  {
    title: 'Solutions pour particuliers',
    description: 'Sites personnels, outils de gestion et automatisations adaptées à vos besoins.',
    icon: 'User',
    href: '/particuliers',
  },
];

export const PROBLEMS = [
  {
    icon: 'Clock',
    title: 'Tâches répétitives',
    description: 'Vous passez des heures sur des tâches qui pourraient être automatisées.',
  },
  {
    icon: 'AlertTriangle',
    title: 'Erreurs humaines',
    description: 'Les processus manuels génèrent des erreurs coûteuses.',
  },
  {
    icon: 'Database',
    title: 'Données dispersées',
    description: 'Vos informations sont éparpillées entre plusieurs outils non connectés.',
  },
  {
    icon: 'Timer',
    title: 'Perte de temps',
    description: 'Vos équipes perdent du temps sur des processus inefficaces.',
  },
  {
    icon: 'Unplug',
    title: 'Outils non connectés',
    description: 'Vos logiciels ne communiquent pas entre eux.',
  },
  {
    icon: 'FileX',
    title: 'Processus manuels',
    description: 'Vous faites encore tout à la main alors que la technologie peut vous aider.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: 'Analyse du besoin',
    description: 'Nous prenons le temps de comprendre votre entreprise, vos défis et vos objectifs.',
    icon: 'Search',
  },
  {
    step: 2,
    title: 'Conception',
    description: 'Nous définissons ensemble la solution idéale avec une maquette et un plan clair.',
    icon: 'PenTool',
  },
  {
    step: 3,
    title: 'Développement',
    description: 'Nous développons votre solution avec les technologies les plus modernes.',
    icon: 'Code',
  },
  {
    step: 4,
    title: 'Mise en ligne',
    description: 'Déploiement, tests finaux et accompagnement pour une transition en douceur.',
    icon: 'Rocket',
  },
];

export const WHY_CHOOSE_US = [
  {
    icon: 'Target',
    title: 'Solutions sur mesure',
    description: 'Chaque projet est unique. Nous créons des solutions adaptées à vos besoins spécifiques.',
  },
  {
    icon: 'Brain',
    title: 'Vision business + technique',
    description: 'Nous comprenons vos enjeux d\'affaires autant que la technologie.',
  },
  {
    icon: 'Cpu',
    title: 'Technologies modernes',
    description: 'Nous utilisons les outils les plus performants et les plus récents du marché.',
  },
  {
    icon: 'Zap',
    title: 'Automatisations utiles',
    description: 'Nous automatisons ce qui doit l\'être pour vous faire gagner du temps.',
  },
  {
    icon: 'Heart',
    title: 'Accompagnement humain',
    description: 'Un interlocuteur dédié qui vous accompagne à chaque étape.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Combien de temps faut-il pour développer un site web ?',
    answer: 'Un site vitrine peut être livré en 2 à 4 semaines. Pour une application web sur mesure, comptez 4 à 12 semaines selon la complexité. Nous établissons un calendrier clair dès le début du projet.',
  },
  {
    question: 'Combien coûte un projet web ?',
    answer: 'Les prix varient selon la complexité. Un site vitrine démarre à partir de 1 500 $, une application web sur mesure à partir de 5 000 $. Nous proposons un devis gratuit adapté à vos besoins.',
  },
  {
    question: 'Quels types de projets réalisez-vous ?',
    answer: 'Sites web, applications web, automatisations de processus, intégrations API, outils internes, tableaux de bord... Tout ce qui peut être développé avec les technologies web modernes.',
  },
  {
    question: 'Proposez-vous de la maintenance ?',
    answer: 'Oui, nous offrons des forfaits de maintenance pour garder votre solution à jour, sécurisée et performante. La maintenance inclut les mises à jour, corrections et améliorations mineures.',
  },
  {
    question: 'Qu\'est-ce que l\'automatisation peut m\'apporter ?',
    answer: 'L\'automatisation élimine les tâches répétitives, réduit les erreurs, accélère vos processus et libère du temps pour vos équipes. Les gains sont souvent mesurables en heures par semaine.',
  },
  {
    question: 'Comment se passe l\'accompagnement ?',
    answer: 'Nous vous accompagnons de A à Z : analyse de vos besoins, conception, développement, mise en ligne et support. Vous avez un interlocuteur dédié tout au long du projet.',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    title: 'Site de services pour cabinet de conseil',
    category: 'Site web',
    problem: 'Le cabinet n\'avait pas de présence en ligne et perdait des clients potentiels.',
    solution: 'Site web professionnel avec formulaire de contact, blog et optimisation SEO.',
    benefits: ['Augmentation de 40% des demandes', 'Meilleur référencement Google', 'Image professionnelle renforcée'],
  },
  {
    title: 'Application de gestion pour restaurant',
    category: 'Application web',
    problem: 'Gestion des horaires, fournisseurs et inventaire faite manuellement sur papier.',
    solution: 'Application web complète avec gestion d\'horaires, suivi fournisseurs et inventaire en temps réel.',
    benefits: ['2h gagnées par jour', 'Réduction des erreurs de commande', 'Meilleur suivi des coûts'],
  },
  {
    title: 'Dashboard de suivi pour PME',
    category: 'Outil interne',
    problem: 'Les données de vente étaient dispersées dans plusieurs fichiers Excel.',
    solution: 'Tableau de bord centralisé avec indicateurs clés et rapports automatisés.',
    benefits: ['Vue d\'ensemble instantanée', 'Rapports automatiques', 'Décisions basées sur les données'],
  },
  {
    title: 'Automatisation CRM pour consultant',
    category: 'Automatisation',
    problem: 'Le consultant passait 5h par semaine à gérer ses contacts et suivis manuellement.',
    solution: 'Système automatisé de suivi clients avec rappels, e-mails et pipeline de vente.',
    benefits: ['5h gagnées par semaine', 'Aucun prospect oublié', 'Meilleur taux de conversion'],
  },
  {
    title: 'Plateforme de réservation pour spa',
    category: 'Application web',
    problem: 'Les réservations se faisaient par téléphone, causant des erreurs et des doubles réservations.',
    solution: 'Système de réservation en ligne avec calendrier, confirmations automatiques et paiement.',
    benefits: ['Réservations 24/7', 'Zéro double réservation', 'Paiements sécurisés'],
  },
  {
    title: 'Outil de gestion interne pour commerce',
    category: 'Outil interne',
    problem: 'Le commerce gérait son inventaire et ses commandes avec des feuilles de calcul.',
    solution: 'Outil web de gestion d\'inventaire avec alertes de stock, historique et rapports.',
    benefits: ['Stock toujours à jour', 'Alertes automatiques', 'Historique complet'],
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: 'À partir de 1 500 $',
    description: 'Idéal pour les entrepreneurs et petites entreprises qui veulent une présence en ligne professionnelle.',
    features: [
      'Site web vitrine (jusqu\'à 5 pages)',
      'Design responsive et moderne',
      'Formulaire de contact',
      'Optimisation SEO de base',
      'Mise en ligne incluse',
      'Support 30 jours',
    ],
    cta: 'Commencer',
  },
  {
    name: 'Business',
    price: 'À partir de 3 500 $',
    description: 'Pour les PME qui veulent aller plus loin avec des fonctionnalités avancées et de l\'automatisation.',
    features: [
      'Tout ce qui est inclus dans Starter',
      'Jusqu\'à 15 pages',
      'Automatisation de base',
      'Intégration avec vos outils',
      'Tableau de bord simple',
      'Support 60 jours',
      'Formation incluse',
    ],
    cta: 'Choisir Business',
    highlighted: true,
  },
  {
    name: 'Sur mesure',
    price: 'Sur devis',
    description: 'Pour les projets complexes qui nécessitent une solution entièrement personnalisée.',
    features: [
      'Analyse approfondie de vos besoins',
      'Application web sur mesure',
      'Automatisations avancées',
      'Intégrations multiples',
      'Architecture évolutive',
      'Support prioritaire',
      'Accompagnement continu',
    ],
    cta: 'Demander un devis',
  },
];

export const SECTORS = [
  {
    title: 'PME',
    description: 'Centralisez vos outils et automatisez l\'administratif pour vous concentrer sur votre croissance.',
    icon: 'Building2',
    href: '/solutions/pme',
  },
  {
    title: 'Restaurants',
    description: 'Gérez horaires, inventaire et fournisseurs avec des outils numériques adaptés.',
    icon: 'UtensilsCrossed',
    href: '/solutions/restaurants',
  },
  {
    title: 'Consultants',
    description: 'Automatisez votre CRM, vos suivis clients et votre tunnel de conversion.',
    icon: 'Briefcase',
    href: '/solutions/consultants',
  },
  {
    title: 'Commerces',
    description: 'Suivez vos clients, votre inventaire et optimisez vos ventes.',
    icon: 'ShoppingBag',
    href: '/solutions/commerces',
  },
  {
    title: 'Startups',
    description: 'Développez votre MVP rapidement avec une architecture prête à évoluer.',
    icon: 'Rocket',
    href: '/solutions/startups',
  },
  {
    title: 'Particuliers',
    description: 'Sites personnels, outils de gestion et automatisations simples.',
    icon: 'User',
    href: '/particuliers',
  },
];
