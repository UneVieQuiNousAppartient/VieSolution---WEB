import { Target, Brain, Cpu, Zap, Heart } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { WHY_CHOOSE_US } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Cpu: <Cpu className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />,
};

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Pourquoi choisir VieSolution Web"
          subtitle="Une approche centrée sur vos résultats avec un accompagnement humain et des technologies modernes."
          className="[&_h2]:text-white [&_p]:text-blue-100"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="text-blue-200 mb-3">{iconMap[item.icon]}</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-blue-100 text-sm mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
