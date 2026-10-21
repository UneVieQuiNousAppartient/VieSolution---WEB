import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { ServiceDetailSection } from '@/components/vsw/service-detail-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Référencement SEO et AEO',
  description:
    "Être trouvé sur Google (SEO) et cité par les assistants IA comme ChatGPT, Claude ou Perplexity (AEO) : pages claires, fiche d'entreprise et questions fréquentes, pour PME québécoises.",
};

export default function ReferencementPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="SEO et AEO"
        title={
          <>
            Être trouvé sur Google<br />et par les IA.
          </>
        }
        lede="Quand un client cherche votre métier, il demande à Google, mais aussi à ChatGPT, Claude ou Perplexity. On rend votre site clair pour les deux."
      />
      <ServiceDetailSection
        id="seo-aeo"
        eyebrow="Ce qu'on fait"
        titre="Un site que les machines comprennent."
        accroche="Et que vos clients trouvent."
        intro="Le SEO vous aide à être trouvé sur Google. L'AEO (optimisation pour les moteurs de réponses) aide votre entreprise à être citée quand quelqu'un pose une question à un assistant IA. On travaille les deux."
        piliers={[
          {
            titre: 'SEO : être trouvé sur Google',
            desc: "Des pages claires sur ce que vous faites, des titres et des descriptions soignés, et un plan du site que Google sait lire.",
            items: ['Pages claires', 'Titres et descriptions', 'Plan du site'],
          },
          {
            titre: 'AEO : être cité par les IA',
            desc: "Des réponses aux vraies questions de vos clients, écrites pour que ChatGPT, Claude, Perplexity et les réponses IA de Google puissent vous citer.",
            items: ['Réponses aux vraies questions', 'Résumé du site pour les IA', 'Informations lisibles par les machines'],
          },
          {
            titre: 'Votre fiche d’entreprise',
            desc: "Qui vous êtes et ce que vous faites, écrits de façon que Google et les IA les lisent sans se tromper.",
            items: ['Fiche d’entreprise', 'Questions fréquentes', 'Vos services, décrits clairement'],
          },
        ]}
        bandeau={
          <>
            Le même travail que sur notre propre site : <em>plan du site, fiche d&apos;entreprise et
            questions fréquentes</em> lisibles par Google et les IA.
          </>
        }
        boutonLibelle="Discuter de votre référencement"
        boutonLien="/rdv"
      />
      <CTASection
        text={
          <>
            Vos clients vous <em>trouvent-ils</em> ? On regarde votre site ensemble lors d&apos;un
            appel gratuit de 30 minutes.
          </>
        }
      />
    </>
  );
}
