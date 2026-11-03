import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  Filter,
  Flame,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import {
  PoojaItem,
  PoojaCategory,
  SelectedItem,
  PoojaDetailsFormData,
} from '../types/index.js';
import { PoojaDetailsModal } from '../components/pooja/PoojaDetailsModal.js';
import { PdfViewerModal } from '../components/pooja/PdfViewerModal.js';
import { useToast } from '../components/common/Toast.js';

export const PoojaItemsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [items, setItems] = useState<PoojaItem[]>([]);
  const [categories, setCategories] = useState<PoojaCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Selection Map: Key is item id, value is SelectedItem object (persisted across filters & searches)
  const [selectedMap, setSelectedMap] = useState<Map<string, SelectedItem>>(new Map());

  // Custom Item Modal State
  const [isAddCustomOpen, setIsAddCustomOpen] = useState<boolean>(false);
  const [customEn, setCustomEn] = useState<string>('');
  const [customKn, setCustomKn] = useState<string>('');
  const [customQty, setCustomQty] = useState<string>('');

  // PDF Modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [poojaDetails, setPoojaDetails] = useState<PoojaDetailsFormData | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, itemList] = await Promise.all([
          api.getCategories(),
          api.getPoojaItems(),
        ]);
        setCategories(cats);
        setItems(itemList);

        // Pre-select first 12 common items by default so user has an instant starting list!
        const initialMap = new Map<string, SelectedItem>();
        itemList.slice(0, 10).forEach((item) => {
          initialMap.set(item.id, {
            item,
            quantity: item.defaultQuantity || '',
          });
        });
        setSelectedMap(initialMap);
      } catch (err: any) {
        console.error('Failed to load items:', err);
        showToast(err.message || 'Failed to load pooja items', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered Items (by Category and Bilingual Search)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategoryId === 'all' || item.categoryId === selectedCategoryId;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nameEnglish.toLowerCase().includes(q) ||
        item.nameKannada.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategoryId, searchQuery]);

  // Toggle individual item selection
  const handleToggleItem = (item: PoojaItem) => {
    const newMap = new Map(selectedMap);
    if (newMap.has(item.id)) {
      newMap.delete(item.id);
    } else {
      newMap.set(item.id, {
        item,
        quantity: item.defaultQuantity || '',
      });
    }
    setSelectedMap(newMap);
  };

  // Update item quantity
  const handleQuantityChange = (itemId: string, quantity: string) => {
    const newMap = new Map(selectedMap);
    const existing = newMap.get(itemId);
    if (existing) {
      newMap.set(itemId, {
        ...existing,
        quantity,
      });
      setSelectedMap(newMap);
    }
  };

  // Select All currently filtered items
  const handleSelectAllFiltered = () => {
    const newMap = new Map(selectedMap);
    filteredItems.forEach((item) => {
      if (!newMap.has(item.id)) {
        newMap.set(item.id, {
          item,
          quantity: item.defaultQuantity || '',
        });
      }
    });
    setSelectedMap(newMap);
    showToast(`Selected all ${filteredItems.length} items in current view`, 'info');
  };

  // Deselect All currently filtered items
  const handleDeselectAllFiltered = () => {
    const newMap = new Map(selectedMap);
    filteredItems.forEach((item) => {
      newMap.delete(item.id);
    });
    setSelectedMap(newMap);
  };

  // Clear Entire Selection
  const handleClearAll = () => {
    setSelectedMap(new Map());
    showToast('Selection cleared', 'info');
  };

  // Add Custom Item (English + Kannada + Quantity)
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEn.trim() || !customKn.trim()) {
      showToast('Both English and Kannada names are required for custom items', 'error');
      return;
    }

    const customId = `custom-${Date.now()}`;
    const customItem: PoojaItem = {
      id: customId,
      nameEnglish: customEn.trim(),
      nameKannada: customKn.trim(),
      categoryId: selectedCategoryId !== 'all' ? selectedCategoryId : (categories[0]?.id || 'custom'),
      defaultQuantity: customQty.trim(),
      isActive: true,
      isCustom: true,
    };

    // Prepend to items list
    setItems((prev) => [customItem, ...prev]);

    // Add to selected items map
    const newMap = new Map(selectedMap);
    newMap.set(customId, {
      item: customItem,
      quantity: customQty.trim(),
    });
    setSelectedMap(newMap);

    // Reset & close
    setCustomEn('');
    setCustomKn('');
    setCustomQty('');
    setIsAddCustomOpen(false);
    showToast('Custom item added and selected!', 'success');
  };

  // Trigger PDF Generation Flow
  const handleStartPdfFlow = () => {
    if (selectedMap.size === 0) {
      showToast(t('no_items_selected_warning'), 'error');
      return;
    }
    setIsDetailsModalOpen(true);
  };

  // When Pooja Details are submitted, save to DB and open PDF viewer
  const handleDetailsSubmit = async (formData: PoojaDetailsFormData) => {
    setPoojaDetails(formData);
    setIsDetailsModalOpen(false);
    setIsPdfViewerOpen(true);

    // Persist pooja request record to database
    try {
      const selectedList = Array.from(selectedMap.values());
      await api.savePoojaRequest({
        ...formData,
        items: selectedList.map((s) => ({
          poojaItemId: s.item.isCustom ? null : s.item.id,
          nameEnglish: s.item.nameEnglish,
          nameKannada: s.item.nameKannada,
          quantity: s.quantity || s.item.defaultQuantity,
        })),
      });
    } catch (err) {
      console.warn('Could not persist pooja request snapshot:', err);
    }
  };

  const selectedCount = selectedMap.size;
  const selectedList = Array.from(selectedMap.values());

  return (
    <div className="min-h-screen bg-spiritual-cream py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron-700 to-spiritual-maroon rounded-3xl p-6 sm:p-10 text-white shadow-spiritual-lg border-2 border-spiritual-gold/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-spiritual-gold-light border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bilingual Checklist Generator (English & ಕನ್ನಡ)</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-4xl tracking-wide">
              {t('samagri_title')}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {t('samagri_subtitle')}
            </p>
          </div>

          <div className="absolute right-4 -bottom-8 opacity-15 pointer-events-none w-56 h-56">
            <img src="/logo.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Action Toolbar & Filters */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-spiritual-gold/30 shadow-sm space-y-4">
          {/* Row 1: Search Bar & Add Custom Item Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full min-h-[44px] pl-11 pr-10 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 text-sm bg-neutral-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsAddCustomOpen(true)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-spiritual-gold/60 text-spiritual-maroon bg-spiritual-gold/15 hover:bg-spiritual-gold/30 font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 flex-shrink-0 active:scale-98"
            >
              <Plus className="w-4 h-4 text-spiritual-saffron" />
              <span>{t('btn_add_custom_item')}</span>
            </button>
          </div>

          {/* Row 2: Category Filter Tabs (Horizontal Scrollable Chips) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center ${
                selectedCategoryId === 'all'
                  ? 'bg-spiritual-maroon text-white shadow-sm'
                  : 'bg-spiritual-cream-100 text-neutral-700 hover:bg-spiritual-cream-200'
              }`}
            >
              {t('category_all')} ({items.length})
            </button>

            {categories.map((cat) => {
              const count = items.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center ${
                    selectedCategoryId === cat.id
                      ? 'bg-spiritual-maroon text-white shadow-sm'
                      : 'bg-spiritual-cream-100 text-neutral-700 hover:bg-spiritual-cream-200'
                  }`}
                >
                  {language === 'kn' ? cat.nameKannada : cat.nameEnglish} ({count})
                </button>
              );
            })}
          </div>

          {/* Row 3: Selection Controls & Sticky Counter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <button
                onClick={handleSelectAllFiltered}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition font-medium active:scale-95"
              >
                {t('btn_select_all')} ({filteredItems.length})
              </button>

              <button
                onClick={handleDeselectAllFiltered}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition font-medium active:scale-95"
              >
                {t('btn_deselect_all')}
              </button>

              {selectedCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition font-medium flex items-center gap-1 active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('btn_clear_selection')}</span>
                </button>
              )}
            </div>

            {/* Selected Count & Generate PDF Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-xs font-bold text-spiritual-maroon">
                <Flame className="w-3.5 h-3.5 text-spiritual-saffron" />
                <span>
                  {selectedCount} {t('selected_items_count')}
                </span>
              </div>

              <button
                onClick={handleStartPdfFlow}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-spiritual hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-light transition flex items-center gap-2 active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>{t('btn_generate_pdf')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pooja Items Display Area */}
        {loading ? (
          <div className="py-20 text-center">
            <Flame className="w-10 h-10 text-spiritual-saffron animate-bounce mx-auto mb-3" />
            <p className="text-spiritual-maroon font-serif font-medium">Loading Sacred Samagri...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-spiritual-gold/30">
            <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-700 font-semibold">{t('no_items_found')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="mt-3 text-xs text-spiritual-saffron font-bold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedMap.has(item.id);
              const selectedItem = selectedMap.get(item.id);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 transition-all duration-200 border-2 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-spiritual-cream-50/80 border-spiritual-saffron shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-spiritual-gold/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleItem(item)}
                      className="mt-0.5 flex-shrink-0 text-spiritual-saffron focus:outline-none"
                    >
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-md bg-spiritual-saffron flex items-center justify-center text-white shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-neutral-300 hover:border-spiritual-saffron transition" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => handleToggleItem(item)}>
                      <h4 className="font-semibold text-sm text-neutral-900 truncate">
                        {item.nameEnglish}
                      </h4>
                      <h5 className="font-kannada font-bold text-sm text-spiritual-maroon truncate">
                        {item.nameKannada}
                      </h5>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        {item.category?.nameEnglish || 'Samagri'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Field (Visible / Active when selected) */}
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <label className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
                      Quantity:
                    </label>
                    <input
                      type="text"
                      disabled={!isSelected}
                      value={isSelected ? selectedItem?.quantity || '' : item.defaultQuantity || ''}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      placeholder={item.defaultQuantity || 'e.g. 100g / 2 pcs'}
                      className={`text-xs px-2.5 py-1 rounded-lg border text-right font-medium transition ${
                        isSelected
                          ? 'border-spiritual-gold/60 bg-white text-neutral-800 focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron'
                          : 'border-transparent bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Bottom Sticky Bar when items are selected */}
        {selectedCount > 0 && (
          <div className="sticky bottom-6 z-30 bg-spiritual-maroon/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-spiritual-gold/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-spiritual-saffron flex items-center justify-center text-white font-bold">
                {selectedCount}
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-spiritual-gold-light">
                  {selectedCount} {t('selected_items_count')}
                </p>
                <p className="text-xs text-white/80">
                  Ready to compile into printable bilingual PDF document
                </p>
              </div>
            </div>

            <button
              onClick={handleStartPdfFlow}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spiritual-gold to-spiritual-saffron text-spiritual-maroon-dark font-black text-xs sm:text-sm shadow-md hover:brightness-105 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('btn_generate_pdf')}</span>
            </button>
          </div>
        )}

        {/* Modal: Add Custom Item */}
        {isAddCustomOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-spiritual-gold/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-serif font-bold text-base text-spiritual-maroon">
                  {t('custom_item_title')}
                </h3>
                <button
                  onClick={() => setIsAddCustomOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomItem} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t('custom_item_en')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Copper Plate / White Cloth"
                    value={customEn}
                    onChange={(e) => setCustomEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t('custom_item_kn')} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ತಾಮ್ರದ ತಟ್ಟೆ / ಬಿಳಿ ವಸ್ತ್ರ"
                    value={customKn}
                    onChange={(e) => setCustomKn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron font-kannada"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t('custom_item_qty')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 pc / 250g"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCustomOpen(false)}
                    className="px-4 py-2 rounded-xl border text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
                  >
                    {t('btn_cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-spiritual-saffron text-white text-xs font-bold hover:bg-spiritual-maroon transition"
                  >
                    {t('custom_item_add_btn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Pooja Details Form */}
        <PoojaDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onSubmit={handleDetailsSubmit}
          selectedItems={selectedList}
        />

        {/* Modal: PDF Viewer & Sharing */}
        {poojaDetails && (
          <PdfViewerModal
            isOpen={isPdfViewerOpen}
            onClose={() => setIsPdfViewerOpen(false)}
            onReset={() => {
              setIsPdfViewerOpen(false);
              setIsDetailsModalOpen(true);
            }}
            details={poojaDetails}
            selectedItems={selectedList}
          />
        )}

        {/* Mobile Floating Sticky PDF Action Bar */}
        {selectedCount > 0 && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t-2 border-spiritual-gold/50 shadow-2xl z-30 flex items-center justify-between gap-3 animate-slideUp">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-xs font-bold text-spiritual-maroon flex-shrink-0">
              <Flame className="w-3.5 h-3.5 text-spiritual-saffron" />
              <span>{selectedCount} {t('selected_items_count')}</span>
            </div>
            <button
              onClick={handleStartPdfFlow}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{t('btn_generate_pdf')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

