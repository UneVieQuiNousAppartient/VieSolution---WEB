// Créneaux libres de la page /rdv (étape C) : réglages de l'admin moins les périodes occupées de
// Google Agenda. Rien n'identifie les rendez-vous de Camille : seulement des heures libres.
// Google non branché → { connecte: false } : la page garde l'ancien formulaire de demande.
// 120 lectures par adresse et par heure ; l'agenda est relu au plus toutes les 60 s (agenda-google.ts).
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { phrase } from '@/lib/i18n-regles';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { cleIp } from '@/lib/chat/regles';
import { creneauxLibres } from '@/lib/agenda';
import { etatConnexion, googleConfigure, periodesOccupees } from '@/lib/agenda-google';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const non = () => NextResponse.json({ connecte: false, creneaux: [] });
  if (!hasServiceKey() || !googleConfigure()) return non();
  try {
    const db = getAdminClient();
    const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
    const ip = createHash('sha256').update(`${process.env.CRON_SECRET || ''}:creneaux:${adresse}`).digest('hex').slice(0, 32);
    if ((await compterEssai(db, `creneaux_h:${ip}`, 3_600)) > 120) return NextResponse.json({ connecte: true, creneaux: [], error: phrase("Trop de demandes : réessayez dans quelques minutes.") }, { status: 429 });
    const e = await etatConnexion(db);
    if (!e.connecte) return non();
    const maintenant = new Date();
    const occupes = await periodesOccupees(db, maintenant, new Date(maintenant.getTime() + (e.reglages.horizonJours + 1) * 86_400_000));
    return NextResponse.json(
      { connecte: true, duree: e.reglages.duree, creneaux: creneauxLibres(e.reglages, occupes, maintenant) },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[rdv] créneaux :', err instanceof Error ? err.message : err);
    return non();
  }
}
