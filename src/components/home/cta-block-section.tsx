import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle, ClipboardCheck, Calculator } from 'lucide-react';

export function CTABlockSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <MessageCircle className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Discutez avec nous</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Notre assistant est disponible pour répondre à vos questions en temps réel.
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Cliquez sur le bouton de chat en bas à droite
            </p>
          </div>
          <div className="bg-green-50 rounded-2xl p-8 text-center">
            <ClipboardCheck className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Audit gratuit</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Recevez une analyse personnalisée de vos besoins numériques.
            </p>
            <Link href="/audit-gratuit">
              <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-700">
                Demander un audit
              </Button>
            </Link>
          </div>
          <div className="bg-purple-50 rounded-2xl p-8 text-center">
            <Calculator className="w-10 h-10 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Estimez votre projet</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Obtenez une estimation indicative en quelques minutes.
            </p>
            <Link href="/estimateur">
              <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700">
                Estimer mon projet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
