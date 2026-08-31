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
  ArrowDownRight,
  Sparkles,
  ShoppingBag,
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
  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { customers } = useCustomerStore();

  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Key Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERING')
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  const completedOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === 'COMPLETED').length;
  }, [orders]);

  const avgOrderValue = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;

  // Chart data simulation (7 points for days/months)
  const chartData = [
    { label: 'Dush', current: 3200000, previous: 2800000 },
    { label: 'Sesh', current: 4500000, previous: 3900000 },
    { label: 'Chor', current: 2900000, previous: 3100000 },
    { label: 'Pay', current: 5800000, previous: 4200000 },
    { label: 'Jum', current: 7200000, previous: 6100000 },
    { label: 'Shan', current: 8900000, previous: 7400000 },
    { label: 'Yak', current: 6400000, previous: 5800000 },
  ];

  const maxVal = Math.max(...chartData.map((d) => Math.max(d.current, d.previous)));

  // TOP-3 Best Selling Products (Shohsupa)
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => ((b as any).sold_count || 50) - ((a as any).sold_count || 10))
      .slice(0, 3);
  }, [products]);

  // Payment Breakdown
  const paymentStats = useMemo(() => {
    const paymeCount = orders.filter((o) => o.paymentType === 'PAYME').length;
    const clickCount = orders.filter((o) => o.paymentType === 'CLICK').length;
    const cashCount = orders.filter((o) => o.paymentType === 'CASH' || !o.paymentType).length;
    const total = orders.length || 1;

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
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% o'tgan davrga nisbatan</span>
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
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12 ta yangi buyurtma</span>
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
              Muvaffaqiyatli buyurtmalar bo'yicha
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
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
              {customers.filter((c) => c.status === 'VIP').length} ta VIP mijoz
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Revenue Chart & Period Comparison */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-900 dark:text-white" />
              <span>{lang === 'uz' ? 'Daromad Dinamikasi va O\'sish' : 'Динамика выручки'}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Joriy davr va o'tgan davr ko'rsatkichlarini taqqoslash
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-[#1F293D] text-gray-950 dark:text-white shadow-2xs'
                    : 'text-gray-400'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-[#1F293D] text-gray-950 dark:text-white shadow-2xs'
                    : 'text-gray-400'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Period Pills */}
            <div className="flex items-center gap-1">
              {(['today', 'week', 'month', 'year'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    triggerHaptic('light');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    period === p
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-xs'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#161F30]'
                  }`}
                >
                  {p === 'today' ? 'Bugun' : p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Yil'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Interactive Chart Canvas */}
        <div className="h-64 w-full pt-4">
          <div className="h-full w-full flex items-end justify-between gap-2 sm:gap-4 px-2">
            {chartData.map((item, idx) => {
              const currentHeight = Math.round((item.current / maxVal) * 100);
              const prevHeight = Math.round((item.previous / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg font-mono whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {(item.current / 1000000).toFixed(1)}M UZS
                    </div>

                    {/* Previous Period Bar (Dotted/Muted) */}
                    <div
                      style={{ height: `${prevHeight}%` }}
                      className="w-2.5 sm:w-3.5 bg-gray-200 dark:bg-[#161F30] rounded-t-md transition-all"
                    />

                    {/* Current Period Bar (Active) */}
                    <div
                      style={{ height: `${currentHeight}%` }}
                      className="w-3.5 sm:w-5 bg-gray-900 dark:bg-white rounded-t-md transition-all group-hover:bg-emerald-600 dark:group-hover:bg-emerald-400"
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 border-t border-gray-100 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-gray-900 dark:bg-white" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Joriy Davr</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-gray-200 dark:bg-[#161F30]" />
            <span className="font-semibold text-gray-400">O'tgan Davr</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: TOP-3 Shohsupa & Payment Method Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TOP-3 Shohsupa Reytingi */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-950 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>TOP-3 Eng Ko'p Sotilgan Tovarlar</span>
              </h3>
              <p className="text-[11px] text-gray-400">Shohsupa reytingi</p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab('catalog')}
              className="text-xs text-gray-500 hover:text-gray-900 font-bold hover:underline"
            >
              Katalogga o'tish →
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, idx) => {
              const medalIcons = ['🥇', '🥈', '🥉'];
              const name = typeof p.name === 'object' ? (p.name as any)[lang] || p.name.uz : String(p.name);
              const img = p.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300';

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#161F30] border border-gray-200/60 dark:border-white/10 hover:bg-gray-100/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{medalIcons[idx]}</span>
                    <img src={img} alt={name} className="w-10 h-10 rounded-xl object-cover bg-white" />
                    <div>
                      <div className="text-xs font-bold text-gray-950 dark:text-white line-clamp-1">{name}</div>
                      <div className="text-[10px] text-gray-400">{Number(p.base_price).toLocaleString()} UZS</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {((p as any).sold_count || (idx === 0 ? 84 : idx === 1 ? 52 : 36))} ta sotildi
                    </div>
                    <span className="text-[10px] text-gray-400">Top mahsulot</span>
                  </div>
                </div>
              );
            })}
          </div>
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
            {/* Payme Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#00C2AF]">Payme (Uzcard / Humo)</span>
                <span>{paymentStats.paymePercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-[#161F30] rounded-full overflow-hidden">
                <div style={{ width: `${paymentStats.paymePercent}%` }} className="h-full bg-[#00C2AF] rounded-full" />
              </div>
            </div>

            {/* Click Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-blue-600">Click (Uzcard / Humo)</span>
                <span>{paymentStats.clickPercent}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 dark:bg-[#161F30] rounded-full overflow-hidden">
                <div style={{ width: `${paymentStats.clickPercent}%` }} className="h-full bg-blue-600 rounded-full" />
              </div>
            </div>

            {/* Cash Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-600">Naqd Pul (Qabul qilganda)</span>
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
