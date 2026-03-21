import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, FileText } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-purple-600/20" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white">
          Prêt à passer au <span className="gradient-text">niveau supérieur</span> ?
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Discutons de votre projet et trouvons ensemble la meilleure solution pour
          simplifier vos opérations et accélérer votre croissance.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button variant="glow" size="lg" className="gap-2">
              <MessageCircle className="w-4 h-4" /> Parler de mon projet
            </Button>
          </Link>
          <Link href="/estimateur">
            <Button variant="outline" size="lg" className="gap-2">
              <FileText className="w-4 h-4" /> Recevoir un devis
            </Button>
          </Link>
          <Link href="/diagnostic">
            <Button variant="ghost" size="lg" className="gap-2">
              Diagnostic gratuit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
