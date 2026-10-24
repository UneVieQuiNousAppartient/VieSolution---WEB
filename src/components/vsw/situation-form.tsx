'use client';

import { useState, type BaseSyntheticEvent } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitEstimateurRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { Icon } from './icon';
import { FACTEURS, CONCLUSION_PRIX } from './comment-prix-section';
import { APPEL } from './appel';
import { lienLangue, phrase, t, type Lang } from '@/lib/i18n';

/* Les 8 métiers de src/lib/metiers.ts (titres des cartes), + « Autre ». */
const METIERS = [
  phrase("Conseiller financier"),
  phrase("Courtier hypothécaire"),
  phrase("Clinique dentaire"),
  phrase("Clinique de soins"),
  phrase("Cabinet comptable"),
  phrase("Entrepreneur en construction"),
  phrase("Agent immobilier"),
  phrase("Commerce ou restaurant"),
  phrase("Autre"),
];

const situationSchema = z.object({
  metier: z.string().min(1, phrase("Choisissez votre métier (ou « Autre »)")),
  description: z.string().trim().min(10, phrase("Décrivez en quelques mots ce qui vous prend du temps (10 caractères minimum)")),
  nom: z.string().trim().min(2, phrase("Le nom doit contenir au moins 2 caractères")),
  email: z.string().trim().email(phrase("Adresse courriel invalide")),
  telephone: z.string().optional(),
});

type SituationData = z.infer<typeof situationSchema>;

export function SituationForm({ lang = 'fr' }: { lang?: Lang }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SituationData>({
    resolver: zodResolver(situationSchema),
    defaultValues: { metier: '' },
  });

  const onSubmit = async (data: SituationData, event?: BaseSyntheticEvent) => {
    // Pot de miel : lu sur le formulaire soumis (pas de ref lue pendant le rendu).
    const form = event?.target as HTMLFormElement | undefined;
    const pot = form?.elements.namedItem('website') as HTMLInputElement | null | undefined;
    if (pot?.value) return;
    if (!checkRateLimit('situation', 3, 300000)) {
      setError(t(lang, "Trop de tentatives. Veuillez patienter quelques minutes."));
      return;
    }
    try {
      setError('');
      const tel = data.telephone?.trim();
      await submitEstimateurRequest({
        nom: data.nom,
        email: data.email,
        telephone: tel ? tel : undefined,
        type_projet: data.metier,
        description: data.description,
        resultat_estimation: 'Sur mesure — à discuter à l\'appel découverte',
      });
      setSent(true);
    } catch {
      setError(t(lang, "Une erreur est survenue. Veuillez réessayer."));
    }
  };

  return (
    <section id="situation" className="section">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{t(lang, "Décrivez-nous votre situation")}</div>
            <h2>
              {t(lang, "Dites-nous ce qui")}
              <br />
              {t(lang, "vous gruge.")}
            </h2>
          </div>
          <p className="desc">
            {t(lang, "C'est court, promis. On vous revient sous 24h ouvrables avec une première idée de premier pas.")}
          </p>
        </div>
        <div className="situation-layout">
          <div className="reveal">
            {sent ? (
              <div className="form-success" role="status">
                <div className="form-success-icon">
                  <Icon name="check" size={24} />
                </div>
                <h3>{t(lang, "Merci !")}</h3>
                <p>{t(lang, "On vous revient sous 24h ouvrables.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-field">
                  <label htmlFor="s-metier">{t(lang, "Votre métier")}</label>
                  <select id="s-metier" aria-invalid={!!errors.metier} {...register('metier')}>
                    <option value="" disabled>
                      {t(lang, "Choisissez votre métier")}
                    </option>
                    {METIERS.map((m) => (
                      <option key={m} value={m}>
                        {t(lang, m)}
                      </option>
                    ))}
                  </select>
                  {errors.metier && <span className="field-error">{t(lang, errors.metier.message ?? '')}</span>}
                </div>
                <div className="form-field">
                  <label htmlFor="s-desc">{t(lang, "Ce qui vous prend le plus de temps")}</label>
                  <textarea
                    id="s-desc"
                    placeholder={t(lang, "Ex. : les relances de clients, les factures, les courriels qui reviennent chaque semaine… Dites-nous aussi quels outils vous utilisez déjà (Excel, Zoho, un autre logiciel).")}
                    aria-invalid={!!errors.description}
                    {...register('description')}
                  ></textarea>
                  {errors.description && <span className="field-error">{t(lang, errors.description.message ?? '')}</span>}
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="s-nom">{t(lang, "Nom")}</label>
                    <input id="s-nom" type="text" autoComplete="name" aria-invalid={!!errors.nom} {...register('nom')} />
                    {errors.nom && <span className="field-error">{t(lang, errors.nom.message ?? '')}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="s-email">{t(lang, "Courriel")}</label>
                    <input id="s-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />
                    {errors.email && <span className="field-error">{t(lang, errors.email.message ?? '')}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="s-tel">{t(lang, "Téléphone (facultatif)")}</label>
                  <input id="s-tel" type="tel" autoComplete="tel" {...register('telephone')} />
                </div>
                {/* Honeypot */}
                <div className="hp-field" aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                {error && (
                  <p role="alert" style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 12px' }}>
                    {error}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? t(lang, "Envoi…") : t(lang, "Envoyer ma situation")} <Icon name="send" size={14} />
                  </button>
                  <Link href={lienLangue(lang, APPEL.href)} className="btn btn-ghost btn-lg">
                    {t(lang, APPEL.libelle)}
                  </Link>
                </div>
              </form>
            )}
          </div>
          {/* Réassurance : les 3 étapes de « Comment on établit un prix » (textes existants, round 7) */}
          <aside className="situation-aside reveal">
            <h3 className="situation-aside-title">{t(lang, "Ce qui fait varier le prix")}</h3>
            <ul className="situation-facteurs">
              {FACTEURS.map((x) => (
                <li key={x}>{t(lang, x)}</li>
              ))}
            </ul>
            <p className="situation-aside-note">{t(lang, CONCLUSION_PRIX)}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
