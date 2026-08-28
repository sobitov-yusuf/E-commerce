import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderActivityLog {
  id: string;
  timestamp: number;
  text: string;
  actor: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
}

export interface OrderItemProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface OrderItemRecord {
  id: string;
  user: string;
  phone: string;
  total: number;
  subtotal?: number;
  discountPrice?: number;
  deliveryPrice?: number;
  status: 'NEW' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  paymentType?: 'PAYME' | 'CLICK' | 'CASH';
  paymentStatus?: 'PAID' | 'PENDING' | 'REFUNDED';
  itemsCount: number;
  date: string;
  createdAt: number;
  location?: string;
  deliveryMethod?: 'courier' | 'pickup';
  courierName?: string;
  courierPhone?: string;
  cancelReason?: string;
  customerComment?: string;
  activityLogs?: OrderActivityLog[];
  items?: OrderItemProduct[];
}

interface OrderState {
  orders: OrderItemRecord[];
  addOrder: (order: Omit<OrderItemRecord, 'id' | 'createdAt' | 'date'>) => string;
  updateOrderStatus: (id: string, status: OrderItemRecord['status'], cancelReason?: string, courierName?: string) => void;
  updateOrderPaymentStatus: (id: string, paymentStatus: OrderItemRecord['paymentStatus']) => void;
  assignCourier: (id: string, courierName: string, courierPhone?: string) => void;
  addActivityLog: (id: string, text: string, actor?: string, type?: OrderActivityLog['type']) => void;
  deleteOrder: (id: string) => void;
  bulkUpdateStatus: (ids: string[], status: OrderItemRecord['status']) => void;
  bulkDeleteOrders: (ids: string[]) => void;
}

const initialOrders: OrderItemRecord[] = [
  {
    id: '#ORD-1048',
    user: 'Alisher Zokirov',
    phone: '+998 90 123-45-67',
    total: 340000,
    subtotal: 340000,
    discountPrice: 0,
    deliveryPrice: 0,
    status: 'NEW',
    paymentType: 'PAYME',
    paymentStatus: 'PAID',
    itemsCount: 1,
    date: '2026-08-08 17:45',
    createdAt: Date.now() - 25 * 60 * 1000,
    location: 'Toshkent, Yunusobod 4-mavze, 12-uy, 44-xonadon',
    deliveryMethod: 'courier',
    customerComment: 'Iltimos, soat 19:00 dan keyin yetkazing, eshik qo\'ng\'irog\'ini bosing.',
    activityLogs: [
      {
        id: 'log-1',
        timestamp: Date.now() - 25 * 60 * 1000,
        text: 'Buyurtma Payme orqali to\'liq to\'landi va tizimga qabul qilindi',
        actor: 'Telegram Bot',
        type: 'SUCCESS',
      },
    ],
    items: [
      {
        id: 1,
        name: 'Premium Qishki Kurtka',
        price: 340000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500',
        variant: 'M / Qora',
      },
    ],
  },
  {
    id: '#ORD-1047',
    user: 'Malika Sobirova',
    phone: '+998 91 234-56-78',
    total: 180000,
    subtotal: 200000,
    discountPrice: 20000,
    deliveryPrice: 0,
    status: 'NEW',
    paymentType: 'CLICK',
    paymentStatus: 'PAID',
    itemsCount: 1,
    date: '2026-08-08 16:30',
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    location: 'Markaziy Filial (Do\'kondan olib ketish)',
    deliveryMethod: 'pickup',
    customerComment: 'O\'zim borib olaman, soat 18:00 gacha tayyorlab qo\'ying.',
    activityLogs: [
      {
        id: 'log-2',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        text: 'Buyurtma yaratildi va Click orqali to\'landi',
        actor: 'Xaridor',
        type: 'INFO',
      },
      {
        id: 'log-3',
        timestamp: Date.now() - 90 * 60 * 1000,
        text: 'Buyurtma omborda qadoqlashga o\'tkazildi',
        actor: 'Menejer',
        type: 'INFO',
      },
    ],
    items: [
      {
        id: 2,
        name: 'Luxe Parfum Elegance 100ml',
        price: 180000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
        variant: '50ml / Silver',
      },
    ],
  },
  {
    id: '#ORD-1046',
    user: 'Jasur Karimov',
    phone: '+998 93 345-67-89',
    total: 545000,
    subtotal: 520000,
    discountPrice: 0,
    deliveryPrice: 25000,
    status: 'DELIVERING',
    paymentType: 'CASH',
    paymentStatus: 'PENDING',
    itemsCount: 2,
    date: '2026-08-08 14:15',
    createdAt: Date.now() - 4 * 60 * 60 * 1000,
    location: 'Toshkent, Mirzo Ulug\'bek tumani, Buyuk Ipak Yo\'li 54',
    deliveryMethod: 'courier',
    courierName: 'Sardor Aliyev',
    courierPhone: '+998 90 999-11-22',
    customerComment: 'Naqd pul bilan to\'layman, 600,000 UZS ga qaytim tayyorlab keling.',
    activityLogs: [
      {
        id: 'log-4',
        timestamp: Date.now() - 4 * 60 * 60 * 1000,
        text: 'Naqd to\'lov sharti bilan buyurtma rasmiylashtirildi',
        actor: 'Xaridor',
        type: 'INFO',
      },
      {
        id: 'log-5',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        text: 'Kuryer biriktirildi: Sardor Aliyev (+998 90 999-11-22)',
        actor: 'Super Admin',
        type: 'INFO',
      },
      {
        id: 'log-6',
        timestamp: Date.now() - 30 * 60 * 1000,
        text: 'Yetkazib berish boshlandi, kuryer yo\'lda',
        actor: 'Sardor Aliyev (Kuryer)',
        type: 'SUCCESS',
      },
    ],
    items: [
      {
        id: 3,
        name: 'Charm Qo\'l Soati Deluxe',
        price: 520000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        variant: '42mm / Jigarrang',
      },
    ],
  },
  {
    id: '#ORD-1045',
    user: 'Nigora Umarova',
    phone: '+998 97 456-78-90',
    total: 210000,
    subtotal: 210000,
    discountPrice: 0,
    deliveryPrice: 0,
    status: 'COMPLETED',
    paymentType: 'PAYME',
    paymentStatus: 'PAID',
    itemsCount: 1,
    date: '2026-08-07 19:20',
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    location: 'Toshkent, Shayxontohur tumani, Navoiy ko\'chasi 18',
    deliveryMethod: 'courier',
    courierName: 'Rustam Qodirov',
    courierPhone: '+998 93 111-22-33',
    activityLogs: [
      {
        id: 'log-7',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        text: 'Buyurtma to\'liq yetkazib berildi va mijoz tomonidan qabul qilindi',
        actor: 'Rustam Qodirov (Kuryer)',
        type: 'SUCCESS',
      },
    ],
    items: [
      {
        id: 4,
        name: 'Klassik Charm Kamar',
        price: 210000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        variant: '115cm / Qora',
      },
    ],
  },
  {
    id: '#ORD-1044',
    user: 'Bobur Mansurov',
    phone: '+998 99 888-77-66',
    total: 450000,
    subtotal: 450000,
    discountPrice: 0,
    deliveryPrice: 0,
    status: 'CANCELLED',
    paymentType: 'CLICK',
    paymentStatus: 'REFUNDED',
    itemsCount: 1,
    date: '2026-08-06 11:10',
    createdAt: Date.now() - 48 * 60 * 60 * 1000,
    location: 'Toshkent, Sergeli 7-mavze',
    deliveryMethod: 'courier',
    cancelReason: 'Mijoz rad etdi',
    activityLogs: [
      {
        id: 'log-8',
        timestamp: Date.now() - 48 * 60 * 60 * 1000,
        text: 'Buyurtma bekor qilindi va mablag\' qaytarildi. Sabab: Mijoz rad etdi',
        actor: 'Super Admin',
        type: 'DANGER',
      },
    ],
    items: [
      {
        id: 5,
        name: 'Sport Krossovka Ultra',
        price: 450000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        variant: '42 / Oq-Qizil',
      },
    ],
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: initialOrders,

      addOrder: (orderData) => {
        const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const initialLog: OrderActivityLog = {
          id: `log-${Date.now()}`,
          timestamp: Date.now(),
          text: `Buyurtma yaratildi (${orderData.paymentType || 'CASH'}, ${orderData.deliveryMethod === 'pickup' ? 'Olib ketish' : 'Kuryer'})`,
          actor: orderData.user || 'Xaridor',
          type: 'INFO',
        };

        const newOrder: OrderItemRecord = {
          paymentType: orderData.paymentType || 'CASH',
          paymentStatus: orderData.paymentStatus || 'PENDING',
          subtotal: orderData.subtotal || orderData.total,
          discountPrice: orderData.discountPrice || 0,
          deliveryPrice: orderData.deliveryPrice || 0,
          ...orderData,
          id: orderId,
          createdAt: Date.now(),
          date: dateStr,
          activityLogs: orderData.activityLogs ? [...orderData.activityLogs, initialLog] : [initialLog],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return orderId;
      },

      updateOrderStatus: (id, status, cancelReason, courierName) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;
            let nextPaymentStatus = order.paymentStatus;
            let paymentNote = '';

            // Auto transition: Cash on completion becomes PAID
            if (status === 'COMPLETED' && order.paymentType === 'CASH' && order.paymentStatus === 'PENDING') {
              nextPaymentStatus = 'PAID';
              paymentNote = ' (Naqd to\'lov qabul qilindi - PAID)';
            }
            // Auto transition: Paid order on cancellation becomes REFUNDED
            if (status === 'CANCELLED' && order.paymentStatus === 'PAID') {
              nextPaymentStatus = 'REFUNDED';
              paymentNote = ' (Mablag\' qaytarishga o\'tkazildi - REFUNDED)';
            }

            const updated: OrderItemRecord = {
              ...order,
              status,
              paymentStatus: nextPaymentStatus,
              cancelReason: status === 'CANCELLED' ? (cancelReason !== undefined ? cancelReason : order.cancelReason) : undefined,
            };
            if (courierName !== undefined) updated.courierName = courierName;

            const log: OrderActivityLog = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              text: `Holat "${status}" ga o'zgartirildi${status === 'CANCELLED' && cancelReason ? ` (Sabab: ${cancelReason})` : ''}${paymentNote}`,
              actor: 'Admin',
              type: status === 'COMPLETED' ? 'SUCCESS' : status === 'CANCELLED' ? 'DANGER' : 'INFO',
            };

            updated.activityLogs = [log, ...(order.activityLogs || [])];
            return updated;
          }),
        })),

      updateOrderPaymentStatus: (id, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;
            const log: OrderActivityLog = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              text: `To'lov holati "${paymentStatus}" ga belgilandi`,
              actor: 'Admin',
              type: paymentStatus === 'PAID' ? 'SUCCESS' : paymentStatus === 'REFUNDED' ? 'WARNING' : 'INFO',
            };
            return {
              ...order,
              paymentStatus,
              activityLogs: [log, ...(order.activityLogs || [])],
            };
          }),
        })),

      assignCourier: (id, courierName, courierPhone) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;
            const nextStatus = order.status === 'NEW' ? 'DELIVERING' : order.status;
            const log: OrderActivityLog = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              text: `Kuryer biriktirildi: ${courierName}${courierPhone ? ` (${courierPhone})` : ''}`,
              actor: 'Admin',
              type: 'INFO',
            };
            return {
              ...order,
              courierName,
              courierPhone: courierPhone || order.courierPhone,
              status: nextStatus,
              activityLogs: [log, ...(order.activityLogs || [])],
            };
          }),
        })),

      addActivityLog: (id, text, actor = 'Admin', type = 'INFO') =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== id) return order;
            const log: OrderActivityLog = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              text,
              actor,
              type,
            };
            return {
              ...order,
              activityLogs: [log, ...(order.activityLogs || [])],
            };
          }),
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (!ids.includes(order.id)) return order;
            const log: OrderActivityLog = {
              id: `log-${Date.now()}`,
              timestamp: Date.now(),
              text: `Ommaviy amalda holat "${status}" ga o'tkazildi`,
              actor: 'Admin (Ommaviy)',
              type: status === 'COMPLETED' ? 'SUCCESS' : 'INFO',
            };
            return {
              ...order,
              status,
              activityLogs: [log, ...(order.activityLogs || [])],
            };
          }),
        })),

      bulkDeleteOrders: (ids) =>
        set((state) => ({
          orders: state.orders.filter((order) => !ids.includes(order.id)),
        })),
    }),
    {
      name: 'store-orders-storage',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
