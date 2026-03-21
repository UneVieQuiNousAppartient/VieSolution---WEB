import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Bot, FileSearch, BarChart3, Mail, Brain, Workflow, Sparkles, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Intégration IA en entreprise',
  description: 'Installez l\'intelligence artificielle dans vos processus d\'affaires. Chatbots, automatisations IA, analyse de données et plus.',
};

const services = [
  { icon: <Bot className="w-7 h-7" />, title: 'Chatbots & Assistants IA', description: 'Service client 24/7, qualification de leads, support interne et FAQ automatisées.', color: 'blue' },
  { icon: <FileSearch className="w-7 h-7" />, title: 'Analyse de documents', description: 'Extraction automatique de données depuis factures, contrats, e-mails et formulaires.', color: 'purple' },
  { icon: <Mail className="w-7 h-7" />, title: 'Communication intelligente', description: 'Rédaction automatique d\'e-mails, réponses personnalisées et suivi de conversations.', color: 'green' },
  { icon: <BarChart3 className="w-7 h-7" />, title: 'Rapports & Analyse', description: 'Génération automatique de rapports, détection d\'anomalies et insights business.', color: 'yellow' },
  { icon: <Workflow className="w-7 h-7" />, title: 'Workflows IA', description: 'Chaînes de tâches automatisées avec prise de décision intelligente.', color: 'pink' },
  { icon: <Brain className="w-7 h-7" />, title: 'IA sur mesure', description: 'Solutions IA personnalisées pour des besoins métier spécifiques.', color: 'cyan' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  green: 'bg-green-500/10 text-green-400',
  yellow: 'bg-yellow-500/10 text-yellow-400',
  pink: 'bg-pink-500/10 text-pink-400',
  cyan: 'bg-cyan-500/10 text-cyan-400',
};

const benefits = [
  'Gain de 10 à 30 heures par mois',
  'Service client disponible 24h/24',
  'Réduction des erreurs humaines de 90%',
  'Traitement instantané des documents',
  'Prise de décision basée sur les données',
  'ROI mesurable dès le premier mois',
  'Scalable sans coûts humains',
  'Intégration à vos outils existants',
];

export default function IntegrationIAPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-bg grid-pattern py-20">
        <div className="gradient-mesh absolute inset-0" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Intelligence artificielle</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-white">Installez l&apos;IA dans</span>
            <br />
            <span className="gradient-text">votre entreprise</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Nous intégrons l&apos;intelligence artificielle dans vos processus existants pour
            automatiser, optimiser et accélérer votre activité.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnostic">
              <Button variant="glow" size="lg" className="gap-2">
                Diagnostic IA gratuit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Discuter avec un expert</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services IA */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Ce que l&apos;IA peut faire pour vous</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Des solutions concrètes qui s&apos;intègrent à votre façon de travailler.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.title} className="glass rounded-xl p-6 card-hover">
                <div className={`w-12 h-12 rounded-xl ${colorMap[s.color]} flex items-center justify-center mb-4`}>
                  {s.icon}
                </div>
                <h3 className="text-white font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Comment ça fonctionne</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Audit de vos processus', desc: 'Nous identifions les tâches à forte valeur d\'automatisation IA.' },
              { step: 2, title: 'Choix des solutions', desc: 'Nous sélectionnons les outils IA adaptés : OpenAI, Claude, outils open-source...' },
              { step: 3, title: 'Intégration & déploiement', desc: 'Nous intégrons l\'IA dans vos outils existants sans tout chambouler.' },
              { step: 4, title: 'Formation & accompagnement', desc: 'Votre équipe est formée et accompagnée pour tirer le meilleur de l\'IA.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 glass rounded-xl p-5">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-[#0a0a0f] to-blue-600/10" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Les bénéfices concrets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 glass rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security note */}
      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Sécurité et confidentialité</h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Vos données restent les vôtres. Nous utilisons des API sécurisées, le chiffrement en transit
            et au repos, et nous respectons les meilleures pratiques de confidentialité.
            Aucune donnée n&apos;est utilisée pour entraîner des modèles tiers.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-purple-600/20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Prêt à intégrer l&apos;IA ?
          </h2>
          <p className="mt-4 text-gray-400">Commencez par un diagnostic gratuit pour identifier vos meilleures opportunités.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/diagnostic">
              <Button variant="glow" size="lg" className="gap-2"><Zap className="w-4 h-4" /> Diagnostic IA gratuit</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">Parler à un expert</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
