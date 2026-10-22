import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';

const ZOHO_PILLARS = [
  {
    num: '01',
    title: 'Implantation sur mesure',
    desc: "On installe et configure Zoho directement chez vous : transfert de vos données, réglages selon votre façon de travailler, connexions avec vos outils existants.",
    items: ['Analyse de vos besoins', 'Réglages et transfert de données', 'Tâches automatiques entre logiciels'],
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
    desc: "Après l'implantation, on reste là : support, amélioration continue, nouvelles fonctions et tâches automatiques à mesure que votre entreprise grandit.",
    items: ['Support continu', 'Amélioration continue', 'Évolution par étapes'],
  },
];

/* Logiciels Zoho présentés par besoin (idée reprise de zoho.com, « Featured apps »).
   Descriptions en mots simples ; Bigin et Creator : d'après leur présentation sur zoho.com
   (« CRM pour les petites entreprises », « applications sur mesure »). Aucun logo Zoho. */
const ZOHO_APPS: { besoin: string; nom: string; desc: string }[] = [
  { besoin: 'Clients', nom: 'Zoho CRM', desc: 'Vos clients, vos ventes et vos suivis au même endroit.' },
  { besoin: 'Clients, en simple', nom: 'Bigin', desc: 'Un carnet de clients léger, pensé pour les petites entreprises.' },
  { besoin: 'Facturation', nom: 'Zoho Books', desc: 'Vos factures, vos dépenses et votre comptabilité.' },
  { besoin: 'Service client', nom: 'Zoho Desk', desc: 'Les demandes de vos clients, chacune suivie jusqu’à sa réponse.' },
  { besoin: 'Marketing', nom: 'Zoho Campaigns', desc: 'Vos infolettres et vos courriels à toute votre clientèle.' },
  { besoin: 'Stock', nom: 'Zoho Inventory', desc: 'Votre inventaire et vos commandes, à jour.' },
  { besoin: 'Équipe', nom: 'Zoho People', desc: 'Vos employés : congés, horaires et dossiers.' },
  { besoin: 'Projets', nom: 'Zoho Projects', desc: 'Vos projets, vos tâches et vos échéances.' },
  { besoin: 'Sur mesure', nom: 'Zoho Creator', desc: 'Une application faite pour vous, sans tout programmer.' },
  { besoin: 'Liens', nom: 'Zoho Flow', desc: 'Vos logiciels qui se parlent, tout seuls.' },
];

export function ZohoSection() {
  return (
    <section id="zoho" className="section">
      <div className="container">
        <div className="zoho-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{'Les outils Zoho'}</div>
              <h2>
                Votre gestion, centralisée.<br />
                <span className="glow">Zoho, implanté chez vous.</span>
              </h2>
            </div>
            <div>
              <p>
                CRM, facturation, soutien client, marketing, inventaire : Zoho réunit toute la
                gestion de votre entreprise dans une seule plateforme abordable (des logiciels
                qui se parlent).
              </p>
              <p className="zoho-positionnement">
                <strong>Zoho fait les logiciels. Nous, on les fait marcher chez vous&nbsp;:</strong> on
                choisit les bons, on les règle selon votre façon de travailler et on forme votre
                équipe pour qu&apos;elle en garde le contrôle.
              </p>
            </div>
          </div>

          <div className="zoho-catalog" aria-label="Les logiciels Zoho, par besoin">
            {ZOHO_APPS.map((a) => (
              <div className="zoho-card" key={a.nom}>
                <div className="zoho-card-besoin">{a.besoin}</div>
                <h3>{a.nom}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
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
              <em>Une vie qui vous appartient</em> — reprenez la main sur la gestion de
              votre entreprise, avec des outils que vous maîtrisez.
            </div>
            <Link href={APPEL.href} className="btn btn-primary btn-lg">
              {APPEL.libelle} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
