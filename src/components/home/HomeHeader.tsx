'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Globe,
  Sun,
  Moon,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore, LanguageCode } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { TelegramLoginModal } from '@/components/auth/TelegramLoginModal';

export function HomeHeader() {
  const router = useRouter();
  const { lang, setLanguage } = useLanguageStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { storeName = 'LUXE BOUTIQUE' } = useSettingsStore();
  const { getTotalCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const cartCount = getTotalCount();
  const wishCount = wishlistItems.length;

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-black text-sm sm:text-base shadow-xs group-hover:scale-105 transition-transform">
            🛍️
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black text-gray-950 dark:text-white tracking-tight uppercase line-clamp-1 max-w-[130px] sm:max-w-[200px]">
              {storeName}
            </span>
            <span className="text-[9px] font-bold text-gray-400 -mt-0.5 tracking-wider hidden sm:block">
              PREMIUM E-COMMERCE
            </span>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30] uppercase"
            >
              {lang}
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 w-24 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10 shadow-xl p-1 z-50">
                {(['uz', 'ru', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold text-left uppercase ${
                      lang === l ? 'bg-gray-100 dark:bg-[#161F30] text-black dark:text-white' : 'text-gray-500'
                    }`}
                  >
                    {l === 'uz' ? 'O\'zbek' : l === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30]"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Link (Desktop) */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30] hidden sm:flex"
          >
            <Heart className="w-4 h-4" />
            {wishCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            href="/cart"
            className="relative p-2 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#161F30]"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-full text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Button */}
          <Link
            href="/profile"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30] hidden sm:flex"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {showAuthModal && <TelegramLoginModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}

