import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-bg grid-pattern py-24 sm:py-32">
      <div className="gradient-mesh absolute inset-0" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">Solutions web + IA pour votre entreprise</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto">
          <span className="text-white">Automatisez, digitalisez et</span>
          <br />
          <span className="gradient-text">boostez votre entreprise avec l&apos;IA</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          VieSolution Web conçoit des sites, applications, automatisations et intègre
          l&apos;intelligence artificielle pour simplifier vos opérations et multiplier
          votre productivité.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/diagnostic">
            <Button variant="glow" size="lg" className="gap-2">
              <Play className="w-4 h-4" /> Diagnostic gratuit
            </Button>
          </Link>
          <Link href="/estimateur">
            <Button variant="outline" size="lg" className="gap-2">
              Estimer mon projet <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="lg">
              Discuter avec un expert
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Réponse en 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Solutions sur mesure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span>IA intégrée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Accompagnement humain</span>
          </div>
        </div>
      </div>
    </section>
  );
}
