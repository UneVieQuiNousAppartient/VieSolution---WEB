import Image from 'next/image';

/*
 * Bande « Des sites qu'on a bâtis » (bas du hero, lot design Agnos, 2026-10-21).
 * Sites bâtis par Vie Solution Web, confirmés par Camille (« les sites que l'on a déjà faits »).
 * Captures des pages d'accueil prises le 2026-10-21, enregistrées dans public/realisations/
 * (rien n'est chargé depuis les sites des clients). Défilement CSS seulement : il fonctionne sans
 * JavaScript et s'arrête sous « mouvement réduit » (règle finale de vsw.css).
 * La liste est rendue trois fois pour une boucle sans trou ; les copies 2 et 3 sont cachées
 * aux lecteurs d'écran et sorties de l'ordre de tabulation.
 */
const SITES = [
  {
    nom: "Les Jus Naturels Ben's",
    domaine: 'lesjusnaturelsbens.com',
    url: 'https://lesjusnaturelsbens.com/',
    image: '/realisations/les-jus-naturels-bens.webp',
  },
  {
    nom: 'VieSolution',
    domaine: 'viesolution.ca',
    url: 'https://viesolution.ca/',
    image: '/realisations/viesolution.webp',
  },
  {
    nom: 'Khí Succès Académique',
    domaine: 'khisuccesacademique.com',
    url: 'https://khisuccesacademique.com/',
    image: '/realisations/khi-succes-academique.webp',
  },
];

const COPIES = 3;

export function SitesBand() {
  return (
    <div className="sites-band" role="region" aria-labelledby="sites-band-titre">
      <p className="hero-divider" id="sites-band-titre">
        <span>Des sites qu&apos;on a bâtis</span>
      </p>
      {/* Pause du défilement (WCAG 2.2.2) : case à cocher, sans JavaScript */}
      <label className="sites-band-pause">
        <input type="checkbox" />
        <span className="pause"><span aria-hidden="true">❚❚</span> Pause</span>
        <span className="lecture"><span aria-hidden="true">▶</span> Lecture</span>
      </label>
      <div className="sites-band-viewport">
        <ul className="sites-band-track">
          {Array.from({ length: COPIES }).flatMap((_, copie) =>
            SITES.map((s) => {
              const cachee = copie > 0;
              return (
                <li key={`${copie}-${s.domaine}`} aria-hidden={cachee || undefined}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-card"
                    tabIndex={cachee ? -1 : undefined}
                    aria-label={cachee ? undefined : `${s.nom} — ouvrir le site dans un nouvel onglet`}
                  >
                    <span className="site-card-bar" aria-hidden="true">
                      <i /><i /><i />
                      <span>{s.domaine}</span>
                    </span>
                    <Image
                      src={s.image}
                      alt={cachee ? '' : `Page d'accueil du site ${s.nom}`}
                      width={960}
                      height={555}
                      sizes="400px"
                      className="site-card-img"
                    />
                    <span className="site-card-nom">{s.nom}</span>
                  </a>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
