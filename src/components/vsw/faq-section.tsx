import { JsonLd } from './json-ld';

const FAQS = [
  {
    q: "Est-ce que ça convient à un cabinet réglementé (finance, santé) ?",
    a: "Oui. On tient compte de vos obligations dès le départ : la conformité de votre secteur (par exemple l'AMF en finance) et la Loi 25 pour les renseignements personnels de vos clients. Ce qui engage votre jugement professionnel — un conseil, une réponse personnalisée, une note au dossier — n'est jamais envoyé sans votre validation. Vous décidez de ce qui peut partir seul, comme un simple rappel de rendez-vous.",
  },
  {
    q: "Mes clients vont-ils parler à un robot ?",
    a: "Non. L'outil prépare le travail : un brouillon de réponse, un rappel, un résumé de dossier. Vous relisez, vous ajustez, vous envoyez. Vos clients gardent le contact avec vous — simplement plus vite, et sans oubli.",
  },
  {
    q: "Je ne suis pas techno. Est-ce que c'est pour moi ?",
    a: "Oui. C'est justement pour vous. On s'occupe de la partie technique, et on vous explique le reste en mots simples. Si vous savez envoyer un courriel, vous êtes capable. On avance à votre rythme, et on reste là si vous bloquez.",
  },
  {
    q: "L'IA et Zoho, ce n'est pas pour les grosses compagnies ?",
    a: "Non. Ces outils sont aujourd'hui abordables et pensés aussi pour les petites entreprises et les travailleurs autonomes. Une petite équipe a même souvent plus à gagner : chaque heure sauvée compte. On adapte tout à votre taille.",
  },
  {
    q: "Ça doit coûter une fortune ?",
    a: "Pas nécessairement. On peut commencer par un premier pas simple, et en discuter à l'appel découverte gratuit. Le prix est toujours sur mesure, donné par écrit avant de commencer, sans frais cachés.",
  },
  {
    q: "Combien de temps ça va me demander ?",
    a: "Au départ, un appel de 30 minutes. Ensuite, on fait le gros du travail. On vous demande surtout de nous montrer comment vous travaillez et de participer à la formation. Le temps exact dépend du projet : on vous le dit clairement avant de commencer.",
  },
  {
    q: "Et si je veux juste commencer petit ?",
    a: "C'est souvent la meilleure idée. On choisit une seule chose — votre facturation, vos courriels, votre liste de clients — et on la règle. Vous voyez la différence, puis vous décidez de la suite. Aucune obligation d'aller plus loin.",
  },
  {
    q: "Combien de temps prend une implantation Zoho ?",
    a: "Tout dépend de la taille de votre entreprise et du nombre de modules. Une implantation de base (CRM + facturation) se fait généralement en 2 à 4 semaines ; une installation complète avec tâches automatiques et transfert de vos données peut prendre 6 à 9 semaines. On vous donne un échéancier clair dès le départ.",
  },
  {
    q: "Pourquoi Zoho plutôt qu'un autre outil ?",
    a: "Zoho couvre la gestion complète d'une entreprise (CRM, comptabilité, soutien client, marketing, RH) au même endroit, à une fraction du prix des grandes suites. Pour une PME québécoise, c'est souvent le meilleur rapport puissance-prix — et tout est relié, donc plus facile à automatiser.",
  },
  {
    q: "J'ai déjà un logiciel pour mes clients. Faut-il tout changer ?",
    a: "Non. On part de ce que vous avez. Si votre logiciel actuel fait l'affaire, on le garde et on le relie à vos autres outils. S'il vous manque des choses, on peut installer Zoho, ou vous bâtir un outil maison sur mesure. On choisit ensemble, selon votre façon de travailler et votre budget.",
  },
  {
    q: "C'est quoi l'AEO ?",
    a: "L'AEO (optimisation pour les moteurs de réponses) aide votre entreprise à être citée quand quelqu'un pose une question à un assistant IA comme ChatGPT, Claude ou Perplexity, ou dans les réponses IA de Google. C'est le prolongement du SEO, qui vous aide à être trouvé sur Google. On travaille les deux : un site clair, des réponses aux vraies questions de vos clients et des informations que les machines savent lire.",
  },
  {
    q: "L'IA, c'est vraiment utile pour une petite entreprise ?",
    a: "Oui — c'est même là que les gains sont les plus rapides : réponses aux courriels, relances clients, traitement de documents, soumissions, rapports. On commence par regarder comment vous travaillez pour repérer les tâches qui vous grugent le plus de temps, puis on automatise celles-là en premier.",
  },
  {
    q: "Que se passe-t-il après l'implantation ?",
    a: "On ne disparaît pas. Votre équipe est formée jusqu'à l'autonomie, et on reste disponibles pour le support, l'optimisation et l'ajout de nouvelles fonctions ou tâches automatiques à mesure que votre entreprise évolue.",
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
            <h2>Vos questions,<br />nos réponses franches.</h2>
          </div>
          <p className="desc">
            Une autre question ? Écrivez-nous ou réservez un appel découverte — on répond
            sous 24h ouvrables.
          </p>
        </div>
        {/* Mêmes questions et réponses que la liste visible (exigence de Google pour FAQPage). */}
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
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
