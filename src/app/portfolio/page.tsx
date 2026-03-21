import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PORTFOLIO_PROJECTS } from '@/lib/constants/content';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Découvrez nos réalisations : sites web, applications, automatisations et outils internes pour entreprises.',
};

export default function PortfolioPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Nos réalisations</h1>
          <p className="mt-4 text-lg text-gray-400">Découvrez comment nous avons aidé nos clients à résoudre leurs défis numériques.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PORTFOLIO_PROJECTS.map((project) => (
              <div key={project.title} className="glass rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 h-48 flex items-center justify-center">
                  <span className="text-blue-400 font-semibold text-lg">{project.category}</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">{project.category}</span>
                  <h2 className="text-lg font-semibold text-white mt-3">{project.title}</h2>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Problème :</p>
                    <p className="text-sm text-gray-400">{project.problem}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 font-medium">Solution :</p>
                    <p className="text-sm text-gray-400">{project.solution}</p>
                  </div>
                  <div className="mt-3 space-y-1">
                    {project.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                        <span className="text-sm text-gray-400">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Votre projet pourrait être le prochain</h2>
          <p className="mt-4 text-gray-400">Discutons de vos besoins et voyons comment nous pouvons vous aider.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg">Nous contacter</Button></Link>
            <Link href="/diagnostic"><Button variant="outline" size="lg">Diagnostic gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
