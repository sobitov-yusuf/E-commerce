'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, X, PackageSearch, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function SearchPage() {
  const { lang } = useLanguageStore();
  const { products, fetchProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    return (products || []).filter((p) => {
      const name = typeof p.name === 'object' ? (p.name[lang] || p.name.uz || '').toLowerCase() : String(p.name).toLowerCase();
      const desc = typeof p.description === 'object' ? (p.description[lang] || p.description.uz || '').toLowerCase() : String(p.description || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [products, searchQuery, lang]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="p-2.5 rounded-xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex-1 relative">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'uz' ? 'Mahsulotlarni qidirish...' : 'Поиск товаров...'}
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {searchQuery.trim() ? (
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-400">
            {lang === 'uz' ? `Natijalar: ${results.length} ta topildi` : `Найдено: ${results.length}`}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-6">
              <PackageSearch className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-xs font-bold text-gray-950 dark:text-white">
                {lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-gray-400">
          {lang === 'uz' ? 'Qidirmoqchi bo\'lgan tovar nomini yozing' : 'Введите название товара для поиска'}
        </div>
      )}
    </div>
  );
}
