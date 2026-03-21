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
  'Identification des gains rapides avec l\'IA',
  'Plan d\'action prioritaire',
  'Sans engagement',
];

export default function AuditGratuitPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">100% gratuit</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Audit gratuit de vos besoins numériques</h1>
          <p className="mt-4 text-lg text-gray-400">Recevez une analyse personnalisée et des recommandations concrètes, incluant les opportunités IA.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6">Demandez votre audit</h2>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <AuditForm />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ce que vous recevrez</h3>
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-400">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Réponse en 24-48h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">Confidentialité garantie</span>
              </div>
            </div>
            <div className="glass rounded-xl p-5 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Préférez un diagnostic instantané ?</strong> Notre outil en ligne vous donne un score et des recommandations en 3 minutes.
              </p>
              <a href="/diagnostic" className="text-sm text-blue-400 font-medium mt-2 inline-block hover:text-blue-300">Lancer le diagnostic &rarr;</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
