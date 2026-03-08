import type { Metadata } from 'next';
import { Calculator, Clock, Shield } from 'lucide-react';
import { EstimateurForm } from '@/components/forms/estimateur-form';

export const metadata: Metadata = {
  title: 'Estimateur de projet',
  description: 'Estimez le coût de votre projet web en quelques minutes. Estimation indicative gratuite et sans engagement.',
};

export default function EstimateurPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" /> Estimation gratuite
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Estimez votre projet</h1>
          <p className="mt-4 text-lg text-gray-600">Obtenez une estimation indicative en quelques minutes. Gratuit et sans engagement.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Décrivez votre projet</h2>
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <EstimateurForm />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Comment ça fonctionne ?</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="font-bold text-blue-600">1.</span> Décrivez votre projet en 3 étapes</li>
                <li className="flex gap-2"><span className="font-bold text-blue-600">2.</span> Recevez une estimation indicative</li>
                <li className="flex gap-2"><span className="font-bold text-blue-600">3.</span> Nous vous contactons pour affiner</li>
              </ol>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Estimation en 2 minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Sans engagement</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Note :</strong> L&apos;estimation est indicative et basée sur les informations fournies. Le prix final sera déterminé après une analyse détaillée de vos besoins.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
