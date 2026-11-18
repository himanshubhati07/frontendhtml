"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { StarRating } from "@/components/StarRating";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import * as cartStore from "@/lib/stores/cart-store";
import * as productStore from "@/lib/stores/product-store";
import * as wishlistStore from "@/lib/stores/wishlist-store";
import { effectivePrice, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRemoval, setPendingRemoval] = useState<Product | null>(null);
  const [sizeChoice, setSizeChoice] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [items, all] = await Promise.all([wishlistStore.getAll(), productStore.getAll()]);
    const saved: Product[] = [];
    items.forEach((item) => {
      const product = all.find((candidate) => candidate.id === item.productId);
      if (product) saved.push(product);
    });
    setProducts(saved);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useStoreChange(load);

  async function moveToCart(product: Product) {
    const size = sizeChoice[product.id];
    if (!size) {
      toast.error("Select a size first");
      return;
    }
    if (product.stock === 0) {
      toast.error("This item is out of stock");
      return;
    }
    await cartStore.create(
      {
        productId: product.id,
        quantity: 1,
        size,
        color: product.colors[0]?.name ?? "",
        priceAtAdd: effectivePrice(product),
      },
      product.stock,
    );
    await wishlistStore.remove(product.id);
    toast.success("Moved to bag");
  }

  async function confirmRemoval() {
    if (!pendingRemoval) return;
    await wishlistStore.remove(pendingRemoval.id);
    toast.success("Removed from wishlist");
    setPendingRemoval(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        My wishlist {!loading && <span className="text-base font-normal text-muted">({products.length} items)</span>}
      </h1>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <div className="rounded border border-dashed border-line py-20 text-center">
          <p className="text-xl font-bold">Your wishlist is empty</p>
          <p className="mt-1 text-muted">Tap the heart on items you love to save them here.</p>
          <Link href="/products" className="btn-primary mt-6">
            Explore products
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col rounded border border-line">
              <Link href={`/products/${product.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="aspect-[3/4] w-full bg-surface object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate font-bold">{product.brand}</p>
                <p className="truncate text-muted">{product.name}</p>
                <StarRating rating={product.rating} className="mt-1 h-3.5 w-3.5" />
                <p className="mt-1 font-bold">{formatPrice(effectivePrice(product))}</p>
                <label htmlFor={`size-${product.id}`} className="sr-only">
                  Size for {product.name}
                </label>
                <select
                  id={`size-${product.id}`}
                  value={sizeChoice[product.id] ?? ""}
                  onChange={(event) => setSizeChoice({ ...sizeChoice, [product.id]: event.target.value })}
                  className="field-input mt-2"
                >
                  <option value="">Select size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveToCart(product)}
                    className="btn-primary flex-1 px-2 py-2 text-xs"
                  >
                    Move to bag
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingRemoval(product)}
                    className="btn-outline px-2 py-2 text-xs"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remove from wishlist?"
        message={`Remove ${pendingRemoval?.name ?? "this item"} from your wishlist?`}
        confirmLabel="Remove"
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
