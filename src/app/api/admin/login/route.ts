// Connexion à /admin : code d'accès + code à 6 chiffres (ou code de secours).
// Essais limités (revue de sécurité du 2026-10-21) :
//   - 8 essais par adresse IP par fenêtre de 15 minutes, quels qu'ils soient ;
//   - 20 échecs du code à 6 chiffres au total par 15 minutes (code d'accès juste, second facteur
//     faux) : signe que le code d'accès a fui. Un inconnu sans le code d'accès ne peut donc pas
//     bloquer Camille en multipliant les essais.
// Base injoignable ou ADMIN_SECRET absent : connexion refusée.
import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { codeAcces, poserSession } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { codeAccesValide, empreinteCodeSecours, estFormatCodeSecours, secretServeur, verifierTotp } from '@/lib/admin/mfa';
import { accepterPas, compterEssai, lireCompteur, secretMfa, utiliserCodeSecours } from '@/lib/admin/mfa-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FENETRE_S = 15 * 60;
const MAX_PAR_IP = 8;
const MAX_ECHECS_SECOND_FACTEUR = 20;
const CLE_ECHECS = 'admin_2fa_echecs';
const REFUS = "Code d'accès ou code de vérification invalide.";

const journal = (db: SupabaseClient, action: string, ip: string) =>
  db.from('vsw_admin_audit_log').insert({ actor: 'admin', action, target_type: 'admin', ip }).then(() => undefined, () => undefined);

export async function POST(req: NextRequest) {
  const srv = secretServeur();
  if (!codeAcces() || !srv) {
    return NextResponse.json({ error: 'Connexion impossible : configuration du serveur incomplète.' }, { status: 500 });
  }
  if (!hasServiceKey()) {
    return NextResponse.json({ error: 'Connexion impossible : la base de données n’est pas configurée.' }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as { code?: unknown; otp?: unknown } | null;
  const db = getAdminClient();
  // Sur Vercel, x-real-ip et x-forwarded-for sont posés par la plateforme (non falsifiables par le visiteur).
  const ip = req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'inconnue';

  try {
    if ((await compterEssai(db, `admin_login:${ip}`, FENETRE_S)) > MAX_PAR_IP) {
      return NextResponse.json({ error: 'Trop d’essais. Réessayez dans 15 minutes.' }, { status: 429 });
    }

    if (!codeAccesValide(body?.code, codeAcces())) {
      await journal(db, 'login_echec_code', ip);
      return NextResponse.json({ error: REFUS }, { status: 401 });
    }

    const secret = await secretMfa(db, srv);
    if (!secret) {
      // Double vérification pas encore activée : la session ne sert qu'à l'activer.
      await journal(db, 'login_sans_mfa', ip);
      const res = NextResponse.json({ ok: true, activer_mfa: true });
      poserSession(res, false);
      return res;
    }

    if ((await lireCompteur(db, CLE_ECHECS, FENETRE_S)) >= MAX_ECHECS_SECOND_FACTEUR) {
      return NextResponse.json({ error: 'Trop d’essais de code à 6 chiffres. Réessayez dans 15 minutes.' }, { status: 429 });
    }

    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
    let ok = false;
    let parSecours = false;
    const pas = verifierTotp(secret, otp);
    if (pas !== null) ok = await accepterPas(db, pas);
    else if (estFormatCodeSecours(otp)) {
      ok = await utiliserCodeSecours(db, empreinteCodeSecours(otp, srv));
      parSecours = ok;
    }
    if (!ok) {
      const echecs = await compterEssai(db, CLE_ECHECS, FENETRE_S);
      await journal(db, 'login_echec_second_facteur', ip);
      if (echecs === MAX_ECHECS_SECOND_FACTEUR) {
        await db.from('vsw_notifications').insert({
          recipient: 'admin',
          type: 'securite',
          title: 'Admin : nombreux essais de code à 6 chiffres',
          body: 'Le code d’accès a été saisi correctement avec de mauvais codes à 6 chiffres. Changez ADMIN_ACCESS_CODE dans Vercel.',
        });
      }
      return NextResponse.json({ error: REFUS }, { status: 401 });
    }

    await journal(db, parSecours ? 'login_code_secours' : 'login', ip);
    if (parSecours) {
      await db.from('vsw_notifications').insert({
        recipient: 'admin',
        type: 'securite',
        title: 'Connexion avec un code de secours',
        body: 'Un code de secours a servi à entrer dans l’admin. Si ce n’est pas vous, changez ADMIN_ACCESS_CODE et réactivez la double vérification.',
      });
    }
    const res = NextResponse.json({ ok: true, ...(parSecours ? { code_secours_utilise: true } : {}) });
    poserSession(res, true);
    return res;
  } catch (e) {
    console.error('[admin] connexion :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Connexion impossible pour le moment. Réessayez dans quelques minutes.' }, { status: 503 });
  }
}
