'use client';

import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

export function TrustBadges() {
  const { t } = useLanguageStore();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 select-none">
      <div className="p-3.5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm bg-white dark:bg-[#111827] hover:shadow-md hover:-translate-y-0.5 transition-all flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-2">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-gray-900 dark:text-white stroke-[2.2]" />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-950 dark:text-white block leading-tight">
            {t('trust_original_title')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
            {t('trust_original_desc')}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm bg-white dark:bg-[#111827] hover:shadow-md hover:-translate-y-0.5 transition-all flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-2">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-gray-900 dark:text-white stroke-[2.2]" />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-950 dark:text-white block leading-tight">
            {t('trust_delivery_title')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
            {t('trust_delivery_desc')}
          </span>
        </div>
      </div>

      <div className="p-3.5 rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm bg-white dark:bg-[#111827] hover:shadow-md hover:-translate-y-0.5 transition-all flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-2">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#161F30] border border-gray-200/80 dark:border-white/10 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5 text-gray-900 dark:text-white stroke-[2.2]" />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-950 dark:text-white block leading-tight">
            {t('trust_return_title')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
            {t('trust_return_desc')}
          </span>
        </div>
      </div>
    </section>
  );
}
