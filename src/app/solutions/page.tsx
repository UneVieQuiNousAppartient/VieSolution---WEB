import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, UtensilsCrossed, Briefcase, ShoppingBag, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solutions par secteur',
  description: 'Solutions numériques et IA adaptées à votre secteur : PME, restaurants, consultants, commerces et startups.',
};

const solutions = [
  { title: 'PME', description: 'Centralisez vos outils, automatisez l\'administratif et intégrez l\'IA pour booster votre croissance.', icon: <Building2 className="w-10 h-10" />, href: '/solutions/pme' },
  { title: 'Restaurants', description: 'Gérez horaires, inventaire, fournisseurs et équipes avec des outils numériques adaptés.', icon: <UtensilsCrossed className="w-10 h-10" />, href: '/solutions/restaurants' },
  { title: 'Consultants', description: 'Automatisez votre CRM, vos suivis et votre tunnel de conversion avec l\'IA.', icon: <Briefcase className="w-10 h-10" />, href: '/solutions/consultants' },
  { title: 'Commerces', description: 'Suivez vos clients, votre inventaire et optimisez vos processus de vente.', icon: <ShoppingBag className="w-10 h-10" />, href: '/solutions/commerces' },
  { title: 'Startups', description: 'Développez votre MVP rapidement avec une architecture prête à évoluer et l\'IA intégrée.', icon: <Rocket className="w-10 h-10" />, href: '/solutions/startups' },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Solutions par secteur</h1>
          <p className="mt-4 text-lg text-gray-400">Des solutions numériques et IA adaptées aux défis spécifiques de votre industrie.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {solutions.map((s) => (
            <Link key={s.title} href={s.href} className="group flex flex-col sm:flex-row items-start gap-6 p-6 glass rounded-2xl hover:border-white/10 transition-all">
              <div className="text-blue-400 shrink-0">{s.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{s.title}</h2>
                <p className="text-gray-400 mt-2">{s.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 shrink-0 self-center transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
