'use client';

import { useState } from 'react';
import { submitContactRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';
import { Icon } from './icon';

const DOMAINES = ['Développement web', 'IA / Automatisation', 'Zoho / Administration', 'Un peu de tout'];

export function InternApplyForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nom: '',
    email: '',
    ecole: '',
    domaine: DOMAINES[0],
    lien: '',
    motivation: '',
  });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nom.trim().length < 2 || !form.email.includes('@') || form.motivation.trim().length < 10) {
      setError('Vérifiez votre nom, votre courriel et votre message de motivation.');
      return;
    }
    if (!checkRateLimit('stage', 3, 300000)) {
      setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }
    try {
      setError('');
      setSending(true);
      await submitContactRequest({
        nom: form.nom.trim(),
        email: form.email.trim(),
        sujet: 'candidature-stage',
        message: [
          `Candidature de stage — ${form.domaine}`,
          form.ecole ? `École / programme : ${form.ecole}` : null,
          form.lien ? `Lien : ${form.lien}` : null,
          '',
          form.motivation.trim(),
        ]
          .filter((l) => l !== null)
          .join('\n'),
        source: 'postuler-stagiaire',
      });
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="form-success">
        <div className="form-success-icon">
          <Icon name="check" size={24} />
        </div>
        <h3>Candidature envoyée</h3>
        <p>Merci ! Nous revenons vers vous sous 5 jours ouvrables.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="s-nom">Nom complet</label>
          <input id="s-nom" type="text" placeholder="Jean Tremblay" value={form.nom} onChange={set('nom')} required />
        </div>
        <div className="form-field">
          <label htmlFor="s-email">Courriel</label>
          <input id="s-email" type="email" placeholder="jean@exemple.ca" value={form.email} onChange={set('email')} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="s-ecole">École / programme</label>
          <input id="s-ecole" type="text" placeholder="Cégep, Techniques informatiques" value={form.ecole} onChange={set('ecole')} />
        </div>
        <div className="form-field">
          <label htmlFor="s-domaine">Domaine d&apos;intérêt</label>
          <select id="s-domaine" value={form.domaine} onChange={set('domaine')}>
            {DOMAINES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="s-lien">Lien CV / LinkedIn / Portfolio</label>
        <input id="s-lien" type="url" placeholder="https://linkedin.com/in/…" value={form.lien} onChange={set('lien')} />
      </div>
      <div className="form-field">
        <label htmlFor="s-motivation">Pourquoi ce stage vous intéresse</label>
        <textarea
          id="s-motivation"
          placeholder="Votre motivation, disponibilités, expériences pertinentes…"
          value={form.motivation}
          onChange={set('motivation')}
          required
        ></textarea>
      </div>
      {error && (
        <p style={{ color: 'oklch(0.75 0.18 25)', fontSize: 13, margin: '0 0 12px' }}>{error}</p>
      )}
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={sending}
      >
        {sending ? 'Envoi…' : 'Envoyer ma candidature'} <Icon name="send" size={14} />
      </button>
    </form>
  );
}
