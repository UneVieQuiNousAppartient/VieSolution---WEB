// Connexion de Google Agenda (étape C) : session admin complète → redirection vers Google.
// Le jeton « state » (signé, 10 minutes) est posé en cookie SameSite=Lax : il revient avec la
// redirection de Google, ce que le cookie de session (SameSite=Strict) ne fait pas.
import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/admin-auth';
import { COOKIE_ETAT, googleConfigure, nouvelEtat, urlAutorisation } from '@/lib/agenda-google';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.redirect(new URL('/admin', req.url));
  if (!googleConfigure()) return NextResponse.redirect(new URL('/admin?google=configuration', req.url));
  const etat = nouvelEtat();
  const res = NextResponse.redirect(urlAutorisation(etat));
  res.cookies.set(COOKIE_ETAT, etat, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 600, path: '/api/admin/google' });
  return res;
}
