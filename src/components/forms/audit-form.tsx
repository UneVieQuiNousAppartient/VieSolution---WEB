'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auditSchema, type AuditFormData } from '@/lib/validations/schemas';
import { submitAuditRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

const besoinOptions = [
  { value: 'site-web', label: 'Site web' },
  { value: 'application', label: 'Application web' },
  { value: 'automatisation', label: 'Automatisation' },
  { value: 'integration', label: 'Intégration systèmes' },
  { value: 'integration-ia', label: 'Intégration IA' },
  { value: 'chatbot-ia', label: 'Chatbot IA' },
  { value: 'outil-interne', label: 'Outil interne' },
  { value: 'autre', label: 'Autre' },
];

export function AuditForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
  });

  const onSubmit = async (data: AuditFormData) => {
    if (honeypotRef.current?.value) return;

    if (!checkRateLimit('audit', 3, 300000)) {
      setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }

    try {
      setError('');
      await submitAuditRequest(data);
      setSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white">Demande envoyée !</h3>
        <p className="text-gray-400 mt-2">Nous vous contacterons sous 24 heures pour planifier votre audit gratuit.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input label="Nom *" id="nom" placeholder="Votre nom" error={errors.nom?.message} {...register('nom')} />
        <Input label="E-mail *" id="email" type="email" placeholder="votre@email.com" error={errors.email?.message} {...register('email')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input label="Téléphone" id="telephone" type="tel" placeholder="514-000-0000" {...register('telephone')} />
        <Input label="Entreprise" id="entreprise" placeholder="Nom de votre entreprise" {...register('entreprise')} />
      </div>
      <Select label="Type de besoin *" id="besoin" placeholder="Sélectionnez votre besoin" options={besoinOptions} error={errors.besoin?.message} {...register('besoin')} />
      <Textarea label="Message (optionnel)" id="message" placeholder="Décrivez brièvement votre situation actuelle..." {...register('message')} />
      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <input type="text" name="website" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Demander mon audit gratuit
      </Button>
    </form>
  );
}
