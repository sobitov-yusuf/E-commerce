import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PROMO' | 'SYSTEM';
  date: string;
  createdAt: number; // Real Unix timestamp in ms
  isRead: boolean;
  image?: string;
  actionText?: string;
  actionLink?: string;
  targetAudience?: 'ALL' | 'BUYERS' | 'NON_BUYERS';
}

export function formatNotificationTime(timestamp?: number | string, fallbackDate?: string): string {
  if (!timestamp) return fallbackDate || 'Hozirgina';
  
  const time = typeof timestamp === 'number' ? timestamp : new Date(timestamp).getTime();
  if (isNaN(time)) return fallbackDate || 'Hozirgina';

  const now = Date.now();
  const diffInSeconds = Math.max(0, Math.floor((now - time) / 1000));

  if (diffInSeconds < 60) {
    return 'Hozirgina';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} daqiqa oldin`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} soat oldin`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  const dateObj = new Date(time);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const mins = String(dateObj.getMinutes()).padStart(2, '0');

  if (diffInDays === 1) {
    return `Kechaga, ${hours}:${mins}`;
  }

  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  return `${day}-${month}, ${hours}:${mins}`;
}

interface NotificationState {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'date' | 'createdAt' | 'isRead'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: 'notif-1',
          title: 'Buyurtmangiz yetkazib berishga topshirildi! 📦',
          message: '#ORD-1048 raqamli buyurtmangiz tayyorlandi. Kuryer tez orada aloqaga chiqadi.',
          type: 'ORDER',
          date: '10 daqiqa oldin',
          createdAt: Date.now() - 10 * 60 * 1000,
          isRead: false,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
          actionText: 'Buyurtmani Ko\'rish',
          actionLink: '/profile',
          targetAudience: 'BUYERS',
        },
        {
          id: 'notif-2',
          title: 'Bahoriy Chegirmalar 2026! 🎁',
          message: 'Barcha soat va aksessuarlarga 15% chegirma SPRING2026 promokodi orqali amal qilmoqda.',
          type: 'PROMO',
          date: '1 soat oldin',
          createdAt: Date.now() - 60 * 60 * 1000,
          isRead: false,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
          actionText: 'Katalogga O\'tish',
          actionLink: '/catalog',
          targetAudience: 'ALL',
        },
        {
          id: 'notif-3',
          title: 'Tizim Yangilanishi va Xush Kelibsiz! ✨',
          message: 'STORE_NAME rasmiy ilovasining eng so\'nggi versiyasiga xush kelibsiz.',
          type: 'SYSTEM',
          date: 'Kechaga',
          createdAt: Date.now() - 26 * 60 * 60 * 1000,
          isRead: true,
          actionText: undefined,
          actionLink: undefined,
          targetAudience: 'ALL',
        },
      ],

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif-${Date.now()}`,
              date: 'Hozirgina',
              createdAt: Date.now(),
              isRead: false,
            },
            ...state.notifications,
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: 'store-notifications-storage',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
