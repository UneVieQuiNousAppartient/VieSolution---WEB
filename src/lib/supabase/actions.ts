import { supabase } from './client';
import type {
  ContactRequestInsert,
  ChatbotLeadInsert,
  EstimateurRequestInsert,
  AuditRequestInsert,
} from '@/types/database';

export async function submitContactRequest(data: ContactRequestInsert) {
  const { error } = await supabase.from('contact_requests').insert(data);
  if (error) throw new Error('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.');
  return { success: true };
}

export async function submitChatbotLead(data: ChatbotLeadInsert) {
  const { error } = await supabase.from('chatbot_leads').insert(data);
  if (error) throw new Error('Erreur lors de l\'enregistrement. Veuillez réessayer.');
  return { success: true };
}

export async function submitEstimateurRequest(data: EstimateurRequestInsert) {
  const { error } = await supabase.from('estimateur_requests').insert(data);
  if (error) throw new Error('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
  return { success: true };
}

export async function submitAuditRequest(data: AuditRequestInsert) {
  const { error } = await supabase.from('audit_requests').insert(data);
  if (error) throw new Error('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
  return { success: true };
}
