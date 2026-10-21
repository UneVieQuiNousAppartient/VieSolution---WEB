// Garde d'accès de /admin : code d'accès (ADMIN_ACCESS_CODE) + double vérification (code à 6 chiffres
// d'une application d'authentification, src/lib/admin/mfa.ts) → cookie httpOnly signé avec le secret
// serveur ADMIN_SECRET (jamais avec le seul code d'accès, que connaît la personne qui se connecte), 8 h.
// Une session sans double vérification (m = 0) ne sert qu'à l'activer : aucune donnée n'est servie.
import type { NextRequest, NextResponse } from 'next/server';
import { DUREE_SESSION_S, cleSession, lireSession, secretServeur, signerSession } from '@/lib/admin/mfa';

export const ADMIN_COOKIE = 'vsw_admin';

export const codeAcces = () => process.env.ADMIN_ACCESS_CODE || '';
const cle = () => cleSession(secretServeur(), codeAcces());

/** Session en cours ({ mfa }) ou null. */
export function sessionAdmin(req: NextRequest): { mfa: boolean } | null {
  return lireSession(req.cookies.get(ADMIN_COOKIE)?.value, cle());
}

/** Accès complet : code d'accès ET double vérification. */
export function isAuthed(req: NextRequest): boolean {
  return sessionAdmin(req)?.mfa === true;
}

export function poserSession(res: NextResponse, mfa: boolean) {
  res.cookies.set(ADMIN_COOKIE, signerSession(cle(), mfa), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DUREE_SESSION_S,
    path: '/',
  });
}

export function effacerSession(res: NextResponse) {
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 0, path: '/' });
}
