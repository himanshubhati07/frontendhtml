"use client";

import { useCallback, useEffect, useState } from "react";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import * as cartStore from "@/lib/stores/cart-store";
import * as couponStore from "@/lib/stores/coupon-store";
import * as productStore from "@/lib/stores/product-store";
import { calculateTotals, couponDiscount, effectivePrice } from "@/lib/utils";
import type { CartItem, Coupon, Product } from "@/types";

export interface CartLine {
  item: CartItem;
  product: Product;
  unitPrice: number;
}

// Shared by the cart and checkout pages.
export function useCartDetails() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCouponState] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [items, products] = await Promise.all([cartStore.getAll(), productStore.getAll()]);
    const next: CartLine[] = [];
    items.forEach((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (product) next.push({ item, product, unitPrice: effectivePrice(product) });
    });
    setLines(next);
    const subtotal = next.reduce((sum, line) => sum + line.unitPrice * line.item.quantity, 0);
    const code = couponStore.getAppliedCode();
    if (code) {
      const result = await couponStore.validate(code, subtotal);
      setCouponState(result.coupon);
      if (!result.coupon) couponStore.setAppliedCode("");
    } else {
      setCouponState(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);
  useStoreChange(refresh);

  const setCoupon = useCallback((next: Coupon | null) => {
    couponStore.setAppliedCode(next?.code ?? "");
    setCouponState(next);
  }, []);

  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.item.quantity, 0);
  const discount = couponDiscount(coupon, subtotal);
  const totals = calculateTotals(subtotal, discount);

  return { lines, loading, coupon, setCoupon, totals, refresh };
}
