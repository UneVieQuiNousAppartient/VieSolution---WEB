import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Zap, Link as LinkIcon, Layout, Settings, Wrench, Brain, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Développement web, automatisation, intégration API, IA, chatbots et outils internes pour votre entreprise.',
};

const services = [
  { title: 'Développement web', description: 'Sites web professionnels, rapides et optimisés pour convertir vos visiteurs en clients.', icon: <Globe className="w-8 h-8" />, href: '/services/developpement-web' },
  { title: 'Automatisation des processus', description: 'Éliminez les tâches répétitives et gagnez des heures chaque semaine.', icon: <Zap className="w-8 h-8" />, href: '/services/automatisation' },
  { title: 'Intégration API', description: 'Connectez vos outils entre eux pour un flux de travail unifié.', icon: <LinkIcon className="w-8 h-8" />, href: '/services/integration-api' },
  { title: 'Applications web sur mesure', description: 'Des applications conçues pour répondre exactement à vos besoins métier.', icon: <Layout className="w-8 h-8" />, href: '/services/applications-web' },
  { title: 'Outils internes', description: 'Tableaux de bord et solutions internes pour optimiser vos opérations.', icon: <Settings className="w-8 h-8" />, href: '/services/outils-internes' },
  { title: 'Intégration IA en entreprise', description: 'Installez l\'intelligence artificielle dans votre entreprise pour automatiser et optimiser.', icon: <Brain className="w-8 h-8" />, href: '/services/integration-ia' },
  { title: 'Chatbots & Assistants IA', description: 'Des chatbots intelligents pour votre service client, vos ventes et votre support interne.', icon: <MessageSquare className="w-8 h-8" />, href: '/services/chatbots-ia' },
  { title: 'Maintenance et évolution', description: 'Accompagnement continu pour garder vos solutions à jour et performantes.', icon: <Wrench className="w-8 h-8" />, href: '/contact' },
];

export default function ServicesPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Nos services</h1>
          <p className="mt-4 text-lg text-gray-400">Des solutions complètes pour digitaliser, automatiser et intégrer l&apos;IA dans votre activité.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group glass rounded-2xl p-6 hover:border-white/10 transition-all">
                <div className="text-blue-400 mb-4">{s.icon}</div>
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{s.title}</h2>
                <p className="text-sm text-gray-400 mt-2">{s.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-400 mt-4 font-medium">En savoir plus <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Besoin d&apos;un service sur mesure ?</h2>
          <p className="mt-4 text-gray-400">Chaque projet est unique. Parlons de vos besoins.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg">Nous contacter</Button></Link>
            <Link href="/diagnostic"><Button variant="outline" size="lg">Diagnostic gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
