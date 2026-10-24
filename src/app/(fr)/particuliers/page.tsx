import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Globe, Zap, PiggyBank, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="text-gray-300">Particuliers</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Des services numériques simples pour vous</h1>
          <p className="mt-4 text-lg text-gray-400">Pas besoin d&apos;être une entreprise pour bénéficier du numérique. Nous créons des solutions accessibles pour les particuliers.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg" className="gap-2">Discuter de mon projet <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/estimateur"><Button variant="outline" size="lg">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Nos services pour particuliers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group flex gap-4 p-6 glass rounded-2xl hover:border-white/10 transition-all">
                <div className="text-blue-400 shrink-0">{s.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{s.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-400 mt-3 font-medium">En savoir plus <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Simple, clair, sans jargon technique</h2>
          <p className="mt-4 text-gray-400">Nous parlons votre langage. Pas de termes compliqués, juste des solutions qui fonctionnent. Vous nous dites ce dont vous avez besoin, nous nous occupons du reste.</p>
        </div>
      </section>
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Prêt à démarrer votre projet ?</h2>
          <p className="mt-4 text-gray-400">Contactez-nous pour en discuter. C&apos;est gratuit et sans engagement.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg">Nous contacter</Button></Link>
            <Link href="/estimateur"><Button variant="outline" size="lg">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
