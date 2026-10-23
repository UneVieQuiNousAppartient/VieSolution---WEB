// Avis publics (étape E, maquette SiteAvis validée par Camille le 2026-10-23).
//   GET  → avis publiés (prénom + initiale) et liens de la page /avis (Google, Facebook, WhatsApp)
//   POST { nom, metier?, note, message, consentement: true, site: '' } → témoignage « en attente »
// Le champ « site » est un piège à robots (caché à l'écran) : rempli, la demande est ignorée sans
// le dire. Limites : 3 envois par adresse et par jour, 40 par jour pour tout le site. Seule une
// empreinte de l'adresse IP est gardée, dans le compteur (Loi 25). Alerte par courriel à notify_email.
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { cleIp } from '@/lib/chat/regles';
import { CONSENTEMENT_AVIS, validerAvis } from '@/lib/avis';
import { liensPublics, lireAvisPublies, lireReglagesAvis } from '@/lib/avis-serveur';
import { envoyerCourriel } from '@/lib/crm/envoi';
import { echapper } from '@/lib/crm/regles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PAR_IP_JOUR = 3;
const SITE_JOUR = 40;

export async function GET() {
  if (!hasServiceKey()) return NextResponse.json({ avis: [], liens: { google: '', facebook: '', whatsapp: '' } });
  try {
    const db = getAdminClient();
    const [avis, reglages] = await Promise.all([lireAvisPublies(db), lireReglagesAvis(db)]);
    return NextResponse.json({ avis, liens: liensPublics(reglages) }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' } });
  } catch (e) {
    console.error('[avis] lecture :', e instanceof Error ? e.message : e);
    return NextResponse.json({ avis: [], liens: { google: '', facebook: '', whatsapp: '' } });
  }
}

export async function POST(req: NextRequest) {
  if (!hasServiceKey()) return NextResponse.json({ error: 'Le formulaire est indisponible pour le moment.' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  // Robot : on répond comme si tout allait bien, sans rien enregistrer.
  if (body && typeof body.site === 'string' && body.site.trim()) return NextResponse.json({ ok: true });
  const v = validerAvis(body);
  if (!v.ok) return NextResponse.json({ error: v.erreur }, { status: 422 });

  const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
  const ip = createHash('sha256').update(`${process.env.CRON_SECRET || ''}:avis:${adresse}`).digest('hex').slice(0, 32);
  const db = getAdminClient();
  try {
    // Limite par adresse d'abord : une seule adresse ne peut pas épuiser le quota du site (revue securite).
    const jour = await compterEssai(db, `avis_j:${ip}`, 86_400);
    const site = jour > PAR_IP_JOUR ? 0 : await compterEssai(db, 'avis_site_j', 86_400);
    if (jour > PAR_IP_JOUR || site > SITE_JOUR) {
      return NextResponse.json({ error: 'Beaucoup de témoignages reçus aujourd’hui. Réessayez demain ou écrivez-nous à info@viesolutionweb.ca.' }, { status: 429 });
    }
    const source = typeof body?.source === 'string' && body.source === 'qr' ? 'qr' : null;
    const { error } = await db.from('vsw_avis').insert({
      ...v.valeur,
      consentement_at: new Date().toISOString(),
      consentement_texte: CONSENTEMENT_AVIS,
      source,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error('[avis] envoi :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Votre témoignage n’a pas pu être enregistré. Réessayez dans quelques minutes.' }, { status: 500 });
  }

  // Alerte à l'équipe (même adresse que les nouvelles demandes) ; un échec n'empêche pas l'avis.
  try {
    const { data } = await db.from('vsw_settings').select('value').eq('key', 'notify_email').maybeSingle();
    const a = typeof data?.value === 'string' ? data.value : '';
    if (a) {
      const { nom, metier, note, message } = v.valeur;
      await envoyerCourriel({
        to: a,
        subject: `Nouveau témoignage à vérifier : ${'★'.repeat(note)} (${nom})`,
        html: `<p>Un nouveau témoignage attend votre vérification.</p><p><strong>${echapper(nom)}</strong>${metier ? ` · ${echapper(metier)}` : ''} · ${note}/5</p><blockquote>${echapper(message)}</blockquote><p><a href="${SITE_URL}/admin">Ouvrir l'onglet « Avis » de l'admin</a></p>`,
        text: `Nouveau témoignage à vérifier\n\n${nom}${metier ? ` · ${metier}` : ''} · ${note}/5\n\n${message}\n\n${SITE_URL}/admin`,
      });
    }
  } catch (e) {
    console.error('[avis] alerte :', e instanceof Error ? e.message : e);
  }
  return NextResponse.json({ ok: true });
}
