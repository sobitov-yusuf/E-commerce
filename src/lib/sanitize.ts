// Universal Telegram Mini App (TMA) E-Commerce — Input Sanitization & Security Helper
// Prevents XSS attacks, strips harmful HTML tags, and provides safe input cleaning

/**
 * Escapes HTML special characters to prevent XSS (Cross-Site Scripting)
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes text input by stripping dangerous tags and trimming whitespace
 */
export function sanitizeInput(input?: string | null): string {
  if (!input || typeof input !== 'string') return '';
  // Remove HTML tags and script elements
  const clean = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
  return escapeHtml(clean);
}

/**
 * Validates and sanitizes phone numbers (Uzbekistan & international format)
 */
export function sanitizePhone(phone?: string | null): string {
  if (!phone) return '';
  // Keep only digits and '+'
  return phone.replace(/[^\d+]/g, '').trim();
}

/**
 * Safely parses integer IDs to prevent NaN or injection anomalies
 */
export function safeParseInt(val: any, fallback: number = 0): number {
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Safely parses positive decimal numbers
 */
export function safeParseFloat(val: any, fallback: number = 0): number {
  const parsed = parseFloat(String(val));
  return isNaN(parsed) || parsed < 0 ? fallback : parsed;
}
