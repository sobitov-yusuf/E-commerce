'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ShoppingBag, PackageSearch } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function WishlistPage() {
  const { lang, t } = useLanguageStore();
  const { items: wishlistIds, clearWishlist } = useWishlistStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const wishProducts = (products || []).filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/10 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span>{lang === 'uz' ? 'Sevimlilar ro\'yxati' : 'Избранное'}</span>
          </h1>
          <p className="text-xs text-gray-400">
            {lang === 'uz' ? `Saqlangan ${wishProducts.length} ta mahsulot` : `Сохранено ${wishProducts.length} товаров`}
          </p>
        </div>

        {wishProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
          >
            {lang === 'uz' ? 'Tozalash' : 'Очистить'}
          </button>
        )}
      </div>

      {wishProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {wishProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/30 text-red-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Sevimlilar ro\'yxatingiz bo\'sh' : 'Список избранного пуст'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {lang === 'uz'
                ? 'O\'zingizga yoqqan tovarlarni yurakcha orqali saqlab qo\'yishingiz mumkin.'
                : 'Сохраняйте понравившиеся товары с помощью иконки сердечка.'}
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
      )}
    </div>
  );
}
