"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { AddressForm, type AddressValues } from "@/components/AddressForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ListSkeleton } from "@/components/Skeleton";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import * as addressStore from "@/lib/stores/address-store";
import { currentUser, logout, updateProfile } from "@/lib/stores/auth-store";
import * as cartStore from "@/lib/stores/cart-store";
import * as orderStore from "@/lib/stores/order-store";
import * as productStore from "@/lib/stores/product-store";
import { formatDate, formatPrice } from "@/lib/utils";
import { validatePhone, validateRequired } from "@/lib/validation";
import type { Address, Order, SessionUser } from "@/types";

type TabId = "profile" | "addresses" | "orders";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Orders" },
];

export function AccountView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get("tab");
  const [tab, setTab] = useState<TabId>(
    initialTab === "addresses" || initialTab === "orders" ? initialTab : "profile",
  );
  const [user, setUser] = useState<SessionUser | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Address | null>(null);

  const load = useCallback(async () => {
    const [addressList, orderList] = await Promise.all([addressStore.getAll(), orderStore.getAll()]);
    setAddresses(addressList);
    setOrders(orderList);
    setLoading(false);
  }, []);

  useEffect(() => {
    const session = currentUser();
    setUser(session);
    setName(session?.name ?? "");
    setPhone(session?.phone ?? "");
    load();
  }, [load]);
  useStoreChange(load);

  const nameError = validateRequired(name, "Name");
  const phoneError = validatePhone(phone);

  function handleProfileSubmit(event: React.FormEvent) {
    event.preventDefault();
    setProfileSubmitted(true);
    if (nameError || phoneError) {
      setProfileSaved(false);
      return;
    }
    const updated = updateProfile({ name: name.trim(), phone: phone.trim() });
    if (updated) setUser(updated);
    setProfileSaved(true);
    toast.success("Profile updated");
  }

  async function handleAddressSubmit(values: AddressValues) {
    if (editing && editing !== "new") {
      await addressStore.update(editing.id, values);
      toast.success("Address updated");
    } else {
      await addressStore.create(values);
      toast.success("Address added");
    }
    setEditing(null);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await addressStore.remove(pendingDelete.id);
    toast.success("Address deleted");
    setPendingDelete(null);
  }

  async function handleReorder(order: Order) {
    const products = await productStore.getAll();
    for (const item of order.items) {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (product && product.stock > 0) {
        await cartStore.create(
          {
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            priceAtAdd: item.unitPrice,
          },
          product.stock,
        );
      }
    }
    toast.success("Items added to your bag");
    router.push("/cart");
  }

  function handleLogout() {
    logout();
    setLogoutOpen(false);
    toast.success("You have been logged out");
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My account</h1>
          <p className="text-muted">{user?.name} · {user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/wishlist" className="btn-outline px-4 py-2">
            My wishlist
          </Link>
          <button type="button" onClick={() => setLogoutOpen(true)} className="btn-primary px-4 py-2">
            Logout
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Account sections" className="mb-6 flex gap-6 border-b border-line">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`-mb-px border-b-2 pb-3 text-sm font-bold uppercase ${
              tab === item.id ? "border-primary text-primary" : "border-transparent text-muted"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile">
          <form onSubmit={handleProfileSubmit} noValidate className="max-w-md space-y-4">
            <div>
              <label htmlFor="profile-email" className="field-label">
                Email
              </label>
              <input id="profile-email" value={user?.email ?? ""} readOnly className="field-input bg-surface" />
            </div>
            <div>
              <label htmlFor="profile-name" className="field-label">
                Full name
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-describedby="profile-name-error"
                className="field-input"
              />
              {profileSubmitted && nameError && (
                <p id="profile-name-error" className="mt-1 text-xs text-danger">
                  {nameError}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="profile-phone" className="field-label">
                Mobile number
              </label>
              <input
                id="profile-phone"
                value={phone}
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                aria-describedby="profile-phone-help"
                className="field-input"
              />
              <p id="profile-phone-help" className={`mt-1 text-xs ${profileSubmitted && phoneError ? "text-danger" : "text-muted"}`}>
                {profileSubmitted && phoneError ? phoneError : "10-digit number starting with 6-9"}
              </p>
            </div>
            {profileSaved && (
              <p role="status" className="text-sm font-semibold text-success">
                Your profile has been saved.
              </p>
            )}
            <button type="submit" className="btn-primary">
              Save changes
            </button>
          </form>
        </section>
      )}

      {tab === "addresses" && (
        <section id="panel-addresses" role="tabpanel" aria-labelledby="tab-addresses">
          {loading ? (
            <ListSkeleton rows={2} />
          ) : editing ? (
            <div className="max-w-2xl rounded border border-line p-5">
              <h2 className="mb-4 font-bold">{editing === "new" ? "Add new address" : "Edit address"}</h2>
              <AddressForm
                idPrefix="account-address"
                initial={editing === "new" ? undefined : editing}
                submitLabel="Save address"
                onSubmit={handleAddressSubmit}
                onCancel={() => setEditing(null)}
              />
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setEditing("new")} className="btn-outline mb-4 px-4 py-2">
                + Add new address
              </button>
              {addresses.length === 0 ? (
                <p className="rounded border border-dashed border-line py-12 text-center text-muted">
                  No saved addresses yet — add one to speed up checkout.
                </p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <li key={address.id} className="rounded border border-line p-4">
                      <p className="font-bold">
                        {address.name}
                        {address.isDefault && (
                          <span className="ml-2 rounded bg-brand-soft px-1.5 py-0.5 text-xs text-brand-dark">DEFAULT</span>
                        )}
                      </p>
                      <p className="text-muted">
                        {address.street}, {address.city}, {address.state} – {address.postalCode}, {address.country}
                      </p>
                      <p className="text-muted">Mobile: {address.phone}</p>
                      <div className="mt-3 flex gap-4 text-sm font-bold uppercase">
                        <button type="button" onClick={() => setEditing(address)} className="text-primary hover:underline">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(address)}
                          className="text-muted hover:text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}

      {tab === "orders" && (
        <section id="panel-orders" role="tabpanel" aria-labelledby="tab-orders">
          {loading ? (
            <ListSkeleton />
          ) : orders.length === 0 ? (
            <div className="rounded border border-dashed border-line py-16 text-center">
              <p className="text-lg font-bold">No orders yet</p>
              <p className="text-muted">When you place an order it will show up here.</p>
              <Link href="/products" className="btn-primary mt-5">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="rounded border border-line p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold">Order {order.id}</p>
                      <p className="text-xs text-muted">
                        Placed {formatDate(order.createdAt)} · Arrives by {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                    <span className="rounded bg-brand-soft px-2 py-1 text-xs font-bold text-brand-dark">
                      {order.status}
                    </span>
                  </div>
                  <ul className="my-3 flex gap-2 overflow-x-auto">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="h-20 w-16 bg-surface object-cover" />
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <div className="flex gap-3">
                      <Link href={`/order-confirmation/${order.id}`} className="btn-outline px-3 py-2 text-xs">
                        View details
                      </Link>
                      <button type="button" onClick={() => handleReorder(order)} className="btn-primary px-3 py-2 text-xs">
                        Reorder
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        message="You will need to log in again to access your account."
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete address?"
        message="This address will be permanently removed from your account."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
