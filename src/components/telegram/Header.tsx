'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { OfflineBanner } from './OfflineBanner';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState('');

  const { notifications } = useNotificationStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistedIds = useWishlistStore((state) => state.productIds);

  useEffect(() => {
    setMounted(true);
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
    } catch (e) {
      // Fallback
    }
  };

  const navLinks = [
    { href: '/', label: 'Bosh sahifa', icon: Home, exact: true },
    { href: '/catalog', label: 'Katalog', icon: LayoutGrid },
    { href: '/wishlist', label: 'Sevimlilar', icon: Heart, badge: wishlistCount },
    { href: '/cart', label: 'Savat', icon: ShoppingBag, badge: cartCount },
    { href: '/profile', label: 'Profil', icon: User },
  ];

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(desktopSearch.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      <OfflineBanner />

      {/* Universal Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* 1. Brand Logo & Name */}
          <Link
            href="/"
            prefetch={true}
            onClick={triggerHaptic}
            className="flex items-center gap-2.5 shrink-0 active:scale-95 transition-transform duration-100"
          >
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-xs">
              <Store className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-gray-950 leading-none">
                STORE_NAME
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">
                Boutique Edition
              </span>
            </div>
          </Link>

          {/* 2. Centered Desktop Search Bar (max-w-lg) */}
          <div className="hidden md:flex flex-1 justify-center px-4">
            <form
              onSubmit={handleDesktopSearchSubmit}
              className="w-full max-w-lg relative items-center"
            >
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
              <input
                type="text"
                value={desktopSearch}
                onChange={(e) => setDesktopSearch(e.target.value)}
                placeholder="Mahsulotlar va brendlarni qidirish..."
                className="w-full h-10 pl-10 pr-8 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-gray-200/80 focus:border-gray-900 rounded-lg text-xs font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-2xs"
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
          </div>

          {/* 3. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={triggerHaptic}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-100 active:scale-95 ${
                    isActive
                      ? 'bg-gray-100 text-gray-950 font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  <span>{link.label}</span>
                  {mounted && Boolean(link.badge && link.badge > 0) && (
                    <span className="ml-1 min-w-[16px] h-[16px] px-1 bg-gray-900 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">
                      {link.badge! > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 4. Action Icons: Mobile Search Trigger + Notification Bell */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Button: rounded-lg */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                router.push('/search');
              }}
              aria-label="Search"
              className="md:hidden w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 active:scale-95 transition-transform duration-100 shadow-2xs"
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
          </div>
        </div>
      </header>
    </>
  );
}
