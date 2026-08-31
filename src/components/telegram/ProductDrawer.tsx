'use client';

import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { ProductItem } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface ProductDrawerProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDrawer({ product, isOpen, onClose }: ProductDrawerProps) {
  const { lang } = useLanguageStore();
  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !product) return null;

  const cartItem = items.find((it) => it.product.id === product.id && it.variantId === selectedVariantId);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isWish = isInWishlist(product.id);

  const getTitle = () => {
    if (typeof product.name === 'object' && product.name) {
      return product.name[lang] || product.name.uz || '';
    }
    return String(product.name || '');
  };

  const getDesc = () => {
    if (typeof product.description === 'object' && product.description) {
      return product.description[lang] || product.description.uz || '';
    }
    return String(product.description || '');
  };

  const basePrice = Number(product.base_price);
  const oldPrice = product.old_price ? Number(product.old_price) : null;
  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#111827] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-white/10 shadow-2xl p-4 sm:p-6 space-y-4">
        {/* Header with Close */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.sku || 'SKU-001'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-300"
            >
              <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#161F30]">
          <img src={images[activeImageIdx]} alt={getTitle()} className="w-full h-full object-cover" />
        </div>

        {/* Title & Price */}
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">{getTitle()}</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-black text-gray-950 dark:text-white">
              {basePrice.toLocaleString()} UZS
            </span>
            {oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                {oldPrice.toLocaleString()} UZS
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {getDesc() && (
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {getDesc()}
          </p>
        )}

        {/* Add to Cart Action */}
        <div className="pt-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addItem(product as any, selectedVariantId)}
              className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-100 shadow-md active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Savatga qo'shish</span>
            </button>
          ) : (
            <div className="w-full h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl px-4 flex items-center justify-between font-bold text-xs">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity - 1, selectedVariantId)}
                className="p-1 hover:opacity-70"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span>{quantity} ta savatda</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, quantity + 1, selectedVariantId)}
                className="p-1 hover:opacity-70"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
