// « Libérer ma place » (lien des courriels d'atelier, étape F).
//   POST { i, t } → inscription annulée. Lien signé (HMAC de l'inscription et du courriel), sans table de
// jetons. La page /evenements/liberer demande un clic : un antivirus qui ouvre les liens n'annule rien.
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { secretDesabonnement } from '@/lib/crm/jeton';
import { jetonPlaceValide } from '@/lib/evenements-jeton';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const invalide = () => NextResponse.json({ error: 'Ce lien n’est plus valide. Écrivez-nous à info@viesolutionweb.ca.' }, { status: 400 });

export async function POST(req: NextRequest) {
  if (!hasServiceKey()) return NextResponse.json({ error: 'Service indisponible pour le moment.' }, { status: 503 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = typeof body?.i === 'string' ? body.i : '';
  if (!UUID.test(id)) return invalide();
  const db = getAdminClient();
  try {
    const { data, error } = await db.from('vsw_inscriptions').select('id, courriel, statut').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data || !jetonPlaceValide(id, data.courriel as string, body?.t, secretDesabonnement())) return invalide();
    if (data.statut !== 'annulee') {
      const { error: e2 } = await db.from('vsw_inscriptions').update({ statut: 'annulee', annulee_at: new Date().toISOString() }).eq('id', id);
      if (e2) throw new Error(e2.message);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[evenements] liberer :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'L’opération n’a pas pu être faite. Réessayez dans quelques minutes.' }, { status: 500 });
  }
}
