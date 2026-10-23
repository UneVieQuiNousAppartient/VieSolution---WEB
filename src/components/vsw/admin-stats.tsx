'use client';

import { useEffect, useState } from 'react';
import { libellePage } from '@/lib/stats';

/* Onglet « Statistiques » de l'admin (étape D) : visites du site, articles du Blog les plus lus,
   avis et courriels. Visites comptées sans cookie ni donnée personnelle (/api/visite). */
type Ligne = { cle: string; total: number };
type Stats = {
  visites: {
    total7: number; total30: number;
    parJour: { jour: string; total: number }[];
    pages: Ligne[]; articles: (Ligne & { titre: string })[]; sources: Ligne[];
    appareils: { mobile: number; tablette: number; ordinateur: number };
  };
  avis: { enAttente: number; publies: number; refuses: number; moyenne: number | null; recus30: number };
  courriels: { envoyes7: number; envoyes30: number; recus7: number; recus30: number };
  tronque: boolean;
};

const nombre = (n: number) => n.toLocaleString('fr-CA');
const jourCourt = (iso: string) => new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const pourcent = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

function Liste({ titre, lignes, vide, libelle }: { titre: string; lignes: Ligne[]; vide: string; libelle?: (l: Ligne) => string }) {
  const max = Math.max(1, ...lignes.map((l) => l.total));
  return (
    <section className="adm-carte adm-stats-liste">
      <h2>{titre}</h2>
      {lignes.length === 0 ? <p className="adm-gris">{vide}</p> : (
        <ol>
          {lignes.map((l) => (
            <li key={l.cle}>
              <span className="adm-stats-nom">{libelle ? libelle(l) : l.cle}</span>
              <span className="adm-stats-barre" aria-hidden="true"><span style={{ width: `${(l.total / max) * 100}%` }} /></span>
              <span className="adm-stats-total">{nombre(l.total)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function AdminStats() {
  const [s, setS] = useState<Stats | null>(null);
  const [erreur, setErreur] = useState('');

  const charger = () => {
    setErreur('');
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Erreur'); setS(d); })
      .catch(() => setErreur('Les statistiques n’ont pas pu être chargées. Réessayez dans quelques minutes.'));
  };
  useEffect(charger, []);

  if (erreur) return <div className="adm-stats"><p className="adm-erreur" role="alert">{erreur}</p><button type="button" className="btn btn-ghost" onClick={charger}>Réessayer</button></div>;
  if (!s) return <p className="adm-gris">Chargement…</p>;

  const v = s.visites;
  const max = Math.max(1, ...v.parJour.map((d) => d.total));
  const app = v.appareils;
  const totalApp = app.mobile + app.tablette + app.ordinateur;

  return (
    <div className="adm-stats">
      <div className="adm-tuiles">
        <div className="adm-carte adm-tuile">
          <span className="adm-tuile-tete">Pages vues · 7 jours</span><span className="adm-tuile-valeur">{nombre(v.total7)}</span>
          <span className="adm-gris">{nombre(v.total30)} sur 30 jours</span>
        </div>
        <div className="adm-carte adm-tuile">
          <span className="adm-tuile-tete">Sur téléphone</span><span className="adm-tuile-valeur">{pourcent(app.mobile, totalApp)} %</span>
          <span className="adm-gris">{pourcent(app.ordinateur, totalApp)} % ordinateur · {pourcent(app.tablette, totalApp)} % tablette</span>
        </div>
        <div className="adm-carte adm-tuile">
          <span className="adm-tuile-tete">Avis reçus · 30 jours</span><span className="adm-tuile-valeur">{nombre(s.avis.recus30)}</span>
          <span className="adm-gris">{s.avis.publies} publiés · {s.avis.enAttente} en attente{s.avis.moyenne === null ? '' : ` · ${s.avis.moyenne.toLocaleString('fr-CA')} ★ en moyenne`}</span>
        </div>
        <div className="adm-carte adm-tuile">
          <span className="adm-tuile-tete">Courriels envoyés · 30 jours</span><span className="adm-tuile-valeur">{nombre(s.courriels.envoyes30)}</span>
          <span className="adm-gris">aux demandes · {nombre(s.courriels.recus30)} courriels reçus · 7 jours : {s.courriels.envoyes7} envoyés, {s.courriels.recus7} reçus</span>
        </div>
      </div>

      <section className="adm-carte adm-stats-jours">
        <div className="adm-carte-tete"><h2>Pages vues par jour</h2><span className="adm-gris">30 derniers jours, heure de Montréal</span></div>
        <div className="adm-stats-graphe" aria-hidden="true">
          {v.parJour.map((d) => (
            <span key={d.jour} className="adm-stats-colonne" title={`${jourCourt(d.jour)} : ${d.total}`}>
              <span style={{ height: `${(d.total / max) * 100}%` }} />
            </span>
          ))}
        </div>
        <div className="adm-stats-axe adm-gris" aria-hidden="true"><span>{jourCourt(v.parJour[0].jour)}</span><span>Aujourd’hui</span></div>
        <table className="sr-only">
          <caption>Pages vues par jour, 30 derniers jours</caption>
          <thead><tr><th scope="col">Jour</th><th scope="col">Pages vues</th></tr></thead>
          <tbody>{v.parJour.map((d) => <tr key={d.jour}><td>{jourCourt(d.jour)}</td><td>{d.total}</td></tr>)}</tbody>
        </table>
      </section>

      <div className="adm-stats-grille">
        <Liste titre="Articles du Blog les plus lus" lignes={v.articles} vide="Aucun article lu ces 30 derniers jours." libelle={(l) => (l as Ligne & { titre: string }).titre} />
        <Liste titre="Pages les plus vues" lignes={v.pages} vide="Aucune visite ces 30 derniers jours." libelle={(l) => libellePage(l.cle)} />
        <Liste titre="D’où viennent les visiteurs" lignes={v.sources} vide="Aucune visite ces 30 derniers jours." />
      </div>

      <p className="adm-gris">
        Visites comptées depuis la mise en ligne de cet onglet, sans cookie ni donnée personnelle : la page, le site d’où arrive le visiteur et le type d’appareil.
        Vos propres visites ne sont pas comptées quand vous êtes connectée à l’admin ; les robots non plus.{s.tronque ? ' Très nombreuses visites : seules les plus récentes sont comptées.' : ''}
      </p>
    </div>
  );
}
