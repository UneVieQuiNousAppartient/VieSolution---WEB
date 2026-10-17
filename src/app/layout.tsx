import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './vsw.css';
import { VswNav } from '@/components/vsw/nav';
import { VswFooter } from '@/components/vsw/footer';
import { VswChatbot } from '@/components/vsw/chatbot';
import { TrackPageview } from '@/components/vsw/track-pageview';
import { NavScroll } from '@/components/vsw/nav-scroll';

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

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jbm',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Vie Solution Web — IA, automatisation & Zoho · Québec',
    template: '%s | Vie Solution Web',
  },
  description:
    "Automatisation des processus, agents IA, implantation Zoho et formation pour PME et travailleurs autonomes québécois. Une vie qui nous appartient dans la gestion de votre entreprise.",
  keywords: [
    'automatisation',
    'intelligence artificielle',
    'agents IA',
    'Zoho',
    'implantation Zoho',
    'formation IA',
    'PME',
    'Québec',
    'VieSolution',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    siteName: 'Vie Solution Web',
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
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <body>
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
