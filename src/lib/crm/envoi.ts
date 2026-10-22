// Envoi de courriels — côté serveur seulement, via Resend (même fournisseur que KHI Educ).
//
// RESEND_API_KEY + EMAIL_FROM (adresse d'un domaine vérifié dans Resend : SPF, DKIM, DMARC)
// sont requis ; sans eux, rien ne part et `envoyerCourriel` renvoie null. EMAIL_REPLY_TO
// (facultatif) reçoit les réponses des prospects.

const RESEND_URL = 'https://api.resend.com/emails';

export type Courriel = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  /** Clé d'idempotence Resend : un même envoi rejoué dans les 24 h ne part qu'une fois. */
  cle?: string;
};

/** Résultat : identifiant Resend, ou échec « permanent » (adresse refusée…) ou « temporaire » (panne, quota). */
export type ResultatEnvoi = { id: string } | { echec: 'permanent' | 'temporaire' };

export const resendConfigure = () => Boolean(process.env.RESEND_API_KEY);
export const expediteurConfigure = () => Boolean(process.env.EMAIL_FROM);

/** Envoie un courriel. Non configuré ou sans destinataire : échec permanent (rien n'est tenté). */
export async function envoyerCourriel(c: Courriel): Promise<ResultatEnvoi> {
  if (!resendConfigure() || !expediteurConfigure() || !c.to) return { echec: 'permanent' };
  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        ...(c.cle ? { 'Idempotency-Key': c.cle } : {}),
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [c.to],
        subject: c.subject,
        html: c.html,
        ...(c.text ? { text: c.text } : {}),
        ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
        ...(c.headers && Object.keys(c.headers).length ? { headers: c.headers } : {}),
      }),
    });
    if (!res.ok) {
      // Statut seulement : la réponse de Resend peut contenir l'adresse du destinataire.
      console.error(`[courriel] resend ${res.status}`);
      return { echec: res.status === 429 || res.status >= 500 ? 'temporaire' : 'permanent' };
    }
    const json = (await res.json()) as { id?: string };
    return json.id ? { id: json.id } : { echec: 'temporaire' };
  } catch (e) {
    console.error('[courriel] resend :', e instanceof Error ? e.message : e);
    return { echec: 'temporaire' };
  }
}
