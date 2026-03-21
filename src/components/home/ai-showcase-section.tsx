import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/section-title';
import { Bot, FileSearch, BarChart3, Mail, Brain, Workflow, ArrowRight } from 'lucide-react';

const aiUseCases = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'Chatbots intelligents',
    description: 'Service client 24/7, qualification de leads et support automatisé.',
    tag: 'Service client',
  },
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: 'Analyse de documents',
    description: 'Extraction et classification automatique de données depuis vos documents.',
    tag: 'Productivité',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Rapports automatisés',
    description: 'Génération de rapports et analyses à partir de vos données existantes.',
    tag: 'Analytique',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Communication IA',
    description: 'Rédaction d\'e-mails, réponses automatiques et personnalisation du contenu.',
    tag: 'Marketing',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Aide à la décision',
    description: 'Analyses prédictives et recommandations basées sur vos données historiques.',
    tag: 'Stratégie',
  },
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Workflows IA',
    description: 'Automatisation de chaînes de tâches complexes avec intelligence adaptative.',
    tag: 'Automatisation',
  },
];

export function AIShowcaseSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="L'IA au service de votre entreprise"
          subtitle="Nous intégrons l'intelligence artificielle dans vos processus existants pour des gains concrets et mesurables."
          gradient
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiUseCases.map((item) => (
            <div key={item.title} className="glass rounded-xl p-6 card-hover group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gray-600 font-medium bg-white/5 px-2 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-2">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services/integration-ia">
            <Button variant="outline" size="lg" className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
              Découvrir toutes nos solutions IA <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
