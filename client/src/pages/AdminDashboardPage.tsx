import React, { useEffect, useState } from 'react';
import {
  Shield,
  Layers,
  Image as ImageIcon,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Save,
  FileText,
  Flame,
  Upload,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import {
  PoojaItem,
  PoojaCategory,
  GalleryImage,
  WebsiteSettings,
} from '../types/index.js';
import { useToast } from '../components/common/Toast.js';
import { AdminHoroscopeManagement } from '../components/admin/AdminHoroscopeManagement.js';
import { AdminMarriageManagement } from '../components/admin/AdminMarriageManagement.js';
import { AdminMuhurtaManagement } from '../components/admin/AdminMuhurtaManagement.js';
import { Heart, Sparkles } from 'lucide-react';

type ActiveTab =
  | 'items'
  | 'categories'
  | 'gallery'
  | 'horoscopes'
  | 'marriage'
  | 'muhurta'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('items');

  // Data states
  const [items, setItems] = useState<PoojaItem[]>([]);
  const [categories, setCategories] = useState<PoojaCategory[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Search & filter in Admin items
  const [itemSearch, setItemSearch] = useState<string>('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('all');

  // Item Modal (Add / Edit)
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PoojaItem | null>(null);
  const [itemForm, setItemForm] = useState({
    nameEnglish: '',
    nameKannada: '',
    categoryId: '',
    defaultQuantity: '',
    isActive: true,
  });

  // Category Modal (Add / Edit)
  const [isCatModalOpen, setIsCatModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<PoojaCategory | null>(null);
  const [catForm, setCatForm] = useState({
    nameEnglish: '',
    nameKannada: '',
  });

  // Gallery Modal (Add)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: '',
    captionEnglish: '',
    captionKannada: '',
    category: 'Pooja Ceremonies',
  });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  // Load all admin data
  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, itemsList, galleryList, sets] = await Promise.all([
        api.getCategories(),
        api.getPoojaItems(),
        api.getGallery(),
        api.getSettings(),
      ]);
      setCategories(cats);
      setItems(itemsList);
      setGalleryImages(galleryList);
      setSettings(sets);
    } catch (error: any) {
      showToast(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered items in admin table
  const filteredItems = items.filter((i) => {
    const matchesCat =
      itemCategoryFilter === 'all' || i.categoryId === itemCategoryFilter;
    const q = itemSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      i.nameEnglish.toLowerCase().includes(q) ||
      i.nameKannada.includes(q);
    return matchesCat && matchesSearch;
  });

  // --- ITEM ACTIONS ---
  const handleOpenItemModal = (item?: PoojaItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        nameEnglish: item.nameEnglish,
        nameKannada: item.nameKannada,
        categoryId: item.categoryId,
        defaultQuantity: item.defaultQuantity || '',
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        nameEnglish: '',
        nameKannada: '',
        categoryId: categories[0]?.id || '',
        defaultQuantity: '',
        isActive: true,
      });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await api.updatePoojaItem(editingItem.id, itemForm);
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...updated } : i))
        );
        showToast('Pooja item updated successfully!', 'success');
      } else {
        const created = await api.createPoojaItem(itemForm);
        setItems((prev) => [created, ...prev]);
        showToast('Pooja item created successfully!', 'success');
      }
      setIsItemModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'Failed to save item', 'error');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deletePoojaItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Item deleted successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
    }
  };

  const handleToggleItemActive = async (item: PoojaItem) => {
    try {
      const updated = await api.updatePoojaItem(item.id, {
        isActive: !item.isActive,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: updated.isActive } : i))
      );
      showToast(`Item ${updated.isActive ? 'enabled' : 'disabled'}`, 'info');
    } catch (error: any) {
      showToast('Failed to toggle status', 'error');
    }
  };

  // --- CATEGORY ACTIONS ---
  const handleOpenCatModal = (cat?: PoojaCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setCatForm({
        nameEnglish: cat.nameEnglish,
        nameKannada: cat.nameKannada,
      });
    } else {
      setEditingCategory(null);
      setCatForm({
        nameEnglish: '',
        nameKannada: '',
      });
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const updated = await api.updateCategory(editingCategory.id, catForm);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c))
        );
        showToast('Category updated!', 'success');
      } else {
        const created = await api.createCategory(catForm);
        setCategories((prev) => [...prev, created]);
        showToast('Category created!', 'success');
      }
      setIsCatModalOpen(false);
    } catch (error: any) {
      showToast(error.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Associated items will also be deleted.`)) return;
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Category deleted', 'success');
      // Reload items to reflect cascade delete
      api.getPoojaItems().then(setItems);
    } catch (error: any) {
      showToast('Failed to delete category', 'error');
    }
  };

  // --- GALLERY ACTIONS ---
  const handleSaveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (galleryFile) {
        const formData = new FormData();
        formData.append('image', galleryFile);
        formData.append('captionEnglish', galleryForm.captionEnglish);
        formData.append('captionKannada', galleryForm.captionKannada);
        formData.append('category', galleryForm.category);
        const created = await api.uploadGalleryFile(formData);
        setGalleryImages((prev) => [created, ...prev]);
      } else {
        if (!galleryForm.imageUrl) {
          showToast('Image URL or file is required', 'error');
          return;
        }
        const created = await api.createGalleryImage(galleryForm);
        setGalleryImages((prev) => [created, ...prev]);
      }
      showToast('Gallery image added successfully!', 'success');
      setIsGalleryModalOpen(false);
      setGalleryFile(null);
      setGalleryForm({
        imageUrl: '',
        captionEnglish: '',
        captionKannada: '',
        category: 'Pooja Ceremonies',
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to add image', 'error');
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!window.confirm('Delete this gallery photograph?')) return;
    try {
      await api.deleteGalleryImage(id);
      setGalleryImages((prev) => prev.filter((g) => g.id !== id));
      showToast('Gallery image deleted', 'success');
    } catch (error: any) {
      showToast('Failed to delete image', 'error');
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      showToast('Website settings updated successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to update settings', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-spiritual-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron-700 to-spiritual-maroon rounded-2xl p-6 text-white shadow-spiritual-lg border border-spiritual-gold/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-2 flex items-center justify-center border border-spiritual-gold">
              <Shield className="w-6 h-6 text-spiritual-gold-light" />
            </div>
            <div>
              <h1 className="font-serif font-black text-2xl text-white">
                {t('admin_title')}
              </h1>
              <p className="text-xs text-spiritual-cream-200">
                Pooja Services Content & Samagri Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-spiritual-gold-light font-medium">
              Admin Session Active
            </span>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-spiritual-gold/30 shadow-sm">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Total Pooja Items</span>
            <p className="font-serif font-black text-3xl text-spiritual-maroon mt-1">{items.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-spiritual-gold/30 shadow-sm">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Categories</span>
            <p className="font-serif font-black text-3xl text-spiritual-saffron mt-1">{categories.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-spiritual-gold/30 shadow-sm">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Gallery Images</span>
            <p className="font-serif font-black text-3xl text-neutral-800 mt-1">{galleryImages.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-spiritual-gold/30 shadow-sm">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Active Items</span>
            <p className="font-serif font-black text-3xl text-emerald-600 mt-1">
              {items.filter((i) => i.isActive).length}
            </p>
          </div>
        </div>

        {/* Tab Navigation (Scrollable chips on mobile) */}
        <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('items')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'items'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('admin_tab_items')}</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'categories'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('admin_tab_categories')}</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'gallery'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('admin_tab_gallery')}</span>
          </button>

          <button
            onClick={() => setActiveTab('horoscopes')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'horoscopes'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <Flame className="w-4 h-4 text-spiritual-gold-light" />
            <span>{t('admin_tab_horoscopes')}</span>
          </button>

          <button
            onClick={() => setActiveTab('marriage')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'marriage'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>{language === 'kn' ? 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ' : 'Marriage Matching'}</span>
          </button>

          <button
            onClick={() => setActiveTab('muhurta')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'muhurta'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತ' : 'Shubha Muhurta'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`min-h-[42px] flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
              activeTab === 'settings'
                ? 'bg-spiritual-maroon text-white shadow'
                : 'text-neutral-700 hover:bg-white bg-neutral-100/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('admin_tab_settings')}</span>
          </button>
        </div>

        {/* TAB 1: POOJA ITEMS MANAGEMENT */}
        {activeTab === 'items' && (
          <div className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    placeholder="Search items by name..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm"
                  />
                </div>

                <select
                  value={itemCategoryFilter}
                  onChange={(e) => setItemCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEnglish}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => handleOpenItemModal()}
                className="px-4 py-2 bg-spiritual-saffron text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-spiritual-maroon transition flex items-center justify-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_item')}</span>
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-spiritual-cream-100 text-neutral-700 font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">English Name</th>
                    <th className="py-3 px-4 font-kannada">ಕನ್ನಡ ಹೆಸರು</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Default Quantity</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        {item.nameEnglish}
                      </td>
                      <td className="py-3 px-4 font-kannada text-spiritual-maroon font-semibold">
                        {item.nameKannada}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {item.category?.nameEnglish || '—'}
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        {item.defaultQuantity || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleItemActive(item)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenItemModal(item)}
                          className="p-1 text-neutral-500 hover:text-spiritual-maroon rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.nameEnglish)}
                          className="p-1 text-neutral-500 hover:text-rose-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-spiritual-maroon">
                Pooja Samagri Categories
              </h3>
              <button
                onClick={() => handleOpenCatModal()}
                className="px-4 py-2 bg-spiritual-saffron text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-spiritual-maroon transition flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_cat')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-spiritual-cream-50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-neutral-900 text-sm">
                      {cat.nameEnglish}
                    </h4>
                    <h5 className="font-kannada font-bold text-spiritual-maroon text-xs">
                      {cat.nameKannada}
                    </h5>
                    <span className="text-[10px] text-neutral-500 mt-1 inline-block">
                      {items.filter((i) => i.categoryId === cat.id).length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCatModal(cat)}
                      className="p-1.5 text-neutral-600 hover:text-spiritual-maroon rounded-lg hover:bg-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.nameEnglish)}
                      className="p-1.5 text-neutral-600 hover:text-rose-600 rounded-lg hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-spiritual-maroon">
                Gallery Photos & Captions
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="px-4 py-2 bg-spiritual-saffron text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-spiritual-maroon transition flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_image')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-video relative bg-neutral-100">
                    <img
                      src={img.imageUrl}
                      alt={img.captionEnglish}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {img.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-1">
                    <p className="text-xs font-semibold text-neutral-800 line-clamp-1">
                      {img.captionEnglish}
                    </p>
                    <p className="text-xs font-kannada font-bold text-spiritual-maroon line-clamp-1">
                      {img.captionKannada}
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end">
                    <button
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOROSCOPE MANAGEMENT */}
        {activeTab === 'horoscopes' && <AdminHoroscopeManagement />}

        {/* TAB 5: MARRIAGE MATCHING MANAGEMENT */}
        {activeTab === 'marriage' && <AdminMarriageManagement />}

        {/* TAB 6: SHUBHA MUHURTA MANAGEMENT */}
        {activeTab === 'muhurta' && <AdminMuhurtaManagement />}

        {/* TAB 7: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-spiritual-gold/30 shadow-sm max-w-2xl">
            <h3 className="font-serif font-bold text-lg text-spiritual-maroon mb-4">
              Website & Purohit Contact Settings
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Purohit Name (English)
                </label>
                <input
                  type="text"
                  value={settings.purohit_name || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, purohit_name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Purohit Name (Kannada)
                </label>
                <input
                  type="text"
                  value={settings.purohit_name_kannada || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, purohit_name_kannada: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-kannada"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={settings.purohit_phone || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, purohit_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Address (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.purohit_address || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, purohit_address: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Address (Kannada)
                </label>
                <textarea
                  rows={2}
                  value={settings.purohit_address_kannada || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      purohit_address_kannada: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-kannada"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={settings.google_maps_url || ''}
                  onChange={(e) =>
                    setSettings({ ...settings, google_maps_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-xs sm:text-sm rounded-xl shadow hover:shadow-spiritual transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ITEM ADD / EDIT */}
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-spiritual-gold/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-base text-spiritual-maroon">
                  {editingItem ? 'Edit Pooja Item' : 'Add New Pooja Item'}
                </h3>
                <button
                  onClick={() => setIsItemModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    English Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.nameEnglish}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, nameEnglish: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Kannada Name (ಕನ್ನಡ ಹೆಸರು) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.nameKannada}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, nameKannada: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    required
                    value={itemForm.categoryId}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameEnglish} ({c.nameKannada})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Default Quantity (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100g / 2 pcs"
                    value={itemForm.defaultQuantity}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, defaultQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-spiritual-saffron text-white text-xs font-bold hover:bg-spiritual-maroon transition"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CATEGORY ADD / EDIT */}
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-spiritual-gold/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-base text-spiritual-maroon">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category Name (English) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={catForm.nameEnglish}
                    onChange={(e) =>
                      setCatForm({ ...catForm, nameEnglish: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category Name (Kannada) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={catForm.nameKannada}
                    onChange={(e) =>
                      setCatForm({ ...catForm, nameKannada: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-kannada"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCatModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-spiritual-saffron text-white text-xs font-bold hover:bg-spiritual-maroon transition"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: GALLERY ADD */}
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-spiritual-gold/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-base text-spiritual-maroon">
                  Add Gallery Image
                </h3>
                <button
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGalleryImage} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Upload Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-spiritual-saffron-50 file:text-spiritual-saffron hover:file:bg-spiritual-saffron-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Or Image URL (Web Link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={galleryForm.imageUrl}
                    onChange={(e) =>
                      setGalleryForm({ ...galleryForm, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Caption (English) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryForm.captionEnglish}
                    onChange={(e) =>
                      setGalleryForm({
                        ...galleryForm,
                        captionEnglish: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Caption (Kannada) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryForm.captionKannada}
                    onChange={(e) =>
                      setGalleryForm({
                        ...galleryForm,
                        captionKannada: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) =>
                      setGalleryForm({ ...galleryForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm bg-white"
                  >
                    <option value="Pooja Ceremonies">Pooja Ceremonies</option>
                    <option value="Homam">Homam</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Traditional Rituals">Traditional Rituals</option>
                    <option value="Other Events">Other Events</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGalleryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-spiritual-saffron text-white text-xs font-bold hover:bg-spiritual-maroon transition"
                  >
                    Upload / Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

