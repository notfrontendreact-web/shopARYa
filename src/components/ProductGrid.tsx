import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Check, RefreshCw, Layers } from 'lucide-react';
import { Product, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { MAIN_MENUS } from '../data/menu';

interface ProductGridProps {
  products: Product[];
  wishlistIds: string[];
  filterState: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlistIds,
  filterState,
  onFilterChange,
  onResetFilters,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const activeCategory = MAIN_MENUS.find((m) => m.slug === filterState.selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            {activeCategory ? activeCategory.title : 'تمام محصولات فروشگاه آریا'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {products.length} کالا یافت شد
            {filterState.selectedSubcategory && ` در زیرمنوی ${filterState.selectedSubcategory}`}
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span>فیلترها</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">مرتب‌سازی:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none font-bold text-xs cursor-pointer"
            >
              <option value="featured">پیش‌فرض (محبوب‌ترین)</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بالاترین امتیاز</option>
              <option value="newest">جدیدترین</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filter Panel (Desktop & Mobile Drawer) */}
        <div className={`lg:block ${showMobileFilter ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> فیلتر پیشرفته
              </span>
              <button
                onClick={onResetFilters}
                className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 font-bold"
              >
                <RefreshCw className="w-3 h-3" /> حذف فیلترها
              </button>
            </div>

            {/* Subcategories checklist */}
            {activeCategory && activeCategory.submenus.length > 0 && (
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-2.5">
                  زیرمنوهای {activeCategory.title}
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => onFilterChange({ selectedSubcategory: null })}
                    className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      filterState.selectedSubcategory === null
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>همه موارد {activeCategory.title}</span>
                    {filterState.selectedSubcategory === null && <Check className="w-3.5 h-3.5" />}
                  </button>

                  {activeCategory.submenus.map((sub) => {
                    const isSelected = filterState.selectedSubcategory === sub.slug;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => onFilterChange({ selectedSubcategory: sub.slug })}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <span>{sub.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* In stock and Discount Toggles */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <span>فقط کالاهای موجود در انبار</span>
                <input
                  type="checkbox"
                  checked={filterState.onlyInStock}
                  onChange={(e) => onFilterChange({ onlyInStock: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                <span>فقط کالاهای تخفیف‌دار</span>
                <input
                  type="checkbox"
                  checked={filterState.onlyDiscounted}
                  onChange={(e) => onFilterChange({ onlyDiscounted: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid Items */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                هیچ محصولی با فیلترهای انتخابی شما یافت نشد
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                لطفاً عبارات دیگری برای جستجو وارد کرده یا فیلترهای اعمال شده را بازنشانی کنید.
              </p>
              <button
                onClick={onResetFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md"
              >
                بازنشانی تمام فیلترها
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
