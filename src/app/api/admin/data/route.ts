import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { construireAujourdhui } from '@/lib/crm/aujourdhui';
import { listerRegles } from '@/lib/crm/moteur';
import { cleConversation } from '@/lib/crm/entrant';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!hasServiceKey()) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY n'est pas défini dans .env.local" },
      { status: 500 }
    );
  }
  const db = getAdminClient();

  const depuis = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const [leads, drafts, tasks, notifications, boite] = await Promise.all([
    db.from('vsw_leads').select('*').order('created_at', { ascending: false }).limit(200),
    db.from('vsw_outreach_drafts').select('*').order('created_at', { ascending: false }).limit(100),
    db.from('vsw_lead_tasks').select('*').is('done_at', null).order('due_at', { ascending: true }).limit(200),
    db.from('vsw_notifications').select('*').is('read_at', null).order('created_at', { ascending: false }).limit(50),
    // Boîte de réception : courriels reçus ni traités ni ignorés (même fenêtre que /api/admin/courriels),
    // comptés par conversation comme dans la boîte (une personne qui écrit 3 fois compte pour 1).
    db.from('vsw_email_messages').select('lead_id, from_email, to_email, direction').eq('direction', 'in').is('traite_at', null).is('ignore_at', null).gte('received_at', depuis).limit(500),
  ]);

  const firstError = leads.error || drafts.error || tasks.error || notifications.error;
  if (firstError) {
    return NextResponse.json(
      {
        error: firstError.message,
        hint: "Les tables du CRM n'existent probablement pas encore dans le projet Supabase configuré. Exécutez supabase/setup-crm-vsw.sql dans le projet Supabase (VieSolutionCSF), et vérifiez SUPABASE_SERVICE_ROLE_KEY dans .env.local.",
      },
      { status: 500 }
    );
  }

  let regles: Awaited<ReturnType<typeof listerRegles>> = [];
  try {
    regles = await listerRegles(db);
  } catch (e) {
    console.error('[admin] règles :', e instanceof Error ? e.message : e);
  }

  return NextResponse.json({
    leads: leads.data ?? [],
    drafts: drafts.data ?? [],
    tasks: tasks.data ?? [],
    notifications: notifications.data ?? [],
    aujourdhui: construireAujourdhui({
      leads: leads.data ?? [],
      taches: tasks.data ?? [],
      brouillons: drafts.data ?? [],
      alertes: notifications.data ?? [],
    }),
    regles,
    // Colonnes traite_at / ignore_at absentes (SQL de l'étape B pas encore passé) : 0, sans bloquer l'admin.
    boite: boite.error ? 0 : new Set((boite.data ?? []).map(cleConversation)).size,
  });
}
