/**
 * Simple client-side security utilities
 */

// Sanitize user input to prevent XSS
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Simple rate limiter using sessionStorage
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  if (typeof window === 'undefined') return true;

  const stored = sessionStorage.getItem(`rl_${key}`);
  const now = Date.now();

  if (stored) {
    const { count, firstAttempt } = JSON.parse(stored);
    if (now - firstAttempt < windowMs) {
      if (count >= maxAttempts) return false;
      sessionStorage.setItem(`rl_${key}`, JSON.stringify({ count: count + 1, firstAttempt }));
      return true;
    }
  }

  sessionStorage.setItem(`rl_${key}`, JSON.stringify({ count: 1, firstAttempt: now }));
  return true;
}

// Honeypot check - returns true if the form is likely from a bot
export function isHoneypotFilled(formData: Record<string, unknown>): boolean {
  return Boolean(formData.website || formData.fax_number || formData.company_url);
}
