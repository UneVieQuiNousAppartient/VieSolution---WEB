import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { AISection } from '@/components/vsw/ai-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'Intelligence artificielle',
  description:
    "Automatisation des processus, assistants IA sur mesure et formation à l'IA pour PME et travailleurs autonomes québécois.",
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
        lede="Un assistant IA bien réglé, des tâches qui se font toutes seules, et une formation pour être à l'aise. Trois façons d'utiliser l'IA dans votre quotidien — même si vous n'êtes pas techno."
      />
      <DemarrerSection variant="ia" />
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
