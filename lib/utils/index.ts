import {
  DELIVERY_DAYS,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  TAX_RATE,
} from "@/lib/constants";
import type { Coupon, Product } from "@/types";

export function formatPrice(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function effectivePrice(product: Product): number {
  return product.discountPrice ?? product.price;
}

export function discountPercent(product: Product): number {
  if (!product.discountPrice) return 0;
  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
}

export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.discountType === "percent") {
    return Math.round((subtotal * coupon.discountValue) / 100);
  }
  return Math.min(coupon.discountValue, subtotal);
}

export interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export function calculateTotals(subtotal: number, discount: number): Totals {
  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * TAX_RATE);
  const shipping = subtotal === 0 || taxable >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total: taxable + tax + shipping,
  };
}

export function estimatedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + DELIVERY_DAYS);
  return date.toISOString();
}
