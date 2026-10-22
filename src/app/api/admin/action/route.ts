import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { getAdminClient, hasServiceKey } from '@/lib/supabase/admin';
import { estStatut } from '@/lib/crm/regles';
import { desabonnerAdresse, noterContact, recalculerProchaineAction } from '@/lib/crm/fiche';

export const dynamic = 'force-dynamic';

type ActionBody = {
  type: 'draft_status' | 'draft_sent' | 'lead_status' | 'task_done' | 'notif_read' | 'contact' | 'opt_out';
  id: string;
  value?: string;
};

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!hasServiceKey()) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY manquant' }, { status: 500 });
  }
  const body = (await req.json().catch(() => null)) as ActionBody | null;
  if (!body?.type || !body?.id) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
  const db = getAdminClient();
  const now = new Date().toISOString();

  try {
    if (body.type === 'draft_status') {
      const status = body.value === 'approved' ? 'approved' : 'rejected';
      const { data: draft, error } = await db
        .from('vsw_outreach_drafts')
        .update({ status, approved_by: 'admin', approved_at: now })
        .eq('id', body.id)
        .select('target_id, kind, subject')
        .single();
      if (error) throw error;
      await db.from('vsw_lead_activities').insert({
        lead_id: draft.target_id,
        type: 'automation',
        content: `Brouillon ${draft.kind} ${status === 'approved' ? 'approuvé' : 'rejeté'} — ${draft.subject}`,
        author: 'admin',
      });
    } else if (body.type === 'draft_sent') {
      const { data: draft, error } = await db
        .from('vsw_outreach_drafts')
        .update({ status: 'sent', approved_by: 'admin', approved_at: now })
        .eq('id', body.id)
        .select('target_id, kind, subject')
        .single();
      if (error) throw error;
      // Courriel envoyé par Camille : contact humain — arrête les relances automatiques.
      await noterContact(db, draft.target_id, 'courriel', `Courriel envoyé (${draft.kind}) — ${draft.subject}`);
    } else if (body.type === 'lead_status') {
      if (!estStatut(body.value)) {
        return NextResponse.json({ error: 'étape inconnue' }, { status: 400 });
      }
      const status = body.value;
      const { error } = await db
        .from('vsw_leads')
        .update({
          status,
          status_changed_at: now,
          ...(status === 'Contacté' ? { last_contact_at: now } : {}),
        })
        .eq('id', body.id);
      if (error) throw error;
      await db.from('vsw_lead_activities').insert({
        lead_id: body.id,
        type: 'note',
        content: `Statut changé → ${status}`,
        author: 'admin',
      });
    } else if (body.type === 'task_done') {
      const { data: task, error } = await db.from('vsw_lead_tasks').update({ done_at: now }).eq('id', body.id).select('lead_id').single();
      if (error) throw error;
      await recalculerProchaineAction(db, task.lead_id);
    } else if (body.type === 'notif_read') {
      const { error } = await db.from('vsw_notifications').update({ read_at: now }).eq('id', body.id);
      if (error) throw error;
    } else if (body.type === 'contact') {
      // Contact humain saisi dans /admin (appel, courriel, SMS, rendez-vous) : arrête les relances.
      const genres = ['appel', 'courriel', 'sms', 'rdv'] as const;
      const genre = genres.find((g) => g === body.value);
      if (!genre) return NextResponse.json({ error: 'type de contact inconnu' }, { status: 400 });
      const libelles = { appel: 'Appel', courriel: 'Courriel', sms: 'SMS', rdv: 'Rendez-vous' };
      await noterContact(db, body.id, genre, `${libelles[genre]} noté par l'équipe`);
    } else if (body.type === 'opt_out') {
      // Désabonnement reçu par téléphone ou par courriel (LCAP) : toute l'adresse est désabonnée.
      const { data: lead, error } = await db.from('vsw_leads').select('id, email').eq('id', body.id).single();
      if (error) throw error;
      await desabonnerAdresse(db, lead, 'admin', 'admin');
    } else {
      return NextResponse.json({ error: 'bad request' }, { status: 400 });
    }

    await db.from('vsw_admin_audit_log').insert({
      actor: 'admin',
      action: body.type,
      target_type: body.type.startsWith('draft') ? 'outreach_draft' : body.type === 'contact' || body.type === 'opt_out' ? 'lead' : body.type.split('_')[0],
      target_id: body.id,
      meta: body.value ? { value: body.value } : {},
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'erreur inconnue';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
