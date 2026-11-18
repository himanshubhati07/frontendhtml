# green go — Routes & Navigation

## How to run
cd /workspace/frontend_runs/49170532-d91c-450c-bbfa-44603074795d/project
npm install --legacy-peer-deps && npx next dev -p 51079
Then open http://localhost:51079

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | app/(store)/page.tsx | Home: banner carousel, category grid, top-rated and deal products, promo |
| /products | app/(store)/products/page.tsx | Listing and search results (?category=, ?q=) with filters, sort, pagination |
| /products/[id] | app/(store)/products/[id]/page.tsx | Product detail: gallery, size/color/qty, add to bag, wishlist, reviews |
| /cart | app/(store)/cart/page.tsx | Shopping bag, quantities, coupon, price summary |
| /checkout | app/(store)/(protected)/checkout/page.tsx | Address, payment method, coupon, place order (login required) |
| /order-confirmation/[id] | app/(store)/(protected)/order-confirmation/[id]/page.tsx | Order success and details |
| /wishlist | app/(store)/(protected)/wishlist/page.tsx | Saved items, move to bag, remove |
| /account | app/(store)/(protected)/account/page.tsx | Profile, addresses, order history, logout (?tab=orders) |
| /login | app/login/page.tsx | Login with social-login placeholders |
| /signup | app/signup/page.tsx | Registration |
| /forgot-password | app/forgot-password/page.tsx | Password reset request |
| any unknown URL | app/not-found.tsx | 404 with Go Home |

## Navigation map
- Header logo -> Home; category links -> Products (?category=); search submit -> Products (?q=)
- Header icons -> Login/Account, Wishlist, Cart
- Home -> Products (category tile, View all, banner CTA, promo CTA); Home -> ProductDetail (product card)
- Products -> ProductDetail (card); ProductDetail -> Products (breadcrumb); ProductDetail -> Cart (Add to bag)
- ProductDetail / ProductCard heart -> Wishlist store (redirects to Login when signed out)
- Cart -> Checkout (Proceed); Cart -> Products (Continue shopping)
- Checkout -> Cart (Back); Checkout -> OrderConfirmation (Place order)
- OrderConfirmation -> Home (Continue shopping); -> Account orders tab (View my orders)
- Wishlist -> ProductDetail; Wishlist -> Cart (Move to bag)
- Account -> Wishlist; Account -> Cart (Reorder); Account -> OrderConfirmation (View details); Account -> Login (Logout, confirmed)
- Cart/Checkout/Wishlist/Account while signed out -> Login (AuthGate), then back to the requested page
- Login <-> Signup; Login -> Forgot password; Login/Signup success -> Home
- Any page -> NotFound (unknown URL)

## Shared components
- Header, Footer: site chrome (search, nav, bag count)
- AuthGate: client-side route protection; AuthShell: login/signup layout
- BannerCarousel, CategoryGrid, ProductCard, FilterSidebar, Pagination, StarRating
- QuantitySelector, CouponInput, PriceSummary, AddressForm
- ConfirmDialog: accessible confirm modal; Skeleton: loading placeholders; Icons: inline Heroicons

## Design tokens
primary, primary-dark, primary-soft, secondary, brand, brand-dark, brand-soft, surface, ink, muted, line, success, danger, warning, disabled (see tailwind.config.ts).
