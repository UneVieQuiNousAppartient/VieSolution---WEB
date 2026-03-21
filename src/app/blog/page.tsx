import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles et conseils sur le développement web, l\'automatisation, l\'IA et la transformation numérique pour PME.',
};

const articles = [
  {
    title: 'Comment l\'IA peut transformer votre service client en 2025',
    excerpt: 'Les chatbots IA ne sont plus de simples gadgets. Découvrez comment ils révolutionnent la relation client pour les PME.',
    category: 'Intelligence artificielle',
    date: '2025-02-10',
  },
  {
    title: 'Automatisation des processus pour PME : par où commencer ?',
    excerpt: 'Découvrez comment identifier les processus à automatiser en priorité et les gains que vous pouvez espérer.',
    category: 'Automatisation',
    date: '2025-01-15',
  },
  {
    title: '5 façons d\'intégrer l\'IA dans votre entreprise dès aujourd\'hui',
    excerpt: 'Des solutions concrètes et accessibles pour commencer à utiliser l\'intelligence artificielle sans budget massif.',
    category: 'Intelligence artificielle',
    date: '2025-01-12',
  },
  {
    title: 'Pourquoi créer une application web sur mesure en 2025 ?',
    excerpt: 'Les logiciels standards ne répondent pas toujours à vos besoins. Voici quand une application sur mesure fait la différence.',
    category: 'Applications web',
    date: '2025-01-10',
  },
  {
    title: 'Comment digitaliser une petite entreprise : guide pratique',
    excerpt: 'Un guide étape par étape pour transformer numériquement votre petite entreprise sans vous ruiner.',
    category: 'Transformation numérique',
    date: '2025-01-05',
  },
  {
    title: 'L\'IA pour les rapports automatisés : gagnez des heures chaque semaine',
    excerpt: 'Générez des rapports financiers, de ventes ou d\'activité automatiquement grâce à l\'intelligence artificielle.',
    category: 'Intelligence artificielle',
    date: '2024-12-20',
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Blog</h1>
          <p className="mt-4 text-lg text-gray-400">Articles, conseils et ressources sur le numérique et l&apos;IA.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.title} className="glass rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 h-40 flex items-center justify-center">
                  <span className="text-blue-400 font-medium text-sm">{article.category}</span>
                </div>
                <div className="p-5">
                  <span className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h2 className="text-lg font-semibold text-white mt-2">{article.title}</h2>
                  <p className="text-sm text-gray-400 mt-2">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-400 mt-3 font-medium group-hover:text-blue-300 transition-colors">
                    Lire la suite <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-12">Plus d&apos;articles à venir prochainement.</p>
        </div>
      </section>
    </>
  );
}
