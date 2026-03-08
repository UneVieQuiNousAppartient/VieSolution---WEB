import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { FAQItem } from '@/types';

interface ServicePageLayoutProps {
  hero: {
    title: string;
    subtitle: string;
  };
  problem: {
    title: string;
    items: string[];
  };
  solution: {
    title: string;
    description: string;
    features: string[];
  };
  useCases: {
    title: string;
    items: { title: string; description: string }[];
  };
  benefits: string[];
  faq: FAQItem[];
}

export function ServicePageLayout({ hero, problem, solution, useCases, benefits, faq }: ServicePageLayoutProps) {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">{hero.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/audit-gratuit">
              <Button size="lg" className="gap-2">Obtenir un audit gratuit <ArrowRight className="w-4 h-4" /></Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Nous contacter</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{problem.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problem.items.map((item) => (
              <div key={item} className="flex gap-3 p-4 bg-red-50 rounded-xl">
                <span className="text-red-500 shrink-0">&#x2717;</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{solution.title}</h2>
          <p className="text-gray-600 mb-8">{solution.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {solution.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{useCases.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.items.map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Les bénéfices concrets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                <span className="text-blue-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details key={item.question} className="border border-gray-200 rounded-xl">
                <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                  {item.question}
                </summary>
                <p className="px-6 pb-4 text-sm text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Prêt à passer à l&apos;action ?</h2>
          <p className="mt-4 text-blue-100">Discutons de votre projet et trouvons la solution adaptée à vos besoins.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Parler de mon projet</Button>
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
