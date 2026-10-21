// Activation de la double vérification de /admin.
//   POST { etape: 'debut' }                  → nouveau secret (rien n'est enregistré)
//   POST { etape: 'confirmer', secret, otp } → le premier code prouve que l'application est prête :
//        secret enregistré (chiffré), 8 codes de secours créés (montrés une seule fois), session complète.
// Avec une session « code d'accès seulement », l'activation n'est possible que tant qu'aucun secret
// n'existe, et elle est atomique (vsw_mfa_enroll) : deux activations simultanées ne se remplacent pas.
// Avec une session complète : remplacement permis (changement de téléphone).
// Chaque activation prévient l'équipe (notification + courriel d'alerte s'il est configuré).
import { NextRequest, NextResponse } from 'next/server';
import { poserSession, sessionAdmin } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import {
  empreinteCodeSecours,
  genererCodesSecours,
  genererSecret,
  lienOtpauth,
  secretLisible,
  secretServeur,
  verifierTotp,
} from '@/lib/admin/mfa';
import { activerMfa, mfaActivee } from '@/lib/admin/mfa-store';
import { envoyerCourriel } from '@/lib/crm/envoi';
import { texteEnHtml } from '@/lib/crm/regles';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function prevenir(db: ReturnType<typeof getAdminClient>, ip: string) {
  const titre = 'Double vérification de l’admin activée';
  const corps = `La double vérification de /admin vient d’être activée (adresse IP ${ip}). Si ce n’est pas vous, changez ADMIN_ACCESS_CODE dans Vercel, supprimez la ligne admin_totp_secret de vsw_settings dans Supabase et réactivez-la.`;
  await db.from('vsw_notifications').insert({ recipient: 'admin', type: 'securite', title: titre, body: corps });
  const { data } = await db.from('vsw_settings').select('value').eq('key', 'notify_email').maybeSingle();
  if (typeof data?.value === 'string' && data.value) await envoyerCourriel({ to: data.value, subject: titre, html: texteEnHtml(corps) });
}

export async function POST(req: NextRequest) {
  const session = sessionAdmin(req);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const srv = secretServeur();
  if (!hasServiceKey() || !srv) return NextResponse.json({ error: 'Configuration du serveur incomplète.' }, { status: 503 });
  const db = getAdminClient();
  const ip = req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'inconnue';
  const refusDejaActivee = () =>
    NextResponse.json({ error: 'La double vérification est déjà activée : reconnectez-vous avec votre code.' }, { status: 403 });
  try {
    if (!session.mfa && (await mfaActivee(db))) return refusDejaActivee();
    const body = (await req.json().catch(() => null)) as { etape?: string; secret?: unknown; otp?: unknown } | null;

    if (body?.etape === 'debut') {
      const secret = genererSecret();
      return NextResponse.json({ secret, lisible: secretLisible(secret), lien: lienOtpauth(secret) });
    }

    if (body?.etape === 'confirmer') {
      const secret = typeof body.secret === 'string' && /^[A-Z2-7]{32}$/.test(body.secret) ? body.secret : '';
      const pas = secret ? verifierTotp(secret, body.otp) : null;
      if (pas === null) {
        return NextResponse.json({ error: 'Code incorrect. Vérifiez l’heure de votre téléphone et entrez le code affiché maintenant.' }, { status: 400 });
      }
      const codes = genererCodesSecours();
      const fait = await activerMfa(db, secret, srv, pas, codes.map((c) => empreinteCodeSecours(c, srv)), session.mfa);
      if (!fait) return refusDejaActivee();
      await db.from('vsw_admin_audit_log').insert({ actor: 'admin', action: 'mfa_activee', target_type: 'admin', ip });
      await prevenir(db, ip).catch((e) => console.error('[admin] alerte d’activation :', e instanceof Error ? e.message : e));
      const res = NextResponse.json({ ok: true, codes });
      poserSession(res, true);
      return res;
    }

    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  } catch (e) {
    console.error('[admin] double vérification :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Impossible pour le moment. Réessayez dans quelques minutes.' }, { status: 503 });
  }
}
