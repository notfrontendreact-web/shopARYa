import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, ShoppingCart, Heart, Bot, Sun, Moon, Menu as MenuIcon, X, 
  ChevronDown, Phone, ShieldCheck, Sparkles, SlidersHorizontal, ArrowLeft, Check
} from 'lucide-react';
import { MAIN_MENUS } from '../data/menu';
import { IconRenderer } from './IconRenderer';
import { Product, CartItem } from '../types';
import { formatToman } from '../lib/formatters';

interface HeaderProps {
  products: Product[];
  cartItems: CartItem[];
  wishlistIds: string[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onSelectCategory: (categorySlug: string | null, subcategorySlug?: string | null) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIAssistant: () => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  products,
  cartItems,
  wishlistIds,
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenAIAssistant,
  onSelectProduct,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-600 dark:bg-emerald-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/80 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
              پیشنهاد ویژه
            </span>
            <span>🚀 ارسال سریع و رایگان خریدهای بالای ۲ میلیون تومان | کد تخفیف ۱۰٪: <strong className="font-mono underline">ARYA10</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-100 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ضمانت ۱۰۰٪ اصالت کالا
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> پشتیبانی: ۰۲۱-۸۸۹۹۰۰۱۱
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="باز کردن منو"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

            <button
              onClick={() => onSelectCategory(null, null)}
              className="flex items-center gap-2.5 text-right group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-l from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  فروشگاه آریا
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-widest font-semibold">
                  ARYA MODERN STORE
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar with Live Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="جستجو میان کالای دیجیتال، پوشاک، لوازم خانگی و..."
                className="w-full bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 pl-10 pr-11 py-2.5 rounded-2xl text-sm border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="p-2 text-xs font-bold text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
                  نتایج پیشنهادی:
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        setIsSearchFocused(false);
                      }}
                      className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-right"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {product.title}
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                          {formatToman(product.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: AI Advisor, Theme Toggle, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Advisor Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition group"
              title="مشاور هوشمند خریدار (پاسخگویی با Gemini AI)"
            >
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">مشاور AI</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="تغییر تم"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 dark:bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-mono">
                {cartTotal > 0 ? formatToman(cartTotal) : 'سبد خرید'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 pr-10 pl-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 6 MAIN MENUS & DROPDOWN SUBMENUS NAVBAR (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 py-1">
            
            {/* All Products button */}
            <li>
              <button
                onClick={() => onSelectCategory(null, null)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === null
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <span>همه محصولات</span>
              </button>
            </li>

            {/* Render 6 Main Menus */}
            {MAIN_MENUS.map((menu) => {
              const isSelected = selectedCategory === menu.slug;
              const isHovered = activeHoverMenu === menu.id;

              return (
                <li
                  key={menu.id}
                  className="relative group"
                  onMouseEnter={() => setActiveHoverMenu(menu.id)}
                  onMouseLeave={() => setActiveHoverMenu(null)}
                >
                  <button
                    onClick={() => onSelectCategory(menu.slug, null)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconRenderer name={menu.icon} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{menu.title}</span>
                    {menu.badge && (
                      <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                        {menu.badge}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {isHovered && (
                    <div className="absolute top-full right-0 mt-1 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700/60">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <IconRenderer name={menu.icon} className="w-4 h-4 text-emerald-500" />
                          دسته‌بندی {menu.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{menu.submenus.length} زیرمنو</span>
                      </div>

                      <div className="space-y-1">
                        {menu.submenus.map((sub) => {
                          const isSubSelected = selectedCategory === menu.slug && selectedSubcategory === sub.slug;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onSelectCategory(menu.slug, sub.slug);
                                setActiveHoverMenu(null);
                              }}
                              className={`w-full text-right p-2 rounded-xl flex items-start gap-2.5 transition group/sub ${
                                isSubSelected
                                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover/sub:bg-emerald-600 group-hover/sub:text-white transition">
                                <IconRenderer name={sub.icon || 'Tag'} className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover/sub:text-emerald-600 dark:group-hover/sub:text-emerald-400">
                                    {sub.title}
                                  </span>
                                  {sub.isPopular && (
                                    <span className="text-[9px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                                      محبوب
                                    </span>
                                  )}
                                </div>
                                {sub.description && (
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-left">
                        <button
                          onClick={() => {
                            onSelectCategory(menu.slug, null);
                            setActiveHoverMenu(null);
                          }}
                          className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                        >
                          مشاهده همه {menu.title}
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* MOBILE NAV DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-black text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> منوی اصلی فروشگاه
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* All products button */}
              <button
                onClick={() => {
                  onSelectCategory(null, null);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-right p-2.5 rounded-xl text-xs font-bold mb-2 flex items-center gap-2 ${
                  selectedCategory === null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>همه محصولات</span>
              </button>

              {/* 6 Menus Accordion */}
              <div className="space-y-1">
                {MAIN_MENUS.map((menu) => {
                  const isExpanded = expandedMobileMenu === menu.id;
                  return (
                    <div key={menu.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedMobileMenu(isExpanded ? null : menu.id)}
                        className="w-full text-right p-3 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                      >
                        <span className="flex items-center gap-2">
                          <IconRenderer name={menu.icon} className="w-4 h-4 text-emerald-500" />
                          {menu.title}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-2 space-y-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              onSelectCategory(menu.slug, null);
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full text-right px-2 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                          >
                            مشاهده تمام کالا‌های {menu.title}
                          </button>
                          {menu.submenus.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                onSelectCategory(menu.slug, sub.slug);
                                setIsMobileMenuOpen(false);
                              }}
                              className="w-full text-right px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                            >
                              <IconRenderer name={sub.icon || 'Tag'} className="w-3.5 h-3.5 text-slate-400" />
                              {sub.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom info in mobile drawer */}
            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">فروشگاه آنلاین آریا</p>
              <p>پشتیبانی: ۰۲۱-۸۸۹۹۰۰۱۱</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
