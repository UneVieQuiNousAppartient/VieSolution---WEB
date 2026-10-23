import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Anciennes pages (ancien design) → nouvelles pages
      { source: '/services/chatbots-ia', destination: '/accueil-ia', permanent: true },
      { source: '/services/:path+', destination: '/ia', permanent: true },
      { source: '/solutions', destination: '/services', permanent: true },
      { source: '/solutions/:path*', destination: '/', permanent: true },
      { source: '/particuliers', destination: '/', permanent: true },
      { source: '/particuliers/:path*', destination: '/', permanent: true },
      { source: '/portfolio', destination: '/realisations', permanent: true },
      { source: '/estimateur', destination: '/devis', permanent: true },
      { source: '/prix', destination: '/devis', permanent: true },
      { source: '/audit-gratuit', destination: '/contact', permanent: true },
      { source: '/diagnostic', destination: '/ia', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      // Refonte du 2026-10-23 : l'offre de stage est sur la page Emplois
      { source: '/postuler-stagiaire', destination: '/emplois', permanent: true },
    ];
  },
};

export default nextConfig;
