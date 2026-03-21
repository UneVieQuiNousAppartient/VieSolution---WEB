import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { FAQItem } from '@/types';

interface ServicePageLayoutProps {
  hero: { title: string; subtitle: string };
  problem: { title: string; items: string[] };
  solution: { title: string; description: string; features: string[] };
  useCases: { title: string; items: { title: string; description: string }[] };
  benefits: string[];
  faq: FAQItem[];
}

export function ServicePageLayout({ hero, problem, solution, useCases, benefits, faq }: ServicePageLayoutProps) {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{hero.title}</h1>
          <p className="mt-4 text-lg text-gray-400">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnostic"><Button variant="glow" size="lg" className="gap-2">Diagnostic gratuit <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/contact"><Button variant="outline" size="lg">Nous contacter</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">{problem.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problem.items.map((item) => (
              <div key={item} className="flex gap-3 p-4 glass rounded-xl bg-red-500/5 border border-red-500/10">
                <span className="text-red-400 shrink-0">&#x2717;</span>
                <p className="text-sm text-gray-400">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">{solution.title}</h2>
          <p className="text-gray-400 mb-8">{solution.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solution.features.map((f) => (
              <div key={f} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">{useCases.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.items.map((item) => (
              <div key={item.title} className="glass rounded-xl p-5 card-hover">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-[#0d0d14] to-purple-600/10" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Les bénéfices concrets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 glass rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="glass rounded-xl group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-200 hover:text-white transition-colors text-sm">{item.question}</summary>
                <p className="px-6 pb-4 text-sm text-gray-500">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-purple-600/20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Prêt à passer à l&apos;action ?</h2>
          <p className="mt-4 text-gray-400">Discutons de votre projet et trouvons la solution adaptée.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg">Parler de mon projet</Button></Link>
            <Link href="/estimateur"><Button variant="outline" size="lg">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
