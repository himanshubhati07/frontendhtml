export type UserRole = "user";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  tagline: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  priceAtAdd: number;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export type OrderStatus = "Placed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  quantity: number;
  size: string;
  color: string;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discountApplied: number;
  tax: number;
  shipping: number;
  total: number;
  promoCode?: string;
  status: OrderStatus;
  deliveryAddress: Omit<Address, "id" | "userId" | "isDefault" | "createdAt">;
  paymentMethod: PaymentMethod;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  gradient: string;
}
