import { Search, PenTool, Code, Rocket } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { PROCESS_STEPS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
};

export function ProcessSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Notre processus de travail"
          subtitle="Un accompagnement structuré de A à Z pour garantir le succès de votre projet."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {iconMap[step.icon]}
              </div>
              <div className="text-sm font-medium text-blue-600 mb-1">Étape {step.step}</div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
