import Link from "next/link";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group block text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="aspect-square overflow-hidden rounded-full bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={category.image}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <p className="mt-2 font-bold">{category.name}</p>
          <p className="text-xs text-muted">{category.tagline}</p>
        </Link>
      ))}
    </div>
  );
}
