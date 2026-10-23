// Événements (étape F) — lectures et courriels côté serveur (service_role). Règles pures : ./evenements.
import type { SupabaseClient } from '@supabase/supabase-js';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { envoyerCourriel } from '@/lib/crm/envoi';
import { echapper, texteEnHtml } from '@/lib/crm/regles';
import { habiller, sansSignature } from '@/lib/crm/gabarit-courriel';
import { secretDesabonnement } from '@/lib/crm/jeton';
import {
  courrielAnnulation, courrielConfirmation, courrielRappel, doitRappeler, estAVenir, raisonCourrielAtelier, type Genre,
} from '@/lib/evenements';
import { lienLiberer } from '@/lib/evenements-jeton';

export type Evenement = {
  id: string; slug: string; titre: string; genre: Genre; debut: string; fin: string;
  lieu_public: string; lieu_prive: string; places: number; presentation: string; statut: string;
};
/** Ce que la page publique peut montrer : jamais le lieu privé. */
export type EvenementPublic = Omit<Evenement, 'lieu_prive' | 'statut' | 'id'> & { inscrits: number };

const COLONNES = 'id, slug, titre, genre, debut, fin, lieu_public, lieu_prive, places, presentation, statut';

async function comptes(db: SupabaseClient, ids: string[]) {
  const m = new Map<string, number>();
  if (!ids.length) return m;
  const { data, error } = await db.from('vsw_inscriptions').select('evenement_id').in('evenement_id', ids).eq('statut', 'confirmee').limit(20_000);
  if (error) throw new Error(error.message);
  for (const r of data || []) m.set(r.evenement_id as string, (m.get(r.evenement_id as string) || 0) + 1);
  return m;
}

const publique = (e: Evenement, inscrits: number): EvenementPublic => ({
  slug: e.slug, titre: e.titre, genre: e.genre, debut: e.debut, fin: e.fin, lieu_public: e.lieu_public, places: e.places, presentation: e.presentation, inscrits,
});

/** Ateliers publiés à venir, du plus proche au plus lointain. */
export async function lireEvenementsPublics(db: SupabaseClient, maintenant = new Date()): Promise<EvenementPublic[]> {
  const { data, error } = await db.from('vsw_evenements').select(COLONNES).eq('statut', 'publie').gt('debut', maintenant.toISOString()).order('debut').limit(50);
  if (error) throw new Error(error.message);
  const evts = (data || []) as Evenement[];
  const n = await comptes(db, evts.map((e) => e.id));
  return evts.map((e) => publique(e, n.get(e.id) || 0));
}

/** Un atelier publié et à venir, par son adresse ; null sinon (brouillon, annulé, passé). */
export async function lireEvenementPublic(db: SupabaseClient, slug: string, maintenant = new Date()) {
  const { data, error } = await db.from('vsw_evenements').select(COLONNES).eq('slug', slug).maybeSingle();
  if (error) throw new Error(error.message);
  const e = data as Evenement | null;
  if (!e || !estAVenir(e, maintenant)) return null;
  const n = await comptes(db, [e.id]);
  return { evenement: e, public: publique(e, n.get(e.id) || 0) };
}

type Reglages = { adressePostale: string; nomExpediteur: string };
async function reglages(db: SupabaseClient): Promise<Reglages> {
  const { data } = await db.from('vsw_settings').select('key, value').in('key', ['postal_address', 'sender_name']);
  const v = new Map((data || []).map((r) => [r.key as string, typeof r.value === 'string' ? r.value : '']));
  return { adressePostale: v.get('postal_address') || '', nomExpediteur: v.get('sender_name') || SITE_NAME };
}

/** Pied des courriels d'atelier : raison, identité, adresse postale, site, lien « libérer ma place ». */
function pied(r: Reglages, lien: string) {
  const site = SITE_URL.replace(/^https:\/\//, '');
  return (
    `<p style="margin:24px 0 0;padding-top:14px;border-top:1px solid #DDE3EA;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#5B6472">` +
    `Vous recevez ce courriel parce que ${echapper(raisonCourrielAtelier)}.<br>` +
    `${echapper(r.nomExpediteur)} · ${echapper(r.adressePostale)} · <a href="${echapper(SITE_URL)}" style="color:#5B6472">${echapper(site)}</a>` +
    (lien ? `<br><a href="${echapper(lien)}" style="color:#5B6472">Libérer ma place</a>` : '') +
    `</p>`
  );
}

export type Inscription = { id: string; nom: string; courriel: string };
type Sorte = 'confirmation' | 'rappel' | 'annulation';

/** Envoie un courriel d'atelier et le note dans vsw_email_messages (compté par les statistiques). */
export async function courrielAtelier(db: SupabaseClient, e: Evenement, i: Inscription, sorte: Sorte, r?: Reglages) {
  const reg = r || (await reglages(db));
  if (!reg.adressePostale.trim()) return { echec: 'adresse postale manquante (vsw_settings.postal_address)' } as const;
  const lien = sorte === 'annulation' ? '' : lienLiberer(SITE_URL, i.id, i.courriel, secretDesabonnement());
  if (sorte !== 'annulation' && !lien) return { echec: 'lien « libérer ma place » impossible (secret manquant)' } as const;
  const c = sorte === 'confirmation' ? courrielConfirmation(e, i.nom, lien) : sorte === 'rappel' ? courrielRappel(e, i.nom, lien) : courrielAnnulation(e, i.nom);
  const html = habiller({ corpsHtml: texteEnHtml(sansSignature(c.texte)), piedHtml: pied(reg, lien), site: SITE_URL, bouton: null });
  const envoi = await envoyerCourriel({ to: i.courriel, subject: c.sujet, html, text: c.texte, cle: `vsw-atelier-${sorte}-${i.id}-${e.debut}` });
  if ('echec' in envoi) return { echec: `envoi ${envoi.echec}` } as const;
  const maintenant = new Date().toISOString();
  await db.from('vsw_email_messages').insert({
    direction: 'out', from_email: process.env.EMAIL_FROM || '', to_email: i.courriel, subject: c.sujet,
    snippet: c.texte.slice(0, 200), body_text: c.texte, received_at: maintenant, source: 'resend', resend_id: envoi.id,
  }).then(() => undefined, () => undefined);
  return { id: envoi.id } as const;
}

/** Passage horaire : rappels de la veille (une seule fois par inscription, réservée avant l'envoi). */
export async function envoyerRappels(db: SupabaseClient, maintenant = new Date()) {
  const bilan = { candidats: 0, envoyes: 0, erreurs: 0 };
  const { data, error } = await db.from('vsw_evenements').select(COLONNES).eq('statut', 'publie')
    .gt('debut', maintenant.toISOString()).lt('debut', new Date(maintenant.getTime() + 40 * 3_600_000).toISOString());
  if (error) throw new Error(error.message);
  const evts = ((data || []) as Evenement[]).filter((e) => doitRappeler(e.debut, maintenant));
  if (!evts.length) return bilan;
  const reg = await reglages(db);
  for (const e of evts) {
    const { data: ins } = await db.from('vsw_inscriptions').select('id, nom, courriel').eq('evenement_id', e.id).eq('statut', 'confirmee').is('rappel_envoye_at', null).limit(500);
    for (const i of (ins || []) as Inscription[]) {
      bilan.candidats++;
      // Réservation : un passage concurrent ne peut pas envoyer le même rappel.
      const { data: pris } = await db.from('vsw_inscriptions').update({ rappel_envoye_at: maintenant.toISOString() }).eq('id', i.id).is('rappel_envoye_at', null).select('id');
      if (!pris?.length) continue;
      const r = await courrielAtelier(db, e, i, 'rappel', reg);
      if ('echec' in r) {
        bilan.erreurs++;
        await db.from('vsw_inscriptions').update({ rappel_envoye_at: null }).eq('id', i.id);
        console.error('[evenements] rappel :', r.echec);
      } else bilan.envoyes++;
    }
  }
  return bilan;
}
