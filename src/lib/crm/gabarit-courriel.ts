// Habillage des courriels aux prospects (étape B, maquette validée par Camille le 2026-10-23) : logo,
// texte, signature encadrée, bouton « Réserver un appel » quand il est utile, pied légal. Tableaux et
// styles en ligne : ce que Gmail, Outlook et les téléphones affichent tous. Fonctions pures, testées par
// tests/crm-entrant.test.mjs. Sans import (Node exécute ce fichier tel quel dans les tests).

/** Signature donnée par Camille le 2026-10-23 (« Camille Yvan, Developpeur et formateur IA fondateur, un truc chic »). */
export const SIGNATURE = {
  nom: 'Camille Yvan',
  titre: 'Fondateur · Développeur et formateur IA',
  entreprise: 'Vie Solution Web',
  telephone: '(438) 506-5243',
  telephoneLien: 'tel:+14385065243',
} as const;

/**
 * Gabarits qui portent le bouton « Réserver un appel » (accord de Camille du 2026-10-23 : « oui mais pas
 * pour tout ») : accusés, relances, première réponse, relance après un appel, prospection. Pas dans une
 * confirmation d'appel, une soumission, un remerciement, une réorientation, ni un courriel écrit librement.
 */
export const AVEC_BOUTON: readonly string[] = [
  'accuse_reception',
  'accuse_rdv',
  'first_reply',
  'followup_new_1',
  'followup_new_2',
  'modele_relance_appel',
  'modele_prospection',
];

/**
 * Retire la signature écrite à la main en fin de texte (« Camille », « Camille, Vie Solution Web »,
 * « Camille — Vie Solution Web ») : l'encadré de signature la remplace. La formule de politesse reste.
 */
export const sansSignature = (texte: string) =>
  texte.replace(/\n+\s*Camille(?: Yvan)?(?:\s*[,—–-]\s*Vie Solution Web)?\s*$/u, '').trimEnd();

const echapperAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export type Habillage = {
  /** Corps déjà converti en HTML échappé (texteEnHtml). */
  corpsHtml: string;
  /** Pied légal (piedLcap). */
  piedHtml: string;
  /** Adresse du site, ex. https://viesolutionweb.ca */
  site: string;
  /** Bouton « Réserver un appel » (lien /rdv) ou rien. */
  bouton?: { libelle: string; url: string } | null;
};

const POLICE = "Inter,'Segoe UI',Arial,Helvetica,sans-serif";

/** Courriel complet, prêt pour Resend (html). */
export function habiller(h: Habillage): string {
  const site = h.site.replace(/\/$/, '');
  const logo = `${site}/courriel/logo.png`;
  const domaine = site.replace(/^https?:\/\//, '');
  const bouton = h.bouton
    ? `<td align="right" valign="middle" style="padding:16px 18px 16px 0"><a href="${echapperAttr(h.bouton.url)}" style="display:inline-block;padding:11px 18px;border-radius:999px;background:#00789C;color:#FFFFFF;text-decoration:none;font-family:${POLICE};font-weight:600;font-size:14px">${echapperAttr(h.bouton.libelle)}</a></td>`
    : '';
  return [
    '<!doctype html>',
    '<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">',
    `<title>${echapperAttr(SIGNATURE.entreprise)}</title></head>`,
    `<body style="margin:0;padding:0;background:#EEF0F3">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF0F3"><tr><td align="center" style="padding:24px 12px">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E2E5EA;border-radius:14px">`,
    // En-tête : logo
    `<tr><td style="padding:20px 28px;border-bottom:1px solid #EEF0F3"><table role="presentation" cellpadding="0" cellspacing="0"><tr>`,
    `<td valign="middle"><img src="${echapperAttr(logo)}" width="34" height="34" alt="" style="display:block;border:0"></td>`,
    `<td valign="middle" style="padding-left:10px;font-family:${POLICE};font-weight:700;font-size:18px;color:#1D2433">${echapperAttr(SIGNATURE.entreprise)}</td>`,
    `</tr></table></td></tr>`,
    // Texte
    `<tr><td style="padding:26px 28px 6px;font-family:${POLICE};font-size:16px;line-height:1.65;color:#1D2433">${h.corpsHtml}</td></tr>`,
    // Signature
    `<tr><td style="padding:8px 28px 26px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F8;border-radius:12px"><tr>`,
    `<td valign="middle" style="padding:16px 18px;font-family:${POLICE};font-size:14px;line-height:1.5;color:#1D2433">`,
    `<strong style="font-size:16px">${echapperAttr(SIGNATURE.nom)}</strong><br>`,
    `<span style="font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#5B6475">${echapperAttr(SIGNATURE.titre)}</span><br>`,
    `<span style="color:#5B6475">${echapperAttr(SIGNATURE.entreprise)}</span><br>`,
    `<a href="${SIGNATURE.telephoneLien}" style="color:#00789C;text-decoration:none">${echapperAttr(SIGNATURE.telephone)}</a> · `,
    `<a href="${echapperAttr(site)}" style="color:#00789C;text-decoration:none">${echapperAttr(domaine)}</a></td>`,
    bouton,
    `</tr></table></td></tr>`,
    // Pied légal
    `<tr><td style="padding:0 28px 22px">${h.piedHtml}</td></tr>`,
    `</table></td></tr></table></body></html>`,
  ].join('');
}
