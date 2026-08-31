// Universal Telegram Mini App (TMA) E-Commerce — Telegram HMAC & Deep Linking Utilities
// Adheres strictly to docs/Telegram_integratsiya.md and docs/Talablar.md

import crypto from 'crypto';
import { TelegramUser, TelegramAuthResult } from '@/types';

/**
 * 🛡️ HMAC-SHA256 initData Verification Algorithm
 * Checks Telegram WebApp initData authenticity and freshness (max 1-2 hours / 7200 sec)
 */
export function verifyTelegramInitData(
  initDataRaw: string,
  botToken: string,
  maxAgeSeconds: number = 7200 // Max 2 hours freshness to prevent Replay Attacks
): TelegramAuthResult {
  if (!initDataRaw || !botToken) {
    return { isValid: false };
  }

  try {
    const urlParams = new URLSearchParams(initDataRaw);
    const hash = urlParams.get('hash');
    if (!hash) {
      return { isValid: false };
    }

    urlParams.delete('hash');

    // 1. Sort keys alphabetically and form data-check-string
    const params: string[] = [];
    for (const [key, value] of urlParams.entries()) {
      params.push(`${key}=${value}`);
    }
    params.sort();
    const dataCheckString = params.join('\n');

    // 2. Generate secret key: HMAC-SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // 3. Compare calculated hash with Telegram hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return { isValid: false };
    }

    // 4. Verify auth_date freshness (Replay Attack protection - maxAgeSeconds)
    const authDateStr = urlParams.get('auth_date');
    if (!authDateStr) {
      return { isValid: false };
    }

    const authDate = parseInt(authDateStr, 10);
    const now = Math.floor(Date.now() / 1000);

    if (isNaN(authDate) || now - authDate > maxAgeSeconds) {
      // Session is expired (> 2 hours)
      return { isValid: false };
    }

    // Parse verified user object
    const userRaw = urlParams.get('user');
    const user: TelegramUser = userRaw ? JSON.parse(userRaw) : undefined;

    return {
      isValid: true,
      user,
    };
  } catch (error) {
    console.error('Error verifying Telegram initData:', error);
    return { isValid: false };
  }
}

/**
 * 🔗 Telegram Deep Linking (`startapp`) Validation
 * Enforces Telegram's official regex: ^[a-zA-Z0-9_]{1,64}$ (Max 64 chars, alphanumeric + underscores)
 */
export function validateAndParseStartAppParam(startParam?: string): {
  isValid: boolean;
  type?: 'product' | 'category' | 'referral' | 'unknown';
  id?: string;
  raw?: string;
} {
  if (!startParam) {
    return { isValid: false };
  }

  // Telegram official spec: Only a-z, A-Z, 0-9 and underscores, max 64 chars
  const telegramStartAppRegex = /^[a-zA-Z0-9_]{1,64}$/;
  if (!telegramStartAppRegex.test(startParam)) {
    return { isValid: false };
  }

  // Parse common patterns e.g., prod_123, cat_45, ref_998
  if (startParam.startsWith('prod_')) {
    return {
      isValid: true,
      type: 'product',
      id: startParam.replace('prod_', ''),
      raw: startParam,
    };
  }

  if (startParam.startsWith('cat_')) {
    return {
      isValid: true,
      type: 'category',
      id: startParam.replace('cat_', ''),
      raw: startParam,
    };
  }

  if (startParam.startsWith('ref_')) {
    return {
      isValid: true,
      type: 'referral',
      id: startParam.replace('ref_', ''),
      raw: startParam,
    };
  }

  return {
    isValid: true,
    type: 'unknown',
    id: startParam,
    raw: startParam,
  };
}

/**
 * 🌐 Telegram Web Login Widget Auth Verification
 * Verifies payload from Telegram Login Widget (sha256(botToken) based HMAC)
 */
export function verifyTelegramWebAuth(
  data: Record<string, any>,
  botToken: string,
  maxAgeSeconds: number = 86400 // 24 hours
): TelegramAuthResult {
  if (!data || !data.hash || !botToken) {
    return { isValid: false };
  }

  try {
    const { hash, ...rest } = data;
    const sortedKeys = Object.keys(rest).sort();
    const dataCheckString = sortedKeys.map((key) => `${key}=${rest[key]}`).join('\n');

    // Web login uses SHA256 of botToken as secret key
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return { isValid: false };
    }

    const authDate = parseInt(data.auth_date, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(authDate) || now - authDate > maxAgeSeconds) {
      return { isValid: false };
    }

    return {
      isValid: true,
      user: {
        id: Number(data.id),
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        photo_url: data.photo_url,
      },
    };
  } catch (err) {
    console.error('Error verifying Telegram Web Auth:', err);
    return { isValid: false };
  }
}

