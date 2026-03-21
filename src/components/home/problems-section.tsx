import { Clock, AlertTriangle, Database, Timer, Unplug, FileX } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { PROBLEMS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Timer: <Timer className="w-6 h-6" />,
  Unplug: <Unplug className="w-6 h-6" />,
  FileX: <FileX className="w-6 h-6" />,
};

export function ProblemsSection() {
  return (
    <section className="py-20 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Ces problèmes vous parlent ?"
          subtitle="Si votre entreprise fait face à ces défis, nous avons les solutions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="flex gap-4 p-5 rounded-xl bg-red-500/5 border border-red-500/10 card-hover"
            >
              <div className="text-red-400 shrink-0 mt-0.5">{iconMap[problem.icon]}</div>
              <div>
                <h3 className="font-semibold text-white text-sm">{problem.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
