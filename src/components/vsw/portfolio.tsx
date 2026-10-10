/* Cas d'usage types — exemples illustratifs [à confirmer / remplacer par de vrais mandats] */
const PROJECTS = [
  {
    tag: 'Zoho + IA',
    title: 'PME de services',
    desc: 'Zoho CRM + facturation et relances automatisées',
    span: 3,
    label: '[ zoho crm · dashboard ]',
  },
  {
    tag: 'Automatisation',
    title: 'Cabinet comptable',
    desc: 'Workflow de traitement de factures assisté par IA',
    span: 3,
    label: '[ flow · diagram ]',
  },
  {
    tag: 'Agent IA',
    title: 'Commerce local',
    desc: 'Chatbot de qualification + prise de RDV automatique',
    span: 2,
    label: '[ agent · chat ]',
  },
  {
    tag: 'Formation',
    title: 'Équipe terrain',
    desc: "Ateliers IA au quotidien + adoption de Zoho Desk",
    span: 2,
    label: '[ formation · atelier ]',
  },
  {
    tag: 'Implantation Zoho',
    title: 'Travailleur autonome',
    desc: 'Gestion complète : CRM, soumissions, comptabilité',
    span: 2,
    label: '[ zoho books · mobile ]',
  },
];

export function Portfolio({ showHead = true }: { showHead?: boolean }) {
  return (
    <section id="realisations" className="section">
      <div className="container">
        {showHead && (
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Cas d&apos;usage</div>
              <h2>Ce qu&apos;on peut<br />bâtir ensemble.</h2>
            </div>
            <p className="desc">
              Des exemples concrets de mandats IA et Zoho pour des entreprises québécoises
              de toutes tailles.
            </p>
          </div>
        )}
        <div className="portfolio-grid reveal">
          {PROJECTS.map((p, i) => (
            <div key={i} className={`project span-${p.span}`}>
              <div className="project-image" data-label={p.label}></div>
              <div className="project-info">
                <div className="tag">{p.tag}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
