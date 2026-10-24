import type { Metadata } from 'next';
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
import { alternates, t, type Lang } from '@/lib/i18n';

/*
 * Accueil (refonte du 2026-10-23, ordre donné par Camille, maquette validée) : hero et bande « Ce qu'on a
 * déjà bâti » → nos solutions (3 piliers) → la vidéo « En 1 minute » → « C'est pour vous si… » → démarrer
 * → comment on travaille → pourquoi nous → ils nous font confiance → témoignages → questions → l'appel.
 * En français (app/(fr)/page.tsx) et en anglais (app/en/page.tsx, étape 1).
 */
export const metaAccueil = (lang: Lang): Metadata =>
  lang === 'en'
    ? {
        title: { absolute: t(lang, "Vie Solution Web — IA, automatisation & Zoho · Québec") },
        description: t(lang, "Automatisation des processus, agents IA, sites et applications web, référencement SEO et AEO, implantation Zoho et formation pour PME et travailleurs autonomes québécois. Une vie qui vous appartient, des clients mieux servis, plus vite."),
        alternates: { canonical: '/en', ...alternates('/') },
      }
    : { alternates: { canonical: '/', ...alternates('/') } };

export function PageAccueil({ lang }: { lang: Lang }) {
  return (
    <>
      <RevealInit />
      <Hero lang={lang} />
      <Services lang={lang} />
      <VideoSection lang={lang} />
      <PourVousSection lang={lang} />
      <DemarrerSection variant="accueil" lang={lang} />
      <ProcessSection lang={lang} />
      <PourquoiSection lang={lang} />
      <PartnersSection lang={lang} />
      <Testimonials lang={lang} />
      <FAQSection lang={lang} />
      <CTASection lang={lang} />
    </>
  );
}
