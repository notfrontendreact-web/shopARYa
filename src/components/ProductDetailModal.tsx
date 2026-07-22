import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, ShieldCheck, Truck, Bot, Check, Sparkles, Share2 } from 'lucide-react';
import { Product } from '../types';
import { formatToman, toPersianDigits } from '../lib/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onAskAIAboutProduct: (productTitle: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onAskAIAboutProduct,
}) => {
  if (!product) return null;

  const [selectedImg, setSelectedImg] = useState<string>(product.imageUrl);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'desc'>('desc');
  const [added, setAdded] = useState<boolean>(false);

  const images = [product.imageUrl, ...(product.secondaryImages || [])];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
              {product.brand}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-sans font-semibold">
              {product.titleEn}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Gallery Left (RTL Right) */}
            <div className="md:col-span-6 space-y-3">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                <img
                  src={selectedImg}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                        selectedImg === img ? 'border-emerald-500 shadow-md' : 'border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Right (RTL Left) */}
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                {product.title}
              </h2>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{toPersianDigits(product.rating)}</span>
                  <span className="text-slate-400">({toPersianDigits(product.reviewCount)} دیدگاه)</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  موجود در انبار ({toPersianDigits(product.stock)} عدد)
                </span>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-mono block">
                      {formatToman(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-emerald-400 font-mono">
                    {formatToman(product.price * quantity)}
                  </span>
                </div>

                {product.discountPercent && (
                  <span className="bg-rose-500 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-xl">
                    ٪{toPersianDigits(product.discountPercent)} تخفیف
                  </span>
                )}
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {toPersianDigits(quantity)}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>به سبد خرید اضافه شد</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>افزودن به سبد خرید</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-3 rounded-xl border transition ${
                      isInWishlist
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                    aria-label="علاقه‌مندی"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* AI Inquiry button */}
                <button
                  onClick={() => {
                    onAskAIAboutProduct(product.title);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Bot className="w-4 h-4" />
                  <span>پرسش از مشاور هوشمند (AI) درباره این کالا</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> ضمانت اصالت فیزیکی
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-500" /> ارسال سریع سراسری
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description, Specs, Reviews */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 mb-4">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-2.5 text-xs font-extrabold border-b-2 transition ${
                  activeTab === 'desc'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                توضیحات و نقد
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 text-xs font-extrabold border-b-2 transition ${
                  activeTab === 'specs'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                مشخصات فنی
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-xs font-extrabold border-b-2 transition ${
                  activeTab === 'reviews'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                نظرات کاربران ({toPersianDigits(product.reviews?.length || 0)})
              </button>
            </div>

            {activeTab === 'desc' && (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === 'specs' && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2.5 grid grid-cols-3">
                    <span className="font-bold text-slate-500 dark:text-slate-400">{key}:</span>
                    <span className="col-span-2 font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>{rev.userName}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{toPersianDigits(rev.rating)}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block text-left">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">هنوز نظری برای این کالا ثبت نشده است.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
