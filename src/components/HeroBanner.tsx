import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, ArrowLeft, Flame, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  onSelectCategory: (categorySlug: string | null, subcategorySlug?: string | null) => void;
  onSelectProduct: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onSelectProduct,
  featuredProducts,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'پرچمدار هوشمند سامسونگ S24 Ultra',
      subtitle: 'مجهز به پردازنده هوش مصنوعی Galaxy AI و بدنه مقاوم تیتانیومی',
      badge: 'جشنواره فروش ویژه',
      discount: '۵٪ تخفیف خرید مستقیم',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
      actionSlug: 'digital',
      subSlug: 'mobile',
      buttonText: 'بررسی و خرید S24 اولترا',
    },
    {
      title: 'قدرت پردازشی بی‌نهایت با MacBook Pro M3 Max',
      subtitle: 'مناسب برنامه‌نویسان، طراحان ۳ بعدی و تدوین‌گران حرفه‌ای',
      badge: 'محصول پرچمدار اپل',
      discount: 'تحویل فوری همان روز',
      bgGradient: 'from-slate-950 via-slate-900 to-emerald-950',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      actionSlug: 'digital',
      subSlug: 'laptop',
      buttonText: 'مشاهده مک‌بوک‌های M3',
    },
    {
      title: 'قهوه اصیل ایتالیایی با اسپرسوساز اتوماتیک دلونگی',
      subtitle: 'با آسیاب مخروطی فولادی و نازل بخار عالی برای لاته و کاپوچینو',
      badge: 'تخفیف شگفت‌انگیز لوازم خانگی',
      discount: '۱۱٪ تخفیف محدود',
      bgGradient: 'from-amber-950 via-neutral-900 to-amber-900',
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ed02810a019?auto=format&fit=crop&w=1200&q=80',
      actionSlug: 'home',
      subSlug: 'appliances',
      buttonText: 'خرید تجهیزات قهوه',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Hero Banner Slider */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${slide.bgGradient} text-white shadow-xl transition-all duration-500`}>
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] lg:min-h-[420px] items-center p-6 sm:p-10 lg:p-12 relative z-10 gap-6">
          
          {/* Content Left (RTL Right) */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/90 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-slate-950" /> {slide.badge}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-emerald-300 text-xs px-3 py-1 rounded-full border border-white/20 font-semibold">
                {slide.discount}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white tracking-tight">
              {slide.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectCategory(slide.actionSlug, slide.subSlug)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.buttonText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('offers', 'hot-deals')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-sm border border-white/20 backdrop-blur-sm transition"
              >
                تخفیف‌های ویژه امروز
              </button>
            </div>
          </div>

          {/* Image Right (RTL Left) */}
          <div className="md:col-span-5 flex justify-center items-center">
            <div className="relative group w-full max-w-md h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 right-8 flex items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`اسلاید ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
        <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">ارسال اکسپرس سریع</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">ارسال تمام خریدهای بالای ۲M رایگان</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">ضمانت ۱۰۰٪ اصالت کالا</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">تضمین بازگشت وجه کامل</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">۷ روز مهلت تست و تعویض</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">بدون هیچگونه سوال یا پرسش</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">پشتیبانی ۲۴ ساعته و AI</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">مشاور هوشمند انتخاب کالا</p>
          </div>
        </div>
      </div>
    </section>
  );
};
