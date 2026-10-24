'use client';

import { useCallback, useEffect, useState } from 'react';

/* Carte « Conservation » (Loi 25, accord de Camille du 2026-10-24), en bas de l'onglet Demandes :
   fiches sans contact depuis 24 mois. Rien ne s'efface tout seul : Camille coche, vérifie, supprime. */
type Fiche = { id: string; nom: string; entreprise: string | null; etape: string; derniere: string | null };

export function AdminConservation({ onChange }: { onChange: () => void }) {
  const [fiches, setFiches] = useState<Fiche[] | null>(null);
  const [mois, setMois] = useState(24);
  const [choix, setChoix] = useState<Set<string>>(new Set());
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');

  const charger = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/conservation', { cache: 'no-store' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setFiches(j.fiches); setMois(j.mois); setChoix(new Set());
    } catch {
      setErreur('La liste de conservation n’a pas pu être chargée.');
    }
  }, []);
  useEffect(() => { charger(); }, [charger]);

  const supprimer = async () => {
    if (!choix.size || !window.confirm(`Supprimer définitivement ${choix.size} personne(s) et tout ce qui les concerne ? Cette action ne peut pas être annulée.`)) return;
    setErreur(''); setInfo('');
    const r = await fetch('/api/admin/conservation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [...choix] }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return setErreur(j.error || 'L’opération n’a pas pu être faite.');
    setInfo(`${j.effacees} personne(s) supprimée(s)${j.erreurs ? `, ${j.erreurs} en échec (réessayez)` : ''}.`);
    onChange();
    charger();
  };

  if (!fiches) return erreur ? <p className="adm-erreur" role="alert">{erreur}</p> : null;
  return (
    <section className="adm-carte" aria-label="Conservation">
      <h2 className="adm-titre-carte">Conservation (Loi 25)</h2>
      <p className="adm-gris">Fiches sans aucun contact depuis {mois} mois. Rien ne s’efface tout seul : vérifiez, cochez, puis supprimez.</p>
      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      {info && <p className="adm-gris" role="status">{info}</p>}
      {fiches.length === 0 ? <p className="adm-vide">Aucune fiche à supprimer pour l’instant.</p> : (
        <>
          <ul className="adm-evt-liste-ins">
            {fiches.map((f) => (
              <li key={f.id}>
                <label className="adm-agenda-jour" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="checkbox" checked={choix.has(f.id)} onChange={() => { const s = new Set(choix); if (s.has(f.id)) s.delete(f.id); else s.add(f.id); setChoix(s); }} />
                  <span><strong>{f.nom}</strong>{f.entreprise ? ` · ${f.entreprise}` : ''} · {f.etape}</span>
                </label>
                <span className="adm-gris">dernière activité {f.derniere ? new Date(f.derniere).toLocaleDateString('fr-CA') : '—'}</span>
              </li>
            ))}
          </ul>
          <div className="adm-avis-boutons">
            <button type="button" className="adm-bouton adm-bouton-contour adm-avis-supprimer" disabled={!choix.size} onClick={supprimer}>Supprimer définitivement ({choix.size})</button>
          </div>
        </>
      )}
    </section>
  );
}
