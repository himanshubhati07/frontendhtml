"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSkeleton, Skeleton } from "@/components/Skeleton";
import * as productStore from "@/lib/stores/product-store";
import type { Banner, Category, Product } from "@/types";

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productStore.getBanners(),
      productStore.getCategories(),
      productStore.getAll(),
    ]).then(([bannerList, categoryList, productList]) => {
      setBanners(bannerList);
      setCategories(categoryList);
      setProducts(productList);
      setLoading(false);
    });
  }, []);

  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const deals = products.filter((product) => product.discountPrice).slice(0, 4);

  return (
    <div>
      {loading ? <Skeleton className="h-64 w-full md:h-80" /> : <BannerCarousel banners={banners} />}

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-10">
        <section aria-labelledby="shop-by-category">
          <h1 id="shop-by-category" className="mb-6 text-2xl font-bold uppercase tracking-wide">
            Shop by category
          </h1>
          {loading ? <Skeleton className="h-40 w-full" /> : <CategoryGrid categories={categories} />}
        </section>

        <section aria-labelledby="featured">
          <div className="mb-6 flex items-end justify-between">
            <h2 id="featured" className="text-2xl font-bold uppercase tracking-wide">
              Top rated picks
            </h2>
            <Link href="/products" className="text-sm font-bold uppercase text-primary hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section
          aria-label="Promotion"
          className="rounded-lg bg-brand-soft px-6 py-10 text-center md:px-16"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-brand-dark">New customer offer</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink">Flat ₹200 off your first order</h2>
          <p className="mt-2 text-muted">
            Use code <span className="rounded bg-white px-2 py-0.5 font-bold text-brand-dark">WELCOME200</span> on
            orders above ₹1,499, or <span className="font-bold text-brand-dark">GREEN10</span> for 10% off.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Start shopping
          </Link>
        </section>

        <section aria-labelledby="deals">
          <h2 id="deals" className="mb-6 text-2xl font-bold uppercase tracking-wide">
            Deals of the day
          </h2>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
              {deals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
