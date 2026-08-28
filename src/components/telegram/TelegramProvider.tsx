'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: any;
  user: TelegramUser | null;
  isReady: boolean;
  haptic: {
    impact: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type?: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
  haptic: {
    impact: () => {},
    notification: () => {},
    selection: () => {},
  },
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      useThemeStore.getState().initializeTheme();

      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        try {
          if (typeof tg.ready === 'function') tg.ready();
          if (typeof tg.expand === 'function') tg.expand();
          if (typeof tg.enableClosingConfirmation === 'function') {
            tg.enableClosingConfirmation();
          }
        } catch (err) {
          console.warn('Telegram WebApp setup error:', err);
        }

        setWebApp(tg);
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
        } else {
          setUser({
            id: 7890123,
            first_name: 'Alisher',
            last_name: 'Zokirov',
            username: 'alisher_z',
            language_code: 'uz',
          });
        }
      } else {
        setUser({
          id: 7890123,
          first_name: 'Alisher',
          last_name: 'Zokirov',
          username: 'alisher_z',
          language_code: 'uz',
        });
      }
    } catch (e) {
      console.error('TelegramProvider useEffect error:', e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const haptic = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.impactOccurred(style);
        }
      } catch (e) {
        // Ignore
      }
    },
    notification: (type: 'error' | 'success' | 'warning' = 'success') => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred(type);
        }
      } catch (e) {
        // Ignore
      }
    },
    selection: () => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.selectionChanged();
        }
      } catch (e) {
        // Ignore
      }
    },
  };

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady, haptic }}>
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
