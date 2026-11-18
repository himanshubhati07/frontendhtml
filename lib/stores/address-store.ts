import { apiFetch } from "@/lib/api-client";
import { currentUser } from "@/lib/stores/auth-store";
import { newId, readList, writeList } from "@/lib/stores/storage";
import type { Address } from "@/types";

const KEY = "gg_addresses";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

type AddressInput = Omit<Address, "id" | "userId" | "createdAt">;

// MOCK: stands in for GET /api/user/addresses.
function localGetAll(): Address[] {
  const user = currentUser();
  if (!user) return [];
  return readList<Address>(KEY, []).filter((address) => address.userId === user.id);
}

function withDefault(all: Address[], userId: string, defaultId: string): Address[] {
  return all.map((address) =>
    address.userId === userId ? { ...address, isDefault: address.id === defaultId } : address,
  );
}

// MOCK: stands in for POST /api/user/addresses.
function localCreate(input: AddressInput): Address {
  const user = currentUser();
  const all = readList<Address>(KEY, []);
  const userId = user?.id ?? "";
  const isFirst = !all.some((address) => address.userId === userId);
  const created: Address = {
    ...input,
    id: newId(),
    userId,
    isDefault: input.isDefault || isFirst,
    createdAt: new Date().toISOString(),
  };
  const next = [created, ...all];
  writeList(KEY, created.isDefault ? withDefault(next, userId, created.id) : next);
  return created;
}

// MOCK: stands in for PUT /api/user/addresses/:id.
function localUpdate(id: string, input: AddressInput): void {
  const all = readList<Address>(KEY, []);
  const target = all.find((address) => address.id === id);
  if (!target) return;
  const next = all.map((address) => (address.id === id ? { ...address, ...input } : address));
  writeList(KEY, input.isDefault ? withDefault(next, target.userId, id) : next);
}

// MOCK: stands in for DELETE /api/user/addresses/:id.
function localDelete(id: string): void {
  writeList(KEY, readList<Address>(KEY, []).filter((address) => address.id !== id));
}

export async function getAll(): Promise<Address[]> {
  if (USE_MOCK) return localGetAll();
  return apiFetch<Address[]>("/api/user/addresses");
}

export async function create(input: AddressInput): Promise<Address> {
  if (USE_MOCK) return localCreate(input);
  return apiFetch<Address>("/api/user/addresses", { method: "POST", body: JSON.stringify(input) });
}

export async function update(id: string, input: AddressInput): Promise<void> {
  if (USE_MOCK) return localUpdate(id, input);
  await apiFetch<Address>(`/api/user/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function remove(id: string): Promise<void> {
  if (USE_MOCK) return localDelete(id);
  await apiFetch<void>(`/api/user/addresses/${id}`, { method: "DELETE" });
}
