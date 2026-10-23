// Invitation d'agenda d'un atelier (.ics) — renseignements publics seulement (étape F).
import { NextRequest } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { fichierIcs, slugEvtValide } from '@/lib/evenements';
import { lireEvenementPublic } from '@/lib/evenements-serveur';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('e');
  if (!hasServiceKey() || !slugEvtValide(slug)) return new Response('Atelier introuvable.', { status: 404 });
  try {
    const trouve = await lireEvenementPublic(getAdminClient(), slug);
    if (!trouve) return new Response('Atelier introuvable.', { status: 404 });
    return new Response(fichierIcs(trouve.evenement, SITE_URL), {
      headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${slug}.ics"`, 'X-Robots-Tag': 'noindex' },
    });
  } catch {
    return new Response('Atelier introuvable.', { status: 404 });
  }
}
