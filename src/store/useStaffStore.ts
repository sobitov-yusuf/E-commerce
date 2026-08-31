import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StaffRole = 'SUPER_ADMIN' | 'MANAGER' | 'OPERATOR' | 'COURIER';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  lastActive: string;
  avatar: string;
}

export type StaffPermission =
  | 'VIEW_ANALYTICS'
  | 'MANAGE_ORDERS'
  | 'MANAGE_CATALOG'
  | 'MANAGE_MARKETING'
  | 'MANAGE_CUSTOMERS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_STAFF'
  | 'VIEW_AUDIT_LOGS'
  | 'DELETE_RECORDS';

export const ROLE_PERMISSIONS: Record<StaffRole, StaffPermission[]> = {
  SUPER_ADMIN: [
    'VIEW_ANALYTICS',
    'MANAGE_ORDERS',
    'MANAGE_CATALOG',
    'MANAGE_MARKETING',
    'MANAGE_CUSTOMERS',
    'MANAGE_SETTINGS',
    'MANAGE_STAFF',
    'VIEW_AUDIT_LOGS',
    'DELETE_RECORDS',
  ],
  MANAGER: [
    'VIEW_ANALYTICS',
    'MANAGE_ORDERS',
    'MANAGE_CATALOG',
    'MANAGE_MARKETING',
    'MANAGE_CUSTOMERS',
  ],
  OPERATOR: [
    'MANAGE_ORDERS',
    'MANAGE_CUSTOMERS',
  ],
  COURIER: [
    'MANAGE_ORDERS', // only assigned orders
  ],
};

interface StaffStore {
  staff: StaffMember[];
  currentStaff: StaffMember;
  setCurrentStaff: (member: StaffMember) => void;
  hasPermission: (permission: StaffPermission) => boolean;
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
    name: 'Dilshod Normatov',
    phone: '+998 90 777-88-99',
    role: 'OPERATOR',
    isActive: true,
    lastActive: '5 daqiqa oldin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'STF-04',
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
    (set, get) => ({
      staff: initialStaff,
      currentStaff: initialStaff[0],
      setCurrentStaff: (member) => set({ currentStaff: member }),
      hasPermission: (permission) => {
        const currentRole = get().currentStaff?.role || 'SUPER_ADMIN';
        return ROLE_PERMISSIONS[currentRole]?.includes(permission) || false;
      },
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
