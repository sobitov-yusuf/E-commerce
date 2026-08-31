'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Heart, Star } from 'lucide-react';
import { ProductItem } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguageStore();
  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const cartItem = items.find((it) => it.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWish = isInWishlist(product.id);

  const getTitle = () => {
    if (typeof product.name === 'object' && product.name) {
      return product.name[lang] || product.name.uz || '';
    }
    return String(product.name || '');
  };

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

  const basePrice = Number(product.base_price);
  const oldPrice = product.old_price ? Number(product.old_price) : null;
  const hasDiscount = oldPrice && oldPrice > basePrice;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - basePrice) / oldPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity - 1);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <Link href={`/product/${product.id}`} className="block">
        {/* Image Container with Badges & Wishlist */}
        <div className="aspect-square w-full relative overflow-hidden bg-gray-50 dark:bg-[#161F30]">
          <img
            src={imageSrc}
            alt={getTitle()}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                -{discountPercent}%
              </span>
            )}
            {product.badge === 'TOP' && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                TOP
              </span>
            )}
            {product.badge === 'NEW' && (
              <span className="bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWish}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${
              isWish
                ? 'bg-red-50 text-red-500 shadow-xs'
                : 'bg-white/80 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3 space-y-1.5">
          <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[32px] leading-tight">
            {getTitle()}
          </h3>

          {/* Price Row */}
          <div>
            <div className="text-sm font-black text-gray-950 dark:text-white">
              {basePrice.toLocaleString()} <span className="text-[10px] font-semibold text-gray-400">UZS</span>
            </div>
            {hasDiscount && (
              <div className="text-[10px] text-gray-400 line-through">
                {oldPrice.toLocaleString()} UZS
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Uzum Market Style Full-width Bottom Button */}
      <div className="p-2.5 pt-0">
        {quantity === 0 ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-all shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Savatga' : 'В корзину'}</span>
          </button>
        ) : (
          <div className="w-full h-8 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl px-2 flex items-center justify-between font-bold text-xs shadow-xs">
            <button
              type="button"
              onClick={handleDecrease}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span>{quantity} ta</span>
            <button
              type="button"
              onClick={handleIncrease}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
