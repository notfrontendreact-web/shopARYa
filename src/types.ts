export interface SubMenuItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description?: string;
  icon?: string;
  isPopular?: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  icon: string;
  badge?: string;
  submenus: SubMenuItem[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string; // Persian name
  titleEn: string; // English name
  price: number; // In Toman (تومان)
  originalPrice?: number; // In Toman for discount display
  discountPercent?: number;
  categorySlug: string; // Main menu category slug
  subcategorySlug: string; // Submenu category slug
  imageUrl: string;
  secondaryImages?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isHot?: boolean;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  tags: string[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  onlyDiscounted: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface OrderDetails {
  orderId: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: 'zarinpal' | 'shetab' | 'cod';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  finalTotal: number;
  createdAt: string;
}
