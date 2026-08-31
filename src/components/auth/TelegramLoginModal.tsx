'use client';

import React, { useState } from 'react';
import { X, Send, Phone, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTelegram } from '@/components/telegram/TelegramProvider';
import { useLanguageStore } from '@/store/useLanguageStore';

interface TelegramLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TelegramLoginModal({ isOpen, onClose, onSuccess }: TelegramLoginModalProps) {
  const { loginWithWeb, haptic } = useTelegram();
  const { t, lang } = useLanguageStore();

  const [phone, setPhone] = useState('+998 ');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    // Allow digits and space
    const digitsOnly = val.replace(/[^\d+]/g, '');
    setPhone(digitsOnly);
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    haptic.impact('medium');

    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 13) {
      setError(
        lang === 'uz'
          ? 'Iltimos, to\'liq telefon raqam kiriting (+998 XX XXX-XX-XX)'
          : lang === 'ru'
          ? 'Пожалуйста, введите полный номер телефона (+998 XX XXX-XX-XX)'
          : 'Please enter a valid phone number (+998 XX XXX-XX-XX)'
      );
      return;
    }

    if (!name.trim()) {
      setError(
        lang === 'uz'
          ? 'Iltimos, ismingizni kiriting'
          : lang === 'ru'
          ? 'Пожалуйста, введите ваше имя'
          : 'Please enter your name'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'phone_quick',
          phone: cleanPhone,
          firstName: name.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.data?.user) {
        setSuccess(true);
        loginWithWeb(
          {
            id: Number(data.data.user.telegram_id),
            first_name: data.data.user.first_name,
            last_name: data.data.user.last_name || '',
            username: data.data.user.username || '',
            phone: data.data.user.phone || cleanPhone,
            language_code: 'uz',
          },
          data.data.token
        );

        setTimeout(() => {
          setIsLoading(false);
          setSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        setError(data.error || 'Kirishda xatolik yuz berdi');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError('Tarmoq xatosi: ' + err.message);
      setIsLoading(false);
    }
  };

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'uzum_market_bot';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-950 dark:text-white leading-tight">
                {lang === 'uz' ? 'Telegram orqali kirish' : lang === 'ru' ? 'Вход через Telegram' : 'Sign in with Telegram'}
              </h3>
              <p className="text-[11px] text-gray-400 font-normal">
                {lang === 'uz' ? 'Xavfsiz va tezkor avtorizatsiya' : lang === 'ru' ? 'Безопасная и быстрая авторизация' : 'Fast and secure login'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1F293D] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-bold text-gray-950 dark:text-white">
              {lang === 'uz' ? 'Muvaffaqiyatli kirdingiz!' : lang === 'ru' ? 'Вход выполнен успешно!' : 'Signed in successfully!'}
            </h4>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Direct Telegram Bot Link Option */}
            <a
              href={`https://t.me/${botUsername}?start=web_auth`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic.impact('medium')}
              className="w-full py-3 bg-[#24A1DE] hover:bg-[#208bc0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-transform"
            >
              <Send className="w-4 h-4" />
              <span>
                {lang === 'uz' ? 'Telegram Bot orqali ochish' : lang === 'ru' ? 'Открыть через Telegram Бот' : 'Open in Telegram Bot'}
              </span>
            </a>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-200 dark:border-white/10 w-full" />
              <span className="bg-white dark:bg-[#111827] px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {lang === 'uz' ? 'Yoki telefon orqali' : lang === 'ru' ? 'Или по номеру телефона' : 'Or via phone'}
              </span>
            </div>

            {/* Quick Web Phone Form */}
            <form onSubmit={handleQuickLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  {lang === 'uz' ? 'Ismingiz' : lang === 'ru' ? 'Ваше имя' : 'Your name'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ism Familiya"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                  {lang === 'uz' ? 'Telefon raqamingiz' : lang === 'ru' ? 'Номер телефона' : 'Phone number'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-[#161F30] border border-gray-200 dark:border-white/10 rounded-xl text-xs font-mono font-medium text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                  />
                </div>
              </div>

              {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-950 font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? '...' : lang === 'uz' ? 'Kirish va davom etish' : lang === 'ru' ? 'Войти и продолжить' : 'Sign in and continue'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {lang === 'uz' ? 'Sizning ma\'lumotlaringiz xavfsiz himoyalangan' : lang === 'ru' ? 'Ваши данные надежно защищены' : 'Your personal data is encrypted'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
