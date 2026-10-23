import Image from 'next/image';

/*
 * Galerie « À quoi ça ressemble » de /crm-sur-mesure (2026-10-22).
 * Écrans tirés des maquettes de tableaux de bord faites par Camille pour VieSolution et Khí Succès
 * Académique (artefacts « Maquette tableau de bord VieSolution » et « Maquette admin KHI »,
 * données fictives). Accord de Camille le 2026-10-22 pour les montrer, KHI nommé.
 * Images enregistrées dans public/realisations/outils/ (rendu 1920 × 1200, haut de l'écran).
 */
export const ECRANS = [
  {
    client: 'VieSolution',
    titre: 'Aujourd’hui',
    desc: 'Les demandes à rappeler, les rendez-vous et les tâches du jour, sur un seul écran.',
    image: '/realisations/outils/viesolution-aujourdhui.webp',
  },
  {
    client: 'VieSolution',
    titre: 'Leads',
    desc: 'Toutes les demandes au même endroit, la fiche ouverte à côté : appeler, écrire, prendre un rendez-vous.',
    image: '/realisations/outils/viesolution-leads.webp',
  },
  {
    client: 'Khí Succès Académique',
    titre: 'Accueil de l’administration',
    desc: 'Les nouvelles demandes, les séances à venir et les candidatures de tuteurs.',
    image: '/realisations/outils/khi-accueil.webp',
  },
  {
    client: 'Khí Succès Académique',
    titre: 'Statistiques',
    desc: 'D’où viennent les demandes et combien deviennent des inscriptions.',
    image: '/realisations/outils/khi-statistiques.webp',
  },
];

export function OutilsGalerie() {
  return (
    <section id="exemples" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Exemples</div>
            <h2>
              À quoi ça<br />ressemble.
            </h2>
          </div>
          <p className="desc">
            Des maquettes d’écrans conçues pour deux de nos clients. Chaque outil est différent : on part de
            votre façon de travailler.
          </p>
        </div>
        <ul className="outils-grille">
          {ECRANS.map((e) => (
            <li key={e.image} className="outils-carte reveal">
              <figure>
                <a href={e.image} target="_blank" rel="noopener" className="outils-cadre" aria-label={`Agrandir l’écran « ${e.titre} » de ${e.client} (nouvel onglet)`}>
                  <span className="site-card-bar" aria-hidden="true">
                    <i /><i /><i />
                    <span>{e.client}</span>
                  </span>
                  <Image
                    src={e.image}
                    alt={`Écran « ${e.titre} » du tableau de bord de ${e.client}, avec des données fictives`}
                    width={1920}
                    height={1200}
                    sizes="(max-width: 900px) 100vw, 580px"
                    className="outils-img"
                  />
                </a>
                <figcaption>
                  <span className="outils-client">{e.client}</span>
                  <strong>{e.titre}</strong>
                  <span>{e.desc}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="outils-note">Données fictives : aucun vrai client n’apparaît sur ces écrans.</p>
      </div>
    </section>
  );
}
