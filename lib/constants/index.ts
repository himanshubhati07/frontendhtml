export const ROUTES = {
  home: "/",
  products: "/products",
  cart: "/cart",
  checkout: "/checkout",
  wishlist: "/wishlist",
  account: "/account",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
} as const;

export const PAGE_SIZE = 8;
export const TAX_RATE = 0.05;
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;
export const MAX_QUANTITY_PER_ITEM = 10;
export const DELIVERY_DAYS = 5;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
] as const;

export const PRICE_RANGES = [
  { id: "0-999", label: "Under ₹999", min: 0, max: 999 },
  { id: "1000-1999", label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { id: "2000-3999", label: "₹2,000 – ₹3,999", min: 2000, max: 3999 },
  { id: "4000-99999", label: "₹4,000 & above", min: 4000, max: 99999 },
] as const;

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", hint: "Pay with any UPI app" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", hint: "All major banks supported" },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when your order arrives" },
] as const;
