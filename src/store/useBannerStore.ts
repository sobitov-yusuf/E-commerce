import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MultilingualText } from '@/types';

export interface BannerItem {
  id: string;
  title: MultilingualText | string;
  subtitle: MultilingualText | string;
  image: string;
  link: string;
  isActive: boolean;
  createdAt: number;
}

interface BannerState {
  banners: BannerItem[];
  addBanner: (banner: Omit<BannerItem, 'id' | 'createdAt'>) => void;
  removeBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
}

export const useBannerStore = create<BannerState>()(
  persist(
    (set, get) => ({
      banners: [
        {
          id: 'banner-1',
          title: {
            uz: 'The Chrono Elite',
            ru: 'The Chrono Elite',
            en: 'The Chrono Elite',
          },
          subtitle: {
            uz: 'Premiyum Elegans Kolleksiyasi',
            ru: 'Премиум Коллекция Элегантности',
            en: 'Premium Elegance Collection',
          },
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
          link: '/catalog',
          isActive: true,
          createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'banner-2',
          title: {
            uz: 'Bahoriy Kolleksiya 2026',
            ru: 'Весенняя Коллекция 2026',
            en: 'Spring Collection 2026',
          },
          subtitle: {
            uz: 'Barcha taqinchoqlarga 20% Chegirma',
            ru: 'Скидка 20% на все ювелирные изделия',
            en: '20% Discount on all jewelry',
          },
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80',
          link: '/catalog',
          isActive: true,
          createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        },
        {
          id: 'banner-3',
          title: {
            uz: 'Charm Sumkalar Premium',
            ru: 'Премиум Кожаные Сумки',
            en: 'Premium Leather Handbags',
          },
          subtitle: {
            uz: 'Cheklangan Adaddagi Luxe Aksessuarlar',
            ru: 'Лимитированные Luxe Аксессуары',
            en: 'Limited Edition Luxe Accessories',
          },
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80',
          link: '/catalog',
          isActive: true,
          createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
        },
      ],

      addBanner: (banner) =>
        set((state) => ({
          banners: [
            {
              ...banner,
              id: `banner-${Date.now()}`,
              createdAt: Date.now(),
            },
            ...state.banners,
          ],
        })),

      removeBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),

      toggleBannerActive: (id) =>
        set((state) => ({
          banners: state.banners.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          ),
        })),
    }),
    {
      name: 'store-banners-storage',
      partialize: (state) => ({ banners: state.banners }),
    }
  )
);
