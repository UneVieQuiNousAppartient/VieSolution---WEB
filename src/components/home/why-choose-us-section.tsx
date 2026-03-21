import { Target, Brain, Cpu, Zap, Shield, Heart } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { WHY_CHOOSE_US } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};

export function WhyChooseUsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-[#0d0d14] to-purple-600/10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Pourquoi VieSolution"
          subtitle="Une approche centrée sur vos résultats avec un accompagnement humain et des technologies de pointe."
          gradient
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.title} className="glass rounded-xl p-6 card-hover">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center mb-4">
                {iconMap[item.icon]}
              </div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
