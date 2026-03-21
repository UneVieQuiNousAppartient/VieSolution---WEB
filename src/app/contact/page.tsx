import type { Metadata } from 'next';
import { Mail, Clock, Shield } from 'lucide-react';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez VieSolution Web pour discuter de votre projet. Réponse garantie en 24 heures.',
};

export default function ContactPage() {
  return (
    <>
      <section className="gradient-bg grid-pattern py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Parlons de votre projet</h1>
          <p className="mt-4 text-lg text-gray-400">Décrivez-nous votre besoin et nous vous répondrons dans les 24 heures.</p>
        </div>
      </section>
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold text-white">Autres moyens de nous joindre</h3>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-sm">E-mail</p>
                  <p className="text-sm text-gray-500">contact@viesolution.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-sm">Délai de réponse</p>
                  <p className="text-sm text-gray-500">Moins de 24h, du lundi au vendredi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white text-sm">Confidentialité</p>
                  <p className="text-sm text-gray-500">Vos informations sont chiffrées et ne seront jamais partagées.</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
              <h3 className="font-semibold text-white text-sm">Pas sûr de votre besoin ?</h3>
              <p className="text-sm text-gray-500 mt-2">Faites notre diagnostic gratuit en 3 minutes pour identifier vos meilleures opportunités.</p>
              <a href="/diagnostic" className="text-sm text-blue-400 font-medium mt-3 inline-block hover:text-blue-300">Lancer le diagnostic &rarr;</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
