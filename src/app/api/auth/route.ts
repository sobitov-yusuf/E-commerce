// Universal Telegram Mini App (TMA) E-Commerce — Next.js Auth API Route
// Verifies Telegram initData (HMAC-SHA256, max 2h freshness) and generates JWT session

import { NextRequest } from 'next/server';
import { verifyTelegramInitData } from '@/lib/telegram';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { SignJWT } from 'jose';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initData } = body;

    if (!initData) {
      return apiError('initData majburiy parametr', 400);
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN environment variable topilmadi');
      return apiError('Server sozlamalari xatosi', 500);
    }

    // 1. Verify Telegram HMAC initData (Max 2 hours freshness to prevent Replay Attacks)
    const authResult = verifyTelegramInitData(initData, botToken, 7200);

    if (!authResult.isValid || !authResult.user) {
      return apiError('Yaroqsiz yoki eskirgan Telegram initData seansi', 401);
    }

    const tgUser = authResult.user;
    const telegramId = BigInt(tgUser.id);

    // 2. Upsert user in PostgreSQL DB
    const user = await prisma.user.upsert({
      where: { telegram_id: telegramId },
      update: {
        first_name: tgUser.first_name,
        last_name: tgUser.last_name || null,
        username: tgUser.username || null,
        language_code: (tgUser.language_code as any) === 'ru' || (tgUser.language_code as any) === 'en' ? (tgUser.language_code as any) : 'uz',
      },
      create: {
        telegram_id: telegramId,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name || null,
        username: tgUser.username || null,
        language_code: (tgUser.language_code as any) === 'ru' || (tgUser.language_code as any) === 'en' ? (tgUser.language_code as any) : 'uz',
      },
    });

    // Check if user is blocked
    if (user.is_blocked) {
      return apiError('Foydalanuvchi akkaunti bloklangan', 403);
    }

    // 3. Check if user is an Admin
    const admin = await prisma.admin.findUnique({
      where: { telegram_id: telegramId },
    });

    const isAdmin = Boolean(admin && admin.is_active);
    const adminRole = admin?.role || null;

    // 4. Generate JWT Token with unique jti (for instant revocation in Redis)
    const jti = globalThis.crypto?.randomUUID() || Math.random().toString(36).substring(2);
    const secretKey = process.env.JWT_SECRET || 'fallback-secret-key';
    const secret = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({
      jti,
      user_id: user.id,
      telegram_id: user.telegram_id.toString(),
      admin_id: admin?.id || null,
      role: adminRole || 'CLIENT',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(secret);

    // 5. Prepare HTTP-Only response cookie & JSON
    const response = apiSuccess({
      token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        language_code: user.language_code,
      },
      isAdmin,
      adminRole,
    });

    // Set cookie
    response.cookies.set(isAdmin ? 'admin_token' : 'user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 43200, // 12 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Auth API error:', error);
    return apiError('Server ichki xatosi: ' + error.message, 500);
  }
}
