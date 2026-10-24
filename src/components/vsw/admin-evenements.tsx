'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GENRES, LIBELLE_GENRE, courrielAnnulation, isoVersLocal, manquePourPublier, places, quandLisible, type Genre } from '@/lib/evenements';
import { SITE_URL } from '@/lib/site';

/* Onglet « Événements » de l'admin (étape F, maquette SiteEvenements) : chiffres, liste des ateliers,
   création et modification (brouillon puis publication), inscrits (CSV, fiche client, annulation),
   annulation d'un atelier avec courriel à chaque inscrit. La page publique est cachée : lien à envoyer. */
type Evt = { id: string; slug: string; titre: string; genre: Genre; debut: string; fin: string; lieu_public: string; lieu_prive: string; places: number; presentation: string; statut: 'brouillon' | 'publie' | 'annule' };
type Ins = { id: string; evenement_id: string; nom: string; courriel: string; entreprise: string | null; question: string | null; avertir: boolean; statut: 'confirmee' | 'annulee'; confirmation_envoyee_at: string | null; rappel_envoye_at: string | null; created_at: string; fiche: string | null };
type Saisie = { titre: string; genre: Genre; debut: string; fin: string; lieu_public: string; lieu_prive: string; places: string; presentation: string };

/** Adresse des ateliers en personne, donnée par Camille le 2026-10-24 : proposée d'office, modifiable. */
const ADRESSE_ATELIERS = { lieu_public: 'Longueuil', lieu_prive: '40, rue de l’Église, Longueuil (Québec) J4K 1H9' };
const VIDE: Saisie = { titre: '', genre: 'en_ligne', debut: '', fin: '', lieu_public: '', lieu_prive: '', places: '20', presentation: '' };
const ETAT: Record<Evt['statut'], [string, string]> = { brouillon: ['Brouillon', 'adm-pastille-warn'], publie: ['Publié', 'adm-pastille-ok'], annule: ['Annulé', 'adm-pastille-danger'] };
const LIEN_PAGE = `${SITE_URL}/evenements`;

async function appel(body: Record<string, unknown>) {
  const r = await fetch('/api/admin/evenements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = (await r.json().catch(() => ({}))) as { error?: string; envoyes?: number; erreurs?: number };
  if (!r.ok) throw new Error(j.error || 'L’opération n’a pas pu être faite.');
  return j;
}

function Formulaire({ depart, onFini }: { depart: Evt | null; onFini: () => void }) {
  const [v, setV] = useState<Saisie>(() => {
    if (!depart) return VIDE;
    return { ...depart, debut: isoVersLocal(depart.debut), fin: isoVersLocal(depart.fin), places: String(depart.places) };
  });
  const [etat, setEtat] = useState<'repos' | 'envoi'>('repos');
  const [erreur, setErreur] = useState('');
  const champ = (k: keyof Saisie) => ({ value: v[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value }) });
  const enregistrer = async (e: React.FormEvent, publier = false) => {
    e.preventDefault();
    setErreur('');
    // Vérifié avant de créer : sinon un refus laisserait un brouillon, et un 2ᵉ clic en créerait un autre.
    const manque = publier ? manquePourPublier(v) : null;
    if (manque) return setErreur(manque);
    setEtat('envoi');
    try {
      const r = await appel({ op: depart ? 'modifier' : 'creer', id: depart?.id, ...v, places: Number(v.places) });
      const id = depart?.id || (r as { id?: string }).id;
      if (publier && id) await appel({ op: 'statut', id, statut: 'publie' });
      onFini();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'Erreur');
      setEtat('repos');
    }
  };
  return (
    <form className="adm-carte adm-evt-form" onSubmit={(e) => enregistrer(e)}>
      <h2>{depart ? 'Modifier l’atelier' : 'Nouvel atelier'}</h2>
      <label>Titre<input required maxLength={120} {...champ('titre')} /></label>
      <div className="adm-periodes" role="group" aria-label="Type d’atelier">
        {GENRES.map((g) => <button key={g} type="button" aria-pressed={v.genre === g} className={v.genre === g ? 'actif' : ''} onClick={() => setV(g === 'en_personne' && !v.lieu_prive.trim() ? { ...v, genre: g, ...ADRESSE_ATELIERS, lieu_public: v.lieu_public || ADRESSE_ATELIERS.lieu_public } : g === 'en_ligne' && v.lieu_prive === ADRESSE_ATELIERS.lieu_prive ? { ...v, genre: g, lieu_prive: '', lieu_public: '' } : { ...v, genre: g })}>{LIBELLE_GENRE[g]}</button>)}
      </div>
      <div className="adm-evt-deux">
        <label>Début (heure de Montréal)<input type="datetime-local" required {...champ('debut')} /></label>
        <label>Fin<input type="datetime-local" required {...champ('fin')} /></label>
      </div>
      {v.genre === 'en_personne' && <label>Ville ou quartier, affiché sur le site <small>(ex. Montréal)</small><input maxLength={120} {...champ('lieu_public')} /></label>}
      <label>
        {v.genre === 'en_ligne' ? 'Lien de visioconférence' : 'Adresse complète'}
        <small>Jamais affiché sur le site : envoyé seulement aux inscrits, dans leurs courriels.</small>
        <input maxLength={500} placeholder={v.genre === 'en_ligne' ? 'https://…' : 'Numéro, rue, ville'} {...champ('lieu_prive')} />
      </label>
      <label>Nombre de places<input type="number" min={1} max={500} required {...champ('places')} /></label>
      <label>Présentation <small>(ce qu’on verra, pour qui, quoi apporter ; une ligne vide sépare les paragraphes)</small><textarea rows={6} maxLength={5000} {...champ('presentation')} /></label>
      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      <div className="adm-avis-boutons">
        <button type="submit" className="btn btn-ghost" disabled={etat === 'envoi'}>{depart ? 'Enregistrer' : 'Enregistrer en brouillon'}</button>
        {(!depart || depart.statut === 'brouillon') && <button type="button" className="btn btn-primary" disabled={etat === 'envoi'} onClick={(e) => enregistrer(e, true)}>Publier sur la page</button>}
        <button type="button" className="btn btn-ghost" onClick={onFini}>Fermer</button>
      </div>
    </form>
  );
}

function Inscrits({ e, inscrits, onChange, onOuvrirFiche }: { e: Evt; inscrits: Ins[]; onChange: () => void; onOuvrirFiche: (id: string) => void }) {
  const [erreur, setErreur] = useState('');
  const changer = async (i: Ins, statut: Ins['statut']) => {
    setErreur('');
    try { await appel({ op: 'inscription', id: i.id, statut }); onChange(); } catch (err) { setErreur(err instanceof Error ? err.message : 'Erreur'); }
  };
  return (
    <section className="adm-carte adm-evt-inscrits" aria-label={`Inscrits de ${e.titre}`}>
      <div className="adm-carte-tete">
        <h2>Inscrits · {e.titre}</h2>
        {inscrits.length > 0 && <a className="btn btn-ghost" href={`/api/admin/evenements?csv=${e.id}`}>Télécharger la liste (CSV)</a>}
      </div>
      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      {inscrits.length === 0 ? <p className="adm-gris">Personne d’inscrit pour l’instant. Envoyez le lien de la page à vos clients.</p> : (
        <ul className="adm-evt-liste-ins">
          {inscrits.map((i) => (
            <li key={i.id}>
              <div>
                <span className="adm-evt-nom"><strong>{i.nom}</strong> <span className={`adm-pastille ${i.statut === 'confirmee' ? 'adm-pastille-ok' : 'adm-pastille-danger'}`}>{i.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}</span></span>
                <div className="adm-gris">{[i.entreprise, i.courriel].filter(Boolean).join(' · ')}{i.avertir ? ' · veut les prochains ateliers' : ''}</div>
                {i.question && <div className="adm-evt-question">« {i.question} »</div>}
                <div className="adm-gris">
                  Inscrit le {new Date(i.created_at).toLocaleDateString('fr-CA')}
                  {i.statut === 'confirmee' && (i.confirmation_envoyee_at ? ' · confirmation envoyée' : ' · confirmation non envoyée')}
                  {i.rappel_envoye_at ? ' · rappel envoyé' : ''}
                </div>
              </div>
              <div className="adm-avis-boutons">
                {i.fiche && <button type="button" className="btn btn-ghost" onClick={() => onOuvrirFiche(i.fiche!)}>Fiche client</button>}
                {e.statut !== 'annule' && (i.statut === 'confirmee'
                  ? <button type="button" className="btn btn-ghost" onClick={() => changer(i, 'annulee')}>Annuler l’inscription</button>
                  : <button type="button" className="btn btn-ghost" onClick={() => changer(i, 'confirmee')}>Remettre confirmée</button>)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function AdminEvenements({ onOuvrirFiche }: { onOuvrirFiche: (id: string) => void }) {
  const [evts, setEvts] = useState<Evt[] | null>(null);
  const [ins, setIns] = useState<Ins[]>([]);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');
  const [edition, setEdition] = useState<Evt | 'nouveau' | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  const charger = useCallback(async () => {
    setErreur('');
    try {
      const r = await fetch('/api/admin/evenements', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Erreur');
      setEvts(j.evenements); setIns(j.inscriptions); setMaintenant(Date.now());
    } catch {
      setErreur('Les événements n’ont pas pu être chargés. Réessayez dans quelques minutes.');
    }
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const parEvt = useMemo(() => {
    const m = new Map<string, Ins[]>();
    for (const i of ins) m.set(i.evenement_id, [...(m.get(i.evenement_id) || []), i]);
    return m;
  }, [ins]);
  const confirmes = (id: string) => (parEvt.get(id) || []).filter((i) => i.statut === 'confirmee').length;
  const aVenir = (evts || []).filter((e) => e.statut === 'publie' && new Date(e.debut).getTime() > maintenant).sort((a, b) => a.debut.localeCompare(b.debut));
  const inscritsAVenir = aVenir.reduce((t, e) => t + confirmes(e.id), 0);
  const placesAVenir = aVenir.reduce((t, e) => t + e.places, 0);
  const avertir = new Set(ins.filter((i) => i.avertir).map((i) => i.courriel.toLowerCase())).size;

  const statut = async (e: Evt, s: 'publie' | 'brouillon') => {
    setErreur(''); setInfo('');
    try { await appel({ op: 'statut', id: e.id, statut: s }); await charger(); } catch (err) { setErreur(err instanceof Error ? err.message : 'Erreur'); }
  };
  const annuler = async (e: Evt) => {
    const n = confirmes(e.id);
    const exemple = courrielAnnulation(e, 'Marie Tremblay');
    const message = n && e.statut === 'publie' && new Date(e.fin).getTime() > maintenant
      ? `Annuler « ${e.titre} » ?\n\nCe courriel partira aux ${n} inscrit(s) :\n\nObjet : ${exemple.sujet}\n\n${exemple.texte}`
      : `Annuler « ${e.titre} » ? Aucun courriel ne partira (aucun inscrit à prévenir).`;
    if (!window.confirm(message)) return;
    setErreur(''); setInfo('');
    try {
      const r = await appel({ op: 'annuler', id: e.id });
      setInfo(r.envoyes || r.erreurs ? `Atelier annulé · ${r.envoyes} courriel(s) envoyé(s)${r.erreurs ? `, ${r.erreurs} en échec` : ''}.` : 'Atelier annulé.');
      await charger();
    } catch (err) { setErreur(err instanceof Error ? err.message : 'Erreur'); }
  };

  if (!evts && !erreur) return <p className="adm-gris">Chargement…</p>;
  const prochain = aVenir[0];
  const jours = prochain ? Math.floor((new Date(prochain.debut).getTime() - maintenant) / 86_400_000) : 0;

  return (
    <div className="adm-avis">
      <div className="adm-tuiles">
        <div className="adm-carte adm-tuile"><span className="adm-tuile-tete">Ateliers à venir</span><span className="adm-tuile-valeur">{aVenir.length}</span><span className="adm-gris">{prochain ? (jours === 0 ? 'le prochain dans moins d’un jour' : `le prochain dans ${jours} jour${jours > 1 ? 's' : ''}`) : 'aucun publié'}</span></div>
        <div className="adm-carte adm-tuile"><span className="adm-tuile-tete">Inscrits à venir</span><span className="adm-tuile-valeur">{inscritsAVenir}</span><span className="adm-gris">sur {placesAVenir} places</span></div>
        <div className="adm-carte adm-tuile"><span className="adm-tuile-tete">Veulent les prochains</span><span className="adm-tuile-valeur">{avertir}</span><span className="adm-gris">case « avertissez-moi » cochée</span></div>
      </div>

      <section className="adm-carte adm-evt-lien">
        <div>
          <strong>Page réservée à vos clients</strong>
          <p className="adm-gris">Ni dans le menu, ni sur Google : envoyez ce lien à vos clients. <strong>{LIEN_PAGE}</strong></p>
        </div>
        <div className="adm-avis-boutons">
          <button type="button" className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(LIEN_PAGE).then(() => { setCopie(true); setTimeout(() => setCopie(false), 2000); })}>{copie ? 'Lien copié' : 'Copier le lien'}</button>
          <button type="button" className="btn btn-primary" onClick={() => { setEdition('nouveau'); setOuvert(null); }}>+ Nouvel atelier</button>
        </div>
      </section>

      {erreur && <p className="adm-erreur" role="alert">{erreur} <button type="button" className="btn btn-ghost" onClick={charger}>Réessayer</button></p>}
      {info && <p className="adm-gris" role="status">{info}</p>}

      {edition && <Formulaire key={edition === 'nouveau' ? 'nouveau' : edition.id} depart={edition === 'nouveau' ? null : edition} onFini={() => { setEdition(null); charger(); }} />}

      {evts && evts.length === 0 && !edition && <p className="adm-vide">Aucun atelier pour le moment. Créez le premier avec « + Nouvel atelier » : il reste en brouillon tant que vous ne le publiez pas.</p>}

      {evts && evts.length > 0 && (
        <ul className="adm-avis-liste">
          {evts.map((e) => {
            const n = confirmes(e.id);
            const passe = new Date(e.fin).getTime() < maintenant;
            const p = places(e.places, n);
            return (
              <li key={e.id} className="adm-carte adm-avis-carte">
                <div className="adm-avis-tete">
                  <span>
                    <strong>{e.titre}</strong> <span className={`adm-pastille ${ETAT[e.statut][1]}`}>{passe && e.statut === 'publie' ? 'Passé' : ETAT[e.statut][0]}</span>
                  </span>
                  <span className="adm-gris">{LIBELLE_GENRE[e.genre]} · {quandLisible(e.debut, e.fin)}</span>
                </div>
                <p className="adm-gris">{n} inscrit{n > 1 ? 's' : ''} sur {e.places} · {p.libelle}{e.statut === 'publie' && !passe ? ` · ${SITE_URL}/evenements/${e.slug}` : ''}</p>
                <div className="adm-avis-boutons">
                  <button type="button" className="btn btn-ghost" aria-expanded={ouvert === e.id} onClick={() => setOuvert(ouvert === e.id ? null : e.id)}>{ouvert === e.id ? 'Masquer les inscrits' : 'Voir les inscrits'}</button>
                  {e.statut !== 'annule' && !passe && <button type="button" className="btn btn-ghost" onClick={() => { setEdition(e); setOuvert(null); }}>Modifier</button>}
                  {e.statut === 'brouillon' && <button type="button" className="btn btn-primary" onClick={() => statut(e, 'publie')}>Publier</button>}
                  {e.statut === 'publie' && !passe && n === 0 && <button type="button" className="btn btn-ghost" onClick={() => statut(e, 'brouillon')}>Retirer de la page</button>}
                  {e.statut !== 'annule' && !passe && <button type="button" className="btn btn-ghost adm-avis-supprimer" onClick={() => annuler(e)}>Annuler l’atelier</button>}
                </div>
                {ouvert === e.id && <Inscrits e={e} inscrits={parEvt.get(e.id) || []} onChange={charger} onOuvrirFiche={onOuvrirFiche} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
