import { Clock, AlertTriangle, Database, Timer, Unplug, FileX } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
import { PROBLEMS } from '@/lib/constants/content';

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-8 h-8" />,
  AlertTriangle: <AlertTriangle className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Timer: <Timer className="w-8 h-8" />,
  Unplug: <Unplug className="w-8 h-8" />,
  FileX: <FileX className="w-8 h-8" />,
};

export function ProblemsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Ces problèmes vous parlent ?"
          subtitle="Si votre entreprise fait face à ces défis, nous avons les solutions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="flex gap-4 p-6 rounded-xl bg-red-50/60 border border-red-100"
            >
              <div className="text-red-500 shrink-0">{iconMap[problem.icon]}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{problem.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
