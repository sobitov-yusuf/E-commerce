'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Filter, Search, PackageSearch, X, Check } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function CatalogPage() {
  const { lang } = useLanguageStore();
  const { products, isLoading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'price_asc' | 'price_desc'>('popular');
  const [onlySale, setOnlySale] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000000);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const activeCategories = useMemo(() => {
    return (categories || []).filter((c) => c.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let list = [...(products || [])];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => String(p.category_id) === String(selectedCategory));
    }

    if (onlySale) {
      list = list.filter((p) => p.old_price && Number(p.old_price) > Number(p.base_price));
    }

    list = list.filter((p) => p.base_price <= maxPrice);

    if (sortBy === 'popular') {
      list = list.filter((p) => p.badge === 'TOP').concat(list.filter((p) => p.badge !== 'TOP'));
    } else if (sortBy === 'new') {
      list = list.filter((p) => p.badge === 'NEW').concat(list.filter((p) => p.badge !== 'NEW'));
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.base_price - a.base_price);
    }

    return list;
  }, [products, selectedCategory, sortBy, onlySale, maxPrice]);

  const getCategoryName = (name: any) => {
    if (typeof name === 'object' && name) return name[lang] || name.uz || '';
    return String(name || '');
  };

  const resetFilters = () => {
    setSortBy('popular');
    setOnlySale(false);
    setMaxPrice(5000000);
  };

  return (
    <div className="flex h-[calc(100vh-60px)] sm:h-[calc(100vh-80px)] -mx-4 sm:mx-0 -mt-2 overflow-hidden bg-white dark:bg-[#0B0F17]">
      {/* 1. MASTER COLUMN (Left sidebar) */}
      <div className="w-[85px] sm:w-[240px] shrink-0 border-r border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-[#111827] overflow-y-auto no-scrollbar pb-24">
        <div className="flex flex-col py-2 sm:py-4 gap-1 sm:gap-2 px-1.5 sm:px-3">
          
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col sm:flex-row items-center sm:gap-3 py-3 sm:py-2.5 px-1 sm:px-3 rounded-xl transition-all ${
              selectedCategory === 'all'
                ? 'bg-gray-900 dark:bg-white shadow-sm'
                : 'hover:bg-gray-200/50 dark:hover:bg-[#161F30]'
            }`}
          >
            <div className={`w-[48px] h-[48px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center shrink-0 ${
              selectedCategory === 'all' ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-950' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <span className={`text-[10px] sm:text-sm font-bold text-center sm:text-left leading-tight mt-1 sm:mt-0 ${
              selectedCategory === 'all' ? 'text-white dark:text-gray-950' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {lang === 'uz' ? 'Barchasi' : lang === 'ru' ? 'Все' : 'All'}
            </span>
          </button>

          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`flex flex-col sm:flex-row items-center sm:gap-3 py-3 sm:py-2.5 px-1 sm:px-3 rounded-xl transition-all ${
                String(selectedCategory) === String(cat.id)
                  ? 'bg-gray-900 dark:bg-white shadow-sm'
                  : 'hover:bg-gray-200/50 dark:hover:bg-[#161F30]'
              }`}
            >
              <div className={`w-[48px] h-[48px] sm:w-[40px] sm:h-[40px] rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                String(selectedCategory) === String(cat.id) ? 'bg-white/20 dark:bg-black/10 p-0.5' : 'bg-gray-200 dark:bg-gray-800 p-0'
              }`}>
                {cat.image ? (
                  <img src={cat.image} alt={getCategoryName(cat.name)} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <PackageSearch className="w-5 h-5 text-current opacity-50" />
                )}
              </div>
              <span className={`text-[10px] sm:text-sm font-bold text-center sm:text-left leading-tight mt-1 sm:mt-0 line-clamp-2 ${
                String(selectedCategory) === String(cat.id) ? 'text-white dark:text-gray-950' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {getCategoryName(cat.name)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. DETAIL COLUMN (Right area) */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#FAFAFA] dark:bg-[#0B0F17]">
        {/* Detail Header & Filter Button */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 px-3 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-lg font-black text-gray-950 dark:text-white">
              {selectedCategory === 'all' 
                ? (lang === 'uz' ? 'Barcha mahsulotlar' : lang === 'ru' ? 'Все товары' : 'All Products')
                : getCategoryName(activeCategories.find(c => String(c.id) === String(selectedCategory))?.name)
              }
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400">
              {filteredProducts.length} {lang === 'uz' ? 'ta mahsulot' : lang === 'ru' ? 'товаров' : 'products'}
            </p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="h-9 sm:h-10 px-3 sm:px-4 bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D] rounded-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Filter className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white hidden sm:block">
              {lang === 'uz' ? 'Filtrlar' : lang === 'ru' ? 'Фильтры' : 'Filters'}
            </span>
          </button>
        </div>

        {/* Subcategories (Pills) placeholder if needed in future */}
        <div className="px-3 sm:px-6 py-3 hidden">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {/* pills */}
          </div>
        </div>

        {/* Product Grid */}
        <div className="p-3 sm:p-6 pb-24">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111827] rounded-xl p-3 space-y-3 animate-pulse border border-gray-100 dark:border-white/5">
                  <div className="aspect-square bg-gray-100 dark:bg-[#161F30] rounded-lg" />
                  <div className="h-3 bg-gray-200 dark:bg-[#161F30] rounded w-3/4" />
                  <div className="h-4 bg-gray-300 dark:bg-[#161F30] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#161F30] flex items-center justify-center mx-auto text-gray-400">
                <PackageSearch className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-950 dark:text-white">
                  {lang === 'uz' ? 'Mahsulotlar topilmadi' : lang === 'ru' ? 'Товары не найдены' : 'No products found'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {lang === 'uz' ? 'Boshqa toifa yoki filtrlarni tekshirib ko\'ring' : 'Try checking other categories or filters'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. FILTER MODAL (Drawer) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full bg-white dark:bg-[#111827] rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-200">
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2" onClick={() => setIsFilterOpen(false)}>
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-black text-gray-950 dark:text-white">
                {lang === 'uz' ? 'Filtrlar' : lang === 'ru' ? 'Фильтры' : 'Filters'}
              </h3>
              <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#161F30] text-gray-950 dark:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
              
              {/* Sort Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  {lang === 'uz' ? 'Saralash tartibi' : lang === 'ru' ? 'Сортировка' : 'Sort by'}
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'popular', label: { uz: 'Mashhurlari', ru: 'Популярные', en: 'Popular' } },
                    { id: 'new', label: { uz: 'Yangi kelganlar', ru: 'Новинки', en: 'New Arrivals' } },
                    { id: 'price_asc', label: { uz: 'Narx: Arzondan qimmatga', ru: 'Сначала дешевые', en: 'Price: Low to High' } },
                    { id: 'price_desc', label: { uz: 'Narx: Qimmatdan arzonga', ru: 'Сначала дорогие', en: 'Price: High to Low' } },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as any)}
                      className={`h-12 px-4 rounded-xl flex items-center justify-between border-2 transition-all ${
                        sortBy === option.id
                          ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-[#161F30]'
                          : 'border-transparent bg-gray-100 dark:bg-[#161F30] hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                      }`}
                    >
                      <span className={`text-sm font-bold ${sortBy === option.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {(option.label as any)[lang] || option.label.uz}
                      </span>
                      {sortBy === option.id && (
                        <div className="w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Only Sales Toggle */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-[#161F30] p-4 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {lang === 'uz' ? 'Faqat chegirmadagilar' : lang === 'ru' ? 'Только со скидкой' : 'Only discounted'}
                  </h4>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                    {lang === 'uz' ? 'Arzonlashtirilgan tovarlarni ko\'rish' : 'Show items on sale'}
                  </p>
                </div>
                <button
                  onClick={() => setOnlySale(!onlySale)}
                  className={`w-12 h-7 rounded-full p-1 transition-all ${onlySale ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${onlySale ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    {lang === 'uz' ? 'Narx chegarasi' : lang === 'ru' ? 'Цена' : 'Price limit'}
                  </h4>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {maxPrice.toLocaleString()} {lang === 'uz' ? 'UZS' : 'UZS'}
                  </span>
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-gray-900 dark:accent-white h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span>10,000</span>
                  <span>5,000,000+</span>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#111827] border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-3">
              <button
                onClick={resetFilters}
                className="h-12 bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-[#1F293D] transition-all"
              >
                {lang === 'uz' ? 'Tozalash' : lang === 'ru' ? 'Сбросить' : 'Reset'}
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-sm hover:bg-black dark:hover:bg-gray-100 transition-all shadow-md"
              >
                {lang === 'uz' ? 'Qo\'llash' : lang === 'ru' ? 'Применить' : 'Apply'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
