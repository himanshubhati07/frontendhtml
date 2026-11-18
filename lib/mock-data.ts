// MOCK DATA — placeholder records for local development only.
// Replace with real API data before production use.
import type {
  Banner,
  Category,
  Coupon,
  Product,
  ProductColor,
  Review,
  User,
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Aarav Sharma",
    email: "demo@greengo.com",
    phone: "9876543210",
    password: "password123",
    role: "user",
  },
  {
    id: "u2",
    name: "Priya Nair",
    email: "priya@greengo.com",
    phone: "9123456780",
    password: "password123",
    role: "user",
  },
];

export const mockCategories: Category[] = [
  { id: "men", name: "Men", tagline: "Shirts, tees & jackets", image: "https://picsum.photos/seed/gg-cat-men/400/400" },
  { id: "women", name: "Women", tagline: "Kurtas, dresses & more", image: "https://picsum.photos/seed/gg-cat-women/400/400" },
  { id: "kids", name: "Kids", tagline: "Playful everyday wear", image: "https://picsum.photos/seed/gg-cat-kids/400/400" },
  { id: "footwear", name: "Footwear", tagline: "Sneakers & sandals", image: "https://picsum.photos/seed/gg-cat-footwear/400/400" },
  { id: "accessories", name: "Accessories", tagline: "Bags, watches & more", image: "https://picsum.photos/seed/gg-cat-accessories/400/400" },
  { id: "beauty", name: "Beauty", tagline: "Skincare & grooming", image: "https://picsum.photos/seed/gg-cat-beauty/400/400" },
];

const palette: Record<string, ProductColor> = {
  black: { name: "Black", hex: "#212121" },
  white: { name: "White", hex: "#F5F5F5" },
  navy: { name: "Navy", hex: "#1F2A44" },
  red: { name: "Red", hex: "#C62828" },
  green: { name: "Green", hex: "#2A9D8F" },
  olive: { name: "Olive", hex: "#6B7A3A" },
  pink: { name: "Pink", hex: "#E58CA5" },
  yellow: { name: "Yellow", hex: "#F4C430" },
  blue: { name: "Blue", hex: "#3B6FB6" },
  brown: { name: "Brown", hex: "#7B5238" },
};

const apparelSizes = ["S", "M", "L", "XL"];
const shoeSizes = ["6", "7", "8", "9", "10"];

function buildProduct(
  index: number,
  name: string,
  brand: string,
  category: string,
  price: number,
  discountPrice: number | undefined,
  rating: number,
  reviewCount: number,
  sizes: string[],
  colorKeys: string[],
  description: string,
  stock = 25,
): Product {
  const id = `p${index}`;
  return {
    id,
    name,
    description,
    brand,
    category,
    price,
    discountPrice,
    images: [1, 2, 3, 4].map((n) => `https://picsum.photos/seed/gg-${id}-${n}/600/800`),
    sizes,
    colors: colorKeys.map((key) => palette[key]),
    stock,
    rating,
    reviewCount,
    createdAt: new Date(2025, 0, 1 + index * 6).toISOString(),
  };
}

export const mockProducts: Product[] = [
  buildProduct(1, "Slim Fit Cotton Shirt", "Roadster", "men", 1799, 899, 4.3, 1280, apparelSizes, ["white", "blue", "navy"], "A breathable slim-fit cotton shirt with a spread collar and full sleeves. Easy to dress up or down."),
  buildProduct(2, "Graphic Print Round Neck T-shirt", "HRX", "men", 999, 499, 4.1, 3420, apparelSizes, ["black", "olive", "red"], "Soft combed-cotton tee with a bold graphic print for everyday comfort."),
  buildProduct(3, "Water-Resistant Bomber Jacket", "Highlander", "men", 4499, 2699, 4.5, 540, apparelSizes, ["olive", "black"], "Lightweight bomber with ribbed cuffs and zip pockets, made to handle drizzly evenings.", 12),
  buildProduct(4, "Embroidered Anarkali Kurta", "Libas", "women", 2999, 1499, 4.4, 2210, apparelSizes, ["pink", "green", "yellow"], "Flared anarkali kurta with delicate thread embroidery on the yoke and flowing hem."),
  buildProduct(5, "Floral Wrap Midi Dress", "Zara Bloom", "women", 3499, 2099, 4.2, 870, apparelSizes, ["red", "navy"], "A flattering wrap midi dress in a floral print, with flutter sleeves and tie waist."),
  buildProduct(6, "High-Rise Skinny Jeans", "Levis", "women", 3299, undefined, 4.6, 4120, ["28", "30", "32", "34"], ["blue", "black"], "Stretch-denim skinny jeans with a high waist and clean hem, built to keep their shape."),
  buildProduct(7, "Dino Print Cotton Pyjama Set", "Hopscotch", "kids", 1199, 599, 4.5, 960, ["2-3Y", "4-5Y", "6-7Y"], ["green", "blue"], "A cozy two-piece night set in pure cotton with a playful dino print."),
  buildProduct(8, "Boys Denim Dungarees", "Kidsville", "kids", 1599, 959, 4.0, 310, ["2-3Y", "4-5Y", "6-7Y"], ["blue"], "Durable denim dungarees with adjustable straps and roomy pockets for active kids."),
  buildProduct(9, "Girls Tulle Party Frock", "Hopscotch", "kids", 1999, 1199, 4.3, 420, ["2-3Y", "4-5Y", "6-7Y"], ["pink", "yellow"], "Twirl-ready tulle frock with a satin bow and soft inner lining.", 8),
  buildProduct(10, "Mesh Running Shoes", "Puma", "footwear", 4999, 2999, 4.4, 5600, shoeSizes, ["black", "blue", "red"], "Cushioned mesh running shoes with a grippy outsole and breathable upper."),
  buildProduct(11, "Classic White Sneakers", "Nike", "footwear", 5499, undefined, 4.7, 7800, shoeSizes, ["white"], "Minimal low-top leather sneakers that go with everything in your wardrobe."),
  buildProduct(12, "Leather Strap Sandals", "Woodland", "footwear", 2799, 1679, 4.1, 690, shoeSizes, ["brown", "black"], "Hand-stitched leather sandals with a cushioned footbed for all-day wear."),
  buildProduct(13, "Analog Chronograph Watch", "Fossil", "accessories", 9999, 6499, 4.6, 1130, ["One Size"], ["brown", "black"], "Stainless-steel chronograph with a leather strap and water resistance up to 50m.", 6),
  buildProduct(14, "Canvas Everyday Backpack", "Wildcraft", "accessories", 2499, 1499, 4.3, 2380, ["One Size"], ["olive", "navy", "black"], "A 25L backpack with padded laptop sleeve, water-bottle pockets and sturdy straps."),
  buildProduct(15, "Polarised Aviator Sunglasses", "Fastrack", "accessories", 1799, 1079, 4.2, 1760, ["One Size"], ["black", "brown"], "UV-protected polarised aviators with a lightweight metal frame."),
  buildProduct(16, "Vitamin C Face Serum", "Minimalist", "beauty", 699, 559, 4.5, 9210, ["30ml"], ["yellow"], "10% Vitamin C serum that brightens skin and fades dark spots with regular use.", 60),
  buildProduct(17, "Charcoal Detox Face Wash", "Mamaearth", "beauty", 349, undefined, 4.0, 5340, ["100ml"], ["black"], "Gentle charcoal face wash that deep-cleans pores without drying out your skin.", 80),
  buildProduct(18, "Beard Care Grooming Kit", "Beardo", "beauty", 1299, 779, 4.2, 1450, ["Standard"], ["brown"], "Beard oil, wash and comb in a gift-ready box for a well-groomed look.", 0),
];

export const mockReviews: Review[] = [
  { id: "r1", productId: "p1", userId: "u2", userName: "Priya Nair", rating: 5, title: "Perfect fit", comment: "Fabric is soft and the fit is exactly as shown. Great value for the price.", createdAt: "2025-03-02T10:00:00.000Z" },
  { id: "r2", productId: "p1", userId: "u1", userName: "Aarav Sharma", rating: 4, title: "Good quality", comment: "Stitching is neat. Colour is slightly lighter than pictures but still nice.", createdAt: "2025-03-14T10:00:00.000Z" },
  { id: "r3", productId: "p10", userId: "u2", userName: "Priya Nair", rating: 5, title: "Super comfortable", comment: "Used them for a 10K run and my feet felt great. Highly recommended.", createdAt: "2025-02-11T10:00:00.000Z" },
  { id: "r4", productId: "p10", userId: "u1", userName: "Aarav Sharma", rating: 4, title: "Light and grippy", comment: "Very light. Sizing runs a little small so go half a size up.", createdAt: "2025-02-20T10:00:00.000Z" },
  { id: "r5", productId: "p4", userId: "u2", userName: "Priya Nair", rating: 5, title: "Festive favourite", comment: "Got so many compliments at a family function. The embroidery is lovely.", createdAt: "2025-01-18T10:00:00.000Z" },
  { id: "r6", productId: "p11", userId: "u1", userName: "Aarav Sharma", rating: 5, title: "Timeless", comment: "Clean look and the leather is great quality. Goes with jeans and chinos.", createdAt: "2025-04-01T10:00:00.000Z" },
  { id: "r7", productId: "p16", userId: "u2", userName: "Priya Nair", rating: 4, title: "Visible glow", comment: "Skin looks brighter after three weeks. Slight tingle at first.", createdAt: "2025-03-28T10:00:00.000Z" },
];

export const mockCoupons: Coupon[] = [
  { id: "c1", code: "GREEN10", description: "10% off on orders above ₹499", discountType: "percent", discountValue: 10, minOrderValue: 499, expiryDate: "2030-12-31T00:00:00.000Z", usageLimit: 1000, timesUsed: 120 },
  { id: "c2", code: "WELCOME200", description: "Flat ₹200 off on orders above ₹1,499", discountType: "flat", discountValue: 200, minOrderValue: 1499, expiryDate: "2030-12-31T00:00:00.000Z", usageLimit: 500, timesUsed: 42 },
  { id: "c3", code: "OLDSALE50", description: "50% off (expired)", discountType: "percent", discountValue: 50, minOrderValue: 0, expiryDate: "2023-01-01T00:00:00.000Z", usageLimit: 100, timesUsed: 100 },
];

export const mockBanners: Banner[] = [
  { id: "b1", title: "End of Season Sale", subtitle: "Up to 60% off on top fashion brands", cta: "Shop the sale", href: "/products", gradient: "from-primary to-secondary" },
  { id: "b2", title: "Sneaker Fest", subtitle: "Fresh kicks from Nike, Puma & more", cta: "Explore footwear", href: "/products?category=footwear", gradient: "from-brand to-brand-dark" },
  { id: "b3", title: "Ethnic Edit", subtitle: "Festive kurtas and occasion wear", cta: "Shop women", href: "/products?category=women", gradient: "from-secondary to-primary" },
];
