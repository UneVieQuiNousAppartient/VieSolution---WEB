import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatWidget } from '@/components/chatbot/chat-widget';

export const metadata: Metadata = {
  title: {
    default: 'VieSolution Web | Développement web et automatisation',
    template: '%s | VieSolution Web',
  },
  description:
    'VieSolution Web conçoit des sites web, applications et automatisations pour simplifier vos opérations et accélérer votre croissance.',
  keywords: [
    'développement web',
    'automatisation',
    'application web',
    'PME',
    'intégration API',
    'site web professionnel',
    'VieSolution',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    siteName: 'VieSolution Web',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
