'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/validations/schemas';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { Icon } from './icon';

const PROJECT_OPTIONS = [
  'Automatisation IA',
  'Agent IA',
  'Implantation Zoho',
  'Formation IA / Zoho',
  'Site web',
  'Autre',
];

export function Contact({ showIntro = true }: { showIntro?: boolean }) {
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
      setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }
    try {
      setError('');
      await submitContactRequest({ ...data, source: 'contact-home' });
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="contact-wrap reveal">
          <div className="contact-left">
            {showIntro && (
              <>
                <div className="eyebrow">Contact direct</div>
                <h2>Parlons de votre projet.</h2>
                <p>Réponse sous 24h, du lundi au vendredi. Pour les urgences, privilégiez le téléphone.</p>
              </>
            )}
            <div className="contact-item">
              <div className="icon"><Icon name="mail" size={16} /></div>
              <div>
                <div className="txt">Courriel</div>
                <div className="val">bonjour@viesolutionweb.ca</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon"><Icon name="phone" size={16} /></div>
              <div>
                <div className="txt">Téléphone</div>
                <div className="val">+1 (418) 555-0143</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon"><Icon name="pin" size={16} /></div>
              <div>
                <div className="txt">Adresse</div>
                <div className="val">Québec · Canada</div>
              </div>
            </div>
          </div>
          <div className="contact-right">
            {sent ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <Icon name="check" size={24} />
                </div>
                <h3>Message envoyé</h3>
                <p>On revient vers vous sous 24h ouvrables.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="c-nom">Nom complet</label>
                    <input id="c-nom" type="text" placeholder="Jean Tremblay" {...register('nom')} />
                    {errors.nom && <span className="field-error">{errors.nom.message}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="c-email">Courriel</label>
                    <input id="c-email" type="email" placeholder="jean@exemple.ca" {...register('email')} />
                    {errors.email && <span className="field-error">{errors.email.message}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="c-tel">Téléphone</label>
                    <input id="c-tel" type="tel" placeholder="(418) 555-0123" {...register('telephone')} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="c-sujet">Type de projet</label>
                    <select id="c-sujet" defaultValue={PROJECT_OPTIONS[0]} {...register('sujet')}>
                      {PROJECT_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    {errors.sujet && <span className="field-error">{errors.sujet.message}</span>}
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="c-msg">Décrivez votre projet</label>
                  <textarea
                    id="c-msg"
                    placeholder="Contexte, objectifs, délais souhaités…"
                    {...register('message')}
                  ></textarea>
                  {errors.message && <span className="field-error">{errors.message.message}</span>}
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
                  {isSubmitting ? 'Envoi…' : 'Envoyer le message'} <Icon name="send" size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
