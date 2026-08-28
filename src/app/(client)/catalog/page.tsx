'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Check,
  RotateCcw,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function CatalogPage() {
  const router = useRouter();
  const { t, lang } = useLanguageStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  // Filter Modal & State
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc'>('popular');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [onlyDiscount, setOnlyDiscount] = useState<boolean>(false);

  const { products, isLoading } = useProductStore();
  const { categories: storeCategories } = useCategoryStore();
  const { items: cartItems, addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const activeCategories = storeCategories.filter((c) => c.isActive !== false);
  const currentCategory = activeCategories.find((c) => c.id === selectedCategoryId) || activeCategories[0];
  const localizedCategoryName = currentCategory
    ? typeof currentCategory.name === 'object'
      ? (currentCategory.name as any)[lang] || currentCategory.name.uz
      : currentCategory.name
    : '';

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const handleResetFilters = () => {
    triggerHaptic('medium');
    setSortBy('popular');
    setMinPrice(0);
    setMaxPrice(1000000);
    setOnlyDiscount(false);
    setSelectedSubcategory('all');
    setSearchQuery('');
  };

  const isFilterActive = sortBy !== 'popular' || minPrice > 0 || maxPrice < 1000000 || onlyDiscount;

  // Extract dynamic subcategory tags for current category
  const rawCatProducts = products.filter((p) => currentCategory && (p.category_id === currentCategory.id || (!p.category_id && currentCategory.id === 1)));
  const dynamicTags = Array.from(new Set(rawCatProducts.flatMap((p) => p.tags || []))).slice(0, 5);

  // Multi-Level Filtering
  let categoryProducts = products.filter((p) => {
    const matchesCategory = currentCategory ? (p.category_id === currentCategory.id || (!p.category_id && currentCategory.id === 1)) : true;
    if (!matchesCategory) return false;

    const nameStr = typeof p.name === 'object' && p.name ? (p.name as any)[lang] || p.name.uz || '' : String(p.name || '');
    const descStr = typeof p.description === 'object' && p.description ? (p.description as any)[lang] || (p.description as any).uz || '' : String(p.description || '');
    const name = nameStr.toLowerCase();
    const desc = descStr.toLowerCase();

    if (selectedSubcategory !== 'all') {
      const tagMatch = p.tags?.some((t) => t.toLowerCase() === selectedSubcategory.toLowerCase());
      const textMatch = name.includes(selectedSubcategory.toLowerCase()) || desc.includes(selectedSubcategory.toLowerCase());
      if (!tagMatch && !textMatch) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!name.includes(q) && !desc.includes(q)) return false;
    }

    if (p.base_price < minPrice || p.base_price > maxPrice) return false;
    if (onlyDiscount && (!p.old_price || p.old_price <= p.base_price)) return false;

    return true;
  });

  if (sortBy === 'price_asc') {
    categoryProducts.sort((a, b) => a.base_price - b.base_price);
  } else if (sortBy === 'price_desc') {
    categoryProducts.sort((a, b) => b.base_price - a.base_price);
  } else if (sortBy === 'newest') {
    categoryProducts.sort((a, b) => (b.badge === 'NEW' ? 1 : 0) - (a.badge === 'NEW' ? 1 : 0));
  } else if (sortBy === 'popular') {
    categoryProducts.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
  }

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    const defaultVariant = product.variants && product.variants[0];
    addItemToCart(product as any, defaultVariant as any, 1);
  };

  return (
    <div className="space-y-3 pb-16 animate-in fade-in max-w-7xl mx-auto">
      {/* 1. Top Search & Filter Bar */}
      <div className="flex items-center gap-2 pt-0.5">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <Search className="w-4 h-4 stroke-[2]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${localizedCategoryName}...`}
            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200/80 focus:border-gray-900 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setSearchQuery('');
              }}
              className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            setShowFilterModal(true);
          }}
          className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-transform duration-100 shadow-2xs shrink-0 ${
            isFilterActive
              ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 font-bold'
              : 'bg-white dark:bg-[#161F30] border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('catalog_filter')}</span>
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* 2. Uzum Mobile Master-Detail 2-Column Layout */}
      <div className="flex gap-2.5 sm:gap-4 items-start h-[calc(100vh-175px)] sm:h-[calc(100vh-160px)]">
        {/* LEFT COLUMN: Master Categories Sidebar */}
        <aside className="w-[82px] sm:w-[100px] md:w-[210px] h-full bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xs overflow-y-auto no-scrollbar p-1.5 space-y-1 shrink-0 select-none">
          {activeCategories.map((cat) => {
            const isSelected = currentCategory?.id === cat.id;
            const catName = typeof cat.name === 'object' ? (cat.name as any)[lang] || cat.name.uz : cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategoryId(cat.id);
                  setSelectedSubcategory('all');
                }}
                className={`w-full p-2 rounded-xl transition-all duration-150 active:scale-95 flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-center md:text-left ${
                  isSelected
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs font-bold'
                    : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#161F30] hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 md:w-8 md:h-8 rounded-full overflow-hidden shrink-0 border ${
                    isSelected ? 'border-white/40 ring-2 ring-white/20' : 'border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-[#161F30]'
                  }`}
                >
                  <img src={cat.image} alt={catName} className="w-full h-full object-cover object-center" />
                </div>

                <span className="text-[10px] sm:text-[11px] md:text-xs font-medium md:font-semibold line-clamp-2 leading-tight flex-1">
                  {catName}
                </span>

                <ChevronRight
                  className={`hidden md:block w-3.5 h-3.5 shrink-0 ${
                    isSelected ? 'text-white dark:text-gray-950' : 'text-gray-400'
                  }`}
                />
              </button>
            );
          })}
        </aside>

        {/* RIGHT COLUMN: Detail Subcategories & Products Showcase */}
        <section className="flex-1 h-full bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xs overflow-y-auto no-scrollbar p-3 sm:p-4 space-y-3 flex flex-col">
          {/* Header Info */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-2 shrink-0">
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gray-950 dark:text-white leading-none">
                {localizedCategoryName}
              </h1>
              <span className="text-[11px] text-gray-400 font-normal mt-0.5 block">
                {categoryProducts.length} {t('catalog_available')}
              </span>
            </div>

            {isFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-red-600 font-semibold flex items-center gap-1 hover:underline active:scale-95"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('clear')}</span>
              </button>
            )}
          </div>

          {/* Subcategories Horizontal Pills */}
          {dynamicTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 pb-0.5 select-none">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedSubcategory('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 whitespace-nowrap active:scale-95 ${
                  selectedSubcategory === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                    : 'bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                }`}
              >
                {t('home_all')}
              </button>
              {dynamicTags.map((tag) => {
                const isSelected = selectedSubcategory === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSelectedSubcategory(tag);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 whitespace-nowrap active:scale-95 capitalize ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-2xs'
                        : 'bg-gray-100 dark:bg-[#161F30] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1F293D]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-2.5 border border-gray-200/70 flex flex-col h-56 animate-pulse shadow-2xs"
                  >
                    <div className="bg-gray-100 rounded-lg aspect-square w-full mb-2" />
                    <div className="bg-gray-100 h-3.5 rounded w-3/4 mb-1.5" />
                    <div className="bg-gray-100 h-3 rounded w-1/2 mb-auto" />
                    <div className="bg-gray-100 h-8 rounded-lg w-full" />
                  </div>
                ))}
              </div>
            ) : categoryProducts.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                <ShoppingBag className="w-10 h-10 text-gray-300 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">{t('catalog_empty')}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {categoryProducts.map((product) => {
                  const isLiked = isWishlisted(product.id);
                  const cartItem = cartItems.find((item) => item.product.id === product.id);
                  const cartQty = cartItem ? cartItem.quantity : 0;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isLiked={isLiked}
                      cartQuantity={cartQty}
                      onOpenDrawer={(id) => router.push(`/product/${id}`)}
                      onToggleWishlist={(id) => toggleWishlist(id)}
                      onAddToCart={(prod, e) => handleAddToCart(prod, e)}
                      onUpdateQuantity={(id, q) => updateCartQuantity(id, q)}
                      onRemoveFromCart={(id) => removeItemFromCart(id)}
                      triggerHaptic={triggerHaptic}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 3. Advanced Filter & Sort Modal Drawer */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-900" />
                <h3 className="text-sm font-bold text-gray-950">{t('catalog_filter')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* A. Sorting Selection */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                {t('catalog_sorting')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'popular', label: t('catalog_sort_popular') },
                  { id: 'newest', label: t('catalog_sort_newest') },
                  { id: 'price_asc', label: t('catalog_sort_price_asc') },
                  { id: 'price_desc', label: t('catalog_sort_price_desc') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setSortBy(item.id as any);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all duration-100 active:scale-95 text-left flex items-center justify-between ${
                      sortBy === item.id
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-950 font-bold'
                        : 'bg-gray-50 dark:bg-[#161F30] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F293D]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {sortBy === item.id && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* B. Price Range Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span>{t('catalog_price_range')}</span>
                <span className="text-gray-950 dark:text-white font-bold">
                  {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} {t('currency')}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white cursor-pointer"
              />
            </div>

            {/* C. Only Discounts Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{t('catalog_only_discount')}</span>
              </div>
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={(e) => {
                  triggerHaptic('light');
                  setOnlyDiscount(e.target.checked);
                }}
                className="w-4 h-4 rounded accent-gray-900 dark:accent-white cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-[#1F293D] hover:bg-gray-200 dark:hover:bg-[#27354E] text-gray-800 dark:text-white font-semibold text-xs rounded-lg active:scale-95 transition-transform"
              >
                {t('clear')}
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium');
                  setShowFilterModal(false);
                }}
                className="flex-1 py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold text-xs rounded-lg shadow-sm active:scale-95 transition-transform"
              >
                {t('apply')} ({categoryProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
