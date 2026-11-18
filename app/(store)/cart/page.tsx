"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CouponInput } from "@/components/CouponInput";
import { TrashIcon } from "@/components/Icons";
import { PriceSummary } from "@/components/PriceSummary";
import { QuantitySelector } from "@/components/QuantitySelector";
import { ListSkeleton } from "@/components/Skeleton";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { useCartDetails, type CartLine } from "@/lib/hooks/useCartDetails";
import * as cartStore from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { lines, loading, coupon, setCoupon, totals } = useCartDetails();
  const [pendingRemoval, setPendingRemoval] = useState<CartLine | null>(null);

  async function confirmRemoval() {
    if (!pendingRemoval) return;
    await cartStore.remove(pendingRemoval.item.id);
    toast.success("Item removed from bag");
    setPendingRemoval(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shopping bag</h1>

      {loading ? (
        <ListSkeleton />
      ) : lines.length === 0 ? (
        <div className="rounded border border-dashed border-line py-20 text-center">
          <p className="text-xl font-bold">Your bag is empty</p>
          <p className="mt-1 text-muted">Add something you love — it only takes a click.</p>
          <Link href="/products" className="btn-primary mt-6">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.item.id} className="flex gap-4 rounded border border-line p-4">
                <Link href={`/products/${line.product.id}`} className="w-24 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.product.images[0]}
                    alt={line.product.name}
                    className="aspect-[3/4] w-full bg-surface object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-bold">{line.product.brand}</p>
                      <p className="text-muted">{line.product.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        Size: {line.item.size} · Color: {line.item.color}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${line.product.name} from bag`}
                      onClick={() => setPendingRemoval(line)}
                      className="h-fit rounded p-1 text-muted hover:text-danger"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <QuantitySelector
                      value={line.item.quantity}
                      max={Math.min(line.product.stock, MAX_QUANTITY_PER_ITEM)}
                      onChange={(value) => cartStore.update(line.item.id, value)}
                      label={`Quantity for ${line.product.name}`}
                    />
                    <p className="font-bold">{formatPrice(line.unitPrice * line.item.quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
            <li>
              <Link href="/products" className="text-sm font-bold uppercase text-primary hover:underline">
                ← Continue shopping
              </Link>
            </li>
          </ul>

          <aside className="h-fit space-y-6 rounded border border-line p-5" aria-label="Price details">
            <CouponInput subtotal={totals.subtotal} applied={coupon} onChange={setCoupon} />
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase text-muted">Price details</h2>
              <PriceSummary totals={totals} couponCode={coupon?.code} />
            </div>
            <button type="button" className="btn-primary w-full" onClick={() => router.push("/checkout")}>
              Proceed to checkout
            </button>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remove item?"
        message={`Remove ${pendingRemoval?.product.name ?? "this item"} from your bag?`}
        confirmLabel="Remove"
        onConfirm={confirmRemoval}
        onCancel={() => setPendingRemoval(null)}
      />
    </div>
  );
}
