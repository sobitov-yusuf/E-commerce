'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function CartPage() {
  const router = useRouter();
  const { lang, t } = useLanguageStore();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { deliveryFee = 20000, freeDeliveryThreshold = 300000 } = useSettingsStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CLICK' | 'PAYME' | 'CASH'>('CLICK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = subtotal + finalDeliveryFee;

  const handlePhoneChange = (val: string) => {
    let clean = val.replace(/[^\d+]/g, '');
    if (!clean.startsWith('+998')) {
      clean = '+998 ';
    }
    setCustomerPhone(clean);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage(lang === 'uz' ? 'Iltimos, ismingizni to\'liq kiriting' : 'Пожалуйста, введите имя');
      return;
    }

    if (customerPhone.replace(/\D/g, '').length < 12) {
      setErrorMessage(lang === 'uz' ? 'Telefon raqamini to\'liq kiriting: +998 (XX) XXX-XX-XX' : 'Введите номер телефона полностью');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMessage(lang === 'uz' ? 'Yetkazib berish manzilini to\'liq kiriting' : 'Введите адрес доставки');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        paymentType: paymentMethod,
        items: items.map((it) => {
          const itemPrice = it.selectedVariant?.price ? Number(it.selectedVariant.price) : Number(it.product.base_price);
          return {
            productId: it.product.id,
            variantId: it.variantId || null,
            name: typeof it.product.name === 'object' ? (it.product.name as any).uz : String(it.product.name),
            quantity: it.quantity,
            unitPrice: itemPrice,
            totalPrice: itemPrice * it.quantity,
          };
        }),
        subtotal,
        deliveryFee: finalDeliveryFee,
        total: grandTotal,
      };

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();
        if (paymentMethod === 'CLICK' || paymentMethod === 'PAYME') {
          router.push(`/checkout/pay?orderId=${data.order.id}&method=${paymentMethod}&amount=${grandTotal}`);
        } else {
          router.push(`/profile?orderSuccess=true&orderId=${data.order.id}`);
        }
      } else {
        setErrorMessage(data.error || 'Buyurtma yaratishda xatolik');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Server bilan ulanishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-[#161F30] text-gray-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
            {lang === 'uz' ? 'Savatingiz hozircha bo\'sh' : 'Ваша корзина пуста'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {lang === 'uz'
              ? 'Katalogdan kerakli mahsulotlarni tanlab, savatga qo\'shing.'
              : 'Выберите товары из каталога и добавьте их в корзину.'}
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xs"
        >
          <span>{lang === 'uz' ? 'Katalogga o\'tish' : 'Перейти в каталог'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-gray-200/80 dark:border-white/10 pb-3">
        <h1 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white tracking-tight">
          {lang === 'uz' ? 'Savatdagi mahsulotlar' : 'Корзина'} ({items.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => {
            const price = item.selectedVariant?.price ? Number(item.selectedVariant.price) : Number(item.product.base_price);
            const img = item.product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200';

            return (
              <div
                key={`${item.product.id}-${item.variantId || 'base'}`}
                className="flex items-center gap-3 p-3 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-xs"
              >
                <img
                  src={img}
                  alt={getProductName(item.product.name)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-50 dark:bg-[#161F30] shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-gray-950 dark:text-white line-clamp-1">
                    {getProductName(item.product.name)}
                  </h4>
                  {item.selectedVariant && (
                    <div className="text-[10px] text-gray-400">
                      {item.selectedVariant.size || item.selectedVariant.color}
                    </div>
                  )}
                  <div className="text-xs sm:text-sm font-black text-gray-950 dark:text-white">
                    {Number(price).toLocaleString()} <span className="text-[10px] text-gray-400">UZS</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 dark:bg-[#161F30] rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-950 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id, item.variantId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Checkout Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleCheckout} className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Buyurtma va Yetkazib berish' : 'Оформление заказа'}
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Ism Familiyangiz
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Azizbek Rahmonov"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Telefon raqamingiz
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Yetkazib berish manzili
              </label>
              <textarea
                rows={2}
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Toshkent sh., Yunusobod tumani, 4-mavze, 12-uy"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                To'lov usulini tanlang
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CLICK')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'CLICK'
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600'
                      : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Click</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('PAYME')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'PAYME'
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-[#00C2AF] text-[#00C2AF]'
                      : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payme</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-600'
                      : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Naqd pul</span>
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Mahsulotlar narxi:</span>
                <span className="font-bold text-gray-900 dark:text-white">{subtotal.toLocaleString()} UZS</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Yetkazib berish:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {isFreeDelivery ? 'Bepul' : `${finalDeliveryFee.toLocaleString()} UZS`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-950 dark:text-white pt-2 border-t border-gray-100 dark:border-white/10">
                <span>Jami to'lov:</span>
                <span className="text-base">{grandTotal.toLocaleString()} UZS</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/40 text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Rasmiylashtirilmoqda...' : 'Buyurtmani Tasdiqlash'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
