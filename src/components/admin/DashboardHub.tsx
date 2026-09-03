import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingBag, 
  Users, 
  Banknote, 
  BarChart3,
  LineChart,
  Crown,
  Medal,
  CreditCard,
  Wallet
} from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';
import { useLanguageStore } from '@/store/useLanguageStore';

export function DashboardHub(props: any) {
  const { lang } = useLanguageStore();
  const { orders } = useOrderStore();
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Fake analytics data
  const revenueData = [
    { label: '01', current: 1200000, previous: 800000 },
    { label: '05', current: 2500000, previous: 1500000 },
    { label: '10', current: 1800000, previous: 2000000 },
    { label: '15', current: 4200000, previous: 3000000 },
    { label: '20', current: 3800000, previous: 2500000 },
    { label: '25', current: 5100000, previous: 4000000 },
    { label: '30', current: 6500000, previous: 4500000 }
  ];

  const maxVal = Math.max(...revenueData.map(d => Math.max(d.current, d.previous)));
  
  // SVG Chart Layout
  const padLeft = 58;
  const padBottom = 30;
  const padTop = 20;
  const padRight = 20;
  const width = 800;
  const height = 240;
  
  const innerWidth = width - padLeft - padRight;
  const innerHeight = height - padTop - padBottom;

  const getY = (val: number) => padTop + innerHeight - (val / maxVal) * innerHeight;
  const getX = (idx: number) => padLeft + (idx / (revenueData.length - 1)) * innerWidth;

  const currentPoints = revenueData.map((d, i) => `${getX(i)},${getY(d.current)}`).join(' ');
  const previousPoints = revenueData.map((d, i) => `${getX(i)},${getY(d.previous)}`).join(' ');

  // Payment Donut Data
  const paymentStats = [
    { type: 'Click', val: 55, color: '#3B82F6' },
    { type: 'Payme', val: 30, color: '#10B981' },
    { type: 'Naqd', val: 15, color: '#F59E0B' }
  ];
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white tracking-tight">Savdo Analitikasi</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Joriy oy ko'rsatkichlari va o'sish dinamikasi</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-[#161F30] p-1 rounded-xl">
          <button 
            onClick={() => setChartType('area')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'area' ? 'bg-white dark:bg-[#1F293D] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
            <LineChart className="w-4 h-4 inline-block mr-1.5" /> Area
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartType === 'bar' ? 'bg-white dark:bg-[#1F293D] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
            <BarChart3 className="w-4 h-4 inline-block mr-1.5" /> Bar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="text-xs font-bold text-gray-500 uppercase">Jami Daromad</div>
          <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">24,500,000 UZS</div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-fit px-2 py-1 rounded-md">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% o'tgan oydan
          </div>
          <Banknote className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 dark:text-white/5" />
        </div>
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="text-xs font-bold text-gray-500 uppercase">Buyurtmalar</div>
          <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">{orders.length || 142}</div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 w-fit px-2 py-1 rounded-md">
            <TrendingUp className="w-3.5 h-3.5" /> +5.2% o'tgan oydan
          </div>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 dark:text-white/5" />
        </div>
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="text-xs font-bold text-gray-500 uppercase">Yangi Mijozlar</div>
          <div className="text-2xl font-black text-gray-950 dark:text-white mt-1">89</div>
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 w-fit px-2 py-1 rounded-md">
            <TrendingDown className="w-3.5 h-3.5" /> -2.1% o'tgan oydan
          </div>
          <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-50 dark:text-white/5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG HYBRID CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-950 dark:text-white">Daromad Dinamikasi</h3>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-900 dark:bg-white rounded" /> Joriy oy</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 dark:bg-[#161F30] rounded border border-gray-300 dark:border-gray-600 border-dashed" /> O'tgan oy</div>
            </div>
          </div>
          
          <div className="w-full h-[240px] relative overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Y Axis Guides */}
              {[0, 0.5, 1].map(ratio => {
                const y = padTop + innerHeight * (1 - ratio);
                return (
                  <g key={ratio}>
                    <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="currentColor" className="text-gray-100 dark:text-white/5" strokeDasharray="4 4" />
                    <text x={padLeft - 10} y={y + 4} textAnchor="end" className="text-[10px] font-bold fill-gray-400">
                      {(maxVal * ratio / 1000000).toFixed(1)}M
                    </text>
                  </g>
                );
              })}

              {/* Data Representation */}
              {chartType === 'area' ? (
                <>
                  <path d={`M ${padLeft},${padTop + innerHeight} L ${previousPoints} L ${width - padRight},${padTop + innerHeight} Z`} className="fill-gray-100 dark:fill-[#161F30]" />
                  <polyline points={previousPoints} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-gray-300 dark:text-gray-600" />
                  
                  <path d={`M ${padLeft},${padTop + innerHeight} L ${currentPoints} L ${width - padRight},${padTop + innerHeight} Z`} className="fill-gray-900/10 dark:fill-white/10" />
                  <polyline points={currentPoints} fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-900 dark:text-white" />
                  
                  {revenueData.map((d, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(d.current)} r="4" className="fill-white dark:fill-[#111827] stroke-gray-900 dark:stroke-white" strokeWidth="2" />
                  ))}
                </>
              ) : (
                <g>
                  {revenueData.map((d, i) => {
                    const bw = (innerWidth / revenueData.length) * 0.3;
                    const bx = getX(i) - bw;
                    return (
                      <g key={i}>
                        <rect x={bx - bw/2 - 2} y={getY(d.previous)} width={bw} height={padTop + innerHeight - getY(d.previous)} className="fill-gray-200 dark:fill-[#161F30] rx-1" />
                        <rect x={bx + bw/2 + 2} y={getY(d.current)} width={bw} height={padTop + innerHeight - getY(d.current)} className="fill-gray-900 dark:fill-white rx-1" />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* X Axis Labels */}
              {revenueData.map((d, i) => (
                <text key={i} x={getX(i)} y={height - 5} textAnchor="middle" className="text-[10px] font-bold fill-gray-400">
                  {d.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm p-5 flex flex-col">
          <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">To'lov Usullari Taqsimoti</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                {paymentStats.map((stat, i) => {
                  const dash = (stat.val / 100) * circumference;
                  const currentOffset = offset;
                  offset += dash;
                  return (
                    <circle
                      key={stat.type}
                      cx="80" cy="80" r={radius}
                      fill="none"
                      stroke={stat.color}
                      strokeWidth="24"
                      strokeDasharray={`${dash} ${circumference}`}
                      strokeDashoffset={-currentOffset}
                      className="transition-all duration-1000"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Asosiy</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">Click</span>
              </div>
            </div>

            <div className="w-full mt-6 space-y-3">
              {paymentStats.map(stat => (
                <div key={stat.type} className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span className="text-gray-700 dark:text-gray-300">{stat.type}</span>
                  </div>
                  <span className="text-gray-950 dark:text-white">{stat.val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOP-3 PODIUM */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-6">TOP-3 Eng Ko'p Sotilgan Tovarlar</h3>
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-8 h-48 px-4">
          
          {/* Rank 2 */}
          <div className="flex flex-col items-center order-2 sm:order-1 w-full sm:w-1/3">
            <div className="bg-gray-100 dark:bg-[#161F30] p-2 rounded-xl mb-3 shadow-sm border-2 border-gray-300 text-center text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-2 w-full">
              iPhone 14 Pro Max 256GB
            </div>
            <div className="w-full h-24 bg-gray-200 dark:bg-[#1F293D] rounded-t-xl flex flex-col items-center justify-start pt-3 border-t-4 border-gray-400">
              <Medal className="w-6 h-6 text-gray-500 mb-1" />
              <span className="text-lg font-black text-gray-600 dark:text-gray-400">2</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">45 ta</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center order-1 sm:order-2 w-full sm:w-1/3">
            <div className="bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl mb-3 shadow-md border-2 border-amber-400 text-center text-xs font-bold text-gray-900 dark:text-white line-clamp-2 w-full relative">
              <Crown className="w-5 h-5 text-amber-500 absolute -top-3 -right-2 rotate-12" />
              MacBook Air M2
            </div>
            <div className="w-full h-32 bg-amber-100 dark:bg-amber-900/30 rounded-t-xl flex flex-col items-center justify-start pt-3 border-t-4 border-amber-500">
              <Medal className="w-8 h-8 text-amber-500 mb-1" />
              <span className="text-xl font-black text-amber-600 dark:text-amber-500">1</span>
              <span className="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase mt-1">89 ta</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center order-3 sm:order-3 w-full sm:w-1/3">
            <div className="bg-orange-50 dark:bg-orange-950/10 p-2 rounded-xl mb-3 shadow-sm border-2 border-orange-300 text-center text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-2 w-full">
              AirPods Pro 2
            </div>
            <div className="w-full h-16 bg-orange-100 dark:bg-[#2A201A] rounded-t-xl flex flex-col items-center justify-start pt-2 border-t-4 border-orange-400">
              <Medal className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-base font-black text-orange-600 dark:text-orange-500">3</span>
              <span className="text-[10px] font-bold text-orange-500/70 uppercase">32 ta</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
