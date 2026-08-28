'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore, ProductItem } from '@/store/useProductStore';
import { useBannerStore } from '@/store/useBannerStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { StoryItem } from '@/types';

import { StoriesReel } from '@/components/home/StoriesReel';
import { HeroBannerSlider } from '@/components/home/HeroBannerSlider';
import { CategoryCarousel } from '@/components/home/CategoryCarousel';
import { ProductCard } from '@/components/home/ProductCard';
import { TelegramSupportCTA } from '@/components/home/TelegramSupportCTA';
import { TrustBadges } from '@/components/home/TrustBadges';
import { ProductDrawer } from '@/components/telegram/ProductDrawer';
import { StoriesModal } from '@/components/telegram/StoriesModal';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { lang, t } = useLanguageStore();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<number | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'top' | 'new'>('all');
  const [activeDrawerProductId, setActiveDrawerProductId] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const { banners } = useBannerStore();
  const { categories } = useCategoryStore();
  const { products, fetchProducts } = useProductStore();
  const { items: cartItems, addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const storiesList: StoryItem[] = [
    {
      id: 1,
      title: {
        uz: 'Kuzgi Eksklyuziv Kolleksiya — 30% Chegirma',
        ru: 'Эксклюзивная Осенняя Коллекция — Скидка 30%',
        en: 'Exclusive Autumn Collection — 30% Discount',
      },
      subtitle: {
        uz: 'Cheklangan Taklif',
        ru: 'Ограниченное Предложение',
        en: 'Limited Time Offer',
      },
      tag: {
        uz: '🔥 AKSIYA',
        ru: '🔥 АКЦИЯ',
        en: '🔥 PROMO',
      },
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      bgColor: 'from-gray-900 to-gray-800',
      linkText: {
        uz: 'Kolleksiyaga oʻtish',
        ru: 'Перейти к коллекции',
        en: 'View Collection',
      },
      linkUrl: '/catalog',
    },
    {
      id: 2,
      title: {
        uz: 'Fransuz Parfyumeriyasi — Yangi Nafis Iforlar',
        ru: 'Французская Парфюмерия — Изысканные Ароматы',
        en: 'French Perfumery — Exquisite Fragrances',
      },
      subtitle: {
        uz: 'Luxe Parfum',
        ru: 'Luxe Parfum',
        en: 'Luxe Parfum',
      },
      tag: {
        uz: '✨ YANGI',
        ru: '✨ НОВИНКА',
        en: '✨ NEW',
      },
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800',
      bgColor: 'from-gray-900 to-gray-800',
      linkText: {
        uz: 'Iforlarni koʻrish',
        ru: 'Посмотреть ароматы',
        en: 'View Fragrances',
      },
      linkUrl: '/catalog',
    },
    {
      id: 3,
      title: {
        uz: 'Klassik Charm Soatlar — Sapfir Oyna Kafolati',
        ru: 'Классические Кожаные Часы — Сапфировое Стекло',
        en: 'Classic Leather Watches — Sapphire Glass',
      },
      subtitle: {
        uz: 'Premium Watches',
        ru: 'Premium Watches',
        en: 'Premium Watches',
      },
      tag: {
        uz: '👑 TREND',
        ru: '👑 ТРЕНД',
        en: '👑 TREND',
      },
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      bgColor: 'from-gray-900 to-gray-800',
      linkText: {
        uz: 'Soatlarni tanlash',
        ru: 'Выбрать часы',
        en: 'Choose Watches',
      },
      linkUrl: '/catalog',
    },
    {
      id: 4,
      title: {
        uz: 'Sport Krossovkalar — Eng Yengil Amortizatsiya',
        ru: 'Спортивные Кроссовки — Ультралегкая Амортизация',
        en: 'Sport Sneakers — Ultra Lightweight Cushioning',
      },
      subtitle: {
        uz: 'Fly Sport',
        ru: 'Fly Sport',
        en: 'Fly Sport',
      },
      tag: {
        uz: '⚡ FLASH',
        ru: '⚡ FLASH',
        en: '⚡ FLASH',
      },
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      bgColor: 'from-gray-900 to-gray-800',
      linkText: {
        uz: 'Modellarni koʻrish',
        ru: 'Посмотреть модели',
        en: 'View Models',
      },
      linkUrl: '/catalog',
    },
    {
      id: 5,
      title: {
        uz: 'Zarhal Taqinchoqlar — 585 Probali Oltin Qoplama',
        ru: 'Ювелирные Украшения — Позолота 585 Пробы',
        en: 'Gold Jewelry — 585 Gold Plated Edition',
      },
      subtitle: {
        uz: 'Gold Edition',
        ru: 'Gold Edition',
        en: 'Gold Edition',
      },
      tag: {
        uz: '💎 LUXE',
        ru: '💎 LUXE',
        en: '💎 LUXE',
      },
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      bgColor: 'from-gray-900 to-gray-800',
      linkText: {
        uz: 'Taqinchoqlarni koʻrish',
        ru: 'Посмотреть украшения',
        en: 'View Jewelry',
      },
      linkUrl: '/catalog',
    },
  ];

  useEffect(() => {
    fetchProducts(lang, activeCategoryFilter, '');
  }, [activeCategoryFilter, fetchProducts, lang]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleAddToCart = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic('medium');
    const defaultVariant = product.variants && product.variants[0];
    addItemToCart(product as any, defaultVariant as any, 1);
  };

  // Base Home Showcase Products (Admin-controlled show_on_home)
  const homeProducts = products.filter((p) => p.show_on_home !== false);

  // Category-scoped products for tab counters
  const categoryScopedHome = activeCategoryFilter
    ? homeProducts.filter((p) => p.category_id === activeCategoryFilter)
    : homeProducts;

  const categoryScopedAll = activeCategoryFilter
    ? products.filter((p) => p.category_id === activeCategoryFilter)
    : products;

  const allCount = categoryScopedHome.length;
  const popularCount = categoryScopedAll.filter((p) => p.is_popular === true).length;
  const newCount = categoryScopedAll.filter((p) => p.badge === 'NEW').length;

  let displayedProducts = categoryScopedHome;

  if (activeFilterTab === 'top') {
    displayedProducts = categoryScopedAll.filter((p) => p.is_popular === true);
  } else if (activeFilterTab === 'new') {
    displayedProducts = categoryScopedAll.filter((p) => p.badge === 'NEW');
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Product Drawer Modal */}
      <ProductDrawer
        productId={activeDrawerProductId}
        onClose={() => setActiveDrawerProductId(null)}
      />

      {/* Full-Screen Instagram-Style Stories Modal */}
      <StoriesModal
        stories={storiesList}
        activeStoryIndex={activeStoryIndex}
        onClose={() => setActiveStoryIndex(null)}
        onNavigate={(url) => router.push(url)}
      />

      {/* 1. Stories Bar (Quick Promo Circles) */}
      <StoriesReel
        stories={storiesList}
        onSelectStory={(story) => {
          const idx = storiesList.findIndex((s) => s.id === story.id);
          setActiveStoryIndex(idx >= 0 ? idx : 0);
        }}
        triggerHaptic={triggerHaptic}
      />

      {/* 2. Hero Banner Slider (Pure Clean Clickable Image Slider) */}
      <HeroBannerSlider
        banners={banners}
        triggerHaptic={triggerHaptic}
      />

      {/* 3. Categories Carousel (Rounded Category Icons with Titles) */}
      <CategoryCarousel
        categories={categories}
        selectedCategoryId={activeCategoryFilter}
        onSelectCategory={(id) => setActiveCategoryFilter(id)}
        triggerHaptic={triggerHaptic}
      />

      {/* 4. Main Product Showcase ("Tavsiya etiladigan mahsulotlar") */}
      <section className="space-y-2.5">
        {/* Header & Filter Tabs */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h2 className="text-sm sm:text-base font-bold text-gray-950 tracking-tight leading-none">
            {t('home_recommended')}
          </h2>

          {/* Filter Tabs: Barchasi, Mashhur, Yangi */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveFilterTab('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 shrink-0 ${
                activeFilterTab === 'all'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
              }`}
            >
              {t('home_all')} ({allCount})
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveFilterTab('top');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 shrink-0 flex items-center gap-1.5 ${
                activeFilterTab === 'top'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 stroke-[2]" />
              <span>{t('home_popular')}</span>
              <span className="opacity-80">({popularCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveFilterTab('new');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 shrink-0 flex items-center gap-1.5 ${
                activeFilterTab === 'new'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-[#161F30] border border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F293D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
              <span>{t('home_new')}</span>
              <span className="opacity-80">({newCount})</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white border border-gray-200/70 rounded-xl p-12 text-center space-y-2">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto stroke-[1.5]" />
            <p className="text-xs sm:text-sm font-medium text-gray-600">{t('home_no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-4.5">
            {displayedProducts.map((product) => {
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
      </section>

      {/* 5. Telegram Support CTA Banner */}
      <TelegramSupportCTA triggerHaptic={triggerHaptic} />

      {/* 6. Trust & Warranty Badges (Original, Fast delivery, Easy return) */}
      <TrustBadges />
    </div>
  );
}
