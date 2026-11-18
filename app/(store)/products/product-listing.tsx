"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EMPTY_FILTERS, FilterSidebar, type Filters } from "@/components/FilterSidebar";
import { Pagination } from "@/components/Pagination";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { PAGE_SIZE, PRICE_RANGES, SORT_OPTIONS } from "@/lib/constants";
import * as productStore from "@/lib/stores/product-store";
import { effectivePrice } from "@/lib/utils";
import type { Category, Product } from "@/types";

export function ProductListing() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    Promise.all([productStore.getAll(), productStore.getCategories()]).then(([items, cats]) => {
      setProducts(items);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFilters({ ...EMPTY_FILTERS, categories: categoryParam ? [categoryParam] : [] });
    setPage(1);
  }, [categoryParam, query]);

  const options = useMemo(() => {
    const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
    const sizes = Array.from(new Set(products.flatMap((product) => product.sizes)));
    const colorMap = new Map<string, { name: string; hex: string }>();
    products.forEach((product) => product.colors.forEach((color) => colorMap.set(color.name, color)));
    return { brands, sizes, colors: Array.from(colorMap.values()) };
  }, [products]);

  const results = useMemo(() => {
    const range = PRICE_RANGES.find((item) => item.id === filters.priceRange);
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (needle) {
        const haystack = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (filters.categories.length && !filters.categories.includes(product.category)) return false;
      if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
      if (filters.sizes.length && !product.sizes.some((size) => filters.sizes.includes(size))) return false;
      if (filters.colors.length && !product.colors.some((color) => filters.colors.includes(color.name))) return false;
      if (range && (effectivePrice(product) < range.min || effectivePrice(product) > range.max)) return false;
      if (product.rating < filters.minRating) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (sort === "price-desc") sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "relevance") sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    return sorted;
  }, [products, filters, sort, query]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCategory = categories.find((category) => category.id === categoryParam);
  const heading = query ? `Results for "${query}"` : activeCategory ? activeCategory.name : "All Products";

  function updateFilters(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-ink">{heading}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          {!loading && <p className="text-muted">{results.length} items found</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-outline px-4 py-2 lg:hidden"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            Filters
          </button>
          <label htmlFor="sort-by" className="sr-only">
            Sort by
          </label>
          <select
            id="sort-by"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(1);
            }}
            className="field-input w-auto"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`} aria-label="Product filters">
          <FilterSidebar
            filters={filters}
            categories={categories}
            brands={options.brands}
            sizes={options.sizes}
            colors={options.colors}
            onChange={updateFilters}
          />
        </aside>

        <section aria-label="Products">
          {loading ? (
            <ProductGridSkeleton />
          ) : results.length === 0 ? (
            <div className="rounded border border-dashed border-line py-16 text-center">
              <p className="text-lg font-bold">No products found</p>
              <p className="mt-1 text-muted">Try removing some filters or searching for something else.</p>
              <button type="button" className="btn-primary mt-6" onClick={() => updateFilters(EMPTY_FILTERS)}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
