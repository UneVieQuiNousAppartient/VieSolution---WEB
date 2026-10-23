// Réservation d'un appel découverte (étape C).
//   POST { debut, nom, courriel, telephone?, sujet?, site: '' } → rendez-vous dans Google Agenda (lien
//   Meet, invitation envoyée par Google) + demande dans le CRM (contact_requests « rdv-decouverte » :
//   fiche, tâche et accusé de réception des rendez-vous, comme avant).
// Le créneau est revérifié contre l'agenda au moment de réserver ; un verrou par créneau empêche
// deux réservations simultanées. Limites : 3 par adresse et par jour ; 20 réservations par jour pour le
// site, comptées seulement quand le créneau est valide (revue securite : sinon des essais ratés
// fermeraient la réservation pour la journée). L'invitation Google a un texte fixe (agenda.ts).
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { cleIp } from '@/lib/chat/regles';
import { creneauPermis, creneauPourCrm, creneauxLibres, dateHeureLisible, evenementGoogle, validerReservation } from '@/lib/agenda';
import { creerRendezVous, etatConnexion, googleConfigure, periodesOccupees } from '@/lib/agenda-google';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });
const PRIS = 'Ce créneau vient d’être pris. Choisissez-en un autre.';

export async function POST(req: NextRequest) {
  if (!hasServiceKey() || !googleConfigure() || !process.env.CRON_SECRET) return refus('La réservation en ligne est indisponible. Écrivez-nous à info@viesolutionweb.ca.', 503);
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (body && typeof body.site === 'string' && body.site.trim()) return NextResponse.json({ ok: true });
  const v = validerReservation(body);
  if (!v.ok) return refus(v.erreur, 422);
  const r = v.valeur;

  const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
  const ip = createHash('sha256').update(`${process.env.CRON_SECRET}:rdv:${adresse}`).digest('hex').slice(0, 32);
  const db = getAdminClient();
  try {
    const trop = () => refus('Beaucoup de réservations aujourd’hui. Écrivez-nous à info@viesolutionweb.ca ou appelez le (438) 506-5243.', 429);
    if ((await compterEssai(db, `rdv_j:${ip}`, 86_400)) > 3) return trop();

    const e = await etatConnexion(db);
    if (!e.connecte) return refus('La réservation en ligne est indisponible. Écrivez-nous à info@viesolutionweb.ca.', 503);
    const maintenant = new Date();
    const occupes = await periodesOccupees(db, maintenant, new Date(maintenant.getTime() + (e.reglages.horizonJours + 1) * 86_400_000), true);
    const libres = creneauxLibres(e.reglages, occupes, maintenant);
    if (!creneauPermis(r.debut, libres)) return refus(PRIS, 409);
    // Verrou contre deux demandes simultanées pour ce créneau : 10 minutes, pas plus — l'agenda relu à
    // chaque demande fait foi ensuite (un rendez-vous annulé par Camille, ou un échec de Google, libère
    // le créneau en 10 minutes au plus).
    if ((await compterEssai(db, `rdv_creneau:${r.debut}`, 600)) > 1) return refus(PRIS, 409);
    if ((await compterEssai(db, 'rdv_site_j', 86_400)) > 20) return trop();
    const fin = libres.find((c) => c.debut === r.debut)!.fin;

    const idDemande = createHash('sha256').update(`${r.debut}:${r.courriel}`).digest('hex').slice(0, 24);
    const rdv = await creerRendezVous(db, evenementGoogle(r, fin, idDemande));
    const quand = dateHeureLisible(r.debut);
    const { error } = await db.from('contact_requests').insert({
      nom: r.nom,
      email: r.courriel,
      telephone: r.telephone,
      sujet: 'rdv-decouverte',
      message: [`Appel découverte réservé (Google Agenda) — ${creneauPourCrm(r.debut)}`, r.telephone ? `Téléphone : ${r.telephone}` : '', rdv.meet ? `Google Meet : ${rdv.meet}` : '', r.sujet ? `Sujet : ${r.sujet}` : ''].filter(Boolean).join('\n'),
      source: 'rdv-google',
    });
    if (error) console.error('[rdv] demande CRM :', error.message); // le rendez-vous existe dans l'agenda : on ne le défait pas
    return NextResponse.json({ ok: true, quand, meet: Boolean(rdv.meet) });
  } catch (err) {
    console.error('[rdv] réservation :', err instanceof Error ? err.message : err);
    return refus('La réservation n’a pas pu être faite. Réessayez dans quelques minutes, ou écrivez-nous à info@viesolutionweb.ca.', 500);
  }
}
