// Désabonnement des relances automatiques (loi anti-pourriel, LCAP).
//   GET  ?l=<lead>&t=<jeton> : page de confirmation (ouvrir le lien n'abonne ni ne désabonne : les
//        antivirus de messagerie ouvrent les liens) ;
//   POST ?l=<lead>&t=<jeton> : désabonnement — bouton de la page, ou « Se désabonner » de la
//        messagerie (RFC 8058, corps « List-Unsubscribe=One-Click »).
// Page autonome, styles en ligne, sans ressource externe ; noindex (et /api/ est exclu de robots.txt).
import { NextRequest } from 'next/server';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { jetonValide, secretDesabonnement } from '@/lib/crm/jeton';
import { desabonnerAdresse } from '@/lib/crm/fiche';
import { echapper, masquerCourriel } from '@/lib/crm/regles';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Etat = 'confirmer' | 'fait' | 'deja' | 'invalide' | 'erreur';

const TEXTES: Record<Etat, [string, string]> = {
  confirmer: ['Ne plus recevoir de relances', `Vous recevez des relances par courriel de ${SITE_NAME} au sujet de votre demande{adresse}. Confirmez pour ne plus en recevoir.`],
  fait: ["C'est fait", `Vous ne recevrez plus de relances automatiques de ${SITE_NAME}{adresse}. Merci de nous l'avoir dit.`],
  deja: ['Désabonnement déjà enregistré', `Depuis le {date}, vous ne recevez plus de relances automatiques de ${SITE_NAME}{adresse}.`],
  invalide: ['Lien invalide', "Ce lien de désabonnement n'est pas valide. Pour ne plus recevoir nos courriels, répondez simplement à l'un d'eux."],
  erreur: ['Désabonnement impossible pour le moment', 'Réessayez dans quelques minutes, ou répondez simplement à notre courriel.'],
};

function page(etat: Etat, { email = '', depuis = null as string | null, action = '' } = {}) {
  const [titre, texte] = TEXTES[etat];
  const masque = masquerCourriel(email);
  const date = depuis
    ? new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Toronto', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(depuis))
    : '';
  const corps = echapper(texte).replace('{adresse}', masque ? ` (adresse ${echapper(masque)})` : '').replace('{date}', echapper(date));
  const formulaire =
    etat === 'confirmer' && action
      ? `<form method="post" action="${echapper(action)}" style="margin:24px 0 0"><button type="submit" style="padding:13px 24px;min-height:44px;background:#00789C;color:#FFFFFF;border:0;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer">Me désabonner des relances</button></form>`
      : '';
  const html =
    `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer"><title>${echapper(titre)} — ${echapper(SITE_NAME)}</title></head>` +
    `<body style="margin:0;background:#F6F5F1;font-family:Arial,Helvetica,sans-serif;color:#1F2430">` +
    `<main style="max-width:520px;margin:48px auto;padding:32px 24px;background:#FFFFFF;border:1px solid #DDE3EA;border-radius:16px">` +
    `<div style="margin:0 0 20px;font-size:15px;font-weight:bold;color:#00789C">${echapper(SITE_NAME)}</div>` +
    `<h1 style="margin:0 0 12px;font-size:22px;line-height:1.3">${echapper(titre)}</h1>` +
    `<p style="margin:0;font-size:15px;line-height:1.6">${corps}</p>${formulaire}` +
    `<p style="margin:24px 0 0;font-size:13px"><a href="${echapper(SITE_URL)}" style="color:#00789C">${echapper(SITE_URL.replace(/^https:\/\//, ''))}</a></p>` +
    `</main></body></html>`;
  return new Response(html, {
    status: etat === 'invalide' ? 400 : etat === 'erreur' ? 503 : 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

async function ficheVerifiee(req: NextRequest) {
  const l = req.nextUrl.searchParams.get('l') || '';
  const t = req.nextUrl.searchParams.get('t') || '';
  const cle = secretDesabonnement();
  if (!l || !t || !cle || !/^[0-9a-f-]{36}$/i.test(l)) return null;
  const { data, error } = await getAdminClient().from('vsw_leads').select('id, email, email_opt_out_at').eq('id', l).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || !jetonValide(data.id, data.email, t, cle)) return null;
  return data as { id: string; email: string; email_opt_out_at: string | null };
}

export async function GET(req: NextRequest) {
  if (!hasServiceKey()) return page('erreur');
  try {
    const lead = await ficheVerifiee(req);
    if (!lead) return page('invalide');
    if (lead.email_opt_out_at) return page('deja', { email: lead.email, depuis: lead.email_opt_out_at });
    return page('confirmer', { email: lead.email, action: `${req.nextUrl.pathname}${req.nextUrl.search}` });
  } catch (e) {
    console.error('[desabonnement] GET :', e instanceof Error ? e.message : e);
    return page('erreur');
  }
}

export async function POST(req: NextRequest) {
  if (!hasServiceKey()) return page('erreur');
  try {
    const lead = await ficheVerifiee(req);
    if (!lead) return page('invalide');
    if (lead.email_opt_out_at) return page('deja', { email: lead.email, depuis: lead.email_opt_out_at });
    const corps = await req.text().catch(() => '');
    const source = /List-Unsubscribe=One-Click/i.test(corps) ? 'one-click' : 'lien';
    await desabonnerAdresse(getAdminClient(), lead, source);
    return page('fait', { email: lead.email });
  } catch (e) {
    console.error('[desabonnement] POST :', e instanceof Error ? e.message : e);
    return page('erreur');
  }
}
