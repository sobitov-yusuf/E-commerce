import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StaffRole = 'SUPER_ADMIN' | 'MANAGER' | 'COURIER';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  lastActive: string;
  avatar: string;
}

interface StaffStore {
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  removeStaff: (id: string) => void;
  toggleStaffActive: (id: string) => void;
  updateStaffRole: (id: string, role: StaffRole) => void;
}

const initialStaff: StaffMember[] = [
  {
    id: 'STF-01',
    name: 'Alisher Rahimov',
    phone: '+998 90 123-45-67',
    role: 'SUPER_ADMIN',
    isActive: true,
    lastActive: 'Hozir faol',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'STF-02',
    name: 'Madina Karimova',
    phone: '+998 93 987-65-43',
    role: 'MANAGER',
    isActive: true,
    lastActive: '10 daqiqa oldin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'STF-03',
    name: 'Jasur Bekmurodov',
    phone: '+998 97 555-12-34',
    role: 'COURIER',
    isActive: true,
    lastActive: '1 soat oldin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      staff: initialStaff,
      addStaff: (member) =>
        set((state) => ({
          staff: [
            {
              ...member,
              id: `STF-${Date.now().toString().slice(-4)}`,
              lastActive: 'Hozirgina qo\'shildi',
            },
            ...state.staff,
          ],
        })),
      removeStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((s) => s.id !== id),
        })),
      toggleStaffActive: (id) =>
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
        })),
      updateStaffRole: (id, role) =>
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, role } : s)),
        })),
    }),
    {
      name: 'store-staff-storage',
    }
  )
);
