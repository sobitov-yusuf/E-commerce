import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomerRecord {
  id: string;
  telegramId: string;
  username: string;
  name: string;
  phone: string;
  avatar?: string;
  totalSpent: number;
  ordersCount: number;
  status: 'ACTIVE' | 'VIP' | 'BLOCKED';
  lastActive: string;
  createdAt: string;
  notes?: string;
}

interface CustomerState {
  customers: CustomerRecord[];
  addCustomer: (customer: Omit<CustomerRecord, 'id' | 'createdAt'>) => void;
  updateCustomerStatus: (id: string, status: CustomerRecord['status']) => void;
  deleteCustomer: (id: string) => void;
  updateCustomerNotes: (id: string, notes: string) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],

      addCustomer: (customerData) =>
        set((state) => ({
          customers: [
            {
              ...customerData,
              id: `CUST-${Date.now().toString().slice(-4)}`,
              createdAt: new Date().toLocaleDateString('uz-UZ'),
            },
            ...state.customers,
          ],
        })),

      updateCustomerStatus: (id, status) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      updateCustomerNotes: (id, notes) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, notes } : c)),
        })),
    }),
    {
      name: 'store-customers-storage',
    }
  )
);
