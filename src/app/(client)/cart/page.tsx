'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Clock,
  Truck,
  Store,
  Phone,
  CheckCircle2,
  CreditCard,
  Banknote,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useTelegram, TelegramProvider } from '@/components/telegram/TelegramProvider';

import { ProductCard } from '@/components/home/ProductCard';
import { useOrderStore } from '@/store/useOrderStore';
import { TelegramLoginModal } from '@/components/auth/TelegramLoginModal';

function CartPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: tgUser, isTelegramWebApp } = useTelegram();
  const { t, lang } = useLanguageStore();

  const {
    items: cartItems,
    appliedPromocode,
    applyPromocode,
    removePromocode,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getTotalPrice,
  } = useCartStore();

  const { products, fetchProducts } = useProductStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addOrderToStore = useOrderStore((state) => state.addOrder);

  // Form State
  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [paymentType, setPaymentType] = useState<'CLICK' | 'PAYME' | 'CASH'>('PAYME');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Promocode State
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  // 15:00 Stock Lock Countdown Timer
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    fetchProducts(lang, null, '');

    if (tgUser) {
      if (tgUser.first_name) {
        setCustomerName(`${tgUser.first_name} ${tgUser.last_name || ''}`.trim());
      }
      if (tgUser.phone) {
        setPhoneNumber(tgUser.phone);
      }
    }

    // Check if redirected from payment gateway
    const isSuccess = searchParams.get('success');
    const succId = searchParams.get('order_id');
    const succNum = searchParams.get('order_number');
    if (isSuccess === 'true' && succId) {
      setCreatedOrderId(succId);
      setCreatedOrderNumber(succNum || `#ORD-${succId}`);
      setOrderSuccess(true);
      clearCart();
    }
  }, [fetchProducts, lang, tgUser, searchParams, clearCart]);

  useEffect(() => {
    if (cartItems.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cartItems.length]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    triggerHaptic('medium');
    setPromoLoading(true);
    setPromoError('');

    setTimeout(() => {
      setPromoLoading(false);
      const code = promoInput.trim().toUpperCase();
      if (code === 'SPRING2026' || code === 'WELCOME10' || code === 'TMA2026') {
        applyPromocode({
          id: 1,
          code,
          discount_type: 'PERCENT',
          discount_value: code === 'SPRING2026' ? 15 : 10,
          min_order_amount: 100000,
          used_count: 0,
          is_active: true,
          expires_at: '2026-12-31',
        });
        setPromoInput('');
      } else {
        const errorMsg =
          lang === 'uz'
            ? 'Noto\'g\'ri promokod'
            : lang === 'ru'
            ? 'Неверный промокод'
            : 'Invalid promo code';
        setPromoError(errorMsg);
      }
    }, 500);
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = deliveryType === 'courier' ? (subtotal > 300000 ? 0 : 20000) : 0;
  const totalPrice = getTotalPrice(deliveryFee);

  const handleCheckout = async () => {
    triggerHaptic('heavy');
    setErrorMessage(null);

    const name = customerName.trim() || (tgUser ? `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim() : 'Mijoz');
    const phone = phoneNumber.trim() || tgUser?.phone || '+998 (90) 123-45-67';

    if (deliveryType === 'courier' && !address.trim()) {
      setErrorMessage(
        lang === 'uz'
          ? 'Iltimos, yetkazib berish manzilini kiriting'
          : lang === 'ru'
          ? 'Пожалуйста, укажите адрес доставки'
          : 'Please enter delivery address'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order in PostgreSQL DB via API
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          delivery_type: deliveryType === 'courier' ? 'COURIER' : 'PICKUP',
          payment_type: paymentType,
          address: deliveryType === 'courier' ? address.trim() : 'Markaziy Do\'kon (Samovivoz)',
          comment: comment.trim() || undefined,
          promocode: appliedPromocode?.code,
          items: cartItems.map((i) => ({
            product_id: i.product.id,
            variant_id: i.variant?.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        const orderId = data.data.order_id;
        const orderNumber = data.data.order_number;

        // 2. Also record in local state for offline sync
        addOrderToStore({
          user: name,
          phone: phone,
          total: totalPrice,
          subtotal,
          discountPrice: discount,
          deliveryPrice: deliveryFee,
          status: 'NEW',
          paymentType: paymentType,
          paymentStatus: paymentType === 'CASH' ? 'PENDING' : 'PENDING',
          itemsCount: cartItems.length,
          location: deliveryType === 'courier' ? address.trim() : 'Markaziy Do\'kon (Samovivoz)',
          deliveryMethod: deliveryType,
          items: cartItems.map((i) => ({
            id: i.product.id,
            name: typeof i.product.name === 'object' ? (i.product.name as any)[lang] || i.product.name.uz : String(i.product.name),
            price: i.variant?.price ? Number(i.variant.price) : Number(i.product.base_price),
            quantity: i.quantity,
            image: i.product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            variant: i.variant?.size || (i.variant?.color ? `${i.variant.color}` : undefined),
          })),
        });

        // 3. Routing based on payment type
        if (paymentType === 'CLICK' || paymentType === 'PAYME') {
          // Redirect to test payment gateway
          router.push(
            `/checkout/pay?order_id=${orderId}&order_number=${encodeURIComponent(orderNumber)}&provider=${paymentType}&amount=${totalPrice}`
          );
        } else {
          // Cash on delivery: Complete directly
          setCreatedOrderId(String(orderId));
          setCreatedOrderNumber(orderNumber);
          setOrderSuccess(true);
          clearCart();
        }
      } else {
        // Fallback for offline/local simulation
        const fallbackId = `#ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        addOrderToStore({
          user: name,
          phone: phone,
          total: totalPrice,
          subtotal,
          discountPrice: discount,
          deliveryPrice: deliveryFee,
          status: 'NEW',
          paymentType: paymentType,
          paymentStatus: paymentType === 'CASH' ? 'PENDING' : 'PENDING',
          itemsCount: cartItems.length,
          location: deliveryType === 'courier' ? address.trim() : 'Markaziy Do\'kon (Samovivoz)',
          deliveryMethod: deliveryType,
          items: cartItems.map((i) => ({
            id: i.product.id,
            name: typeof i.product.name === 'object' ? (i.product.name as any)[lang] || i.product.name.uz : String(i.product.name),
            price: i.variant?.price ? Number(i.variant.price) : Number(i.product.base_price),
            quantity: i.quantity,
            image: i.product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          })),
        });

        if (paymentType === 'CLICK' || paymentType === 'PAYME') {
          router.push(
            `/checkout/pay?order_id=1&order_number=${encodeURIComponent(fallbackId)}&provider=${paymentType}&amount=${totalPrice}`
          );
        } else {
          setCreatedOrderId('1');
          setCreatedOrderNumber(fallbackId);
          setOrderSuccess(true);
          clearCart();
        }
      }
    } catch (err: any) {
      setErrorMessage('Buyurtma yaratishda xatolik yuz berdi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. SUCCESS SCREEN
  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8 space-y-5 animate-in fade-in max-w-md mx-auto">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-xs border border-emerald-200/80 dark:border-emerald-800/40">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white tracking-tight">
            {t('cart_order_success_title')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
            {t('cart_order_success_desc')}
          </p>
          {createdOrderNumber && (
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-[#161F30] rounded-lg text-xs font-mono font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 mt-1">
              Buyurtma: {createdOrderNumber}
            </div>
          )}
        </div>

        {/* Bot Notification Banner */}
        <div className="w-full bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 text-left text-xs text-gray-800 dark:text-gray-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-gray-950 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('cart_order_bot_title')}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 font-normal">
            {t('cart_order_bot_desc')}
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2 pt-2">
          <Link
            href="/profile"
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-transform"
          >
            <span>{t('cart_order_track_btn')}</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-[#1F293D] active:scale-95 transition-transform"
          >
            <span>{t('cart_order_home_btn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART SCREEN
  if (cartItems.length === 0) {
    const popularProducts = products.filter((p) => p.is_popular === true);

    return (
      <div className="space-y-6 pb-16 animate-in fade-in max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 shadow-2xs text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#1F293D] border border-gray-200 dark:border-white/10 text-gray-400 flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-950 dark:text-white">{t('cart_empty_title')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-relaxed">
              {t('cart_empty_desc')}
            </p>
          </div>

          <Link
            href="/catalog"
            onClick={() => triggerHaptic('light')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold rounded-lg text-xs shadow-xs active:scale-95 transition-transform"
          >
            <span>{t('go_to_catalog')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recommendations */}
        {popularProducts.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="px-0.5">
              <h3 className="text-base font-bold text-gray-950 dark:text-white tracking-tight">
                {t('home_popular')}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {popularProducts.map((product) => {
                const isLiked = isWishlisted(product.id);
                const cartItem = cartItems.find((item) => item.product.id === product.id);
                const cartQty = cartItem ? cartItem.quantity : 0;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isLiked={isLiked}
                    cartQuantity={cartQty}
                    onOpenDrawer={(id) => router.push(`/product/${id}`)}
                    onToggleWishlist={(id) => toggleWishlist(id)}
                    onAddToCart={(prod, e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerHaptic('medium');
                      const defaultVariant = prod.variants && prod.variants[0];
                      (useCartStore.getState() as any).addItem(prod, defaultVariant, 1);
                    }}
                    onUpdateQuantity={(id, q) => updateQuantity(id, q)}
                    onRemoveFromCart={(id) => removeItem(id)}
                    triggerHaptic={triggerHaptic}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. CART ACTIVE CHECKOUT SCREEN
  return (
    <div className="space-y-4 pb-20 animate-in fade-in max-w-5xl mx-auto">
      <TelegramLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />

      {/* 15:00 Stock Lock Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 rounded-xl p-2.5 sm:p-3 flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
          <Clock className="w-4 h-4 stroke-[2.2] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
            {t('cart_stock_reserved')} <span className="font-mono font-black">{formatTimer(timeLeft)}</span>
          </div>
          <p className="text-[11px] font-normal text-amber-700 dark:text-amber-300 leading-tight">
            {t('cart_stock_info')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Cart Items List & Promocode */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h1 className="text-base sm:text-lg font-bold text-gray-950 dark:text-white tracking-tight">
              {t('cart_title')} ({cartItems.length})
            </h1>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium');
                clearCart();
              }}
              className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium active:scale-95"
            >
              {t('cart_clear')}
            </button>
          </div>

          {/* Cart Items List */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/70 dark:border-white/10 p-3 sm:p-4 shadow-xs divide-y divide-gray-100 dark:divide-white/10">
            {cartItems.map((item) => {
              const unitPrice = item.variant?.price
                ? Number(item.variant.price)
                : Number(item.product.base_price);
              const name =
                typeof item.product.name === 'object' && item.product.name
                  ? (item.product.name as any)[lang] || (item.product.name as any).uz
                  : String(item.product.name || '');
              const img =
                item.product.images?.[0] ||
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300';

              return (
                <div
                  key={`${item.product.id}-${item.variant?.id || 'base'}`}
                  className="py-3 first:pt-0 last:pb-0 flex gap-3 sm:gap-4 items-center"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/60 dark:border-white/10 overflow-hidden shrink-0">
                    <img src={img} alt={name} className="w-full h-full object-cover object-center" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {name}
                    </h3>
                    {item.variant && (
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-300 text-[10px] font-semibold">
                        {item.variant.size || item.variant.color || `Variant ${item.variant.id}`}
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-gray-950 dark:text-white">
                      {unitPrice.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-gray-500">UZS</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id, item.variant?.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-[#161F30] p-0.5 rounded-lg border border-gray-200/60 dark:border-white/10">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() => {
                          if (item.quantity > 1) {
                            triggerHaptic('light');
                            updateQuantity(item.product.id, item.quantity - 1, item.variant?.id);
                          }
                        }}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-bold text-xs transition-all ${
                          item.quantity <= 1
                            ? 'opacity-30 cursor-not-allowed text-gray-400 bg-transparent'
                            : 'bg-white dark:bg-[#1F293D] shadow-2xs text-gray-700 dark:text-white active:scale-95'
                        }`}
                      >
                        <Minus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 dark:text-white min-w-[18px] text-center px-0.5">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          updateQuantity(item.product.id, item.quantity + 1, item.variant?.id);
                        }}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white dark:bg-[#1F293D] shadow-2xs flex items-center justify-center text-gray-700 dark:text-white active:scale-95 font-bold text-xs"
                      >
                        <Plus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promocode */}
          <div className="bg-white dark:bg-[#111827] rounded-xl p-3.5 sm:p-4 border border-gray-200/70 dark:border-white/10 shadow-xs space-y-2">
            <label className="text-xs font-bold text-gray-950 dark:text-white block">
              {t('cart_promo_label')}
            </label>
            {appliedPromocode ? (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      {appliedPromocode.code}
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {appliedPromocode.discount_type === 'PERCENT'
                        ? `${appliedPromocode.discount_value}${t('cart_promo_percent_applied')}`
                        : `${Number(appliedPromocode.discount_value).toLocaleString()} UZS chegirma`}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removePromocode()}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  {t('cancel')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="PROMO2026, SPRING2026..."
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white uppercase"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-lg font-bold text-xs hover:bg-black dark:hover:bg-gray-100 disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                >
                  {promoLoading ? '...' : t('cart_promo_apply')}
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-600 font-medium">{promoError}</p>}
          </div>
        </div>

        {/* Right Column: Checkout Info & Order Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/70 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white border-b border-gray-100 dark:border-white/10 pb-2.5">
              {t('cart_summary')}
            </h2>

            {/* 1. Delivery Type Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                {t('cart_delivery_method')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setDeliveryType('courier');
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all active:scale-95 ${
                    deliveryType === 'courier'
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#1E293B] ring-1 ring-gray-900 dark:ring-white text-gray-950 dark:text-white'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0 mt-0.5 text-gray-900 dark:text-white" />
                  <div>
                    <div className="text-xs font-bold">{t('cart_courier')}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{t('cart_courier_desc')}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setDeliveryType('pickup');
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all active:scale-95 ${
                    deliveryType === 'pickup'
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#1E293B] ring-1 ring-gray-900 dark:ring-white text-gray-950 dark:text-white'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0 mt-0.5 text-gray-900 dark:text-white" />
                  <div>
                    <div className="text-xs font-bold">{t('cart_pickup')}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">{t('cart_pickup_desc')}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Payment Method Switcher (Click, Payme, Cash) */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                {lang === 'uz' ? 'To\'lov usuli' : lang === 'ru' ? 'Способ оплаты' : 'Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setPaymentType('PAYME');
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                    paymentType === 'PAYME'
                      ? 'border-[#00C2AF] bg-teal-50/60 dark:bg-teal-950/40 ring-1 ring-[#00C2AF] text-gray-950 dark:text-white'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-[11px] font-black text-[#00C2AF]">PAYME</span>
                  <span className="text-[9px] font-semibold">Uzcard / Humo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setPaymentType('CLICK');
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                    paymentType === 'CLICK'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-600 text-gray-950 dark:text-white'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-[11px] font-black text-blue-600">CLICK</span>
                  <span className="text-[9px] font-semibold">Uzcard / Humo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setPaymentType('CASH');
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                    paymentType === 'CASH'
                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#1E293B] ring-1 ring-gray-900 dark:ring-white text-gray-950 dark:text-white'
                      : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold">Naqd pul</span>
                </button>
              </div>
            </div>

            {/* 3. Customer Info (Name, Phone, Address) */}
            <div className="space-y-2.5 pt-1 border-t border-gray-100 dark:border-white/10">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block">
                  {lang === 'uz' ? 'Qabul qiluvchi ismi' : lang === 'ru' ? 'Имя получателя' : 'Receiver Name'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ism Familiya"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block">
                  {t('cart_phone')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-mono font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                  />
                </div>
              </div>

              {deliveryType === 'courier' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 block">
                    {lang === 'uz' ? 'Yetkazib berish manzili' : lang === 'ru' ? 'Адрес доставки' : 'Delivery Address'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Toshkent sh., Chilonzor 9-mavze, 14-uy, 22-xonadon"
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart_products_price')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {subtotal.toLocaleString()} {t('currency')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>{t('cart_saved')}</span>
                  <span>-{discount.toLocaleString()} {t('currency')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart_delivery_fee')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {deliveryFee === 0 ? t('cart_free') : `${deliveryFee.toLocaleString()} ${t('currency')}`}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 dark:border-white/10 text-sm font-bold text-gray-950 dark:text-white">
                <span>{t('cart_total')}</span>
                <span className="text-base sm:text-lg text-gray-950 dark:text-white">
                  {totalPrice.toLocaleString()} {t('currency')}
                </span>
              </div>
            </div>

            {errorMessage && <p className="text-xs font-semibold text-red-600">{errorMessage}</p>}

            {/* Checkout Action Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full h-11 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100 shadow-sm disabled:opacity-50"
            >
              <span>
                {isSubmitting
                  ? 'Buyurtma rasmiylashtirilmoqda...'
                  : paymentType === 'CASH'
                  ? 'Buyurtmani tasdiqlash'
                  : `${paymentType === 'CLICK' ? 'Click' : 'Payme'} orqali to'lash`}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <TelegramProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}>
        <CartPageContent />
      </Suspense>
    </TelegramProvider>
  );
}
