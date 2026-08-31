'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { lang, t } = useLanguageStore();
  const { products, fetchProducts } = useProductStore();
  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = (products || []).find((p) => String(p.id) === String(params.id));
  const isWish = product ? isInWishlist(product.id) : false;
  const cartItem = product ? items.find((it) => it.product.id === product.id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-base font-bold text-gray-950 dark:text-white">Mahsulot topilmadi</h2>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs"
        >
          <span>Katalogga qaytish</span>
        </Link>
      </div>
    );
  }

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
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`p-2 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 ${
            isWish ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Main Layout: Left Gallery, Right Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Gallery */}
        <div className="md:col-span-6 space-y-3">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10">
            <img src={images[activeImageIdx]} alt={getTitle()} className="w-full h-full object-cover" />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                    activeImageIdx === idx ? 'border-gray-900 dark:border-white' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="md:col-span-6 space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              {product.sku || 'SKU-001'}
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              {getTitle()}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white">
                {basePrice.toLocaleString()} <span className="text-xs font-bold text-gray-400">UZS</span>
              </span>
              {oldPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {oldPrice.toLocaleString()} UZS
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {quantity === 0 ? (
              <button
                type="button"
                onClick={() => addItem(product as any)}
                className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-100 shadow-md active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Savatga qo'shish</span>
              </button>
            ) : (
              <div className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl px-4 flex items-center justify-between font-bold text-xs shadow-md">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="p-1 hover:opacity-70"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span>{quantity} ta savatda</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="p-1 hover:opacity-70"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {getDesc() && (
            <div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-white/10">
              <h4 className="text-xs font-bold text-gray-950 dark:text-white">Mahsulot haqida</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {getDesc()}
              </p>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-white/10 text-center">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#161F30] space-y-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto" />
              <div className="text-[10px] font-bold text-gray-900 dark:text-white">100% Original</div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#161F30] space-y-1">
              <Truck className="w-4 h-4 text-blue-500 mx-auto" />
              <div className="text-[10px] font-bold text-gray-900 dark:text-white">Tezkor yetkazish</div>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#161F30] space-y-1">
              <RotateCcw className="w-4 h-4 text-purple-500 mx-auto" />
              <div className="text-[10px] font-bold text-gray-900 dark:text-white">Kafolat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
