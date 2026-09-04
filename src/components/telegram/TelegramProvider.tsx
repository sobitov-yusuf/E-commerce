'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import { useCustomerStore } from '@/store/useCustomerStore';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  webApp: any;
  user: TelegramUser | null;
  isReady: boolean;
  isTelegramWebApp: boolean;
  isAuthenticated: boolean;
  token: string | null;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  loginWithWeb: (user: TelegramUser, token: string) => void;
  logout: () => void;
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
  isTelegramWebApp: false,
  isAuthenticated: false,
  token: null,
  showAuthModal: false,
  setShowAuthModal: () => {},
  loginWithWeb: () => {},
  logout: () => {},
  haptic: {
    impact: () => {},
    notification: () => {},
    selection: () => {},
  },
});

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const syncCustomerStore = useCallback((userData: TelegramUser) => {
    try {
      const customerStore = useCustomerStore.getState();
      const existing = customerStore.customers.find(
        (c) => c.telegramId === String(userData.id)
      );
      if (!existing && userData.id) {
        customerStore.addCustomer({
          telegramId: String(userData.id),
          username: userData.username || '',
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Mijoz',
          phone: userData.phone || '+998 (90) 123-45-67',
          avatar: userData.photo_url || undefined,
          totalSpent: 0,
          ordersCount: 0,
          status: 'ACTIVE',
          lastActive: 'Hozirgina',
        });
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const loginWithWeb = useCallback((webUser: TelegramUser, sessionToken: string) => {
    setUser(webUser);
    setToken(sessionToken);
    try {
      localStorage.setItem('web_tg_user', JSON.stringify(webUser));
      localStorage.setItem('web_tg_token', sessionToken);
    } catch (e) {}
    syncCustomerStore(webUser);
  }, [syncCustomerStore]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('web_tg_user');
      localStorage.removeItem('web_tg_token');
      document.cookie = 'user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      useThemeStore.getState().initializeTheme();

      // Check if running inside Telegram Mini App
      const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
      const hasTgWebApp = Boolean(tg && (tg.platform !== 'unknown' || tg.initData));

      if (hasTgWebApp) {
        const tg = (window as any).Telegram.WebApp;
        setIsTelegramWebApp(true);
        setWebApp(tg);

        try {
          if (typeof tg.ready === 'function') tg.ready();
          if (typeof tg.expand === 'function') tg.expand();
          if (typeof tg.enableClosingConfirmation === 'function') {
            tg.enableClosingConfirmation();
          }

          // Force inject safe area padding if inside Telegram
          let topInset = tg.contentSafeAreaInset?.top ?? tg.safeAreaInset?.top ?? 0;
          let bottomInset = tg.contentSafeAreaInset?.bottom ?? tg.safeAreaInset?.bottom ?? 0;

          // If Telegram SDK doesn't provide safe area (e.g. older Android clients),
          // check if the webview is in fullscreen (floating header) mode by comparing heights.
          if (topInset === 0 && typeof window !== 'undefined') {
            // In Fullscreen mode (floating header), innerHeight is almost equal to screen.height
            // In Bottom Sheet mode (gray header), innerHeight is much smaller (status bar + header)
            const diff = Math.abs(window.screen.height - window.innerHeight);
            if (diff < 60) {
              // It's in Fullscreen mode. Add generous padding for the floating "X Yopish" button.
              topInset = 100; 
            }
          }

          document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${topInset}px`);
          document.documentElement.style.setProperty('--tg-safe-area-inset-bottom', `${bottomInset}px`);
        } catch (err) {
          console.warn('Telegram WebApp setup error:', err);
        }

        // 1. Authenticate with TMA initData
        if (tg.initData) {
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: tg.initData }),
          })
            .then((res) => res.json())
            .then((json) => {
              if (json.success && json.data?.user) {
                const authenticatedUser: TelegramUser = {
                  id: Number(json.data.user.telegram_id),
                  first_name: json.data.user.first_name,
                  last_name: json.data.user.last_name || undefined,
                  username: json.data.user.username || undefined,
                  language_code: json.data.user.language_code || 'uz',
                };
                setUser(authenticatedUser);
                setToken(json.data.token || null);
                syncCustomerStore(authenticatedUser);
              } else if (tg.initDataUnsafe?.user) {
                const fallbackUser: TelegramUser = tg.initDataUnsafe.user;
                setUser(fallbackUser);
                syncCustomerStore(fallbackUser);
              }
            })
            .catch(() => {
              if (tg.initDataUnsafe?.user) {
                setUser(tg.initDataUnsafe.user);
                syncCustomerStore(tg.initDataUnsafe.user);
              }
            });
        } else if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
          syncCustomerStore(tg.initDataUnsafe.user);
        }
      } else {
        // 2. Running in Standard Web Browser (Desktop / Mobile Browser)
        setIsTelegramWebApp(false);
        try {
          const savedWebUser = localStorage.getItem('web_tg_user');
          const savedWebToken = localStorage.getItem('web_tg_token');
          if (savedWebUser) {
            const parsed = JSON.parse(savedWebUser);
            setUser(parsed);
            setToken(savedWebToken || null);
            syncCustomerStore(parsed);
          } else {
            // Clean unauthenticated state
            setUser(null);
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('TelegramProvider initialization error:', e);
    } finally {
      setIsReady(true);
    }
  }, [syncCustomerStore]);

  const haptic = {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.impactOccurred(style);
        }
      } catch (e) {}
    },
    notification: (type: 'error' | 'success' | 'warning' = 'success') => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.notificationOccurred(type);
        }
      } catch (e) {}
    },
    selection: () => {
      try {
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.selectionChanged();
        }
      } catch (e) {}
    },
  };

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        user,
        isReady,
        isTelegramWebApp,
        isAuthenticated: Boolean(user),
        token,
        showAuthModal,
        setShowAuthModal,
        loginWithWeb,
        logout,
        haptic,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext);
