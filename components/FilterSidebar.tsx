"use client";

import { PRICE_RANGES } from "@/lib/constants";
import type { Category, ProductColor } from "@/types";

export interface Filters {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: string;
  minRating: number;
}

export const EMPTY_FILTERS: Filters = {
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: "",
  minRating: 0,
};

interface FilterSidebarProps {
  filters: Filters;
  categories: Category[];
  brands: string[];
  sizes: string[];
  colors: ProductColor[];
  onChange: (filters: Filters) => void;
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function FilterSidebar({
  filters,
  categories,
  brands,
  sizes,
  colors,
  onChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Filters</h2>
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-xs font-bold uppercase text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Categories</legend>
        {categories.map((category) => (
          <label key={category.id} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="checkbox"
              checked={filters.categories.includes(category.id)}
              onChange={() =>
                onChange({ ...filters, categories: toggleValue(filters.categories, category.id) })
              }
              className="h-4 w-4 accent-primary"
            />
            {category.name}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Brand</legend>
        <div className="max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => onChange({ ...filters, brands: toggleValue(filters.brands, brand) })}
                className="h-4 w-4 accent-primary"
              />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Price</legend>
        {PRICE_RANGES.map((range) => (
          <label key={range.id} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="price-range"
              checked={filters.priceRange === range.id}
              onChange={() => onChange({ ...filters, priceRange: range.id })}
              className="h-4 w-4 accent-primary"
            />
            {range.label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, sizes: toggleValue(filters.sizes, size) })}
                className={`rounded border px-2.5 py-1 text-xs font-semibold ${
                  active ? "border-primary bg-primary-soft text-primary" : "border-line hover:border-ink"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Color</legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                aria-pressed={active}
                title={color.name}
                onClick={() => onChange({ ...filters, colors: toggleValue(filters.colors, color.name) })}
                className={`h-7 w-7 rounded-full border-2 ${
                  active ? "border-primary ring-2 ring-primary/30" : "border-line"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-bold uppercase">Customer rating</legend>
        {[4, 3, 2].map((rating) => (
          <label key={rating} className="flex cursor-pointer items-center gap-2 py-1">
            <input
              type="radio"
              name="min-rating"
              checked={filters.minRating === rating}
              onChange={() => onChange({ ...filters, minRating: rating })}
              className="h-4 w-4 accent-primary"
            />
            {rating}★ &amp; above
          </label>
        ))}
      </fieldset>
    </div>
  );
}
