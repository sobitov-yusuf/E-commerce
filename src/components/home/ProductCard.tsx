'use client';

import React from 'react';
import { Heart, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { ProductItem } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ProductCardProps {
  product: ProductItem;
  isLiked: boolean;
  cartQuantity: number;
  onOpenDrawer: (productId: number) => void;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: ProductItem, e: React.MouseEvent) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  triggerHaptic?: (type?: 'light' | 'medium' | 'heavy') => void;
}

export function ProductCard({
  product,
  isLiked,
  cartQuantity,
  onOpenDrawer,
  onToggleWishlist,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  triggerHaptic,
}: ProductCardProps) {
  const { lang, t } = useLanguageStore();

  const localizedName =
    typeof product.name === 'object' && product.name
      ? (product.name as any)[lang] || product.name.uz
      : String(product.name || '');

  const localizedCategory =
    typeof product.category?.name === 'object' && product.category.name
      ? (product.category.name as any)[lang] || product.category.name.uz
      : product.category?.name || 'PREMIUM';

  const hasDiscount = Boolean(product.old_price && product.old_price > product.base_price);
  const discountPercent = hasDiscount
    ? Math.round(((product.old_price! - product.base_price) / product.old_price!) * 100)
    : 0;

  return (
    <div
      onClick={() => {
        triggerHaptic?.('light');
        onOpenDrawer(product.id);
      }}
      className="relative group cursor-pointer rounded-xl border border-gray-200/70 shadow-sm bg-white hover:shadow-md hover:-translate-y-0.5 transition-all p-2.5 sm:p-3 flex flex-col justify-between"
    >
      <div>
        {/* Aspect-Square Image Container */}
        <div className="aspect-square w-full overflow-hidden bg-gray-50 rounded-lg relative mb-2 sm:mb-2.5 border border-gray-100">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}
            alt={localizedName}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500';
            }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          {hasDiscount ? (
            <div className="absolute top-2 left-2 rounded-md text-[11px] font-semibold px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 uppercase shadow-2xs">
              -{discountPercent}%
            </div>
          ) : (
            <div className="absolute top-2 left-2 rounded-md text-[11px] font-semibold px-2 py-0.5 bg-gray-900 text-white uppercase shadow-2xs">
              {product.badge === 'TOP'
                ? t('badge_top')
                : product.badge === 'SALE'
                ? t('badge_sale')
                : t('badge_new')}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerHaptic?.('medium');
              onToggleWishlist(product.id);
            }}
            className="absolute top-1 right-1 w-10 h-10 flex items-center justify-center z-10 active:scale-95 transition-transform duration-100"
            aria-label="Wishlist"
          >
            <div className="w-8 h-8 rounded-full bg-white/90 border border-gray-200/80 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''} stroke-[2.2]`} />
            </div>
          </button>
        </div>

        {/* Card Typography & Details */}
        <div className="px-0.5 space-y-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold truncate">
              {localizedCategory}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 shrink-0">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Product Name */}
          <h4 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] leading-snug">
            {localizedName}
          </h4>
        </div>
      </div>

      {/* Card Footer: Uzum Market Style Structure (Price row on top, Full-width button below) */}
      <div className="px-0.5 pt-2 mt-auto space-y-2">
        {/* Full-width Price Row */}
        <div className="space-y-0.5">
          {hasDiscount ? (
            <span className="text-xs font-normal text-gray-400 line-through leading-none block">
              {product.old_price!.toLocaleString()} {t('currency')}
            </span>
          ) : (
            <span className="text-xs font-normal text-transparent leading-none block select-none">
              &nbsp;
            </span>
          )}
          <div className="text-base font-bold text-gray-950 leading-tight">
            {product.base_price.toLocaleString()}
            <span className="text-xs font-normal text-gray-500 ml-1">{t('currency')}</span>
          </div>
        </div>

        {/* Bottom Full-Width Action Button (Savatga or Stepper) */}
        <div>
          {cartQuantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full h-9 px-2 rounded-lg bg-gray-900 dark:bg-[#1E293B] text-white flex items-center justify-between shadow-xs border border-transparent dark:border-white/10"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic?.('light');
                  if (cartQuantity <= 1) {
                    onRemoveFromCart(product.id);
                  } else {
                    onUpdateQuantity(product.id, cartQuantity - 1);
                  }
                }}
                className="w-7 h-7 rounded-md bg-gray-800 dark:bg-[#0F172A] flex items-center justify-center text-gray-200 hover:text-white dark:text-gray-200 dark:hover:text-white hover:bg-gray-700 dark:hover:bg-[#161F30] active:scale-95 transition-transform duration-100 font-bold text-sm"
                aria-label="Kamaytirish"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <span className="text-xs font-bold text-white min-w-[20px] text-center">
                {cartQuantity} {t('pcs')}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic?.('light');
                  onAddToCart(product, e);
                }}
                className="w-7 h-7 rounded-md bg-gray-800 dark:bg-[#0F172A] flex items-center justify-center text-white hover:bg-gray-700 dark:hover:bg-[#161F30] active:scale-95 transition-transform duration-100 font-bold text-sm"
                aria-label="Ko'paytirish"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => onAddToCart(product, e)}
              className="w-full h-9 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-100 shadow-xs hover:bg-black dark:hover:bg-gray-100"
              aria-label="Savatga qo'shish"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{t('add_to_cart')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
