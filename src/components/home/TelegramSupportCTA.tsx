'use client';

import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface TelegramSupportCTAProps {
  triggerHaptic?: (type?: 'light' | 'medium') => void;
}

export function TelegramSupportCTA({ triggerHaptic }: TelegramSupportCTAProps) {
  const { t } = useLanguageStore();

  return (
    <section className="bg-gray-900 dark:bg-[#161F30] text-white rounded-2xl p-4 sm:p-6 border border-gray-800 dark:border-white/10 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-gray-800 dark:bg-gray-700/60 border border-gray-700 dark:border-gray-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <MessageCircle className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {t('support_cta_title')}
          </h4>
          <p className="text-xs text-gray-300 dark:text-gray-400 font-normal">
            {t('support_cta_desc')}
          </p>
        </div>
      </div>

      <a
        href="https://t.me/menejer_aloqa"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => triggerHaptic?.('medium')}
        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg bg-white text-gray-900 hover:bg-gray-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform duration-100 shrink-0"
      >
        <Send className="w-4 h-4 stroke-[2.2] text-gray-900" />
        <span>{t('support_cta_btn')}</span>
      </a>
    </section>
  );
}
