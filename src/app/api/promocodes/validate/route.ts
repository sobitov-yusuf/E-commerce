// Universal Telegram Mini App (TMA) E-Commerce — Promocode Validation API Endpoint
// Validates promocode, checks expiration, minimum order amount, and single-use abuse

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeInput, safeParseFloat } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const codeStr = sanitizeInput(body.code);
    const subtotal = safeParseFloat(body.subtotal, 0);
    const userId = sanitizeInput(request.headers.get('x-user-id')) || 'guest_user';

    if (!codeStr) {
      return NextResponse.json(
        { success: false, error: 'Promokod kodi majburiy' },
        { status: 400 }
      );
    }

    const promocode = await prisma.promocode.findUnique({
      where: { code: codeStr.toUpperCase() },
    });

    if (!promocode || !promocode.is_active) {
      return NextResponse.json(
        { success: false, error: 'Ushbu promokod mavjud emas yoki muddati o\'tgan' },
        { status: 404 }
      );
    }

    // Expiration check
    if (promocode.expires_at && new Date(promocode.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Promokodning amal qilish muddati tugagan' },
        { status: 400 }
      );
    }

    // Max uses check
    if (promocode.max_uses && promocode.used_count >= promocode.max_uses) {
      return NextResponse.json(
        { success: false, error: 'Promokod ishlatish limiti tugagan' },
        { status: 400 }
      );
    }

    // Min order amount check
    if (promocode.min_order_amount && subtotal < Number(promocode.min_order_amount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Ushbu promokod minimal ${Number(promocode.min_order_amount).toLocaleString()} UZS buyurtma uchun amal qiladi`,
        },
        { status: 400 }
      );
    }

    // Single use check per user
    if (userId !== 'guest_user') {
      const alreadyUsed = await prisma.userPromocode.findUnique({
        where: {
          user_id_promocode_id: {
            user_id: userId,
            promocode_id: promocode.id,
          },
        },
      });

      if (alreadyUsed) {
        return NextResponse.json(
          { success: false, error: 'Siz ushbu promokoddan avval foydalangansiz' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: promocode.id,
        code: promocode.code,
        discount_type: promocode.discount_type,
        discount_value: Number(promocode.discount_value),
        min_order_amount: promocode.min_order_amount ? Number(promocode.min_order_amount) : null,
      },
    });
  } catch (error: any) {
    console.error('Promocode Validation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
