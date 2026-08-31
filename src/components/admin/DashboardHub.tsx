'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Crown,
  Medal,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpRight,
  Sparkles,
  ShoppingBag,
  PackageSearch,
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { useCustomerStore } from '@/store/useCustomerStore';
import { useLanguageStore } from '@/store/useLanguageStore';

interface DashboardHubProps {
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  onNavigateToTab?: (tabId: string) => void;
}

export function DashboardHub({ triggerHaptic, onNavigateToTab }: DashboardHubProps) {
  const { lang, t } = useLanguageStore();
  const { orders = [] } = useOrderStore();
  const { products = [] } = useProductStore();
  const { customers = [] } = useCustomerStore();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Real Metrics from Database
  const totalRevenue = useMemo(() => {
    return (orders || [])
      .filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERING')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return (orders || []).filter((o) => o.status === 'COMPLETED').length;
  }, [orders]);

  const avgOrderValue = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;

  // Real Top Products from Database
  const topProducts = useMemo(() => {
    return [...(products || [])]
      .filter((p) => (p.reviewsCount || 0) > 0 || p.badge === 'TOP')
      .slice(0, 3);
  }, [products]);

  // Real Payment Breakdown
  const paymentStats = useMemo(() => {
    const total = orders.length || 0;
    if (total === 0) {
      return { paymePercent: 0, clickPercent: 0, cashPercent: 0 };
    }
    const paymeCount = orders.filter((o) => o.paymentType === 'PAYME').length;
    const clickCount = orders.filter((o) => o.paymentType === 'CLICK').length;
    const cashCount = orders.filter((o) => o.paymentType === 'CASH' || !o.paymentType).length;

    return {
      paymePercent: Math.round((paymeCount / total) * 100),
      clickPercent: Math.round((clickCount / total) * 100),
      cashPercent: Math.round((cashCount / total) * 100),
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* 1. Key Metrics HUD (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'Jami Tushum' : 'Общая выручка'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              {totalRevenue.toLocaleString()} <span className="text-xs font-semibold text-gray-400">UZS</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              {completedOrdersCount} ta bajarilgan buyurtma
            </div>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'Jami Buyurtmalar' : 'Всего заказов'}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              {orders.length} <span className="text-xs font-semibold text-gray-400">ta</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Barcha holatlar bo'yicha
            </div>
          </div>
        </div>

        {/* Metric 3: Average Order Value */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'O\'rtacha Chek' : 'Средний чек'}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              {avgOrderValue.toLocaleString()} <span className="text-xs font-semibold text-gray-400">UZS</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Bajarilgan buyurtmalar bo'yicha
            </div>
          </div>
        </div>

        {/* Metric 4: Customers */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>{lang === 'uz' ? 'Mijozlar Bazasi' : 'Клиенты'}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white tracking-tight">
              {customers.length} <span className="text-xs font-semibold text-gray-400">xaridor</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Ro'yxatdan o'tgan mijozlar
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Analytics & TOP Products (Real Data or Clean Empty State) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP-3 Shohsupa Reytingi */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>TOP-3 Yetakchi Mahsulotlar</span>
              </h3>
              <p className="text-[11px] text-gray-400">Haqiqiy sotuvlar reytingi</p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab('catalog')}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold hover:underline"
            >
              Katalogga o'tish →
            </button>
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, idx) => {
                const medalIcons = ['🥇', '🥈', '🥉'];
                const name = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : String(p.name);
                const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300';

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/60 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{medalIcons[idx]}</span>
                      <img src={img} alt={name} className="w-10 h-10 rounded-xl object-cover bg-white" />
                      <div>
                        <div className="text-xs font-bold text-gray-950 dark:text-white line-clamp-1">{name}</div>
                        <div className="text-[10px] text-gray-400">{Number(p.base_price).toLocaleString()} UZS</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2">
              <PackageSearch className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
              <div className="text-xs font-semibold text-gray-400">
                Hozircha sotuvlar mavjud emas. Buyurtmalar tushishi bilan bu yerda yetakchi tovarlar ko'rinadi.
              </div>
            </div>
          )}
        </div>

        {/* To'lov Turlari Taqsimoti */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gray-900 dark:text-white" />
              <span>To'lov Usullari Taqsimoti</span>
            </h3>
            <p className="text-[11px] text-gray-400">Click, Payme va Naqd pul ulushi</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#00C2AF]">Payme</span>
                <span>{paymentStats.paymePercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-[#161F30] rounded-full overflow-hidden">
                <div style={{ width: `${paymentStats.paymePercent}%` }} className="h-full bg-[#00C2AF] rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-600">Click</span>
                <span>{paymentStats.clickPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-[#161F30] rounded-full overflow-hidden">
                <div style={{ width: `${paymentStats.clickPercent}%` }} className="h-full bg-blue-600 rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-600">Naqd Pul</span>
                <span>{paymentStats.cashPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-[#161F30] rounded-full overflow-hidden">
                <div style={{ width: `${paymentStats.cashPercent}%` }} className="h-full bg-emerald-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
