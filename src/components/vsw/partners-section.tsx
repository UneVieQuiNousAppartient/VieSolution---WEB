import { phrase, t, type Lang } from '@/lib/i18n';

type Partner = {
  name: string;
  url: string; // vide = pas de lien (adresse à confirmer)
  logo: string; // fichier dans public/partenaires/
  logoClair?: string; // variante pour fond clair (texte foncé), si le logo a du texte blanc
  hasLogo: boolean; // false = le nom s'affiche en texte tant que le fichier n'est pas déposé
  description: string;
};

const PARTNERS: Partner[] = [
  {
    // Nom, adresse et description relevés sur lesjusnaturelsbens.com le 2026-10-17.
    name: "Les Jus Naturels Ben's",
    url: 'https://lesjusnaturelsbens.com/',
    logo: '/partenaires/les-jus-naturels-bens.svg',
    hasLogo: true,
    description: phrase("Jus naturels artisanaux de Marieville, en ligne et dans les marchés publics."),
  },
  {
    // Nom, adresse et description relevés sur viesolution.ca le 2026-10-17.
    name: 'VieSolution',
    url: 'https://viesolution.ca/',
    logo: '/partenaires/viesolution.svg',
    logoClair: '/partenaires/viesolution-fonce.svg',
    hasLogo: true,
    description: phrase("Éducation financière indépendante pour les familles du Québec (Longueuil)."),
  },
  {
    // Nom, adresse et description relevés sur khisuccesacademique.com le 2026-10-17 (lien fourni par Camille).
    name: 'Khí Succès Académique',
    url: 'https://khisuccesacademique.com/',
    logo: '/partenaires/khi-succes-academique.png',
    logoClair: '/partenaires/khi-succes-academique-fonce.png',
    hasLogo: true,
    description: phrase("Tutorat individuel en ligne, du primaire au secondaire, partout au Québec."),
  },
];

function PartnerContent({ p, lang }: { p: Partner; lang: Lang }) {
  return (
    <>
      <div className="partner-logo">
        {p.hasLogo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logo} alt={p.name} loading="lazy" className="logo-sombre" />
            {p.logoClair && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoClair} alt="" aria-hidden="true" loading="lazy" className="logo-clair" />
            )}
          </>
        ) : (
          <span className="partner-name">{p.name}</span>
        )}
      </div>
      <p className="partner-desc">{t(lang, p.description)}</p>
    </>
  );
}

export function PartnersSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="partenaires" className="section section--band">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Ils nous font confiance")}</div>
            <h2>{t(lang, "Des entreprises d'ici")}<br />{t(lang, "nous ont fait confiance.")}</h2>
          </div>
          <p className="desc">
            {t(lang, "Des projets réels, livrés à des entreprises québécoises. Cliquez sur un logo pour visiter leur site.")}
          </p>
        </div>
        <div className="partners-grid reveal">
          {PARTNERS.map((p) =>
            p.url ? (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card"
                aria-label={t(lang, "{nom} (nouvel onglet)", { nom: p.name })}
              >
                <PartnerContent p={p} lang={lang} />
              </a>
            ) : (
              <div key={p.name} className="partner-card">
                <PartnerContent p={p} lang={lang} />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
