import { apiFetch } from "@/lib/api-client";
import { mockCoupons } from "@/lib/mock-data";
import type { Coupon } from "@/types";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

export interface CouponResult {
  coupon: Coupon | null;
  error: string;
}

// MOCK: stands in for POST /api/coupons/validate.
function localValidate(code: string, subtotal: number): CouponResult {
  const coupon = mockCoupons.find((item) => item.code === code.trim().toUpperCase());
  if (!coupon) return { coupon: null, error: "This coupon code is not valid" };
  if (new Date(coupon.expiryDate).getTime() < Date.now()) {
    return { coupon: null, error: "This coupon has expired" };
  }
  if (coupon.timesUsed >= coupon.usageLimit) {
    return { coupon: null, error: "This coupon has reached its usage limit" };
  }
  if (subtotal < coupon.minOrderValue) {
    return {
      coupon: null,
      error: `Add items worth ₹${coupon.minOrderValue.toLocaleString("en-IN")} or more to use this coupon`,
    };
  }
  return { coupon, error: "" };
}

export async function validate(code: string, subtotal: number): Promise<CouponResult> {
  if (USE_MOCK) return localValidate(code, subtotal);
  return apiFetch<CouponResult>("/api/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

const APPLIED_KEY = "gg_applied_coupon";

export function getAppliedCode(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(APPLIED_KEY) ?? "";
}

export function setAppliedCode(code: string): void {
  if (typeof window === "undefined") return;
  if (code) localStorage.setItem(APPLIED_KEY, code);
  else localStorage.removeItem(APPLIED_KEY);
}
