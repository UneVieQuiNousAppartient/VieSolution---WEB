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
    desc: "Éliminez les tâches répétitives qui grugent vos journées. Audit de vos processus, automatisation de vos workflows, connexions entre vos outils, rapports et relances automatiques — propulsés par l'IA.",
    tags: ['Workflows', 'Agents IA', 'Intégrations', 'Rapports'],
    href: '/ia',
  },
  {
    num: '02',
    icon: 'code',
    title: 'Agents & intégrations IA',
    desc: "Des agents IA sur mesure branchés sur vos outils : assistants internes, chatbots clients, traitement de documents, suivi de leads. L'IA qui travaille pour vous, 24/7.",
    tags: ['Claude', 'ChatGPT', 'Chatbots', 'API'],
    href: '/ia',
  },
  {
    num: '03',
    icon: 'grid',
    title: 'Implantation Zoho',
    desc: "On installe et configure Zoho chez vous : CRM, facturation, soutien client, marketing. Vos données centralisées, vos processus connectés — une entreprise qui roule dans un seul écosystème.",
    tags: ['Zoho CRM', 'Books', 'Desk', 'Campaigns'],
    href: '/zoho',
  },
  {
    num: '04',
    icon: 'users',
    title: 'Formation IA & Zoho',
    desc: "On forme vos équipes — et la relève — à travailler concrètement avec l'IA et avec Zoho. Ateliers pratiques, cas d'usage réels, autonomie durable.",
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
            <h2>Quatre expertises<br />pour un même objectif.</h2>
          </div>
          <p className="desc">
            Automatiser, outiller et former : nous aidons les entreprises québécoises à
            reprendre la main sur leur gestion grâce à l&apos;IA et à l&apos;écosystème Zoho.
            Chaque mandat est traité avec rigueur, transparence et un accompagnement de
            bout en bout.
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
