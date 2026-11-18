"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAuthenticated } from "@/lib/stores/auth-store";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import * as wishlistStore from "@/lib/stores/wishlist-store";

// Shared by ProductCard and the product detail page.
export function useWishlist() {
  const router = useRouter();
  const [productIds, setProductIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const items = await wishlistStore.getAll();
    setProductIds(items.map((item) => item.productId));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);
  useStoreChange(refresh);

  const toggle = useCallback(
    async (productId: string) => {
      if (!isAuthenticated()) {
        toast("Please log in to save items to your wishlist");
        router.push("/login?next=" + encodeURIComponent(window.location.pathname));
        return;
      }
      if (productIds.includes(productId)) {
        await wishlistStore.remove(productId);
        toast.success("Removed from wishlist");
      } else {
        await wishlistStore.create(productId);
        toast.success("Added to wishlist");
      }
    },
    [productIds, router],
  );

  return { productIds, toggle };
}
