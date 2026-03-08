import type { ChatbotStep } from '@/types';

export const CHATBOT_FLOW: Record<string, ChatbotStep> = {
  welcome: {
    id: 'welcome',
    message: 'Bonjour ! Je suis l\'assistant VieSolution. Comment puis-je vous aider aujourd\'hui ?',
    options: [
      { label: 'Créer un site web', value: 'site-web', nextStep: 'site-web' },
      { label: 'Automatiser mon entreprise', value: 'automatisation', nextStep: 'automatisation' },
      { label: 'Développer une application', value: 'application', nextStep: 'application' },
      { label: 'Demander un audit gratuit', value: 'audit', nextStep: 'budget' },
      { label: 'Service pour particulier', value: 'particulier', nextStep: 'particulier' },
    ],
  },
  'site-web': {
    id: 'site-web',
    message: 'Quel type de site souhaitez-vous ?',
    options: [
      { label: 'Site vitrine', value: 'site-vitrine', nextStep: 'budget' },
      { label: 'Site professionnel', value: 'site-pro', nextStep: 'budget' },
      { label: 'E-commerce', value: 'ecommerce', nextStep: 'budget' },
      { label: 'Application web', value: 'app-web', nextStep: 'budget' },
    ],
  },
  automatisation: {
    id: 'automatisation',
    message: 'Quel processus souhaitez-vous améliorer ?',
    options: [
      { label: 'E-mails', value: 'emails', nextStep: 'budget' },
      { label: 'Tâches répétitives', value: 'taches', nextStep: 'budget' },
      { label: 'Suivi clients', value: 'suivi-clients', nextStep: 'budget' },
      { label: 'Rapports', value: 'rapports', nextStep: 'budget' },
    ],
  },
  application: {
    id: 'application',
    message: 'Quel type d\'application avez-vous en tête ?',
    options: [
      { label: 'Outil de gestion', value: 'gestion', nextStep: 'budget' },
      { label: 'Tableau de bord', value: 'dashboard', nextStep: 'budget' },
      { label: 'Application métier', value: 'metier', nextStep: 'budget' },
      { label: 'MVP / Prototype', value: 'mvp', nextStep: 'budget' },
    ],
  },
  particulier: {
    id: 'particulier',
    message: 'Quel type d\'aide cherchez-vous ?',
    options: [
      { label: 'Site personnel', value: 'site-perso', nextStep: 'budget' },
      { label: 'Outil sur mesure', value: 'outil-perso', nextStep: 'budget' },
      { label: 'Suivi budget', value: 'budget-perso', nextStep: 'budget' },
      { label: 'Automatisation simple', value: 'auto-perso', nextStep: 'budget' },
    ],
  },
  budget: {
    id: 'budget',
    message: 'Quel est votre budget approximatif ?',
    options: [
      { label: 'Moins de 1 000 $', value: 'moins-1000', nextStep: 'collect-name' },
      { label: '1 000 $ à 3 000 $', value: '1000-3000', nextStep: 'collect-name' },
      { label: '3 000 $ à 5 000 $', value: '3000-5000', nextStep: 'collect-name' },
      { label: '5 000 $ +', value: '5000-plus', nextStep: 'collect-name' },
    ],
  },
  'collect-name': {
    id: 'collect-name',
    message: 'Pour vous recontacter, quel est votre nom ?',
    inputType: 'text',
    field: 'nom',
  },
  'collect-email': {
    id: 'collect-email',
    message: 'Quelle est votre adresse e-mail ?',
    inputType: 'email',
    field: 'email',
  },
  'collect-phone': {
    id: 'collect-phone',
    message: 'Votre numéro de téléphone (optionnel, tapez "passer" pour ignorer) :',
    inputType: 'tel',
    field: 'telephone',
  },
  'collect-message': {
    id: 'collect-message',
    message: 'Un message ou une précision à ajouter ? (optionnel, tapez "passer" pour ignorer)',
    inputType: 'text',
    field: 'message',
  },
  confirmation: {
    id: 'confirmation',
    message: 'Merci ! Votre demande a bien été enregistrée. Nous vous contacterons très bientôt.',
  },
};

export const COLLECT_STEPS_ORDER = ['collect-name', 'collect-email', 'collect-phone', 'collect-message', 'confirmation'];
