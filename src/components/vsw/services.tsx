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
    desc: "Un assistant IA (un programme qui travaille pour vous) branché sur vos outils : il prépare les réponses aux questions de vos clients, trie vos documents et suit vos demandes. Vous validez ce qui part.",
    tags: ['ChatGPT', 'Claude', 'Clavardage client', 'Tri de documents'],
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
];

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">Services</div>
            <h2>Quatre façons<br />de vous simplifier la vie.</h2>
          </div>
          <p className="desc">
            Un seul but : mieux servir vos clients et vous redonner du temps. Pour y arriver, on
            automatise vos tâches répétitives, on installe des outils simples et on vous forme,
            du début à la fin.
          </p>
        </div>
        <div className="services-grid reveal">
          {SERVICES.map((s) => (
            <Link href={s.href} className="service" key={s.num} style={{ textDecoration: 'none' }}>
              <div className="service-num">{s.num} / 04</div>
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
