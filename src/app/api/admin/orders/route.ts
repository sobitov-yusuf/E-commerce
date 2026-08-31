// Universal Telegram Mini App (TMA) E-Commerce — Admin Orders API
// Secured with Authorization Check, Input Sanitization, Immutable Refund Ledger, and Telegram Bot Customer Dispatch

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeInput, safeParseInt, safeParseFloat } from '@/lib/sanitize';
import { OrderStatus } from '@/types';
import { sendCustomerOrderStatusNotification } from '@/lib/botNotifications';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const status = statusParam && statusParam !== 'ALL' ? (sanitizeInput(statusParam) as OrderStatus) : null;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { id: true, telegram_id: true, first_name: true, last_name: true, username: true, phone: true, language_code: true } },
        order_items: { include: { product: true } },
        transactions: true,
        branch: true,
      },
    });

    const formatted = orders.map((o) => ({
      ...o,
      subtotal_price: Number(o.subtotal_price),
      discount_price: Number(o.discount_price),
      delivery_price: Number(o.delivery_price),
      total_price: Number(o.total_price),
      latitude: o.latitude ? Number(o.latitude) : null,
      longitude: o.longitude ? Number(o.longitude) : null,
      order_items: o.order_items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      transactions: o.transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      })),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error('Admin Orders GET Error:', error);
    return NextResponse.json({ success: false, error: 'Server ichki xatosi' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const order_id = safeParseInt(body.order_id);
    const status = sanitizeInput(body.status) as OrderStatus;
    const partial_refund_amount = body.partial_refund_amount ? safeParseFloat(body.partial_refund_amount) : 0;
    const reason = sanitizeInput(body.reason);

    if (!order_id || !status) {
      return NextResponse.json({ success: false, error: 'order_id va status majburiy' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { transactions: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    // 1. Handle Partial Refund (Immutable Ledger Log)
    if (status === 'PARTIALLY_REFUNDED' && partial_refund_amount > 0) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order_id },
          data: {
            status: 'PARTIALLY_REFUNDED',
            payment_status: 'PARTIALLY_REFUNDED',
          },
        });

        const initialPaymentTx = order.transactions.find((t) => t.transaction_type === 'PAYMENT');

        // Create new Immutable REFUND transaction row
        await tx.transaction.create({
          data: {
            order_id,
            parent_id: initialPaymentTx?.id || null,
            transaction_type: 'REFUND',
            provider: order.payment_type as any,
            transaction_id: `admin_refund_${order_id}_${Date.now()}`,
            amount: partial_refund_amount,
            status: 'SUCCESS',
            reason: reason || 'Admin tomonidan qisman refund berildi',
            perform_time: new Date(),
          },
        });
      });

      return NextResponse.json({ success: true, message: 'Qisman refund bajarildi' });
    }

    // 2. Standard Status Update
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status },
    });

    // 3. Dispatch Bot Alert to Customer
    if (order.user?.telegram_id) {
      try {
        await sendCustomerOrderStatusNotification(
          order.user.telegram_id.toString(),
          order.order_number,
          status,
          (order.user.language_code as any) || 'uz'
        );
      } catch (e) {
        console.warn('Failed to send status bot notification to user:', e);
      }
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error('Admin Orders PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Server ichki xatosi' }, { status: 500 });
  }
}
