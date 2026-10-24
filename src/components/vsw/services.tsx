import Link from 'next/link';
import { Icon, type IconName } from './icon';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

/** Piliers des services (menu « Services », pied de page, accueil) : maquette validée par Camille le 2026-10-23. */
// Anglais : t(lang, pilier) — relevées par scripts/i18n.mjs : phrase("IA et automatisation") phrase("Zoho") phrase("Web et visibilité")
export const PILIERS = ['IA et automatisation', 'Zoho', 'Web et visibilité'] as const;
export type Pilier = (typeof PILIERS)[number];

export const SERVICES: {
  pilier: Pilier;
  icon: IconName;
  title: string;
  desc: string;
  tags: string[];
  href: string;
}[] = [
  {
    icon: 'bolt',
    pilier: 'IA et automatisation',
    title: phrase("Automatisation des processus"),
    desc: phrase("Vos journées, libérées des tâches répétitives. On regarde comment vous travaillez, puis on fait en sorte que les relances, les rapports et les copier-coller se fassent tout seuls."),
    tags: [phrase("Tâches automatiques"), phrase("Relances"), phrase("Liens entre vos outils"), phrase("Rapports")],
    href: '/ia',
  },
  {
    icon: 'code',
    pilier: 'IA et automatisation',
    title: phrase("Assistants IA sur mesure"),
    desc: phrase("On installe Claude ou ChatGPT pour votre équipe, prêts à l'emploi, ou on bâtit un assistant IA (un programme qui travaille pour vous) branché sur vos outils : il prépare les réponses à vos clients, trie vos documents et suit vos demandes. Vous validez ce qui part."),
    tags: [phrase("Installation de Claude"), phrase("ChatGPT"), phrase("Clavardage client"), phrase("Tri de documents")],
    href: '/ia',
  },
  {
    icon: 'phone',
    pilier: 'IA et automatisation',
    title: phrase("Accueil IA : clavardage, rendez-vous et voix"),
    desc: phrase("Un assistant de clavardage sur votre site, une prise de rendez-vous qui se fait toute seule, et un agent vocal qui répond au téléphone, prend les rendez-vous et les messages. Vos clients ont une réponse tout de suite."),
    tags: [phrase("Clavardage"), phrase("Prise de rendez-vous"), phrase("Agent vocal"), phrase("Rappels")],
    href: '/accueil-ia',
  },
  {
    icon: 'grid',
    pilier: 'Zoho',
    title: phrase("Implantation Zoho"),
    desc: phrase("On installe et règle Zoho chez vous : clients, factures, soutien, infolettres. Tout au même endroit, au lieu d'éparpillé dans plusieurs outils."),
    tags: [phrase("Zoho CRM (clients)"), phrase("Books (factures)"), phrase("Desk (soutien)"), phrase("Campaigns (infolettres)")],
    href: '/zoho',
  },
  {
    pilier: 'IA et automatisation',
    icon: 'users',
    title: phrase("Formation IA"),
    desc: phrase("On forme vos équipes à travailler concrètement avec l'IA. Ateliers pratiques, exemples tirés de votre métier, pour être autonome ensuite."),
    tags: [phrase("Ateliers"), phrase("Équipes"), phrase("Coaching")],
    href: '/ia#formation',
  },
  {
    pilier: 'Zoho',
    icon: 'users',
    title: phrase("Formation Zoho"),
    desc: phrase("On forme vos équipes à travailler concrètement avec Zoho. Ateliers pratiques, exemples tirés de votre métier, pour être autonome ensuite."),
    tags: [phrase("Ateliers"), phrase("Parcours par rôle"), phrase("Équipes")],
    href: '/zoho#formation',
  },
  {
    icon: 'globe',
    pilier: 'Web et visibilité',
    title: phrase("Sites et applications web"),
    desc: phrase("Un site clair qui donne confiance, une page pour lancer une offre, ou une application web pour vos clients et votre équipe. Bâti pour vous et relié à vos outils : formulaires, rendez-vous, carnet de clients."),
    tags: [phrase("Sites vitrines"), phrase("Pages de destination"), phrase("Applications web"), phrase("Formulaires reliés à vos outils")],
    href: '/sites-web',
  },
  {
    icon: 'layout',
    pilier: 'Web et visibilité',
    title: phrase("CRM et outils sur mesure"),
    desc: phrase("Votre façon de travailler vous est propre. Si aucun logiciel tout fait ne lui convient, on vous bâtit le vôtre : un carnet de clients maison, un formulaire, un tableau de suivi. Simple, à votre image, et relié à vos outils actuels."),
    tags: [phrase("CRM maison"), phrase("Outils internes"), phrase("Tableaux de suivi"), phrase("Liens avec vos outils")],
    href: '/crm-sur-mesure',
  },
  {
    icon: 'chat',
    pilier: 'Web et visibilité',
    title: phrase("Être trouvé sur Google et par les IA"),
    desc: phrase("Quand un client cherche votre métier, il demande à Google, mais aussi à ChatGPT, Claude ou Perplexity. On rend votre site clair pour les deux : des réponses aux vraies questions de vos clients, une fiche d'entreprise et des informations que les machines savent lire."),
    tags: [phrase("SEO (Google)"), phrase("AEO (assistants IA)"), phrase("Questions de vos clients"), phrase("Fiche d’entreprise")],
    href: '/referencement',
  },
];

/* Services en deux colonnes (lot design Agnos, 2026-10-21) : titre fixe à gauche, cartes
   empilées à droite dans un « plateau », icône en haut à droite. Refonte du 2026-10-23 : cartes
   rangées sous les 3 piliers ; numéros dans l'ordre d'affichage. Un seul bouton (l'appel). */
export function Services({ lang = 'fr' }: { lang?: Lang }) {
  // Numéros dans l'ordre d'affichage (par pilier), calculés avant le rendu.
  const ordre = PILIERS.flatMap((p) => SERVICES.filter((s) => s.pilier === p));
  const numero = (titre: string) => String(ordre.findIndex((s) => s.title === titre) + 1).padStart(2, '0');
  const groupes = PILIERS.map((p) => ({ pilier: p, cartes: ordre.filter((s) => s.pilier === p) }));
  const total = String(SERVICES.length).padStart(2, '0');
  return (
    <section id="services" className="section">
      <div className="container services-layout">
        <div className="services-intro reveal">
          <div className="eyebrow">{t(lang, "Nos solutions")}</div>
          <h2>{t(lang, "Neuf façons de vous")}<br />{t(lang, "simplifier la vie.")}</h2>
          <p className="desc">
            {t(lang, "Les logiciels existent déjà : Zoho, Claude et bien d'autres. Nous, on choisit les bons pour vous, on les installe, on les relie et on vous forme. Et quand rien n'existe, on le bâtit : votre site, votre CRM, vos outils.")}
          </p>
          <div className="services-actions">
            <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary btn-lg">
              {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="services-count" aria-hidden="true">01 — {total}</div>
        </div>
        <div className="tray services-stack reveal">
          {groupes.map(({ pilier, cartes }) => (
            <div className="svc-pilier" key={pilier}>
              <h3 className="svc-pilier-titre">{t(lang, pilier)}</h3>
              {cartes.map((s) => (
                  <Link href={lienLangue(lang, s.href)} className="svc-card" key={s.title}>
                    <div className="svc-card-head">
                      <h4>
                        <span className="svc-card-num">{numero(s.title)}</span>
                        {t(lang, s.title)}
                      </h4>
                      <span className="svc-card-icon" aria-hidden="true">
                        <Icon name={s.icon} size={18} />
                      </span>
                    </div>
                    <p>{t(lang, s.desc)}</p>
                    <div className="svc-card-tags">
                      {s.tags.map((tag) => (
                        <span key={tag} className="pill">{t(lang, tag)}</span>
                      ))}
                    </div>
                  </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
