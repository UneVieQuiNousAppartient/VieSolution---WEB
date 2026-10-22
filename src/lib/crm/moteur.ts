// Moteur du suivi des demandes — repris de KHI Educ (lib/automations.js), adapté à Vie Solution Web.
//
// Une RÈGLE = des candidats (quelles fiches, après quel délai) + une condition d'arrêt (un contact
// HUMAIN depuis l'ancre, ou une étape qui a bougé) + une action (brouillon, courriel, tâche, étape,
// alerte). Défauts dans le catalogue ci-dessous ; l'admin surcharge marche/arrêt, délai et
// paramètres dans vsw_automation_rules. Chaque exécution est réservée dans vsw_automation_runs avec
// une clé unique (règle, fiche, période) : une règle ne s'applique qu'une fois par fiche (par
// épisode pour « dormant »).
//
// « Contact humain » = activité appel / courriel / sms / rdv saisie par l'équipe (lib/crm/fiche.ts
// noterContact), ou last_contact_at. Les courriels automatiques ne comptent pas.
//
// Courriels au prospect (LCAP, lib/crm/regles.ts) : pied d'identification + lien de désabonnement
// + en-têtes List-Unsubscribe ; aucun envoi à une adresse désabonnée ni après 6 mois. Tant qu'il
// manque Resend, l'expéditeur, l'adresse postale ou le secret du lien — ou si la liste des
// désabonnements est illisible —, les règles qui écrivent au prospect ne réservent rien : elles
// attendent. La première réponse reste un BROUILLON à approuver dans /admin.
import { createHash, randomBytes } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import {
  AUTEURS_AUTOMATIQUES,
  TYPES_CONTACT,
  alerteNouvelleDemande,
  avecDesabonnementAdresse,
  contactDepuis,
  echeance,
  estDemandeDuSite,
  estDemandeProspect,
  estDemandeRdv,
  estHorsProspection,
  plusRecente,
  piedLcap,
  prenomDe,
  pretAEnvoyer,
  raisonDeRetenue,
  remplir,
  texteEnHtml,
} from './regles';
import { entetesDesabonnement, lienDesabonnement, secretDesabonnement } from './jeton';
import { envoyerCourriel, expediteurConfigure, resendConfigure } from './envoi';
import { creerTache, journaliser } from './fiche';

const H = 3600 * 1000;
/** Une relance au prospect n'est plus envoyée plus de 72 h après son échéance (lib/crm/regles.ts echeance). */
const RATTRAPAGE_H = 72;

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service_interest: string;
  need?: string | null;
  status: string;
  source: string;
  created_at: string;
  status_changed_at: string | null;
  last_contact_at: string | null;
  next_action_at: string | null;
  email_opt_out_at: string | null;
  assigned_to: string | null;
};

type Config = { key: string; enabled: boolean; delay_hours: number; params: Record<string, string> };
type Candidat = { lead: Lead; periode: string };
type Meta = Record<string, unknown> & { skipped?: string };
type Reglages = { adressePostale: string; notifyEmail: string; nomExpediteur: string };
type Contexte = { db: SupabaseClient; maintenant: Date; reglages: Reglages };

type Regle = {
  libelle: string;
  description: string;
  enabled: boolean;
  delay_hours: number;
  params: Record<string, string>;
  /** Écrit au prospect : suspendue tant que l'envoi n'est pas prêt (LCAP, Resend). */
  ecritAuProspect?: boolean;
  /** Au-delà de ce nombre de candidats en un passage, la règle est suspendue (afflux de faux formulaires, issue #5). */
  plafond?: number;
  candidats: (ctx: Contexte, cfg: Config) => Promise<Candidat[]>;
  executer: (ctx: Contexte, c: Candidat, cfg: Config) => Promise<Meta>;
};

const ilYa = (ctx: Contexte, heures: number) => new Date(ctx.maintenant.getTime() - heures * H).toISOString();

// --- contact humain --------------------------------------------------------------------

/** Dernier contact humain (ISO) par fiche : activités saisies par l'équipe, ou last_contact_at. */
async function derniersContacts(db: SupabaseClient, leads: Lead[]) {
  const map = new Map<string, string>();
  if (!leads.length) return map;
  const { data, error } = await db
    .from('vsw_lead_activities')
    .select('lead_id, created_at')
    .in('lead_id', leads.map((l) => l.id))
    .in('type', [...TYPES_CONTACT])
    .not('author', 'in', `(${AUTEURS_AUTOMATIQUES.map((a) => `"${a}"`).join(',')})`)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  for (const a of data || []) if (!map.has(a.lead_id)) map.set(a.lead_id, a.created_at);
  for (const l of leads) {
    const plus = plusRecente(map.get(l.id), l.last_contact_at);
    if (plus) map.set(l.id, plus);
  }
  return map;
}

/** Garde les fiches sans contact humain depuis leur ancre. */
async function sansContactDepuis(db: SupabaseClient, leads: Lead[], ancre: (l: Lead) => string) {
  const contacts = await derniersContacts(db, leads);
  return leads.filter((l) => !contactDepuis(contacts.get(l.id), ancre(l)));
}

async function selection(requete: PromiseLike<{ data: unknown; error: { message: string } | null }>) {
  const { data, error } = await requete;
  if (error) throw new Error(error.message);
  return (data || []) as Lead[];
}

// --- actions -----------------------------------------------------------------------------

async function gabarit(db: SupabaseClient, cle: string) {
  const { data, error } = await db.from('vsw_email_templates').select('subject, body').eq('key', cle).eq('lang', 'fr').maybeSingle();
  if (error) throw new Error(error.message);
  // Gabarit absent : la réservation est libérée, la règle reprendra quand il sera en place.
  if (!data) throw Object.assign(new Error(`gabarit « ${cle} » introuvable dans vsw_email_templates`), { liberer: true });
  return data as { subject: string; body: string };
}

const variables = (lead: Lead) => ({ prenom: prenomDe(lead.name), lien_rdv: `${SITE_URL}/rdv` });

/**
 * Courriel au prospect (relance ou accusé de réception), pied LCAP et en-têtes de désabonnement.
 * Une panne d'envoi libère la réservation. `relance` : note relance_sent_at et le libellé du journal.
 */
async function relancer(ctx: Contexte, lead: Lead, cfg: Config, relance = true): Promise<Meta> {
  if (echeance(lead.created_at, cfg.delay_hours, ctx.maintenant, RATTRAPAGE_H) !== 'ok') return { skipped: 'hors délai' };
  const retenue = raisonDeRetenue(lead, ctx.maintenant);
  if (retenue) return { skipped: retenue };
  const lien = lienDesabonnement(SITE_URL, lead.id, lead.email, secretDesabonnement());
  if (!lien) throw new Error('lien de désabonnement impossible');
  const g = await gabarit(ctx.db, cfg.params.template);
  const vars = variables(lead);
  const sujet = remplir(g.subject, vars);
  const corps = remplir(g.body, vars);
  const pied = piedLcap({ nom: ctx.reglages.nomExpediteur, adressePostale: ctx.reglages.adressePostale, site: SITE_URL }, lien);
  const envoi = await envoyerCourriel({
    to: lead.email,
    subject: sujet,
    html: texteEnHtml(corps) + pied.html,
    text: `${corps}\n\n${pied.texte}`,
    headers: entetesDesabonnement(lien),
    cle: `vsw-${cfg.key}-${lead.id}`,
  });
  // Panne passagère : réservation libérée, nouvel essai au prochain passage (la clé d'idempotence
  // empêche un double envoi si Resend avait accepté). Refus définitif : erreur notée, pas d'autre essai.
  if ('echec' in envoi) {
    throw Object.assign(new Error(`envoi ${envoi.echec === 'temporaire' ? 'impossible pour le moment' : 'refusé'} (Resend)`), {
      liberer: envoi.echec === 'temporaire',
    });
  }
  const id = envoi.id;
  const maintenant = new Date().toISOString();
  if (relance) await ctx.db.from('vsw_leads').update({ relance_sent_at: maintenant }).eq('id', lead.id);
  await ctx.db.from('vsw_email_messages').insert({
    lead_id: lead.id,
    direction: 'out',
    from_email: process.env.EMAIL_FROM || '',
    to_email: lead.email,
    subject: sujet,
    snippet: corps.slice(0, 200),
    body_text: corps,
    received_at: maintenant,
    source: 'resend',
    resend_id: id,
  });
  await journaliser(ctx.db, {
    lead_id: lead.id,
    type: 'automation',
    content: `${relance ? 'Relance automatique envoyée' : 'Accusé de réception envoyé'} : ${sujet}`,
    meta: { automatic: true, regle: cfg.key, template: cfg.params.template, email_id: id },
  });
  return { email_id: id };
}

async function notifier(db: SupabaseClient, lead: Lead, type: string, titre: string, corps: string) {
  const { error } = await db.from('vsw_notifications').insert({ recipient: 'admin', type, title: titre, body: corps, lead_id: lead.id });
  if (error) throw new Error(error.message);
}

const jetonHache = () => createHash('sha256').update(randomBytes(32)).digest('hex');

// --- catalogue ---------------------------------------------------------------------------

export const REGLES: Record<string, Regle> = {
  first_reply: {
    libelle: 'Réponse prête à approuver',
    description:
      "Pour chaque nouvelle demande : un brouillon de réponse (gabarit « first_reply ») attend votre approbation dans /admin. Rien ne part sans vous.",
    enabled: true,
    delay_hours: 0,
    params: { template: 'first_reply' },
    candidats: async (ctx) => {
      const leads = await selection(
        ctx.db.from('vsw_leads').select('*').in('status', ['Nouveau', 'RDV']).is('last_contact_at', null).gte('created_at', ilYa(ctx, 7 * 24)),
      );
      if (!leads.length) return [];
      const { data: brouillons } = await ctx.db
        .from('vsw_outreach_drafts')
        .select('target_id')
        .eq('kind', 'first_reply')
        .in('target_id', leads.map((l) => l.id));
      const deja = new Set((brouillons || []).map((b) => b.target_id));
      return leads.filter((l) => !deja.has(l.id)).map((lead) => ({ lead, periode: '' }));
    },
    executer: async (ctx, { lead }, cfg) => {
      const g = await gabarit(ctx.db, cfg.params.template);
      const vars = variables(lead);
      const { data, error } = await ctx.db
        .from('vsw_outreach_drafts')
        .insert({
          target_type: 'lead',
          target_id: lead.id,
          kind: 'first_reply',
          subject: remplir(g.subject, vars),
          body: remplir(g.body, vars),
          status: 'pending',
          token_hash: jetonHache(),
          expires_at: new Date(ctx.maintenant.getTime() + 7 * 24 * H).toISOString(),
          summary: { generated_by: 'template', source: lead.source },
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      await journaliser(ctx.db, { lead_id: lead.id, type: 'automation', content: 'Brouillon de première réponse prêt (à approuver)', meta: { automatic: true, regle: 'first_reply', draft_id: data.id } });
      await notifier(ctx.db, lead, 'draft_pending', 'Réponse prête à approuver', `${lead.name} <${lead.email}>`);
      return { draft_id: data.id };
    },
  },

  // Demande de Camille du 2026-10-22 (« oui ajoute les deux, le texte est bon ») : accusé de
  // réception au prospect et alerte à l'équipe, au passage horaire qui suit chaque nouvelle demande.
  accuse_reception: {
    libelle: 'Accusé de réception au prospect',
    description:
      "Au passage horaire qui suit une nouvelle demande du site : « Nous avons bien reçu votre demande » (gabarit « accuse_reception »), ou, pour une demande de rendez-vous, « Votre demande d'appel est bien arrivée » (gabarit « accuse_rdv »). Textes acceptés par Camille le 2026-10-22 (pour les rendez-vous : la phrase proposée, avec l'objet, la salutation et la signature de l'autre accusé). Pas aux candidatures de stage, ni si vous avez déjà pris contact.",
    enabled: true,
    delay_hours: 0,
    params: { template: 'accuse_reception', template_rdv: 'accuse_rdv' },
    ecritAuProspect: true,
    plafond: 20,
    candidats: async (ctx) => {
      // 24 h au plus : passé ce délai (passage horaire manqué, envoi pas encore prêt), il n'est plus envoyé.
      const leads = (await selection(ctx.db.from('vsw_leads').select('*').gte('created_at', ilYa(ctx, 24)))).filter(estDemandeProspect);
      return (await sansContactDepuis(ctx.db, leads, (l) => l.created_at)).map((lead) => ({ lead, periode: '' }));
    },
    // Demande de rendez-vous : la personne vient de choisir son appel, le texte « choisissez le moment » ne lui va pas.
    executer: (ctx, { lead }, cfg) =>
      relancer(ctx, lead, estDemandeRdv(lead) ? { ...cfg, params: { ...cfg.params, template: cfg.params.template_rdv } } : cfg, false),
  },

  nouvelle_demande: {
    libelle: 'Alerte : nouvelle demande',
    description:
      "Vous écrit à l'adresse d'alerte (réglage notify_email) au passage horaire qui suit chaque nouvelle demande du site, candidatures de stage comprises : nom, coordonnées, demande. Sans adresse d'alerte, rien ne part.",
    enabled: true,
    delay_hours: 0,
    params: {},
    plafond: 10,
    candidats: async (ctx) => {
      // Rien n'est réservé tant que l'adresse d'alerte ou l'envoi manquent : les demandes des dernières 24 h attendent.
      if (!ctx.reglages.notifyEmail || !resendConfigure() || !expediteurConfigure()) return [];
      const leads = await selection(ctx.db.from('vsw_leads').select('*').gte('created_at', ilYa(ctx, 24)));
      return leads.filter(estDemandeDuSite).map((lead) => ({ lead, periode: '' }));
    },
    executer: async (ctx, { lead }) => {
      const { sujet, texte } = alerteNouvelleDemande(lead, SITE_URL);
      const envoi = await envoyerCourriel({ to: ctx.reglages.notifyEmail, subject: sujet, html: texteEnHtml(texte, false), text: texte, cle: `vsw-nouvelle-${lead.id}` });
      if ('echec' in envoi) {
        throw Object.assign(new Error(`alerte ${envoi.echec === 'temporaire' ? 'impossible pour le moment' : 'refusée'} (Resend)`), {
          liberer: envoi.echec === 'temporaire',
        });
      }
      return { alerte_id: envoi.id };
    },
  },

  uncontacted_24h: {
    libelle: 'Alerte : demande sans contact après 24 h',
    description: "Vous prévient (page « Aujourd'hui » et courriel à l'adresse d'alerte) quand une nouvelle demande n'a reçu aucun contact humain après le délai.",
    enabled: true,
    delay_hours: 24,
    params: {},
    candidats: async (ctx, cfg) => {
      const leads = await selection(
        ctx.db
          .from('vsw_leads')
          .select('*')
          .eq('status', 'Nouveau')
          .lte('created_at', ilYa(ctx, cfg.delay_hours))
          .gte('created_at', ilYa(ctx, cfg.delay_hours + RATTRAPAGE_H)),
      );
      return (await sansContactDepuis(ctx.db, leads, (l) => l.created_at)).map((lead) => ({ lead, periode: '' }));
    },
    executer: async (ctx, { lead }, cfg) => {
      const heures = Math.round((ctx.maintenant.getTime() - new Date(lead.created_at).getTime()) / H);
      const titre = `À contacter : ${lead.name} attend depuis ${heures} h`;
      await notifier(ctx.db, lead, 'alerte', titre, `${lead.phone || '—'} · ${lead.email} · ${lead.service_interest || lead.source}`);
      let notified = 0;
      if (ctx.reglages.notifyEmail) {
        const envoi = await envoyerCourriel({
          to: ctx.reglages.notifyEmail,
          subject: titre,
          html: texteEnHtml(`${titre}\n\nTéléphone : ${lead.phone || '—'}\nCourriel : ${lead.email}\nDemande : ${lead.service_interest || '—'} (${lead.source})\n\n${SITE_URL}/admin`),
        });
        if ('id' in envoi) notified = 1;
      }
      await journaliser(ctx.db, { lead_id: lead.id, type: 'systeme', content: `Alerte : aucun contact après ${cfg.delay_hours} h`, meta: { automatic: true, regle: 'uncontacted_24h' } });
      return { notified };
    },
  },

  new_lead_j2: {
    libelle: 'Relance 1 : demande sans contact',
    description: "Courriel au prospect si sa demande n'a reçu aucun contact humain après le délai. Texte approuvé par Camille le 2026-10-21.",
    enabled: true,
    delay_hours: 48,
    params: { template: 'followup_new_1' },
    ecritAuProspect: true,
    candidats: async (ctx, cfg) => {
      const leads = await selection(
        ctx.db
          .from('vsw_leads')
          .select('*')
          .eq('status', 'Nouveau')
          .lte('created_at', ilYa(ctx, cfg.delay_hours))
          .gte('created_at', ilYa(ctx, cfg.delay_hours + RATTRAPAGE_H)),
      );
      // Pas de relance « appel découverte » aux candidatures de stage (issue #6, accord de Camille du 2026-10-22).
      return (await sansContactDepuis(ctx.db, leads.filter((l) => !estHorsProspection(l)), (l) => l.created_at)).map((lead) => ({ lead, periode: '' }));
    },
    executer: (ctx, { lead }, cfg) => relancer(ctx, lead, cfg),
  },

  new_lead_j5: {
    libelle: 'Relance 2 : toujours sans contact',
    description: "Second et dernier courriel si la demande n'a toujours reçu aucun contact humain. Texte approuvé par Camille le 2026-10-21.",
    enabled: true,
    delay_hours: 120,
    params: { template: 'followup_new_2' },
    ecritAuProspect: true,
    candidats: async (ctx, cfg) => {
      const leads = await selection(
        ctx.db
          .from('vsw_leads')
          .select('*')
          .eq('status', 'Nouveau')
          .lte('created_at', ilYa(ctx, cfg.delay_hours))
          .gte('created_at', ilYa(ctx, cfg.delay_hours + RATTRAPAGE_H)),
      );
      // Pas de relance « appel découverte » aux candidatures de stage (issue #6, accord de Camille du 2026-10-22).
      return (await sansContactDepuis(ctx.db, leads.filter((l) => !estHorsProspection(l)), (l) => l.created_at)).map((lead) => ({ lead, periode: '' }));
    },
    executer: (ctx, { lead }, cfg) => relancer(ctx, lead, cfg),
  },

  new_lead_j7: {
    libelle: 'Passage à « À relancer » + tâche d’appel',
    description: 'Après le délai sans contact humain, la demande passe à « À relancer » et une tâche « Appeler » est créée.',
    enabled: true,
    delay_hours: 168,
    params: { task_title: 'Appeler {{nom}} — demande sans réponse' },
    candidats: async (ctx, cfg) => {
      // Borne de 30 jours : à la première mise en route, les très anciennes fiches ne basculent pas d'un coup.
      const leads = await selection(
        ctx.db
          .from('vsw_leads')
          .select('*')
          .eq('status', 'Nouveau')
          .lte('created_at', ilYa(ctx, cfg.delay_hours))
          .gte('created_at', ilYa(ctx, cfg.delay_hours + 30 * 24)),
      );
      return (await sansContactDepuis(ctx.db, leads, (l) => l.created_at)).map((lead) => ({ lead, periode: '' }));
    },
    executer: async (ctx, { lead }, cfg) => {
      const maintenant = new Date().toISOString();
      const { data, error } = await ctx.db
        .from('vsw_leads')
        .update({ status: 'À relancer', status_changed_at: maintenant })
        .eq('id', lead.id)
        .eq('status', 'Nouveau')
        .select('id');
      if (error) throw new Error(error.message);
      if (!data?.length) return { skipped: "l'étape a changé entre-temps" };
      await journaliser(ctx.db, {
        lead_id: lead.id,
        type: 'statut',
        content: `Étape : Nouveau → À relancer (aucun contact après ${Math.round(cfg.delay_hours / 24)} jours)`,
        meta: { automatic: true, regle: 'new_lead_j7' },
      });
      const task_id = await creerTache(ctx.db, lead, remplir(cfg.params.task_title, { nom: lead.name }), maintenant, 'new_lead_j7');
      return { task_id };
    },
  },

  dormant: {
    libelle: 'Prospect sans nouvelles depuis 30 jours',
    description: 'Fiche « Contacté » ou « Qualifié » sans contact humain depuis le délai : tâche « Reprendre contact ». Une fois par période sans contact. Aucun courriel automatique.',
    enabled: true,
    delay_hours: 720,
    params: { task_title: 'Reprendre contact avec {{nom}}' },
    candidats: async (ctx, cfg) => {
      const leads = await selection(ctx.db.from('vsw_leads').select('*').in('status', ['Contacté', 'Qualifié']));
      const contacts = await derniersContacts(ctx.db, leads);
      const limite = ilYa(ctx, cfg.delay_hours);
      return leads
        .map((lead) => ({ lead, ancre: plusRecente(contacts.get(lead.id), lead.status_changed_at, lead.created_at) }))
        .filter((c): c is { lead: Lead; ancre: string } => Boolean(c.ancre && c.ancre <= limite))
        .map(({ lead, ancre }) => ({ lead, periode: ancre }));
    },
    executer: async (ctx, { lead }, cfg) => {
      const task_id = await creerTache(ctx.db, lead, remplir(cfg.params.task_title, { nom: lead.name }), new Date().toISOString(), 'dormant');
      await notifier(ctx.db, lead, 'dormant', `Sans nouvelles depuis 30 jours : ${lead.name}`, lead.email);
      return { task_id };
    },
  },
};

export const estCleRegle = (cle: unknown): cle is string => typeof cle === 'string' && Object.hasOwn(REGLES, cle);

// --- configuration effective ---------------------------------------------------------------

type Surcharge = { key: string; enabled: boolean | null; delay_hours: number | null; params: Record<string, string> | null };

async function surcharges(db: SupabaseClient) {
  const { data, error } = await db.from('vsw_automation_rules').select('key, enabled, delay_hours, params');
  if (error) throw new Error(error.message);
  return new Map(((data || []) as Surcharge[]).map((r) => [r.key, r]));
}

export function configEffective(cle: string, s: Map<string, Surcharge>): Config {
  const def = REGLES[cle];
  const o = s.get(cle);
  const params: Record<string, string> = { ...def.params };
  // Seuls les paramètres connus et du bon type sont surchargés (un gabarit vidé ne désarme pas une règle).
  for (const [k, v] of Object.entries(o?.params || {})) if (k in def.params && typeof v === 'string' && v.trim()) params[k] = v;
  return { key: cle, enabled: o?.enabled ?? def.enabled, delay_hours: o?.delay_hours ?? def.delay_hours, params };
}

export type RegleAffichee = {
  key: string;
  libelle: string;
  description: string;
  enabled: boolean;
  delay_hours: number;
  delai_reglable: boolean;
  ecrit_au_prospect: boolean;
  personnalisee: boolean;
};

/** Règles et leur réglage effectif, pour l'onglet « Relances » de /admin. */
export async function listerRegles(db: SupabaseClient): Promise<RegleAffichee[]> {
  const ov = await surcharges(db);
  return Object.keys(REGLES).map((key) => {
    const def = REGLES[key];
    const cfg = configEffective(key, ov);
    return {
      key,
      libelle: def.libelle,
      description: def.description,
      enabled: cfg.enabled,
      delay_hours: cfg.delay_hours,
      delai_reglable: def.delay_hours > 0,
      ecrit_au_prospect: Boolean(def.ecritAuProspect),
      personnalisee: ov.has(key),
    };
  });
}

/** Écrit un réglage (déjà validé) dans vsw_automation_rules, en gardant les autres champs. */
export async function reglerRegle(db: SupabaseClient, key: string, patch: { enabled?: boolean; delay_hours?: number }) {
  const ov = await surcharges(db);
  const actuel = ov.get(key);
  const { error } = await db.from('vsw_automation_rules').upsert({
    key,
    enabled: patch.enabled ?? actuel?.enabled ?? null,
    delay_hours: patch.delay_hours ?? actuel?.delay_hours ?? null,
    params: actuel?.params ?? {},
    updated_at: new Date().toISOString(),
    updated_by: 'admin',
  });
  if (error) throw new Error(error.message);
}

async function lireReglages(db: SupabaseClient): Promise<Reglages> {
  const { data, error } = await db.from('vsw_settings').select('key, value').in('key', ['postal_address', 'notify_email', 'sender_name']);
  if (error) throw new Error(error.message);
  const v = new Map((data || []).map((r) => [r.key as string, typeof r.value === 'string' ? r.value : '']));
  return { adressePostale: v.get('postal_address') || '', notifyEmail: v.get('notify_email') || '', nomExpediteur: v.get('sender_name') || SITE_NAME };
}

/** Adresses désabonnées (courriel en minuscules → date), ou null si illisible : alors rien n'est envoyé. */
async function desabonnes(db: SupabaseClient) {
  const { data, error } = await db.from('vsw_leads').select('email, email_opt_out_at').not('email_opt_out_at', 'is', null);
  if (error) {
    console.error('[crm] désabonnements illisibles :', error.message);
    return null;
  }
  return new Map((data || []).map((r) => [String(r.email || '').trim().toLowerCase(), r.email_opt_out_at as string]));
}

// --- exécution -------------------------------------------------------------------------------

export type Bilan = { enabled: boolean; candidats: number; executees: number; ignorees: number; erreurs: number; envoyes: number; suspendue?: string };

/** Réserve (règle, fiche, période) ; renvoie l'id de la réservation, ou null si déjà faite. */
async function reserver(db: SupabaseClient, rule_key: string, lead_id: string, period: string) {
  const { data, error } = await db
    .from('vsw_automation_runs')
    .upsert({ rule_key, lead_id, period, result: 'pending' }, { onConflict: 'rule_key,lead_id,period', ignoreDuplicates: true })
    .select('id');
  if (error) throw new Error(error.message);
  return (data?.[0]?.id as string | undefined) ?? null;
}

/** Exécute toutes les règles actives. Renvoie un bilan par règle. */
export async function executerRegles(db: SupabaseClient, maintenant = new Date()): Promise<Record<string, Bilan>> {
  const ov = await surcharges(db);
  const reglages = await lireReglages(db);
  const liste = await desabonnes(db);
  const pret = pretAEnvoyer({
    resend: resendConfigure(),
    expediteur: expediteurConfigure(),
    adressePostale: reglages.adressePostale,
    secretDesabonnement: Boolean(secretDesabonnement()),
    site: SITE_URL,
  });
  const ctx: Contexte = { db, maintenant, reglages };
  const bilan: Record<string, Bilan> = {};

  for (const cle of Object.keys(REGLES)) {
    const regle = REGLES[cle];
    const cfg = configEffective(cle, ov);
    const b: Bilan = { enabled: cfg.enabled, candidats: 0, executees: 0, ignorees: 0, erreurs: 0, envoyes: 0 };
    bilan[cle] = b;
    if (!cfg.enabled) continue;
    if (regle.ecritAuProspect && (pret || liste === null)) {
      // Rien n'est réservé : la relance attend que l'envoi soit prêt (dans sa fenêtre de rattrapage).
      b.suspendue = pret || 'liste des désabonnements illisible';
      continue;
    }
    let candidats: Candidat[] = [];
    try {
      candidats = await regle.candidats(ctx, cfg);
    } catch (e) {
      console.error(`[crm:${cle}] candidats :`, e instanceof Error ? e.message : e);
      b.erreurs += 1;
      continue;
    }
    b.candidats = candidats.length;
    if (regle.plafond && candidats.length > regle.plafond) {
      // Afflux anormal (souvent de faux formulaires) : rien n'est réservé ni envoyé, une notification prévient l'équipe.
      b.suspendue = `${candidats.length} demandes en attente (plafond ${regle.plafond})`;
      await db.from('vsw_notifications').insert({
        recipient: 'admin',
        type: 'automation_error',
        title: `${regle.libelle} : suspendu, afflux de ${candidats.length} demandes`,
        body: "Plus de demandes que d'habitude en 24 h : vérifiez qu'elles sont vraies dans « Aujourd'hui ». Aucun courriel n'est parti pour cette règle.",
      });
      continue;
    }
    for (const c of candidats) {
      let runId: string | null = null;
      try {
        runId = await reserver(db, cle, c.lead.id, c.periode);
        if (!runId) {
          b.ignorees += 1;
          continue;
        }
        const meta = await regle.executer(ctx, { ...c, lead: avecDesabonnementAdresse(c.lead, liste) }, cfg);
        await db.from('vsw_automation_runs').update({ result: meta.skipped ? 'skipped' : 'ok', meta }).eq('id', runId);
        if (meta.skipped) b.ignorees += 1;
        else b.executees += 1;
        if (meta.email_id) b.envoyes += 1;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[crm:${cle}] fiche ${c.lead.id} :`, message);
        b.erreurs += 1;
        if (!runId) continue;
        // Envoi impossible : la réservation est libérée, la relance sera retentée au prochain passage.
        if ((e as { liberer?: boolean }).liberer) await db.from('vsw_automation_runs').delete().eq('id', runId);
        else await db.from('vsw_automation_runs').update({ result: 'error', meta: { error: message } }).eq('id', runId);
      }
    }
  }

  const erreurs = Object.entries(bilan).filter(([, b]) => b.erreurs);
  if (erreurs.length) {
    await db.from('vsw_notifications').insert({
      recipient: 'admin',
      type: 'automation_error',
      title: `Suivi automatique : ${erreurs.reduce((n, [, b]) => n + b.erreurs, 0)} erreur(s)`,
      body: erreurs.map(([k, b]) => `${REGLES[k].libelle} : ${b.erreurs}`).join(' · '),
    });
  }
  return bilan;
}
