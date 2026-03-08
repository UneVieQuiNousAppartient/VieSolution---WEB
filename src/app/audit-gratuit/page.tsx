import type { Metadata } from 'next';
import { CheckCircle, Clock, Shield, Sparkles } from 'lucide-react';
import { AuditForm } from '@/components/forms/audit-form';

export const metadata: Metadata = {
  title: 'Audit gratuit',
  description: 'Recevez un audit gratuit de vos besoins numériques. Analyse personnalisée et recommandations concrètes.',
};

const benefits = [
  'Analyse personnalisée de vos besoins',
  'Recommandations concrètes et actionnables',
  'Estimation budgétaire indicative',
  'Identification des gains rapides',
  'Plan d\'action prioritaire',
  'Sans engagement',
];

export default function AuditGratuitPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" /> 100% gratuit
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Audit gratuit de vos besoins numériques</h1>
          <p className="mt-4 text-lg text-gray-600">Recevez une analyse personnalisée et des recommandations concrètes pour améliorer votre présence et vos processus numériques.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Demandez votre audit</h2>
            <AuditForm />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ce que vous recevrez</h3>
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Réponse en 24-48h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Confidentialité garantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
