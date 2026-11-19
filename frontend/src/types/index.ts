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
  costPrice?: number | null;
  supplier?: string | null;
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

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export interface OrderItem {
  id: string;
  orderId?: string;
  productId: number;
  productTitle: string;
  selectedFinish?: string | null;
  quantity: number;
  price: number;
  product?: {
    id: number;
    title: string;
    images: string[];
    handle: string;
    sku?: string | null;
    stock: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  notes?: string | null;
  paymentMethod: string;
  couponCode?: string | null;
  discount?: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface AdminOrdersResponse {
  success: boolean;
  data: Order[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  statusCounts: Record<string, number>;
  totalRevenue: number;
}

export interface StoreSettings {
  id?: number;
  storeName: string;
  logo?: string | null;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcement: string;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  workingHours: string;
  aboutText?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

export interface DashboardMetrics {
  ordersToday: number;
  revenueToday: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  subscriberCount: number;
  totalCustomers: number;
  statusCounts: Record<string, number>;
  revenueTrend: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{
    id: number;
    title: string;
    handle: string;
    price: number;
    image: string;
    unitsSold: number;
    totalRevenue: number;
  }>;
  lowStockProducts: Array<{
    id: number;
    title: string;
    handle: string;
    stock: number;
    lowStockThreshold: number;
    price: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: string;
  }>;
}

export interface ProfitReportItem {
  id: number;
  title: string;
  handle: string;
  sellingPrice: number;
  costPrice: number;
  unitProfit: number;
  marginPercent: number;
  unitsSold: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  supplier?: string | null;
}

export interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  items: ProfitReportItem[];
}
