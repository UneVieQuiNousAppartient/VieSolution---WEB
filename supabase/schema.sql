-- VieSolution Web - Supabase Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: contact_requests
-- Stores contact form submissions
-- =============================================
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

-- =============================================
-- Table: chatbot_leads
-- Stores leads captured via the chatbot widget
-- =============================================
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

-- =============================================
-- Table: estimateur_requests
-- Stores project estimation requests
-- =============================================
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

-- =============================================
-- Table: audit_requests
-- Stores free audit requests
-- =============================================
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

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimateur_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public forms)
CREATE POLICY "Allow anonymous inserts on contact_requests"
  ON contact_requests FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on chatbot_leads"
  ON chatbot_leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on estimateur_requests"
  ON estimateur_requests FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on audit_requests"
  ON audit_requests FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all data
CREATE POLICY "Allow authenticated read on contact_requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on chatbot_leads"
  ON chatbot_leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on estimateur_requests"
  ON estimateur_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on audit_requests"
  ON audit_requests FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- Indexes for performance
-- =============================================
CREATE INDEX idx_contact_requests_created_at ON contact_requests (created_at DESC);
CREATE INDEX idx_chatbot_leads_created_at ON chatbot_leads (created_at DESC);
CREATE INDEX idx_estimateur_requests_created_at ON estimateur_requests (created_at DESC);
CREATE INDEX idx_audit_requests_created_at ON audit_requests (created_at DESC);
CREATE INDEX idx_contact_requests_email ON contact_requests (email);
CREATE INDEX idx_chatbot_leads_email ON chatbot_leads (email);
