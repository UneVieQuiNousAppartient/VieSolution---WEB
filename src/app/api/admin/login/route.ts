import { NextRequest, NextResponse } from 'next/server';
import { isValidCode, tokenForCode, ADMIN_COOKIE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({ code: '' }));
  if (!process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json(
      { error: "ADMIN_ACCESS_CODE n'est pas défini dans .env.local" },
      { status: 500 }
    );
  }
  if (typeof code !== 'string' || !isValidCode(code)) {
    return NextResponse.json({ error: "Code d'accès invalide" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, tokenForCode(code), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return res;
}
