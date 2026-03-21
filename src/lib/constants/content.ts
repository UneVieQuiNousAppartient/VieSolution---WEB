import type { ServiceCard, FAQItem, ProcessStep, PortfolioProject, PricingTier } from '@/types';

export const SERVICES: ServiceCard[] = [
  {
    title: 'Développement web',
    description: 'Sites web professionnels, rapides et optimisés pour convertir vos visiteurs en clients.',
    icon: 'Globe',
    href: '/services/developpement-web',
  },
  {
    title: 'Intégration IA en entreprise',
    description: 'Installez l\'intelligence artificielle dans vos processus pour décupler votre productivité.',
    icon: 'Brain',
    href: '/services/integration-ia',
  },
  {
    title: 'Automatisation intelligente',
    description: 'Éliminez les tâches répétitives grâce à des workflows automatisés, boostés par l\'IA.',
    icon: 'Zap',
    href: '/services/automatisation',
  },
  {
    title: 'Applications web sur mesure',
    description: 'Des applications conçues pour répondre exactement à vos besoins métier.',
    icon: 'Layout',
    href: '/services/applications-web',
  },
  {
    title: 'Chatbots & Assistants IA',
    description: 'Déployez des assistants IA pour votre service client, vente et support interne.',
    icon: 'MessageSquare',
    href: '/services/chatbots-ia',
  },
  {
    title: 'Diagnostic & Optimisation',
    description: 'Audit complet de votre présence web et de vos processus avec recommandations concrètes.',
    icon: 'Search',
    href: '/diagnostic',
  },
  {
    title: 'Outils internes',
    description: 'Tableaux de bord, outils de gestion et solutions internes pour optimiser vos opérations.',
    icon: 'Settings',
    href: '/services/outils-internes',
  },
  {
    title: 'Intégration API & systèmes',
    description: 'Connectez vos outils entre eux pour un flux de travail unifié et sans friction.',
    icon: 'Link',
    href: '/services/integration-api',
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
    description: 'Chaque solution est adaptée à vos besoins spécifiques. Jamais de template générique.',
  },
  {
    icon: 'Brain',
    title: 'Expertise IA intégrée',
    description: 'Nous intégrons l\'IA là où elle crée vraiment de la valeur pour votre entreprise.',
  },
  {
    icon: 'Cpu',
    title: 'Technologies de pointe',
    description: 'Next.js, React, Supabase, OpenAI, n8n — les meilleurs outils du marché.',
  },
  {
    icon: 'Zap',
    title: 'Automatisations ROI positif',
    description: 'Chaque automatisation doit vous faire économiser du temps et de l\'argent mesurables.',
  },
  {
    icon: 'Shield',
    title: 'Sécurité par défaut',
    description: 'Chiffrement, authentification, validation — la sécurité est intégrée dès la conception.',
  },
  {
    icon: 'Heart',
    title: 'Accompagnement humain',
    description: 'Un interlocuteur dédié qui vous accompagne de A à Z, même après la livraison.',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Comment l\'IA peut-elle aider mon entreprise concrètement ?',
    answer: 'L\'IA peut automatiser vos réponses clients (chatbot), rédiger du contenu, analyser vos données, classer des documents, générer des rapports et optimiser vos processus. Les gains sont souvent de 10 à 30 heures par mois.',
  },
  {
    question: 'Combien de temps faut-il pour développer un projet ?',
    answer: 'Un site vitrine : 2 à 4 semaines. Une application web : 4 à 12 semaines. L\'intégration d\'un chatbot IA : 1 à 2 semaines. Nous établissons un calendrier clair dès le début.',
  },
  {
    question: 'Combien coûte un projet web avec IA ?',
    answer: 'Un site vitrine démarre à 1 500 $, un chatbot IA à 2 000 $, une application sur mesure à partir de 5 000 $. L\'intégration IA complète dans vos processus à partir de 3 500 $. Devis gratuit disponible.',
  },
  {
    question: 'Est-ce que mes données sont en sécurité ?',
    answer: 'Absolument. Nous utilisons le chiffrement SSL, des bases de données sécurisées (Supabase), des politiques RLS, la validation des données et les meilleures pratiques OWASP. Vos données restent les vôtres.',
  },
  {
    question: 'Proposez-vous de la maintenance ?',
    answer: 'Oui. Forfaits de maintenance incluant mises à jour, monitoring, corrections et améliorations continues. Nous surveillons aussi les performances de vos intégrations IA.',
  },
  {
    question: 'Qu\'est-ce que le diagnostic gratuit inclut ?',
    answer: 'Un audit complet : performance de votre site, SEO, sécurité, processus automatisables, opportunités IA et recommandations concrètes avec estimation budgétaire. 100% gratuit et sans engagement.',
  },
  {
    question: 'Faut-il changer mes outils actuels ?',
    answer: 'Non. Nous nous intégrons à vos outils existants (Google, Slack, CRM, comptabilité...) et les connectons entre eux. L\'IA vient se greffer sur vos processus actuels.',
  },
  {
    question: 'Comment se passe l\'accompagnement ?',
    answer: 'Diagnostic > Conception > Développement > Tests > Mise en ligne > Formation > Support continu. Un interlocuteur dédié tout au long du projet, avec des points réguliers.',
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
    name: 'Essentiel',
    price: 'À partir de 1 500 $',
    description: 'Présence en ligne professionnelle et premiers pas dans le numérique.',
    features: [
      'Site web moderne (jusqu\'à 5 pages)',
      'Design responsive premium',
      'Formulaire de contact sécurisé',
      'Optimisation SEO complète',
      'Chatbot simple de capture de leads',
      'Mise en ligne et formation',
      'Support 30 jours',
    ],
    cta: 'Commencer',
  },
  {
    name: 'Business + IA',
    price: 'À partir de 4 500 $',
    description: 'Pour les PME qui veulent automatiser et intégrer l\'IA dans leurs opérations.',
    features: [
      'Tout ce qui est dans Essentiel',
      'Jusqu\'à 15 pages',
      'Chatbot IA intelligent',
      'Automatisations de processus',
      'Intégration avec vos outils existants',
      'Tableau de bord analytique',
      'Support 90 jours + formation IA',
    ],
    cta: 'Choisir Business + IA',
    highlighted: true,
  },
  {
    name: 'Transformation',
    price: 'Sur devis',
    description: 'Transformation numérique complète avec IA, automatisations avancées et accompagnement dédié.',
    features: [
      'Audit et diagnostic complet',
      'Application web sur mesure',
      'Intégration IA multi-processus',
      'Automatisations avancées (n8n)',
      'Architecture évolutive',
      'Assistants IA personnalisés',
      'Support prioritaire illimité',
      'Accompagnement stratégique continu',
    ],
    cta: 'Discuter de mon projet',
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
