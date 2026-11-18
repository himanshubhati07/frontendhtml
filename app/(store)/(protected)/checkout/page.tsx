"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AddressForm, type AddressValues } from "@/components/AddressForm";
import { CouponInput } from "@/components/CouponInput";
import { PriceSummary } from "@/components/PriceSummary";
import { ListSkeleton } from "@/components/Skeleton";
import { PAYMENT_METHODS } from "@/lib/constants";
import { useCartDetails } from "@/lib/hooks/useCartDetails";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import * as addressStore from "@/lib/stores/address-store";
import * as cartStore from "@/lib/stores/cart-store";
import * as orderStore from "@/lib/stores/order-store";
import { estimatedDeliveryDate, formatPrice } from "@/lib/utils";
import { validateRequired } from "@/lib/validation";
import type { Address, PaymentMethod } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, loading, coupon, setCoupon, totals } = useCartDetails();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState("");

  async function loadAddresses() {
    const list = await addressStore.getAll();
    setAddresses(list);
    setAddressesLoaded(true);
    setSelectedAddressId((current) => {
      if (current && list.some((address) => address.id === current)) return current;
      return (list.find((address) => address.isDefault) ?? list[0])?.id ?? "";
    });
  }

  useEffect(() => {
    loadAddresses();
  }, []);
  useStoreChange(loadAddresses);

  const paymentErrors: Record<string, string> = {};
  if (payment === "upi" && !/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
    paymentErrors.upi = "Enter a valid UPI ID, e.g. name@bank";
  }
  if (payment === "card") {
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) paymentErrors.cardNumber = "Enter a 16-digit card number";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) paymentErrors.cardExpiry = "Use MM/YY format";
    if (!/^\d{3}$/.test(cardCvv)) paymentErrors.cardCvv = "Enter a 3-digit CVV";
  }
  const addressError = validateRequired(selectedAddressId, "Delivery address");
  const isValid = !addressError && Object.keys(paymentErrors).length === 0 && lines.length > 0;

  async function handleAddAddress(values: AddressValues) {
    const created = await addressStore.create(values);
    setSelectedAddressId(created.id);
    setAddingAddress(false);
    toast.success("Address saved");
  }

  async function handlePlaceOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setSubmitted(true);
      return;
    }
    const address = addresses.find((candidate) => candidate.id === selectedAddressId);
    if (!address) return;
    setPlacing(true);
    setFormError("");
    // MOCK: stands in for POST /api/payments/process — always succeeds after a short delay.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    try {
      const order = await orderStore.create({
        items: lines.map((line) => ({
          id: line.item.id,
          productId: line.product.id,
          name: line.product.name,
          brand: line.product.brand,
          image: line.product.images[0],
          quantity: line.item.quantity,
          size: line.item.size,
          color: line.item.color,
          unitPrice: line.unitPrice,
        })),
        subtotal: totals.subtotal,
        discountApplied: totals.discount,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        promoCode: coupon?.code,
        // MOCK: new orders always start as "Placed"; real status comes from the backend.
        status: "Placed",
        deliveryAddress: {
          name: address.name,
          phone: address.phone,
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod: payment,
        estimatedDelivery: estimatedDeliveryDate(),
      });
      await cartStore.clear();
      setCoupon(null);
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${order.id}`);
    } catch {
      setFormError("We could not place your order. Please try again.");
      setPlacing(false);
    }
  }

  if (loading || !addressesLoaded) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <ListSkeleton />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-muted">Your bag is empty.</p>
        <Link href="/products" className="btn-primary mt-6">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button type="button" onClick={() => router.push("/cart")} className="mb-2 text-sm font-bold uppercase text-primary hover:underline">
        ← Back to bag
      </button>
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section aria-labelledby="address-heading">
            <h2 id="address-heading" className="mb-3 text-lg font-bold">
              1. Delivery address
            </h2>
            {addresses.length > 0 && (
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose a saved address</legend>
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer gap-3 rounded border p-4 ${
                      selectedAddressId === address.id ? "border-primary bg-primary-soft/40" : "border-line"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 accent-primary"
                    />
                    <span>
                      <span className="font-bold">{address.name}</span>
                      {address.isDefault && (
                        <span className="ml-2 rounded bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand-dark">
                          DEFAULT
                        </span>
                      )}
                      <span className="block text-muted">
                        {address.street}, {address.city}, {address.state} – {address.postalCode}, {address.country}
                      </span>
                      <span className="block text-muted">Mobile: {address.phone}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
            {submitted && addressError && (
              <p role="alert" className="mt-2 text-sm text-danger">
                Please add or select a delivery address
              </p>
            )}
            {addingAddress || addresses.length === 0 ? (
              <div className="mt-4 rounded border border-line p-4">
                <AddressForm
                  idPrefix="checkout-address"
                  submitLabel="Save address"
                  onSubmit={handleAddAddress}
                  onCancel={addresses.length > 0 ? () => setAddingAddress(false) : undefined}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingAddress(true)}
                className="mt-3 text-sm font-bold uppercase text-primary hover:underline"
              >
                + Add new address
              </button>
            )}
          </section>

          <form id="checkout-form" onSubmit={handlePlaceOrder} noValidate aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="mb-3 text-lg font-bold">
              2. Payment method
            </h2>
            <fieldset className="space-y-3">
              <legend className="sr-only">Choose a payment method</legend>
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex cursor-pointer gap-3 rounded border p-4 ${
                    payment === method.id ? "border-primary bg-primary-soft/40" : "border-line"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === method.id}
                    onChange={() => setPayment(method.id)}
                    className="mt-1 accent-primary"
                  />
                  <span>
                    <span className="font-bold">{method.label}</span>
                    <span className="block text-xs text-muted">{method.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {payment === "upi" && (
              <div className="mt-4">
                <label htmlFor="upi-id" className="field-label">
                  UPI ID
                </label>
                <input
                  id="upi-id"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                  aria-describedby="upi-help"
                  className="field-input"
                />
                <p id="upi-help" className={`mt-1 text-xs ${submitted && paymentErrors.upi ? "text-danger" : "text-muted"}`}>
                  {submitted && paymentErrors.upi ? paymentErrors.upi : "Format: name@bank"}
                </p>
              </div>
            )}
            {payment === "card" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label htmlFor="card-number" className="field-label">
                    Card number
                  </label>
                  <input
                    id="card-number"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    aria-describedby="card-number-help"
                    className="field-input"
                  />
                  <p id="card-number-help" className={`mt-1 text-xs ${submitted && paymentErrors.cardNumber ? "text-danger" : "text-muted"}`}>
                    {submitted && paymentErrors.cardNumber ? paymentErrors.cardNumber : "16 digits"}
                  </p>
                </div>
                <div>
                  <label htmlFor="card-expiry" className="field-label">
                    Expiry
                  </label>
                  <input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(event) => setCardExpiry(event.target.value)}
                    aria-describedby="card-expiry-help"
                    className="field-input"
                  />
                  <p id="card-expiry-help" className={`mt-1 text-xs ${submitted && paymentErrors.cardExpiry ? "text-danger" : "text-muted"}`}>
                    {submitted && paymentErrors.cardExpiry ? paymentErrors.cardExpiry : "MM/YY"}
                  </p>
                </div>
                <div>
                  <label htmlFor="card-cvv" className="field-label">
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    inputMode="numeric"
                    type="password"
                    value={cardCvv}
                    onChange={(event) => setCardCvv(event.target.value)}
                    aria-describedby="card-cvv-help"
                    className="field-input"
                  />
                  <p id="card-cvv-help" className={`mt-1 text-xs ${submitted && paymentErrors.cardCvv ? "text-danger" : "text-muted"}`}>
                    {submitted && paymentErrors.cardCvv ? paymentErrors.cardCvv : "3 digits"}
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        <aside className="h-fit space-y-6 rounded border border-line p-5" aria-label="Order summary">
          <h2 className="text-sm font-bold uppercase text-muted">Order summary</h2>
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.item.id} className="flex gap-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={line.product.images[0]} alt="" className="h-16 w-12 bg-surface object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{line.product.name}</p>
                  <p className="text-xs text-muted">
                    {line.item.size} · {line.item.color} · Qty {line.item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(line.unitPrice * line.item.quantity)}</p>
              </li>
            ))}
          </ul>
          <CouponInput subtotal={totals.subtotal} applied={coupon} onChange={setCoupon} />
          <PriceSummary totals={totals} couponCode={coupon?.code} />
          {formError && (
            <p role="alert" className="text-sm text-danger">
              {formError}
            </p>
          )}
          <button type="submit" form="checkout-form" disabled={placing} className="btn-primary w-full">
            {placing ? "Processing payment…" : `Place order · ${formatPrice(totals.total)}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
