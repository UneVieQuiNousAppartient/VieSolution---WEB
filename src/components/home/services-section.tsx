import Link from 'next/link';
import { Globe, Zap, Link as LinkIcon, Layout, Settings, User } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { SERVICES } from '@/lib/constants/content';
import { ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-7 h-7" />,
  Zap: <Zap className="w-7 h-7" />,
  Link: <LinkIcon className="w-7 h-7" />,
  Layout: <Layout className="w-7 h-7" />,
  Settings: <Settings className="w-7 h-7" />,
  User: <User className="w-7 h-7" />,
};

export function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Nos services"
          subtitle="Des solutions complètes pour digitaliser et automatiser votre activité."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="text-blue-600 mb-4">{iconMap[service.icon]}</div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-4 font-medium">
                En savoir plus <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
