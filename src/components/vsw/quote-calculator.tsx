'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icon';
import { submitEstimateurRequest } from '@/lib/supabase/actions';
import { checkRateLimit } from '@/lib/utils/security';

/* Tarifs indicatifs — [à confirmer] par VieSolution avant mise en ligne */
const PROJECT_TYPES = [
  { id: 'auto', label: 'Automatisation IA', base: 1800, unit: null as string | null, units: 0 },
  { id: 'agent', label: 'Agent IA', base: 4500, unit: null, units: 0 },
  { id: 'zoho', label: 'Implantation Zoho', base: 3200, unit: 'Utilisateurs Zoho', units: 5 },
  { id: 'formation', label: 'Formation IA / Zoho', base: 1500, unit: 'Personnes à former', units: 5 },
  { id: 'site', label: 'Site web', base: 2400, unit: 'Nombre de pages', units: 5 },
  { id: 'autre', label: 'Autre', base: 2000, unit: null, units: 0 },
];

const FEATURES = [
  { id: 'crm', label: 'Zoho CRM', price: 700 },
  { id: 'books', label: 'Zoho Books', price: 700 },
  { id: 'desk', label: 'Zoho Desk', price: 600 },
  { id: 'flow', label: 'Automatisations inter-apps', price: 900 },
  { id: 'agent', label: 'Agent IA intégré', price: 1600 },
  { id: 'api', label: 'Intégrations API', price: 1100 },
  { id: 'dashboard', label: 'Tableau de bord', price: 1400 },
  { id: 'formation', label: 'Formation incluse', price: 800 },
];

const TIMELINES = [
  { id: 'flex', label: 'Flexible', mult: 1.0 },
  { id: 'normal', label: '4-6 sem.', mult: 1.1 },
  { id: 'rush', label: 'Urgent', mult: 1.3 },
];

const UNIT_PRICE = 150; // $ par unité au-delà de 3 — [à confirmer]

export function QuoteCalculator({ showHead = true }: { showHead?: boolean }) {
  const [type, setType] = useState('auto');
  const [units, setUnits] = useState(5);
  const [features, setFeatures] = useState<string[]>(['flow']);
  const [timeline, setTimeline] = useState('normal');
  const [leadNom, setLeadNom] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState('');

  const proj = PROJECT_TYPES.find((p) => p.id === type)!;

  const estimate = useMemo(() => {
    const tl = TIMELINES.find((t) => t.id === timeline)!;
    const unitPrice = proj.unit ? Math.max(0, units - 3) * UNIT_PRICE : 0;
    const featPrice = features.reduce(
      (s, id) => s + (FEATURES.find((f) => f.id === id)?.price || 0),
      0
    );
    const sub = proj.base + unitPrice + featPrice;
    const total = Math.round(sub * tl.mult);
    return { base: proj.base, unitPrice, featPrice, total, tl };
  }, [proj, units, features, timeline]);

  const toggleFeat = (id: string) =>
    setFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const fmt = (n: number) => n.toLocaleString('fr-CA');
  const low = Math.round(estimate.total * 0.9);
  const high = Math.round(estimate.total * 1.15);

  const sendEstimate = async () => {
    if (leadNom.trim().length < 2 || !leadEmail.includes('@')) {
      setLeadError('Indiquez votre nom et un courriel valide.');
      return;
    }
    if (!checkRateLimit('estimateur', 3, 300000)) {
      setLeadError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }
    try {
      setLeadError('');
      setLeadSending(true);
      await submitEstimateurRequest({
        nom: leadNom.trim(),
        email: leadEmail.trim(),
        type_projet: proj.label,
        delai: TIMELINES.find((t) => t.id === timeline)?.label,
        fonctionnalites: features
          .map((id) => FEATURES.find((f) => f.id === id)?.label)
          .filter((l): l is string => !!l),
        description: proj.unit ? `${proj.unit} : ${units}` : undefined,
        resultat_estimation: `${fmt(estimate.total)} $ CAD (fourchette ${fmt(low)} – ${fmt(high)})`,
      });
      setLeadSent(true);
    } catch {
      setLeadError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLeadSending(false);
    }
  };

  return (
    <section id="devis" className="section">
      <div className="container">
        {showHead && (
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">Devis en ligne</div>
              <h2>Estimez votre projet<br />en 30 secondes.</h2>
            </div>
            <p className="desc">
              Un outil transparent pour obtenir une fourchette de prix indicative.
              Ajustez les paramètres et voyez l&apos;estimation s&apos;actualiser en temps réel.
              Le tarif final est confirmé lors d&apos;un appel découverte.
            </p>
          </div>
        )}

        <div className="calc-wrap reveal">
          <div className="calc-form">
            <h3>Paramètres du projet</h3>

            <div className="calc-group">
              <label className="calc-label">Type de projet</label>
              <div className="calc-options">
                {PROJECT_TYPES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={'calc-option' + (type === p.id ? ' active' : '')}
                    onClick={() => {
                      setType(p.id);
                      setUnits(p.units || 5);
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {proj.unit && (
              <div className="calc-group">
                <label className="calc-label">
                  {proj.unit} — <span style={{ color: 'var(--accent)' }}>{units}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={units}
                  className="calc-slider"
                  onChange={(e) => setUnits(+e.target.value)}
                />
              </div>
            )}

            <div className="calc-group">
              <label className="calc-label">Fonctionnalités</label>
              <div className="calc-options" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {FEATURES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={'calc-option' + (features.includes(f.id) ? ' active' : '')}
                    onClick={() => toggleFeat(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-group">
              <label className="calc-label">Échéancier</label>
              <div className="calc-options">
                {TIMELINES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={'calc-option' + (timeline === t.id ? ' active' : '')}
                    onClick={() => setTimeline(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="calc-preview">
            <div className="estimate-label">Estimation indicative</div>
            <div className="estimate-amount">
              <span className="currency">$</span>
              {fmt(estimate.total)}
            </div>
            <div className="estimate-range">
              Fourchette : {fmt(low)} — {fmt(high)} CAD · taxes en sus
            </div>

            <div className="estimate-breakdown">
              <div className="estimate-line">
                <span>Base — {proj.label}</span>
                <span>${fmt(estimate.base)}</span>
              </div>
              {estimate.unitPrice > 0 && (
                <div className="estimate-line">
                  <span>{proj.unit} supplémentaires</span>
                  <span>+ ${fmt(estimate.unitPrice)}</span>
                </div>
              )}
              {estimate.featPrice > 0 && (
                <div className="estimate-line">
                  <span>Fonctionnalités ({features.length})</span>
                  <span>+ ${fmt(estimate.featPrice)}</span>
                </div>
              )}
              {estimate.tl.mult !== 1 && (
                <div className="estimate-line muted">
                  <span>Ajustement délai — {estimate.tl.label}</span>
                  <span>× {estimate.tl.mult}</span>
                </div>
              )}
            </div>

            {leadSent ? (
              <div className="booking-confirm" style={{ marginTop: 32 }}>
                <Icon name="check" size={16} /> Estimation envoyée ! On vous revient sous
                24h ouvrables avec une soumission détaillée.
              </div>
            ) : (
              <div style={{ marginTop: 32 }}>
                <div className="calc-label" style={{ marginBottom: 10 }}>
                  Recevoir cette estimation
                </div>
                <div className="form-row">
                  <div className="form-field" style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={leadNom}
                      onChange={(e) => setLeadNom(e.target.value)}
                      aria-label="Votre nom"
                    />
                  </div>
                  <div className="form-field" style={{ marginBottom: 12 }}>
                    <input
                      type="email"
                      placeholder="vous@exemple.ca"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      aria-label="Votre courriel"
                    />
                  </div>
                </div>
                {leadError && (
                  <p style={{ color: 'oklch(0.75 0.18 25)', fontSize: 13, margin: '0 0 10px' }}>
                    {leadError}
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-primary calc-cta"
                  style={{ marginTop: 0 }}
                  disabled={leadSending}
                  onClick={sendEstimate}
                >
                  {leadSending ? 'Envoi…' : 'Recevoir ma soumission'} <Icon name="send" size={14} />
                </button>
              </div>
            )}
            <Link
              href="/rdv"
              className="btn btn-ghost btn-lg calc-cta"
              style={{ marginTop: 12 }}
            >
              Confirmer avec un RDV <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
