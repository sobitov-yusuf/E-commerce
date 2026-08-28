'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const wishlistedIds = useWishlistStore((state) => state.productIds);
  const { t, lang } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide BottomNav on standalone product details and search pages to avoid UI overlap
  if (pathname.startsWith('/product/') || pathname === '/search') {
    return null;
  }

  const totalCartCount = mounted ? cartItems.length : 0;
  const totalWishlistCount = mounted ? wishlistedIds.length : 0;

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  const navItems = [
    { href: '/', label: t('nav_home'), icon: Home, exact: true },
    { href: '/catalog', label: t('nav_catalog'), icon: LayoutGrid },
    { href: '/wishlist', label: t('nav_wishlist'), icon: Heart, badge: totalWishlistCount },
    { href: '/cart', label: t('nav_cart'), icon: ShoppingBag, badge: totalCartCount },
    { href: '/profile', label: t('nav_profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={triggerHaptic}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 group transition-all duration-200 relative ${
                isActive ? 'text-gray-900 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative p-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5] text-gray-900' : 'stroke-[1.8]'
                  }`}
                />
                {mounted && Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-0.5 -right-1.5 min-w-[17px] h-[17px] px-1 bg-gray-900 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                    {item.badge! > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-black text-gray-900' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
