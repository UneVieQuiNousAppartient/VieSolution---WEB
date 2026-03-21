import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface SolutionPageLayoutProps {
  hero: { title: string; subtitle: string; badge: string };
  problems: string[];
  solutions: { title: string; description: string }[];
  benefits: string[];
  cta: { title: string; subtitle: string };
}

export function SolutionPageLayout({ hero, problems, solutions, benefits, cta }: SolutionPageLayoutProps) {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block glass text-gray-300 px-4 py-1 rounded-full text-sm font-medium mb-4">{hero.badge}</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{hero.title}</h1>
          <p className="mt-4 text-lg text-gray-400">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnostic"><Button variant="glow" size="lg" className="gap-2">Diagnostic gratuit <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/contact"><Button variant="outline" size="lg">Discuter de mon projet</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Vos défis au quotidien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problems.map((p) => (
              <div key={p} className="flex gap-3 p-4 glass rounded-xl bg-orange-500/5 border border-orange-500/10">
                <span className="text-orange-400 shrink-0 mt-0.5">&#x26A0;</span>
                <p className="text-sm text-gray-400">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Nos solutions pour vous</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solutions.map((s) => (
              <div key={s.title} className="glass rounded-xl p-6 card-hover">
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-[#0d0d14] to-purple-600/10" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Ce que vous allez gagner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 glass rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-purple-600/20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">{cta.title}</h2>
          <p className="mt-4 text-gray-400">{cta.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnostic"><Button variant="glow" size="lg">Diagnostic gratuit</Button></Link>
            <Link href="/estimateur"><Button variant="outline" size="lg">Estimer mon projet</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
