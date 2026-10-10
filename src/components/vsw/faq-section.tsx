const FAQS = [
  {
    q: "Combien de temps prend une implantation Zoho ?",
    a: "Tout dépend de la taille de votre entreprise et du nombre de modules. Une implantation de base (CRM + facturation) se fait généralement en 2 à 4 semaines ; un écosystème complet avec automatisations et migration de données peut prendre 6 à 9 semaines. On vous donne un échéancier clair dès l'audit.",
  },
  {
    q: "Pourquoi Zoho plutôt qu'un autre outil ?",
    a: "Zoho couvre la gestion complète d'une entreprise (CRM, comptabilité, soutien client, marketing, RH) dans un seul écosystème, à une fraction du prix des grandes suites. Pour une PME québécoise, c'est souvent le meilleur rapport puissance-prix — et tout est connecté, donc automatisable.",
  },
  {
    q: "L'IA, c'est vraiment utile pour une petite entreprise ?",
    a: "Oui — c'est même là que les gains sont les plus rapides : réponses aux courriels, relances clients, traitement de documents, soumissions, rapports. On commence par un audit pour identifier les tâches qui vous grugent le plus de temps, puis on automatise celles-là en premier.",
  },
  {
    q: "Que se passe-t-il après l'implantation ?",
    a: "On ne disparaît pas. Votre équipe est formée jusqu'à l'autonomie, et on reste disponibles pour le support, l'optimisation et l'ajout de nouveaux modules ou automatisations à mesure que votre entreprise évolue.",
  },
  {
    q: "Et mes données dans tout ça ?",
    a: "Vos données vous appartiennent. On configure les accès et les consentements selon les bonnes pratiques et les exigences québécoises (Loi 25), et on vous explique clairement où vos données sont hébergées et qui y a accès.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2>Les questions<br />qu&apos;on nous pose.</h2>
          </div>
          <p className="desc">
            Une autre question ? Écrivez-nous ou réservez un appel découverte — on répond
            sous 24h ouvrables.
          </p>
        </div>
        <div className="faq-list reveal">
          {FAQS.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.q}</summary>
              <div className="faq-body">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
