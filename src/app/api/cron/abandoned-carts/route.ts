// Universal Telegram Mini App (TMA) E-Commerce — Abandoned Cart & Stock Cleaner Cron API
// Automatically releases abandoned Redis stock locks, cancels unpaid orders older than 30 minutes

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stockLockManager } from '@/lib/redis';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Cancel unpaid pending orders older than 30 minutes & include items for Redis lock release
    const abandonedOrders = await prisma.order.findMany({
      where: {
        payment_status: 'PENDING',
        status: 'NEW',
        created_at: { lt: thirtyMinutesAgo },
      },
      include: {
        order_items: true,
      },
    });

    let count = 0;
    for (const order of abandonedOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          payment_status: 'FAILED',
        },
      });

      // Release reserved Redis stock for variants
      for (const item of order.order_items) {
        if (item.variant_id) {
          await stockLockManager.releaseStock(item.variant_id, order.user_id, item.quantity);
        }
      }

      count++;
    }

    return apiSuccess({
      cancelled_count: count,
      message: `${count} ta tashlab ketilgan (unpaid) buyurtmalar va uning Redis zaxiralari avtomatik bekor qilindi`,
    });
  } catch (error: any) {
    console.error('Cron Abandoned Carts Error:', error);
    return apiError('Cron bajarilishida xatolik: ' + error.message, 500);
  }
}
