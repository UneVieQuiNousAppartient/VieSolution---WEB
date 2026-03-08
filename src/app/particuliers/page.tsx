import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Zap, PiggyBank, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';

export const metadata: Metadata = {
  title: 'Services pour particuliers',
  description: 'Sites personnels, automatisation, gestion de budget et outils sur mesure pour particuliers.',
};

const services = [
  { title: 'Sites personnels', description: 'Portfolio, site personnel ou page professionnelle pour votre présence en ligne.', icon: <Globe className="w-8 h-8" />, href: '/particuliers/sites-personnels' },
  { title: 'Automatisation personnelle', description: 'Automatisez vos tâches quotidiennes et organisez-vous mieux numériquement.', icon: <Zap className="w-8 h-8" />, href: '/particuliers/automatisation-personnelle' },
  { title: 'Gestion de budget', description: 'Tableaux de bord et outils simples pour mieux gérer vos finances.', icon: <PiggyBank className="w-8 h-8" />, href: '/particuliers/gestion-budget' },
  { title: 'Outils sur mesure', description: 'Petit outil web, formulaire ou tableau de suivi adapté à vos besoins.', icon: <Wrench className="w-8 h-8" />, href: '/particuliers/outils-sur-mesure' },
];

export default function ParticuliersPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">Particuliers</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Des services numériques simples pour vous</h1>
          <p className="mt-4 text-lg text-gray-600">Pas besoin d&apos;être une entreprise pour bénéficier du numérique. Nous créons des solutions accessibles pour les particuliers.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button size="lg" className="gap-2">Discuter de mon projet <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/estimateur"><Button variant="outline" size="lg">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionTitle title="Nos services pour particuliers" subtitle="Des solutions simples, claires et accessibles." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group flex gap-4 p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-blue-600 shrink-0">{s.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{s.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3 font-medium">En savoir plus <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Simple, clair, sans jargon technique</h2>
          <p className="mt-4 text-gray-600">Nous parlons votre langage. Pas de termes compliqués, juste des solutions qui fonctionnent. Vous nous dites ce dont vous avez besoin, nous nous occupons du reste.</p>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Prêt à démarrer votre projet ?</h2>
          <p className="mt-4 text-blue-100">Contactez-nous pour en discuter. C&apos;est gratuit et sans engagement.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Nous contacter</Button></Link>
            <Link href="/estimateur"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
