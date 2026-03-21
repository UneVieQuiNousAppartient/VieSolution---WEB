import Link from 'next/link';

const footerLinks = {
  services: [
    { label: 'Développement web', href: '/services/developpement-web' },
    { label: 'Automatisation', href: '/services/automatisation' },
    { label: 'Intégration IA', href: '/services/integration-ia' },
    { label: 'Applications web', href: '/services/applications-web' },
    { label: 'Diagnostic gratuit', href: '/diagnostic' },
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
    <footer className="bg-[#080810] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">V</span>
              </div>
              <span className="text-white font-bold">VieSolution</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Développement web, automatisation et solutions IA pour simplifier vos opérations.
            </p>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} VieSolution Web. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
