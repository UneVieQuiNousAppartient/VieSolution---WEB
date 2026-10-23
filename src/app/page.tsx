import { RevealInit } from '@/components/vsw/reveal-init';
import { Hero } from '@/components/vsw/hero';
import { PourVousSection } from '@/components/vsw/pour-vous-section';
import { Services } from '@/components/vsw/services';
import { VideoSection } from '@/components/vsw/video-section';
import { DemarrerSection } from '@/components/vsw/demarrer-section';
import { ProcessSection } from '@/components/vsw/process-section';
import { PourquoiSection } from '@/components/vsw/pourquoi-section';
import { PartnersSection } from '@/components/vsw/partners-section';
import { Testimonials } from '@/components/vsw/testimonials';
import { FAQSection } from '@/components/vsw/faq-section';
import { CTASection } from '@/components/vsw/cta-section';

/*
 * Accueil (refonte du 2026-10-23, ordre donné par Camille, maquette validée) : hero inchangé et
 * bande « Ce qu'on a déjà bâti » → nos solutions (3 piliers) → la vidéo « En 1 minute » → « C'est pour vous si… » réunie
 * avec « Avant / après » et « Pour votre métier » → démarrer → comment on travaille → pourquoi
 * nous → ils nous font confiance → témoignages → questions → l'appel. Le programme de stage est
 * sur /emplois.
 */
export default function HomePage() {
  return (
    <>
      <RevealInit />
      <Hero />
      <Services />
      <VideoSection />
      <PourVousSection />
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
