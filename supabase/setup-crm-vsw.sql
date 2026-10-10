-- ============================================================================
-- VIE SOLUTION WEB — CRM COMPLET version vsw_ (pour le projet VieSolutionCSF)
-- ============================================================================
-- FICHIER DÉFINITIF (remplace vsw-lead-system.sql et setup-crm-complet.sql).
-- Toutes les tables sont préfixées vsw_ : AUCUNE collision avec les tables CSF
-- (leads, notifications, settings, bookings, etc. de CSF ne sont pas touchées).
-- Les tables du site (contact_requests, chatbot_leads, estimateur_requests,
-- audit_requests, site_testimonials, site_page_views) existent déjà dans ce
-- projet et ne sont pas recréées ici.
-- Réplique du CRM KHI EDUC, domaine adapté IA/Zoho.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 1. PIPELINE DE LEADS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vsw_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT,
  service_interest TEXT NOT NULL DEFAULT '',
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
  estimator JSONB
);
CREATE INDEX IF NOT EXISTS idx_vsw_leads_status ON vsw_leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vsw_leads_email ON vsw_leads (lower(email));
CREATE INDEX IF NOT EXISTS idx_vsw_leads_next_action ON vsw_leads (next_action_at);

CREATE TABLE IF NOT EXISTS vsw_lead_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES vsw_leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  meta JSONB NOT NULL DEFAULT '{}',
  author TEXT NOT NULL DEFAULT 'système',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_lead_activities_lead ON vsw_lead_activities (lead_id, created_at DESC);

CREATE TABLE IF NOT EXISTS vsw_lead_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES vsw_leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  done_at TIMESTAMPTZ,
  assigned_to TEXT,
  created_by TEXT NOT NULL DEFAULT 'système',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_lead_tasks_lead ON vsw_lead_tasks (lead_id, due_at);

CREATE TABLE IF NOT EXISTS vsw_outreach_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL DEFAULT 'lead',
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
CREATE INDEX IF NOT EXISTS idx_vsw_outreach_drafts_status ON vsw_outreach_drafts (status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vsw_outreach_target_kind ON vsw_outreach_drafts (target_type, target_id, kind);

CREATE TABLE IF NOT EXISTS vsw_notifications (
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
CREATE INDEX IF NOT EXISTS idx_vsw_notifications_recipient ON vsw_notifications (recipient, read_at, created_at DESC);

CREATE TABLE IF NOT EXISTS vsw_email_templates (
  key TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'fr',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT,
  PRIMARY KEY (key, lang)
);

CREATE TABLE IF NOT EXISTS vsw_email_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gmail_id TEXT,
  thread_id TEXT,
  lead_id UUID,
  direction TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_vsw_email_messages_lead ON vsw_email_messages (lead_id, received_at DESC);

CREATE TABLE IF NOT EXISTS vsw_automation_rules (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN,
  delay_hours INTEGER,
  params JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS vsw_automation_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_key TEXT NOT NULL,
  lead_id UUID NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'ok',
  meta JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vsw_automation_runs ON vsw_automation_runs (rule_key, lead_id, period);

CREATE TABLE IF NOT EXISTS vsw_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS vsw_saved_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  sort JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsw_admin_audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  meta JSONB NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsw_privacy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  admin TEXT NOT NULL,
  summary JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsw_rate_limits (
  key TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

CREATE TABLE IF NOT EXISTS vsw_job_locks (
  name TEXT PRIMARY KEY,
  locked_until TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsw_availability_windows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_minutes INTEGER NOT NULL,
  end_minutes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vsw_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT,
  need TEXT,
  "start" TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'Confirmée',
  google_event_id TEXT,
  meet_link TEXT,
  lead_id UUID REFERENCES vsw_leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_bookings_start ON vsw_bookings ("start");

CREATE TABLE IF NOT EXISTS vsw_ai_briefs (
  for_date TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  emailed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS vsw_faq_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'Nouvelle',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vsw_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'En attente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consent_at TIMESTAMPTZ,
  consent_text TEXT
);

CREATE TABLE IF NOT EXISTS vsw_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  domaines TEXT[] NOT NULL DEFAULT '{}',
  ecole TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  availability TEXT NOT NULL DEFAULT '',
  lien TEXT,
  status TEXT NOT NULL DEFAULT 'Reçue',
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

-- ============================================================================
-- 2. RLS — service-role uniquement (RLS activée sans politique anon/authenticated,
--    exactement le modèle KHI « Accès service-role uniquement »)
-- ============================================================================
ALTER TABLE vsw_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_outreach_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_job_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_availability_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_ai_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_faq_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_applications ENABLE ROW LEVEL SECURITY;

-- Le site peut afficher les disponibilités et soumettre questions/commentaires
CREATE POLICY "anon read vsw availability" ON vsw_availability_windows FOR SELECT TO anon USING (true);
CREATE POLICY "anon insert vsw_faq_suggestions" ON vsw_faq_suggestions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert vsw_comments" ON vsw_comments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read approved vsw_comments" ON vsw_comments FOR SELECT TO anon USING (status = 'Approuvé');

-- ============================================================================
-- 3. INGESTION : formulaires du site -> vsw_leads (déduplication par courriel)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.fn_vsw_lead_intake()
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
  FROM vsw_leads
  WHERE lower(email) = lower(NEW.email)
    AND status NOT IN ('Client', 'Perdu')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_lead_id IS NULL THEN
    INSERT INTO vsw_leads (name, email, phone, company, service_interest, need, source,
                           next_action_at, consent_at, consent_text, estimator)
    VALUES (NEW.nom, NEW.email, COALESCE(NEW.telephone, ''), v_company, v_service, v_need, v_source,
            now() + interval '1 day', now(), 'Soumission volontaire via le site Vie Solution Web', v_estimator)
    RETURNING id INTO v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', v_source || ' : ' || v_need, 'site-web');
  ELSE
    UPDATE vsw_leads
    SET note = COALESCE(note, '') || E'\n[' || to_char(now(), 'YYYY-MM-DD HH24:MI') || '] ' || v_need,
        estimator = COALESCE(v_estimator, estimator),
        phone = CASE WHEN COALESCE(phone, '') = '' THEN COALESCE(NEW.telephone, '') ELSE phone END,
        next_action_at = LEAST(COALESCE(next_action_at, now() + interval '1 day'), now() + interval '1 day')
    WHERE id = v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', 'Nouvelle soumission — ' || v_source || ' : ' || v_need, 'site-web');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vsw_intake ON contact_requests;
CREATE TRIGGER trg_vsw_intake AFTER INSERT ON contact_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

DROP TRIGGER IF EXISTS trg_vsw_intake ON chatbot_leads;
CREATE TRIGGER trg_vsw_intake AFTER INSERT ON chatbot_leads
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

DROP TRIGGER IF EXISTS trg_vsw_intake ON estimateur_requests;
CREATE TRIGGER trg_vsw_intake AFTER INSERT ON estimateur_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

DROP TRIGGER IF EXISTS trg_vsw_intake ON audit_requests;
CREATE TRIGGER trg_vsw_intake AFTER INSERT ON audit_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

-- ============================================================================
-- 4. DONNÉES INITIALES
-- ============================================================================
INSERT INTO vsw_automation_rules (key, enabled, delay_hours, params) VALUES
  ('first_reply', true, 0, '{"description": "Brouillon IA de première réponse, à approuver"}'),
  ('relance', true, 48, '{"description": "Brouillon de relance si lead non contacté"}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO vsw_email_templates (key, lang, subject, body) VALUES
  ('first_reply', 'fr', 'Votre demande chez Vie Solution Web — prochaine étape',
   E'Bonjour {{prenom}},\n\nMerci pour votre message — je l''ai bien reçu et je l''ai lu attentivement.\n\nPour bien comprendre votre contexte et vous proposer la bonne approche, le plus simple est un court appel découverte de 30 minutes, gratuit et sans engagement.\n\nQuelles sont vos disponibilités cette semaine ?\n\nAu plaisir,\nCamille — Vie Solution Web'),
  ('relance', 'fr', 'Petit suivi — votre projet chez Vie Solution Web',
   E'Bonjour {{prenom}},\n\nJe me permets un petit suivi concernant votre demande. Votre projet m''intéresse et je garde du temps pour en discuter.\n\nSi le moment est mal choisi, dites-le-moi simplement — sinon, quelles seraient vos disponibilités pour un appel de 30 minutes ?\n\nBonne journée,\nCamille — Vie Solution Web')
ON CONFLICT (key, lang) DO NOTHING;

INSERT INTO vsw_settings (key, value) VALUES
  ('cron_secret', to_jsonb(encode(gen_random_bytes(24), 'hex'))),
  ('notify_email', to_jsonb(''::text)),
  ('relance_delay_hours', to_jsonb(48)),
  ('first_reply_enabled', to_jsonb(true)),
  ('relance_enabled', to_jsonb(true))
ON CONFLICT (key) DO NOTHING;

INSERT INTO vsw_availability_windows (weekday, start_minutes, end_minutes)
SELECT d, 540, 1020 FROM generate_series(1, 5) AS d;

-- ============================================================================
-- 5. CRON — après déploiement de l'Edge Function vsw-lead-followup
--    Secret :  SELECT value FROM vsw_settings WHERE key = 'cron_secret';
-- ============================================================================
-- SELECT cron.schedule(
--   'vsw-lead-followups',
--   '20 * * * *',
--   $cron$
--   SELECT net.http_post(
--     url := 'https://gflkfwalfaeeknauxyig.supabase.co/functions/v1/vsw-lead-followup',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <CRON_SECRET>'
--     ),
--     body := '{}'::jsonb
--   );
--   $cron$
-- );
