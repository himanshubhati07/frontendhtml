import { apiFetch } from "@/lib/api-client";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { newId, readList, writeList } from "@/lib/stores/storage";
import type { CartItem } from "@/types";

const KEY = "gg_cart";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// MOCK: stands in for GET /api/cart.
function localGetAll(): CartItem[] {
  return readList<CartItem>(KEY, []);
}

// MOCK: stands in for POST /api/cart/items (merges identical product/size/color lines).
function localCreate(input: Omit<CartItem, "id" | "createdAt">, maxStock: number): CartItem {
  const all = localGetAll();
  const limit = Math.min(maxStock, MAX_QUANTITY_PER_ITEM);
  const existing = all.find(
    (item) =>
      item.productId === input.productId &&
      item.size === input.size &&
      item.color === input.color,
  );
  if (existing) {
    const merged = { ...existing, quantity: Math.min(existing.quantity + input.quantity, limit) };
    writeList(KEY, all.map((item) => (item.id === existing.id ? merged : item)));
    return merged;
  }
  const created: CartItem = {
    ...input,
    quantity: Math.min(input.quantity, limit),
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  writeList(KEY, [created, ...all]);
  return created;
}

// MOCK: stands in for PUT /api/cart/items/:id.
function localUpdate(id: string, quantity: number): void {
  writeList(
    KEY,
    localGetAll().map((item) => (item.id === id ? { ...item, quantity } : item)),
  );
}

// MOCK: stands in for DELETE /api/cart/items/:id.
function localDelete(id: string): void {
  writeList(KEY, localGetAll().filter((item) => item.id !== id));
}

export async function getAll(): Promise<CartItem[]> {
  if (USE_MOCK) return localGetAll();
  return apiFetch<CartItem[]>("/api/cart");
}

export async function create(
  input: Omit<CartItem, "id" | "createdAt">,
  maxStock: number,
): Promise<CartItem> {
  if (USE_MOCK) return localCreate(input, maxStock);
  return apiFetch<CartItem>("/api/cart/items", { method: "POST", body: JSON.stringify(input) });
}

export async function update(id: string, quantity: number): Promise<void> {
  if (USE_MOCK) return localUpdate(id, quantity);
  await apiFetch<CartItem>(`/api/cart/items/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function remove(id: string): Promise<void> {
  if (USE_MOCK) return localDelete(id);
  await apiFetch<void>(`/api/cart/items/${id}`, { method: "DELETE" });
}

export async function clear(): Promise<void> {
  // MOCK: stands in for clearing the server cart after a successful order.
  writeList(KEY, []);
}
