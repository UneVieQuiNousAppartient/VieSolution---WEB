import Image from 'next/image';
import { SITES } from './sites-band';
import { t, type Lang } from '@/lib/i18n';

/* Les sites bâtis par Vie Solution Web, en grille fixe (page /sites-web). Mêmes données et
   mêmes captures que la bande défilante de l'accueil (sites-band.tsx). */
export function RealisationsGrid({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="realisations-web" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Réalisations")}</div>
            <h2>{t(lang, "Des sites")}<br />{t(lang, "qu'on a bâtis.")}</h2>
          </div>
        </div>
        <ul className="realisations-grid reveal">
          {SITES.map((s) => (
            <li key={s.domaine}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="site-card"
                aria-label={t(lang, "{nom} — ouvrir le site dans un nouvel onglet", { nom: s.nom })}
              >
                <span className="site-card-bar" aria-hidden="true">
                  <i /><i /><i />
                  <span>{s.domaine}</span>
                </span>
                <Image
                  src={s.image}
                  alt={t(lang, "Page d'accueil du site {nom}", { nom: s.nom })}
                  width={960}
                  height={555}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="site-card-img"
                />
                <span className="site-card-nom">{s.nom}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
