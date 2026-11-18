"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/Icons";
import { useStoreChange } from "@/lib/hooks/useStoreChange";
import { isAuthenticated } from "@/lib/stores/auth-store";
import * as cartStore from "@/lib/stores/cart-store";
import { getCategories } from "@/lib/stores/product-store";
import type { Category } from "@/types";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authed, setAuthed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const refresh = useCallback(async () => {
    setAuthed(isAuthenticated());
    const items = await cartStore.getAll();
    setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    refresh();
    getCategories().then(setCategories);
  }, [refresh]);
  useStoreChange(refresh);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <button
          type="button"
          className="rounded p-1 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Link href="/" className="flex items-center gap-1 text-xl font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">G</span>
          <span className="text-brand">green</span>
          <span className="text-primary">go</span>
        </Link>

        <nav aria-label="Categories" className="ml-4 hidden items-center gap-6 lg:flex">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="border-b-4 border-transparent py-5 text-sm font-bold uppercase tracking-wide hover:border-primary"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} role="search" className="ml-auto hidden max-w-md flex-1 md:block">
          <label htmlFor="header-search" className="sr-only">
            Search for products, brands and more
          </label>
          <div className="flex items-center rounded bg-surface px-3">
            <SearchIcon className="h-5 w-5 text-muted" />
            <input
              id="header-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-4 md:ml-0">
          <Link
            href={authed ? "/account" : "/login"}
            className="flex flex-col items-center text-xs font-semibold"
            aria-label={authed ? "My account" : "Log in"}
          >
            <UserIcon className="h-5 w-5" />
            <span className="hidden sm:block">{authed ? "Account" : "Login"}</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center text-xs font-semibold" aria-label="Wishlist">
            <HeartIcon className="h-5 w-5" />
            <span className="hidden sm:block">Wishlist</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex flex-col items-center text-xs font-semibold"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <BagIcon className="h-5 w-5" />
            <span className="hidden sm:block">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          <form onSubmit={handleSearch} role="search" className="my-3 md:hidden">
            <label htmlFor="mobile-search" className="sr-only">
              Search for products
            </label>
            <input
              id="mobile-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products, brands and more"
              className="field-input"
            />
          </form>
          <nav aria-label="Mobile categories" className="flex flex-col">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="border-b border-line py-3 text-sm font-bold uppercase"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
