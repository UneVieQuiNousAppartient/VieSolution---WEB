import Link from 'next/link';
import { Building2, UtensilsCrossed, Briefcase, ShoppingBag, Rocket, User, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { SECTORS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-6 h-6" />,
  UtensilsCrossed: <UtensilsCrossed className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  User: <User className="w-6 h-6" />,
};

export function SectorsSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Des solutions adaptées à votre secteur"
          subtitle="Chaque industrie a ses défis. Nous créons des solutions sur mesure pour y répondre."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTORS.map((sector) => (
            <Link
              key={sector.title}
              href={sector.href}
              className="group flex gap-4 p-5 rounded-xl glass card-hover"
            >
              <div className="text-purple-400 shrink-0 mt-1">{iconMap[sector.icon]}</div>
              <div>
                <h3 className="font-semibold text-white text-sm group-hover:text-purple-400 transition-colors">
                  {sector.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{sector.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-purple-400 mt-2 font-medium">
                  Découvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
