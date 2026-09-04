'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function HomeHeader() {
  const { isDark, toggleTheme } = useThemeStore();
  const { storeName = 'LUXE BOUTIQUE' } = useSettingsStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
            LB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-950 dark:text-white tracking-tight uppercase line-clamp-1 max-w-[200px]">
              {storeName}
            </span>
          </div>
        </Link>

        {/* Theme Toggle Only */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#161F30] transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
