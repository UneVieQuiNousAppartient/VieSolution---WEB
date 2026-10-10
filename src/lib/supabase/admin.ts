// Client Supabase côté serveur (service role) — réservé aux routes /api/admin/*.
// Nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local (jamais exposé au client).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function hasServiceKey(): boolean {
  return Boolean(url && serviceKey);
}

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (!cached) {
    cached = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
