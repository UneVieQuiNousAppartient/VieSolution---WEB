import Image from 'next/image';
import Link from 'next/link';
import { ECRANS } from './outils-galerie';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

/*
 * Bande « Ce qu'on a déjà bâti » (bas du hero, lot design Agnos, 2026-10-21 ; écrans de CRM ajoutés le 2026-10-23).
 * Sites bâtis par Vie Solution Web, confirmés par Camille (« les sites que l'on a déjà faits »).
 * Captures des pages d'accueil prises le 2026-10-21, enregistrées dans public/realisations/
 * (rien n'est chargé depuis les sites des clients). Défilement CSS seulement : il fonctionne sans
 * JavaScript et s'arrête sous « mouvement réduit » (règle finale de vsw.css).
 * La liste est rendue trois fois pour une boucle sans trou ; les copies 2 et 3 sont cachées
 * aux lecteurs d'écran et sorties de l'ordre de tabulation.
 */
export const SITES = [
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

/**
 * Cartes de la bande (refonte du 2026-10-23, demande de Camille : « ajouter les photos de CRM ») :
 * les sites, puis les écrans des CRM sur mesure déjà montrés sur /crm-sur-mesure, en alternance.
 * Chaque carte porte son type. Les captures Zoho s'ajouteront ici quand Camille les donnera.
 */
// Anglais : type, label et alt traduits au rendu (t(lang, …) dans SitesBand) ; barre = titre d'écran marqué phrase() dans outils-galerie.
type CarteBande = { cle: string; nom: string; barre: string; type: string; image: string; lien: string; label: (lang: Lang) => string; alt: (lang: Lang) => string };
const SITES_BANDE: CarteBande[] = SITES.map((s) => ({
  cle: s.domaine, nom: s.nom, barre: s.domaine, type: phrase("Site"), image: s.image, lien: s.url,
  label: (lang) => t(lang, "{nom} — ouvrir le site dans un nouvel onglet", { nom: s.nom }),
  alt: (lang) => t(lang, "Page d'accueil du site {nom}", { nom: s.nom }),
}));
const OUTILS_BANDE: CarteBande[] = ECRANS.map((e) => ({
  cle: e.image, nom: e.client, barre: e.titre, type: phrase("CRM sur mesure"), image: e.image, lien: e.image,
  label: (lang) => t(lang, "Agrandir l’écran « {titre} » de {client} (nouvel onglet)", { titre: t(lang, e.titre), client: e.client }),
  alt: (lang) => t(lang, "Écran « {titre} » de l’outil de {client}", { titre: t(lang, e.titre), client: e.client }),
}));
const BANDE: CarteBande[] = Array.from({ length: Math.max(SITES_BANDE.length, OUTILS_BANDE.length) }).flatMap((_, i) =>
  [SITES_BANDE[i], OUTILS_BANDE[i]].filter((c): c is CarteBande => Boolean(c)),
);

export function SitesBand({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <div className="sites-band" role="region" aria-labelledby="sites-band-titre">
      <p className="hero-divider" id="sites-band-titre">
        <span>{t(lang, "Ce qu'on a déjà bâti : sites et CRM sur mesure")}</span>
      </p>
      {/* Pause du défilement (WCAG 2.2.2) : case à cocher, sans JavaScript */}
      <label className="sites-band-pause">
        <input type="checkbox" />
        <span className="pause"><span aria-hidden="true">❚❚</span> {t(lang, "Pause")}</span>
        <span className="lecture"><span aria-hidden="true">▶</span> {t(lang, "Lecture")}</span>
      </label>
      <div className="sites-band-viewport">
        <ul className="sites-band-track">
          {Array.from({ length: COPIES }).flatMap((_, copie) =>
            BANDE.map((s) => {
              const cachee = copie > 0;
              return (
                <li key={`${copie}-${s.cle}`} aria-hidden={cachee || undefined}>
                  <a
                    href={s.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-card"
                    tabIndex={cachee ? -1 : undefined}
                    aria-label={cachee ? undefined : s.label(lang)}
                  >
                    <span className="site-card-bar" aria-hidden="true">
                      <i /><i /><i />
                      <span>{t(lang, s.barre)}</span>
                    </span>
                    <Image
                      src={s.image}
                      alt={cachee ? '' : s.alt(lang)}
                      width={960}
                      height={555}
                      sizes="400px"
                      className="site-card-img"
                    />
                    <span className="site-card-nom">
                      {s.nom}
                      <span className="site-card-type">{t(lang, s.type)}</span>
                    </span>
                  </a>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <p className="sites-band-lien">
        <Link href={lienLangue(lang, '/realisations')}>{t(lang, "Toutes nos réalisations")} <span aria-hidden="true">→</span></Link>
      </p>
    </div>
  );
}
