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

// Clear legacy fake cache automatically
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('store-audit-storage');
  } catch (e) {}
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) =>
        set((state) => ({
          logs: [
            {
              ...log,
              id: `LOG-${Date.now().toString().slice(-4)}`,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
            ...state.logs,
          ].slice(0, 100),
        })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'tma_real_audit_v3',
    }
  )
);
