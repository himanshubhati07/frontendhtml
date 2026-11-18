import { apiFetch } from "@/lib/api-client";
import { currentUser } from "@/lib/stores/auth-store";
import { newId, readList, writeList } from "@/lib/stores/storage";
import type { WishlistItem } from "@/types";

const KEY = "gg_wishlist";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// MOCK: stands in for GET /api/wishlist (current user's items only).
function localGetAll(): WishlistItem[] {
  const user = currentUser();
  if (!user) return [];
  return readList<WishlistItem>(KEY, []).filter((item) => item.userId === user.id);
}

// MOCK: stands in for POST /api/wishlist/items.
function localCreate(productId: string): WishlistItem | null {
  const user = currentUser();
  if (!user) return null;
  const all = readList<WishlistItem>(KEY, []);
  const existing = all.find((item) => item.userId === user.id && item.productId === productId);
  if (existing) return existing;
  const created: WishlistItem = {
    id: newId(),
    userId: user.id,
    productId,
    createdAt: new Date().toISOString(),
  };
  writeList(KEY, [created, ...all]);
  return created;
}

// MOCK: stands in for DELETE /api/wishlist/items/:id.
function localDelete(productId: string): void {
  const user = currentUser();
  if (!user) return;
  writeList(
    KEY,
    readList<WishlistItem>(KEY, []).filter(
      (item) => !(item.userId === user.id && item.productId === productId),
    ),
  );
}

export async function getAll(): Promise<WishlistItem[]> {
  if (USE_MOCK) return localGetAll();
  return apiFetch<WishlistItem[]>("/api/wishlist");
}

export async function create(productId: string): Promise<WishlistItem | null> {
  if (USE_MOCK) return localCreate(productId);
  return apiFetch<WishlistItem>("/api/wishlist/items", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function remove(productId: string): Promise<void> {
  if (USE_MOCK) return localDelete(productId);
  await apiFetch<void>(`/api/wishlist/items/${productId}`, { method: "DELETE" });
}
