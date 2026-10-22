import { RevealInit } from '@/components/vsw/reveal-init';
import { Hero } from '@/components/vsw/hero';
import { PourVousSection } from '@/components/vsw/pour-vous-section';
import { AvantApresSection } from '@/components/vsw/avant-apres-section';
import { Services } from '@/components/vsw/services';
import { MetiersSection } from '@/components/vsw/metiers-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { ProcessSection } from '@/components/vsw/process-section';
import { PourquoiSection } from '@/components/vsw/pourquoi-section';
import { PartnersSection } from '@/components/vsw/partners-section';
import { Testimonials } from '@/components/vsw/testimonials';
import { FAQSection } from '@/components/vsw/faq-section';
import { CTASection } from '@/components/vsw/cta-section';

/*
 * Accueil (ordre validé par Camille le 2026-10-22, maquette 2) : votre problème → ce qui change →
 * ce qu'on fait → pour votre métier → comment on travaille → pourquoi nous → preuves → questions →
 * l'appel. « Pourquoi nous choisir », « La différence » et « Nos engagements » sont fusionnées dans
 * PourquoiSection ; « Stagiaires » reste sur /a-propos et /postuler-stagiaire (pied de page).
 */
export default function HomePage() {
  return (
    <>
      <RevealInit />
      <Hero />
      <PourVousSection />
      <AvantApresSection />
      <Services />
      <MetiersSection />
      <DemarrerSection variant="accueil" />
      <ProcessSection />
      <PourquoiSection />
      <PartnersSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
