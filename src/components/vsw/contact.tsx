'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations/schemas';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { Icon } from './icon';
import { phrase, t, type Lang } from '@/lib/i18n';

const PROJECT_OPTIONS = [
  phrase("Automatisation IA"),
  phrase("Agent IA"),
  phrase("Implantation Zoho"),
  phrase("Formation IA / Zoho"),
  phrase("Site ou application web"),
  phrase("Autre"),
];

export function Contact({ showIntro = true, lang = 'fr' }: { showIntro?: boolean; lang?: Lang }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (honeypotRef.current?.value) return;
    if (!checkRateLimit('contact', 3, 300000)) {
      setError(t(lang, "Trop de tentatives. Veuillez patienter quelques minutes."));
      return;
    }
    try {
      setError('');
      await submitContactRequest({ ...data, source: 'contact-home' });
      setSent(true);
    } catch {
      setError(t(lang, "Une erreur est survenue. Veuillez réessayer."));
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-wrap reveal">
          <div className="contact-left">
            {showIntro && (
              <>
                <div className="eyebrow">{t(lang, "Contact direct")}</div>
                <h2>{t(lang, "Parlons de votre projet.")}</h2>
                <p>{t(lang, "Réponse sous 24h, du lundi au vendredi. Pour les urgences, privilégiez le téléphone.")}</p>
              </>
            )}
            <div className="contact-item">
              <div className="icon"><Icon name="mail" size={16} /></div>
              <div>
                <div className="txt">{t(lang, "Courriel")}</div>
                <a className="val" href="mailto:info@viesolutionweb.ca">info@viesolutionweb.ca</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon"><Icon name="phone" size={16} /></div>
              <div>
                <div className="txt">{t(lang, "Téléphone")}</div>
                <a className="val" href="tel:+14385065243">+1 (438) 506-5243</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon"><Icon name="pin" size={16} /></div>
              <div>
                <div className="txt">{t(lang, "Adresse")}</div>
                <div className="val">{t(lang, "Québec · Canada")}</div>
              </div>
            </div>
          </div>
          <div className="contact-right">
            {sent ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <Icon name="check" size={24} />
                </div>
                <h3>{t(lang, "Message envoyé")}</h3>
                <p>{t(lang, "On revient vers vous sous 24h ouvrables.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="c-nom">{t(lang, "Nom complet")}</label>
                    <input id="c-nom" type="text" placeholder={t(lang, "Jean Tremblay")} {...register('nom')} />
                    {errors.nom && <span className="field-error">{t(lang, errors.nom.message ?? '')}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="c-email">{t(lang, "Courriel")}</label>
                    <input id="c-email" type="email" placeholder={t(lang, "jean@exemple.ca")} {...register('email')} />
                    {errors.email && <span className="field-error">{t(lang, errors.email.message ?? '')}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="c-tel">{t(lang, "Téléphone")}</label>
                    <input id="c-tel" type="tel" placeholder="(418) 555-0123" {...register('telephone')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="c-sujet">{t(lang, "Type de projet")}</label>
                    <select id="c-sujet" defaultValue={PROJECT_OPTIONS[0]} {...register('sujet')}>
                      {PROJECT_OPTIONS.map((o) => (
                        <option key={o} value={o}>{t(lang, o)}</option>
                      ))}
                    </select>
                    {errors.sujet && <span className="field-error">{t(lang, errors.sujet.message ?? '')}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="c-msg">{t(lang, "Décrivez votre projet")}</label>
                  <textarea
                    id="c-msg"
                    placeholder={t(lang, "Contexte, objectifs, délais souhaités…")}
                    {...register('message')}
                  ></textarea>
                  {errors.message && <span className="field-error">{t(lang, errors.message.message ?? '')}</span>}
                </div>
                {/* Honeypot */}
                <div className="hp-field" aria-hidden="true">
                  <input type="text" name="website" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
                </div>
                {error && (
                  <p style={{ color: 'var(--danger)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t(lang, "Envoi…") : t(lang, "Envoyer le message")} <Icon name="send" size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
