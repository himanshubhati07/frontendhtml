"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import { PAYMENT_METHODS } from "@/lib/constants";
import * as orderStore from "@/lib/stores/order-store";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderStore.getById(params.id).then((found) => {
      setOrder(found ?? null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10" role="status" aria-label="Loading order">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/account" className="btn-primary mt-6">
          View my orders
        </Link>
      </div>
    );
  }

  const paymentLabel = PAYMENT_METHODS.find((method) => method.id === order.paymentMethod)?.label;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="text-center" role="status">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-3 text-3xl font-extrabold">Thank you, your order is placed!</h1>
        <p className="mt-1 text-muted">
          Order number <span className="font-bold text-ink">{order.id}</span>
        </p>
        <p className="text-muted">
          Estimated delivery by <span className="font-bold text-ink">{formatDate(order.estimatedDelivery)}</span>
        </p>
      </div>

      <section className="mt-8 rounded border border-line p-5" aria-labelledby="items-heading">
        <h2 id="items-heading" className="mb-3 font-bold">
          Items in your order
        </h2>
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-20 w-16 bg-surface object-cover" />
              <div className="flex-1">
                <p className="font-bold">{item.brand}</p>
                <p className="text-muted">{item.name}</p>
                <p className="text-xs text-muted">
                  Size {item.size} · {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discountApplied > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount {order.promoCode ? `(${order.promoCode})` : ""}</dt>
              <dd>−{formatPrice(order.discountApplied)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatPrice(order.tax)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total paid</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded border border-line p-5" aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="mb-2 font-bold">
            Delivery address
          </h2>
          <p>{order.deliveryAddress.name}</p>
          <p className="text-muted">
            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} –{" "}
            {order.deliveryAddress.postalCode}
          </p>
          <p className="text-muted">Mobile: {order.deliveryAddress.phone}</p>
        </section>
        <section className="rounded border border-line p-5" aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="mb-2 font-bold">
            Payment &amp; status
          </h2>
          <p>{paymentLabel}</p>
          <p className="text-muted">Status: {order.status}</p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-primary" onClick={() => router.push("/")}>
          Continue shopping
        </button>
        <button type="button" className="btn-outline" onClick={() => router.push("/account?tab=orders")}>
          View my orders
        </button>
      </div>
    </div>
  );
}
