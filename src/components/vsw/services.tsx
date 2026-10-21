import Link from 'next/link';
import { Icon, type IconName } from './icon';

const SERVICES: {
  num: string;
  icon: IconName;
  title: string;
  desc: string;
  tags: string[];
  href: string;
}[] = [
  {
    num: '01',
    icon: 'bolt',
    title: 'Automatisation des processus',
    desc: "Fini les tâches répétitives qui grugent vos journées. On regarde comment vous travaillez, puis on fait en sorte que les relances, les rapports et les copier-coller se fassent tout seuls.",
    tags: ['Tâches automatiques', 'Relances', 'Liens entre vos outils', 'Rapports'],
    href: '/ia',
  },
  {
    num: '02',
    icon: 'code',
    title: 'Assistants IA sur mesure',
    desc: "On installe Claude ou ChatGPT pour votre équipe, prêts à l'emploi, ou on bâtit un assistant IA (un programme qui travaille pour vous) branché sur vos outils : il prépare les réponses à vos clients, trie vos documents et suit vos demandes. Vous validez ce qui part.",
    tags: ['Installation de Claude', 'ChatGPT', 'Clavardage client', 'Tri de documents'],
    href: '/ia',
  },
  {
    num: '03',
    icon: 'grid',
    title: 'Implantation Zoho',
    desc: "On installe et règle Zoho chez vous : clients, factures, soutien, infolettres. Tout au même endroit, au lieu d'éparpillé dans plusieurs outils.",
    tags: ['Zoho CRM (clients)', 'Books (factures)', 'Desk (soutien)', 'Campaigns (infolettres)'],
    href: '/zoho',
  },
  {
    num: '04',
    icon: 'users',
    title: 'Formation IA & Zoho',
    desc: "On forme vos équipes — et la relève — à travailler concrètement avec l'IA et avec Zoho. Ateliers pratiques, exemples tirés de votre métier, pour être autonome ensuite.",
    tags: ['Ateliers', 'Équipes', 'Relève', 'Coaching'],
    href: '/ia#formation',
  },
  {
    num: '05',
    icon: 'globe',
    title: 'Sites et applications web',
    desc: "Un site clair qui donne confiance, une page pour lancer une offre, ou une application web pour vos clients et votre équipe. Bâti pour vous et relié à vos outils : formulaires, rendez-vous, carnet de clients.",
    tags: ['Sites vitrines', 'Pages de destination', 'Applications web', 'Formulaires reliés à vos outils'],
    href: '/contact',
  },
  {
    num: '06',
    icon: 'layout',
    title: 'CRM et outils sur mesure',
    desc: "Quand aucun logiciel tout fait ne colle à votre façon de travailler, on vous bâtit le vôtre : un carnet de clients maison, un formulaire, un tableau de suivi. Simple, à votre image, et relié à vos outils actuels.",
    tags: ['CRM maison', 'Outils internes', 'Tableaux de suivi', 'Liens avec vos outils'],
    href: '/devis#situation',
  },
  {
    num: '07',
    icon: 'chat',
    title: 'Être trouvé sur Google et par les IA',
    desc: "Quand un client cherche votre métier, il demande à Google, mais aussi à ChatGPT, Claude ou Perplexity. On rend votre site clair pour les deux : des réponses aux vraies questions de vos clients, une fiche d'entreprise et des informations que les machines savent lire.",
    tags: ['SEO (Google)', 'AEO (assistants IA)', 'Questions de vos clients', 'Fiche d’entreprise'],
    href: '/contact',
  },
];

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head section-head--split reveal">
          <div>
            <div className="eyebrow">Services</div>
            <h2>Sept façons<br />de vous simplifier la vie.</h2>
          </div>
          <p className="desc">
            Les logiciels existent déjà : Zoho, Claude et bien d&apos;autres. Nous, on choisit les
            bons pour vous, on les installe, on les relie et on vous forme. Et quand rien
            n&apos;existe, on le bâtit&nbsp;: votre site, votre CRM, vos outils.
          </p>
        </div>
        <div className="services-grid reveal">
          {SERVICES.map((s) => (
            <Link href={s.href} className="service" key={s.num} style={{ textDecoration: 'none' }}>
              <div className="service-num">{s.num} / {String(SERVICES.length).padStart(2, '0')}</div>
              <div className="service-icon">
                <Icon name={s.icon} size={22} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span key={t} className="service-tag">{t}</span>
                ))}
              </div>
              <div className="service-arrow"><Icon name="arrow" size={18} /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
