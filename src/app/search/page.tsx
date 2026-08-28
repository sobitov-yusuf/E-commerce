'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { TelegramProvider } from '@/components/telegram/TelegramProvider';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

function SearchContent() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const { t, lang } = useLanguageStore();

  const { products, isLoading, fetchProducts } = useProductStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { items: cartItems, addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(lang, null, '');
    }
  }, [products.length, fetchProducts, lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(lang, null, query.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [query, fetchProducts, lang]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const handleBack = () => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 200);
  };

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    const defaultVariant = product.variants && product.variants[0];
    addItemToCart(product as any, defaultVariant as any, 1);
  };

  return (
    <div
      className={`min-h-screen bg-[#FAFAFA] text-gray-900 flex flex-col transition-all duration-300 ease-out ${
        isClosing ? 'opacity-0 scale-98 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      {/* 1. Header Bar: Uzum & Apple Minimalist */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-3 py-2.5 sm:px-4 sm:py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 active:scale-95 transition-transform duration-100 shrink-0"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4 stroke-[2]" />
            </span>

            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200/80 focus:border-gray-900 rounded-xl text-xs sm:text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white shadow-2xs transition-all"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setQuery('');
                }}
                className="absolute inset-y-0 right-2.5 flex items-center text-gray-400 hover:text-gray-700"
                aria-label="Tozalash"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4 space-y-4">
        {/* Results Title: Clean "Mashhur" or "Natijalar" */}
        <div className="px-0.5">
          <h2 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight">
            {query.trim() ? t('search_page_title') : t('home_popular')}
          </h2>
        </div>

        {/* Loading Skeleton State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 border border-gray-200/70 flex flex-col h-64 animate-pulse shadow-2xs"
              >
                <div className="bg-gray-100 rounded-lg aspect-square w-full mb-3" />
                <div className="bg-gray-100 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-100 h-3 rounded w-1/2 mb-auto" />
                <div className="bg-gray-100 h-9 rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty Search Results */
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-gray-200/70 p-6 shadow-2xs max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">{t('home_no_products')}</h3>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => {
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
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <TelegramProvider>
      <SearchContent />
    </TelegramProvider>
  );
}
