'use client';

// Modèles de courriels modifiables dans /admin, onglet « Courriels et relances » (étape B, maquette des
// modèles validée par Camille le 2026-10-23). Données : GET et POST /api/admin/modeles.

import { useCallback, useEffect, useState } from 'react';

type Modele = { cle: string; libelle: string; automatique: boolean; sujet: string; corps: string; modifie: string | null };

export function EditeurModeles() {
  const [modeles, setModeles] = useState<Modele[] | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [edition, setEdition] = useState<{ sujet: string; corps: string }>({ sujet: '', corps: '' });
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [enCours, setEnCours] = useState(false);

  const charger = useCallback(async () => {
    const res = await fetch('/api/admin/modeles');
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setErreur(json.error || 'Modèles illisibles pour le moment.'); return; }
    setModeles(json.modeles);
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const ouvrir = (m: Modele) => { setOuvert(m.cle); setEdition({ sujet: m.sujet, corps: m.corps }); setMessage(''); setErreur(''); };

  const groupes: [string, Modele[]][] = [
    ['Courriels qui partent seuls', (modeles ?? []).filter((m) => m.automatique)],
    ['Modèles de réponse (boîte de réception et fiche)', (modeles ?? []).filter((m) => !m.automatique)],
  ];

  return (
    <section className="adm-carte" style={{ marginTop: 10 }}>
      <div className="adm-carte-tete">
        <h2>Modèles de courriels</h2>
      </div>
      <span className="adm-gris">
        {'{{prenom}}'} se remplit tout seul, {'{{lien_rdv}}'} devient le lien de réservation. Les passages entre crochets [ ] sont à compléter avant l’envoi.
        Votre signature, le logo et le pied de courriel sont ajoutés automatiquement.
      </span>
      {(erreur || message) && (
        <div role={erreur ? 'alert' : 'status'} className="adm-ligne adm-ligne-bordee" style={{ borderColor: erreur ? 'var(--danger)' : 'var(--ok)' }}>{erreur || message}</div>
      )}
      {!modeles && !erreur && <p className="adm-gris">Chargement…</p>}
      {groupes.map(([titre, liste]) => liste.length > 0 && (
        <div key={titre} className="adm-modeles">
          <h3 className="adm-sous-titre">{titre}</h3>
          {liste.map((m) => (
            <div key={m.cle} className="adm-ligne adm-ligne-bordee" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <span className="adm-ligne-texte">
                  <strong>{m.libelle}</strong>
                  <span className="adm-gris">Objet : {m.sujet}</span>
                </span>
                {ouvert !== m.cle && <button type="button" className="adm-lien" onClick={() => ouvrir(m)}>Modifier</button>}
              </div>
              {ouvert === m.cle && (
                <form className="adm-formulaire" onSubmit={async (e) => {
                  e.preventDefault();
                  if (m.automatique && !window.confirm('Ce courriel part seul aux nouvelles demandes. Enregistrer le nouveau texte ?')) return;
                  setEnCours(true);
                  const res = await fetch('/api/admin/modeles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cle: m.cle, ...edition }) });
                  const json = await res.json().catch(() => ({}));
                  setEnCours(false);
                  if (!res.ok) { setErreur(json.error || 'Erreur'); setMessage(''); return; }
                  setErreur('');
                  setMessage(`Modèle « ${m.libelle} » enregistré.`);
                  setOuvert(null);
                  await charger();
                }}>
                  <label className="adm-champ">Objet
                    <input value={edition.sujet} onChange={(e) => setEdition({ ...edition, sujet: e.target.value })} />
                  </label>
                  <label className="adm-champ">Texte
                    <textarea rows={10} value={edition.corps} onChange={(e) => setEdition({ ...edition, corps: e.target.value })} />
                  </label>
                  <div className="adm-ligne-actions">
                    <button type="submit" className="adm-bouton" disabled={enCours}>Enregistrer</button>
                    <button type="button" className="adm-bouton adm-bouton-discret" onClick={() => setOuvert(null)}>Annuler</button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
