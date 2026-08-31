'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, PackageSearch, ArrowUpDown, Tag, Sparkles } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function CatalogPage() {
  const { lang, t } = useLanguageStore();
  const { products, isLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>('default');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const activeCategories = useMemo(() => {
    return (categories || []).filter((c) => c.isActive);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => String(p.category_id) === String(selectedCategory));
    }

    if (selectedBadge !== 'all') {
      list = list.filter((p) => p.badge === selectedBadge);
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    }

    return list;
  }, [products, selectedCategory, selectedBadge, sortBy]);

  const getCategoryName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Catalog Header */}
      <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/10 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-gray-950 dark:text-white tracking-tight">
            {lang === 'uz' ? 'Mahsulotlar Katalogi' : 'Каталог товаров'}
          </h1>
          <p className="text-xs text-gray-400">
            {lang === 'uz' ? `Jami ${filteredProducts.length} ta mahsulot` : `Всего ${filteredProducts.length} товаров`}
          </p>
        </div>

        {/* Sort Pill */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none cursor-pointer"
        >
          <option value="default">{lang === 'uz' ? 'Saralash: Standart' : 'Сортировка: По умолчанию'}</option>
          <option value="price_asc">{lang === 'uz' ? 'Narx: Arzondan qimmatga' : 'Сначала дешевле'}</option>
          <option value="price_desc">{lang === 'uz' ? 'Narx: Qimmatdan arzonga' : 'Сначала дороже'}</option>
        </select>
      </div>

      {/* 2-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column / Mobile Category Pills */}
        <div className="md:col-span-3 space-y-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">
            {lang === 'uz' ? 'Toifalar' : 'Категории'}
          </div>

          <div className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 text-left transition-all flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50'
              }`}
            >
              <span>{lang === 'uz' ? 'Barcha toifalar' : 'Все категории'}</span>
              <span className="text-[10px] opacity-70 ml-2">({products.length})</span>
            </button>

            {activeCategories.map((cat) => {
              const count = products.filter((p) => String(p.category_id) === String(cat.id)).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 text-left transition-all flex items-center justify-between ${
                    String(selectedCategory) === String(cat.id)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                      : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cat.image && (
                      <img src={cat.image} alt={getCategoryName(cat.name)} className="w-5 h-5 rounded-full object-cover" />
                    )}
                    <span>{getCategoryName(cat.name)}</span>
                  </div>
                  <span className="text-[10px] opacity-70 ml-2">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Products Grid */}
        <div className="md:col-span-9 space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111827] rounded-xl p-3 space-y-3 animate-pulse">
                  <div className="aspect-square bg-gray-100 dark:bg-[#161F30] rounded-lg" />
                  <div className="h-3 bg-gray-200 dark:bg-[#161F30] rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-[#161F30] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3 bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-6">
              <PackageSearch className="w-8 h-8 text-gray-400 mx-auto" />
              <div className="text-sm font-bold text-gray-950 dark:text-white">
                {lang === 'uz' ? 'Tanlangan toifada tovarlar topilmadi' : 'Товары не найдены'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
