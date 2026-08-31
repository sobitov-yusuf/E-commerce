'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight, Lock, Sparkles, Building2 } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { TelegramProvider, useTelegram } from '@/components/telegram/TelegramProvider';

function PaymentGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, lang } = useLanguageStore();
  const { haptic } = useTelegram();

  const orderId = searchParams.get('order_id') || '1';
  const orderNumber = searchParams.get('order_number') || `#ORD-${orderId}`;
  const provider = searchParams.get('provider') || 'CLICK';
  const amountParam = searchParams.get('amount') || '340000';
  const amount = Number(amountParam) || 340000;

  const [cardNumber, setCardNumber] = useState('8600 1234 5678 9012');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isClick = provider === 'CLICK';

  const handleCardFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleConfirmPayment = async () => {
    haptic.impact('heavy');
    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          provider: provider,
          transaction_id: `${provider.toLowerCase()}_tx_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsPaid(true);
        setTimeout(() => {
          router.push(`/cart?success=true&order_id=${orderId}&order_number=${encodeURIComponent(orderNumber)}`);
        }, 2000);
      } else {
        setError(data.error || 'To\'lovni amalga oshirishda xatolik yuz berdi');
        setIsProcessing(false);
      }
    } catch (err: any) {
      setError('Server xatosi: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] text-gray-900 dark:text-white flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Payment Gateway Header */}
        <div className={`p-5 text-white ${isClick ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-gradient-to-r from-[#00C2AF] to-[#009688]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-white/90" />
              <span className="text-xs uppercase tracking-wider font-bold text-white/90">
                {isClick ? 'Click Checkout' : 'Payme Checkout'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wide">
              TEST GATEWAY
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-white/80 font-medium">{t('cart_total')}</span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {amount.toLocaleString()} <span className="text-sm font-normal">UZS</span>
            </div>
            <div className="text-[11px] text-white/70 mt-0.5">
              Buyurtma raqami: <b>{orderNumber}</b>
            </div>
          </div>
        </div>

        {/* Payment Form / Success View */}
        <div className="p-5 space-y-4">
          {isPaid ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white">
                {lang === 'uz' ? 'To\'lov muvaffaqiyatli qabul qilindi!' : lang === 'ru' ? 'Оплата успешно принята!' : 'Payment accepted successfully!'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                {lang === 'uz' ? 'Chek Telegram botingizga yuborildi. Do\'konga qaytmoqdasiz...' : lang === 'ru' ? 'Чек отправлен в ваш Telegram бот. Возврат в магазин...' : 'Receipt sent to your Telegram bot. Redirecting...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  {lang === 'uz' ? 'Karta raqami (Uzcard / Humo)' : lang === 'ru' ? 'Номер карты (Uzcard / Humo)' : 'Card Number (Uzcard / Humo)'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardFormat}
                    placeholder="8600 0000 0000 0000"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    {lang === 'uz' ? 'Amal qilish muddati' : lang === 'ru' ? 'Срок действия' : 'Expiry Date'}
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryFormat}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                    SMS Kod (Test)
                  </label>
                  <input
                    type="text"
                    disabled
                    value="12345"
                    className="w-full px-3 py-2.5 bg-gray-100 dark:bg-[#1F293D] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-gray-500 dark:text-gray-400 outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className={`w-full py-3 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 ${
                    isClick
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-[#00C2AF] hover:bg-[#00a897]'
                  } disabled:opacity-50`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing
                      ? 'To\'lov tekshirilmoqda...'
                      : `${isClick ? 'Click' : 'Payme'} orqali to'lash (${amount.toLocaleString()} UZS)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-2.5 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1F293D] rounded-xl font-semibold text-xs active:scale-95 transition-transform"
                >
                  Bekor qilish va savatga qaytish
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>256-bit SSL xavfsiz shifrlangan to'lov shlyuzi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentGatewayPage() {
  return (
    <TelegramProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
        <PaymentGatewayContent />
      </Suspense>
    </TelegramProvider>
  );
}
