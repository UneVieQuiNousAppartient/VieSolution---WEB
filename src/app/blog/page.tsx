import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles et conseils sur le développement web, l\'automatisation et la transformation numérique pour PME.',
};

const articles = [
  {
    title: 'Automatisation des processus pour PME : par où commencer ?',
    excerpt: 'Découvrez comment identifier les processus à automatiser en priorité et les gains que vous pouvez espérer.',
    category: 'Automatisation',
    date: '2025-01-15',
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
    title: 'Outils internes : pourquoi votre entreprise en a besoin',
    excerpt: 'Les outils internes sur mesure peuvent transformer votre productivité. Voici comment.',
    category: 'Outils internes',
    date: '2024-12-20',
  },
  {
    title: 'Site web professionnel pour entrepreneur : les essentiels',
    excerpt: 'Ce que tout entrepreneur doit savoir avant de créer ou refaire son site web professionnel.',
    category: 'Développement web',
    date: '2024-12-15',
  },
  {
    title: 'Automatisation simple pour particuliers : 5 idées concrètes',
    excerpt: 'L\'automatisation n\'est pas réservée aux entreprises. Voici 5 façons de simplifier votre quotidien.',
    category: 'Particuliers',
    date: '2024-12-10',
  },
];

export default function BlogPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Blog</h1>
          <p className="mt-4 text-lg text-gray-600">Articles, conseils et ressources pour tirer le meilleur du numérique.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.title} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 h-40 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">{article.category}</span>
                </div>
                <div className="p-5">
                  <span className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h2 className="text-lg font-semibold text-gray-900 mt-2">{article.title}</h2>
                  <p className="text-sm text-gray-600 mt-2">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600 mt-3 font-medium">
                    Lire la suite <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-12">Plus d&apos;articles à venir prochainement.</p>
        </div>
      </section>
    </>
  );
}
