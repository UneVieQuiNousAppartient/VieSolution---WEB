-- ============================================================================
-- VIE SOLUTION WEB — CRM COMPLET (réplique du CRM KHI EDUC, adapté IA/Zoho)
-- ============================================================================
-- ⚠️  POUR UN NOUVEAU PROJET SUPABASE DÉDIÉ (les tables s'appellent `leads`,
--     `bookings`, etc. comme dans KHI — ne PAS exécuter dans VieSolutionCSF).
-- Ce fichier remplace setup-complet-nouveau-projet.sql (il contient tout).
--
-- Structure répliquée table par table depuis KHI EDUC, adaptations de domaine :
--   parent_name -> name · child/grade/subject -> company/service_interest
--   applications (tuteurs) -> applications (stagiaires) : domaines au lieu de matières
--
-- Après exécution :
--   1. .env.local du site : URL + clé anon du nouveau projet
--   2. npx supabase functions deploy vsw-lead-followup --project-ref <REF> --no-verify-jwt
--   3. npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref <REF>  (brouillons IA)
--   4. Exécuter le bloc CRON tout en bas (remplacer <REF> et <CRON_SECRET>)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- A. TABLES DU SITE (formulaires publics, témoignages, analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact-page',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chatbot_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  categorie TEXT NOT NULL,
  sous_categorie TEXT,
  budget TEXT,
  message TEXT,
  source TEXT DEFAULT 'chatbot',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS estimateur_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  type_projet TEXT NOT NULL,
  type_client TEXT,
  budget TEXT,
  delai TEXT,
  fonctionnalites TEXT[],
  description TEXT,
  resultat_estimation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  besoin TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auteur TEXT NOT NULL,
  role TEXT,
  citation TEXT NOT NULL,
  note SMALLINT CHECK (note BETWEEN 1 AND 5),
  publie BOOLEAN DEFAULT TRUE,
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- B. CRM — RÉPLIQUE KHI EDUC (mêmes tables, mêmes colonnes, domaine adapté)
-- ============================================================================

-- B1. Leads (KHI: parent_name/child/grade/subject -> name/company/service_interest)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT,
  service_interest TEXT NOT NULL DEFAULT '',   -- automatisation | agent-ia | zoho | formation | site | autre
  need TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  plan_interest TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Nouveau',       -- Nouveau | Contacté | RDV | Client | Perdu
  note TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'site web',
  status_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  relance_sent_at TIMESTAMPTZ,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  assigned_to TEXT,
  next_action_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  consent_at TIMESTAMPTZ,
  consent_text TEXT,
  city TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  ai_summary JSONB,
  ai_summary_at TIMESTAMPTZ,
  visitor_id UUID,
  score INTEGER,
  score_label TEXT,
  email_opt_out_at TIMESTAMPTZ,
  email_opt_out_source TEXT,
  estimator JSONB                                -- spécifique VSW : détail de l'estimation en ligne
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_leads_next_action ON leads (next_action_at);

-- B2. Activités de lead (identique KHI)
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                 -- form | note | email_in | email_out | automation | call
  content TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'système',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities (lead_id, created_at DESC);

-- B3. Tâches de lead (identique KHI)
CREATE TABLE IF NOT EXISTS lead_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  done_at TIMESTAMPTZ,
  assigned_to TEXT,
  created_by TEXT NOT NULL DEFAULT 'système',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_lead ON lead_tasks (lead_id, due_at);

-- B4. Brouillons de réponse (identique KHI : approbation par lien à jeton)
CREATE TABLE IF NOT EXISTS outreach_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL DEFAULT 'lead',     -- lead | application
  target_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'first_reply',     -- first_reply | relance
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  slots JSONB NOT NULL DEFAULT '[]',
  summary JSONB,
  status TEXT NOT NULL DEFAULT 'pending',       -- pending | approved | sent | rejected | expired
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  sent_email_id TEXT,
  error TEXT
);
CREATE INDEX IF NOT EXISTS idx_outreach_drafts_status ON outreach_drafts (status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_outreach_target_kind ON outreach_drafts (target_type, target_id, kind);

-- B5. Notifications (identique KHI)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  lead_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications (recipient, read_at, created_at DESC);

-- B6. Modèles de courriel (identique KHI)
CREATE TABLE IF NOT EXISTS email_templates (
  key TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'fr',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT,
  PRIMARY KEY (key, lang)
);

-- B7. Courriels liés aux leads (identique KHI : Gmail / Resend)
CREATE TABLE IF NOT EXISTS email_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gmail_id TEXT,
  thread_id TEXT,
  lead_id UUID,
  direction TEXT NOT NULL,            -- in | out
  from_email TEXT NOT NULL,
  to_email TEXT,
  subject TEXT NOT NULL DEFAULT '',
  snippet TEXT NOT NULL DEFAULT '',
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'resend',
  resend_id TEXT,
  message_id TEXT,
  forwarded_at TIMESTAMPTZ,
  attachments JSONB NOT NULL DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_email_messages_lead ON email_messages (lead_id, received_at DESC);

-- B8. Règles et exécutions d'automatisation (identique KHI)
CREATE TABLE IF NOT EXISTS automation_rules (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN,
  delay_hours INTEGER,
  params JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS automation_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_key TEXT NOT NULL,
  lead_id UUID NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'ok',
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_automation_runs ON automation_runs (rule_key, lead_id, period);

-- B9. Réglages (identique KHI : valeur jsonb)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- B10. Vues enregistrées, audit, vie privée, rate-limit, verrous (identiques KHI)
CREATE TABLE IF NOT EXISTS saved_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  sort JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS privacy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL,                 -- acces | rectification | suppression (Loi 25)
  email_hash TEXT NOT NULL,
  admin TEXT NOT NULL,
  summary JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

CREATE TABLE IF NOT EXISTS job_locks (
  name TEXT PRIMARY KEY,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- B11. Réservations + disponibilités (KHI : parent_name/child_name -> name/company)
CREATE TABLE IF NOT EXISTS availability_windows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_minutes INTEGER NOT NULL,
  end_minutes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT,
  need TEXT,
  "start" TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'Confirmée',    -- Confirmée | Annulée | Complétée
  google_event_id TEXT,
  meet_link TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings ("start");

-- B12. Briefs quotidiens IA (identique KHI)
CREATE TABLE IF NOT EXISTS ai_briefs (
  for_date TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  emailed_at TIMESTAMPTZ
);

-- B13. Suggestions de FAQ (identique KHI)
CREATE TABLE IF NOT EXISTS faq_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'Nouvelle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- B14. Commentaires modérés (identique KHI)
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'En attente',   -- En attente | Approuvé | Rejeté
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_at TIMESTAMPTZ,
  consent_text TEXT
);

-- B15. Candidatures (KHI tuteurs -> VSW stagiaires)
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  domaines TEXT[] NOT NULL DEFAULT '{}',       -- dev web | IA / automatisation | Zoho / admin
  ecole TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  lien TEXT,                                   -- CV / LinkedIn / portfolio
  status TEXT NOT NULL DEFAULT 'Reçue',        -- Reçue | Entrevue | Acceptée | Refusée
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_at TIMESTAMPTZ,
  consent_text TEXT,
  status_changed_at TIMESTAMPTZ,
  last_emailed_at TIMESTAMPTZ,
  hired_at TIMESTAMPTZ,
  note TEXT NOT NULL DEFAULT '',
  followup_notified_at TIMESTAMPTZ,
  interview_at TIMESTAMPTZ,
  interview_meet_link TEXT,
  interview_event_id TEXT
);

-- B16. Admin (identiques KHI)
CREATE TABLE IF NOT EXISTS admin_allowlist (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'admin',
  name TEXT,
  added_by TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,                 -- = auth.users.id
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'client', -- client | admin
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- C. RLS
-- ============================================================================
-- Formulaires publics + analytics : insert anonyme seulement
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimateur_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon insert contact_requests" ON contact_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert chatbot_leads" ON chatbot_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert estimateur_requests" ON estimateur_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert audit_requests" ON audit_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert site_page_views" ON site_page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert faq_suggestions" ON faq_suggestions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert comments" ON comments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read published testimonials" ON site_testimonials FOR SELECT TO anon USING (publie = true);
CREATE POLICY "anon read approved comments" ON comments FOR SELECT TO anon USING (status = 'Approuvé');

-- CRM : service-role uniquement (RLS activée sans politique = aucun accès anon/authenticated,
-- exactement comme KHI : « Accès service-role uniquement »)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique des disponibilités (le site affiche les créneaux)
CREATE POLICY "anon read availability" ON availability_windows FOR SELECT TO anon USING (true);

-- ============================================================================
-- D. INGESTION : formulaires du site -> leads (déduplication par courriel)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_lead_intake()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead_id uuid;
  v_source text;
  v_need text;
  v_company text := NULL;
  v_service text := '';
  v_estimator jsonb := NULL;
BEGIN
  IF TG_TABLE_NAME = 'contact_requests' THEN
    v_source := 'site web — contact';
    v_need := COALESCE(NEW.sujet, '') || ' — ' || COALESCE(NEW.message, '');
    v_company := NEW.entreprise;
    v_service := COALESCE(NEW.sujet, '');
    IF NEW.sujet = 'rdv-decouverte' THEN v_source := 'site web — rdv'; END IF;
  ELSIF TG_TABLE_NAME = 'chatbot_leads' THEN
    v_source := 'site web — chatbot';
    v_need := COALESCE(NEW.categorie, '') || COALESCE(' / ' || NEW.sous_categorie, '') || COALESCE(' — ' || NEW.message, '');
    v_service := COALESCE(NEW.categorie, '');
  ELSIF TG_TABLE_NAME = 'estimateur_requests' THEN
    v_source := 'site web — devis';
    v_need := 'Estimation — ' || COALESCE(NEW.type_projet, '') || COALESCE(' : ' || NEW.resultat_estimation, '');
    v_service := COALESCE(NEW.type_projet, '');
    v_estimator := jsonb_build_object(
      'type_projet', NEW.type_projet,
      'delai', NEW.delai,
      'fonctionnalites', NEW.fonctionnalites,
      'description', NEW.description,
      'resultat', NEW.resultat_estimation
    );
  ELSIF TG_TABLE_NAME = 'audit_requests' THEN
    v_source := 'site web — audit';
    v_need := 'Audit — ' || COALESCE(NEW.besoin, '') || COALESCE(' — ' || NEW.message, '');
    v_company := NEW.entreprise;
    v_service := COALESCE(NEW.besoin, '');
  END IF;

  SELECT id INTO v_lead_id
  FROM leads
  WHERE lower(email) = lower(NEW.email)
    AND status NOT IN ('Client', 'Perdu')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_lead_id IS NULL THEN
    INSERT INTO leads (name, email, phone, company, service_interest, need, source,
                       next_action_at, consent_at, consent_text, estimator)
    VALUES (NEW.nom, NEW.email, COALESCE(NEW.telephone, ''), v_company, v_service, v_need, v_source,
            now() + interval '1 day', now(), 'Soumission volontaire via le site viesolutionweb', v_estimator)
    RETURNING id INTO v_lead_id;
    INSERT INTO lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', v_source || ' : ' || v_need, 'site-web');
  ELSE
    UPDATE leads
    SET note = COALESCE(note, '') || E'\n[' || to_char(now(), 'YYYY-MM-DD HH24:MI') || '] ' || v_need,
        estimator = COALESCE(v_estimator, estimator),
        phone = CASE WHEN COALESCE(phone, '') = '' THEN COALESCE(NEW.telephone, '') ELSE phone END,
        next_action_at = LEAST(COALESCE(next_action_at, now() + interval '1 day'), now() + interval '1 day')
    WHERE id = v_lead_id;
    INSERT INTO lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', 'Nouvelle soumission — ' || v_source || ' : ' || v_need, 'site-web');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lead_intake ON contact_requests;
CREATE TRIGGER trg_lead_intake AFTER INSERT ON contact_requests
FOR EACH ROW EXECUTE FUNCTION fn_lead_intake();

DROP TRIGGER IF EXISTS trg_lead_intake ON chatbot_leads;
CREATE TRIGGER trg_lead_intake AFTER INSERT ON chatbot_leads
FOR EACH ROW EXECUTE FUNCTION fn_lead_intake();

DROP TRIGGER IF EXISTS trg_lead_intake ON estimateur_requests;
CREATE TRIGGER trg_lead_intake AFTER INSERT ON estimateur_requests
FOR EACH ROW EXECUTE FUNCTION fn_lead_intake();

DROP TRIGGER IF EXISTS trg_lead_intake ON audit_requests;
CREATE TRIGGER trg_lead_intake AFTER INSERT ON audit_requests
FOR EACH ROW EXECUTE FUNCTION fn_lead_intake();

-- ============================================================================
-- E. DONNÉES INITIALES
-- ============================================================================

-- Règles d'automatisation (mêmes conventions que KHI)
INSERT INTO automation_rules (key, enabled, delay_hours, params) VALUES
  ('first_reply', true, 0, '{"description": "Brouillon IA de première réponse, à approuver"}'),
  ('relance', true, 48, '{"description": "Brouillon de relance si lead non contacté"}')
ON CONFLICT (key) DO NOTHING;

-- Modèles de courriel de repli (utilisés si la clé Claude est absente)
INSERT INTO email_templates (key, lang, subject, body) VALUES
  ('first_reply', 'fr', 'Votre demande chez Vie Solution Web — prochaine étape',
   E'Bonjour {{prenom}},\n\nMerci pour votre message — je l''ai bien reçu et je l''ai lu attentivement.\n\nPour bien comprendre votre contexte et vous proposer la bonne approche, le plus simple est un court appel découverte de 30 minutes, gratuit et sans engagement.\n\nQuelles sont vos disponibilités cette semaine ?\n\nAu plaisir,\nCamille — Vie Solution Web'),
  ('relance', 'fr', 'Petit suivi — votre projet chez Vie Solution Web',
   E'Bonjour {{prenom}},\n\nJe me permets un petit suivi concernant votre demande. Votre projet m''intéresse et je garde du temps pour en discuter.\n\nSi le moment est mal choisi, dites-le-moi simplement — sinon, quelles seraient vos disponibilités pour un appel de 30 minutes ?\n\nBonne journée,\nCamille — Vie Solution Web')
ON CONFLICT (key, lang) DO NOTHING;

-- Réglages (secret du cron généré ici)
INSERT INTO settings (key, value) VALUES
  ('cron_secret', to_jsonb(encode(gen_random_bytes(24), 'hex'))),
  ('notify_email', to_jsonb(''::text)),
  ('relance_delay_hours', to_jsonb(48)),
  ('first_reply_enabled', to_jsonb(true)),
  ('relance_enabled', to_jsonb(true))
ON CONFLICT (key) DO NOTHING;

-- Disponibilités par défaut : Lun-Ven 9h-17h (HE) — [à confirmer]
INSERT INTO availability_windows (weekday, start_minutes, end_minutes)
SELECT d, 540, 1020 FROM generate_series(1, 5) AS d
ON CONFLICT DO NOTHING;

-- Admin [à confirmer : remplacez par votre courriel admin]
-- INSERT INTO admin_allowlist (email, role, name) VALUES ('votre@courriel.ca', 'owner', 'Camille');

-- Témoignages d'exemple (non publiés)
INSERT INTO site_testimonials (auteur, role, citation, note, publie, ordre) VALUES
  ('Client exemple 1', 'PME de services, Montérégie', 'Exemple à remplacer : implantation Zoho CRM + facturation, un suivi client enfin centralisé.', 5, false, 1),
  ('Client exemple 2', 'Travailleur autonome', 'Exemple à remplacer : l''automatisation des relances me sauve plusieurs heures par semaine.', 5, false, 2),
  ('Client exemple 3', 'Cabinet comptable', 'Exemple à remplacer : formation IA concrète, l''équipe l''utilise tous les jours.', 5, false, 3);

-- ============================================================================
-- F. CRON — après déploiement de l'Edge Function vsw-lead-followup
--    Secret :  SELECT value FROM settings WHERE key = 'cron_secret';
-- ============================================================================
-- SELECT cron.schedule(
--   'lead-followups',
--   '20 * * * *',
--   $cron$
--   SELECT net.http_post(
--     url := 'https://<REF_DU_PROJET>.supabase.co/functions/v1/vsw-lead-followup',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <CRON_SECRET>'
--     ),
--     body := '{}'::jsonb
--   );
--   $cron$
-- );
