// Retour de Google après « Connecter Google Agenda » (étape C). Le state reçu doit être celui du
// cookie, signé avec ADMIN_SECRET et non expiré : seule une connexion lancée depuis l'admin aboutit.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { COOKIE_ETAT, enregistrerConnexion, etatValide, googleConfigure } from '@/lib/agenda-google';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const retour = (req: NextRequest, resultat: string) => {
  const res = NextResponse.redirect(new URL(`/admin?google=${resultat}`, req.url));
  res.cookies.set(COOKIE_ETAT, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 0, path: '/api/admin/google' });
  return res;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  if (!googleConfigure() || !hasServiceKey()) return retour(req, 'configuration');
  if (!etatValide(q.get('state'), req.cookies.get(COOKIE_ETAT)?.value)) return retour(req, 'refuse');
  const code = q.get('code');
  if (!code || q.get('error')) return retour(req, 'annule');
  try {
    const db = getAdminClient();
    await enregistrerConnexion(db, code);
    await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'google_connecter', target_type: 'reglages', target_id: 'agenda' }).then(() => undefined, () => undefined);
    return retour(req, 'ok');
  } catch (e) {
    console.error('[google] retour :', e instanceof Error ? e.message : e);
    return retour(req, 'erreur');
  }
}
