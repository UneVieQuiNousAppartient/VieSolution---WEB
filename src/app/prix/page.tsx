import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_TIERS } from '@/lib/constants/content';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = {
  title: 'Nos prix',
  description: 'Forfaits Essentiel, Business + IA et Transformation. Des solutions adaptées à chaque budget.',
};

export default function PrixPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Nos prix</h1>
          <p className="mt-4 text-lg text-gray-400">Des forfaits clairs et adaptés à chaque besoin. Pas de surprises.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  'glass rounded-2xl p-8 flex flex-col relative',
                  tier.highlighted && 'border-gradient glow-blue'
                )}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                    Populaire
                  </span>
                )}
                <h2 className="text-xl font-bold text-white">{tier.name}</h2>
                <p className="text-2xl font-bold gradient-text mt-2">{tier.price}</p>
                <p className="text-sm text-gray-500 mt-3">{tier.description}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="mt-8">
                  <Button size="lg" className="w-full" variant={tier.highlighted ? 'glow' : 'outline'}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-8">
            Tous les prix sont indicatifs. Contactez-nous pour un devis précis adapté à votre projet.
          </p>
        </div>
      </section>
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white">Besoin d&apos;un devis personnalisé ?</h2>
          <p className="mt-4 text-gray-400">Utilisez notre estimateur ou contactez-nous pour un devis détaillé.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/estimateur"><Button variant="glow" size="lg">Estimer mon projet</Button></Link>
            <Link href="/contact"><Button variant="outline" size="lg">Demander un devis</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
