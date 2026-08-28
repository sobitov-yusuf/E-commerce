'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Trash2,
  Package,
  Gift,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { TelegramProvider } from '@/components/telegram/TelegramProvider';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  useNotificationStore,
  NotificationItem,
  formatNotificationTime,
} from '@/store/useNotificationStore';

function NotificationsContent() {
  const router = useRouter();
  const { t, lang } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
        (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ORDER':
        return (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-900 text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <Package className="w-3 h-3 stroke-[2.2]" />
            <span>{t('notif_type_order')}</span>
          </span>
        );
      case 'PROMO':
        return (
          <span className="px-2 py-0.5 rounded-md bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <Gift className="w-3 h-3 stroke-[2.2]" />
            <span>{t('notif_type_promo')}</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-bold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3 h-3 stroke-[2.2]" />
            <span>{t('notif_type_system')}</span>
          </span>
        );
    }
  };

  const getCategoryIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-5 h-5 text-gray-900 stroke-[2]" />;
      case 'PROMO':
        return <Gift className="w-5 h-5 text-red-600 stroke-[2]" />;
      default:
        return <Sparkles className="w-5 h-5 text-gray-700 stroke-[2]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-900 selection:text-white flex flex-col antialiased">
      {/* 100% Solid Pure White Header with Back Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs px-4 h-16 flex items-center justify-between">
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                router.back();
              }}
              aria-label="Orqaga"
              className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-transform duration-100"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-950 leading-none">{t('notif_title')}</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold shadow-xs">
                    {unreadCount} {t('notif_new')}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-normal text-gray-400 mt-0.5">{t('notif_subtitle')}</p>
            </div>
          </div>

          {/* Clean Action Controls */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  markAllAsRead();
                }}
                title={t('notif_mark_all')}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition-transform duration-100 flex items-center justify-center"
              >
                <CheckCheck className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  clearAll();
                }}
                title={t('clear')}
                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-transform duration-100 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Minimalist Notification Feed */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4 space-y-3 pb-24">
        {notifications.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-200/70 p-6 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto border border-gray-200">
              <Bell className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-950">{t('notif_empty_title')}</h3>
              <p className="text-xs text-gray-400 font-normal mt-1">{t('notif_empty_desc')}</p>
            </div>
          </div>
        ) : (
          notifications.map((notif) => {
            const hasValidImage = notif.image && notif.image.trim() !== '' && !imgErrors[notif.id];
            const formattedTime = formatNotificationTime(notif.createdAt, notif.date);

            return (
              <div
                key={notif.id}
                onClick={() => {
                  triggerHaptic('light');
                  markAsRead(notif.id);
                }}
                className={`rounded-xl border transition-all relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform duration-100 ${
                  notif.isRead
                    ? 'bg-white border-gray-200/70 text-gray-600 shadow-xs'
                    : 'bg-gray-900/[0.03] border-gray-900/30 text-gray-950 shadow-xs'
                }`}
              >
                {/* Banner Image Preview */}
                {hasValidImage && (
                  <div className="w-full h-36 bg-gray-50 overflow-hidden relative border-b border-gray-100">
                    <img
                      src={notif.image}
                      alt={notif.title}
                      onError={() => handleImgError(notif.id)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-3.5 sm:p-4 flex items-start gap-3">
                  {/* Icon Thumbnail */}
                  {!hasValidImage && (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      {getCategoryIcon(notif.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      {getTypeBadge(notif.type)}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-semibold text-gray-400">{formattedTime}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-gray-900" title="O'qilmagan" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 leading-snug mb-1">{notif.title}</h3>
                    <p className="text-xs text-gray-600 font-normal leading-relaxed mb-2.5">{notif.message}</p>

                    {/* Optional Action CTA Button */}
                    {notif.actionText && notif.actionLink && (
                      <Link
                        href={notif.actionLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('medium');
                          markAsRead(notif.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 text-xs font-semibold active:scale-95 transition-transform duration-100 shadow-xs"
                      >
                        <span>{notif.actionText}</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5] text-white dark:text-gray-950" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default function StandaloneNotificationsPage() {
  return (
    <TelegramProvider>
      <NotificationsContent />
    </TelegramProvider>
  );
}
