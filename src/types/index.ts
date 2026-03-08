export * from './database';

export interface ServiceCard {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface PortfolioProject {
  title: string;
  category: string;
  problem: string;
  solution: string;
  benefits: string[];
  image?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface ChatbotStep {
  id: string;
  message: string;
  options?: ChatbotOption[];
  inputType?: 'text' | 'email' | 'tel';
  field?: string;
}

export interface ChatbotOption {
  label: string;
  value: string;
  nextStep: string;
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: ChatbotOption[];
  timestamp: Date;
}
