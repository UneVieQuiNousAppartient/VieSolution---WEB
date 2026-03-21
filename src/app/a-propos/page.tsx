import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, Heart, Lightbulb, Users, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez VieSolution Web : notre mission, nos valeurs et notre approche du développement web, de l\'automatisation et de l\'IA.',
};

const values = [
  { icon: <Target className="w-7 h-7" />, title: 'Sur mesure', description: 'Chaque solution est adaptée à vos besoins spécifiques. Pas de templates génériques.' },
  { icon: <Heart className="w-7 h-7" />, title: 'Humain', description: 'Un interlocuteur dédié, une communication claire et un accompagnement sincère.' },
  { icon: <Lightbulb className="w-7 h-7" />, title: 'Innovation', description: 'Les technologies les plus modernes, incluant l\'IA, au service de votre efficacité.' },
  { icon: <Brain className="w-7 h-7" />, title: 'IA responsable', description: 'Nous intégrons l\'intelligence artificielle de manière éthique et pragmatique.' },
  { icon: <Users className="w-7 h-7" />, title: 'Partenariat', description: 'Nous construisons des relations à long terme avec nos clients.' },
];

export default function AProposPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">À propos de VieSolution Web</h1>
          <p className="mt-4 text-lg text-gray-400">Nous aidons les entreprises à tirer le meilleur du numérique et de l&apos;intelligence artificielle.</p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Notre mission</h2>
          <p className="text-gray-400 leading-relaxed">
            Chez VieSolution Web, nous croyons que la technologie doit simplifier la vie, pas la compliquer.
            Notre mission est de rendre le numérique et l&apos;intelligence artificielle accessibles à toutes les entreprises, quelle que soit leur taille.
            Nous concevons des sites web, des applications, des automatisations et des solutions IA qui résolvent de vrais problèmes
            et créent de la valeur concrète pour nos clients.
          </p>
          <p className="text-gray-400 leading-relaxed mt-4">
            Nous combinons une vision business avec une expertise technique pour proposer des solutions
            qui ne sont pas seulement belles, mais qui fonctionnent et qui rapportent. Chaque projet est une
            opportunité de faire gagner du temps, de l&apos;argent et de la sérénité à nos clients.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass rounded-2xl p-6">
                <div className="text-blue-400 mb-3">{v.icon}</div>
                <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Notre approche</h2>
          <div className="space-y-4 text-gray-400">
            <p><strong className="text-white">Écouter d&apos;abord.</strong> Avant de coder quoi que ce soit, nous prenons le temps de comprendre votre entreprise, vos processus et vos objectifs.</p>
            <p><strong className="text-white">Penser simple.</strong> La meilleure solution est souvent la plus simple. Nous évitons la sur-ingénierie et privilégions ce qui fonctionne.</p>
            <p><strong className="text-white">Intégrer l&apos;IA intelligemment.</strong> L&apos;IA n&apos;est pas une fin en soi. Nous l&apos;utilisons là où elle apporte une vraie valeur ajoutée.</p>
            <p><strong className="text-white">Livrer de la valeur.</strong> Chaque fonctionnalité doit apporter un bénéfice concret. Pas de gadgets inutiles.</p>
            <p><strong className="text-white">Accompagner.</strong> Notre travail ne s&apos;arrête pas à la livraison. Nous restons disponibles pour vous accompagner dans la durée.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Travaillons ensemble</h2>
          <p className="mt-4 text-gray-400">Prêt à transformer votre entreprise avec le numérique et l&apos;IA ?</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg" className="gap-2">Nous contacter <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/diagnostic"><Button variant="outline" size="lg">Diagnostic gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
