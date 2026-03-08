'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { estimateurSchema, type EstimateurFormData } from '@/lib/validations/schemas';
import { submitEstimateurRequest } from '@/lib/supabase/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const typeProjetOptions = [
  { value: 'site-vitrine', label: 'Site vitrine' },
  { value: 'site-pro', label: 'Site professionnel' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'application-web', label: 'Application web' },
  { value: 'automatisation', label: 'Automatisation' },
  { value: 'outil-interne', label: 'Outil interne' },
  { value: 'integration-api', label: 'Intégration API' },
];

const typeClientOptions = [
  { value: 'pme', label: 'PME' },
  { value: 'startup', label: 'Startup' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'particulier', label: 'Particulier' },
];

const budgetOptions = [
  { value: 'moins-1500', label: 'Moins de 1 500 $' },
  { value: '1500-3500', label: '1 500 $ à 3 500 $' },
  { value: '3500-7000', label: '3 500 $ à 7 000 $' },
  { value: '7000-15000', label: '7 000 $ à 15 000 $' },
  { value: '15000-plus', label: '15 000 $ +' },
];

const delaiOptions = [
  { value: 'urgent', label: 'Urgent (< 2 semaines)' },
  { value: '1-mois', label: '1 mois' },
  { value: '2-3-mois', label: '2 à 3 mois' },
  { value: 'flexible', label: 'Flexible' },
];

const fonctionnalitesOptions = [
  'Formulaire de contact',
  'Blog',
  'Espace client',
  'Paiement en ligne',
  'Tableau de bord',
  'Automatisation e-mails',
  'Intégration CRM',
  'Gestion d\'inventaire',
  'API externe',
  'Application mobile',
];

function getEstimation(data: EstimateurFormData): string {
  const basePrice: Record<string, number> = {
    'site-vitrine': 1500,
    'site-pro': 2500,
    'ecommerce': 5000,
    'application-web': 7000,
    'automatisation': 3000,
    'outil-interne': 5000,
    'integration-api': 3500,
  };

  const base = basePrice[data.type_projet] || 3000;
  const featureMultiplier = 1 + (data.fonctionnalites?.length || 0) * 0.1;
  const min = Math.round(base * featureMultiplier);
  const max = Math.round(min * 1.6);

  return `${min.toLocaleString()} $ - ${max.toLocaleString()} $`;
}

export function EstimateurForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [estimation, setEstimation] = useState('');
  const [error, setError] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, trigger, getValues } = useForm<EstimateurFormData>({
    resolver: zodResolver(estimateurSchema),
  });

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(['type_projet', 'type_client']);
      if (!valid) return;
    }
    setStep(step + 1);
  };

  const toggleFeature = (feature: string) => {
    const updated = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(updated);
    setValue('fonctionnalites', updated);
  };

  const onSubmit = async (data: EstimateurFormData) => {
    try {
      setError('');
      const est = getEstimation(data);
      setEstimation(est);
      await submitEstimateurRequest({ ...data, resultat_estimation: est });
      setSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Estimation envoyée !</h3>
        <p className="text-3xl font-bold text-blue-600 mt-4">{estimation}</p>
        <p className="text-gray-600 mt-2 text-sm">Cette estimation est indicative. Nous vous contacterons pour affiner votre projet.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Votre projet</h3>
          <Select label="Type de projet *" id="type_projet" placeholder="Sélectionnez" options={typeProjetOptions} error={errors.type_projet?.message} {...register('type_projet')} />
          <Select label="Vous êtes" id="type_client" placeholder="Sélectionnez" options={typeClientOptions} {...register('type_client')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fonctionnalités souhaitées</label>
            <div className="flex flex-wrap gap-2">
              {fonctionnalitesOptions.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeature(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    selectedFeatures.includes(f)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Button type="button" onClick={nextStep} size="lg" className="w-full gap-2">
            Suivant <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Budget et délai</h3>
          <Select label="Budget" id="budget" placeholder="Sélectionnez" options={budgetOptions} {...register('budget')} />
          <Select label="Délai souhaité" id="delai" placeholder="Sélectionnez" options={delaiOptions} {...register('delai')} />
          <Textarea label="Description du projet (optionnel)" id="description" placeholder="Décrivez votre projet..." {...register('description')} />
          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(1)} variant="outline" size="lg" className="flex-1 gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Button>
            <Button type="button" onClick={() => { nextStep(); }} size="lg" className="flex-1 gap-2">
              Suivant <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold">Vos coordonnées</h3>
          <Input label="Nom *" id="nom" placeholder="Votre nom" error={errors.nom?.message} {...register('nom')} />
          <Input label="E-mail *" id="email" type="email" placeholder="votre@email.com" error={errors.email?.message} {...register('email')} />
          <Input label="Téléphone" id="telephone" type="tel" placeholder="514-000-0000" {...register('telephone')} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" onClick={() => setStep(2)} variant="outline" size="lg" className="flex-1 gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Button>
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Obtenir mon estimation
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
