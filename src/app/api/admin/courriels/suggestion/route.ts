// Suggestion de réponse par l'IA (étape B, accord de Camille du 2026-10-23 : modèle Haiku, l'IA choisit
// parmi les modèles approuvés et n'invente rien — règles dans src/lib/crm/suggestion.ts).
//   POST { cle } → { modele, sujet, corps, raison, ajouts, crochets } ; rien n'est envoyé ni enregistré.
// Le courriel reçu est une donnée non fiable : balisé comme donnée, jamais suivi comme consigne ; un
// montant dans la proposition la fait écarter ; les chiffres et liens absents des sources sont signalés.
// Aucune conversation n'est écrite dans les journaux.
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { contientMontant } from '@/lib/chat/regles';
import { lireConversation, modelesPour, suggestionIaActive } from '@/lib/crm/boite';
import {
  AUCUN,
  CONSIGNE_SUGGESTION,
  ajoutsASurveiller,
  crochetsRestants,
  demandeSuggestion,
  lireProposition,
  outilSuggestion,
} from '@/lib/crm/suggestion';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Même modèle que l'assistant du site (Haiku, choisi par Camille pour son coût). */
const MODELE = 'claude-haiku-5-5';
/** Suggestions par jour (borne la facture). */
const PAR_JOUR = 80;

const refus = (error: string, status = 400) => NextResponse.json({ error }, { status });

let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic({ timeout: 30_000, maxRetries: 1 }));

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return refus('unauthorized', 401);
  if (!hasServiceKey()) return refus('SUPABASE_SERVICE_ROLE_KEY manquant', 500);
  if (!process.env.ANTHROPIC_API_KEY) return refus('L’IA n’est pas branchée (clé Anthropic manquante dans Vercel).', 503);
  const body = (await req.json().catch(() => null)) as { cle?: unknown } | null;
  const db = getAdminClient();

  let conv: Awaited<ReturnType<typeof lireConversation>>;
  let modeles: Awaited<ReturnType<typeof modelesPour>>;
  try {
    if (!(await suggestionIaActive(db))) return refus('La suggestion par l’IA n’est pas encore activée.', 503);
    conv = await lireConversation(db, body?.cle);
    if (!conv) return refus('conversation introuvable', 404);
    if (!conv.messages.some((m) => m.direction === 'in')) return refus('Aucun courriel reçu à qui répondre.');
    modeles = await modelesPour(db, conv.fiche?.name ?? null);
    if (!modeles.length) return refus('Aucun modèle de réponse en place.');
    if ((await compterEssai(db, 'suggestion_j', 86_400)) > PAR_JOUR) return refus('Limite de suggestions atteinte pour aujourd’hui. Insérez un modèle à la main.', 429);
  } catch (e) {
    console.error('[admin] suggestion :', e instanceof Error ? e.message : e);
    return refus('Suggestion impossible pour le moment.', 500);
  }

  const cles = modeles.map((m) => m.cle);
  const messages = conv.messages.map((m) => ({
    deNous: m.direction !== 'in',
    date: m.received_at.slice(0, 10),
    sujet: m.subject,
    texte: m.body_text || m.snippet,
  }));
  const f = conv.fiche;
  try {
    const r = await anthropic().messages.create({
      model: MODELE,
      max_tokens: 1500,
      thinking: { type: 'disabled' },
      output_config: { effort: 'low' },
      system: CONSIGNE_SUGGESTION,
      tools: [outilSuggestion(cles)],
      tool_choice: { type: 'tool', name: 'proposer_reponse' },
      messages: [
        {
          role: 'user',
          content: demandeSuggestion(
            modeles.map((m) => ({ cle: m.cle, sujet: m.sujet, corps: m.corps })),
            f ? { nom: f.name, entreprise: f.company, besoin: f.need, etape: f.status } : null,
            messages,
          ),
        },
      ],
    });
    if (r.stop_reason === 'refusal') return NextResponse.json({ modele: AUCUN, sujet: '', corps: '', raison: 'L’IA a refusé de proposer une réponse à ce courriel.', ajouts: [], crochets: [] });
    const outil = r.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === 'proposer_reponse');
    const p = outil ? lireProposition(outil.input, cles) : null;
    if (!p) return refus('La proposition de l’IA était inutilisable. Insérez un modèle à la main.', 502);
    if (p.modele === AUCUN) return NextResponse.json({ ...p, ajouts: [], crochets: [] });
    // Un prix n'apparaît jamais dans une proposition (aucun montant n'est donné par écrit avant l'appel).
    if (contientMontant(`${p.sujet}\n${p.corps}`)) {
      return NextResponse.json({ modele: AUCUN, sujet: '', corps: '', raison: 'La proposition contenait un montant : elle a été écartée. Insérez un modèle à la main.', ajouts: [], crochets: [] });
    }
    const modele = modeles.find((m) => m.cle === p.modele)!;
    const sources = [modele.sujet, modele.corps, ...messages.map((m) => `${m.sujet}\n${m.texte}`), f ? `${f.name} ${f.company || ''} ${f.need || ''}` : ''];
    return NextResponse.json({
      ...p,
      ajouts: ajoutsASurveiller(`${p.sujet}\n${p.corps}`, sources, `${modele.sujet}\n${modele.corps}`),
      crochets: crochetsRestants(`${p.sujet}\n${p.corps}`),
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      const motif = (e.error as { error?: { type?: string; message?: string } } | undefined)?.error;
      console.error('suggestion: échec de l’appel à l’IA', e.status, motif?.type ?? '', String(motif?.message ?? '').slice(0, 200));
    } else console.error('suggestion: échec de l’appel à l’IA', 'réseau');
    return refus('L’IA ne répond pas pour le moment. Insérez un modèle à la main.', 502);
  }
}
