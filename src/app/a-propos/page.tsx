import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Heart, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez VieSolution Web : notre mission, nos valeurs et notre approche du développement web et de l\'automatisation.',
};

const values = [
  { icon: <Target className="w-7 h-7" />, title: 'Sur mesure', description: 'Chaque solution est adaptée à vos besoins spécifiques. Pas de templates génériques.' },
  { icon: <Heart className="w-7 h-7" />, title: 'Humain', description: 'Un interlocuteur dédié, une communication claire et un accompagnement sincère.' },
  { icon: <Lightbulb className="w-7 h-7" />, title: 'Innovation', description: 'Les technologies les plus modernes au service de votre efficacité.' },
  { icon: <Users className="w-7 h-7" />, title: 'Partenariat', description: 'Nous construisons des relations à long terme avec nos clients.' },
];

export default function AProposPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">À propos de VieSolution Web</h1>
          <p className="mt-4 text-lg text-gray-600">Nous aidons les entreprises et les particuliers à tirer le meilleur du numérique.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Chez VieSolution Web, nous croyons que la technologie doit simplifier la vie, pas la compliquer.
            Notre mission est de rendre le numérique accessible à toutes les entreprises, quelle que soit leur taille.
            Nous concevons des sites web, des applications et des automatisations qui résolvent de vrais problèmes
            et créent de la valeur concrète pour nos clients.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Nous combinons une vision business avec une expertise technique pour proposer des solutions
            qui ne sont pas seulement belles, mais qui fonctionnent et qui rapportent. Chaque projet est une
            opportunité de faire gagner du temps, de l&apos;argent et de la sérénité à nos clients.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <SectionTitle title="Nos valeurs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-blue-600 mb-3">{v.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre approche</h2>
          <div className="space-y-4 text-gray-600">
            <p><strong className="text-gray-900">Écouter d&apos;abord.</strong> Avant de coder quoi que ce soit, nous prenons le temps de comprendre votre entreprise, vos processus et vos objectifs.</p>
            <p><strong className="text-gray-900">Penser simple.</strong> La meilleure solution est souvent la plus simple. Nous évitons la sur-ingénierie et privilégions ce qui fonctionne.</p>
            <p><strong className="text-gray-900">Livrer de la valeur.</strong> Chaque fonctionnalité doit apporter un bénéfice concret. Pas de gadgets inutiles.</p>
            <p><strong className="text-gray-900">Accompagner.</strong> Notre travail ne s&apos;arrête pas à la livraison. Nous restons disponibles pour vous accompagner dans la durée.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold">Travaillons ensemble</h2>
          <p className="mt-4 text-blue-100">Prêt à transformer votre entreprise avec le numérique ?</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 gap-2">Nous contacter <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/audit-gratuit"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Audit gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
