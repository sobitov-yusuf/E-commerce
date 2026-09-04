'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  PackageSearch,
  MapPin,
  Clock,
  CheckCircle2,
  Tag,
  Gift,
  Truck,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function CartPage() {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { deliveryFee = 20000, freeDeliveryThreshold = 300000 } = useSettingsStore();
  const { addOrder } = useOrderStore();
  const { products, deductStock } = useProductStore();

  // Timer State (15 mins = 900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CLICK' | 'PAYME' | 'CASH'>('CLICK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  // Discount State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(0); // flat discount amount
  const [useCashback, setUseCashback] = useState(false);
  const fakeCashbackBalance = 45000;

  // Run timer
  useEffect(() => {
    if (items.length === 0 || successOrderId) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [items.length, successOrderId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, '');
    if (clean.startsWith('998')) clean = clean.slice(3);
    
    let res = '+998';
    if (clean.length > 0) res += ' (' + clean.slice(0, 2);
    if (clean.length >= 2) res += ') ' + clean.slice(2, 5);
    if (clean.length >= 5) res += '-' + clean.slice(5, 7);
    if (clean.length >= 7) res += '-' + clean.slice(7, 9);
    
    setCustomerPhone(res);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'UZUM10') {
      setAppliedPromo(10000);
    } else {
      alert(lang === 'uz' ? 'Promokod xato' : 'Invalid promo code');
    }
  };

  const subtotal = getTotalPrice();
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || deliveryMethod === 'pickup';
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const cashbackDiscount = useCashback ? Math.min(fakeCashbackBalance, subtotal) : 0;
  
  const grandTotal = Math.max(0, subtotal + finalDeliveryFee - appliedPromo - cashbackDiscount);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage(lang === 'uz' ? 'Iltimos, ismingizni to\'liq kiriting' : 'Please enter your full name');
      return;
    }

    if (customerPhone.replace(/\D/g, '').length < 12) {
      setErrorMessage(lang === 'uz' ? 'Telefon raqamini to\'liq kiriting: +998 (XX) XXX-XX-XX' : 'Enter valid phone number');
      return;
    }

    if (deliveryMethod === 'courier' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 5)) {
      setErrorMessage(lang === 'uz' ? 'Yetkazib berish manzilini to\'liq kiriting' : 'Enter valid address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Create order payload
      const orderItems = items.map((it) => {
        const itemPrice = it.selectedVariant?.price ? Number(it.selectedVariant.price) : Number(it.product.base_price);
        return {
          id: it.product.id,
          name: typeof it.product.name === 'object' ? (it.product.name as any)[lang] || (it.product.name as any).uz : String(it.product.name),
          price: itemPrice,
          quantity: it.quantity,
          image: it.product.images?.[0] || '',
          variant: it.selectedVariant ? String((it.selectedVariant as any).name || (it.selectedVariant as any).size) : undefined
        };
      });

      // Stock deduction
      items.forEach(it => {
        deductStock(it.product.id, it.quantity, it.selectedVariant?.id);
      });

      const newOrderId = addOrder({
        user: customerName.trim(),
        phone: customerPhone.trim(),
        total: grandTotal,
        subtotal,
        discountPrice: appliedPromo + cashbackDiscount,
        deliveryPrice: finalDeliveryFee,
        status: 'NEW',
        paymentType: paymentMethod,
        paymentStatus: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING', // Will integrate API later for click/payme
        itemsCount: items.reduce((acc, it) => acc + it.quantity, 0),
        location: deliveryMethod === 'courier' ? deliveryAddress.trim() : 'Bosh ofis (Olib ketish)',
        deliveryMethod: deliveryMethod,
        items: orderItems
      });

      clearCart();
      setSuccessOrderId(newOrderId);

      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  // EMPTY STATE
  if (items.length === 0 && !successOrderId) {
    const recommended = (products || []).filter(p => p.badge === 'TOP').slice(0, 4);

    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] pb-24">
        {/* Compact empty state */}
        <div className="bg-white dark:bg-[#111827] px-6 py-8 text-center space-y-3 mb-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#161F30] flex items-center justify-center mx-auto text-gray-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              {lang === 'uz' ? 'Xaridlarni boshlash uchun katalogga o\'ting' : 'Перейдите в каталог, чтобы начать покупки'}
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-10 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs active:scale-95 transition-all mt-2"
          >
            {lang === 'uz' ? 'Katalogga o\'tish' : 'В каталог'}
          </Link>
        </div>

        {/* Recommended Grid */}
        {recommended.length > 0 && (
          <div className="p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Tavsiya etamiz' : 'Рекомендуем'}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // SUCCESS STATE
  if (successOrderId) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#111827] rounded-3xl p-8 text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-950 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Buyurtma qabul qilindi!' : 'Заказ принят!'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
              ID: <span className="font-mono font-bold text-gray-900 dark:text-gray-200">{successOrderId}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              {lang === 'uz' 
                ? 'Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada operatorlarimiz aloqaga chiqishadi.' 
                : 'Ваш заказ успешно оформлен. Скоро с вами свяжутся.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/catalog"
              className="flex items-center justify-center w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-sm active:scale-95 transition-all shadow-md"
            >
              {lang === 'uz' ? 'Xaridni davom ettirish' : 'Продолжить покупки'}
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-center w-full h-12 mt-3 bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
            >
              {lang === 'uz' ? 'Buyurtmalarim' : 'Мои заказы'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CART STATE
  return (
    <div className="bg-[#FAFAFA] dark:bg-[#0B0F17] min-h-screen pb-40">
      <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 p-3 sm:p-6">
        
        <h1 className="text-xl font-black text-gray-950 dark:text-white tracking-tight px-1">
          {lang === 'uz' ? 'Savat' : 'Корзина'}
        </h1>

        {/* 15 MIN TIMER */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-3 sm:p-4 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-blue-100">
                {lang === 'uz' ? 'Tovarlar band qilindi' : 'Товары зарезервированы'}
              </div>
              <div className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-300 font-medium mt-0.5">
                {lang === 'uz' ? 'Vaqt tugaguncha buyurtmani rasmiylashtiring' : 'Оформите заказ до истечения времени'}
              </div>
            </div>
          </div>
          <div className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* ITEMS */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm divide-y divide-gray-100 dark:divide-white/5 border border-gray-100 dark:border-white/5">
          {items.map((item) => {
            const itemPrice = item.selectedVariant?.price ? Number(item.selectedVariant.price) : Number(item.product.base_price);
            
            return (
              <div key={`${item.product.id}-${item.variantId || 'base'}`} className="p-3 sm:p-4 flex gap-3 sm:gap-4 relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 dark:bg-[#161F30] rounded-xl overflow-hidden shrink-0">
                  <img src={item.product.images?.[0] || 'https://via.placeholder.com/300'} alt="product" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div className="pr-8">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white line-clamp-2">
                      {getProductName(item.product.name)}
                    </h3>
                    {item.selectedVariant && (
                      <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1">
                        {(item.selectedVariant as any).name || (item.selectedVariant as any).size}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end justify-between mt-2">
                    <div className="text-sm sm:text-base font-black text-gray-950 dark:text-white">
                      {itemPrice.toLocaleString()} UZS
                    </div>
                    
                    <div className="flex items-center bg-gray-100 dark:bg-[#161F30] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variantId)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-md transition-all active:scale-90 shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= ((item.selectedVariant as any)?.stock || (item.product as any).stock || 0)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition-all active:scale-90 shadow-sm ${
                          item.quantity >= ((item.selectedVariant as any)?.stock || (item.product as any).stock || 0)
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.product.id, item.variantId)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-[#161F30] text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          
          {/* DELIVERY METHOD */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
            <h3 className="text-sm font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Olish usuli' : 'Способ получения'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('courier')}
                className={`h-12 rounded-xl flex items-center justify-center gap-2 border-2 transition-all font-bold text-xs ${
                  deliveryMethod === 'courier'
                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white'
                    : 'border-gray-100 dark:border-[#161F30] bg-white dark:bg-[#111827] text-gray-500 hover:border-gray-300'
                }`}
              >
                <Truck className="w-4 h-4" />
                {lang === 'uz' ? 'Kuryer' : 'Курьер'}
              </button>
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`h-12 rounded-xl flex items-center justify-center gap-2 border-2 transition-all font-bold text-xs ${
                  deliveryMethod === 'pickup'
                    ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white'
                    : 'border-gray-100 dark:border-[#161F30] bg-white dark:bg-[#111827] text-gray-500 hover:border-gray-300'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {lang === 'uz' ? 'Olib ketish' : 'Самовывоз'}
              </button>
            </div>
            {deliveryMethod === 'courier' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'uz' ? 'Manzil' : 'Адрес'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'uz' ? 'Yetkazib berish manzili...' : 'Адрес доставки...'}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full h-12 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm text-gray-900 dark:text-white font-medium focus:border-gray-900 dark:focus:border-white outline-none transition-all"
                />
              </div>
            )}
          </div>

          {/* CONTACT DETAILS */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
            <h3 className="text-sm font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Aloqa uchun' : 'Контакты'}
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'uz' ? 'Ism Familiya' : 'Имя Фамилия'}
                </label>
                <input
                  type="text"
                  placeholder="Ism Familiya"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-12 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm text-gray-900 dark:text-white font-medium focus:border-gray-900 dark:focus:border-white outline-none transition-all placeholder-gray-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {lang === 'uz' ? 'Telefon' : 'Телефон'}
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={handlePhoneChange}
                  placeholder="+998 (90) 123-45-67"
                  className="w-full h-12 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm font-mono font-bold text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-white outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* PROMO & CASHBACK */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'uz' ? 'Promokod' : 'Промокод'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 h-12 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl px-4 text-sm font-bold uppercase text-gray-900 dark:text-white focus:border-gray-900 dark:focus:border-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={!promoCode || appliedPromo > 0}
                className="h-12 px-5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs disabled:opacity-50 transition-all active:scale-95"
              >
                {lang === 'uz' ? 'Qo\'llash' : 'Применить'}
              </button>
            </div>

            {fakeCashbackBalance > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">Keshbek balans</div>
                    <div className="text-[10px] font-bold text-emerald-500">{fakeCashbackBalance.toLocaleString()} UZS</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseCashback(!useCashback)}
                  className={`w-12 h-7 rounded-full p-1 transition-all ${useCashback ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${useCashback ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
            <h3 className="text-sm font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'To\'lov usuli' : 'Способ оплаты'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                paymentMethod === 'CLICK' ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-white/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Click orqali to'lov</span>
                </div>
                <input type="radio" name="payment" checked={paymentMethod === 'CLICK'} onChange={() => setPaymentMethod('CLICK')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CLICK' ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {paymentMethod === 'CLICK' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white" />}
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                paymentMethod === 'CASH' ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-white/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Naqd pul orqali</span>
                </div>
                <input type="radio" name="payment" checked={paymentMethod === 'CASH'} onChange={() => setPaymentMethod('CASH')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CASH' ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'}`}>
                  {paymentMethod === 'CASH' && <div className="w-2.5 h-2.5 rounded-full bg-gray-900 dark:bg-white" />}
                </div>
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FIXED BOTTOM CHEQUE */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-t border-gray-200/80 dark:border-white/10 p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="max-w-2xl mx-auto space-y-3">
              
              <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                <span>Tovarlar ({items.reduce((acc, it) => acc + it.quantity, 0)} ta):</span>
                <span>{subtotal.toLocaleString()} UZS</span>
              </div>
              
              {deliveryMethod === 'courier' && (
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Yetkazish:</span>
                  {isFreeDelivery ? (
                    <span className="text-emerald-500 font-bold">Bepul</span>
                  ) : (
                    <span>{deliveryFee.toLocaleString()} UZS</span>
                  )}
                </div>
              )}

              {(appliedPromo > 0 || cashbackDiscount > 0) && (
                <div className="flex items-center justify-between text-xs font-bold text-red-500">
                  <span>Chegirma:</span>
                  <span>-{(appliedPromo + cashbackDiscount).toLocaleString()} UZS</span>
                </div>
              )}

              <div className="flex items-end justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Jami to'lov:</div>
                <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                  {grandTotal.toLocaleString()} <span className="text-sm">UZS</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 mt-2 shadow-md hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'Rasmiylashtirilmoqda...' : 'Buyurtma berish'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

