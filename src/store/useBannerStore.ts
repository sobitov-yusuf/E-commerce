import { create } from 'zustand';

export interface MultilingualText {
  uz: string;
  ru: string;
  en: string;
}

export interface BannerItem {
  id: string;
  title: MultilingualText | string;
  subtitle?: MultilingualText | string;
  image: string;
  link: string;
  isActive: boolean;
}

interface BannerState {
  banners: BannerItem[];
  isLoading: boolean;
  fetchBanners: () => Promise<void>;
  addBanner: (banner: Omit<BannerItem, 'id'>) => Promise<boolean>;
  removeBanner: (id: string) => Promise<boolean>;
  toggleBannerActive: (id: string) => void;
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [], // Clean, no fake banners
  isLoading: false,

  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((b: any) => ({
          id: b.id,
          title: b.title,
          subtitle: b.subtitle,
          image: b.image_url,
          link: b.link,
          isActive: b.is_active,
        }));
        set({ banners: formatted, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      console.error('Fetch banners error:', e);
      set({ isLoading: false });
    }
  },

  addBanner: async (banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: banner.title,
          subtitle: banner.subtitle,
          image_url: banner.image,
          link: banner.link,
          is_active: banner.isActive,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const item: BannerItem = {
          id: data.data.id,
          title: data.data.title,
          subtitle: data.data.subtitle,
          image: data.data.image_url,
          link: data.data.link,
          isActive: data.data.is_active,
        };
        set({ banners: [item, ...get().banners] });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Add banner error:', e);
      return false;
    }
  },

  removeBanner: async (id) => {
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        set({ banners: get().banners.filter((b) => b.id !== id) });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Delete banner error:', e);
      return false;
    }
  },

  toggleBannerActive: (id) => {
    set({
      banners: get().banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)),
    });
  },
}));
