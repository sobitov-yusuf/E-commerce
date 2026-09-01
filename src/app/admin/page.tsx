'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Package,
  Layers,
  Users,
  Tag,
  Settings,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useStaffStore } from '@/store/useStaffStore';

// Modular Admin Hubs
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardHub } from '@/components/admin/DashboardHub';
import { OrdersHub } from '@/components/admin/OrdersHub';
import { CatalogHub } from '@/components/admin/CatalogHub';
import { CustomersHub } from '@/components/admin/CustomersHub';
import { MarketingHub } from '@/components/admin/MarketingHub';
import { SettingsHub } from '@/components/admin/SettingsHub';

import { useOrderStore } from '@/store/useOrderStore';

type AdminTab = 'dashboard' | 'orders' | 'catalog' | 'customers' | 'marketing' | 'settings';

export default function AdminConsolePage() {
  const { lang, t } = useLanguageStore();
  const { theme, initializeTheme } = useThemeStore();
  const { hasPermission } = useStaffStore();
  const { fetchOrders } = useOrderStore();

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    initializeTheme();
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('store-orders-storage');
        localStorage.removeItem('store-customers-storage');
        localStorage.removeItem('store-staff-storage');
        localStorage.removeItem('store-reviews-storage');
        localStorage.removeItem('store-audit-storage');
      }
    } catch (e) {}
    fetchOrders();
  }, [initializeTheme, fetchOrders]);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {}
  };

  const navItems: Array<{ id: AdminTab; label: string; icon: any; permission?: any }> = [
    {
      id: 'dashboard',
      label: lang === 'uz' ? 'Boshqaruv & Analitika' : 'Дашборд и Аналитика',
      icon: BarChart3,
    },
    {
      id: 'orders',
      label: lang === 'uz' ? 'Buyurtmalar & Logistika' : 'Заказы и Логистика',
      icon: Package,
    },
    {
      id: 'catalog',
      label: lang === 'uz' ? 'Katalog & Sharhlar' : 'Каталог и Отзывы',
      icon: Layers,
    },
    {
      id: 'customers',
      label: lang === 'uz' ? 'Mijozlar Bazasi (CRM)' : 'База клиентов',
      icon: Users,
    },
    {
      id: 'marketing',
      label: lang === 'uz' ? 'Marketing & Aksiyalar' : 'Маркетинг и Акции',
      icon: Tag,
    },
    {
      id: 'settings',
      label: lang === 'uz' ? 'Do\'kon Sozlamalari & RBAC' : 'Настройки и RBAC',
      icon: Settings,
    },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-900 dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] text-gray-900 dark:text-white flex flex-col font-sans transition-colors">
      {/* 1. Universal Admin Header */}
      <AdminHeader
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        triggerHaptic={triggerHaptic}
      />

      {/* 2. Main Layout with Navigation Tabs and Active Hub */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery('');
                  triggerHaptic('light');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-md ring-1 ring-gray-900 dark:ring-white'
                    : 'bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Hub Rendering */}
        <main className="animate-in fade-in duration-200">
          {activeTab === 'dashboard' && (
            <DashboardHub
              triggerHaptic={triggerHaptic}
              onNavigateToTab={(tab) => {
                setActiveTab(tab as AdminTab);
                triggerHaptic('light');
              }}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersHub
              searchQuery={searchQuery}
              triggerHaptic={triggerHaptic}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogHub
              searchQuery={searchQuery}
              triggerHaptic={triggerHaptic}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersHub
              searchQuery={searchQuery}
              triggerHaptic={triggerHaptic}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingHub
              triggerHaptic={triggerHaptic}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsHub
              triggerHaptic={triggerHaptic}
            />
          )}
        </main>
      </div>
    </div>
  );
}
