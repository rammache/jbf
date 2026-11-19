export interface Product {
  id: number;
  handle: string;
  title: string;
  price: number;
  compare: number | null;
  category: string;
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
  image?: string;
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
