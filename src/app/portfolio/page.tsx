import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { PORTFOLIO_PROJECTS } from '@/lib/constants/content';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Découvrez nos réalisations : sites web, applications, automatisations et outils internes pour entreprises.',
};

export default function PortfolioPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Nos réalisations</h1>
          <p className="mt-4 text-lg text-gray-600">Découvrez comment nous avons aidé nos clients à résoudre leurs défis numériques.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PORTFOLIO_PROJECTS.map((project) => (
              <div key={project.title} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-48 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">{project.category}</span>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{project.category}</span>
                  <h2 className="text-lg font-semibold text-gray-900 mt-3">{project.title}</h2>
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 font-medium">Problème :</p>
                    <p className="text-sm text-gray-600">{project.problem}</p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 font-medium">Solution :</p>
                    <p className="text-sm text-gray-600">{project.solution}</p>
                  </div>
                  <div className="mt-3 space-y-1">
                    {project.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-sm text-gray-700">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Votre projet pourrait être le prochain</h2>
          <p className="mt-4 text-blue-100">Discutons de vos besoins et voyons comment nous pouvons vous aider.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Nous contacter</Button></Link>
            <Link href="/audit-gratuit"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Audit gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
