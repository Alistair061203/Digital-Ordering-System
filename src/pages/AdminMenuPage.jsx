import React, { useState, useEffect } from 'react';
import { supabase } from '../connectDB';
import { Plus, Trash2, X, Search, Image as ImageIcon, Check, ChevronRight, Loader2 } from 'lucide-react';

function AdminMenuPage({ restaurant }) {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveState, setSaveState] = useState({ saving: false, error: '', ok: false });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    prep_time_minutes: '0'
  });

  useEffect(() => {
    if (restaurant?.id) fetchData();
  }, [restaurant]);

  async function fetchData() {
    setLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from('MENU_ITEM').select('*').eq('restaurant_id', restaurant.id).order('name'),
      supabase.from('MENU_CATEGORY').select('*').order('name')
    ]);
    if (!itemsRes.error) setMenuItems(itemsRes.data);
    if (!catsRes.error) setCategories(catsRes.data);
    setLoading(false);
  }

  const prepTimeColumnName = menuItems?.[0] && Object.prototype.hasOwnProperty.call(menuItems[0], 'prep_time_minute')
    ? 'prep_time_minute'
    : 'prep_time_minutes';

  const categoryIdIsNumber = typeof categories?.[0]?.id === 'number';
  const coerceCategoryId = (raw) => {
    if (raw === '' || raw == null) return null;
    return categoryIdIsNumber ? Number(raw) : raw;
  };

  const openDrawer = (item = null) => {
    setSaveState({ saving: false, error: '', ok: false });
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name ?? '',
        description: item.description ?? '',
        price: item.price != null ? String(item.price) : '',
        category_id: item.category_id ?? '',
        image_url: item.image_url ?? '',
        is_available: item.is_available ?? true,
        prep_time_minutes: String(
          item?.prep_time_minutes ??
          item?.prep_time_minute ??
          0
        )
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_available: true,
        prep_time_minutes: '0'
      });
    }
    setIsSidebarOpen(true);
  };

  const handleSave = async () => {
    if (saveState.saving) return;
    setSaveState({ saving: true, error: '', ok: false });

    const priceNumber = Number(formData.price);
    if (!formData.name.trim()) {
      setSaveState({ saving: false, error: 'Name is required.', ok: false });
      return;
    }
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setSaveState({ saving: false, error: 'Price must be a valid number.', ok: false });
      return;
    }

    const prepTimeInt = Math.trunc(Number(formData.prep_time_minutes));
    if (!Number.isFinite(prepTimeInt) || prepTimeInt < 0) {
      setSaveState({ saving: false, error: 'Prep time must be a valid non-negative number.', ok: false });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      price: priceNumber,
      category_id: coerceCategoryId(formData.category_id),
      image_url: formData.image_url?.trim() || null,
      is_available: Boolean(formData.is_available),
      [prepTimeColumnName]: prepTimeInt,
      restaurant_id: restaurant.id
    };

    const { error } = editingItem
      ? await supabase.from('MENU_ITEM').update(payload).eq('id', editingItem.id)
      : await supabase.from('MENU_ITEM').insert(payload);

    if (error) {
      setSaveState({ saving: false, error: error.message || 'Failed to save entry.', ok: false });
      return;
    }

    await fetchData();
    setSaveState({ saving: false, error: '', ok: true });
    setIsSidebarOpen(false);
  };

  const handleDelete = async () => {
    if (!editingItem?.id) return;
    setSaveState({ saving: true, error: '', ok: false });
    const { error } = await supabase.from('MENU_ITEM').delete().eq('id', editingItem.id);
    if (error) {
      setSaveState({ saving: false, error: error.message || 'Failed to delete entry.', ok: false });
      return;
    }
    await fetchData();
    setSaveState({ saving: false, error: '', ok: true });
    setIsDeleteConfirmOpen(false);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a]">
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">Inventory</h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{restaurant?.name}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-xs border-none focus:ring-2 focus:ring-black/5 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => openDrawer()}
              className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus size={14} /> New Entry
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="sm:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search catalog..."
              className="w-full pl-9 pr-4 py-3 bg-white rounded-2xl text-sm border border-gray-100 focus:ring-2 focus:ring-black/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading && (
          <div className="text-sm text-gray-500">Loading menu…</div>
        )}

        {!loading && categories.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-8">
            <div className="text-lg font-black uppercase tracking-tighter">No categories yet</div>
            <div className="text-sm text-gray-500 mt-2">Create a category first so you can file menu items under it.</div>
          </div>
        )}

        {categories.map(category => {
          const items = menuItems.filter(i => String(i.category_id) === String(category.id) && i.name.toLowerCase().includes(searchQuery.toLowerCase()));
          if (items.length === 0 && searchQuery) return null;

          return (
            <section key={category.id} className="mb-12">
              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="text-3xl font-black tracking-tighter italic">{category.name}</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase">{items.length} Items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-3xl overflow-hidden">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => openDrawer(item)}
                    className="bg-white p-6 hover:bg-gray-50 cursor-pointer transition-colors group relative"
                  >
                    <div className="aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-50">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={40} /></div>
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-black text-sm uppercase leading-tight">{item.name}</h3>
                      <span className="text-xs font-bold text-gray-400">₱{item.price}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit Detail <ChevronRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* --- SIDEBAR DRAWER (The "New Style" Form) --- */}
      <div className={`fixed inset-0 z-50 transition-visibility ${isSidebarOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                <div className="text-[11px] text-gray-500 mt-1">Changes save directly to your menu.</div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto pr-2">
              {saveState.error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">
                  {saveState.error}
                </div>
              )}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Full Nomenclature</label>
                <input 
                  className="w-full border-b-2 border-gray-100 focus:border-black py-2 text-lg font-bold outline-none transition-colors bg-transparent"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. TRUFFLE BUTTER RIGATONI"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Valuation (₱)</label>
                  <input 
                    type="number" className="w-full border-b-2 border-gray-100 focus:border-black py-2 text-lg font-bold outline-none bg-transparent"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Category</label>
                  <select 
                    className="w-full border-b-2 border-gray-100 focus:border-black py-2 text-sm font-bold outline-none bg-transparent"
                    value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Prep time (minutes)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full border-b-2 border-gray-100 focus:border-black py-2 text-lg font-bold outline-none bg-transparent"
                  value={formData.prep_time_minutes}
                  onChange={e => setFormData({ ...formData, prep_time_minutes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Availability</label>
                  <div className="text-sm font-bold">{formData.is_available ? 'Available' : 'Hidden'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
                  className={`w-14 h-8 rounded-full transition-colors relative ${formData.is_available ? 'bg-black' : 'bg-gray-200'}`}
                  aria-label="Toggle availability"
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${formData.is_available ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Editorial Notes</label>
                <textarea 
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-black min-h-[120px] bg-transparent"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Briefly describe the culinary profile..."
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Image Assets (URL)</label>
                <input 
                  className="w-full border-b-2 border-gray-100 focus:border-black py-2 text-xs font-medium outline-none bg-transparent"
                  value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 mt-auto flex gap-4">
              {editingItem && (
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={saveState.saving}
                  className="w-12 h-12 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center disabled:opacity-50"
                  aria-label="Delete item"
                  title="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button 
                onClick={handleSave}
                disabled={saveState.saving}
                className="flex-1 bg-black text-white py-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saveState.saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {saveState.saving ? 'Saving…' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- DELETE CONFIRM MODAL --- */}
      <div className={`fixed inset-0 z-[60] ${isDeleteConfirmOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${isDeleteConfirmOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => !saveState.saving && setIsDeleteConfirmOpen(false)}
        />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Confirm delete"
            className={`w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-200 ${isDeleteConfirmOpen ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'}`}
          >
            <div className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Confirm deletion</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mt-2">Delete item?</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    This will permanently remove{' '}
                    <span className="font-bold text-gray-800">“{editingItem?.name || 'this item'}”</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !saveState.saving && setIsDeleteConfirmOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  disabled={saveState.saving}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="px-7 pb-7 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={saveState.saving}
                className="flex-1 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saveState.saving}
                className="flex-1 py-3 rounded-full bg-black text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saveState.saving ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                {saveState.saving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenuPage;