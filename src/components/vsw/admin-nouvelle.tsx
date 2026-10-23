'use client';

// Fenêtre « Nouvelle demande » de /admin (étape A, maquette validée par Camille le 2026-10-23) : une
// personne qui a appelé, écrit directement ou été recommandée. Aucune relance automatique sans l'accord
// coché ; validation serveur : validerNouvelleDemande (src/lib/crm/saisie.ts).

import { useEffect, useRef, useState } from 'react';
import { PROVENANCES_DEMANDE, PROVENANCES_MANUELLES } from '@/lib/crm/saisie';

const VIDE = { nom: '', courriel: '', telephone: '', entreprise: '', provenance: PROVENANCES_MANUELLES[0] as string, besoin: '', rappel: '', dejaParle: false, accord: false, prospect: false };

export function NouvelleDemande({ onFermer, onCreee }: { onFermer: () => void; onCreee: (id: string) => void }) {
  const [f, setF] = useState(VIDE);
  const [avecRappel, setAvecRappel] = useState(true);
  const [erreur, setErreur] = useState('');
  const [existante, setExistante] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);
  const premier = useRef<HTMLInputElement>(null);
  // Dernière fonction de fermeture : l'effet ne tourne qu'à l'ouverture (le curseur reste où il est).
  const fermer = useRef(onFermer);
  useEffect(() => { fermer.current = onFermer; }, [onFermer]);

  useEffect(() => {
    premier.current?.focus();
    const echap = (e: KeyboardEvent) => { if (e.key === 'Escape') fermer.current(); };
    window.addEventListener('keydown', echap);
    return () => window.removeEventListener('keydown', echap);
  }, []);

  const champ = (k: 'nom' | 'courriel' | 'telephone' | 'entreprise', libelle: string, type = 'text') => (
    <label className="adm-champ">
      {libelle}
      <input ref={k === 'nom' ? premier : undefined} type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}
        autoComplete="off" required={k === 'nom'} />
    </label>
  );

  return (
    <div className="adm-voile" onMouseDown={(e) => { if (e.target === e.currentTarget) onFermer(); }}>
      <form className="adm-modale" role="dialog" aria-modal="true" aria-labelledby="titre-nouvelle"
        onSubmit={async (e) => {
          e.preventDefault();
          setEnCours(true);
          const res = await fetch('/api/admin/fiche', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ op: 'creer', ...f, rappel: avecRappel ? f.rappel : '' }),
          });
          const json = (await res.json().catch(() => ({}))) as { error?: string; id?: string };
          setEnCours(false);
          if (res.ok && json.id) { onCreee(json.id); return; }
          setErreur(json.error || 'Erreur');
          setExistante(res.status === 409 && json.id ? json.id : null);
        }}>
        <div className="adm-carte-tete">
          <h2 id="titre-nouvelle" className="adm-fiche-nom" style={{ fontSize: 26 }}>Nouvelle demande</h2>
          <button type="button" className="adm-bouton adm-bouton-discret" aria-label="Fermer" onClick={onFermer}>×</button>
        </div>
        <p className="adm-gris" style={{ margin: 0, fontSize: 14 }}>
          Pour une personne qui vous a appelée, écrit directement ou été recommandée, ou pour un prospect que vous allez contacter. Aucun courriel automatique ne part sans votre accord.
        </p>
        <div className="adm-grille-champs">
          {champ('nom', 'Nom *')}
          {champ('courriel', 'Courriel', 'email')}
          {champ('telephone', 'Téléphone', 'tel')}
          {champ('entreprise', 'Entreprise')}
        </div>
        <span className="adm-gris" style={{ marginTop: -6 }}>Un courriel ou un téléphone, au moins.</span>
        <label className="adm-champ">
          Provenance
          <select value={f.provenance} onChange={(e) => setF({ ...f, provenance: e.target.value })}>
            {PROVENANCES_MANUELLES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="adm-champ">
          Son besoin
          <textarea rows={4} value={f.besoin} onChange={(e) => setF({ ...f, besoin: e.target.value })} />
        </label>
        <fieldset className="adm-groupe">
          <legend>Et ensuite ?</legend>
          <label className="adm-case">
            <input type="checkbox" checked={f.prospect} onChange={(e) => setF({
              ...f,
              prospect: e.target.checked,
              // Un prospect n'a rien demandé : « Appel reçu » ou « Courriel reçu » ne lui vont pas (refusé par le serveur).
              provenance: e.target.checked && (PROVENANCES_DEMANDE as readonly string[]).includes(f.provenance) ? 'Autre' : f.provenance,
            })} />
            <span>
              C’est un prospect : je vais le contacter moi-même
              <span className="adm-gris" style={{ display: 'block' }}>Étape « Prospect » : aucun courriel automatique. Au premier contact noté, la fiche passe à « Contacté ». Compté à part dans les statistiques.</span>
            </span>
          </label>
          <label className="adm-case">
            <input type="checkbox" checked={avecRappel} onChange={(e) => setAvecRappel(e.target.checked)} />
            <span>Me rappeler de recontacter cette personne le</span>
            <input type="date" aria-label="Date du rappel" value={f.rappel} disabled={!avecRappel} onChange={(e) => setF({ ...f, rappel: e.target.value })} />
          </label>
          <label className="adm-case">
            <input type="checkbox" checked={f.dejaParle} onChange={(e) => setF({ ...f, dejaParle: e.target.checked })} />
            <span>Je lui ai déjà parlé (les relances automatiques ne partiront pas)</span>
          </label>
          <label className="adm-case">
            <input type="checkbox" checked={f.accord} onChange={(e) => setF({ ...f, accord: e.target.checked })} />
            <span>
              La personne accepte de recevoir nos courriels de suivi
              <span className="adm-gris" style={{ display: 'block' }}>À cocher seulement si elle vous l’a dit (loi anti-pourriel). Sinon, aucune relance automatique, et aucun courriel depuis l’admin si elle n’a rien demandé elle-même.</span>
            </span>
          </label>
        </fieldset>
        {erreur && (
          <p role="alert" className="adm-rouge" style={{ margin: 0 }}>
            {erreur}{' '}
            {existante && <button type="button" className="adm-lien" onClick={() => onCreee(existante)}>Ouvrir cette demande</button>}
          </p>
        )}
        <div className="adm-ligne-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="adm-bouton adm-bouton-contour" onClick={onFermer}>Annuler</button>
          <button type="submit" className="adm-bouton" disabled={enCours || (avecRappel && !f.rappel)}>{enCours ? '…' : 'Créer la demande'}</button>
        </div>
      </form>
    </div>
  );
}
