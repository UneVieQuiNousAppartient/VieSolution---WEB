-- ============================================================
-- VieSolution Web (site vitrine) — système de suivi de leads ISOLÉ
-- À exécuter dans le SQL Editor du projet Supabase VieSolutionCSF
-- Tables préfixées vsw_ : aucun lien avec les tables CSF existantes.
-- Patron : formulaires du site -> vsw_leads -> brouillons IA à approuver -> relance 48h
-- ============================================================

-- 1) Pipeline de leads du site
CREATE TABLE IF NOT EXISTS vsw_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  source TEXT NOT NULL,            -- contact | chatbot | devis | audit | rdv
  message TEXT,
  estimator JSONB,
  status TEXT NOT NULL DEFAULT 'new',   -- new | contacted | rdv | won | lost
  follow_up_at TIMESTAMPTZ DEFAULT (now() + interval '1 day'),
  contact_attempts INT NOT NULL DEFAULT 0,
  first_contacted_at TIMESTAMPTZ,
  ai_brief TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_leads_status ON vsw_leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vsw_leads_email ON vsw_leads (lower(email));

-- 2) Journal d'activités
CREATE TABLE IF NOT EXISTS vsw_lead_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES vsw_leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,              -- form | automation | note | email
  title TEXT NOT NULL,
  details TEXT,
  author TEXT DEFAULT 'automation',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_activities_lead ON vsw_lead_activities (lead_id, created_at DESC);

-- 3) Brouillons de réponse (jamais envoyés automatiquement — à approuver)
CREATE TABLE IF NOT EXISTS vsw_outreach_drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES vsw_leads(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,              -- first_response | relance_48h
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | sent | rejected
  generated_by TEXT DEFAULT 'template',    -- claude | template
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_vsw_drafts_status ON vsw_outreach_drafts (status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vsw_drafts_lead_kind ON vsw_outreach_drafts (lead_id, kind);

-- 4) Journal des exécutions d'automatisation (idempotence)
CREATE TABLE IF NOT EXISTS vsw_automation_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rule_key TEXT NOT NULL,
  lead_id UUID,
  result TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_runs_rule ON vsw_automation_runs (rule_key, lead_id);

-- 5) Réglages (secret du cron, courriel de notification, règles)
CREATE TABLE IF NOT EXISTS vsw_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO vsw_settings (key, value) VALUES
  ('cron_secret', encode(gen_random_bytes(24), 'hex')),
  ('notify_email', ''),                      -- votre courriel pour être averti des nouveaux brouillons (vide = pas d'envoi)
  ('relance_delay_hours', '48'),
  ('first_response_enabled', 'true'),
  ('relance_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- 6) RLS : service-role seulement pour l'écriture ; lecture/update pour authenticated
ALTER TABLE vsw_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_outreach_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsw_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read vsw_leads" ON vsw_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth update vsw_leads" ON vsw_leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth read vsw_activities" ON vsw_lead_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read vsw_drafts" ON vsw_outreach_drafts FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth update vsw_drafts" ON vsw_outreach_drafts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- 7) Ingestion : les 4 formulaires du site alimentent vsw_leads (dédup par courriel)
CREATE OR REPLACE FUNCTION public.fn_vsw_lead_intake()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lead_id uuid;
  v_source text;
  v_message text;
  v_entreprise text := NULL;
  v_estimator jsonb := NULL;
BEGIN
  IF TG_TABLE_NAME = 'contact_requests' THEN
    v_source := 'contact';
    v_message := COALESCE(NEW.sujet, '') || ' — ' || COALESCE(NEW.message, '');
    v_entreprise := NEW.entreprise;
    IF NEW.sujet = 'rdv-decouverte' THEN v_source := 'rdv'; END IF;
  ELSIF TG_TABLE_NAME = 'chatbot_leads' THEN
    v_source := 'chatbot';
    v_message := COALESCE(NEW.categorie, '') || COALESCE(' / ' || NEW.sous_categorie, '') || COALESCE(' — ' || NEW.message, '');
  ELSIF TG_TABLE_NAME = 'estimateur_requests' THEN
    v_source := 'devis';
    v_message := 'Estimation — ' || COALESCE(NEW.type_projet, '') || COALESCE(' : ' || NEW.resultat_estimation, '');
    v_estimator := jsonb_build_object(
      'type_projet', NEW.type_projet,
      'delai', NEW.delai,
      'fonctionnalites', NEW.fonctionnalites,
      'description', NEW.description,
      'resultat', NEW.resultat_estimation
    );
  ELSIF TG_TABLE_NAME = 'audit_requests' THEN
    v_source := 'audit';
    v_message := 'Audit — ' || COALESCE(NEW.besoin, '') || COALESCE(' — ' || NEW.message, '');
    v_entreprise := NEW.entreprise;
  END IF;

  SELECT id INTO v_lead_id
  FROM vsw_leads
  WHERE lower(email) = lower(NEW.email)
    AND status NOT IN ('won', 'lost')
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_lead_id IS NULL THEN
    INSERT INTO vsw_leads (nom, email, telephone, entreprise, source, message, estimator)
    VALUES (NEW.nom, NEW.email, NEW.telephone, v_entreprise, v_source, v_message, v_estimator)
    RETURNING id INTO v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, title, details, author)
    VALUES (v_lead_id, 'form', 'Nouveau lead — ' || v_source, v_message, 'site-web');
  ELSE
    UPDATE vsw_leads
    SET message = COALESCE(message, '') || E'\n[' || to_char(now(), 'YYYY-MM-DD HH24:MI') || ' ' || v_source || '] ' || v_message,
        estimator = COALESCE(v_estimator, estimator),
        telephone = COALESCE(telephone, NEW.telephone),
        updated_at = now()
    WHERE id = v_lead_id;
    INSERT INTO vsw_lead_activities (lead_id, type, title, details, author)
    VALUES (v_lead_id, 'form', 'Nouvelle soumission — ' || v_source, v_message, 'site-web');
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

-- ============================================================
-- 8) CRON (à exécuter APRÈS le déploiement de l'Edge Function vsw-lead-followup)
--    Remplace <CRON_SECRET> par : SELECT value FROM vsw_settings WHERE key = 'cron_secret';
-- ============================================================
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
