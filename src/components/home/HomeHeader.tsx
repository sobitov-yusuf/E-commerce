'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  Search,
  Bell,
  Heart,
  ShoppingBag,
  User,
  LayoutGrid,
  Home,
  X,
  QrCode,
  Send,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useProductStore } from '@/store/useProductStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LanguageCode } from '@/types';

export function HomeHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t, lang: currentLang, setLang } = useLanguageStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { notifications } = useNotificationStore();
  const { products, fetchProducts } = useProductStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistedIds = useWishlistStore((state) => state.productIds);
  const { addItem: addItemToCart, updateQuantity: updateCartQuantity, removeItem: removeItemFromCart } = useCartStore();

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = mounted
    ? notifications.filter((n) => !n.isRead).length
    : 0;
  const cartCount = mounted ? cartItems.length : 0;
  const wishlistCount = mounted ? wishlistedIds.length : 0;

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  const handleLangChange = (newLang: LanguageCode) => {
    triggerHaptic();
    setLang(newLang);
  };

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearch.trim()) {
      triggerHaptic();
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(desktopSearch.trim())}`);
    }
  };

  // Filtered popular or searched products (Directly respect admin's is_popular)
  const popularProducts = products.filter((p) => p.is_popular === true);

  const displayProducts = desktopSearch.trim()
    ? products.filter((p) => {
        const name = typeof p.name === 'object' ? (p.name as any)[currentLang] || p.name.uz : String(p.name);
        return name.toLowerCase().includes(desktopSearch.toLowerCase());
      }).slice(0, 6)
    : popularProducts.slice(0, 6);

  return (
    <>
      {/* Universal Responsive Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Brand Logo & Name */}
          <Link
            href="/"
            prefetch={true}
            onClick={triggerHaptic}
            className="flex items-center gap-2.5 shrink-0 active:scale-95 transition-transform duration-100"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-950 shadow-xs">
              <Store className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-gray-950 leading-none">
                LUXE BOUTIQUE
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">
                Official Store
              </span>
            </div>
          </Link>

          {/* 2. Centered & Constrained Desktop Search Bar with Uzum-style Dropdown */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 justify-center px-4 relative">
            <form
              onSubmit={handleDesktopSearchSubmit}
              className="w-full max-w-lg relative items-center"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
              <input
                type="text"
                value={desktopSearch}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setDesktopSearch(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder={t('search_placeholder')}
                className="w-full h-10 pl-10 pr-8 bg-gray-100/90 hover:bg-gray-100 focus:bg-white border border-gray-200/80 focus:border-gray-900 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
              />
              {desktopSearch && (
                <button
                  type="button"
                  onClick={() => setDesktopSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 active:scale-95 transition-transform duration-100"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </form>

            {/* Uzum-style Desktop Search Dropdown Popup */}
            {isSearchOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[580px] lg:w-[640px] mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in space-y-3.5">
                <div className="border-b border-gray-100 pb-2.5">
                  <h4 className="text-sm font-bold text-gray-950">
                    {desktopSearch.trim() ? t('search_page_title') : t('header_popular')}
                  </h4>
                </div>

                {/* 3-Column Cards Grid (Exact Uzum Market Desktop Search Popup) */}
                <div className="grid grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto no-scrollbar py-1">
                  {displayProducts.map((p) => {
                    const name =
                      typeof p.name === 'object' && p.name
                        ? (p.name as any)[currentLang] || (p.name as any).uz
                        : String(p.name || '');
                    const price = p.base_price;
                    const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
                    const cartItem = cartItems.find((item) => item.product.id === p.id);
                    const cartQty = cartItem ? cartItem.quantity : 0;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/product/${p.id}`);
                        }}
                        className="group bg-white rounded-xl border border-gray-200/80 p-2.5 space-y-2 hover:border-gray-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={img}
                              alt={name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="text-xs font-bold text-gray-950 leading-tight">
                            {price.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">{t('currency')}</span>
                          </div>
                          <h5 className="text-[11px] font-medium text-gray-800 line-clamp-2 min-h-[32px] leading-snug">
                            {name}
                          </h5>
                        </div>

                        {/* Uzum-style Cart Action Button */}
                        {cartQty === 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic();
                              const defVar = p.variants && p.variants[0];
                              addItemToCart(p as any, defVar as any, 1);
                            }}
                            className="w-full h-8 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-100 shadow-2xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2] text-white dark:text-gray-950" />
                            <span>{t('add_to_cart')}</span>
                          </button>
                        ) : (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-full h-8 bg-gray-900 dark:bg-[#1E293B] text-white rounded-lg px-2 flex items-center justify-between font-bold text-xs shadow-2xs border border-transparent dark:border-white/10"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerHaptic();
                                if (cartQty <= 1) {
                                  removeItemFromCart(p.id);
                                } else {
                                  updateCartQuantity(p.id, cartQty - 1);
                                }
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-800 active:scale-90 text-sm font-bold transition-transform"
                              aria-label="Kamaytirish"
                            >
                              -
                            </button>

                            <span className="text-xs font-bold px-1">{cartQty} {t('pcs')}</span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerHaptic();
                                updateCartQuantity(p.id, cartQty + 1);
                              }}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-gray-800 active:scale-90 text-sm font-bold transition-transform"
                              aria-label="Ko'paytirish"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {displayProducts.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-xs text-gray-400 font-medium">
                      {t('catalog_empty')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Navigation Links & Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                onClick={triggerHaptic}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 ${
                  pathname === '/'
                    ? 'bg-gray-100 text-gray-950 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4 stroke-[2]" />
                <span>{t('nav_home')}</span>
              </Link>

              <Link
                href="/catalog"
                onClick={triggerHaptic}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 ${
                  pathname === '/catalog'
                    ? 'bg-gray-100 text-gray-950 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4 stroke-[2]" />
                <span>{t('nav_catalog')}</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={triggerHaptic}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 ${
                  pathname === '/wishlist'
                    ? 'bg-gray-100 text-gray-950 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-4 h-4 stroke-[2]" />
                <span>{t('nav_wishlist')}</span>
                {mounted && wishlistCount > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 bg-gray-900 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                onClick={triggerHaptic}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 ${
                  pathname === '/cart'
                    ? 'bg-gray-100 text-gray-950 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                <span>{t('nav_cart')}</span>
                {mounted && cartCount > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 bg-gray-900 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile Search Trigger: rounded-lg */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                router.push('/search');
              }}
              aria-label="Search"
              className="md:hidden w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-90 transition-transform duration-150 shadow-2xs"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Notification Bell: rounded-lg */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                router.push('/notifications');
              }}
              aria-label="Notifications"
              className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-95 transition-transform duration-100 relative shadow-2xs"
            >
              <Bell className="w-4 h-4 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-gray-900 text-white text-[9px] font-semibold flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Button: Visible on desktop/tablet only, hidden on mobile to avoid duplicate with BottomNav */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                router.push('/profile');
              }}
              className="hidden md:flex w-9 h-9 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-950 items-center justify-center hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-transform duration-100 shadow-xs"
              aria-label="Profile"
            >
              <User className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Web Telegram QR Auth Modal: rounded-2xl */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200/90 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                {t('header_login_title')}
              </span>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 active:scale-95 transition-transform duration-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-44 h-44 bg-gray-100 rounded-xl mx-auto p-3 flex flex-col items-center justify-center border border-gray-200">
              <QrCode className="w-28 h-28 text-gray-900 stroke-[1.5]" />
              <span className="text-[11px] font-semibold text-gray-500 mt-1">{t('header_login_scan')}</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-950">{t('header_login_title')}</h4>
              <p className="text-xs text-gray-500 font-normal">
                {t('header_login_desc')}
              </p>
            </div>

            <a
              href="https://t.me/menejer_aloqa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform duration-100"
            >
              <Send className="w-4 h-4 text-white dark:text-gray-950" />
              <span>{t('header_login_btn')}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
