import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data/products';
import { MAIN_MENUS } from './src/data/menu';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get Menu structure (6 main menus + submenus)
  app.get('/api/menu', (req, res) => {
    res.json(MAIN_MENUS);
  });

  // Get all products with query filtering & sorting
  app.get('/api/products', (req, res) => {
    const { category, subcategory, search, minPrice, maxPrice, sort, featured, hot } = req.query;

    let filtered = [...INITIAL_PRODUCTS];

    if (category && typeof category === 'string') {
      filtered = filtered.filter((p) => p.categorySlug === category);
    }

    if (subcategory && typeof subcategory === 'string') {
      filtered = filtered.filter((p) => p.subcategorySlug === subcategory);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    if (hot === 'true') {
      filtered = filtered.filter((p) => p.isHot);
    }

    // Sort
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    res.json({
      total: filtered.length,
      products: filtered,
    });
  });

  // Get single product
  app.get('/api/products/:id', (req, res) => {
    const product = INITIAL_PRODUCTS.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'محصول مورد نظر یافت نشد' });
    }
    res.json(product);
  });

  // Create Order simulation
  app.post('/api/orders', (req, res) => {
    const { fullName, phone, province, city, address, postalCode, paymentMethod, items, subtotal, discount, shippingFee, finalTotal } = req.body;

    if (!fullName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'اطلاعات ارسال و سبد خرید کامل نیست' });
    }

    const orderId = 'ARYA-' + Math.floor(100000 + Math.random() * 900000);
    const order = {
      orderId,
      fullName,
      phone,
      province: province || 'تهران',
      city: city || 'تهران',
      address,
      postalCode: postalCode || '1234567890',
      paymentMethod: paymentMethod || 'zarinpal',
      items,
      subtotal,
      discount: discount || 0,
      shippingFee: shippingFee || 0,
      finalTotal,
      createdAt: new Date().toLocaleString('fa-IR'),
      status: 'در حال پردازش و ثبت سفارش',
    };

    res.status(201).json({
      message: 'سفارش شما با موفقیت ثبت شد',
      order,
    });
  });

  // AI Shopping Assistant route using Gemini API
  app.post('/api/ai-assistant', async (req, res) => {
    const { userPrompt } = req.body;

    if (!userPrompt || typeof userPrompt !== 'string') {
      return res.status(400).json({ error: 'لطفاً پرسش خود را وارد کنید.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build context with current store products
    const storeContext = INITIAL_PRODUCTS.map(
      (p) => `- ${p.title} (کد: ${p.id}) | قیمت: ${p.price.toLocaleString('fa-IR')} تومان | برند: ${p.brand} | دسته: ${p.categorySlug} | ویژگی‌ها: ${Object.entries(p.specifications).map(([k,v]) => `${k}: ${v}`).join(', ')}`
    ).join('\n');

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `شما مشاور هوشمند خرید در فروشگاه آنلاین "آریا" هستید.
پاسخ‌های شما باید کاملاً محترمانه، صمیمی، به زبان فارسی روان و کاربردی باشند.
با توجه به لیست محصولات زیر در فروشگاه، بهترین گزینه‌ها را به کاربر معرفی کنید. قیمت‌ها به تومان است.
اگر کاربر بودجه مشخصی داشت، محصولات متناسب با بودجه‌اش را پیشنهاد دهید.
اگر کاربر سوال فنی پرسید، مشخصات فنی کالاها را توضیح دهید.

لیست محصولات موجود در فروشگاه آریا:
${storeContext}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: userPrompt }] }
          ],
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const replyText = response.text || 'پاسخ مناسبی دریافت نشد.';
        return res.json({ reply: replyText });
      } catch (err) {
        console.error('Gemini API Error:', err);
      }
    }

    // Fallback intelligent matching if Gemini API key is missing or encounters an error
    const query = userPrompt.toLowerCase();
    const matchedProducts = INITIAL_PRODUCTS.filter((p) => {
      return (
        query.includes(p.brand.toLowerCase()) ||
        query.includes(p.categorySlug) ||
        p.tags.some((tag) => query.includes(tag.toLowerCase())) ||
        p.title.toLowerCase().includes(query)
      );
    });

    let fallbackReply = `سلام! من مشاور هوشمند فروشگاه آریا هستم.\nدر پاسخ به پرسش شما («${userPrompt}»):`;

    if (matchedProducts.length > 0) {
      fallbackReply += `\n\nبر اساس درخواست شما، این محصولات از فروشگاه ما پیشنهاد می‌شوند:\n`;
      matchedProducts.slice(0, 3).forEach((p, idx) => {
        fallbackReply += `\n${idx + 1}. **${p.title}**\n• قیمت: ${p.price.toLocaleString('fa-IR')} تومان\n• ویژگی: ${p.description.slice(0, 90)}...\n`;
      });
      fallbackReply += `\nمی‌توانید با کلیک روی محصول، جزئیات بیشتر را مشاهده کرده و آن را به سبد خرید خود اضافه کنید!`;
    } else {
      fallbackReply += `\n\nفروشگاه آریا کالاهای متنوعی از جمله گوشی موبایل سامسونگ S24 اولترا، مک‌بوک پرو M3 Max، هدفون نویزگیر سونی، اسپرسوساز دلونگی، سرخ‌کن فیلیپس، عطر کرید آونتوس و کفش نایکی را موجود دارد. پیشنهاد می‌کنم از منوی بالای صفحه دسته‌بندی دلخواه خود را بررسی نمایید!`;
    }

    return res.json({ reply: fallbackReply });
  });

  // Vite middleware for dev or Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Arya Store Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
