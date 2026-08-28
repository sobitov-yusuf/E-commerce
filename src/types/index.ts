export type LanguageCode = 'uz' | 'ru' | 'en';
export type CurrencyCode = 'UZS' | 'USD';

export interface MultilingualText {
  uz: string;
  ru?: string;
  en?: string;
}

export type ProductBadge = 'NEW' | 'TOP' | 'SALE' | 'NONE';

export type AdminRole = 'SUPERADMIN' | 'MANAGER';

// ==========================================
// CORE ENTITY INTERFACES
// ==========================================

/// Users & Sessions
export interface User {
  id: string; // UUID
  telegram_id: bigint | number;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
  phone?: string | null;
  language_code: LanguageCode;
  is_blocked: boolean;
  created_at: Date | string;
}

export interface UserSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminRole: AdminRole | null;
}

/// Categories
export interface Category {
  id: number;
  name: MultilingualText;
  slug: string;
  image_url?: string | null;
  is_active: boolean;
}

/// Products
export interface Product {
  id: number;
  category_id: number;
  name: MultilingualText;
  description: MultilingualText;
  base_price: number;
  old_price?: number | null;
  badge: ProductBadge;
  images: string[];
  is_active: boolean;
  created_at: Date | string;
  category?: Category;
  variants?: ProductVariant[];
  rating?: number;
  reviews_count?: number;
}

/// ProductVariants (SKU & Stock)
export interface ProductVariant {
  id: number;
  product_id: number;
  size?: string | null;
  color?: string | null;
  price?: number | null;
  image_url?: string | null;
  stock_count: number;
  sku?: string | null;
}

/// Stories
export interface StoryItem {
  id: number;
  title: MultilingualText | string;
  subtitle: MultilingualText | string;
  tag: MultilingualText | string;
  image: string;
  bgColor: string;
  linkText: MultilingualText | string;
  linkUrl: string;
}

/// Banners
export interface Banner {
  id: number;
  title: MultilingualText;
  image_url: string;
  link_product_id?: number | null;
  is_active: boolean;
  link?: string;
}

/// Orders
export type OrderStatus = 'NEW' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED' | 'PARTIALLY_REFUNDED';
export type PaymentType = 'CLICK' | 'PAYME' | 'CASH';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'PARTIALLY_REFUNDED';
export type DeliveryType = 'COURIER' | 'PICKUP';

export interface Order {
  id: number;
  order_number: string;
  user_id: string;
  promocode_id?: number | null;
  branch_id?: number | null;
  status: OrderStatus;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  subtotal_price: number;
  discount_price: number;
  delivery_price: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  comment?: string | null;
  created_at: Date | string;
}

export type PromocodeType = 'PERCENT' | 'FIXED';

export interface Promocode {
  id: number;
  code: string;
  discount_type: PromocodeType;
  discount_value: number;
  min_order_amount?: number | null;
  max_uses?: number | null;
  used_count: number;
  is_active: boolean;
  expires_at?: Date | string | null;
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Review {
  id: number;
  product_id: number;
  user_id: string;
  rating: number;
  comment?: string | null;
  images?: string[];
  status: ReviewStatus;
  created_at: Date | string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

export interface TelegramAuthResult {
  isValid: boolean;
  user?: TelegramUser;
  authDate?: number;
  startParam?: string;
  error?: string;
}

export interface CreateOrderDto {
  customer_name: string;
  customer_phone: string;
  delivery_type: DeliveryType;
  payment_type: PaymentType;
  address?: string;
  comment?: string;
  promocode?: string;
  latitude?: number | null;
  longitude?: number | null;
  branch_id?: number | null;
  items: Array<{
    product_id: number;
    variant_id?: number;
    quantity: number;
  }>;
}
