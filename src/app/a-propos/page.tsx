import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { About } from '@/components/vsw/about';
import { ProcessSection } from '@/components/vsw/process-section';
import { InternsSection } from '@/components/vsw/interns-section';
import { CTASection } from '@/components/vsw/cta-section';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    "Vie Solution Web : un studio québécois indépendant qui aide PME et travailleurs autonomes à reprendre le contrôle de leur gestion grâce à l'IA et à Zoho.",
};

export default function AProposPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="// À propos"
        title={
          <>
            Comprendre d&apos;abord,<br />bâtir ensuite.
          </>
        }
        lede="Un studio indépendant, basé au Québec, qui croit qu'une entreprise bien outillée appartient vraiment à ceux qui la font vivre."
      />
      <About />
      <ProcessSection />
      <InternsSection />
      <CTASection />
    </>
  );
}
