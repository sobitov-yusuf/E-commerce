'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw, PackageSearch, MessageCircle, Search } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useBannerStore } from '@/store/useBannerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { StoriesReel } from '@/components/home/StoriesReel';



export default function HomePage() {
  const { lang } = useLanguageStore();
  const { products, isLoading: isProductsLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { banners, fetchBanners } = useBannerStore();

  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'new' | 'sale'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStory, setActiveStory] = useState<any>(null);

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
      list = list.filter((p) => p.badge === 'TOP');
    } else if (activeTab === 'new') {
      list = list.filter((p) => p.badge === 'NEW');
    } else if (activeTab === 'sale') {
      list = list.filter((p) => p.old_price && Number(p.old_price) > Number(p.base_price));
    }

    return list;
  }, [products, selectedCategory, activeTab]);

  const getBannerText = (field: any) => {
    if (typeof field === 'object' && field) {
      return field[lang] || field.uz || '';
    }
    return String(field || '');
  };

  const activeBanners = (banners || []).filter((b) => b.isActive !== false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
            {/* 0. LONG SEARCH BAR */}
      <div className="px-0">
        <Link href="/search" className="block w-full">
          <div className="relative flex items-center w-full h-12 bg-white dark:bg-[#111827] border border-gray-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="pl-4 pr-3 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm font-medium text-gray-500">
              {lang === 'uz' ? 'Mahsulotlarni qidirish...' : lang === 'ru' ? '����� �������...' : 'Search products...'}
            </div>
          </div>
        </Link>
      </div>

      {/* Stories will be added here later if fetched from API */}

      {/* 2. HERO BANNER CAROUSEL */}
      {activeBanners.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden shadow-xs bg-gray-900 mx-1 sm:mx-0">
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

      {/* 3. CATEGORY CAPSULES CAROUSEL */}
      <CategoryCarousel 
        categories={categories || []}
        selectedCategoryId={selectedCategory === 'all' ? null : selectedCategory}
        onSelectCategory={(id) => setSelectedCategory(id === null ? 'all' : String(id))}
        triggerHaptic={() => {
          if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
            (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
          }
        }}
      />

      {/* 4. MAIN PRODUCT SHOWCASE */}
      <div className="space-y-4 px-1 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-gray-950 dark:text-white tracking-tight">
              {lang === 'uz' ? 'Tavsiya etiladigan mahsulotlar' : lang === 'ru' ? 'Рекомендуемые товары' : 'Recommended Products'}
            </h3>
            <span className="text-xs font-bold text-gray-400">({filteredProducts.length})</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
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
                {tab === 'all' && (lang === 'uz' ? 'Barchasi' : lang === 'ru' ? 'Все' : 'All')}
                {tab === 'popular' && (lang === 'uz' ? 'Mashhur' : lang === 'ru' ? 'Популярные' : 'Popular')}
                {tab === 'new' && (lang === 'uz' ? 'Yangi' : lang === 'ru' ? 'Новинки' : 'New')}
                {tab === 'sale' && (lang === 'uz' ? 'Chegirma' : lang === 'ru' ? 'Скидки' : 'Sale')}
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
                {lang === 'uz' ? 'Hozircha mahsulotlar mavjud emas' : lang === 'ru' ? 'Пока нет товаров' : 'No products available yet'}
              </h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                {lang === 'uz'
                  ? 'Admin panel orqali yangi tovarlar kiritilgach, bu yerda ko\'rinadi.'
                  : lang === 'ru' ? 'После добавления товаров в админ-панели они появятся здесь.' : 'Products will appear here once added via admin panel.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. TELEGRAM SUPPORT CTA BANNER */}
      <div className="mx-1 sm:mx-0 bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Savollaringiz bormi?' : lang === 'ru' ? 'Есть вопросы?' : 'Have any questions?'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {lang === 'uz' ? 'Bizning operatorlar sizga yordam berishga tayyor.' : lang === 'ru' ? 'Наши операторы готовы помочь вам.' : 'Our operators are ready to help you.'}
            </p>
          </div>
        </div>
        <a
          href="https://t.me/support_link_placeholder"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto h-10 px-6 bg-blue-600 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          <span>{lang === 'uz' ? 'Yozish' : lang === 'ru' ? 'Написать' : 'Write'}</span>
        </a>
      </div>

      {/* 6. TRUST & WARRANTY BADGES */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
        <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white">100% Original</div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white">
              {lang === 'uz' ? 'Tez Yetkazish' : lang === 'ru' ? 'Быстрая доставка' : 'Fast Delivery'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200/70 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white">
              {lang === 'uz' ? 'Oson Qaytarish' : lang === 'ru' ? 'Легкий возврат' : 'Easy Returns'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


