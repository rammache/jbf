export interface Product {
  id: number;
  handle: string;
  title: string;
  description?: string | null;
  price: number;
  compare: number | null;
  sku?: string | null;
  stock: number;
  lowStockThreshold?: number;
  categoryId?: number;
  category: string | Category;
  brand: string;
  spec: string;
  screen?: string | null;
  battery?: string | null;
  camera?: string | null;
  network?: string | null;
  warranty?: string | null;
  processor?: string | null;
  condition?: string;
  storage?: string | null;
  ram?: string | null;
  color?: string | null;
  rating: number;
  reviews: number;
  finishes: string[];
  images: string[];
  featured?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    orderItems: number;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CartItem {
  key: string;
  productId: number;
  handle: string;
  title: string;
  price: number;
  image: string;
  selectedFinish?: string;
  quantity: number;
}
