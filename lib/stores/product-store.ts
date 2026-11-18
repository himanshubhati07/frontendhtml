import { apiFetch } from "@/lib/api-client";
import { mockBanners, mockCategories, mockProducts } from "@/lib/mock-data";
import type { Banner, Category, Product } from "@/types";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// MOCK: stands in for GET /api/products (full catalog; filtering is client-side).
function localGetAll(): Product[] {
  return mockProducts;
}

// MOCK: stands in for GET /api/products/:id.
function localGetById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

export async function getAll(): Promise<Product[]> {
  if (USE_MOCK) return localGetAll();
  return apiFetch<Product[]>("/api/products");
}

export async function getById(id: string): Promise<Product | undefined> {
  if (USE_MOCK) return localGetById(id);
  return apiFetch<Product>(`/api/products/${id}`);
}

export async function getCategories(): Promise<Category[]> {
  // MOCK: stands in for GET /api/categories.
  if (USE_MOCK) return mockCategories;
  return apiFetch<Category[]>("/api/categories");
}

export async function getBanners(): Promise<Banner[]> {
  // MOCK: stands in for CMS-driven homepage banners.
  return mockBanners;
}
