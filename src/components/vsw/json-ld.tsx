/**
 * Données structurées (schema.org, JSON-LD) : lues par Google et par les moteurs de réponses IA.
 * Contenu statique écrit dans le code (jamais une saisie de visiteur) ; « < » est échappé pour qu'aucun
 * texte ne puisse fermer la balise <script>.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
