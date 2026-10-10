import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { AISection } from '@/components/vsw/ai-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Intelligence artificielle',
  description:
    "Automatisation des processus, agents IA sur mesure et formation à l'IA pour PME et travailleurs autonomes québécois.",
};

export default function IAPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// Intelligence artificielle"
        title={
          <>
            L&apos;IA qui travaille<br />pour vous.
          </>
        }
        lede="Automatisation de vos processus, agents sur mesure branchés sur vos outils, et formation de vos équipes : trois volets pour intégrer l'IA concrètement dans votre quotidien."
      />
      <AISection />
      <CTASection
        text={
          <>
            Un irritant à <em>automatiser</em> ? On identifie les gains rapides lors d&apos;un
            appel gratuit de 30 minutes.
          </>
        }
        primaryLabel="Discuter d'un projet IA"
      />
    </>
  );
}
