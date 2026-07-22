import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Headphones, ArrowLeft } from 'lucide-react';
import { MAIN_MENUS } from '../data/menu';

interface FooterProps {
  onSelectCategory: (categorySlug: string | null, subcategorySlug?: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: About Store */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">فروشگاه آنلاین آریا</span>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              فروشگاه اینترنتی آریا مرجع تخصصی عرضه جدیدترین محصولات دیجیتال، پوشاک، لوازم خانگی و زیبایی با تضمین ۱۰۰٪ اصالت کالا، بهترین قیمت و ارسال اکسپرس به سراسر کشور.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> تهران، خیابان ولیعصر، نرسیده به ونک، برج آریا، طبقه ۴
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" /> ۰۲۱-۸۸۹۹۰۰۱۱ (پاسخگویی ۲۴ ساعته)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" /> info@aryastore.ir
              </p>
            </div>
          </div>

          {/* Col 2 & 3: 6 Main Menus Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">
              دسته‌بندی‌های کالا
            </h4>
            <ul className="space-y-2 text-xs">
              {MAIN_MENUS.slice(0, 3).map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => onSelectCategory(menu.slug, null)}
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3 h-3 text-emerald-500" />
                    <span>{menu.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">
              خدمات و پیشنهادها
            </h4>
            <ul className="space-y-2 text-xs">
              {MAIN_MENUS.slice(3, 6).map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => onSelectCategory(menu.slug, null)}
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3 h-3 text-emerald-500" />
                    <span>{menu.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Trust symbols & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">
              نماد اعتماد الکترونیکی
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700/60 text-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
                <span className="text-[10px] font-bold text-slate-300 block">ای‌نماد ۵ ستاره</span>
              </div>
              <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700/60 text-center space-y-1">
                <Truck className="w-6 h-6 text-emerald-400 mx-auto" />
                <span className="text-[10px] font-bold text-slate-300 block">پست پیشتاز</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© ۱۴۰۳ تمامی حقوق این وب‌سایت متعلق به فروشگاه آنلاین آریا می‌باشد.</p>
          <p className="font-mono text-[11px] text-slate-400">Next.js UI & Node.js Express Backend</p>
        </div>
      </div>
    </footer>
  );
};
