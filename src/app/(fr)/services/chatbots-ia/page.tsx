import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Bot, MessageSquare, Users, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chatbots & Assistants IA',
  description: 'Déployez des chatbots et assistants IA pour votre service client, vente et support interne. Disponible 24/7.',
};

const useCases = [
  { icon: <MessageSquare className="w-6 h-6" />, title: 'Service client', description: 'Répondez aux questions fréquentes et résolvez les problèmes courants automatiquement.' },
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Qualification de leads', description: 'Qualifiez vos prospects automatiquement et transmettez les leads chauds à votre équipe.' },
  { icon: <Users className="w-6 h-6" />, title: 'Support interne', description: 'Aidez vos employés à trouver rapidement les réponses dans votre documentation.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Prise de rendez-vous', description: 'Laissez votre assistant planifier les rendez-vous directement dans votre calendrier.' },
];

const features = [
  'Entraîné sur vos données et FAQ',
  'Disponible 24h/24, 7j/7',
  'Multilingue (FR, EN, ES...)',
  'Intégré à votre site web',
  'Transfert vers un humain si nécessaire',
  'Tableau de bord analytique',
  'Respect de la confidentialité',
  'Personnalisable à votre image',
];

export default function ChatbotsIAPage() {
  return (
    <>
      <section className="relative overflow-hidden gradient-bg grid-pattern py-20">
        <div className="gradient-mesh absolute inset-0" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6">
            <Bot className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Chatbots & Assistants IA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-white">Un assistant IA qui</span>
            <br />
            <span className="gradient-text">travaille pour vous 24/7</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Déployez un chatbot intelligent sur votre site pour répondre aux questions,
            qualifier vos leads et supporter votre équipe — même à 3h du matin.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button variant="glow" size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" /> Demander une démo
              </Button>
            </Link>
            <Link href="/estimateur">
              <Button variant="outline" size="lg">Estimer le coût</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">À quoi sert un chatbot IA ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className="glass rounded-xl p-6 card-hover">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  {uc.icon}
                </div>
                <h3 className="text-white font-semibold">{uc.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Fonctionnalités incluses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 glass rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Le ROI d&apos;un chatbot IA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { metric: '60%', label: 'des questions résolues automatiquement', sublabel: 'Sans intervention humaine' },
              { metric: '24/7', label: 'disponibilité', sublabel: 'Même la nuit et les jours fériés' },
              { metric: '3x', label: 'plus de leads capturés', sublabel: 'Comparé à un formulaire classique' },
            ].map((item) => (
              <div key={item.metric} className="glass rounded-xl p-6 text-center border-gradient">
                <p className="text-4xl font-bold gradient-text">{item.metric}</p>
                <p className="text-white font-medium mt-2">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-purple-600/20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Prêt à déployer votre assistant IA ?</h2>
          <p className="mt-4 text-gray-400">À partir de 2 000 $. Déploiement en 1 à 2 semaines.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact"><Button variant="glow" size="lg" className="gap-2">Demander une démo <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/diagnostic"><Button variant="outline" size="lg">Diagnostic gratuit</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
