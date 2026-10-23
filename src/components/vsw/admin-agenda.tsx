'use client';

import { useCallback, useEffect, useState } from 'react';
import { NOMS_JOURS, dateHeureLisible, type ReglagesAgenda } from '@/lib/agenda';

/* Carte « Google Agenda » de l'admin (étape C), en tête de l'onglet Rendez-vous : connexion de l'agenda,
   heures d'ouverture des appels découverte, aperçu des prochains créneaux libres de la page /rdv. */
type Etat = { configure: boolean; connecte: boolean; compte: string; reglages: ReglagesAgenda; apercu: string[]; erreurGoogle: string };

const MESSAGES: Record<string, string> = {
  ok: 'Google Agenda est connecté. La page de rendez-vous montre maintenant vos vrais créneaux libres.',
  annule: 'Connexion annulée : rien n’a changé.',
  refuse: 'La connexion a expiré ou ne venait pas de l’admin. Recommencez depuis le bouton « Connecter Google Agenda ».',
  configuration: 'Il manque GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET dans Vercel (voir le pas-à-pas), ou ADMIN_SECRET (32 caractères au moins).',
  erreur: 'Google a refusé la connexion. Vérifiez l’adresse de redirection dans Google Cloud, puis recommencez.',
};

export function AdminAgenda() {
  const [e, setE] = useState<Etat | null>(null);
  const [r, setR] = useState<ReglagesAgenda | null>(null);
  const [erreur, setErreur] = useState('');
  const [info, setInfo] = useState('');

  const charger = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/agenda', { cache: 'no-store' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Erreur');
      setE(j); setR(j.reglages);
    } catch {
      setErreur('Les réglages de l’agenda n’ont pas pu être chargés.');
    }
  }, []);
  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get('google');
    if (g && MESSAGES[g]) {
      if (g === 'ok') setInfo(MESSAGES[g]); else setErreur(MESSAGES[g]);
      window.history.replaceState(null, '', window.location.pathname);
    }
    charger();
  }, [charger]);

  const envoyer = async (body: Record<string, unknown>, ok: string) => {
    setErreur(''); setInfo('');
    const res = await fetch('/api/admin/agenda', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setErreur(j.error || 'L’opération n’a pas pu être faite.');
    setInfo(j.revoque === false ? `${ok} Google n’a pas confirmé le retrait de l’accès : retirez-le aussi dans votre compte Google (Sécurité → Applications tierces).` : ok);
    charger();
  };

  if (!e || !r) return erreur ? <p className="adm-erreur" role="alert">{erreur}</p> : <p className="adm-gris">Chargement de l’agenda…</p>;
  const basculer = (j: number) => setR({ ...r, jours: r.jours.includes(j) ? r.jours.filter((x) => x !== j) : [...r.jours, j].sort() });

  return (
    <section className="adm-carte adm-agenda" aria-label="Google Agenda">
      <div className="adm-carte-tete">
        <h2>Google Agenda</h2>
        <span className={`adm-pastille ${e.connecte && !e.erreurGoogle ? 'adm-pastille-ok' : 'adm-pastille-warn'}`}>{e.connecte ? (e.erreurGoogle ? 'À reconnecter' : 'Connecté') : 'Non connecté'}</span>
      </div>
      {erreur && <p className="adm-erreur" role="alert">{erreur}</p>}
      {info && <p className="adm-gris" role="status">{info}</p>}
      {e.erreurGoogle && <p className="adm-erreur" role="alert">{e.erreurGoogle}</p>}
      {!e.configure ? (
        <p className="adm-gris">Il manque GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans Vercel (ou ADMIN_SECRET, 32 caractères au moins). Tant que l’agenda n’est pas connecté, la page /rdv garde l’ancien formulaire de demande.</p>
      ) : e.connecte ? (
        <div className="adm-avis-boutons">
          <span className="adm-gris">Agenda de <strong>{e.compte || 'votre compte Google'}</strong> : les rendez-vous s’y ajoutent avec un lien Google Meet.</span>
          <a className="btn btn-ghost" href="/api/admin/google/connecter">Reconnecter</a>
          <button type="button" className="btn btn-ghost adm-avis-supprimer" onClick={() => window.confirm('Déconnecter Google Agenda ? La page /rdv reviendra à l’ancien formulaire de demande.') && envoyer({ op: 'deconnecter' }, 'Google Agenda est déconnecté.')}>Déconnecter</button>
        </div>
      ) : (
        <div className="adm-avis-boutons">
          <span className="adm-gris">Un clic, puis acceptez l’accès dans Google (écran « Application non validée » : Paramètres avancés → Accéder à Vie Solution Web).</span>
          <a className="btn btn-primary" href="/api/admin/google/connecter">Connecter Google Agenda</a>
        </div>
      )}

      <form className="adm-evt-form" onSubmit={(ev) => { ev.preventDefault(); envoyer({ op: 'reglages', ...r }, 'Heures enregistrées.'); }}>
        <h3 className="adm-agenda-sous-titre">Heures des appels découverte</h3>
        <div className="adm-agenda-jours" role="group" aria-label="Jours ouverts">
          {[1, 2, 3, 4, 5, 6, 0].map((j) => (
            <label key={j} className="adm-agenda-jour"><input type="checkbox" checked={r.jours.includes(j)} onChange={() => basculer(j)} /> {NOMS_JOURS[j]}</label>
          ))}
        </div>
        <div className="adm-evt-deux">
          <label>De<input type="time" step={900} value={r.debut} onChange={(ev) => setR({ ...r, debut: ev.target.value })} /></label>
          <label>À<input type="time" step={900} value={r.fin} onChange={(ev) => setR({ ...r, fin: ev.target.value })} /></label>
        </div>
        <div className="adm-evt-deux">
          <label>Durée d’un appel (minutes)<input type="number" min={15} max={60} step={5} value={r.duree} onChange={(ev) => setR({ ...r, duree: Number(ev.target.value) })} /></label>
          <label>Au moins … heures à l’avance<input type="number" min={0} max={168} value={r.delaiHeures} onChange={(ev) => setR({ ...r, delaiHeures: Number(ev.target.value) })} /></label>
          <label>Jusqu’à … jours à l’avance<input type="number" min={1} max={90} value={r.horizonJours} onChange={(ev) => setR({ ...r, horizonJours: Number(ev.target.value) })} /></label>
        </div>
        <div className="adm-avis-boutons"><button type="submit" className="btn btn-primary">Enregistrer les heures</button></div>
      </form>

      {e.apercu.length > 0 && (
        <div>
          <h3 className="adm-agenda-sous-titre">Prochains créneaux libres sur la page</h3>
          <ul className="adm-agenda-apercu">{e.apercu.map((d) => <li key={d}>{dateHeureLisible(d)}</li>)}</ul>
        </div>
      )}
    </section>
  );
}
