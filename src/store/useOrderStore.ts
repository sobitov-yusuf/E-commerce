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

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

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
