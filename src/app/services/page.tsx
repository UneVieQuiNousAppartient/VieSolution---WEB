import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Zap, Link as LinkIcon, Layout, Settings, Wrench } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Développement web, automatisation, intégration API, applications sur mesure et outils internes pour votre entreprise.',
};

const services = [
  { title: 'Développement web', description: 'Sites web professionnels, rapides et optimisés pour convertir vos visiteurs en clients.', icon: <Globe className="w-8 h-8" />, href: '/services/developpement-web' },
  { title: 'Automatisation des processus', description: 'Éliminez les tâches répétitives et gagnez des heures chaque semaine.', icon: <Zap className="w-8 h-8" />, href: '/services/automatisation' },
  { title: 'Intégration API', description: 'Connectez vos outils entre eux pour un flux de travail unifié.', icon: <LinkIcon className="w-8 h-8" />, href: '/services/integration-api' },
  { title: 'Applications web sur mesure', description: 'Des applications conçues pour répondre exactement à vos besoins métier.', icon: <Layout className="w-8 h-8" />, href: '/services/applications-web' },
  { title: 'Outils internes', description: 'Tableaux de bord et solutions internes pour optimiser vos opérations.', icon: <Settings className="w-8 h-8" />, href: '/services/outils-internes' },
  { title: 'Maintenance et évolution', description: 'Accompagnement continu pour garder vos solutions à jour et performantes.', icon: <Wrench className="w-8 h-8" />, href: '/contact' },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Nos services</h1>
          <p className="mt-4 text-lg text-gray-600">Des solutions complètes pour digitaliser et automatiser votre activité.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-blue-600 mb-4">{s.icon}</div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">{s.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{s.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-4 font-medium">En savoir plus <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Besoin d&apos;un service sur mesure ?</h2>
          <p className="mt-4 text-blue-100">Chaque projet est unique. Parlons de vos besoins.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Nous contacter</Button></Link>
            <Link href="/audit-gratuit"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Audit gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
