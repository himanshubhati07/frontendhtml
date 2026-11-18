import Link from "next/link";

const shopLinks = [
  { label: "Men", href: "/products?category=men" },
  { label: "Women", href: "/products?category=women" },
  { label: "Kids", href: "/products?category=kids" },
  { label: "Footwear", href: "/products?category=footwear" },
];

const helpLinks = [
  { label: "My Account", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping Bag", href: "/cart" },
  { label: "Login", href: "/login" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            <span className="text-brand">green</span> <span className="text-primary">go</span>
          </p>
          <p className="mt-2 max-w-xs text-muted">
            Your destination for trending fashion, footwear and accessories from top brands.
          </p>
        </div>
        <nav aria-label="Shop">
          <h2 className="text-sm font-bold uppercase tracking-wide">Shop</h2>
          <ul className="mt-3 space-y-2 text-muted">
            {shopLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Help">
          <h2 className="text-sm font-bold uppercase tracking-wide">Your account</h2>
          <ul className="mt-3 space-y-2 text-muted">
            {helpLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © 2025 Green Go. All rights reserved.
      </p>
    </footer>
  );
}
