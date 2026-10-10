// Vie Solution Web — automatisation du suivi de leads (CRM répliqué de KHI EDUC)
// - first_reply : brouillon IA de première réponse -> outreach_drafts (pending) + tâche + notification
// - relance     : brouillon de relance si lead non contacté après N heures
// Aucun courriel n'est envoyé automatiquement : tout passe par l'approbation (comme KHI/CSF).
// Déclenchée par pg_cron — header Authorization: Bearer <settings.cron_secret>.

import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const db = createClient(SUPABASE_URL, SERVICE_KEY);

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service_interest: string;
  need: string;
  status: string;
  source: string;
  note: string | null;
  estimator: unknown;
  relance_sent_at: string | null;
  last_contact_at: string | null;
  email_opt_out_at: string | null;
  created_at: string;
};

async function getSetting(key: string): Promise<unknown> {
  const { data } = await db.from('vsw_settings').select('value').eq('key', key).maybeSingle();
  return data?.value;
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function claudeDraft(lead: Lead, kind: 'first_reply' | 'relance') {
  if (!ANTHROPIC_KEY) return null;
  const context = [
    `Nom: ${lead.name}`,
    lead.company ? `Entreprise: ${lead.company}` : null,
    `Source: ${lead.source}`,
    lead.service_interest ? `Service visé: ${lead.service_interest}` : null,
    lead.need ? `Besoin exprimé: ${lead.need}` : null,
    lead.estimator ? `Estimation en ligne: ${JSON.stringify(lead.estimator)}` : null,
  ].filter(Boolean).join('\n');

  const instruction = kind === 'first_reply'
    ? 'Rédige la PREMIÈRE réponse courriel à ce lead.'
    : "Rédige une courte RELANCE courtoise : le lead n'a pas répondu depuis 48h.";

  const prompt = `Tu es Camille, fondateur de Vie Solution Web, studio québécois d'automatisation, d'IA et d'implantation Zoho pour PME. Style Dale Carnegie : sincère, humain, chaleureux, sans flatterie excessive ni jargon. Français québécois professionnel (vouvoiement). ${instruction}
Objectifs: remercier, montrer qu'on a compris le besoin précis, proposer un appel découverte gratuit de 30 minutes, une seule question simple pour avancer. 120 mots maximum pour le corps. Aucun placeholder entre crochets.
Réponds STRICTEMENT en JSON: {"subject": "...", "body": "..."}

Lead:
${context}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const text: string = json?.content?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    if (parsed.subject && parsed.body) return { subject: parsed.subject, body: parsed.body };
  } catch (_) { /* fallthrough */ }
  return null;
}

async function templateDraft(lead: Lead, kind: 'first_reply' | 'relance') {
  const prenom = lead.name.split(' ')[0] || lead.name;
  const { data } = await db.from('vsw_email_templates')
    .select('subject, body').eq('key', kind).eq('lang', 'fr').maybeSingle();
  if (data) {
    return {
      subject: data.subject.replaceAll('{{prenom}}', prenom),
      body: data.body.replaceAll('{{prenom}}', prenom),
    };
  }
  return {
    subject: 'Votre demande chez Vie Solution Web',
    body: `Bonjour ${prenom},\n\nMerci pour votre message. Quelles sont vos disponibilités pour un appel découverte gratuit de 30 minutes ?\n\nCamille — Vie Solution Web`,
  };
}

async function alreadyRan(rule: string, leadId: string) {
  const { data } = await db.from('vsw_automation_runs')
    .select('id').eq('rule_key', rule).eq('lead_id', leadId).limit(1);
  return (data?.length ?? 0) > 0;
}

async function processLead(lead: Lead, kind: 'first_reply' | 'relance') {
  if (await alreadyRan(kind, lead.id)) return 'skipped';
  if (lead.email_opt_out_at) return 'skipped';

  const ai = await claudeDraft(lead, kind);
  const draft = ai ?? (await templateDraft(lead, kind));
  const token = crypto.randomUUID();

  const { error } = await db.from('vsw_outreach_drafts').insert({
    target_type: 'lead',
    target_id: lead.id,
    kind,
    subject: draft.subject,
    body: draft.body,
    status: 'pending',
    token_hash: await sha256hex(token),
    expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    summary: { generated_by: ai ? 'claude' : 'template', source: lead.source },
  });
  if (error && !String(error.message).includes('duplicate')) throw error;

  await db.from('vsw_lead_activities').insert({
    lead_id: lead.id,
    type: 'automation',
    content: (kind === 'first_reply'
      ? 'Brouillon de première réponse généré (à approuver)'
      : 'Brouillon de relance généré (à approuver)') + ` — Sujet: ${draft.subject}`,
    meta: { kind, generated_by: ai ? 'claude' : 'template' },
  });

  await db.from('vsw_lead_tasks').insert({
    lead_id: lead.id,
    title: kind === 'first_reply'
      ? `Approuver la première réponse à ${lead.name}`
      : `Approuver la relance à ${lead.name}`,
    due_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  });

  await db.from('vsw_notifications').insert({
    recipient: 'admin',
    type: 'draft_pending',
    title: kind === 'first_reply' ? 'Nouveau brouillon — première réponse' : 'Nouveau brouillon — relance',
    body: `${lead.name} <${lead.email}> — ${draft.subject}`,
    lead_id: lead.id,
  });

  if (kind === 'relance') {
    await db.from('vsw_leads').update({ relance_sent_at: new Date().toISOString() }).eq('id', lead.id);
  }

  await db.from('vsw_automation_runs').insert({
    rule_key: kind,
    lead_id: lead.id,
    period: new Date().toISOString().slice(0, 10),
    result: 'draft_created',
    meta: { generated_by: ai ? 'claude' : 'template' },
  });
  return 'draft_created';
}

async function ruleEnabled(key: string): Promise<{ enabled: boolean; delay: number }> {
  const { data } = await db.from('vsw_automation_rules')
    .select('enabled, delay_hours').eq('key', key).maybeSingle();
  return { enabled: data?.enabled ?? false, delay: data?.delay_hours ?? 48 };
}

Deno.serve(async (req) => {
  const secret = (await getSetting('cron_secret')) as string | undefined;
  const auth = req.headers.get('authorization') ?? '';
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  const results: Record<string, number> = { first_reply: 0, relance: 0, skipped: 0 };

  // 1) first_reply — leads "Nouveau" sans brouillon
  const fr = await ruleEnabled('first_reply');
  if (fr.enabled) {
    const { data: fresh } = await db.from('vsw_leads')
      .select('*')
      .eq('status', 'Nouveau')
      .is('last_contact_at', null)
      .order('created_at', { ascending: true })
      .limit(20);
    for (const lead of (fresh ?? []) as Lead[]) {
      const r = await processLead(lead, 'first_reply');
      r === 'draft_created' ? results.first_reply++ : results.skipped++;
    }
  }

  // 2) relance — leads "Nouveau" non contactés après delay_hours
  const rl = await ruleEnabled('relance');
  if (rl.enabled) {
    const cutoff = new Date(Date.now() - rl.delay * 3600 * 1000).toISOString();
    const { data: stale } = await db.from('vsw_leads')
      .select('*')
      .eq('status', 'Nouveau')
      .is('last_contact_at', null)
      .is('relance_sent_at', null)
      .lt('created_at', cutoff)
      .order('created_at', { ascending: true })
      .limit(20);
    for (const lead of (stale ?? []) as Lead[]) {
      const r = await processLead(lead, 'relance');
      r === 'draft_created' ? results.relance++ : results.skipped++;
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
