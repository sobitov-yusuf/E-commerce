import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  telegramSupport: string;
  workingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  enablePayme: boolean;
  enableClick: boolean;
  enableCash: boolean;
  geminiApiKey: string;
  geminiModel: string;
  maxReviewsPerProduct: number;
}

interface SettingsStore extends StoreSettings {
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: StoreSettings = {
  storeName: 'PREMIUM STORE',
  supportPhone: '+998 (90) 123-45-67',
  telegramSupport: 'tme_support_bot',
  workingHours: '09:00 - 22:00',
  deliveryFee: 25000,
  freeDeliveryThreshold: 300000,
  enablePayme: true,
  enableClick: true,
  enableCash: true,
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  maxReviewsPerProduct: 10,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (newSettings) => {
        set((state) => ({ ...state, ...newSettings }));
      },

      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'store-settings-storage',
    }
  )
);
