import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, MessageCircle } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Prêt à transformer votre entreprise ?
        </h2>
        <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
          Discutons de votre projet et trouvons ensemble la meilleure solution pour simplifier
          vos opérations et accélérer votre croissance.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
              <MessageCircle className="w-4 h-4" /> Parler de mon projet
            </Button>
          </Link>
          <Link href="/estimateur">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
              <FileText className="w-4 h-4" /> Recevoir un devis
            </Button>
          </Link>
          <Link href="/audit-gratuit">
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 gap-2">
              Commencer maintenant <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
