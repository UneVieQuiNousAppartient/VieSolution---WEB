// Règles du suivi des demandes (CRM) — fonctions pures, sans base ni réseau ni import :
// testées par `node --test tests/` (tests/crm-regles.test.mjs). Reprises du moteur de KHI Educ
// (lib/lcap.js, lib/automations.js), adaptées aux étapes de Vie Solution Web.
//
// Loi canadienne anti-pourriel (LCAP) : une relance automatique qui invite à prendre un
// rendez-vous est un « message électronique commercial ». Il faut (1) le consentement du
// destinataire, (2) s'identifier (nom, adresse postale, moyen de joindre l'expéditeur) et
// (3) un désabonnement gratuit, honoré sans délai.
// (1) Aucun formulaire ne recueille de consentement exprès à la prospection : seul vaut le
// consentement TACITE — demande de renseignements : 6 mois depuis la demande ; client :
// 2 ans depuis le passage à « Client ». Un désabonnement l'emporte toujours.

export const FUSEAU = 'America/Toronto';

/** Étapes d'un dossier (contrainte vsw_leads_status_check de supabase/setup-crm-vsw.sql). */
export const STATUTS = ['Nouveau', 'Contacté', 'RDV', 'Qualifié', 'Client', 'À relancer', 'Perdu'] as const;
export type Statut = (typeof STATUTS)[number];
export const estStatut = (s: unknown): s is Statut => typeof s === 'string' && (STATUTS as readonly string[]).includes(s);

/** Activités qui comptent comme un contact HUMAIN (saisi par l'équipe), et auteurs qui n'en sont jamais. */
export const TYPES_CONTACT = ['appel', 'courriel', 'sms', 'rdv', 'email_out'] as const;
export const AUTEURS_AUTOMATIQUES = ['système', 'site-web'] as const;

export const MOIS_DEMANDE = 6;
export const MOIS_CLIENT = 24;

const H = 3600 * 1000;

const temps = (iso: string | null | undefined): number | null => {
  const t = iso ? new Date(iso).getTime() : NaN;
  return Number.isFinite(t) ? t : null;
};

/** Ajoute n mois civils (UTC) sans déborder : 31 août + 6 mois = fin février. */
export const ajouterMois = (date: number | string | Date, n: number): Date => {
  const d = new Date(date);
  const jour = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const dernier = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(jour, dernier));
  return d;
};

/** Moins de `mois` mois écoulés depuis `iso` (6 mois pile = expiré). */
const dansLesMois = (iso: string | null | undefined, mois: number, maintenant: number) => {
  const t = temps(iso);
  return t !== null && ajouterMois(t, mois).getTime() > maintenant;
};

export type LeadLcap = {
  status?: string | null;
  created_at?: string | null;
  status_changed_at?: string | null;
  email?: string | null;
  email_opt_out_at?: string | null;
};

export const estDesabonne = (lead: LeadLcap | null | undefined) => Boolean(lead?.email_opt_out_at);

/** Le consentement tacite permet-il encore un message commercial à ce lead ? */
export const peutEnvoyerCommercial = (lead: LeadLcap | null | undefined, maintenant: Date = new Date()) => {
  if (!lead || estDesabonne(lead)) return false;
  const t = maintenant.getTime();
  if (lead.status === 'Client' && dansLesMois(lead.status_changed_at, MOIS_CLIENT, t)) return true;
  return dansLesMois(lead.created_at, MOIS_DEMANDE, t);
};

/** Raison de NE PAS écrire au lead, ou null. */
export const raisonDeRetenue = (lead: LeadLcap, maintenant: Date = new Date()): string | null => {
  if (!lead.email) return 'sans courriel';
  if (estDesabonne(lead)) return 'désabonné';
  if (!peutEnvoyerCommercial(lead, maintenant)) return 'consentement expiré (LCAP)';
  return null;
};

/** Le désabonnement vise l'adresse, pas la fiche : une demande plus récente de la même adresse en hérite. */
export const avecDesabonnementAdresse = <T extends LeadLcap>(lead: T, desabonnes: Map<string, string> | null): T => {
  if (lead.email_opt_out_at || !desabonnes?.size) return lead;
  const date = desabonnes.get(String(lead.email || '').trim().toLowerCase());
  return date ? { ...lead, email_opt_out_at: date } : lead;
};

// --- Délais et contact humain ------------------------------------------------------

/**
 * Une relance due depuis `delaiHeures` après `ancre` : « attendre » avant le délai ; « ok » dans
 * la fenêtre de rattrapage ; « en retard » au-delà (la relance n'est plus envoyée : après une
 * panne ou à la première mise en route, on n'écrit pas d'un coup à des demandes anciennes).
 */
export const echeance = (
  ancre: string | null | undefined,
  delaiHeures: number,
  maintenant: Date = new Date(),
  rattrapageHeures = 72,
): 'attendre' | 'ok' | 'en retard' => {
  const t = temps(ancre);
  if (t === null) return 'attendre';
  const du = t + delaiHeures * H;
  const n = maintenant.getTime();
  if (n < du) return 'attendre';
  return n <= du + rattrapageHeures * H ? 'ok' : 'en retard';
};

/** Un contact humain a-t-il eu lieu APRÈS l'ancre ? (Contact à la même seconde que l'ancre : non.) */
export const contactDepuis = (dernierContact: string | null | undefined, ancre: string | null | undefined) => {
  const c = temps(dernierContact);
  const a = temps(ancre);
  return c !== null && a !== null && c > a;
};

/** Plus récente de plusieurs dates (ISO), ou null. */
export const plusRecente = (...isos: (string | null | undefined)[]): string | null => {
  const ts = isos.map(temps).filter((t): t is number => t !== null);
  return ts.length ? new Date(Math.max(...ts)).toISOString() : null;
};

/** Ce statut se fait-il « remonter » en Contacté par un contact humain ? (RDV, Qualifié, Client ne reculent pas.) */
export const statutApresContact = (statut: string, genre: 'appel' | 'courriel' | 'sms' | 'rdv'): Statut | null => {
  if (genre === 'rdv') return ['Nouveau', 'Contacté', 'À relancer'].includes(statut) ? 'RDV' : null;
  return ['Nouveau', 'À relancer'].includes(statut) ? 'Contacté' : null;
};

// --- Courriels ---------------------------------------------------------------------

export const echapper = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Remplace {{cle}} ; une clé inconnue devient vide (jamais « {{…}} » dans un courriel). */
export const remplir = (texte: string, vars: Record<string, string>) =>
  texte.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => vars[k] ?? '');

export const prenomDe = (nom: string | null | undefined) => String(nom || '').trim().split(/\s+/)[0] || '';

/** Texte brut → HTML : paragraphes et sauts de ligne, liens https cliquables, tout le reste échappé. */
export const texteEnHtml = (texte: string) =>
  texte
    .trim()
    .split(/\n{2,}/)
    .map((p) => {
      const ligne = echapper(p).replace(/\n/g, '<br>');
      const avecLiens = ligne.replace(/https:\/\/[^\s<]+/g, (u) => `<a href="${u}" style="color:#00789C">${u}</a>`);
      return `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1F2430">${avecLiens}</p>`;
    })
    .join('');

export type Expediteur = { nom: string; adressePostale: string; site: string };

/**
 * Pied « loi anti-pourriel » : identité, adresse postale, moyen de joindre (le site), lien de
 * désabonnement. Sans adresse ou sans lien, pas de pied : `pretAEnvoyer` empêche alors l'envoi.
 */
export const piedLcap = (exp: Expediteur, lienDesabonnement: string) => {
  const site = exp.site.replace(/^https:\/\//, '');
  const texte =
    `—\nVous recevez ce courriel parce que vous nous avez écrit depuis ${site}.\n` +
    `${exp.nom} · ${exp.adressePostale} · ${site}\n` +
    `Ne plus recevoir de relances : ${lienDesabonnement}`;
  const html =
    `<p style="margin:24px 0 0;padding-top:14px;border-top:1px solid #DDE3EA;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#5B6472">` +
    `Vous recevez ce courriel parce que vous nous avez écrit depuis ${echapper(site)}.<br>` +
    `${echapper(exp.nom)} · ${echapper(exp.adressePostale)} · <a href="${echapper(exp.site)}" style="color:#5B6472">${echapper(site)}</a><br>` +
    `<a href="${echapper(lienDesabonnement)}" style="color:#5B6472">Ne plus recevoir de relances</a></p>`;
  return { texte, html };
};

export type Configuration = {
  resend: boolean;
  expediteur: boolean;
  adressePostale: string;
  secretDesabonnement: boolean;
  site: string;
};

/**
 * Raison pour laquelle AUCUNE relance ne peut partir, ou null. Vérifiée avant de réserver la
 * moindre relance : tant qu'il manque quelque chose, les relances attendent (rien n'est consommé).
 */
export const pretAEnvoyer = (c: Configuration): string | null => {
  if (!c.resend) return 'RESEND_API_KEY manquant';
  if (!c.expediteur) return 'EMAIL_FROM manquant';
  if (!c.adressePostale.trim()) return 'adresse postale manquante (LCAP) — réglage vsw_settings.postal_address';
  if (!c.secretDesabonnement) return 'UNSUBSCRIBE_SECRET ou CRON_SECRET manquant (lien de désabonnement)';
  if (!/^https:\/\//.test(c.site)) return 'adresse du site non https (lien de désabonnement)';
  return null;
};

/** « marie.tremblay@gmail.com » → « m•••@gmail.com ». */
export const masquerCourriel = (email: string | null | undefined) => {
  const [local, domaine] = String(email || '').split('@');
  return local && domaine ? `${local[0]}•••@${domaine}` : '';
};
