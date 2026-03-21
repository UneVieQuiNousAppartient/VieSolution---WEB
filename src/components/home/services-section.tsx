import Link from 'next/link';
import { Globe, Zap, Link as LinkIcon, Layout, Settings, Brain, MessageSquare, Search, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { SERVICES } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Link: <LinkIcon className="w-6 h-6" />,
  Layout: <Layout className="w-6 h-6" />,
  Settings: <Settings className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
};

export function ServicesSection() {
  return (
    <section className="py-20 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos services"
          subtitle="Du site web à l'intégration IA complète — tout ce qu'il faut pour transformer votre entreprise."
          gradient
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group glass rounded-xl p-5 card-hover"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                {iconMap[service.icon]}
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{service.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-blue-400 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                En savoir plus <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
