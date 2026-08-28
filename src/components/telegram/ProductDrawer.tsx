'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  Check,
  Share2,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ProductDrawerProps {
  productId: number | null;
  onClose: () => void;
}

export function ProductDrawer({ productId, onClose }: ProductDrawerProps) {
  const { lang, t } = useLanguageStore();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { currentProduct, fetchProductDetail, isLoadingDetail } = useProductStore();
  const { addItem: addItemToCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
      setActiveImageIndex(0);
      setQuantity(1);
      setAddedAnimation(false);
      // Lock body scroll on mobile
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [productId, fetchProductDetail]);

  useEffect(() => {
    if (currentProduct?.variants && currentProduct.variants.length > 0) {
      setSelectedVariantId(currentProduct.variants[0].id);
    } else {
      setSelectedVariantId(null);
    }
  }, [currentProduct]);

  if (!productId) return null;

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Fallback
    }
  };

  const product = currentProduct;
  const isLiked = isWishlisted(productId);

  const handleAddToCart = () => {
    if (!product) return;
    triggerHaptic('medium');
    const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
    addItemToCart(product as any, selectedVariant as any, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 850);
  };

  const localizedName = product
    ? typeof product.name === 'object' && product.name
      ? (product.name as any)[lang] || (product.name as any).uz
      : String(product.name || '')
    : '';

  const localizedDesc = product
    ? typeof product.description === 'object' && product.description
      ? (product.description as any)[lang] || (product.description as any).uz
      : String(product.description || '')
    : '';

  const localizedCategory = product
    ? typeof product.category?.name === 'object' && product.category.name
      ? (product.category.name as any)[lang] || (product.category.name as any).uz
      : product.category?.name || 'PREMIUM'
    : 'PREMIUM';

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share && product) {
      navigator.share({
        title: localizedName,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product?.base_price || 0;
  const oldPrice = product?.old_price || null;
  const hasDiscount = Boolean(oldPrice && oldPrice > currentPrice);
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice! - currentPrice) / oldPrice!) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => {
          triggerHaptic('light');
          onClose();
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Responsive Sheet */}
      <div
        className="relative z-10 w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] sm:max-h-[85vh] flex flex-col shadow-2xl border-t sm:border border-gray-200/90 overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center cursor-grab shrink-0">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Top Floating Control Actions */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-lg bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-95 transition-transform duration-100 shadow-2xs"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 stroke-[2]" />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              toggleWishlist(productId);
            }}
            className="w-9 h-9 rounded-lg bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 active:scale-95 transition-transform duration-100 shadow-2xs"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''} stroke-[2.2]`} />
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-9 h-9 rounded-lg bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-gray-950 active:scale-95 transition-transform duration-100 shadow-2xs"
            aria-label={t('close')}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {isLoadingDetail || !product ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-gray-500">{t('drawer_loading')}</span>
            </div>
          ) : (
            <>
              {/* 1. Multi-Image Gallery */}
              <div className="space-y-2.5">
                <div className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 relative border border-gray-200/80 shadow-2xs">
                  <img
                    src={product.images?.[activeImageIndex] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700'}
                    alt={localizedName}
                    className="w-full h-full object-cover object-center select-none"
                  />
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase shadow-2xs">
                      -{discountPercent}% {t('badge_sale')}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setActiveImageIndex(idx);
                        }}
                        className={`w-14 h-14 rounded-lg overflow-hidden border transition-all active:scale-95 shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-gray-900 ring-2 ring-gray-900/20'
                            : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover object-center" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Header Details (Category, Rating, Title, Clean Full-Priority Price) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    {localizedCategory}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9 (128 {t('drawer_reviews_count')})</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-gray-950 leading-snug">
                  {localizedName}
                </h2>

                {/* Price Display with full vertical priority */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-950">
                    {currentPrice.toLocaleString()} <span className="text-xs sm:text-sm font-normal text-gray-500">{t('currency')}</span>
                  </span>
                  {hasDiscount && (
                    <span className="text-xs sm:text-sm font-normal text-gray-400 line-through">
                      {oldPrice!.toLocaleString()} {t('currency')}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. SKU Variants Selector (Size / Color) */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                    {t('drawer_size_variant')}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedVariantId(variant.id);
                          }}
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-all duration-100 active:scale-95 flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 font-bold shadow-xs'
                              : 'bg-white dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <span>{variant.size || variant.color || `Variant ${variant.id}`}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Product Description */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                  {t('drawer_about')}
                </span>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {localizedDesc}
                </p>
              </div>

              {/* 5. Assurance Badges Strip (Delivery & Payment) */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 space-y-1">
                  <Truck className="w-4 h-4 text-gray-900 dark:text-white mx-auto stroke-[2]" />
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white block leading-tight">{t('drawer_delivery_time')}</span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-400 font-normal">{t('drawer_delivery_city')}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 space-y-1">
                  <CreditCard className="w-4 h-4 text-gray-900 dark:text-white mx-auto stroke-[2]" />
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white block leading-tight">{t('drawer_payment_methods')}</span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-400 font-normal">{t('drawer_payment_cash')}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-gray-900 dark:text-white mx-auto stroke-[2]" />
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white block leading-tight">{t('drawer_warranty_days')}</span>
                  <span className="text-[9px] text-gray-400 dark:text-gray-400 font-normal">{t('drawer_warranty_return')}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer: Quantity Selector + Primary Action Button */}
        {product && !isLoadingDetail && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#111827] border-t border-gray-200/90 dark:border-white/10 flex items-center gap-3 shrink-0">
            {/* Quantity [- 1 +] */}
            <div className="h-11 px-1.5 rounded-lg bg-gray-100 dark:bg-[#1F293D] border border-gray-200/80 dark:border-white/10 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setQuantity((prev) => Math.max(1, prev - 1));
                }}
                className="w-8 h-8 rounded-md bg-white dark:bg-[#161F30] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 font-bold text-sm active:scale-95 transition-transform duration-100 shadow-2xs"
                aria-label="Kamaytirish"
              >
                -
              </button>
              <span className="text-sm font-bold text-gray-950 dark:text-white min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setQuantity((prev) => prev + 1);
                }}
                className="w-8 h-8 rounded-md bg-white dark:bg-[#161F30] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 font-bold text-sm active:scale-95 transition-transform duration-100 shadow-2xs"
                aria-label="Ko'paytirish"
              >
                +
              </button>
            </div>

            {/* Solid Dark Charcoal Add to Cart CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-11 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform duration-100 shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('drawer_added_success')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-[2] text-white dark:text-gray-950" />
                  <span>{t('drawer_add_to_cart')} • {(currentPrice * quantity).toLocaleString()} {t('currency')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
