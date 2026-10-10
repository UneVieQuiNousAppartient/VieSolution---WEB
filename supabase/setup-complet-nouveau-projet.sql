-- ============================================================================
-- VIE SOLUTION WEB — INSTALLATION COMPLÈTE POUR UN NOUVEAU PROJET SUPABASE
-- ============================================================================
-- À exécuter en UN SEUL copier-coller dans le SQL Editor d'un projet Supabase neuf.
-- Contenu :
--   A. Tables du site (formulaires publics, témoignages, analytics)
--   B. Système de suivi de leads isolé (vsw_) : ingestion, brouillons à approuver, relances
--   C. Cron (bloc commenté, à exécuter après le déploiement de l'Edge Function)
--
-- Après l'exécution :
--   1. Mettre à jour .env.local du site avec l'URL et la clé anon du nouveau projet
--   2. Déployer la fonction :
--      npx supabase functions deploy vsw-lead-followup --project-ref <REF_DU_PROJET> --no-verify-jwt
--   3. (Optionnel, recommandé) npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref <REF>
--   4. Exécuter le bloc CRON (section C) en remplaçant <CRON_SECRET>
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- A. TABLES DU SITE
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact-page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chatbot_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  categorie TEXT NOT NULL,
  sous_categorie TEXT,
  budget TEXT,
  message TEXT,
  source TEXT DEFAULT 'chatbot',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estimateur_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  besoin TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  auteur TEXT NOT NULL,
  role TEXT,
  citation TEXT NOT NULL,
  note SMALLINT CHECK (note BETWEEN 1 AND 5),
  publie BOOLEAN DEFAULT TRUE,
  ordre INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimateur_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon insert contact_requests" ON contact_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert chatbot_leads" ON chatbot_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert estimateur_requests" ON estimateur_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert audit_requests" ON audit_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon insert site_page_views" ON site_page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read published testimonials" ON site_testimonials FOR SELECT TO anon USING (publie = true);

CREATE POLICY "auth read contact_requests" ON contact_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read chatbot_leads" ON chatbot_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read estimateur_requests" ON estimateur_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read audit_requests" ON audit_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth read site_page_views" ON site_page_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth all site_testimonials" ON site_testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_leads_created_at ON chatbot_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_estimateur_requests_created_at ON estimateur_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_requests_created_at ON audit_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_path ON site_page_views (path);

-- Témoignages d'exemple (publie = false : à remplacer par de vrais témoignages puis passer publie = true)
INSERT INTO site_testimonials (auteur, role, citation, note, publie, ordre) VALUES
  ('Client exemple 1', 'PME de services, Montérégie', 'Exemple de témoignage à remplacer : implantation Zoho CRM + facturation, un suivi client enfin centralisé.', 5, false, 1),
  ('Client exemple 2', 'Travailleur autonome', 'Exemple de témoignage à remplacer : l''automatisation des relances me sauve plusieurs heures par semaine.', 5, false, 2),
  ('Client exemple 3', 'Cabinet comptable', 'Exemple de témoignage à remplacer : formation IA concrète, l''équipe l''utilise tous les jours.', 5, false, 3);

-- ============================================================================
-- B. SYSTÈME DE SUIVI DE LEADS (vsw_)
-- ============================================================================

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

CREATE TABLE IF NOT EXISTS vsw_automation_runs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rule_key TEXT NOT NULL,
  lead_id UUID,
  result TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_vsw_runs_rule ON vsw_automation_runs (rule_key, lead_id);

CREATE TABLE IF NOT EXISTS vsw_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
INSERT INTO vsw_settings (key, value) VALUES
  ('cron_secret', encode(gen_random_bytes(24), 'hex')),
  ('notify_email', ''),
  ('relance_delay_hours', '48'),
  ('first_response_enabled', 'true'),
  ('relance_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

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

-- Ingestion : les 4 formulaires alimentent vsw_leads (déduplication par courriel)
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

-- ============================================================================
-- C. CRON — à exécuter APRÈS le déploiement de l'Edge Function vsw-lead-followup
--    1. Récupérez le secret :  SELECT value FROM vsw_settings WHERE key = 'cron_secret';
--    2. Remplacez <REF_DU_PROJET> et <CRON_SECRET> ci-dessous, décommentez, exécutez.
-- ============================================================================
-- SELECT cron.schedule(
--   'vsw-lead-followups',
--   '20 * * * *',   -- chaque heure à :20
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
