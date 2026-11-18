"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/Icons";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { discountPercent, effectivePrice, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { productIds, toggle } = useWishlist();
  const wishlisted = productIds.includes(product.id);
  const percent = discountPercent(product);

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-white/90 px-1.5 py-0.5 text-xs font-semibold">
            {product.rating.toFixed(1)}
            <span className="text-secondary">★</span>
            <span className="text-muted">| {product.reviewCount.toLocaleString("en-IN")}</span>
          </span>
          {product.stock === 0 && (
            <span className="absolute left-2 top-2 rounded bg-ink px-2 py-0.5 text-xs font-semibold text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="pt-3">
          <h3 className="truncate text-sm font-bold">{product.brand}</h3>
          <p className="truncate text-muted">{product.name}</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="font-bold">{formatPrice(effectivePrice(product))}</span>
            {product.discountPrice && (
              <>
                <span className="text-xs text-muted line-through">{formatPrice(product.price)}</span>
                <span className="text-xs font-semibold text-warning">({percent}% OFF)</span>
              </>
            )}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <HeartIcon className={`h-5 w-5 ${wishlisted ? "text-primary" : "text-ink"}`} filled={wishlisted} />
      </button>
    </div>
  );
}
