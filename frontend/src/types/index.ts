export interface Product {
  id: number;
  handle: string;
  title: string;
  price: number;
  compare: number | null;
  categoryId?: number;
  category: string | Category;
  brand: string;
  spec: string;
  rating: number;
  reviews: number;
  finishes: string[];
  images: string[];
  featured?: boolean;
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
