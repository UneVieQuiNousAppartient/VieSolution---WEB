// Inscription à un atelier (étape F).
//   POST { slug, nom, courriel, entreprise?, question?, avertir?, consentement: true, site: '' } → place réservée
// « site » est un piège à robots (caché à l'écran). Places comptées en base, sous verrou (vsw_inscrire2).
// Limites : 5 inscriptions par adresse et par jour, 300 par jour pour le site. Accord gardé avec la date.
// Confirmation par courriel tout de suite (avec le lieu privé : adresse ou lien de visioconférence).
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { cleIp } from '@/lib/chat/regles';
import { CONSENTEMENT_INSCRIPTION, TEXTE_AVERTIR, slugEvtValide, validerInscription } from '@/lib/evenements';
import { courrielAtelier, lireEvenementPublic } from '@/lib/evenements-serveur';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PAR_IP_JOUR = 5;
const SITE_JOUR = 300;
const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  if (!hasServiceKey() || !process.env.CRON_SECRET) return refus('L’inscription est indisponible pour le moment.', 503);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (body && typeof body.site === 'string' && body.site.trim()) return NextResponse.json({ ok: true });
  const slug = body?.slug;
  if (!slugEvtValide(slug)) return refus('Atelier introuvable.', 404);
  const v = validerInscription(body);
  if (!v.ok) return refus(v.erreur, 422);

  const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
  const ip = createHash('sha256').update(`${process.env.CRON_SECRET}:atelier:${adresse}`).digest('hex').slice(0, 32);
  const db = getAdminClient();
  try {
    const jour = await compterEssai(db, `atelier_j:${ip}`, 86_400);
    const site = jour > PAR_IP_JOUR ? 0 : await compterEssai(db, 'atelier_site_j', 86_400);
    if (jour > PAR_IP_JOUR || site > SITE_JOUR) return refus('Beaucoup d’inscriptions aujourd’hui. Réessayez demain ou écrivez-nous à info@viesolutionweb.ca.', 429);

    const trouve = await lireEvenementPublic(db, slug);
    if (!trouve) return refus('Cet atelier n’accepte plus d’inscriptions.', 410);
    const e = trouve.evenement;
    const { data, error } = await db.rpc('vsw_inscrire2', {
      p_evenement: e.id, p_nom: v.valeur.nom, p_courriel: v.valeur.courriel, p_entreprise: v.valeur.entreprise,
      p_question: v.valeur.question, p_avertir: v.valeur.avertir, p_consentement: CONSENTEMENT_INSCRIPTION, p_avertir_texte: TEXTE_AVERTIR,
    });
    if (error) throw new Error(error.message);
    const r = data as { etat: 'ok' | 'deja' | 'complet' | 'ferme'; id?: string };
    if (r.etat === 'complet') return refus('Cet atelier est complet. Écrivez-nous à info@viesolutionweb.ca : on vous avertit si une place se libère.', 409);
    if (r.etat === 'ferme') return refus('Cet atelier n’accepte plus d’inscriptions.', 410);
    // Déjà inscrit : même réponse qu'une inscription, sans renvoyer de courriel (rien n'est révélé à un tiers).
    if (r.etat === 'deja' || !r.id) return NextResponse.json({ ok: true });
    const envoi = await courrielAtelier(db, e, { id: r.id, nom: v.valeur.nom, courriel: v.valeur.courriel }, 'confirmation');
    if ('echec' in envoi) console.error('[evenements] confirmation :', envoi.echec);
    else await db.from('vsw_inscriptions').update({ confirmation_envoyee_at: new Date().toISOString() }).eq('id', r.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[evenements] inscription :', err instanceof Error ? err.message : err);
    return refus('L’inscription n’a pas pu être enregistrée. Réessayez dans quelques minutes.', 500);
  }
}
