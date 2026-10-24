import type { Metadata } from 'next';
import { RevealInit } from '@/components/vsw/reveal-init';
import { PageHeader } from '@/components/vsw/page-header';
import { Services } from '@/components/vsw/services';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { CTASection } from '@/components/vsw/cta-section';

/* Page principale du menu « Services » (refonte du 2026-10-23, maquette validée par Camille) :
   les 9 services en 3 piliers, chacun mène à sa page. Remplace l'ancienne page /services (ancien
   design, redirigée jusqu'ici vers l'accueil). */
export const metadata: Metadata = {
  title: 'Nos solutions',
  description:
    "Automatisation, assistants et accueil IA, implantation et formation Zoho, sites web, CRM sur mesure et référencement pour les PME et travailleurs autonomes du Québec.",
};

export default function ServicesPage() {
  return (
    <>
      <RevealInit />
      <PageHeader
        eyebrow="Services"
        title={
          <>
            Nos solutions,<br />en trois piliers.
          </>
        }
        lede="IA et automatisation, Zoho, web et visibilité : on choisit les bons outils, on les installe et on vous forme. On s'occupe de la technique."
      />
      <Services />
      <DemarrerSection variant="accueil" />
      <CTASection />
    </>
  );
}
