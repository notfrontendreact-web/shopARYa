import React, { useState } from 'react';
import { Heart, Eye, ShoppingCart, Star, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatToman, toPersianDigits } from '../lib/formatters';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Badges & Action Buttons */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900/50">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center">
            <Sparkles className="w-8 h-8 mb-2 text-emerald-500" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{product.brand}</span>
            <span className="text-[10px] mt-1 line-clamp-2">{product.title}</span>
          </div>
        )}

        {/* Discount & Special Badges */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm font-mono">
              ٪{toPersianDigits(product.discountPercent)} تخفیف
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
              جدید
            </span>
          )}
        </div>

        {/* Wishlist & Quick view icons */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition shadow-md ${
              isInWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white'
            }`}
            aria-label="افزودن به علاقه مندی"
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white rounded-xl backdrop-blur-md transition shadow-md"
            aria-label="مشاهده سریع"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{toPersianDigits(product.rating)}</span>
              <span className="text-slate-400 text-[10px]">({toPersianDigits(product.reviewCount)})</span>
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] text-slate-400 line-through font-mono">
                {formatToman(product.originalPrice)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-emerald-400 font-mono">
              {formatToman(product.price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600'
            }`}
            aria-label="افزودن به سبد"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-[11px]">افزوده شد</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">خرید</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
