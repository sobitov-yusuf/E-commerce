// Universal Telegram Mini App (TMA) E-Commerce — Web Telegram Auth API Route
// Handles Telegram Login Widget OAuth verification & Web Session generation

import { NextRequest } from 'next/server';
import { verifyTelegramWebAuth } from '@/lib/telegram';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { SignJWT } from 'jose';
import { sanitizeInput, sanitizePhone } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, authData, phone, firstName, lastName } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    let telegramId: bigint;
    let userFirstName: string;
    let userLastName: string | null = null;
    let userUsername: string | null = null;
    let userPhone: string | null = null;

    if (mode === 'widget' && authData) {
      // 1. Telegram Login Widget Verification
      if (!botToken) {
        return apiError('Server sozlamalari: TELEGRAM_BOT_TOKEN topilmadi', 500);
      }

      const authResult = verifyTelegramWebAuth(authData, botToken);
      if (!authResult.isValid || !authResult.user) {
        return apiError('Telegram orqali avtorizatsiya tasdiqlanmadi (yaroqsiz imzo)', 401);
      }

      telegramId = BigInt(authResult.user.id);
      userFirstName = authResult.user.first_name || 'Foydalanuvchi';
      userLastName = authResult.user.last_name || null;
      userUsername = authResult.user.username || null;
    } else if (mode === 'phone_quick' || mode === 'demo') {
      // 2. Web Quick / Phone Auth (for Web browsers)
      const cleanPhone = sanitizePhone(phone);
      const cleanName = sanitizeInput(firstName) || 'Foydalanuvchi';
      const cleanLast = sanitizeInput(lastName) || null;

      if (!cleanPhone || cleanPhone.length < 9) {
        return apiError('To\'g\'ri telefon raqam kiritilishi shart', 400);
      }

      userPhone = cleanPhone;
      userFirstName = cleanName;
      userLastName = cleanLast;

      // Extract or generate deterministic Telegram ID for web phone user
      const numericDigits = cleanPhone.replace(/\D/g, '');
      telegramId = BigInt(numericDigits.slice(-9) || Math.floor(100000000 + Math.random() * 900000000));
    } else {
      return apiError('Noto\'g\'ri avtorizatsiya rejimi', 400);
    }

    // 3. Upsert user in PostgreSQL DB
    let user = null;
    try {
      user = await prisma.user.upsert({
        where: { telegram_id: telegramId },
        update: {
          first_name: userFirstName,
          last_name: userLastName,
          username: userUsername,
          phone: userPhone || undefined,
        },
        create: {
          telegram_id: telegramId,
          first_name: userFirstName,
          last_name: userLastName,
          username: userUsername,
          phone: userPhone,
          language_code: 'uz',
        },
      });

      if (user.is_blocked) {
        return apiError('Foydalanuvchi akkaunti bloklangan', 403);
      }
    } catch (dbErr) {
      console.warn('Database upsert warning (falling back to temporary session):', dbErr);
      user = {
        id: 'web-' + telegramId.toString(),
        telegram_id: telegramId,
        first_name: userFirstName,
        last_name: userLastName,
        username: userUsername,
        phone: userPhone,
        language_code: 'uz',
        is_blocked: false,
        created_at: new Date(),
      };
    }

    // 4. Check Admin status
    let isAdmin = false;
    let adminRole = null;
    try {
      const admin = await prisma.admin.findUnique({
        where: { telegram_id: telegramId },
      });
      if (admin && admin.is_active) {
        isAdmin = true;
        adminRole = admin.role;
      }
    } catch (e) {}

    // 5. Generate JWT Token
    const jti = globalThis.crypto?.randomUUID() || Math.random().toString(36).substring(2);
    const secretKey = process.env.JWT_SECRET || 'fallback-secret-key';
    const secret = new TextEncoder().encode(secretKey);

    const token = await new SignJWT({
      jti,
      user_id: user.id,
      telegram_id: user.telegram_id.toString(),
      role: adminRole || (isAdmin ? 'ADMIN' : 'CLIENT'),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // 30 days for Web
      .sign(secret);

    // 6. Set HTTP-Only Cookie and return response
    const response = apiSuccess({
      token,
      user: {
        id: user.id,
        telegram_id: user.telegram_id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        phone: user.phone,
        language_code: user.language_code,
      },
      isAdmin,
      adminRole,
    });

    response.cookies.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Web Auth API error:', error);
    return apiError('Server xatosi: ' + error.message, 500);
  }
}
