import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Search, Calculator } from 'lucide-react';

export function CTABlockSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-8 text-center border-gradient card-hover">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Diagnostic gratuit</h3>
            <p className="text-sm text-gray-500 mt-2 mb-5">
              Évaluez votre site web, vos processus et vos opportunités IA en 5 minutes.
            </p>
            <Link href="/diagnostic">
              <Button variant="outline" size="sm">Lancer le diagnostic</Button>
            </Link>
          </div>
          <div className="glass rounded-2xl p-8 text-center border-gradient card-hover">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Solutions IA</h3>
            <p className="text-sm text-gray-500 mt-2 mb-5">
              Découvrez comment l&apos;IA peut transformer vos opérations au quotidien.
            </p>
            <Link href="/services/integration-ia">
              <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">Découvrir l&apos;IA</Button>
            </Link>
          </div>
          <div className="glass rounded-2xl p-8 text-center border-gradient card-hover">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Estimez votre projet</h3>
            <p className="text-sm text-gray-500 mt-2 mb-5">
              Obtenez une estimation indicative en quelques minutes.
            </p>
            <Link href="/estimateur">
              <Button variant="outline" size="sm" className="border-green-500/30 text-green-400 hover:bg-green-500/10">Estimer mon projet</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
