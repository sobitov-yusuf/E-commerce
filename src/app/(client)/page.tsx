'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw, PackageSearch } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useBannerStore } from '@/store/useBannerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function HomePage() {
  const { lang, t } = useLanguageStore();
  const { products, isLoading: isProductsLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { banners, fetchBanners } = useBannerStore();

  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'sale'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBanners();
  }, [fetchProducts, fetchCategories, fetchBanners]);

  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => String(p.category_id) === String(selectedCategory));
    }

    if (activeTab === 'popular') {
      list = list.filter((p) => p.badge === 'TOP' || (p.reviewsCount || 0) > 0);
    } else if (activeTab === 'new') {
      list = list.filter((p) => p.badge === 'NEW');
    } else if (activeTab === 'sale') {
      list = list.filter((p) => p.badge === 'SALE' || (p.old_price && Number(p.old_price) > Number(p.base_price)));
    }

    return list;
  }, [products, selectedCategory, activeTab]);

  const activeBanners = useMemo(() => {
    return (banners || []).filter((b) => b.isActive);
  }, [banners]);

  const activeCategories = useMemo(() => {
    return (categories || []).filter((c) => c.isActive);
  }, [categories]);

  const getCategoryName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  const getBannerText = (val: any) => {
    if (typeof val === 'object' && val) return val[lang] || val.uz || '';
    return String(val || '');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. HERO BANNER CAROUSEL */}
      {activeBanners.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden shadow-xs bg-gray-900">
          <div className="w-full h-40 sm:h-56 md:h-72 relative">
            <img
              src={activeBanners[0].image}
              alt={getBannerText(activeBanners[0].title)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white space-y-1">
              <h2 className="text-base sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {getBannerText(activeBanners[0].title)}
              </h2>
              {activeBanners[0].subtitle && (
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-1">
                  {getBannerText(activeBanners[0].subtitle)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. CATEGORY CAPSULES CAROUSEL */}
      {activeCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`h-11 sm:h-12 px-4 rounded-2xl font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                  : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-white/10'
              }`}
            >
              <span>{lang === 'uz' ? 'Barchasi' : 'Все'}</span>
            </button>

            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(String(cat.id))}
                className={`h-11 sm:h-12 px-3.5 sm:px-4 rounded-2xl font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2.5 transition-all ${
                  String(selectedCategory) === String(cat.id)
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                    : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-white/10'
                }`}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={getCategoryName(cat.name)}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                )}
                <span>{getCategoryName(cat.name)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. MAIN PRODUCT SHOWCASE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Tavsiya etiladigan mahsulotlar' : 'Рекомендуемые товары'}
            </h3>
            <span className="text-xs font-bold text-gray-400">({filteredProducts.length})</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'popular', 'new', 'sale'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-[#161F30]'
                }`}
              >
                {tab === 'all' && (lang === 'uz' ? 'Barchasi' : 'Все')}
                {tab === 'popular' && (lang === 'uz' ? 'Mashhur' : 'Популярные')}
                {tab === 'new' && (lang === 'uz' ? 'Yangi' : 'Новинки')}
                {tab === 'sale' && (lang === 'uz' ? 'Chegirma' : 'Скидки')}
              </button>
            ))}
          </div>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200/70 dark:border-white/10 p-3 space-y-3 animate-pulse"
              >
                <div className="aspect-square w-full bg-gray-100 dark:bg-[#161F30] rounded-lg" />
                <div className="h-3 bg-gray-200 dark:bg-[#161F30] rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-[#161F30] rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-[#161F30] rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center space-y-3 bg-white dark:bg-[#111827] rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-[#161F30] text-gray-400 flex items-center justify-center mx-auto">
              <PackageSearch className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-950 dark:text-white">
                {lang === 'uz' ? 'Hozircha mahsulotlar mavjud emas' : 'Товары пока не добавлены'}
              </h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                {lang === 'uz'
                  ? 'Admin panel orqali yangi tovarlar, toifalar va narxlarni kiritishingiz mumkin.'
                  : 'Вы можете добавить новые товары через панель администратора.'}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-xs hover:bg-black dark:hover:bg-gray-100 transition-all shadow-xs"
              >
                <span>Admin panelga o'tish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 4. TRUST & WARRANTY BADGES */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-gray-200/80 dark:border-white/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 p-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">100% Original</div>
            <div className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:block">Kafolatlangan sifat</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 p-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">Tezkor Yetkazish</div>
            <div className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:block">1 kun ichida</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 p-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white">Oson Qaytarish</div>
            <div className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:block">10 kun muddat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
