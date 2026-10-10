// Garde d'accès simple pour /admin : code d'accès (ADMIN_ACCESS_CODE) -> cookie httpOnly signé.
import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'vsw_admin';

function expectedToken(): string | null {
  const code = process.env.ADMIN_ACCESS_CODE || '';
  if (!code) return null;
  return createHash('sha256').update(`vsw|${code}`).digest('hex');
}

export function tokenForCode(code: string): string {
  return createHash('sha256').update(`vsw|${code}`).digest('hex');
}

export function isValidCode(code: string): boolean {
  const exp = expectedToken();
  return Boolean(exp && tokenForCode(code) === exp);
}

export function isAuthed(req: NextRequest): boolean {
  const exp = expectedToken();
  if (!exp) return false;
  return req.cookies.get(ADMIN_COOKIE)?.value === exp;
}
