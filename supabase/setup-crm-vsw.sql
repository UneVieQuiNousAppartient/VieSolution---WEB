-- ============================================================================
-- VIE SOLUTION WEB — CRM COMPLET version vsw_ (pour le projet VieSolutionCSF)
-- ============================================================================
-- FICHIER DÉFINITIF (remplace vsw-lead-system.sql et setup-crm-complet.sql).
-- EXÉCUTÉ dans Supabase le 2026-10-22 (accord de Camille), en quatre migrations vsw_setup_crm_1 à 4
-- (docs/ERREURS-CONNUES.md E04 : pas de DROP, d'où CREATE OR REPLACE TRIGGER ci-dessous).
-- Toutes les tables sont préfixées vsw_ : AUCUNE collision avec les tables CSF
-- (leads, notifications, settings, bookings, etc. de CSF ne sont pas touchées).
-- Les tables du site (contact_requests, chatbot_leads, estimateur_requests,
-- audit_requests, site_testimonials, site_page_views) existent déjà dans ce
-- projet et ne sont pas recréées ici.
-- Réplique du CRM KHI EDUC, domaine adapté IA/Zoho.
-- Suivi automatique (2026-10-21) : moteur horaire côté Next.js (src/lib/crm/moteur.ts, route
-- /api/cron/tick appelée par Vercel Cron) — remplace l'Edge Function vsw-lead-followup, jamais
-- déployée. Les règles et leurs défauts sont dans le code ; vsw_automation_rules ne garde que
-- les réglages changés dans l'admin.
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
  status TEXT NOT NULL DEFAULT 'Nouveau',       -- étapes : src/lib/crm/regles.ts (STATUTS)
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
  estimator JSONB,
  CONSTRAINT vsw_leads_status_check
    CHECK (status IN ('Nouveau', 'Contacté', 'RDV', 'Qualifié', 'Client', 'À relancer', 'Perdu')),
  CONSTRAINT vsw_leads_email_opt_out_source_check
    CHECK (email_opt_out_source IS NULL OR email_opt_out_source IN ('lien', 'one-click', 'admin'))
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
CREATE INDEX IF NOT EXISTS idx_vsw_lead_tasks_open ON vsw_lead_tasks (due_at) WHERE done_at IS NULL;

CREATE TABLE IF NOT EXISTS vsw_outreach_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL DEFAULT 'lead',
  target_id UUID NOT NULL,
  kind TEXT NOT NULL DEFAULT 'first_reply',     -- first_reply (brouillon à approuver)
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

-- Verrou du passage horaire (src/lib/crm/tick.ts) : vrai si le verrou est pris par cet appel.
-- Préfixe vsw_ : le projet est partagé avec CSF.
CREATE OR REPLACE FUNCTION public.vsw_claim_job_lock(p_name text, p_minutes integer, p_by text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_ok boolean;
BEGIN
  INSERT INTO vsw_job_locks (name, locked_until, locked_by, updated_at)
  VALUES (p_name, now() + make_interval(mins => p_minutes), p_by, now())
  ON CONFLICT (name) DO UPDATE
    SET locked_until = EXCLUDED.locked_until, locked_by = EXCLUDED.locked_by, updated_at = now()
    WHERE vsw_job_locks.locked_until < now()
  RETURNING true INTO v_ok;
  RETURN COALESCE(v_ok, false);
END;
$$;

CREATE OR REPLACE FUNCTION public.vsw_release_job_lock(p_name text)
RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE vsw_job_locks SET locked_until = now(), updated_at = now() WHERE name = p_name;
$$;

-- Accès à /admin (double vérification, src/lib/admin/) ------------------------------------
-- Compteur d'essais par fenêtre fixe (vsw_rate_limits) : renvoie le nombre d'essais de la fenêtre,
-- celui-ci compris. Atomique : deux essais simultanés ne lisent jamais le même compte.
CREATE OR REPLACE FUNCTION public.vsw_rate_limit_hit(p_key text, p_window_seconds integer)
RETURNS integer
LANGUAGE sql
SET search_path = public
AS $$
  INSERT INTO vsw_rate_limits (key, window_start, count)
  VALUES (p_key, to_timestamp(floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds), 1)
  ON CONFLICT (key, window_start) DO UPDATE SET count = vsw_rate_limits.count + 1
  RETURNING count;
$$;

-- Anti-rejeu du code à 6 chiffres : n'accepte qu'un pas de 30 s plus récent que le dernier utilisé.
CREATE OR REPLACE FUNCTION public.vsw_totp_accept(p_step bigint)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_ok boolean;
BEGIN
  INSERT INTO vsw_settings (key, value, updated_at, updated_by)
  VALUES ('admin_totp_last_step', to_jsonb(p_step), now(), 'admin')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    WHERE (vsw_settings.value #>> '{}')::bigint < p_step
  RETURNING true INTO v_ok;
  RETURN COALESCE(v_ok, false);
END;
$$;

-- Activation de la double vérification (secret déjà chiffré par le serveur). p_replace = false
-- (session « code d'accès seulement ») : n'écrit QUE s'il n'existe encore aucun secret — deux
-- activations simultanées ne peuvent pas se remplacer l'une l'autre. p_replace = true (session
-- complète, changement de téléphone) : remplace.
CREATE OR REPLACE FUNCTION public.vsw_mfa_enroll(p_secret text, p_step bigint, p_hashes jsonb, p_replace boolean)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_ok boolean;
BEGIN
  IF p_replace THEN
    INSERT INTO vsw_settings (key, value, updated_at, updated_by)
    VALUES ('admin_totp_secret', to_jsonb(p_secret), now(), 'admin')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  ELSE
    INSERT INTO vsw_settings (key, value, updated_at, updated_by)
    VALUES ('admin_totp_secret', to_jsonb(p_secret), now(), 'admin')
    ON CONFLICT (key) DO NOTHING
    RETURNING true INTO v_ok;
    IF v_ok IS NULL THEN RETURN false; END IF;
  END IF;
  INSERT INTO vsw_settings (key, value, updated_at, updated_by) VALUES
    ('admin_totp_last_step', to_jsonb(p_step), now(), 'admin'),
    ('admin_backup_codes', p_hashes, now(), 'admin')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  RETURN true;
END;
$$;

-- Code de secours : usage unique (l'empreinte est retirée de la liste dans la même instruction).
CREATE OR REPLACE FUNCTION public.vsw_use_backup_code(p_hash text)
RETURNS boolean
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_ok boolean;
BEGIN
  UPDATE vsw_settings SET value = value - p_hash, updated_at = now()
  WHERE key = 'admin_backup_codes' AND jsonb_typeof(value) = 'array' AND value ? p_hash
  RETURNING true INTO v_ok;
  RETURN COALESCE(v_ok, false);
END;
$$;

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
-- Gardées par IF NOT EXISTS (pas de DROP POLICY, E04) : le fichier peut être rejoué.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vsw_availability_windows' AND policyname = 'anon read vsw availability') THEN
    CREATE POLICY "anon read vsw availability" ON vsw_availability_windows FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vsw_faq_suggestions' AND policyname = 'anon insert vsw_faq_suggestions') THEN
    CREATE POLICY "anon insert vsw_faq_suggestions" ON vsw_faq_suggestions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vsw_comments' AND policyname = 'anon insert vsw_comments') THEN
    CREATE POLICY "anon insert vsw_comments" ON vsw_comments FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vsw_comments' AND policyname = 'anon read approved vsw_comments') THEN
    CREATE POLICY "anon read approved vsw_comments" ON vsw_comments FOR SELECT TO anon USING (status = 'Approuvé');
  END IF;
END $$;

-- Fonctions du verrou et de l'accès admin : service_role seulement (jamais appelables par la clé anon).
REVOKE ALL ON FUNCTION public.vsw_claim_job_lock(text, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.vsw_release_job_lock(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vsw_claim_job_lock(text, integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.vsw_release_job_lock(text) TO service_role;
REVOKE ALL ON FUNCTION public.vsw_rate_limit_hit(text, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.vsw_totp_accept(bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.vsw_use_backup_code(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vsw_rate_limit_hit(text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.vsw_totp_accept(bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.vsw_use_backup_code(text) TO service_role;
REVOKE ALL ON FUNCTION public.vsw_mfa_enroll(text, bigint, jsonb, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vsw_mfa_enroll(text, bigint, jsonb, boolean) TO service_role;

-- ============================================================================
-- 3. INGESTION : formulaires du site -> vsw_leads (déduplication par courriel)
-- ============================================================================
-- Échéance de la tâche « Rappeler » (comme KHI, lib/speedToLead.js callbackDueAt) : dans l'heure
-- de 8 h à 20 h (heure de Montréal), sinon le prochain matin à 9 h.
CREATE OR REPLACE FUNCTION public.vsw_echeance_rappel(p_now timestamptz)
RETURNS timestamptz
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_local timestamp := p_now AT TIME ZONE 'America/Toronto';
  v_hour integer := extract(hour FROM v_local)::integer;
BEGIN
  IF v_hour >= 8 AND v_hour < 20 THEN
    RETURN p_now + interval '1 hour';
  END IF;
  RETURN (date_trunc('day', v_local)
          + CASE WHEN v_hour >= 20 THEN interval '1 day' ELSE interval '0' END
          + interval '9 hours') AT TIME ZONE 'America/Toronto';
END;
$$;

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
  v_is_rdv boolean := false;
  v_due timestamptz := vsw_echeance_rappel(now());
BEGIN
  IF TG_TABLE_NAME = 'contact_requests' THEN
    v_source := 'site web — contact';
    v_need := COALESCE(NEW.sujet, '') || ' — ' || COALESCE(NEW.message, '');
    v_company := NEW.entreprise;
    v_service := COALESCE(NEW.sujet, '');
    IF NEW.sujet = 'rdv-decouverte' THEN
      v_source := 'site web — rdv';
      v_is_rdv := true;   -- créneau choisi sur le site : l'étape passe à « RDV »
    END IF;
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
    INSERT INTO vsw_leads (name, email, phone, company, service_interest, need, source, status,
                           status_changed_at, next_action_at, consent_at, consent_text, estimator)
    VALUES (NEW.nom, NEW.email, COALESCE(NEW.telephone, ''), v_company, v_service, v_need, v_source,
            CASE WHEN v_is_rdv THEN 'RDV' ELSE 'Nouveau' END, now(),
            v_due, now(), 'Soumission volontaire via le site Vie Solution Web', v_estimator)
    RETURNING id INTO v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', v_source || ' : ' || v_need, 'site-web');
  ELSE
    UPDATE vsw_leads
    SET note = COALESCE(note, '') || E'\n[' || to_char(now(), 'YYYY-MM-DD HH24:MI') || '] ' || v_need,
        estimator = COALESCE(v_estimator, estimator),
        phone = CASE WHEN COALESCE(phone, '') = '' THEN COALESCE(NEW.telephone, '') ELSE phone END,
        next_action_at = LEAST(COALESCE(next_action_at, v_due), v_due),
        status = CASE WHEN v_is_rdv AND status IN ('Nouveau', 'Contacté', 'À relancer') THEN 'RDV' ELSE status END,
        status_changed_at = CASE WHEN v_is_rdv AND status IN ('Nouveau', 'Contacté', 'À relancer') THEN now() ELSE status_changed_at END
    WHERE id = v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, content, author)
    VALUES (v_lead_id, 'form', 'Nouvelle soumission — ' || v_source || ' : ' || v_need, 'site-web');
  END IF;

  INSERT INTO vsw_lead_tasks (lead_id, title, due_at, created_by)
  VALUES (v_lead_id,
          CASE WHEN v_is_rdv THEN 'Confirmer l''appel découverte demandé par ' || NEW.nom
               ELSE 'Rappeler ' || NEW.nom END,
          v_due, 'système');

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_vsw_intake AFTER INSERT ON contact_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

CREATE OR REPLACE TRIGGER trg_vsw_intake AFTER INSERT ON chatbot_leads
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

CREATE OR REPLACE TRIGGER trg_vsw_intake AFTER INSERT ON estimateur_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

CREATE OR REPLACE TRIGGER trg_vsw_intake AFTER INSERT ON audit_requests
FOR EACH ROW EXECUTE FUNCTION fn_vsw_lead_intake();

-- ============================================================================
-- 4. DONNÉES INITIALES
-- ============================================================================
-- vsw_automation_rules : vide au départ (défauts dans src/lib/crm/moteur.ts). Les relances 1 et 2
-- (new_lead_j2, new_lead_j5) sont ACTIVES par défaut (textes approuvés par Camille le 2026-10-21).
-- Pour en couper une sans changer le code :
--   INSERT INTO vsw_automation_rules (key, enabled, updated_by) VALUES ('new_lead_j2', false, 'Camille')
--   ON CONFLICT (key) DO UPDATE SET enabled = false, updated_at = now(), updated_by = EXCLUDED.updated_by;

INSERT INTO vsw_email_templates (key, lang, subject, body) VALUES
  ('first_reply', 'fr', 'Votre demande chez Vie Solution Web — prochaine étape',
   E'Bonjour {{prenom}},\n\nMerci pour votre message — je l''ai bien reçu et je l''ai lu attentivement.\n\nPour bien comprendre votre contexte et vous proposer la bonne approche, le plus simple est un court appel découverte de 30 minutes, gratuit et sans engagement.\n\nQuelles sont vos disponibilités cette semaine ?\n\nAu plaisir,\nCamille — Vie Solution Web'),
  -- Relances automatiques (moteur : new_lead_j2, new_lead_j5) — texte approuvé par Camille le
  -- 2026-10-21 (« oui »). Le pied « loi anti-pourriel » (adresse postale, désabonnement) est
  -- ajouté par le code, pas ici.
  ('followup_new_1', 'fr', 'Votre demande — je pense encore à votre projet',
   E'Bonjour {{prenom}},\n\nMerci encore pour votre demande. Vous avez pris le temps de nous écrire, et j''aimerais vraiment comprendre ce qui vous ferait gagner du temps au quotidien.\n\nLe plus simple : un appel découverte de 30 minutes, gratuit et sans engagement. Vous pouvez choisir le moment qui vous convient ici : {{lien_rdv}}\n\nEt si ce n''est pas le bon moment, répondez simplement à ce courriel : je comprendrai très bien.\n\nAu plaisir de vous lire,\nCamille — Vie Solution Web'),
  ('followup_new_2', 'fr', 'Un dernier petit mot au sujet de votre demande',
   E'Bonjour {{prenom}},\n\nJe ne veux pas vous encombrer : c''est mon dernier courriel à ce sujet.\n\nSi votre projet est toujours d''actualité, je garde du temps pour vous. Un appel découverte de 30 minutes, gratuit et sans engagement, permet souvent d''y voir plus clair : {{lien_rdv}}\n\nSi les choses ont changé, aucun souci. Un simple « pas pour l''instant » en réponse me suffit.\n\nMerci pour votre confiance,\nCamille — Vie Solution Web')
ON CONFLICT (key, lang) DO NOTHING;

-- postal_address : adresse postale du pied des relances (LCAP), donnée par Camille le 2026-10-21
-- (« 40 rue de l'église J4G1H9 », ville « Longueuil ») ; vide = AUCUNE relance automatique ne part.
-- notify_email : adresse des alertes à l'équipe.
INSERT INTO vsw_settings (key, value) VALUES
  ('notify_email', to_jsonb(''::text)),
  ('sender_name', to_jsonb('Vie Solution Web'::text)),
  ('postal_address', to_jsonb('40 rue de l''église, Longueuil J4G1H9'::text))
ON CONFLICT (key) DO NOTHING;

INSERT INTO vsw_availability_windows (weekday, start_minutes, end_minutes)
SELECT d, 540, 1020 FROM generate_series(1, 5) AS d
WHERE NOT EXISTS (SELECT 1 FROM vsw_availability_windows);

-- ============================================================================
-- 5. PASSAGE HORAIRE — Vercel Cron (vercel.json) appelle GET /api/cron/tick avec
--    « Authorization: Bearer <CRON_SECRET> » (variable d'environnement Vercel).
--    Projet Vercel « vie-solution-web » (équipe viesolution, où le cron horaire de KHI se déploie
--    déjà). En secours (plan qui
--    limiterait les crons à un par jour), appeler la route chaque heure
--    depuis Supabase à la place (pg_cron + pg_net, à activer dans le projet), puis retirer
--    vercel.json :
-- ============================================================================
-- SELECT cron.schedule(
--   'vsw-tick',
--   '20 * * * *',
--   $cron$
--   SELECT net.http_get(
--     url := 'https://viesolutionweb.ca/api/cron/tick',
--     headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>')
--   );
--   $cron$
-- );
