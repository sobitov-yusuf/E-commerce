// Universal Telegram Mini App (TMA) E-Commerce — Click Payment Webhook Handler
// Handles Click Prepare (action=0) and Complete (action=1) with MD5 signature verification & Redis stock release

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { stockLockManager } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const click_trans_id = formData.get('click_trans_id')?.toString() || '';
    const service_id = formData.get('service_id')?.toString() || '';
    const click_paydoc_id = formData.get('click_paydoc_id')?.toString() || '';
    const merchant_trans_id = formData.get('merchant_trans_id')?.toString() || '';
    const merchant_prepare_id = formData.get('merchant_prepare_id')?.toString() || '';
    const amount = formData.get('amount')?.toString() || '';
    const action = parseInt(formData.get('action')?.toString() || '-1', 10);
    const error = parseInt(formData.get('error')?.toString() || '0', 10);
    const error_note = formData.get('error_note')?.toString() || '';
    const sign_time = formData.get('sign_time')?.toString() || '';
    const sign_string = formData.get('sign_string')?.toString() || '';

    const secret_key = process.env.CLICK_SECRET_KEY || 'click_secret_hash';

    // 1. Verify Click MD5 Signature
    let prepare_id_str = action === 1 ? merchant_prepare_id : '';
    const signSource = `${click_trans_id}${service_id}${secret_key}${merchant_trans_id}${prepare_id_str}${amount}${action}${sign_time}`;
    const calculatedSign = crypto.createHash('md5').update(signSource).digest('hex');

    if (calculatedSign !== sign_string) {
      return NextResponse.json({ error: -1, error_note: 'SIGN CHECK FAILED' });
    }

    const orderId = parseInt(merchant_trans_id, 10);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { order_items: true },
    });

    if (!order) {
      return NextResponse.json({ error: -5, error_note: 'ORDER NOT FOUND' });
    }

    const orderAmount = Number(order.total_price);
    if (Math.abs(orderAmount - parseFloat(amount)) > 0.01) {
      return NextResponse.json({ error: -2, error_note: 'INCORRECT AMOUNT' });
    }

    if (error < 0) {
      // Payment cancelled on Click side
      await prisma.order.update({
        where: { id: orderId },
        data: { payment_status: 'FAILED', status: 'CANCELLED' },
      });
      return NextResponse.json({ error: -9, error_note: 'TRANSACTION CANCELLED' });
    }

    // 2. Action = 0 (PREPARE)
    if (action === 0) {
      if (order.payment_status === 'PAID') {
        return NextResponse.json({ error: -4, error_note: 'ALREADY PAID' });
      }

      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_prepare_id: orderId.toString(),
        error: 0,
        error_note: 'Success',
      });
    }

    // 3. Action = 1 (COMPLETE)
    if (action === 1) {
      if (order.payment_status === 'PAID') {
        return NextResponse.json({
          click_trans_id,
          merchant_trans_id,
          merchant_confirm_id: orderId.toString(),
          error: 0,
          error_note: 'Success',
        });
      }

      // Execute DB Update & Deduct Stock in ACID Transaction
      await prisma.$transaction(async (tx) => {
        // Update Order
        await tx.order.update({
          where: { id: orderId },
          data: {
            payment_status: 'PAID',
            status: 'PROCESSING',
          },
        });

        // Update Transaction
        await tx.transaction.updateMany({
          where: { order_id: orderId, transaction_type: 'PAYMENT' },
          data: {
            status: 'SUCCESS',
            perform_time: new Date(),
            transaction_id: click_trans_id,
          },
        });

        // Deduct permanent DB stock & release Redis Lock
        for (const item of order.order_items) {
          if (item.variant_id) {
            await tx.productVariant.update({
              where: { id: item.variant_id },
              data: {
                stock_count: { decrement: item.quantity },
              },
            });

            // Release Redis Lock
            await stockLockManager.releaseStock(item.variant_id, order.user_id, item.quantity);
          }
        }
      });

      return NextResponse.json({
        click_trans_id,
        merchant_trans_id,
        merchant_confirm_id: orderId.toString(),
        error: 0,
        error_note: 'Success',
      });
    }

    return NextResponse.json({ error: -3, error_note: 'UNKNOWN ACTION' });
  } catch (err: any) {
    console.error('Click Webhook Error:', err);
    return NextResponse.json({ error: -8, error_note: 'SYSTEM ERROR' });
  }
}
