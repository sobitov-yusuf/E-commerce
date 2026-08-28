'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { ProductCard } from '@/components/home/ProductCard';

export default function WishlistPage() {
  const router = useRouter();
  const { productIds, toggleWishlist, isWishlisted } = useWishlistStore();
  const { products, fetchProducts } = useProductStore();
  const { items: cartItems, addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();
  const { t, lang } = useLanguageStore();

  useEffect(() => {
    fetchProducts(lang, null, '');
  }, [fetchProducts, lang]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));
  const recommendedProducts = products.filter((p) => !productIds.includes(p.id));

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    const defaultVariant = product.variants && product.variants[0];
    addItemToCart(product as any, defaultVariant as any, 1);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in max-w-7xl mx-auto">
      {/* CASE 1: Wishlist is Empty -> Show Compact Empty Notice + Full "Mashhur" Recommendations Grid */}
      {wishlistedProducts.length === 0 ? (
        <div className="space-y-6">
          {/* Top Compact Empty Box */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-2xs text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto shadow-2xs">
              <Heart className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-950">{t('wishlist_empty_title')}</h2>
              <p className="text-xs text-gray-500 font-normal leading-relaxed">
                {t('wishlist_empty_desc')}
              </p>
            </div>

            <Link
              href="/catalog"
              onClick={() => triggerHaptic('light')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold rounded-lg text-xs shadow-xs active:scale-95 transition-transform duration-100"
            >
              <span>{t('go_to_catalog')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recommendations Showcase ("Mashhur" - Exact Uzum Market Style) */}
          {(() => {
            const popularRecommendations = products.filter((p) => p.is_popular === true);
            if (popularRecommendations.length === 0) return null;

            return (
              <div className="space-y-3 pt-2">
                <div className="px-0.5">
                  <h3 className="text-base font-bold text-gray-950 tracking-tight">
                    {t('home_popular')}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {popularRecommendations.map((product) => {
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
              </div>
            );
          })()}
        </div>
      ) : (
        /* CASE 2: Wishlist Has Saved Items */
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight">{t('wishlist_title')}</h1>
              <p className="text-xs text-gray-400 font-normal">{wishlistedProducts.length} {t('pcs')}</p>
            </div>
          </div>

          {/* Saved Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {wishlistedProducts.map((product) => {
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
        </div>
      )}
    </div>
  );
}
