'use client';

// Fiche détaillée d'une demande dans /admin (étape A, maquette validée par Camille le 2026-10-23) :
// coordonnées modifiables, demande, première réponse envoyée depuis l'admin, tâches, historique et notes.
// Données : GET /api/admin/fiche ; changements : POST /api/admin/fiche et /api/admin/action.

import { useCallback, useEffect, useState } from 'react';
import { STATUTS } from '@/lib/crm/regles';
import { SOURCES, cleSource } from '@/lib/crm/tableau';
import { accordManquant } from '@/lib/crm/saisie';
import { ChoixModele, type ModeleInsere } from '@/components/vsw/admin-boite';

const tel = (n: string) => `tel:${encodeURIComponent(n)}`;
const mailto = (c: string) => `mailto:${encodeURIComponent(c)}`;

type Act = (type: string, id: string, value?: string) => Promise<boolean>;

type LeadFiche = {
  id: string; name: string; email: string; phone: string; company: string | null; need: string;
  status: string; source: string; service_interest: string; created_at: string;
  last_contact_at: string | null; email_opt_out_at: string | null; consent_at: string | null; tags?: string[] | null;
};
type Activite = { id: string; type: string; content: string; author: string; created_at: string };
type Tache = { id: string; title: string; due_at: string | null; done_at: string | null };
type Brouillon = { id: string; kind: string; subject: string; body: string; status: string; created_at: string };
type Courriel = { id: string; direction: string; subject: string; snippet: string; received_at: string; traite_at: string | null; ignore_at: string | null };
type DonneesFiche = { lead: LeadFiche; activites: Activite[]; taches: Tache[]; brouillons: Brouillon[]; courriels: Courriel[]; modeles: ModeleInsere[] };

const FUSEAU = 'America/Toronto';
const dateHeure = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('fr-CA', { timeZone: FUSEAU, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso)) : '—';
const libelleSource = (source: string) => SOURCES.find((s) => s.cle === cleSource(source))?.libelle ?? source;

const COULEUR_TYPE: Record<string, string> = {
  form: 'var(--fg-3)', note: 'var(--fg-1)', automation: 'var(--accent-2)', appel: 'var(--accent)',
  courriel: 'var(--accent)', email_in: 'var(--accent)', sms: 'var(--accent)', rdv: 'var(--ok)', tache: 'var(--warn)', systeme: 'var(--fg-3)',
};

async function poster(corps: Record<string, unknown>) {
  const res = await fetch('/api/admin/fiche', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
  const json = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
  return res.ok ? { ok: true as const } : { ok: false as const, erreur: json.error || 'Erreur', id: json.id };
}

export function FicheDemande({ id, act, busy, onRetour, onChange }: {
  id: string; act: Act; busy: boolean; onRetour: () => void; onChange: () => void;
}) {
  const [d, setD] = useState<DonneesFiche | null>(null);
  const [erreur, setErreur] = useState('');
  const [chargeA, setChargeA] = useState(0); // instant du dernier chargement : tâches en retard
  const [message, setMessage] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [edition, setEdition] = useState<null | { nom: string; courriel: string; telephone: string; entreprise: string }>(null);
  const [note, setNote] = useState('');
  const [tache, setTache] = useState({ titre: '', echeance: '' });
  const [reponse, setReponse] = useState<null | { sujet: string; corps: string; brouillon: string | null; modele?: string | null }>(null);

  const charger = useCallback(async () => {
    const res = await fetch(`/api/admin/fiche?id=${encodeURIComponent(id)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setErreur(json.error || 'Fiche illisible pour le moment.'); return; }
    setErreur('');
    setChargeA(Date.now());
    setD(json);
  }, [id]);

  useEffect(() => { charger(); }, [charger]);

  // Brouillon de première réponse en attente : prérempli dans l'éditeur.
  const brouillon = d?.brouillons.find((b) => b.status === 'pending' || b.status === 'approved') ?? null;
  const reponseAffichee = reponse ?? (brouillon ? { sujet: brouillon.subject, corps: brouillon.body, brouillon: brouillon.id } : null);

  const faire = async (corps: Record<string, unknown>, succes: string) => {
    setEnCours(true);
    const r = await poster({ ...corps, id });
    setEnCours(false);
    if (!r.ok) { setErreur(r.erreur); setMessage(''); return false; }
    setErreur('');
    setMessage(succes);
    await charger();
    onChange();
    return true;
  };
  const action = async (type: string, value?: string) => {
    if (await act(type, id, value)) { await charger(); setMessage(''); }
  };

  if (!d) {
    return (
      <div className="adm-tableau">
        <button type="button" className="adm-lien" onClick={onRetour}>← Toutes les demandes</button>
        {erreur ? <div className="adm-carte" role="alert">{erreur}</div> : <p className="adm-gris">Chargement…</p>}
      </div>
    );
  }

  const l = d.lead;
  const occupe = busy || enCours;
  const ouvertes = d.taches.filter((t) => !t.done_at);
  const faites = d.taches.filter((t) => t.done_at);

  return (
    <div className="adm-tableau">
      <button type="button" className="adm-lien" style={{ alignSelf: 'flex-start' }} onClick={onRetour}>← Toutes les demandes</button>

      <div className="adm-entete">
        <div>
          <h2 className="adm-fiche-nom">{l.name}</h2>
          <span className="adm-gris">
            {libelleSource(l.source)} · reçue {dateHeure(l.created_at)} · {l.last_contact_at ? `dernier contact ${dateHeure(l.last_contact_at)}` : 'aucun contact noté'}
          </span>
        </div>
        <label className="adm-champ" style={{ minWidth: 180 }}>
          Étape
          <select value={l.status} disabled={occupe} onChange={(e) => action('lead_status', e.target.value)}>
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {(erreur || message) && (
        <div className="adm-carte" role={erreur ? 'alert' : 'status'} style={{ borderColor: erreur ? 'var(--danger)' : 'var(--ok)' }}>
          {erreur || message}
        </div>
      )}

      <div className="adm-ligne-actions">
        {l.phone && <a className="adm-bouton" href={tel(l.phone)}>Appeler</a>}
        {l.email && <a className="adm-bouton adm-bouton-contour" href={mailto(l.email)}>Écrire</a>}
        <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe} onClick={() => action('contact', 'appel')}>Appel fait</button>
        <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe} onClick={() => action('contact', 'courriel')}>Courriel envoyé</button>
        <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe} onClick={() => action('contact', 'rdv')}>RDV pris</button>
        {l.email_opt_out_at ? (
          <span className="adm-gris" style={{ alignSelf: 'center' }}>Désabonnement enregistré</span>
        ) : (
          <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe}
            onClick={() => { if (window.confirm('Ne plus envoyer aucun courriel automatique à cette adresse ?')) action('opt_out'); }}>
            Désabonner
          </button>
        )}
      </div>

      <div className="adm-grille-fiche">
        <div className="adm-colonne">
          <section className="adm-carte">
            <div className="adm-carte-tete">
              <h2>Coordonnées</h2>
              {!edition && (
                <button type="button" className="adm-lien"
                  onClick={() => setEdition({ nom: l.name, courriel: l.email, telephone: l.phone, entreprise: l.company ?? '' })}>
                  Modifier
                </button>
              )}
            </div>
            {edition ? (
              <form className="adm-formulaire" onSubmit={async (e) => {
                e.preventDefault();
                if (await faire({ op: 'coordonnees', ...edition }, 'Coordonnées enregistrées.')) setEdition(null);
              }}>
                {([['nom', 'Nom', 'text'], ['courriel', 'Courriel', 'email'], ['telephone', 'Téléphone', 'tel'], ['entreprise', 'Entreprise', 'text']] as const).map(([k, libelle, type]) => (
                  <label key={k} className="adm-champ">
                    {libelle}
                    <input type={type} value={edition[k]} onChange={(e) => setEdition({ ...edition, [k]: e.target.value })} />
                  </label>
                ))}
                <div className="adm-ligne-actions">
                  <button type="submit" className="adm-bouton" disabled={occupe}>Enregistrer</button>
                  <button type="button" className="adm-bouton adm-bouton-discret" onClick={() => setEdition(null)}>Annuler</button>
                </div>
              </form>
            ) : (
              <dl className="adm-dl">
                <dt>Courriel</dt><dd>{l.email ? <a href={mailto(l.email)}>{l.email}</a> : '—'}</dd>
                <dt>Téléphone</dt><dd>{l.phone ? <a href={tel(l.phone)}>{l.phone}</a> : '—'}</dd>
                <dt>Entreprise</dt><dd>{l.company || '—'}</dd>
                <dt>Relances</dt>
                <dd>
                  {l.email_opt_out_at ? 'Arrêtées (désabonnement)'
                    : l.status === 'Prospect' ? 'Aucune : prospect, vous le contactez vous-même'
                    : l.last_contact_at ? 'Arrêtées : un contact a été noté'
                      : cleSource(l.source) === 'manuel' && !l.consent_at ? 'Aucune : ajoutée à la main, sans accord noté'
                        : 'Actives tant qu’aucun contact n’est noté'}
                </dd>
              </dl>
            )}
          </section>

          <section className="adm-carte">
            <h2 className="adm-titre-carte">Sa demande</h2>
            <p className="adm-texte-long">{l.need || 'Aucun détail.'}</p>
          </section>

          {l.email && !l.email_opt_out_at && accordManquant(l) && (
            <section className="adm-carte">
              <h2 className="adm-titre-carte">Courriels</h2>
              <p className="adm-texte-long">
                Cette personne n’a rien demandé elle-même et son accord n’est pas noté : la loi anti-pourriel interdit de lui écrire un
                courriel commercial. Appelez-la, ou notez son accord si elle vous l’a donné.
              </p>
              <button type="button" className="adm-bouton adm-bouton-contour" style={{ alignSelf: 'flex-start' }} disabled={occupe}
                onClick={async () => {
                  if (window.confirm('Confirmez-vous que cette personne vous a donné son accord pour recevoir vos courriels ?')) {
                    await faire({ op: 'accord' }, 'Accord noté.');
                  }
                }}>
                Cette personne m’a donné son accord
              </button>
            </section>
          )}

          {l.email && !l.email_opt_out_at && !accordManquant(l) && (
            <section className="adm-carte" style={reponseAffichee ? { borderColor: 'color-mix(in oklch, var(--accent-2) 35%, transparent)' } : undefined}>
              <div className="adm-carte-tete">
                <h2>{brouillon ? 'Première réponse' : 'Écrire un courriel'}</h2>
                {brouillon && <span className="adm-pastille adm-pastille-violet">À approuver</span>}
              </div>
              {reponseAffichee ? (
                <form className="adm-formulaire" onSubmit={async (e) => {
                  e.preventDefault();
                  if (!window.confirm(`Envoyer ce courriel à ${l.email} ?`)) return;
                  if (await faire({ op: 'envoyer', sujet: reponseAffichee.sujet, corps: reponseAffichee.corps, brouillon: reponseAffichee.brouillon, modele: reponseAffichee.modele ?? null }, 'Courriel envoyé. Les relances automatiques sont arrêtées pour cette personne.')) setReponse(null);
                }}>
                  <ChoixModele modeles={d.modeles ?? []} disabled={occupe} onChoisir={(m) => {
                    if (reponseAffichee.corps.trim() && !window.confirm('Remplacer le texte en cours par ce modèle ?')) return;
                    setReponse({ ...reponseAffichee, sujet: m.sujet, corps: m.corps, modele: m.cle });
                  }} />
                  <label className="adm-champ">Objet
                    <input value={reponseAffichee.sujet} onChange={(e) => setReponse({ ...reponseAffichee, sujet: e.target.value })} />
                  </label>
                  <label className="adm-champ">Message
                    <textarea rows={9} value={reponseAffichee.corps} onChange={(e) => setReponse({ ...reponseAffichee, corps: e.target.value })} />
                  </label>
                  <span className="adm-gris">Envoyé à {l.email} depuis l’adresse d’envoi du site. Votre signature, le logo et le pied de courriel (adresse postale, lien de désabonnement) sont ajoutés automatiquement.</span>
                  <div className="adm-ligne-actions">
                    <button type="submit" className="adm-bouton adm-bouton-violet" disabled={occupe}>Envoyer maintenant</button>
                    {brouillon && (
                      <button type="button" className="adm-bouton adm-bouton-discret" disabled={occupe}
                        onClick={async () => { if (await act('draft_status', brouillon.id, 'rejected')) { setReponse(null); await charger(); } }}>
                        Rejeter le brouillon
                      </button>
                    )}
                    {!brouillon && <button type="button" className="adm-bouton adm-bouton-discret" onClick={() => setReponse(null)}>Annuler</button>}
                  </div>
                </form>
              ) : (
                <button type="button" className="adm-bouton adm-bouton-contour" style={{ alignSelf: 'flex-start' }}
                  onClick={() => setReponse({ sujet: '', corps: '', brouillon: null })}>
                  Écrire depuis l’admin
                </button>
              )}
            </section>
          )}
        </div>

        <div className="adm-colonne">
          {d.courriels?.length > 0 && (
            <section className="adm-carte">
              <h2 className="adm-titre-carte">Courriels</h2>
              <ol className="adm-historique">
                {d.courriels.map((c) => (
                  <li key={c.id}>
                    <span className="adm-puce-ronde" style={{ background: c.direction === 'in' ? 'var(--accent)' : 'var(--fg-3)' }} />
                    <span className="adm-ligne-texte">
                      <span><strong>{c.direction === 'in' ? 'Reçu' : 'Envoyé'}</strong> · {c.subject || '(sans objet)'}
                        {c.direction === 'in' && !c.traite_at && !c.ignore_at && <span className="adm-pastille adm-pastille-accent" style={{ marginLeft: 6 }}>À répondre</span>}
                      </span>
                      <span className="adm-gris adm-texte-long">{c.snippet}</span>
                      <span className="adm-gris">{dateHeure(c.received_at)}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <span className="adm-gris">Pour lire un courriel reçu en entier et y répondre : menu « Boîte de réception ».</span>
            </section>
          )}

          <section className="adm-carte">
            <h2 className="adm-titre-carte">Tâches</h2>
            {ouvertes.length === 0 && <p className="adm-vide">Aucune tâche ouverte.</p>}
            {ouvertes.map((t) => {
              const retard = Boolean(t.due_at && new Date(t.due_at).getTime() < chargeA);
              return (
                <label key={t.id} className="adm-tache">
                  <input type="checkbox" checked={false} disabled={occupe}
                    onChange={async () => { if (await act('task_done', t.id)) { await charger(); onChange(); } }} />
                  <span className="adm-ligne-texte">
                    <span>{t.title}</span>
                    <span className={retard ? 'adm-rouge' : 'adm-gris'}>{retard ? 'En retard · ' : ''}échéance {dateHeure(t.due_at)}</span>
                  </span>
                </label>
              );
            })}
            {faites.length > 0 && <span className="adm-gris">{faites.length} tâche{faites.length > 1 ? 's' : ''} faite{faites.length > 1 ? 's' : ''}</span>}
            <form className="adm-formulaire adm-formulaire-ligne" onSubmit={async (e) => {
              e.preventDefault();
              if (await faire({ op: 'tache', ...tache }, 'Tâche ajoutée.')) setTache({ titre: '', echeance: '' });
            }}>
              <input aria-label="Nouvelle tâche" placeholder="Nouvelle tâche (ex. envoyer la soumission)" value={tache.titre}
                onChange={(e) => setTache({ ...tache, titre: e.target.value })} />
              <input type="date" aria-label="Échéance" value={tache.echeance} onChange={(e) => setTache({ ...tache, echeance: e.target.value })} />
              <button type="submit" className="adm-bouton" disabled={occupe}>Ajouter</button>
            </form>
          </section>

          <section className="adm-carte">
            <h2 className="adm-titre-carte">Historique</h2>
            <form className="adm-formulaire" onSubmit={async (e) => {
              e.preventDefault();
              if (await faire({ op: 'note', texte: note }, 'Note ajoutée.')) setNote('');
            }}>
              <textarea rows={2} aria-label="Ajouter une note" placeholder="Ajouter une note (ex. préfère être appelée le matin)"
                value={note} onChange={(e) => setNote(e.target.value)} />
              <button type="submit" className="adm-bouton adm-bouton-contour" style={{ alignSelf: 'flex-start' }} disabled={occupe || !note.trim()}>Ajouter la note</button>
            </form>
            <ol className="adm-historique">
              {d.activites.length === 0 && <li className="adm-vide">Rien pour l’instant.</li>}
              {d.activites.map((a) => (
                <li key={a.id}>
                  <span className="adm-puce-ronde" style={{ background: COULEUR_TYPE[a.type] ?? 'var(--fg-3)' }} />
                  <span className="adm-ligne-texte">
                    <span className="adm-texte-long">{a.content}</span>
                    <span className="adm-gris">{dateHeure(a.created_at)} · {a.author === 'admin' ? 'vous' : a.author === 'site-web' ? 'site web' : a.author === 'prospect' ? 'la personne' : 'automatique'}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
