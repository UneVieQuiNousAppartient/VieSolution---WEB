import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface SolutionPageLayoutProps {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
  };
  problems: string[];
  solutions: { title: string; description: string }[];
  benefits: string[];
  cta: {
    title: string;
    subtitle: string;
  };
}

export function SolutionPageLayout({ hero, problems, solutions, benefits, cta }: SolutionPageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            {hero.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">{hero.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/audit-gratuit">
              <Button size="lg" className="gap-2">Audit gratuit <ArrowRight className="w-4 h-4" /></Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Discuter de mon projet</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos défis au quotidien</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map((p) => (
              <div key={p} className="flex gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <span className="text-orange-500 shrink-0 mt-0.5">&#x26A0;</span>
                <p className="text-sm text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Nos solutions pour vous</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutions.map((s) => (
              <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Ce que vous allez gagner</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                <span className="text-blue-50">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">{cta.title}</h2>
          <p className="mt-4 text-blue-100">{cta.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/audit-gratuit">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Demander un audit gratuit</Button>
            </Link>
            <Link href="/estimateur">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Estimer mon projet</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
