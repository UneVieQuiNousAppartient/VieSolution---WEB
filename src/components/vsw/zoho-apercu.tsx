/* « À quoi ça ressemble » (page /zoho) : trois ILLUSTRATIONS dessinées par Vie Solution Web
   (choix de Camille du 2026-10-24, option B), avec des données d'exemple. Aucune capture, aucun
   logo ni visuel de Zoho : ce sont des schémas de ce qu'on configure (suivi des ventes, tableau de
   bord, facture), pas des images du logiciel. */
const COLONNES = [
  { nom: 'Nouveaux', cartes: [['Clinique Rive-Sud', 'Appel à faire'], ['Studio Lumière', 'Courriel reçu']] },
  { nom: 'Rendez-vous', cartes: [['Cabinet Tremblay', 'Jeudi 10 h']] },
  { nom: 'Soumission', cartes: [['Rénovations Gagnon', 'Envoyée lundi'], ['Café du Coin', 'À relancer']] },
  { nom: 'Clients', cartes: [['Agence Roy', 'Gagné ✓']] },
];
const BARRES = [38, 52, 45, 64, 58, 72, 80];

export function ZohoApercu() {
  return (
    <section className="section zoho-apercu">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">À quoi ça ressemble</div>
            <h2>Une fois installé, votre journée tient sur un écran.</h2>
          </div>
          <p className="desc">
            Trois exemples de ce qu&apos;on configure pour vous : le suivi de vos clients, un tableau de bord clair,
            et des factures qui partent toutes seules. Illustrations avec des données d&apos;exemple.
          </p>
        </div>

        <div className="zoho-apercu-grille reveal">
          <figure className="za-fenetre za-large">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-kanban" role="img" aria-label="Illustration : suivi des ventes en colonnes — nouveaux, rendez-vous, soumission, clients">
              {COLONNES.map((c) => (
                <div key={c.nom} className="za-colonne">
                  <div className="za-colonne-tete">{c.nom} <b>{c.cartes.length}</b></div>
                  {c.cartes.map(([n, s]) => (
                    <div key={n} className="za-carte"><strong>{n}</strong><span>{s}</span></div>
                  ))}
                </div>
              ))}
            </div>
            <figcaption>Vos clients, étape par étape : chacun sait qui rappeler aujourd&apos;hui.</figcaption>
          </figure>

          <figure className="za-fenetre">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-tableau" role="img" aria-label="Illustration : tableau de bord avec trois chiffres et un graphique des ventes">
              <div className="za-chiffres">
                <div><span>Ventes du mois</span><b>+18 %</b></div>
                <div><span>Soumissions</span><b>12</b></div>
                <div><span>À relancer</span><b>3</b></div>
              </div>
              <div className="za-graphe">{BARRES.map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}</div>
            </div>
            <figcaption>Vos chiffres du jour, sans fichier Excel à mettre à jour.</figcaption>
          </figure>

          <figure className="za-fenetre">
            <div className="za-barre" aria-hidden="true"><span /><span /><span /></div>
            <div className="za-facture" role="img" aria-label="Illustration : facture envoyée et payée, avec rappel automatique">
              <div className="za-facture-tete"><strong>Facture 1042</strong><span className="za-paye">Payée</span></div>
              <div className="za-ligne"><span>Entretien mensuel</span><span>—</span></div>
              <div className="za-ligne"><span>Formation de l&apos;équipe</span><span>—</span></div>
              <div className="za-ligne za-total"><span>Rappel automatique</span><span>envoyé à J+7</span></div>
            </div>
            <figcaption>Des factures qui partent et se relancent toutes seules.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
