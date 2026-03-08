import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, UtensilsCrossed, Briefcase, ShoppingBag, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Solutions par secteur',
  description: 'Solutions numériques adaptées à votre secteur : PME, restaurants, consultants, commerces et startups.',
};

const solutions = [
  { title: 'PME', description: 'Centralisez vos outils, automatisez l\'administratif et concentrez-vous sur votre croissance.', icon: <Building2 className="w-10 h-10" />, href: '/solutions/pme' },
  { title: 'Restaurants', description: 'Gérez horaires, inventaire, fournisseurs et équipes avec des outils numériques adaptés.', icon: <UtensilsCrossed className="w-10 h-10" />, href: '/solutions/restaurants' },
  { title: 'Consultants', description: 'Automatisez votre CRM, vos suivis et votre tunnel de conversion.', icon: <Briefcase className="w-10 h-10" />, href: '/solutions/consultants' },
  { title: 'Commerces', description: 'Suivez vos clients, votre inventaire et optimisez vos processus de vente.', icon: <ShoppingBag className="w-10 h-10" />, href: '/solutions/commerces' },
  { title: 'Startups', description: 'Développez votre MVP rapidement avec une architecture prête à évoluer.', icon: <Rocket className="w-10 h-10" />, href: '/solutions/startups' },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Solutions par secteur</h1>
          <p className="mt-4 text-lg text-gray-600">Des solutions numériques adaptées aux défis spécifiques de votre industrie.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {solutions.map((s) => (
            <Link key={s.title} href={s.href} className="group flex flex-col sm:flex-row items-start gap-6 p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="text-blue-600 shrink-0">{s.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">{s.title}</h2>
                <p className="text-gray-600 mt-2">{s.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 shrink-0 self-center" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
