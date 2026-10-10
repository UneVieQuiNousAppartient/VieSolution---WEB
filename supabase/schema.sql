-- VieSolution Web — Schéma Supabase du site (appliqué le 2026-10-03 sur le projet VieSolutionCSF)
-- Tables : contact_requests, chatbot_leads, estimateur_requests, audit_requests,
--          site_testimonials (témoignages gérés par l'admin), site_page_views (analytics légères)
-- Voir la migration "viesolution_web_site_tables" dans Supabase pour la version exécutée.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- RLS : inserts anonymes pour les formulaires publics et le tracking,
-- lecture anonyme des témoignages publiés seulement, lecture complète pour authenticated.
-- (Politiques détaillées dans la migration.)
