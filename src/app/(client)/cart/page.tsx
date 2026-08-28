'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useTelegram } from '@/components/telegram/TelegramProvider';
import { ProductCard } from '@/components/home/ProductCard';
import { useOrderStore } from '@/store/useOrderStore';

export default function CartPage() {
  const router = useRouter();
  const { user: tgUser } = useTelegram();
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

  const [deliveryType, setDeliveryType] = useState<'courier' | 'pickup'>('courier');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Promocode State
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [contactShared, setContactShared] = useState(false);

  // 15:00 Stock Lock Countdown Timer
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    triggerHaptic('medium');
    setPromoLoading(true);
    setPromoError('');

    setTimeout(() => {
      setPromoLoading(false);
      const code = promoInput.trim().toUpperCase();
      if (code === 'SPRING2026' || code === 'WELCOME10') {
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
        const errorMsg = lang === 'uz' ? 'Noto\'g\'ri promokod' : lang === 'ru' ? 'Неверный промокод' : 'Invalid promo code';
        setPromoError(errorMsg);
      }
    }, 500);
  };

  const handleRequestPhone = () => {
    triggerHaptic('medium');
    const mockPhone = '+998 (90) 123-45-67';
    setPhoneNumber(mockPhone);
    setContactShared(true);
  };

  useEffect(() => {
    fetchProducts(lang, null, '');
  }, [fetchProducts, lang]);

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

  const handleCheckout = () => {
    triggerHaptic('medium');

    const customerName = tgUser?.first_name
      ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim()
      : 'User';

    const orderId = addOrderToStore({
      user: customerName,
      phone: phoneNumber || '+998901234567',
      total: totalPrice,
      status: 'NEW',
      itemsCount: cartItems.length,
      location: deliveryType === 'courier' ? (address.trim() || 'Toshkent, Yunusobod') : 'Markaziy Filial (Do\'kondan olib ketish)',
      deliveryMethod: deliveryType,
      items: cartItems.map((i) => ({
        id: i.product.id,
        name: typeof i.product.name === 'object' ? (i.product.name[lang as keyof typeof i.product.name] || i.product.name.uz) : i.product.name,
        price: i.variant?.price ? Number(i.variant.price) : Number(i.product.base_price),
        quantity: i.quantity,
        image: i.product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        variant: i.variant?.size || (i.variant?.color ? `${i.variant.color}` : undefined),
      })),
    });

    setCreatedOrderId(orderId);
    setOrderSuccess(true);
    clearCart();
  };

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    const defaultVariant = product.variants && product.variants[0];
    // This logic relies on existing CartStore structure
    (useCartStore.getState() as any).addItem(product, defaultVariant, 1);
  };

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const deliveryFee = deliveryType === 'courier' ? (subtotal > 300000 ? 0 : 25000) : 0;
  const totalPrice = getTotalPrice(deliveryFee);

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8 space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white rounded-2xl flex items-center justify-center shadow-xs border border-gray-200 dark:border-white/10">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white tracking-tight">{t('cart_order_success_title')}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-normal">
            {t('cart_order_success_desc')}
          </p>
          {createdOrderId && (
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-[#161F30] rounded-lg text-xs font-mono font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 mt-1">
              Buyurtma ID: {createdOrderId}
            </div>
          )}
        </div>

        {/* Order Alert Banner */}
        <div className="w-full max-w-xs bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 rounded-xl p-3.5 text-left text-xs text-gray-800 dark:text-gray-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-gray-950 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t('cart_order_bot_title')}</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 font-normal">
            {t('cart_order_bot_desc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs space-y-2 pt-2">
          <Link
            href="/profile"
            className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-transform duration-100"
          >
            <span>{t('cart_order_track_btn')}</span>
          </Link>

          <Link
            href="/"
            className="w-full py-2.5 bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-[#1F293D] active:scale-95 transition-transform duration-100"
          >
            <span>{t('cart_order_home_btn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // CASE: EMPTY CART -> Show Compact Notice + Recommendations Grid ("Mashhur")
  if (cartItems.length === 0) {
    return (
      <div className="space-y-6 pb-16 animate-in fade-in max-w-7xl mx-auto">
        {/* Compact Empty State Box */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-950">{t('cart_empty_title')}</h2>
            <p className="text-xs text-gray-500 font-normal leading-relaxed">
              {t('cart_empty_desc')}
            </p>
          </div>

          <Link
            href="/catalog"
            onClick={() => triggerHaptic('light')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold rounded-lg text-xs shadow-xs active:scale-95 transition-transform duration-100"
          >
            <span>{t('go_to_catalog')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recommendations Showcase ("Mashhur" - Exact Uzum Market Style) */}
        {(() => {
          const popularRecommendations = products.filter((p) => p.is_popular === true);
          if (popularRecommendations.length === 0) return null;

          return (
            <div className="space-y-3 pt-2">
              <div className="px-0.5">
                <h3 className="text-base font-bold text-gray-950 tracking-tight">
                  {t('home_popular')}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {popularRecommendations.map((product) => {
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
                      onAddToCart={(prod, e) => handleAddToCart(prod, e)}
                      onUpdateQuantity={(id, q) => updateQuantity(id, q)}
                      onRemoveFromCart={(id) => removeItem(id)}
                      triggerHaptic={triggerHaptic}
                    />
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // CASE: CART HAS ITEMS
  return (
    <div className="space-y-4 pb-16 animate-in fade-in max-w-5xl mx-auto">
      {/* 15:00 Stock Lock Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
          <Clock className="w-4 h-4 stroke-[2.2] animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-amber-900">
            {t('cart_stock_reserved')} <span className="font-mono font-black">{formatTimer(timeLeft)}</span>
          </div>
          <p className="text-[11px] font-normal text-amber-700 leading-tight">
            {t('cart_stock_info')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h1 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight">{t('cart_title')}</h1>
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

          <div className="bg-white rounded-2xl border border-gray-200/70 p-3 sm:p-4 shadow-xs divide-y divide-gray-100">
            {cartItems.map((item) => {
              const unitPrice = item.variant?.price
                ? Number(item.variant.price)
                : Number(item.product.base_price);
              const name =
                typeof item.product.name === 'object' && item.product.name
                  ? (item.product.name as any)[lang] || (item.product.name as any).uz
                  : String(item.product.name || '');
              const img = item.product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300';

              return (
                <div key={`${item.product.id}-${item.variant?.id || 'base'}`} className="py-3 first:pt-0 last:pb-0 flex gap-3 sm:gap-4 items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-200/60 overflow-hidden shrink-0">
                    <img
                      src={img}
                      alt={name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                      {name}
                    </h3>
                    {item.variant && (
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                        {item.variant.size || item.variant.color || `Variant ${item.variant.id}`}
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-gray-950">
                      {unitPrice.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-gray-500">UZS</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id, item.variant?.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 active:scale-95 transition-transform duration-100"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg border border-gray-200/60">
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
                            : 'bg-white shadow-2xs text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform duration-100'
                        }`}
                        aria-label="Kamaytirish"
                      >
                        <Minus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 min-w-[18px] text-center px-0.5">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          updateQuantity(item.product.id, item.quantity + 1, item.variant?.id);
                        }}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white shadow-2xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform duration-100 font-bold text-xs"
                        aria-label="Ko'paytirish"
                      >
                        <Plus className="w-3 h-3 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Promocode Input Section */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-200/70 shadow-xs space-y-2">
            <label className="text-xs font-bold text-gray-950 block">{t('cart_promo_label')}</label>
            {appliedPromocode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900">{appliedPromocode.code}</div>
                    <div className="text-[10px] text-emerald-700">
                      {appliedPromocode.discount_type === 'PERCENT'
                        ? `${appliedPromocode.discount_value}${t('cart_promo_percent_applied')}`
                        : `${Number(appliedPromocode.discount_value).toLocaleString()} ${t('currency')} ${t('cart_promo_fixed_applied')}`}
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
                  placeholder={t('cart_promo_label')}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 outline-none focus:border-gray-900 uppercase"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-xs hover:bg-black disabled:opacity-50 active:scale-95 transition-all shadow-xs"
                >
                  {promoLoading ? '...' : t('cart_promo_apply')}
                </button>
              </form>
            )}
            {promoError && <p className="text-[11px] text-red-600 font-medium">{promoError}</p>}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/70 p-4 sm:p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-950 border-b border-gray-100 pb-2.5">
              {t('cart_summary')}
            </h2>

            {/* Delivery Type Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">{t('cart_delivery_method')}</label>
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

            {/* Phone number verification */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-gray-700 block">{t('cart_phone')}</label>
              {contactShared ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{phoneNumber}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{t('cart_verified')}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPhone}
                  className="w-full py-2.5 bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('cart_send_phone')}</span>
                </button>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t('cart_products_price')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{subtotal.toLocaleString()} {t('currency')}</span>
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
                <span className="text-base sm:text-lg text-gray-950 dark:text-white">{totalPrice.toLocaleString()} {t('currency')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-11 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100 shadow-sm"
            >
              <span>{t('cart_checkout_btn')}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-white dark:text-gray-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
