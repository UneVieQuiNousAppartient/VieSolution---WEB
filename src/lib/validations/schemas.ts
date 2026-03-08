import { z } from 'zod';

export const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  sujet: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export const auditSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  besoin: z.string().min(1, 'Veuillez sélectionner un type de besoin'),
  message: z.string().optional(),
});

export const estimateurSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  telephone: z.string().optional(),
  type_projet: z.string().min(1, 'Veuillez sélectionner un type de projet'),
  type_client: z.string().optional(),
  budget: z.string().optional(),
  delai: z.string().optional(),
  fonctionnalites: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const chatbotLeadSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse e-mail invalide'),
  telephone: z.string().optional(),
  categorie: z.string(),
  sous_categorie: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type AuditFormData = z.infer<typeof auditSchema>;
export type EstimateurFormData = z.infer<typeof estimateurSchema>;
export type ChatbotLeadFormData = z.infer<typeof chatbotLeadSchema>;
