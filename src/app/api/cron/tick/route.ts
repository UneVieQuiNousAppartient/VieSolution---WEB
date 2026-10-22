// Passage horaire du suivi des demandes — appelé par Vercel Cron (vercel.json), qui envoie
// « Authorization: Bearer <CRON_SECRET> ». Sans CRON_SECRET (16 caractères ou plus), la route refuse tout.
import { NextRequest, NextResponse } from 'next/server';
import { hasServiceKey } from '@/lib/supabase/admin';
import { memeSecret } from '@/lib/crm/jeton';
import { lancerTick } from '@/lib/crm/tick';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const attendu = process.env.CRON_SECRET || '';
  const recu = (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (attendu.length < 16 || !memeSecret(recu, attendu)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!hasServiceKey()) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }, { status: 500 });
  }
  const resultat = await lancerTick('vercel-cron');
  console.log('[tick]', JSON.stringify(resultat));
  return NextResponse.json(resultat);
}
