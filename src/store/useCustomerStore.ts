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

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'CUST-1001',
    telegramId: '987654321',
    username: 'sardor_aliyev',
    name: 'Sardor Aliyev',
    phone: '+998 90 123-45-67',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    totalSpent: 2450000,
    ordersCount: 8,
    status: 'VIP',
    lastActive: 'Bugun, 16:45',
    createdAt: '12.01.2026',
    notes: 'Doimiy xaridor, tez-tez elektronika buyurtma qiladi.',
  },
  {
    id: 'CUST-1002',
    telegramId: '876543210',
    username: 'madina_karimova',
    name: 'Madina Karimova',
    phone: '+998 93 987-65-43',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    totalSpent: 1120000,
    ordersCount: 4,
    status: 'ACTIVE',
    lastActive: 'Kecha, 19:20',
    createdAt: '03.02.2026',
  },
  {
    id: 'CUST-1003',
    telegramId: '765432109',
    username: 'jasur_bek',
    name: 'Jasurbek Toshmatov',
    phone: '+998 97 555-44-33',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    totalSpent: 380000,
    ordersCount: 1,
    status: 'ACTIVE',
    lastActive: '18.08.2026',
    createdAt: '18.08.2026',
  },
  {
    id: 'CUST-1004',
    telegramId: '654321098',
    username: 'unknown_spammer',
    name: 'Bot / Soxta Foydalanuvchi',
    phone: '+998 99 000-00-00',
    totalSpent: 0,
    ordersCount: 0,
    status: 'BLOCKED',
    lastActive: '10.08.2026',
    createdAt: '10.08.2026',
    notes: 'Soxta manzil kiritib buyurtmani rad etgan.',
  },
];

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: INITIAL_CUSTOMERS,

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
