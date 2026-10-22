// Assistant IA de la bulle de clavardage (src/components/vsw/chatbot.tsx). Demande de Camille du
// 2026-10-22 : répondre à partir du site seulement, bloquer les questions malveillantes.
//
// - La clé ANTHROPIC_API_KEY est saisie par Camille dans Vercel ; sans elle, la route répond
//   { repli: true } et la bulle reprend ses réponses toutes faites.
// - Aucune conversation n'est enregistrée (ni en base ni dans les journaux) : seuls des compteurs
//   par adresse IP (vsw_rate_limit_hit) bornent l'usage et la facture.
// - L'IA ne peut rien envoyer : l'outil proposer_rendez_vous ne fait qu'afficher un résumé, que le
//   visiteur relit et envoie lui-même (même enregistrement que le formulaire de rendez-vous).
// - Pas de modèle de repli en cas de refus de l'IA : sur ce site, un refus veut dire une question
//   hors sujet ou malveillante, et la réponse fixe REPONSES.refus suffit.
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { compterEssai } from '@/lib/admin/mfa-store';
import { consigneAssistant } from '@/lib/chat/connaissances';
import {
  LIMITES,
  QUOTAS,
  REPONSES,
  cleIp,
  filtrerReponse,
  historiqueDetourne,
  messagesVisiteur,
  validerDemandeRdv,
  validerHistorique,
} from '@/lib/chat/regles';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Modèle de l'assistant : Haiku, choisi par Camille le 2026-10-22 pour son coût (SUIVI-TACHES.md § 27-28). */
const MODELE = 'claude-haiku-5-5';

const OUTIL_RDV: Anthropic.Tool = {
  name: 'proposer_rendez_vous',
  description:
    "Affiche au visiteur le résumé de sa demande d'appel découverte gratuit ; il la relit et l'envoie lui-même. Appelle cet outil dès que le visiteur veut un rendez-vous et que tu connais au moins son nom et son courriel. N'appelle pas cet outil pour autre chose.",
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      nom: { type: 'string', description: 'Nom du visiteur, tel qu’il l’a écrit.' },
      courriel: { type: 'string', description: 'Courriel du visiteur, tel qu’il l’a écrit.' },
      moment: { type: 'string', description: 'Moment qui lui convient, en ses mots ; chaîne vide s’il ne l’a pas dit.' },
      besoin: { type: 'string', description: 'Son besoin en une phrase ; chaîne vide s’il ne l’a pas dit.' },
    },
    required: ['nom', 'courriel', 'moment', 'besoin'],
    additionalProperties: false,
  },
};

type Reponse = { texte: string; proposition?: { nom: string; courriel: string; moment: string; besoin: string }; fin?: boolean };

const repondre = (r: Reponse) => NextResponse.json(r);
const repli = (status: number) => NextResponse.json({ repli: true, texte: REPONSES.indisponible }, { status });

let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic({ timeout: 25_000, maxRetries: 1 }));

/** La bulle demande, à son ouverture, si l'IA est branchée (sinon : réponses toutes faites). */
export function GET() {
  return NextResponse.json({ actif: Boolean(process.env.ANTHROPIC_API_KEY) && hasServiceKey() });
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY || !hasServiceKey()) return repli(503);

  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
  const h = validerHistorique(body?.messages);
  if (!h.ok) return NextResponse.json({ error: h.erreur }, { status: 400 });
  const messages = h.messages;
  const fin = messagesVisiteur(messages) >= LIMITES.messagesParConversation;

  // Sur Vercel, x-real-ip et x-forwarded-for sont posés par la plateforme (non falsifiables par le visiteur).
  // Les compteurs ne gardent qu'une empreinte de l'adresse (Loi 25), effacée après 24 h (src/lib/crm/tick.ts).
  const adresse = cleIp(req.headers.get('x-real-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0]);
  const ip = createHash('sha256').update(`${process.env.CRON_SECRET || ''}:chat:${adresse}`).digest('hex').slice(0, 32);
  try {
    const db = getAdminClient();
    const [heure, jour, site] = await Promise.all([
      compterEssai(db, `chat_h:${ip}`, 3600),
      compterEssai(db, `chat_j:${ip}`, 86_400),
      compterEssai(db, 'chat_site', 86_400),
    ]);
    if (heure > QUOTAS.parIpHeure || jour > QUOTAS.parIpJour || site > QUOTAS.siteJour) {
      return NextResponse.json({ texte: REPONSES.limite, fin: true }, { status: 429 });
    }
  } catch {
    return repli(503);
  }

  // Tout l'historique : un détournement peut être glissé dans un ancien message forgé.
  if (historiqueDetourne(messages)) return repondre({ texte: REPONSES.detournement, fin });

  try {
    const r = await anthropic().messages.create({
      model: MODELE,
      max_tokens: 500, // la consigne demande 80 mots au plus
      // Sans réflexion préalable (permis sur Haiku jusqu'à l'effort « high ») : réponse plus rapide et moins chère.
      thinking: { type: 'disabled' },
      output_config: { effort: 'low' },
      system: [{ type: 'text', text: consigneAssistant(), cache_control: { type: 'ephemeral' } }],
      tools: [OUTIL_RDV],
      messages: messages.map((m) => ({ role: m.role, content: m.text })),
    });

    if (r.stop_reason === 'refusal') return repondre({ texte: REPONSES.refus, fin });

    const texte = r.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    const outil = r.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === OUTIL_RDV.name);
    if (outil) {
      const d = validerDemandeRdv(outil.input);
      if (d.ok) return repondre({ texte: REPONSES.proposition, proposition: d.demande, fin });
      return repondre({ texte: `${d.erreur} Pouvez-vous me le redonner ?`, fin });
    }
    return repondre({ texte: filtrerReponse(texte), fin });
  } catch (e) {
    // Jamais le contenu de la conversation dans les journaux : le statut, le type et le motif donnés
    // par l'API (ex. crédits épuisés, paramètre refusé), qui ne reprennent pas les messages du visiteur.
    if (e instanceof Anthropic.APIError) {
      const motif = (e.error as { error?: { type?: string; message?: string } } | undefined)?.error;
      console.error('chat: échec de l’appel à l’IA', e.status, motif?.type ?? '', String(motif?.message ?? '').slice(0, 200));
    } else console.error('chat: échec de l’appel à l’IA', 'réseau');
    return repli(502);
  }
}
