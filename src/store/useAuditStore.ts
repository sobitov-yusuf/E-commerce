import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuditLogItem {
  id: string;
  action: string;
  module: string;
  actor: string;
  details: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER';
}

interface AuditStore {
  logs: AuditLogItem[];
  addLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const initialLogs: AuditLogItem[] = [
  {
    id: 'LOG-1001',
    action: 'Tizimga kirish',
    module: 'Auth',
    actor: 'Super Admin',
    details: 'Admin panelga muvaffaqiyatli kirildi (IP: 192.168.1.1)',
    timestamp: '2026-08-20 17:30',
    type: 'INFO',
  },
  {
    id: 'LOG-1002',
    action: 'Buyurtma holati o\'zgartirildi',
    module: 'Orders',
    actor: 'Super Admin',
    details: 'Buyurtma #ORD-9824 holati "DELIVERING" ga o\'zgartirildi',
    timestamp: '2026-08-20 17:15',
    type: 'SUCCESS',
  },
  {
    id: 'LOG-1003',
    action: 'Mahsulot zaxirasi yangilandi',
    module: 'Products',
    actor: 'Operator 1',
    details: 'Nike Air Max qoldig\'i 12 donaga to\'ldirildi',
    timestamp: '2026-08-20 16:45',
    type: 'INFO',
  },
  {
    id: 'LOG-1004',
    action: 'Yangi aksiya banneri qo\'shildi',
    module: 'Banners',
    actor: 'Super Admin',
    details: 'Yangi Mavsum Kolleksiyasi banneri e\'lon qilindi',
    timestamp: '2026-08-20 15:20',
    type: 'SUCCESS',
  },
];

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      logs: initialLogs,
      addLog: (log) =>
        set((state) => ({
          logs: [
            {
              ...log,
              id: `LOG-${Date.now().toString().slice(-4)}`,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
            ...state.logs,
          ].slice(0, 100), // Max 100 recent logs
        })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'store-audit-storage',
    }
  )
);
