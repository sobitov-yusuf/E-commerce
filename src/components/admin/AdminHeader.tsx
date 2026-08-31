'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Sun,
  Moon,
  Globe,
  ExternalLink,
  ShieldCheck,
  Search,
  User,
  LogOut,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useStaffStore, StaffMember } from '@/store/useStaffStore';

interface AdminHeaderProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
}

export function AdminHeader({
  activeTab,
  searchQuery,
  setSearchQuery,
  triggerHaptic,
}: AdminHeaderProps) {
  const { lang, setLang, t } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();
  const { staff, currentStaff, setCurrentStaff } = useStaffStore();

  const [showStaffMenu, setShowStaffMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleTheme = () => {
    triggerHaptic('light');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getSearchPlaceholder = () => {
    if (activeTab === 'orders') return lang === 'uz' ? 'Buyurtma raqami, mijoz yoki telefon...' : 'Поиск заказа...';
    if (activeTab === 'catalog') return lang === 'uz' ? 'Mahsulot nomi yoki SKU bo\'yicha qidirish...' : 'Поиск товара...';
    if (activeTab === 'customers') return lang === 'uz' ? 'Mijoz ismi yoki telefoni...' : 'Поиск клиента...';
    return lang === 'uz' ? 'Qidirish...' : 'Поиск...';
  };

  const showSearch = ['orders', 'catalog', 'customers'].includes(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 group active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 flex items-center justify-center shadow-xs">
              <Store className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-gray-950 dark:text-white leading-none">
                  LUXE ADMIN
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                Enterprise Console
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (when relevant) */}
        {showSearch ? (
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-gray-900 dark:focus:border-white focus:bg-white dark:focus:bg-[#111827] transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* RBAC Staff Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStaffMenu(!showStaffMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50 dark:bg-[#161F30] text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1F293D] transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                {currentStaff?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden md:inline text-xs font-bold truncate max-w-[100px]">
                {currentStaff?.name || 'Admin'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                {currentStaff?.role?.replace('_', ' ') || 'SUPER ADMIN'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showStaffMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="px-2 py-1.5 border-b border-gray-100 dark:border-white/10 mb-1 text-[11px] font-semibold text-gray-400">
                  {lang === 'uz' ? 'Xodimlar ro\'yxati (RBAC)' : 'Сменить аккаунт'}
                </div>
                {staff.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      setCurrentStaff(member);
                      setShowStaffMenu(false);
                      triggerHaptic('light');
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left text-xs font-medium transition-colors ${
                      currentStaff?.id === member.id
                        ? 'bg-gray-100 dark:bg-[#161F30] font-bold text-gray-950 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{member.name}</div>
                      <div className="text-[10px] text-gray-400">{member.role}</div>
                    </div>
                    {currentStaff?.id === member.id && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="w-9 h-9 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
            >
              <Globe className="w-4 h-4" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-white/10 shadow-xl p-1.5 z-50 animate-in fade-in">
                {(['uz', 'ru', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setShowLangMenu(false);
                      triggerHaptic('light');
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-left uppercase transition-colors ${
                      lang === l
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                    }`}
                  >
                    {l === 'uz' ? "O'zbek" : l === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Mode */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#161F30] text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1F293D] active:scale-95 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {/* Go to Customer Web App */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 text-xs font-bold hover:bg-black dark:hover:bg-gray-100 active:scale-95 transition-all shadow-xs"
          >
            <span>{lang === 'uz' ? "Do'konni ochish" : 'В магазин'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
