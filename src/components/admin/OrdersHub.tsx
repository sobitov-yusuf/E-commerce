import React, { useState, useRef } from 'react';
import { 
  Package, 
  Search, 
  Download, 
  Printer, 
  ChevronDown, 
  Check, 
  X, 
  Clock,
  MapPin,
  CreditCard,
  Phone
} from 'lucide-react';
import { useOrderStore, OrderItemRecord } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';

// Custom Popover Dropdown Component
function CustomDropdown({ label, options, value, onChange }: { label: string, options: {id: string, label: string}[], value: string, onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="h-10 px-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-between min-w-[140px] text-xs font-bold text-gray-900 dark:text-white"
      >
        <span>{options.find(o => o.id === value)?.label || label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-xl rounded-2xl z-50 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between text-gray-900 dark:text-white"
            >
              {opt.label}
              {value === opt.id && <Check className="w-4 h-4 text-gray-900 dark:text-white stroke-[3]" />}
            </button>
          ))}
        </div>
      )}
      
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

export function OrdersHub(props: any) {
  const { orders, updateOrderStatus } = useOrderStore();
  const { restoreStock } = useProductStore();
  
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<OrderItemRecord | null>(null);

  const periods = [
    { id: 'ALL', label: 'Barcha davr' },
    { id: 'TODAY', label: 'Bugun' },
    { id: '7DAYS', label: 'Oxirgi 7 kun' },
    { id: 'MONTH', label: 'Shu oy' }
  ];

  const statuses = [
    { id: 'ALL', label: 'Barcha holatlar' },
    { id: 'NEW', label: 'Yangi' },
    { id: 'DELIVERING', label: 'Yetkazilmoqda' },
    { id: 'COMPLETED', label: 'Yakunlangan' },
    { id: 'CANCELLED', label: 'Bekor qilingan' }
  ];

  // Excel CSV Export (UTF-8 BOM)
  const exportToCSV = () => {
    const BOM = '\uFEFF';
    const header = 'ID;Sana;Mijoz;Telefon;Summa;Holat\n';
    const rows = orders.map(o => 
      `${o.id};${o.date};${o.user || 'Mijoz'};${o.phone};${o.total};${o.status}`
    ).join('\n');
    
    const blob = new Blob([BOM + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Buyurtmalar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReceipt = (order: OrderItemRecord) => {
    // Basic 80mm thermal receipt generator logic
    const content = `
      <div style="width: 80mm; font-family: monospace; font-size: 12px; padding: 10px;">
        <h2 style="text-align: center; margin: 0;">STORE_NAME</h2>
        <p style="text-align: center; margin: 5px 0;">Kvitansiya: ${order.id}</p>
        <p style="text-align: center; margin: 5px 0;">Sana: ${order.date}</p>
        <hr style="border: 1px dashed black;" />
        ${order.items?.map(item => `
          <div style="display: flex; justify-content: space-between; margin: 4px 0;">
            <span>${item.name} x${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()} UZS</span>
          </div>
        `).join('')}
        <hr style="border: 1px dashed black;" />
        <h3 style="text-align: right; margin: 10px 0;">JAMI: ${order.total.toLocaleString()} UZS</h3>
        <p style="text-align: center; margin: 20px 0;">Xaridingiz uchun rahmat!</p>
      </div>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(content);
      win.document.close();
      win.print();
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    if (newStatus === 'CANCELLED') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.items?.forEach(item => {
          restoreStock(item.id, Number(item.variant) || 0, item.quantity);
        });
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.phone.includes(search)) return false;
    // period filter mock logic would go here
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <h2 className="text-xl font-black text-gray-950 dark:text-white tracking-tight">Buyurtmalar</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="ID yoki raqam..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-xs font-bold text-gray-900 dark:text-white outline-none w-48"
            />
          </div>
          
          <CustomDropdown label="Davr" options={periods} value={periodFilter} onChange={setPeriodFilter} />
          <CustomDropdown label="Holat" options={statuses} value={statusFilter} onChange={setStatusFilter} />
          
          <button 
            onClick={exportToCSV}
            className="h-10 px-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" /> CSV Eksport
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#161F30] border-b border-gray-200 dark:border-white/10">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">ID / Sana</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Mijoz</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Summa</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-bold text-sm">Buyurtmalar topilmadi</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="text-sm font-black text-gray-900 dark:text-white">{order.id}</div>
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">{order.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{order.user}</div>
                    <div className="text-xs text-gray-500">{order.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-black text-gray-900 dark:text-white">{order.total.toLocaleString()} UZS</div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold">{order.paymentType}</div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      order.status === 'DELIVERING' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {order.status}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Decluttered Clean Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Header: Action buttons inside header, no redundant buttons elsewhere */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 shrink-0">
              <h3 className="text-lg font-black text-gray-950 dark:text-white">{selectedOrder.id}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => handlePrintReceipt(selectedOrder)} className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-white/10">
                  <Printer className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-gray-200 dark:bg-white/10" />
                <CustomDropdown 
                  label="Holatni O'zgartirish" 
                  options={statuses.filter(s => s.id !== 'ALL')} 
                  value={selectedOrder.status} 
                  onChange={(val) => {
                    handleStatusChange(selectedOrder.id, val);
                    setSelectedOrder(prev => prev ? {...prev, status: val as any} : null);
                  }} 
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Telefon</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> To'lov</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.paymentType}</div>
                </div>
                <div className="col-span-2 space-y-1">
                  <div className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Manzil</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedOrder.location}</div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase">Tovarlar</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-[#161F30] p-3 rounded-2xl border border-gray-200/50 dark:border-white/5">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {item.variant} x{item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-black text-gray-900 dark:text-white">
                      {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clean Modal Bottom: ONLY Close Button */}
            <div className="p-6 border-t border-gray-100 dark:border-white/10 shrink-0">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold rounded-xl text-sm transition-all hover:bg-black dark:hover:bg-gray-100"
              >
                Yopish
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
