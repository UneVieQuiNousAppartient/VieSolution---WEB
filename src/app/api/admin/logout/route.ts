import { NextResponse } from 'next/server';
import { effacerSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  effacerSession(res);
  return res;
}
