# green go

Green Go is a Myntra-style fashion marketplace front end: browse and search products, filter and sort listings, view product details and reviews, manage a bag and wishlist, check out with an address, payment method and coupon, and review order history and saved addresses in an account area.

## Tech stack
Next.js 14 (App Router) + TypeScript, Tailwind CSS v3, react-hot-toast, Vitest.

## Getting started
```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
Then open http://localhost:51079

Demo login: demo@greengo.com / password123. Demo coupons: GREEN10, WELCOME200.

## Environment variables
See .env.example. NEXT_PUBLIC_API_URL is optional — every entity runs on
local mock data (USE_MOCK = true in lib/stores/) until it's set and each
entity's flag is flipped to false.

## Project structure
- app/ — App Router pages: (store) group with header/footer, (protected) sub-group behind AuthGate, plus login, signup, forgot-password
- components/ — shared UI (Header, Footer, ProductCard, FilterSidebar, forms, dialogs)
- lib/ — mock-data.ts, api-client.ts, and:
  - lib/stores/ — localStorage-backed stores gated by USE_MOCK
  - lib/hooks/ — shared hooks (wishlist, cart details, store change)
  - lib/constants/ — routes, pricing and filter constants
  - lib/validation/ — shared field validators
  - lib/utils/ — price, date and totals helpers
- types/ — shared TypeScript types
