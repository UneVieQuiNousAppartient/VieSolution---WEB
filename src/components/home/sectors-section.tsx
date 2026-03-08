import Link from 'next/link';
import { Building2, UtensilsCrossed, Briefcase, ShoppingBag, Rocket, User, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { SECTORS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-7 h-7" />,
  UtensilsCrossed: <UtensilsCrossed className="w-7 h-7" />,
  Briefcase: <Briefcase className="w-7 h-7" />,
  ShoppingBag: <ShoppingBag className="w-7 h-7" />,
  Rocket: <Rocket className="w-7 h-7" />,
  User: <User className="w-7 h-7" />,
};

export function SectorsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Des solutions adaptées à votre secteur"
          subtitle="Chaque industrie a ses défis. Nous créons des solutions sur mesure pour y répondre."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTORS.map((sector) => (
            <Link
              key={sector.title}
              href={sector.href}
              className="group flex gap-4 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-blue-600 shrink-0">{iconMap[sector.icon]}</div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {sector.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{sector.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3 font-medium">
                  Découvrir <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
