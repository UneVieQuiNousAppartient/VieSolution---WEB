// Courriels reçus à @viesolutionweb.ca (étape B, boîte de réception — accord de Camille du 2026-10-23).
//   POST : webhook Resend « email.received » (signé Svix avec RESEND_WEBHOOK_SECRET).
// Le webhook ne porte que les métadonnées : le texte est lu chez Resend (GET /emails/receiving/{id}).
// Le courriel est rangé dans vsw_email_messages (une seule fois : index unique sur resend_id), relié à
// la fiche dont le courriel correspond exactement (sauf expéditeur en échec d'authentification) ; la réponse
// d'une personne arrête ses relances 1 et 2. Réponses automatiques : rangées « ignorées », rien d'autre.
// Une copie part à notify_email (Gmail de Camille), réponse directe à l'expéditeur, 30 par jour au plus.
// Le contenu reçu est une donnée non fiable : jamais exécuté, toujours échappé à l'affichage.
import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { journaliser } from '@/lib/crm/fiche';
import { envoyerCourriel } from '@/lib/crm/envoi';
import { compterEssai } from '@/lib/admin/mfa-store';
import {
  adresseDeNotreDomaine,
  estReponseAutomatique,
  lireCourrielRecu,
  signatureValide,
  verdictAuthentification,
  type CourrielRecu,
} from '@/lib/crm/entrant';
import { texteEnHtml } from '@/lib/crm/regles';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DOMAINE = new URL(SITE_URL).hostname;
/** Copies vers Gmail par jour : au-delà (afflux de pourriels, boucle), elles s'arrêtent ; tout reste rangé dans l'admin. */
const COPIES_PAR_JOUR = 30;
/** Un webhook Resend ne porte que des métadonnées : un corps plus gros est refusé avant tout calcul. */
const CORPS_MAX = 256 * 1024;
const ID_RESEND = /^[0-9a-zA-Z-]{8,80}$/;

const ok = () => NextResponse.json({ ok: true });

async function lireChezResend(id: string): Promise<unknown | null> {
  try {
    const res = await fetch(`https://api.resend.com/emails/receiving/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!res.ok) {
      console.error(`[entrant] resend ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('[entrant] resend :', e instanceof Error ? e.message : e);
    return null;
  }
}

/** Fiche dont le courriel correspond exactement : la plus récente encore ouverte, sinon la plus récente. */
async function ficheDe(db: ReturnType<typeof getAdminClient>, adresse: string) {
  const { data, error } = await db
    .from('vsw_leads')
    .select('id, name, email, status, created_at')
    .ilike('email', adresse.replace(/[\\%_]/g, (c) => `\\${c}`))
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw new Error(error.message);
  const exactes = (data || []).filter((l) => String(l.email || '').trim().toLowerCase() === adresse);
  return exactes.find((l) => !['Client', 'Perdu'].includes(l.status)) ?? exactes[0] ?? null;
}

async function copieInterne(
  db: ReturnType<typeof getAdminClient>,
  c: CourrielRecu,
  emailId: string,
  fiche: { name: string } | null,
  nonVerifie: boolean,
) {
  const { data } = await db.from('vsw_settings').select('value').eq('key', 'notify_email').maybeSingle();
  const dest = typeof data?.value === 'string' ? data.value.trim().toLowerCase() : '';
  // Anti-boucle (revue securite du 2026-10-23) : pas de copie vers notre domaine, ni d'un courriel venu de
  // notre domaine ou de l'adresse d'alerte elle-même (un renvoi Gmail → info@ referait le tour sans fin).
  if (!dest || dest.endsWith(`@${DOMAINE}`)) return;
  if (c.expediteur.adresse.endsWith(`@${DOMAINE}`) || c.expediteur.adresse === dest) return;
  if ((await compterEssai(db, 'copie_entrant_j', 86_400)) > COPIES_PAR_JOUR) return;
  const qui = c.expediteur.nom ? `${c.expediteur.nom} <${c.expediteur.adresse}>` : c.expediteur.adresse;
  const pieces = c.pieces.length ? `\n\nPièces jointes (à ouvrir dans Resend) : ${c.pieces.map((p) => p.nom).join(', ')}` : '';
  const texte =
    `Courriel reçu à ${DOMAINE} de ${qui}${fiche ? ` (fiche : ${fiche.name})` : ' (aucune fiche à ce courriel)'}.\n` +
    (nonVerifie ? 'Attention : l’expéditeur n’a pas pu être vérifié (adresse peut-être usurpée). Le courriel n’a pas été rangé dans la fiche.\n' : '') +
    `Répondez depuis l’admin pour garder l’historique : ${SITE_URL}/admin\n\n— — —\n\n${c.texte || '(courriel sans texte)'}${pieces}`;
  await envoyerCourriel({
    to: dest,
    subject: `Boîte de réception : ${c.sujet || '(sans objet)'}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1D2433">${texteEnHtml(texte, false)}</div>`,
    text: texte,
    replyTo: c.expediteur.adresse,
    // RFC 3834 : copie automatique ; les messageries ne doivent pas y répondre automatiquement.
    headers: { 'Auto-Submitted': 'auto-generated' },
    cle: `vsw-entrant-${emailId}`,
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET || '';
  if (!secret || !hasServiceKey() || !process.env.RESEND_API_KEY) return NextResponse.json({ error: 'non configuré' }, { status: 503 });
  if (Number(req.headers.get('content-length') || 0) > CORPS_MAX) return NextResponse.json({ error: 'trop gros' }, { status: 413 });
  const corps = await req.text();
  if (corps.length > CORPS_MAX) return NextResponse.json({ error: 'trop gros' }, { status: 413 });
  const entetes = { id: req.headers.get('svix-id'), timestamp: req.headers.get('svix-timestamp'), signature: req.headers.get('svix-signature') };
  if (!signatureValide(secret, entetes, corps)) return NextResponse.json({ error: 'signature' }, { status: 401 });

  let evenement: { type?: unknown; data?: Record<string, unknown> };
  try {
    evenement = JSON.parse(corps);
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  if (evenement.type !== 'email.received') return ok();
  const emailId = typeof evenement.data?.email_id === 'string' ? evenement.data.email_id : '';
  if (!ID_RESEND.test(emailId)) return ok();

  const db = getAdminClient();
  try {
    const { data: deja } = await db.from('vsw_email_messages').select('id').eq('resend_id', emailId).eq('direction', 'in').limit(1);
    if (deja?.length) return ok();

    const complet = await lireChezResend(emailId);
    // Texte illisible pour le moment : 503, Resend renverra le webhook plus tard.
    if (!complet) return NextResponse.json({ error: 'resend' }, { status: 503 });
    const c = lireCourrielRecu(complet);
    if (!c) return ok();
    // Pas de filtre sur les destinataires : Resend ne livre que pour notre domaine vérifié, et un courriel
    // reçu en Cci, par une liste ou par renvoi serait perdu sans trace (revue securite du 2026-10-23).

    const maintenant = new Date().toISOString();
    // Réponse automatique (absence, infolettre) : rangée comme « ignorée », sans activité, alerte ni copie.
    const auto = estReponseAutomatique(c.entetes, c.sujet);
    // Expéditeur en échec d'authentification (adresse peut-être usurpée) : jamais rangé dans une fiche.
    const nonVerifie = verdictAuthentification(c.entetes) === 'echec';
    const fiche = nonVerifie ? null : await ficheDe(db, c.expediteur.adresse);
    const { data: ligne, error } = await db
      .from('vsw_email_messages')
      .insert({
        lead_id: fiche?.id ?? null,
        direction: 'in',
        from_email: c.expediteur.adresse,
        to_email: adresseDeNotreDomaine(c.destinataires, DOMAINE),
        subject: c.sujet,
        snippet: c.texte.slice(0, 200),
        body_text: c.texte,
        received_at: maintenant,
        source: 'resend',
        resend_id: emailId,
        message_id: c.messageId,
        attachments: c.pieces,
        ignore_at: auto ? maintenant : null,
      })
      .select('id')
      .single();
    if (error) {
      // Webhook rejoué en même temps : l'autre passage l'a déjà rangé.
      if (error.code === '23505') return ok();
      throw new Error(error.message);
    }

    if (auto) return ok();
    if (fiche) {
      // La personne a répondu : noté dans l'historique (auteur « prospect »). Ce n'est pas un contact humain :
      // seules les relances 1 et 2 s'arrêtent (moteur.ts) ; l'alerte et la tâche d'appel attendent Camille.
      await journaliser(db, { lead_id: fiche.id, type: 'email_in', content: `Courriel reçu : ${c.sujet || '(sans objet)'}`, author: 'prospect', meta: { message: ligne.id } });
    }
    await db.from('vsw_notifications').insert({
      recipient: 'admin',
      type: 'email_in',
      title: `Courriel reçu de ${fiche?.name || c.expediteur.nom || c.expediteur.adresse}${nonVerifie ? ' (expéditeur non vérifié)' : ''}`,
      body: c.sujet || '(sans objet)',
      lead_id: fiche?.id ?? null,
    });
    await copieInterne(db, c, emailId, fiche, nonVerifie);
    return ok();
  } catch (e) {
    console.error('[entrant] :', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'erreur' }, { status: 500 });
  }
}
