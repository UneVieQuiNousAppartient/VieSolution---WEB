// Enveloppe commune des pages (html, polices, menu, pied de page, bulle) — français (app/(fr)/layout.tsx)
// et anglais (app/en/layout.tsx, étape 1 de l'anglais). Deux mises en page racines : <html lang> juste dans les deux.
import type { Metadata } from 'next';
import { t, type Lang } from '@/lib/i18n';
import { Space_Grotesk, Inter, JetBrains_Mono, Caveat } from 'next/font/google';
import '@/app/globals.css';
import '@/app/vsw.css';
import { VswNav } from '@/components/vsw/nav';
import { VswFooter } from '@/components/vsw/footer';
import { VswChatbot } from '@/components/vsw/chatbot';
import { BarreAppel } from '@/components/vsw/barre-appel';
import { TrackPageview } from '@/components/vsw/track-pageview';
import { NavScroll } from '@/components/vsw/nav-scroll';
import { JsonLd } from '@/components/vsw/json-ld';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/* Fiche d'entreprise pour Google et les assistants IA. Sans coordonnées pour l'instant : courriel et
   téléphone (donnés par Camille le 2026-10-22) seront ajoutés ici avec son accord. */
const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  slogan: 'Une vie qui vous appartient, des clients mieux servis, plus vite',
  description:
    "Studio québécois : automatisation des tâches, assistants IA, installation de Claude ou ChatGPT, accueil IA (clavardage, prise de rendez-vous, agent vocal), implantation Zoho, CRM et outils sur mesure, sites et applications web, référencement (SEO et AEO) et formation, pour les PME, les travailleurs autonomes et les professionnels.",
  areaServed: { '@type': 'AdministrativeArea', name: 'Québec' },
  availableLanguage: 'fr-CA',
  knowsAbout: [
    'Automatisation des processus',
    'Intelligence artificielle',
    'Assistants de clavardage',
    'Agents vocaux',
    'Prise de rendez-vous en ligne',
    'Zoho',
    'CRM',
    'Sites web',
    'Applications web',
    'SEO',
    'AEO',
    'Formation à l’IA',
  ],
};

const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sg',
  display: 'swap',
});

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

/* Écriture manuscrite de la note « appel gratuit de 30 min » du hero (lot design Agnos). */
const fontHand = Caveat({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-hand-src',
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jbm',
  display: 'swap',
});

export const metaRacine = (lang: Lang): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: {
    default: t(lang, "Vie Solution Web — IA, automatisation & Zoho · Québec"),
    template: '%s | Vie Solution Web',
  },
  description: t(
    lang,
    "Automatisation des processus, agents IA, sites et applications web, référencement SEO et AEO, implantation Zoho et formation pour PME et travailleurs autonomes québécois. Une vie qui vous appartient, des clients mieux servis, plus vite.",
  ),
  keywords: [
    'automatisation',
    'intelligence artificielle',
    'agents IA',
    'Zoho',
    'implantation Zoho',
    'formation IA',
    'site web',
    'application web',
    'SEO',
    'AEO',
    'référencement',
    'PME',
    'Québec',
    'VieSolution',
  ],
  openGraph: {
    type: 'website',
    locale: lang === 'en' ? 'en_CA' : 'fr_CA',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
});

export function Racine({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang={lang === 'en' ? 'en-CA' : 'fr-CA'}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} ${fontHand.variable}`}
    >
      <body>
        <JsonLd data={ORGANISATION} />
        <TrackPageview />
        <NavScroll />
        <VswNav lang={lang} />
        <main>{children}</main>
        <VswFooter lang={lang} />
        <BarreAppel lang={lang} />
        <VswChatbot lang={lang} />
      </body>
    </html>
  );
}
