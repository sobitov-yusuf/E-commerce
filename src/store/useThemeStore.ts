import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeStore {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',

  setTheme: (theme: ThemeMode) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_theme', theme);
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.style.colorScheme = 'light';
        }
      }
    } catch (e) {}
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  initializeTheme: () => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('app_theme') as ThemeMode | null;
        if (savedTheme === 'dark' || savedTheme === 'light') {
          get().setTheme(savedTheme);
        } else {
          // Check system or Telegram preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          get().setTheme(prefersDark ? 'dark' : 'light');
        }
      }
    } catch (e) {}
  },
}));
