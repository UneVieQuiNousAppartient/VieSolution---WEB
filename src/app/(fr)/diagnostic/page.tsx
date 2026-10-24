'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowRight, ArrowLeft, AlertTriangle, Zap, Brain, Globe, Shield, Loader2 } from 'lucide-react';
import { submitContactRequest } from '@/lib/supabase/actions';

interface DiagnosticAnswers {
  // Step 1: Website
  hasWebsite: string;
  websiteSpeed: string;
  websiteMobile: string;
  websiteSeo: string;
  // Step 2: Processes
  manualTasks: string;
  toolCount: string;
  dataEntry: string;
  // Step 3: AI Readiness
  aiUsage: string;
  chatbotInterest: string;
  automationBudget: string;
  // Step 4: Contact
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
}

interface DiagnosticResult {
  score: number;
  websiteScore: number;
  processScore: number;
  aiScore: number;
  recommendations: string[];
  priority: string;
}

function calculateDiagnostic(answers: DiagnosticAnswers): DiagnosticResult {
  let websiteScore = 0;
  let processScore = 0;
  let aiScore = 0;

  // Website scoring
  if (answers.hasWebsite === 'oui-moderne') websiteScore += 30;
  else if (answers.hasWebsite === 'oui-ancien') websiteScore += 15;
  if (answers.websiteSpeed === 'rapide') websiteScore += 25;
  else if (answers.websiteSpeed === 'moyen') websiteScore += 12;
  if (answers.websiteMobile === 'oui') websiteScore += 25;
  else if (answers.websiteMobile === 'partiellement') websiteScore += 12;
  if (answers.websiteSeo === 'oui') websiteScore += 20;
  else if (answers.websiteSeo === 'un-peu') websiteScore += 10;

  // Process scoring
  if (answers.manualTasks === 'peu') processScore += 35;
  else if (answers.manualTasks === 'quelques') processScore += 20;
  if (answers.toolCount === '1-3') processScore += 35;
  else if (answers.toolCount === '4-6') processScore += 20;
  if (answers.dataEntry === 'jamais') processScore += 30;
  else if (answers.dataEntry === 'rarement') processScore += 15;

  // AI scoring
  if (answers.aiUsage === 'avance') aiScore += 40;
  else if (answers.aiUsage === 'basique') aiScore += 20;
  if (answers.chatbotInterest === 'oui-priorite') aiScore += 30;
  else if (answers.chatbotInterest === 'interesse') aiScore += 15;
  if (answers.automationBudget === 'eleve') aiScore += 30;
  else if (answers.automationBudget === 'moyen') aiScore += 15;

  const score = Math.round((websiteScore + processScore + aiScore) / 3);

  const recommendations: string[] = [];
  let priority = '';

  if (websiteScore < 40) {
    recommendations.push('Refonte ou création de votre site web — c\'est votre vitrine principale.');
    priority = 'Site web';
  }
  if (processScore < 30) {
    recommendations.push('Automatisation urgente de vos processus — vous perdez probablement 10h+ par semaine.');
    if (!priority) priority = 'Automatisation';
  }
  if (answers.hasWebsite === 'non') {
    recommendations.push('Créer un site web professionnel est votre priorité #1 pour être trouvé en ligne.');
  }
  if (answers.manualTasks === 'beaucoup') {
    recommendations.push('Implémenter des workflows automatisés pour vos tâches répétitives (n8n, Zapier, scripts personnalisés).');
  }
  if (answers.dataEntry === 'souvent') {
    recommendations.push('Connecter vos outils entre eux pour éliminer la double saisie de données.');
  }
  if (answers.aiUsage === 'jamais') {
    recommendations.push('Commencer par un chatbot IA pour votre site — ROI rapide et visible.');
    recommendations.push('Explorer l\'IA pour la rédaction de contenu et la gestion des e-mails.');
  }
  if (answers.chatbotInterest !== 'non') {
    recommendations.push('Déployer un assistant IA pour qualifier vos leads et répondre aux questions fréquentes 24/7.');
  }
  if (aiScore < 20) {
    recommendations.push('Formation IA pour votre équipe — comprendre les opportunités avant d\'investir.');
    if (!priority) priority = 'Formation IA';
  }
  if (!priority) priority = 'Optimisation globale';

  return { score, websiteScore, processScore, aiScore, recommendations: recommendations.slice(0, 5), priority };
}

const steps = [
  {
    title: 'Votre site web',
    icon: <Globe className="w-5 h-5" />,
    questions: [
      { key: 'hasWebsite', label: 'Avez-vous un site web ?', options: [
        { value: 'oui-moderne', label: 'Oui, moderne et à jour' },
        { value: 'oui-ancien', label: 'Oui, mais il est ancien' },
        { value: 'non', label: 'Non, pas encore' },
      ]},
      { key: 'websiteSpeed', label: 'Votre site est-il rapide ?', options: [
        { value: 'rapide', label: 'Oui, très rapide' },
        { value: 'moyen', label: 'Moyen' },
        { value: 'lent', label: 'Lent ou je ne sais pas' },
      ]},
      { key: 'websiteMobile', label: 'Est-il adapté au mobile ?', options: [
        { value: 'oui', label: 'Oui, parfaitement' },
        { value: 'partiellement', label: 'Partiellement' },
        { value: 'non', label: 'Non ou je ne sais pas' },
      ]},
      { key: 'websiteSeo', label: 'Êtes-vous bien référencé sur Google ?', options: [
        { value: 'oui', label: 'Oui, en première page' },
        { value: 'un-peu', label: 'Un peu' },
        { value: 'non', label: 'Non ou je ne sais pas' },
      ]},
    ],
  },
  {
    title: 'Vos processus',
    icon: <Zap className="w-5 h-5" />,
    questions: [
      { key: 'manualTasks', label: 'Combien de tâches manuelles répétitives faites-vous ?', options: [
        { value: 'beaucoup', label: 'Beaucoup (5h+/semaine)' },
        { value: 'quelques', label: 'Quelques-unes' },
        { value: 'peu', label: 'Très peu' },
      ]},
      { key: 'toolCount', label: 'Combien d\'outils différents utilisez-vous ?', options: [
        { value: '7+', label: '7 ou plus' },
        { value: '4-6', label: '4 à 6' },
        { value: '1-3', label: '1 à 3' },
      ]},
      { key: 'dataEntry', label: 'Saisissez-vous les mêmes données dans plusieurs outils ?', options: [
        { value: 'souvent', label: 'Oui, souvent' },
        { value: 'rarement', label: 'Parfois' },
        { value: 'jamais', label: 'Jamais' },
      ]},
    ],
  },
  {
    title: 'Votre potentiel IA',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      { key: 'aiUsage', label: 'Utilisez-vous déjà l\'IA dans votre entreprise ?', options: [
        { value: 'avance', label: 'Oui, plusieurs outils IA' },
        { value: 'basique', label: 'ChatGPT ou similaire' },
        { value: 'jamais', label: 'Pas du tout' },
      ]},
      { key: 'chatbotInterest', label: 'Un chatbot IA pour votre site vous intéresse ?', options: [
        { value: 'oui-priorite', label: 'Oui, c\'est une priorité' },
        { value: 'interesse', label: 'Ça m\'intéresse' },
        { value: 'non', label: 'Pas pour le moment' },
      ]},
      { key: 'automationBudget', label: 'Budget mensuel pour l\'automatisation et l\'IA ?', options: [
        { value: 'eleve', label: '500$ +/mois' },
        { value: 'moyen', label: '100-500$/mois' },
        { value: 'faible', label: 'Moins de 100$/mois' },
      ]},
    ],
  },
];

export default function DiagnosticPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosticAnswers>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [contactStep, setContactStep] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    const diagnostic = calculateDiagnostic(answers as DiagnosticAnswers);
    setResult(diagnostic);
    setContactStep(true);
  };

  const handleSubmit = async () => {
    if (!answers.nom || !answers.email) return;
    setIsSubmitting(true);
    try {
      const rec = result?.recommendations.join('; ') || '';
      await submitContactRequest({
        nom: answers.nom,
        email: answers.email,
        telephone: answers.telephone || '',
        entreprise: answers.entreprise || '',
        sujet: 'Diagnostic gratuit',
        message: `Score: ${result?.score}/100 | Web: ${result?.websiteScore}/100 | Process: ${result?.processScore}/100 | IA: ${result?.aiScore}/100 | Priorité: ${result?.priority} | Recommandations: ${rec}`,
        source: 'diagnostic',
      });
      setSubmitted(true);
    } catch {
      // Show results anyway
      setSubmitted(true);
    }
    setIsSubmitting(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const scoreBg = (score: number) => {
    if (score >= 70) return 'from-green-500/20 to-green-500/5';
    if (score >= 40) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  // Final results view
  if (submitted && result) {
    return (
      <section className="py-20 bg-[#0a0a0f] min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Votre diagnostic</h1>
            <p className="text-gray-400 mt-2">Voici l&apos;analyse de votre maturité numérique.</p>
          </div>

          {/* Score global */}
          <div className="glass rounded-2xl p-8 text-center mb-8 border-gradient">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Score global</p>
            <p className={`text-6xl font-bold ${scoreColor(result.score)}`}>{result.score}<span className="text-2xl text-gray-500">/100</span></p>
            <p className="text-gray-400 mt-2">Priorité : <span className="text-white font-medium">{result.priority}</span></p>
          </div>

          {/* Scores détaillés */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Site web', score: result.websiteScore, icon: <Globe className="w-4 h-4" /> },
              { label: 'Processus', score: result.processScore, icon: <Zap className="w-4 h-4" /> },
              { label: 'IA', score: result.aiScore, icon: <Brain className="w-4 h-4" /> },
            ].map((item) => (
              <div key={item.label} className={`glass rounded-xl p-4 text-center bg-gradient-to-b ${scoreBg(item.score)}`}>
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">{item.icon}<span className="text-xs">{item.label}</span></div>
                <p className={`text-2xl font-bold ${scoreColor(item.score)}`}>{item.score}</p>
              </div>
            ))}
          </div>

          {/* Recommandations */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" /> Recommandations
            </h2>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Un expert vous contactera sous 24h pour discuter de vos résultats.</p>
            <a href="/contact">
              <Button variant="glow" size="lg">Discuter avec un expert</Button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Contact step
  if (contactStep) {
    return (
      <section className="py-20 bg-[#0a0a0f] min-h-screen">
        <div className="max-w-lg mx-auto px-4">
          <div className="text-center mb-8">
            <Shield className="w-10 h-10 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Vos résultats sont prêts !</h2>
            <p className="text-gray-400 mt-2">Entrez vos coordonnées pour recevoir votre diagnostic complet.</p>
          </div>
          <div className="glass rounded-2xl p-6 space-y-4">
            <Input label="Nom *" placeholder="Votre nom" value={answers.nom || ''} onChange={(e) => setAnswer('nom', e.target.value)} />
            <Input label="E-mail *" type="email" placeholder="votre@email.com" value={answers.email || ''} onChange={(e) => setAnswer('email', e.target.value)} />
            <Input label="Téléphone" type="tel" placeholder="514-000-0000" value={answers.telephone || ''} onChange={(e) => setAnswer('telephone', e.target.value)} />
            <Input label="Entreprise" placeholder="Nom de votre entreprise" value={answers.entreprise || ''} onChange={(e) => setAnswer('entreprise', e.target.value)} />
            {/* Honeypot */}
            <div className="hp-field" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <Button onClick={handleSubmit} variant="glow" size="lg" className="w-full" disabled={!answers.nom || !answers.email || isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Voir mes résultats
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz steps
  const step = steps[currentStep];

  return (
    <>
      <section className="py-12 bg-[#0a0a0f] grid-pattern">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm mb-6">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Diagnostic gratuit en 3 minutes</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Évaluez votre <span className="gradient-text">maturité numérique</span>
          </h1>
          <p className="mt-3 text-gray-400">Site web, processus, IA — découvrez vos opportunités de croissance.</p>
        </div>
      </section>

      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-2xl mx-auto px-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-[#1e1e2a]'}`} />
            ))}
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                {step.icon}
              </div>
              <h2 className="text-lg font-semibold text-white">{step.title}</h2>
              <span className="text-xs text-gray-500 ml-auto">Étape {currentStep + 1}/{steps.length}</span>
            </div>

            <div className="space-y-6">
              {step.questions.map((q) => (
                <div key={q.key}>
                  <p className="text-sm text-gray-300 mb-3">{q.label}</p>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(q.key, opt.value)}
                        className={`text-left text-sm px-4 py-3 rounded-xl border transition-all ${
                          answers[q.key as keyof DiagnosticAnswers] === opt.value
                            ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                            : 'border-[#2a2a3a] text-gray-400 hover:border-[#3a3a4a] hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              {currentStep > 0 && (
                <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Retour
                </Button>
              )}
              <Button
                onClick={() => {
                  if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
                  else handleComplete();
                }}
                className="flex-1 gap-2"
              >
                {currentStep < steps.length - 1 ? (
                  <>Suivant <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Voir mes résultats <CheckCircle className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
