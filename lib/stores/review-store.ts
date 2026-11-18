import { apiFetch } from "@/lib/api-client";
import { mockReviews } from "@/lib/mock-data";
import { newId, readList, writeList } from "@/lib/stores/storage";
import type { Review } from "@/types";

const KEY = "gg_reviews";

// TODO(USE_MOCK): verify path + response shape against the real
// backend's OpenAPI schema before flipping this to false.
export const USE_MOCK = true;

// MOCK: stands in for GET /api/products/:id reviews, newest first.
function localGetByProduct(productId: string): Review[] {
  return readList<Review>(KEY, mockReviews)
    .filter((review) => review.productId === productId)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

// MOCK: stands in for POST /api/reviews.
function localCreate(input: Omit<Review, "id" | "createdAt">): Review {
  const created: Review = { ...input, id: newId(), createdAt: new Date().toISOString() };
  writeList(KEY, [created, ...readList<Review>(KEY, mockReviews)]);
  return created;
}

export async function getByProduct(productId: string): Promise<Review[]> {
  if (USE_MOCK) return localGetByProduct(productId);
  return apiFetch<Review[]>(`/api/reviews?productId=${productId}`);
}

export async function create(input: Omit<Review, "id" | "createdAt">): Promise<Review> {
  if (USE_MOCK) return localCreate(input);
  return apiFetch<Review>("/api/reviews", { method: "POST", body: JSON.stringify(input) });
}
