import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono, Caveat } from 'next/font/google';
import './globals.css';
import './vsw.css';
import { VswNav } from '@/components/vsw/nav';
import { VswFooter } from '@/components/vsw/footer';
import { VswChatbot } from '@/components/vsw/chatbot';
import { TrackPageview } from '@/components/vsw/track-pageview';
import { NavScroll } from '@/components/vsw/nav-scroll';
import { JsonLd } from '@/components/vsw/json-ld';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/* Fiche d'entreprise pour Google et les assistants IA. Aucune coordonnée : courriel et téléphone
   du site sont encore des exemples [à confirmer] (CLAUDE.md). */
const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  slogan: 'Une vie qui nous appartient',
  description:
    "Studio québécois : automatisation des tâches, assistants IA, installation de Claude ou ChatGPT, implantation Zoho, CRM et outils sur mesure, sites et applications web, référencement (SEO et AEO) et formation, pour les PME, les travailleurs autonomes et les professionnels.",
  areaServed: { '@type': 'AdministrativeArea', name: 'Québec' },
  availableLanguage: 'fr-CA',
  knowsAbout: [
    'Automatisation des processus',
    'Intelligence artificielle',
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vie Solution Web — IA, automatisation & Zoho · Québec',
    template: '%s | Vie Solution Web',
  },
  description:
    "Automatisation des processus, agents IA, sites et applications web, référencement SEO et AEO, implantation Zoho et formation pour PME et travailleurs autonomes québécois. Une vie qui nous appartient dans la gestion de votre entreprise.",
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
    locale: 'fr_CA',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="fr-CA"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} ${fontHand.variable}`}
    >
      <body>
        <JsonLd data={ORGANISATION} />
        <TrackPageview />
        <NavScroll />
        <VswNav />
        <main>{children}</main>
        <VswFooter />
        <VswChatbot />
      </body>
    </html>
  );
}
