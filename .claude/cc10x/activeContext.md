# Active Context

**Project:** Manna Kitchen Website
**Last Updated:** 2026-01-28
**Status:** Phase 2 Complete - Docker Build Working

## Current Focus

Phase 2: Core Ordering Flow - All fixes applied and verified

## Recent Changes

### Docker Build Fixes (2026-01-28)

**Problem:** Astro static site generation failing with multiple errors:
1. Default export mismatch - Cart/CheckoutForm imported as default but exported as named
2. SSR context errors - React components using cart context failed during static build
3. Port conflict - Development port 8080 already in use

**Solution Applied:**

1. **Export Pattern Fix** (commits: bfef408)
   - Changed `export function Cart()` → `export default function Cart()`
   - Changed `export function CheckoutForm()` → `export default function CheckoutForm()`
   - Files: `src/components/react/Cart.tsx`, `src/components/react/CheckoutForm.tsx`

2. **SSR Hydration Fix** (commits: 6938d5a, 1be4bf1)
   - Changed `client:load` → `client:only="react"` for all cart-dependent components
   - Prevents SSR rendering of components that require CartProvider context
   - Files modified:
     - `src/components/Header.astro` - CartIcon
     - `src/pages/cart.astro` - Cart component
     - `src/pages/checkout.astro` - CheckoutForm component
     - `src/pages/index.astro` - ProductTabs component

3. **Port Configuration** (commits: 8737611, b5ece7c)
   - Created `docker/docker-compose.dev.yml` for local development
   - Changed port from 8080 → 4321 (Astro default, avoids conflicts)

**Verification:**
- ✅ Docker build completes without errors
- ✅ All pages accessible (200 status codes)
- ✅ Homepage: http://localhost:4321/
- ✅ Cart: http://localhost:4321/cart/
- ✅ Checkout: http://localhost:4321/checkout/
- ✅ About: http://localhost:4321/about/
- ✅ Contact: http://localhost:4321/contact/

## Tech Stack

- **Framework:** Astro (static site generation)
- **UI Library:** React 18 with TypeScript
- **Styling:** CSS-in-JS (inline styles)
- **Forms:** React Hook Form + Zod validation
- **State:** React Context (cart management)
- **Deployment:** Docker (multi-stage: Node 20 build → NGINX Alpine serve)

## Architecture Decisions

### Client-Side Hydration Strategy

**Pattern:** `client:only="react"` for context-dependent components

**Why:**
- Astro performs SSR during `npm run build` (static generation)
- CartProvider is only available on client side (uses localStorage)
- Components using `useCartState()` or `useCartActions()` fail during SSR
- `client:only` directive skips SSR entirely, renders only on client

**Affected Components:**
- CartIcon - needs cart item count
- Cart - needs full cart state
- CheckoutForm - needs cart state for order summary
- ProductTabs - needs cart actions for Add to Cart buttons

### Export Patterns

**Pattern:** Default exports for page-level components, named exports for utilities

**Files using default exports:**
- `src/components/react/Cart.tsx`
- `src/components/react/CheckoutForm.tsx`

**Files using named exports:**
- `src/components/react/CartIcon.tsx` - small utility component
- `src/components/react/ProductCard.tsx` - reusable card
- `src/components/react/MealCard.tsx` - reusable card
- `src/lib/cart-context.tsx` - provides multiple exports

## Research References

None yet.

## Known Issues

1. **Node.js version warning** - TypeScript diagnostics show `parsePhoneNumber` deprecated warnings
   - Impact: Cosmetic only, functionality works correctly
   - Resolution: Will be addressed if/when libphonenumber-js updates

2. **Manual environment setup required:**
   - Cloudflare R2 credentials for image upload
   - DNS configuration for production domain
   - SSL automation token

## Next Steps

Awaiting user verification of Phase 2 checkpoint (02-04).
