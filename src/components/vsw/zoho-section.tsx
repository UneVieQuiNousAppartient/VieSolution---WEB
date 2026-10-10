import Link from 'next/link';
import { Icon } from './icon';

const ZOHO_PILLARS = [
  {
    num: '01',
    title: 'Implantation sur mesure',
    desc: "On installe et configure Zoho directement chez vous : migration de vos données, paramétrage selon vos processus, connexions avec vos outils existants.",
    items: ['Analyse de vos besoins', 'Configuration & migration', 'Automatisations entre apps'],
  },
  {
    num: '02',
    title: 'Formation & adoption',
    desc: "Un outil ne vaut que s'il est utilisé. On forme votre équipe — et la relève — à travailler avec Zoho au quotidien, jusqu'à l'autonomie complète.",
    items: ['Ateliers pratiques', 'Parcours par rôle', 'Formation de jeunes talents'],
  },
  {
    num: '03',
    title: 'Accompagnement continu',
    desc: "Après l'implantation, on reste là : support, optimisation des processus, nouveaux modules et automatisations à mesure que votre entreprise grandit.",
    items: ['Support continu', 'Optimisation des processus', 'Évolution par étapes'],
  },
];

const ZOHO_APPS = [
  'Zoho CRM',
  'Zoho Books',
  'Zoho Desk',
  'Zoho Campaigns',
  'Zoho Inventory',
  'Zoho People',
  'Zoho Projects',
  'Zoho Flow',
];

export function ZohoSection() {
  return (
    <section id="zoho" className="section">
      <div className="container">
        <div className="zoho-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{'// Écosystème Zoho'}</div>
              <h2>
                Votre gestion, centralisée.<br />
                <span className="glow">Zoho, implanté chez vous.</span>
              </h2>
            </div>
            <div>
              <p>
                CRM, facturation, soutien client, marketing, inventaire : Zoho réunit la
                gestion complète de votre entreprise dans un seul écosystème abordable.
                Nous l&apos;implantons chez nos clients, nous l&apos;adaptons à leurs processus et
                nous formons leurs équipes pour qu&apos;elles en gardent le contrôle.
              </p>
              <div className="zoho-apps">
                {ZOHO_APPS.map((a) => (
                  <span key={a} className="zoho-app">{a}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="ai-pillars">
            {ZOHO_PILLARS.map((p) => (
              <div className="ai-pillar" key={p.num}>
                <div className="ai-pillar-num">{p.num} · Volet</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              <em>Une vie qui nous appartient</em> — reprenez la main sur la gestion de
              votre business, avec des outils que vous maîtrisez.
            </div>
            <Link href="/rdv" className="btn btn-primary btn-lg">
              Discuter d&apos;un projet Zoho <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
