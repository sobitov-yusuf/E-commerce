// Universal Telegram Mini App (TMA) E-Commerce — Express Checkout API
// Secured with Input Sanitization, XSS Prevention, Parameterized Prisma Queries, Batch Data Fetching, and Redis Atomic Lock Rollback

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stockLockManager } from '@/lib/redis';
import { sanitizeInput, sanitizePhone, safeParseFloat, safeParseInt } from '@/lib/sanitize';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { CreateOrderDto } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const reservedVariantLocks: { variantId: number; quantity: number }[] = [];
  const userId = sanitizeInput(request.headers.get('x-user-id')) || 'guest_user';

  try {
    const body: CreateOrderDto = await request.json();
    
    // 🛡️ XSS Sanitization for User Inputs
    const customer_name = sanitizeInput(body.customer_name);
    const customer_phone = sanitizePhone(body.customer_phone);
    const delivery_type = body.delivery_type === 'PICKUP' ? 'PICKUP' : 'COURIER';
    const payment_type = ['CLICK', 'PAYME', 'CASH'].includes(body.payment_type) ? body.payment_type : 'CASH';
    const address = sanitizeInput(body.address);
    const comment = sanitizeInput(body.comment);
    const promoCodeStr = sanitizeInput(body.promocode);
    
    const latitude = body.latitude ? safeParseFloat(body.latitude) : null;
    const longitude = body.longitude ? safeParseFloat(body.longitude) : null;
    const branch_id = body.branch_id ? safeParseInt(body.branch_id) : null;
    const items = body.items;

    // Validation
    if (!customer_name || !customer_phone || !items || !Array.isArray(items) || items.length === 0) {
      return apiError('Mijoz ismi, telefoni va mahsulotlar majburiy', 400);
    }

    // ⚡ Batch Fetching Products to avoid N+1 DB Queries
    const productIds = Array.from(new Set(items.map((i) => safeParseInt(i.product_id))));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, is_active: true },
      include: { variants: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let subtotalPrice = 0;
    const orderItemsData: Array<{
      product_id: number;
      variant_id?: number;
      quantity: number;
      price: number;
      selected_size?: string;
      selected_color?: string;
    }> = [];

    for (const item of items) {
      const productId = safeParseInt(item.product_id);
      const variantId = item.variant_id ? safeParseInt(item.variant_id) : undefined;
      const quantity = Math.max(1, safeParseInt(item.quantity, 1));

      const product = productMap.get(productId);

      if (!product || !product.is_active) {
        // Rollback acquired locks
        for (const lock of reservedVariantLocks) {
          await stockLockManager.releaseStock(lock.variantId, userId, lock.quantity);
        }
        return apiError(`Mahsulot (${productId}) topilmadi yoki faol emas`, 400);
      }

      let unitPrice = Number(product.base_price);
      let selectedSize: string | undefined;
      let selectedColor: string | undefined;

      if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        if (!variant) {
          for (const lock of reservedVariantLocks) {
            await stockLockManager.releaseStock(lock.variantId, userId, lock.quantity);
          }
          return apiError(`Mahsulot varianti (${variantId}) topilmadi`, 400);
        }

        if (variant.price) {
          unitPrice = Number(variant.price);
        }
        selectedSize = variant.size ? sanitizeInput(variant.size) : undefined;
        selectedColor = variant.color ? sanitizeInput(variant.color) : undefined;

        // O(1) Atomic Redis Stock Lock
        const lockResult = await stockLockManager.reserveStock(
          variant.id,
          userId,
          quantity,
          variant.stock_count
        );

        if (!lockResult.success) {
          // Rollback previously acquired locks
          for (const lock of reservedVariantLocks) {
            await stockLockManager.releaseStock(lock.variantId, userId, lock.quantity);
          }
          return apiError(lockResult.message || `Omborda yetarli mahsulot yo'q`, 400);
        }

        reservedVariantLocks.push({ variantId: variant.id, quantity });
      }

      subtotalPrice += unitPrice * quantity;
      orderItemsData.push({
        product_id: product.id,
        variant_id: variantId,
        quantity,
        price: unitPrice,
        selected_size: selectedSize,
        selected_color: selectedColor,
      });
    }

    // Promocode validation & single-use check
    let discountPrice = 0;
    let validPromocode: any = null;

    if (promoCodeStr) {
      validPromocode = await prisma.promocode.findUnique({
        where: { code: promoCodeStr.toUpperCase() },
      });

      if (validPromocode && validPromocode.is_active) {
        if (userId !== 'guest_user') {
          const alreadyUsed = await prisma.userPromocode.findUnique({
            where: {
              user_id_promocode_id: {
                user_id: userId,
                promocode_id: validPromocode.id,
              },
            },
          });

          if (alreadyUsed) {
            // Release locks
            for (const lock of reservedVariantLocks) {
              await stockLockManager.releaseStock(lock.variantId, userId, lock.quantity);
            }
            return apiError('Siz ushbu promokoddan avval foydalangansiz', 400);
          }
        }

        if (
          !validPromocode.min_order_amount ||
          subtotalPrice >= Number(validPromocode.min_order_amount)
        ) {
          if (validPromocode.discount_type === 'PERCENT') {
            discountPrice = (subtotalPrice * Number(validPromocode.discount_value)) / 100;
          } else {
            discountPrice = Number(validPromocode.discount_value);
          }
        }
      }
    }

    // Calculate delivery fee
    const storeSettings = await prisma.storeSetting.findFirst();
    const standardDeliveryFee = storeSettings ? Number(storeSettings.delivery_fee) : 0;
    const freeThreshold = storeSettings?.free_delivery_threshold
      ? Number(storeSettings.free_delivery_threshold)
      : null;

    let deliveryPrice = delivery_type === 'COURIER' ? standardDeliveryFee : 0;
    if (freeThreshold && subtotalPrice >= freeThreshold) {
      deliveryPrice = 0;
    }

    const totalPrice = Math.max(0, subtotalPrice - discountPrice + deliveryPrice);
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;

    // DB Order Creation in ACID Transaction
    const order = await prisma.$transaction(async (tx) => {
      let dbUser = await tx.user.findFirst({ where: { phone: customer_phone } });
      if (!dbUser) {
        dbUser = await tx.user.create({
          data: {
            telegram_id: BigInt(Math.floor(1000000 + Math.random() * 9000000)),
            first_name: customer_name,
            phone: customer_phone,
          },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          user_id: dbUser.id,
          promocode_id: validPromocode?.id || null,
          branch_id: branch_id || null,
          status: 'NEW',
          payment_type: payment_type as any,
          payment_status: 'PENDING',
          subtotal_price: subtotalPrice,
          discount_price: discountPrice,
          delivery_price: deliveryPrice,
          total_price: totalPrice,
          customer_name,
          customer_phone,
          delivery_type: delivery_type as any,
          address: address || null,
          latitude: latitude || null,
          longitude: longitude || null,
          comment: comment || null,
          order_items: {
            create: orderItemsData,
          },
        },
      });

      if (validPromocode && dbUser.id) {
        await tx.userPromocode.create({
          data: {
            user_id: dbUser.id,
            promocode_id: validPromocode.id,
          },
        });

        await tx.promocode.update({
          where: { id: validPromocode.id },
          data: { used_count: { increment: 1 } },
        });
      }

      // Record Initial Immutable Transaction
      await tx.transaction.create({
        data: {
          order_id: newOrder.id,
          transaction_type: 'PAYMENT',
          provider: payment_type as any,
          transaction_id: `tx_${newOrder.id}_${Date.now()}`,
          amount: totalPrice,
          status: 'PENDING',
        },
      });

      return newOrder;
    });

    // Payment Checkout URL Generation
    let paymentUrl: string | null = null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.mydomain.com';

    if (payment_type === 'CLICK') {
      const merchantId = process.env.CLICK_MERCHANT_ID || '12345';
      const serviceId = process.env.CLICK_SERVICE_ID || '67890';
      paymentUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${totalPrice}&transaction_param=${order.id}&return_url=${encodeURIComponent(baseUrl)}`;
    } else if (payment_type === 'PAYME') {
      const merchantId = process.env.PAYME_MERCHANT_ID || 'payme_merchant_id';
      const amountInTiyn = Math.round(totalPrice * 100);
      const params = `m=${merchantId};ac.order_id=${order.id};a=${amountInTiyn}`;
      const encodedParams = Buffer.from(params).toString('base64');
      paymentUrl = `https://checkout.paycom.uz/${encodedParams}`;
    }

    return apiSuccess({
      order_id: order.id,
      order_number: order.order_number,
      total_price: Number(order.total_price),
      payment_type: order.payment_type,
      payment_url: paymentUrl,
    });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    for (const lock of reservedVariantLocks) {
      await stockLockManager.releaseStock(lock.variantId, userId, lock.quantity);
    }
    return apiError('Checkout bajarishda xatolik yuz berdi: ' + error.message, 500);
  }
}
