import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  Check,
  Trash2,
  Edit2
} from 'lucide-react';
import { useProductStore, ProductItem } from '@/store/useProductStore';

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

export function CatalogHub(props: any) {
  const { products, addProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showProductModal, setShowProductModal] = useState(false);

  // Form State
  const [formNameUz, setFormNameUz] = useState('');
  const [formNameRu, setFormNameRu] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProduct = async () => {
    if(!formNameUz || !formCategoryId || !formPrice) return;
    setIsSaving(true);
    const newProd = {
        name: { uz: formNameUz, ru: formNameRu, en: formNameUz },
        description: { uz: '', ru: '', en: '' },
        category_id: Number(formCategoryId),
        base_price: Number(formPrice),
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
        is_active: true
    };
    await addProduct(newProd);
    setIsSaving(false);
    setShowProductModal(false);
    setFormNameUz(''); setFormNameRu(''); setFormCategoryId(''); setFormPrice('');
  };

  // Stats Mini-HUD
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const outOfStock = products.filter(p => (p.stock || 0) === 0).length;

  const cats = [
    { id: 'ALL', label: 'Barcha Toifalar' },
    { id: 'electronics', label: 'Elektronika' },
    { id: 'clothes', label: 'Kiyimlar' },
  ];

  const filtered = products.filter(p => {
    if (categoryFilter !== 'ALL' && p.category_id?.toString() !== categoryFilter) return false;
    const nameUz = (p.name as any).uz || p.name;
    if (search && !(nameUz as string).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Mini-HUD */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">Jami Mahsulot</div>
          <div className="text-xl font-black text-gray-950 dark:text-white mt-1">{products.length} ta</div>
        </div>
        <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-sm">
          <div className="text-xs font-bold text-gray-500 uppercase">Umumiy Zaxira</div>
          <div className="text-xl font-black text-gray-950 dark:text-white mt-1">{totalStock} dona</div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
          <div className="text-xs font-bold text-red-500 uppercase">Tugagan Tovarlar</div>
          <div className="text-xl font-black text-red-600 dark:text-red-500 mt-1">{outOfStock} ta</div>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Mahsulot qidirish..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-xs font-bold text-gray-900 dark:text-white outline-none w-56"
            />
          </div>
          <CustomDropdown label="Kategoriya" options={cats} value={categoryFilter} onChange={setCategoryFilter} />
        </div>
        
        <button 
          onClick={() => setShowProductModal(true)}
          className="h-10 px-5 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-black dark:hover:bg-gray-100 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Yangi qo'shish
        </button>
      </div>

      {/* Grid Mode */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200/70 dark:border-white/10 shadow-sm overflow-hidden flex flex-col group">
            <div className="aspect-square w-full bg-gray-50 dark:bg-[#161F30] relative overflow-hidden">
              <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {p.badge === 'SALE' && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">SALE</div>
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{p.category_id}</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">{(p.name as any).uz || p.name}</div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-black text-gray-950 dark:text-white">{p.base_price.toLocaleString()} UZS</div>
                <div className="flex items-center justify-between mt-2">
                  <div className={`text-[10px] font-bold ${(p.stock || 0) > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    Qoldiq: {p.stock} ta
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-6 h-6 bg-gray-100 dark:bg-[#161F30] text-gray-600 dark:text-gray-300 rounded flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500"><Edit2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="relative w-full max-w-4xl max-h-full bg-white dark:bg-[#111827] rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header: Action buttons inside header, ONLY Yopish at the bottom */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 shrink-0">
              <h3 className="text-lg font-black text-gray-950 dark:text-white">Yangi mahsulot</h3>
              <div className="flex items-center gap-2">
                <button className="h-9 px-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all hover:bg-purple-100 dark:hover:bg-purple-900/40">
                  <Sparkles className="w-4 h-4" /> Gemini AI Tarjima
                </button>
                <button onClick={handleSaveProduct} disabled={isSaving} className="h-9 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl font-bold text-xs transition-all shadow-sm disabled:opacity-50">{isSaving ? "Saqlanmoqda..." : "Saqlash"}</button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: General Info & Translate */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nomi (UZ)</label>
                    <input type="text" value={formNameUz} onChange={e => setFormNameUz(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] outline-none text-sm font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nomi (RU)</label>
                    <input type="text" value={formNameRu} onChange={e => setFormNameRu(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#161F30]/50 outline-none text-sm font-bold text-gray-900 dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Kategoriya</label>
                    <div className="w-full">
                      <CustomDropdown label="Tanlang" options={cats.filter(c => c.id !== 'ALL')} value={formCategoryId} onChange={setFormCategoryId} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Asosiy Narx (UZS)</label>
                    <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161F30] outline-none text-sm font-black text-gray-900 dark:text-white" />
                  </div>
                </div>

                {/* Right: Multi-Image Gallery */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase">Rasm Galereyasi</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3 aspect-video bg-gray-50 dark:bg-[#161F30] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                      <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                      <span className="text-xs font-bold text-gray-500">Asosiy rasmni yuklang</span>
                    </div>
                    {/* Thumbnails placeholders */}
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-gray-50 dark:bg-[#161F30] rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <Plus className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom: SKU Variants Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase">SKU va Variantlar (O'lcham, Rang)</label>
                  <button className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline">
                    <Plus className="w-3.5 h-3.5" /> Variant qo'shish
                  </button>
                </div>
                <div className="bg-gray-50 dark:bg-[#161F30] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/10">
                        <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">SKU Nomi</th>
                        <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Narx farqi</th>
                        <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Zaxira (Qoldiq)</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                      <tr>
                        <td className="p-3"><input type="text" placeholder="Qora / 42" className="w-full h-8 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-xs font-bold outline-none" /></td>
                        <td className="p-3"><input type="number" placeholder="0" className="w-full h-8 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-xs font-bold outline-none" /></td>
                        <td className="p-3"><input type="number" placeholder="10" className="w-full h-8 px-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-xs font-bold outline-none" /></td>
                        <td className="p-3 text-right"><button className="text-red-500 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Clean Modal Bottom: ONLY Close Button */}
            <div className="p-6 border-t border-gray-100 dark:border-white/10 shrink-0">
              <button 
                onClick={() => setShowProductModal(false)}
                className="w-full h-12 bg-gray-100 dark:bg-[#161F30] text-gray-900 dark:text-white font-bold rounded-xl text-sm transition-all hover:bg-gray-200 dark:hover:bg-white/10"
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

