import Link from 'next/link';
import { Icon } from './icon';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

const ZOHO_PILLARS = [
  {
    num: '01',
    title: phrase("Implantation sur mesure"),
    desc: phrase("On installe et configure Zoho directement chez vous : transfert de vos données, réglages selon votre façon de travailler, connexions avec vos outils existants."),
    items: [phrase("Analyse de vos besoins"), phrase("Réglages et transfert de données"), phrase("Tâches automatiques entre logiciels")],
  },
  {
    num: '02',
    title: phrase("Formation & adoption"),
    desc: phrase("Un outil ne vaut que s'il est utilisé. On forme votre équipe à travailler avec Zoho au quotidien, jusqu'à l'autonomie complète."),
    items: [phrase("Ateliers pratiques"), phrase("Parcours par rôle")],
  },
  {
    num: '03',
    title: phrase("Accompagnement continu"),
    desc: phrase("Après l'implantation, on reste là : support, amélioration continue, nouvelles fonctions et tâches automatiques à mesure que votre entreprise grandit."),
    items: [phrase("Support continu"), phrase("Amélioration continue"), phrase("Évolution par étapes")],
  },
];

/* Logiciels Zoho présentés par besoin (idée reprise de zoho.com, « Featured apps »).
   Descriptions en mots simples ; Bigin et Creator : d'après leur présentation sur zoho.com
   (« CRM pour les petites entreprises », « applications sur mesure »). Aucun logo Zoho. */
const ZOHO_APPS: { besoin: string; nom: string; desc: string }[] = [
  { besoin: phrase("Clients"), nom: 'Zoho CRM', desc: phrase("Vos clients, vos ventes et vos suivis au même endroit.") },
  { besoin: phrase("Clients, en simple"), nom: 'Bigin', desc: phrase("Un carnet de clients léger, pensé pour les petites entreprises.") },
  { besoin: phrase("Facturation"), nom: 'Zoho Books', desc: phrase("Vos factures, vos dépenses et votre comptabilité.") },
  { besoin: phrase("Service client"), nom: 'Zoho Desk', desc: phrase("Les demandes de vos clients, chacune suivie jusqu’à sa réponse.") },
  { besoin: phrase("Marketing"), nom: 'Zoho Campaigns', desc: phrase("Vos infolettres et vos courriels à toute votre clientèle.") },
  { besoin: phrase("Stock"), nom: 'Zoho Inventory', desc: phrase("Votre inventaire et vos commandes, à jour.") },
  { besoin: phrase("Équipe"), nom: 'Zoho People', desc: phrase("Vos employés : congés, horaires et dossiers.") },
  { besoin: phrase("Projets"), nom: 'Zoho Projects', desc: phrase("Vos projets, vos tâches et vos échéances.") },
  { besoin: phrase("Sur mesure"), nom: 'Zoho Creator', desc: phrase("Une application faite pour vous, sans tout programmer.") },
  { besoin: phrase("Liens"), nom: 'Zoho Flow', desc: phrase("Vos logiciels qui se parlent, tout seuls.") },
];

export function ZohoSection({ lang = 'fr' }: { lang?: Lang }) {
  return (
    <section id="zoho" className="section">
      <div className="container">
        <div className="zoho-wrap reveal">
          <div className="ai-top">
            <div>
              <div className="eyebrow">{t(lang, "Les outils Zoho")}</div>
              <h2>
                {t(lang, "Votre gestion, centralisée.")}<br />
                <span className="glow">{t(lang, "Zoho, implanté chez vous.")}</span>
              </h2>
            </div>
            <div>
              <p>
                {t(lang, "CRM, facturation, soutien client, marketing, inventaire : Zoho réunit toute la gestion de votre entreprise dans une seule plateforme abordable (des logiciels qui se parlent).")}
              </p>
              <p className="zoho-positionnement">
                <strong>{t(lang, "Zoho fait les logiciels. Nous, on les fait marcher chez vous :")}</strong> {t(lang, "on choisit les bons, on les règle selon votre façon de travailler et on forme votre équipe pour qu'elle en garde le contrôle.")}
              </p>
            </div>
          </div>

          <div className="zoho-catalog" aria-label={t(lang, "Les logiciels Zoho, par besoin")}>
            {ZOHO_APPS.map((a) => (
              <div className="zoho-card" key={a.nom}>
                <div className="zoho-card-besoin">{t(lang, a.besoin)}</div>
                <h3>{a.nom}</h3>
                <p>{t(lang, a.desc)}</p>
              </div>
            ))}
          </div>

          <div className="ai-pillars">
            {ZOHO_PILLARS.map((p) => (
              <div className="ai-pillar" key={p.num} id={p.num === '02' ? 'formation' : undefined}>
                <div className="ai-pillar-num">{t(lang, "{num} · Volet", { num: p.num })}</div>
                <h4>{t(lang, p.title)}</h4>
                <p>{t(lang, p.desc)}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{t(lang, it)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ai-banner">
            <div className="ai-banner-text">
              <em>{t(lang, "Une vie qui vous appartient")}</em> {t(lang, "— reprenez la main sur la gestion de votre entreprise, avec des outils que vous maîtrisez.")}
            </div>
            <Link href={lienLangue(lang, APPEL.href)} className="btn btn-primary btn-lg">
              {t(lang, APPEL.libelle)} <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
