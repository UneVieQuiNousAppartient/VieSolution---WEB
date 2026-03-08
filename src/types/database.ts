export interface Database {
  public: {
    Tables: {
      contact_requests: {
        Row: ContactRequest;
        Insert: ContactRequestInsert;
        Update: Partial<ContactRequestInsert>;
      };
      chatbot_leads: {
        Row: ChatbotLead;
        Insert: ChatbotLeadInsert;
        Update: Partial<ChatbotLeadInsert>;
      };
      estimateur_requests: {
        Row: EstimateurRequest;
        Insert: EstimateurRequestInsert;
        Update: Partial<EstimateurRequestInsert>;
      };
      audit_requests: {
        Row: AuditRequest;
        Insert: AuditRequestInsert;
        Update: Partial<AuditRequestInsert>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface ContactRequest {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  sujet: string;
  message: string;
  source: string;
  created_at: string;
}

export interface ContactRequestInsert {
  nom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  sujet: string;
  message: string;
  source?: string;
}

export interface ChatbotLead {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  categorie: string;
  sous_categorie: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  created_at: string;
}

export interface ChatbotLeadInsert {
  nom: string;
  email: string;
  telephone?: string;
  categorie: string;
  sous_categorie?: string;
  budget?: string;
  message?: string;
  source?: string;
}

export interface EstimateurRequest {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  type_projet: string;
  type_client: string | null;
  budget: string | null;
  delai: string | null;
  fonctionnalites: string[] | null;
  description: string | null;
  resultat_estimation: string | null;
  created_at: string;
}

export interface EstimateurRequestInsert {
  nom: string;
  email: string;
  telephone?: string;
  type_projet: string;
  type_client?: string;
  budget?: string;
  delai?: string;
  fonctionnalites?: string[];
  description?: string;
  resultat_estimation?: string;
}

export interface AuditRequest {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  besoin: string;
  message: string | null;
  created_at: string;
}

export interface AuditRequestInsert {
  nom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  besoin: string;
  message?: string;
}
