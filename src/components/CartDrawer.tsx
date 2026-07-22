import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, Tag, Check, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { formatToman, toPersianDigits } from '../lib/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedDiscountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 65000;
  const finalTotal = subtotal - discountAmount + shippingFee;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'ARYA10') {
      setDiscountPercent(10);
      setCouponMessage('کد تخفیف ۱۰٪ با موفقیت اعمال شد 🎉');
    } else {
      setCouponMessage('کد تخفیف نامعتبر است (کد پیشنهادی: ARYA10)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-start">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
        
        {/* Top Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-slate-100 text-base">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>سبد خرید شما ({toPersianDigits(cartItems.length)} کالا)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {item.product.title}
                  </h4>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatToman(item.product.price)}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold">{toPersianDigits(item.quantity)}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">سبد خرید شما خالی است</p>
              <button
                onClick={onClose}
                className="text-xs text-emerald-600 hover:underline font-bold"
              >
                بازگشت به لیست محصولات
              </button>
            </div>
          )}
        </div>

        {/* Bottom Order Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 space-y-3">
            
            {/* Coupon input */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="کد تخفیف (مثال: ARYA10)"
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono uppercase focus:outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  اعمال
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[10px] font-bold ${discountPercent > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>مجموع قیمت کالاها:</span>
                <span className="font-mono font-bold">{formatToman(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-500 font-bold">
                  <span>تخفیف ({discountPercent}٪):</span>
                  <span className="font-mono">- {formatToman(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>هزینه ارسال اکسپرس:</span>
                <span className="font-mono font-bold">
                  {shippingFee === 0 ? 'رایگان 🎉' : formatToman(shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-emerald-400">
                <span>مبلغ قابل پرداخت:</span>
                <span className="font-mono">{formatToman(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onProceedToCheckout(discountPercent);
                onClose();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <span>ادامه فرآیند خرید و پرداخت</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
