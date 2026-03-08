import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Solutions web sur mesure
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
          Développement web et automatisation pour{' '}
          <span className="text-blue-600">faire gagner du temps</span> à votre entreprise
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          VieSolution Web conçoit des sites, applications et automatisations pour simplifier
          vos opérations et accélérer votre croissance.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/audit-gratuit">
            <Button size="lg" className="gap-2">
              Obtenir un audit gratuit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/estimateur">
            <Button variant="outline" size="lg">
              Estimer mon projet
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="lg" className="gap-2">
              <MessageCircle className="w-4 h-4" /> Discuter avec nous
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
