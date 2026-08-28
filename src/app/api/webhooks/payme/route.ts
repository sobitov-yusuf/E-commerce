// Universal Telegram Mini App (TMA) E-Commerce — Payme Payment Webhook Handler
// Implements Payme JSON-RPC 2.0 protocol with Basic Auth & Immutable Refund Ledger logging

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stockLockManager } from '@/lib/redis';

// Payme Error Codes
const PAYME_ERRORS = {
  INVALID_AMOUNT: { code: -31001, message: { uz: "Noto'g'ri summa", ru: 'Неверная сумма', en: 'Invalid amount' } },
  ORDER_NOT_FOUND: { code: -31050, message: { uz: 'Buyurtma topilmadi', ru: 'Заказ не найден', en: 'Order not found' } },
  CANT_PERFORM: { code: -31008, message: { uz: 'Tranzaksiyani bajarib bo\'lmaydi', ru: 'Невозможно выполнить транзакцию', en: 'Can not perform' } },
  AUTH_ERROR: { code: -32504, message: { uz: 'Avtorizatsiya xatosi', ru: 'Ошибка авторизации', en: 'Auth error' } },
};

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Basic Auth Verification
    const authHeader = request.headers.get('authorization');
    const secretKey = process.env.PAYME_SECRET_KEY || 'payme_secret_key';
    const expectedAuth = 'Basic ' + Buffer.from(`Paycom:${secretKey}`).toString('base64');

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json({
        error: PAYME_ERRORS.AUTH_ERROR,
        id: null,
      });
    }

    const body = await request.json();
    const { method, params, id } = body;

    // 2. JSON-RPC 2.0 Method Routing
    switch (method) {
      case 'CheckPerformTransaction': {
        const orderId = parseInt(params.account.order_id, 10);
        const amountTiyn = params.amount;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
          return NextResponse.json({ error: PAYME_ERRORS.ORDER_NOT_FOUND, id });
        }

        if (Math.round(Number(order.total_price) * 100) !== amountTiyn) {
          return NextResponse.json({ error: PAYME_ERRORS.INVALID_AMOUNT, id });
        }

        if (order.payment_status === 'PAID') {
          return NextResponse.json({ error: PAYME_ERRORS.CANT_PERFORM, id });
        }

        return NextResponse.json({
          result: { allow: true },
          id,
        });
      }

      case 'CreateTransaction': {
        const orderId = parseInt(params.account.order_id, 10);
        const paymeTransId = params.id;
        const time = params.time;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
          return NextResponse.json({ error: PAYME_ERRORS.ORDER_NOT_FOUND, id });
        }

        // Return existing transaction if created
        let transaction = await prisma.transaction.findFirst({
          where: { transaction_id: paymeTransId },
        });

        if (!transaction) {
          transaction = await prisma.transaction.create({
            data: {
              order_id: orderId,
              transaction_type: 'PAYMENT',
              provider: 'PAYME',
              transaction_id: paymeTransId,
              amount: order.total_price,
              status: 'PENDING',
              perform_time: new Date(time),
            },
          });
        }

        return NextResponse.json({
          result: {
            create_time: time,
            transaction: transaction.id.toString(),
            state: 1,
          },
          id,
        });
      }

      case 'PerformTransaction': {
        const paymeTransId = params.id;
        const transaction = await prisma.transaction.findFirst({
          where: { transaction_id: paymeTransId },
          include: { order: { include: { order_items: true } } },
        });

        if (!transaction) {
          return NextResponse.json({ error: PAYME_ERRORS.CANT_PERFORM, id });
        }

        if (transaction.status === 'SUCCESS') {
          return NextResponse.json({
            result: {
              transaction: transaction.id.toString(),
              perform_time: transaction.perform_time ? new Date(transaction.perform_time).getTime() : Date.now(),
              state: 2,
            },
            id,
          });
        }

        // Complete Transaction in ACID
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: transaction.order_id },
            data: { payment_status: 'PAID', status: 'PROCESSING' },
          });

          await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: 'SUCCESS', perform_time: new Date() },
          });

          // Deduct DB stock & release Redis Lock
          for (const item of transaction.order.order_items) {
            if (item.variant_id) {
              await tx.productVariant.update({
                where: { id: item.variant_id },
                data: { stock_count: { decrement: item.quantity } },
              });

              await stockLockManager.releaseStock(item.variant_id, transaction.order.user_id, item.quantity);
            }
          }
        });

        return NextResponse.json({
          result: {
            transaction: transaction.id.toString(),
            perform_time: Date.now(),
            state: 2,
          },
          id,
        });
      }

      case 'CancelTransaction': {
        const paymeTransId = params.id;
        const reason = params.reason;

        const transaction = await prisma.transaction.findFirst({
          where: { transaction_id: paymeTransId },
        });

        if (!transaction) {
          return NextResponse.json({ error: PAYME_ERRORS.CANT_PERFORM, id });
        }

        // 🛡️ Create Immutable Refund Ledger Row
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: transaction.order_id },
            data: { payment_status: 'REFUNDED', status: 'CANCELLED' },
          });

          await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: 'CANCELLED', reason: `Payme Cancel Reason: ${reason}` },
          });

          // Add new REFUND ledger entry (Single Source of Truth)
          await tx.transaction.create({
            data: {
              order_id: transaction.order_id,
              parent_id: transaction.id,
              transaction_type: 'REFUND',
              provider: 'PAYME',
              transaction_id: `refund_${paymeTransId}_${Date.now()}`,
              amount: transaction.amount,
              status: 'SUCCESS',
              reason: `Payme Cancel Reason: ${reason}`,
              perform_time: new Date(),
            },
          });
        });

        return NextResponse.json({
          result: {
            transaction: transaction.id.toString(),
            cancel_time: Date.now(),
            state: -2,
          },
          id,
        });
      }

      case 'CheckTransaction': {
        const paymeTransId = params.id;
        const transaction = await prisma.transaction.findFirst({
          where: { transaction_id: paymeTransId },
        });

        if (!transaction) {
          return NextResponse.json({ error: PAYME_ERRORS.CANT_PERFORM, id });
        }

        const state = transaction.status === 'SUCCESS' ? 2 : transaction.status === 'CANCELLED' ? -2 : 1;

        return NextResponse.json({
          result: {
            create_time: new Date(transaction.created_at).getTime(),
            perform_time: transaction.perform_time ? new Date(transaction.perform_time).getTime() : 0,
            cancel_time: transaction.status === 'CANCELLED' ? Date.now() : 0,
            transaction: transaction.id.toString(),
            state,
            reason: transaction.reason ? 1 : null,
          },
          id,
        });
      }

      default:
        return NextResponse.json({ error: { code: -32601, message: 'Method not found' }, id });
    }
  } catch (err: any) {
    console.error('Payme Webhook Error:', err);
    return NextResponse.json({ error: { code: -32400, message: 'System error' }, id: null });
  }
}
