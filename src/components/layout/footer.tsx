import Link from 'next/link';

const footerLinks = {
  services: [
    { label: 'Développement web', href: '/services/developpement-web' },
    { label: 'Automatisation', href: '/services/automatisation' },
    { label: 'Intégration API', href: '/services/integration-api' },
    { label: 'Applications web', href: '/services/applications-web' },
    { label: 'Outils internes', href: '/services/outils-internes' },
  ],
  solutions: [
    { label: 'PME', href: '/solutions/pme' },
    { label: 'Restaurants', href: '/solutions/restaurants' },
    { label: 'Consultants', href: '/solutions/consultants' },
    { label: 'Commerces', href: '/solutions/commerces' },
    { label: 'Startups', href: '/solutions/startups' },
  ],
  entreprise: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Prix', href: '/prix' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
    { label: 'Conditions d\'utilisation', href: '/conditions-utilisation' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">VieSolution Web</h3>
            <p className="text-sm mb-4">
              Développement web et automatisation pour simplifier vos opérations et accélérer votre croissance.
            </p>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VieSolution Web. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
