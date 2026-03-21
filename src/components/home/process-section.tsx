import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { PROCESS_STEPS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
};

export function ProcessSection() {
  return (
    <section className="py-20 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Notre processus"
          subtitle="Un accompagnement structuré de A à Z pour garantir le succès de votre projet."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="relative inline-flex">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center">
                  {iconMap[step.icon]}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-white font-semibold mt-4">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
