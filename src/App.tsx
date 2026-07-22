import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { Footer } from './components/Footer';
import { Product, CartItem, FilterState } from './types';
import { INITIAL_PRODUCTS } from './data/products';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('arya_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('arya_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    selectedSubcategory: null,
    minPrice: 0,
    maxPrice: 200000000,
    onlyInStock: false,
    onlyDiscounted: false,
    sortBy: 'featured',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('arya_theme') === 'dark';
  });

  // Persist Dark Mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('arya_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('arya_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('arya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('arya_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Fetch products from Express Node.js API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filterState.selectedCategory) queryParams.set('category', filterState.selectedCategory);
        if (filterState.selectedSubcategory) queryParams.set('subcategory', filterState.selectedSubcategory);
        if (filterState.searchQuery) queryParams.set('search', filterState.searchQuery);
        if (filterState.sortBy) queryParams.set('sort', filterState.sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          let items: Product[] = data.products || INITIAL_PRODUCTS;

          // Local in-stock & discount filters
          if (filterState.onlyInStock) {
            items = items.filter((p) => p.stock > 0);
          }
          if (filterState.onlyDiscounted) {
            items = items.filter((p) => (p.discountPercent || 0) > 0);
          }

          setProducts(items);
        }
      } catch (err) {
        console.error('Failed to fetch API products, using seed data:', err);
      }
    };

    fetchProducts();
  }, [filterState]);

  // Sync GitHub Pages / Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('category-')) {
        const parts = hash.replace('category-', '').split('-');
        const cat = parts[0];
        const sub = parts[1] || null;
        setFilterState((prev) => ({ ...prev, selectedCategory: cat, selectedSubcategory: sub }));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectCategory = (categorySlug: string | null, subcategorySlug?: string | null) => {
    setFilterState((prev) => ({
      ...prev,
      selectedCategory: categorySlug,
      selectedSubcategory: subcategorySlug || null,
      searchQuery: '',
    }));

    if (categorySlug) {
      const hashVal = subcategorySlug ? `#category-${categorySlug}-${subcategorySlug}` : `#category-${categorySlug}`;
      window.location.hash = hashVal;
    } else {
      window.location.hash = '';
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAskAIAboutProduct = (productTitle: string) => {
    setAiInitialPrompt(`سلام، لطفاً اطلاعات کامل و نکات کلیدی خرید محصول «${productTitle}» را برام توضیح بده.`);
    setIsAIAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 dir-rtl" dir="rtl">
      
      {/* Header & Mega Menu */}
      <Header
        products={products}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        selectedCategory={filterState.selectedCategory}
        selectedSubcategory={filterState.selectedSubcategory}
        onSelectCategory={handleSelectCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          // Filter products for wishlist
          setFilterState((prev) => ({ ...prev, selectedCategory: null }));
        }}
        onOpenAIAssistant={() => {
          setAiInitialPrompt('');
          setIsAIAssistantOpen(true);
        }}
        onSelectProduct={(product) => setSelectedProduct(product)}
        searchQuery={filterState.searchQuery}
        onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <main>
        {/* Show Hero Banner only when no specific search or category is filtered */}
        {!filterState.selectedCategory && !filterState.searchQuery && (
          <HeroBanner
            onSelectCategory={handleSelectCategory}
            onSelectProduct={(product) => setSelectedProduct(product)}
            featuredProducts={products.filter((p) => p.isFeatured)}
          />
        )}

        {/* Product Grid & Advanced Filter */}
        <ProductGrid
          products={products}
          wishlistIds={wishlistIds}
          filterState={filterState}
          onFilterChange={(newFilters) => setFilterState((prev) => ({ ...prev, ...newFilters }))}
          onResetFilters={() =>
            setFilterState({
              searchQuery: '',
              selectedCategory: null,
              selectedSubcategory: null,
              minPrice: 0,
              maxPrice: 200000000,
              onlyInStock: false,
              onlyDiscounted: false,
              sortBy: 'featured',
            })
          }
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isInWishlist={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onAskAIAboutProduct={handleAskAIAboutProduct}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(discountPercent) => {
          setAppliedDiscountPercent(discountPercent);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountPercent={appliedDiscountPercent}
        onClearCart={() => setCartItems([])}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        products={INITIAL_PRODUCTS}
        initialPrompt={aiInitialPrompt}
        onSelectProduct={(product) => {
          setSelectedProduct(product);
          setIsAIAssistantOpen(false);
        }}
      />
    </div>
  );
}
