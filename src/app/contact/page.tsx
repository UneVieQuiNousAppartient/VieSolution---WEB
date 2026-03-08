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
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Parlons de votre projet</h1>
          <p className="mt-4 text-lg text-gray-600">Décrivez-nous votre besoin et nous vous répondrons dans les 24 heures.</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <ContactForm />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Autres moyens de nous joindre</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">E-mail</p>
                    <p className="text-sm text-gray-600">contact@viesolution.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Délai de réponse</p>
                    <p className="text-sm text-gray-600">Nous répondons en moins de 24 heures, du lundi au vendredi.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Confidentialité</p>
                    <p className="text-sm text-gray-600">Vos informations sont confidentielles et ne seront jamais partagées.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900">Pas sûr de votre besoin ?</h3>
              <p className="text-sm text-gray-600 mt-2">Pas de souci ! Nous pouvons vous offrir un audit gratuit pour analyser votre situation et vous proposer les meilleures options.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
