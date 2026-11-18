import { apiFetch } from "@/lib/api-client";
import { currentUser } from "@/lib/stores/auth-store";
import { readList, writeList } from "@/lib/stores/storage";
import type { Order } from "@/types";

const KEY = "gg_orders";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// MOCK: stands in for GET /api/orders (current user's history only).
function localGetAll(): Order[] {
  const user = currentUser();
  if (!user) return [];
  return readList<Order>(KEY, []).filter((order) => order.userId === user.id);
}

// MOCK: stands in for GET /api/orders/:id.
function localGetById(id: string): Order | undefined {
  return localGetAll().find((order) => order.id === id);
}

// MOCK: stands in for POST /api/orders (after a successful payment).
function localCreate(input: Omit<Order, "id" | "createdAt" | "userId">): Order {
  const user = currentUser();
  const order: Order = {
    ...input,
    id: `GG${Date.now().toString().slice(-8)}`,
    userId: user?.id ?? "",
    createdAt: new Date().toISOString(),
  };
  writeList(KEY, [order, ...readList<Order>(KEY, [])]);
  return order;
}

export async function getAll(): Promise<Order[]> {
  if (USE_MOCK) return localGetAll();
  return apiFetch<Order[]>("/api/orders");
}

export async function getById(id: string): Promise<Order | undefined> {
  if (USE_MOCK) return localGetById(id);
  return apiFetch<Order>(`/api/orders/${id}`);
}

export async function create(input: Omit<Order, "id" | "createdAt" | "userId">): Promise<Order> {
  if (USE_MOCK) return localCreate(input);
  return apiFetch<Order>("/api/orders", { method: "POST", body: JSON.stringify(input) });
}
