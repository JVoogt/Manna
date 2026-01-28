# Architecture Research

**Domain:** Food ordering website with custom product builder
**Researched:** 2026-01-28
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer (Astro)                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Static  │  │  About   │  │ Contact  │  │  Menu    │    │
│  │   Home   │  │   Page   │  │   Page   │  │  Pages   │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │             │           │
│       └─────────────┴──────────────┴─────────────┘           │
│                          │                                   │
├──────────────────────────┼───────────────────────────────────┤
│         Client Islands (Interactive Components)              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │ Platter Builder │  │ Shopping Cart   │  │  Checkout  │  │
│  │  (React/Preact) │  │  (React/Preact) │  │    Form    │  │
│  └────────┬────────┘  └────────┬────────┘  └─────┬──────┘  │
│           │                    │                  │          │
│           └────────────────────┴──────────────────┘          │
│                               │                              │
├───────────────────────────────┼──────────────────────────────┤
│                      State Management Layer                  │
│                        (Nano Stores)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Persistent Cart Store (@nanostores/persistent)      │   │
│  │  - Cart items, quantities, selections                │   │
│  │  - localStorage sync across tabs/sessions            │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer (JSON)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ products.json│  │  meals.json  │  │  config.json │      │
│  │  (platter    │  │   (menu      │  │  (settings)  │      │
│  │   items)     │  │    items)    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
                    ┌──────────────┐
                    │  WhatsApp    │
                    │  Web API     │
                    └──────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Static Pages** | Content delivery (About, Contact) | Astro components (no JS) |
| **Menu Pages** | Display products from JSON | Astro with JSON data loading |
| **Platter Builder** | Interactive 6-item selector with live pricing | React/Preact island with client:load |
| **Shopping Cart** | Multi-item cart with quantity management | React/Preact island with persistent state |
| **Checkout Form** | Validation (48hr lead time), customer details | React/Preact island with form validation |
| **Cart Store** | Shared state across all interactive components | Nano Stores with localStorage persistence |
| **JSON Data Files** | Single source of truth for products/meals | Static JSON loaded at build time |
| **WhatsApp Integration** | Order submission endpoint | Client-side URL construction with pre-filled message |

## Recommended Project Structure

```
Manna/
├── src/
│   ├── pages/                    # Astro pages (routing)
│   │   ├── index.astro           # Home page (static)
│   │   ├── about.astro           # About page (static)
│   │   ├── contact.astro         # Contact page (static)
│   │   ├── menu.astro            # Menu listing (JSON-driven)
│   │   ├── build-platter.astro   # Platter builder page (contains island)
│   │   └── checkout.astro        # Checkout page (contains islands)
│   │
│   ├── components/               # Reusable components
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.astro     # Site header (static)
│   │   │   ├── Footer.astro     # Site footer (static)
│   │   │   └── Layout.astro     # Base layout wrapper
│   │   │
│   │   ├── ui/                  # Non-interactive UI components
│   │   │   ├── ProductCard.astro       # Product display card
│   │   │   ├── MealCard.astro          # Meal display card
│   │   │   └── Button.astro            # Button component
│   │   │
│   │   └── islands/             # Interactive components (client-side)
│   │       ├── PlatterBuilder.tsx      # Platter customizer (React/Preact)
│   │       ├── ShoppingCart.tsx        # Cart display and management
│   │       ├── CartFlyout.tsx          # Cart dropdown/sidebar
│   │       ├── CartToggle.tsx          # Cart icon with item count
│   │       ├── AddToCartButton.tsx     # Add to cart action
│   │       └── CheckoutForm.tsx        # Order form with validation
│   │
│   ├── data/                    # JSON data files
│   │   ├── products.json        # Platter items (name, price, image, category)
│   │   ├── meals.json           # Pre-made meals (name, price, description)
│   │   └── config.json          # Site config (business hours, lead time)
│   │
│   ├── stores/                  # Nano Stores state management
│   │   ├── cart.ts              # Cart store (persistent)
│   │   ├── platter.ts           # Current platter builder state
│   │   └── checkout.ts          # Checkout form state
│   │
│   ├── lib/                     # Utility functions
│   │   ├── cart-utils.ts        # Cart calculations (total, quantity)
│   │   ├── validation.ts        # Form validation logic
│   │   ├── date-utils.ts        # Date/time validation (48hr check)
│   │   └── whatsapp.ts          # WhatsApp message formatter
│   │
│   ├── types/                   # TypeScript types
│   │   ├── product.ts           # Product interface
│   │   ├── meal.ts              # Meal interface
│   │   ├── cart.ts              # Cart item interface
│   │   └── order.ts             # Order/checkout interface
│   │
│   └── styles/                  # Global styles
│       ├── global.css           # Global CSS variables, resets
│       └── tailwind.css         # Tailwind imports (if using)
│
├── public/                      # Static assets (served as-is)
│   ├── images/
│   │   ├── products/            # Product photos
│   │   ├── meals/               # Meal photos
│   │   └── hero/                # Hero/banner images
│   └── favicon.ico
│
├── docker-compose.yml           # Docker configuration
├── Dockerfile                   # Container definition
├── astro.config.mjs             # Astro configuration
├── tsconfig.json                # TypeScript config
├── tailwind.config.mjs          # Tailwind config (if using)
└── package.json                 # Dependencies
```

### Structure Rationale

- **pages/:** Astro's file-based routing - each `.astro` file becomes a route
- **components/layout/:** Reusable layout wrappers (Header, Footer) - pure Astro, no JS
- **components/ui/:** Static, presentational components for consistent design
- **components/islands/:** Interactive React/Preact components hydrated client-side
- **data/:** JSON files act as a lightweight CMS - no database needed
- **stores/:** Centralized state management with Nano Stores for cross-component communication
- **lib/:** Business logic separated from UI components for testability
- **types/:** TypeScript interfaces ensure type safety across JSON data and components

## Architectural Patterns

### Pattern 1: Astro Islands Architecture

**What:** Render majority of page as static HTML, hydrate small "islands" of interactivity only where needed.

**When to use:** Perfect for content-heavy sites with selective interactivity (like food ordering sites).

**Trade-offs:**
- **Pros:** Minimal JavaScript bundle, excellent Core Web Vitals, fast page loads
- **Cons:** Requires understanding of client directives, state sharing between islands needs Nano Stores

**Example:**
```astro
---
// src/pages/menu.astro
import Layout from '../components/layout/Layout.astro';
import ProductCard from '../components/ui/ProductCard.astro';
import AddToCartButton from '../components/islands/AddToCartButton.tsx';
import products from '../data/products.json';
---

<Layout>
  <h1>Our Menu</h1>
  <div class="grid">
    {products.map(product => (
      <ProductCard {...product}>
        <!-- Island: Only this button gets JavaScript -->
        <AddToCartButton client:visible product={product} />
      </ProductCard>
    ))}
  </div>
</Layout>
```

**Client directive options:**
- `client:load` - Hydrate immediately on page load (critical interactivity)
- `client:idle` - Hydrate when browser is idle (non-critical features)
- `client:visible` - Hydrate when component scrolls into view (below-fold content)
- `client:media="(max-width: 768px)"` - Hydrate conditionally based on media query

### Pattern 2: JSON-Driven Content with Content Collections

**What:** Store all product/menu data in JSON files, load at build time, validate with Zod schemas.

**When to use:** When you have structured, relatively stable data (menu items, products) without need for real-time updates.

**Trade-offs:**
- **Pros:** No database overhead, version control for content, fast builds, type-safe with schemas
- **Cons:** Requires rebuild to update content, not suitable for user-generated content

**Example:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const products = defineCollection({
  loader: file("src/data/products.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    category: z.enum(['protein', 'starch', 'vegetable']),
    image: z.string(),
    description: z.string().optional(),
    available: z.boolean().default(true),
  }),
});

const meals = defineCollection({
  loader: file("src/data/meals.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    description: z.string(),
    image: z.string(),
    items: z.array(z.string()), // References to product IDs
  }),
});

export const collections = { products, meals };
```

**Usage in pages:**
```astro
---
import { getCollection } from 'astro:content';
const products = await getCollection('products',
  ({ data }) => data.available === true
);
---
```

### Pattern 3: Persistent Cart State with Nano Stores

**What:** Centralized, framework-agnostic state management with localStorage persistence for cart data.

**When to use:** When multiple islands need to share state (cart count, cart items, totals) and state should persist across page navigation and browser sessions.

**Trade-offs:**
- **Pros:** Tiny bundle size (<1KB), framework-agnostic, built-in persistence, works across Astro page transitions
- **Cons:** Limited to client-side state, localStorage limitations (5-10MB, synchronous API)

**Example:**
```typescript
// src/stores/cart.ts
import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'platter' | 'meal';
  platters?: string[]; // For custom platters: array of 6 item IDs
}

export const $cart = persistentAtom<CartItem[]>('manna-cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Computed stores for derived values
export const $cartTotal = computed($cart, (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const $cartCount = computed($cart, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

// Actions
export function addToCart(item: CartItem) {
  const currentCart = $cart.get();
  const existingIndex = currentCart.findIndex(i => i.id === item.id);

  if (existingIndex >= 0) {
    // Update quantity if item exists
    currentCart[existingIndex].quantity += item.quantity;
    $cart.set([...currentCart]);
  } else {
    // Add new item
    $cart.set([...currentCart, item]);
  }
}

export function removeFromCart(itemId: string) {
  $cart.set($cart.get().filter(item => item.id !== itemId));
}

export function updateQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }

  const currentCart = $cart.get();
  const index = currentCart.findIndex(i => i.id === itemId);
  if (index >= 0) {
    currentCart[index].quantity = quantity;
    $cart.set([...currentCart]);
  }
}

export function clearCart() {
  $cart.set([]);
}
```

**Usage in React/Preact component:**
```tsx
// src/components/islands/CartToggle.tsx
import { useStore } from '@nanostores/react';
import { $cartCount } from '../../stores/cart';

export function CartToggle() {
  const count = useStore($cartCount);

  return (
    <button className="cart-toggle">
      🛒 Cart {count > 0 && <span>({count})</span>}
    </button>
  );
}
```

### Pattern 4: Component-Driven Development (Atomic Design)

**What:** Break UI into hierarchical levels - Atoms (buttons), Molecules (product cards), Organisms (cart flyout), Templates (page layouts).

**When to use:** Always - ensures consistent, reusable components and maintainable design system.

**Trade-offs:**
- **Pros:** Highly reusable, easier to maintain, consistent UI, facilitates mobile-first responsive design
- **Cons:** Initial setup overhead, requires discipline to maintain hierarchy

**Component hierarchy for Manna:**
```
Atoms:
  - Button, Input, Label, Badge, Icon

Molecules:
  - ProductCard (Image + Name + Price + AddButton)
  - CartItem (Image + Name + Quantity + Remove)
  - FormField (Label + Input + ErrorMessage)

Organisms:
  - PlatterBuilder (6x ProductCard + PriceTotal + AddToCart)
  - CartFlyout (CartToggle + CartItem[] + Subtotal + CheckoutButton)
  - CheckoutForm (FormField[] + DatePicker + SubmitButton)

Templates:
  - PageLayout (Header + Main + Footer)
  - MenuLayout (Filter + ProductGrid)

Pages:
  - index.astro, menu.astro, build-platter.astro, checkout.astro
```

### Pattern 5: Mobile-First Responsive Design with Container Queries

**What:** Design for mobile viewport first, progressively enhance for larger screens. Use container queries for component-level responsiveness.

**When to use:** Always for 2026 - mobile traffic dominates, especially for food ordering.

**Trade-offs:**
- **Pros:** Better performance on mobile, forces focus on essential features, easier to enhance than reduce
- **Cons:** Requires CSS container query support (universally available in 2026)

**Example with Tailwind CSS:**
```astro
---
// src/components/ui/ProductCard.astro
---
<div class="product-card">
  <!-- Mobile: Stack vertically -->
  <img src={image} class="w-full h-48 object-cover" />

  <div class="p-4 flex flex-col gap-2">
    <!-- Mobile: Larger text for touch targets -->
    <h3 class="text-lg font-bold md:text-xl">{name}</h3>
    <p class="text-sm text-gray-600 md:text-base">{description}</p>

    <!-- Mobile: Full-width button, tablet+: inline -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <span class="text-xl font-bold">R{price}</span>
      <slot /> <!-- AddToCartButton -->
    </div>
  </div>
</div>

<style>
  /* Container query for component-based responsiveness */
  .product-card {
    container-type: inline-size;
  }

  @container (min-width: 400px) {
    .product-card {
      display: grid;
      grid-template-columns: 150px 1fr;
    }
  }
</style>
```

**Tailwind breakpoints (mobile-first):**
- Base (no prefix): 0-640px (mobile)
- `sm:` 640px+ (large mobile/small tablet)
- `md:` 768px+ (tablet)
- `lg:` 1024px+ (desktop)
- `xl:` 1280px+ (large desktop)

## Data Flow

### Request Flow: Browse Products → Add to Cart

```
[User visits /menu]
    ↓
[Astro SSG] → Load products.json → Render static HTML
    ↓
[Browser receives HTML] → Display product grid (instant, no JS)
    ↓
[Client scrolls to product] → client:visible triggers
    ↓
[Hydrate AddToCartButton] → Load React + Nano Stores (~5KB)
    ↓
[User clicks "Add to Cart"]
    ↓
[addToCart() action] → Update $cart store → localStorage
    ↓
[All CartToggle components] → React to $cart change → Update count
```

### Request Flow: Build Custom Platter

```
[User visits /build-platter]
    ↓
[Astro SSG] → Load products.json → Render page with PlatterBuilder island
    ↓
[Browser receives HTML] → Display static content
    ↓
[PlatterBuilder hydrates] → client:load (immediate)
    ↓
[User selects 6 items from categories]
    ↓
[PlatterBuilder state] → Track selections (local state)
                       → Calculate price (sum of 6 items)
                       → Validate (exactly 6 items required)
    ↓
[User clicks "Add Platter to Cart"]
    ↓
[addToCart()] → Create CartItem with type='platter' and platters=[id1...id6]
              → Update $cart store → localStorage
    ↓
[Redirect to /checkout] or [Continue shopping]
```

### Request Flow: Checkout → WhatsApp Submission

```
[User visits /checkout]
    ↓
[CheckoutForm island hydrates] → client:load
                                → Read $cart from Nano Stores
                                → Display cart summary
    ↓
[User fills form]
    ↓
[Form validation] → Name, phone, delivery address (required)
                  → Delivery date/time (validate 48hr lead time)
                  → Special instructions (optional)
    ↓
[User clicks "Submit Order"]
    ↓
[Validation passes]
    ↓
[Format WhatsApp message]
  - Customer details (name, phone, address)
  - Order items (quantity, descriptions, price)
  - Total amount
  - Delivery date/time
  - Special instructions
    ↓
[Construct WhatsApp Web URL]
  - Base: https://wa.me/27XXXXXXXXX
  - Query: ?text={encodeURIComponent(message)}
    ↓
[window.open(url, '_blank')] → Opens WhatsApp Web/App
    ↓
[WhatsApp opens with pre-filled message]
    ↓
[User clicks Send in WhatsApp]
    ↓
[Order received by business] → Manual processing
    ↓
[Clear cart] → $cart.set([]) → localStorage cleared
    ↓
[Show confirmation page] → "Order sent via WhatsApp! We'll confirm soon."
```

### State Management Flow

```
┌──────────────────────────────────────────────────────────┐
│                   Nano Stores (Client)                   │
│                                                          │
│  $cart (PersistentAtom) ←→ localStorage ('manna-cart')  │
│      ↓                                                   │
│  $cartTotal (Computed) ← derives from $cart             │
│  $cartCount (Computed) ← derives from $cart             │
└────┬────────────────────────────────┬──────────────────┘
     │                                │
     ↓                                ↓
┌──────────────────┐       ┌──────────────────────┐
│  CartToggle      │       │  AddToCartButton     │
│  (reads count)   │       │  (writes to cart)    │
└──────────────────┘       └──────────────────────┘
     ↓                                ↓
┌──────────────────┐       ┌──────────────────────┐
│  CartFlyout      │       │  CheckoutForm        │
│  (reads cart)    │       │  (reads cart, clears)│
└──────────────────┘       └──────────────────────┘
```

**Key characteristics:**
1. **Single source of truth:** `$cart` store holds all cart data
2. **Derived state:** Totals and counts computed automatically from cart
3. **Persistence:** Survives page reloads and tab switches via localStorage
4. **Reactivity:** All components using `useStore($cart)` update automatically
5. **Framework agnostic:** Works with React, Preact, Svelte, Vue, or vanilla JS

### Key Data Flows

1. **JSON → Display (Build Time):**
   - Astro reads `products.json` and `meals.json` during build
   - Generates static HTML with product cards, prices, images
   - No runtime database queries - instant page loads

2. **User Selection → Cart (Runtime):**
   - User interactions trigger JavaScript in islands
   - Islands call store actions (`addToCart`, `updateQuantity`)
   - Nano Stores update and persist to localStorage
   - All subscribed components re-render automatically

3. **Cart → WhatsApp (Submission):**
   - Checkout form reads cart from store
   - Formats data into human-readable message
   - Constructs WhatsApp Web URL with pre-filled text
   - Opens in new tab/window - no backend needed

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-500 orders/month** | Current architecture is perfect - static site on Raspberry Pi, JSON files, no database |
| **500-5K orders/month** | Consider: (1) Move hosting from Pi to VPS/cloud for reliability, (2) Add analytics (Plausible/Umami), (3) Consider headless CMS (Strapi/Directus) instead of JSON files for easier updates |
| **5K+ orders/month** | Requires backend: (1) Implement proper order management system, (2) Payment gateway integration, (3) WhatsApp Business API (not web link), (4) Inventory tracking, (5) CDN for images |

### Scaling Priorities

1. **First bottleneck: Manual order processing**
   - **What breaks:** Too many WhatsApp messages to handle manually
   - **How to fix:** Implement WhatsApp Business API with automated confirmations, integrate with order management system (e.g., Toast, Square)
   - **When:** ~50+ orders/day

2. **Second bottleneck: Content updates**
   - **What breaks:** Rebuilding/redeploying site every time menu changes
   - **How to fix:** Implement headless CMS with webhook-triggered builds, or switch to SSR mode for Astro
   - **When:** Frequent menu updates (daily price changes, seasonal items)

3. **Third bottleneck: Performance on Pi**
   - **What breaks:** Raspberry Pi struggles with traffic spikes (promotions, peak dinner hours)
   - **How to fix:** Move to cloud hosting (Netlify, Vercel, Cloudflare Pages - all free tiers support Astro)
   - **When:** Traffic exceeds 10K visits/month or response times degrade

## Anti-Patterns

### Anti-Pattern 1: Using Client-Side Rendering for Static Content

**What people do:** Make entire site a React SPA with all products loaded client-side via fetch.

**Why it's wrong:**
- Terrible for SEO - products not in initial HTML
- Slow Time to Interactive (TTI) - users see loading spinner
- Larger JavaScript bundle (entire React app + routing)
- Poor Core Web Vitals = lower Google rankings

**Do this instead:** Use Astro's static generation for all content pages. Only use islands for interactivity (cart, forms, platter builder). This gives instant page loads with product content visible immediately.

### Anti-Pattern 2: Creating Separate Cart State in Each Component

**What people do:** Each component (CartToggle, CartFlyout, Checkout) maintains its own cart state via `useState`, trying to sync via props/events.

**Why it's wrong:**
- State becomes inconsistent across components
- Complex prop drilling and event bubbling
- Cart doesn't persist across page navigation
- Difficult to maintain and debug

**Do this instead:** Use Nano Stores with a single `$cart` store. All components import the same store and automatically stay in sync. Persistence is handled by `@nanostores/persistent` for free.

### Anti-Pattern 3: Not Validating Form Data Client-Side

**What people do:** Submit form directly to WhatsApp without validating required fields, phone format, date constraints.

**Why it's wrong:**
- Orders with missing information
- Invalid delivery dates (less than 48hr notice)
- Poor user experience - errors only discovered after WhatsApp opens
- Incomplete orders → customer frustration → manual back-and-forth

**Do this instead:** Implement thorough client-side validation before WhatsApp submission:
```typescript
// src/lib/validation.ts
export function validateOrder(order: CheckoutFormData): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!order.name?.trim()) errors.push('Name is required');
  if (!order.phone?.match(/^(\+27|0)[6-8][0-9]{8}$/))
    errors.push('Valid SA phone number required');
  if (!order.address?.trim()) errors.push('Delivery address required');

  // 48-hour lead time validation
  const deliveryDate = new Date(order.deliveryDateTime);
  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 48);

  if (deliveryDate < minDate) {
    errors.push('Delivery requires 48-hour notice');
  }

  // Cart validation
  if (order.cartItems.length === 0) {
    errors.push('Cart is empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Anti-Pattern 4: Over-Hydrating with client:load Everywhere

**What people do:** Add `client:load` to every component "just to be safe".

**Why it's wrong:**
- Defeats the purpose of islands architecture
- Loads unnecessary JavaScript immediately
- Slows down page load and Time to Interactive
- Wastes bandwidth, especially on mobile

**Do this instead:** Choose the right directive for each island:
- **client:load** - Only for above-fold, critical interactivity (PlatterBuilder, CartToggle)
- **client:visible** - For below-fold components (AddToCartButton on product cards)
- **client:idle** - For non-critical features (newsletter signup, feedback form)
- **No directive** - For static components (most product cards, text content)

### Anti-Pattern 5: Storing Images in JSON Files

**What people do:** Embed base64-encoded images in JSON or store full image data inline.

**Why it's wrong:**
- Massive JSON files (megabytes) slow down builds
- No browser caching for images
- Images can't be optimized by CDN or Astro's image optimization
- Version control nightmares (Git doesn't handle large binary changes well)

**Do this instead:** Store only image paths/URLs in JSON, keep actual images in `public/images/`:
```json
{
  "id": "grilled-chicken",
  "name": "Grilled Chicken",
  "price": 45,
  "image": "/images/products/grilled-chicken.jpg"
}
```

Then use Astro's `<Image>` component for automatic optimization:
```astro
---
import { Image } from 'astro:assets';
import chickenImage from '../public/images/products/grilled-chicken.jpg';
---
<Image src={chickenImage} alt="Grilled Chicken" width={400} height={300} />
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **WhatsApp Web** | Client-side URL construction | Format: `https://wa.me/27XXXXXXXXX?text={encodedMessage}` <br>Opens in new tab, no API key needed. For scale, upgrade to WhatsApp Business API. |
| **Image CDN** | Optional - use `public/` for now | For scale: Cloudinary/Imgix with Astro Image integration. Pi can serve images fine at low traffic. |
| **Analytics** | Plausible/Umami/Simple Analytics | Privacy-focused, GDPR-compliant. Script tag in Layout.astro. Avoid Google Analytics (privacy concerns, heavy JS). |
| **Payment Gateway** | Future - not in MVP | When ready: Stripe/PayFast. Requires backend. Current MVP is cash-on-delivery via WhatsApp. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Astro Pages ↔ JSON Data** | Import at build time | `import products from '../data/products.json'` or Content Collections API |
| **Astro Pages ↔ Islands** | Props (one-way) | Pass initial data via props, islands handle their own state |
| **Island ↔ Island** | Nano Stores (reactive) | Shared state via stores, automatic reactivity, no prop drilling |
| **Island ↔ localStorage** | @nanostores/persistent | Automatic sync, no manual localStorage code needed |
| **Checkout Form ↔ WhatsApp** | window.open() with URL | Client-side only, no backend/API required |

## Astro-Specific Best Practices (2026)

### 1. Use Content Collections for JSON Data

Instead of raw JSON imports, use Content Collections for type safety and validation:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

export const collections = {
  products: defineCollection({
    loader: file("src/data/products.json"),
    schema: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.enum(['protein', 'starch', 'vegetable']),
    }),
  }),
};
```

**Benefits:**
- Compile-time type checking
- Runtime validation (catches malformed JSON)
- Auto-generated TypeScript types
- JSON schema generation for editor autocomplete

### 2. Optimize Client Directives for Performance

```astro
---
// Good: Strategic hydration
---
<Layout>
  <!-- No directive = 0 JS -->
  <StaticHeader />

  <!-- client:load = Critical, hydrate immediately -->
  <CartToggle client:load />

  <!-- client:visible = Lazy load below fold -->
  <AddToCartButton client:visible product={product} />

  <!-- client:idle = Non-critical, load when browser idle -->
  <NewsletterSignup client:idle />
</Layout>
```

### 3. Use View Transitions for SPA-Like Navigation

Enable Astro's View Transitions API for smooth page changes without losing cart state:

```astro
---
// src/components/layout/Layout.astro
import { ViewTransitions } from 'astro:transitions';
---
<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Persist cart state across navigation:**
```astro
<CartFlyout client:load transition:persist />
```

### 4. Preload Critical Data

For frequently accessed JSON data:

```astro
---
// Preload in <head>
---
<link rel="preload" href="/data/products.json" as="fetch" crossorigin />
```

### 5. Use Astro.glob() for Dynamic Imports

For loading multiple JSON files or images dynamically:

```astro
---
const products = await Astro.glob('../data/products/*.json');
const productImages = await Astro.glob('../public/images/products/*.jpg');
---
```

## Build Order Recommendations

Based on component dependencies and data flow, here's the optimal build sequence:

### Phase 1: Foundation (Week 1)
**Goal:** Static site with JSON data display

1. **Set up Astro project** with Docker configuration
2. **Create JSON data files** (products.json, meals.json, config.json) with schema
3. **Implement base layout** (Header, Footer, Layout components)
4. **Build static pages** (Home, About, Contact)
5. **Create product display components** (ProductCard, MealCard)
6. **Build menu page** with JSON data loading

**Deliverable:** Static website displaying products/meals, no interactivity

### Phase 2: Cart Infrastructure (Week 2)
**Goal:** Shared state management for cart

1. **Install Nano Stores** (`nanostores`, `@nanostores/persistent`, `@nanostores/react`)
2. **Create cart store** with actions (add, remove, update, clear)
3. **Create computed stores** for totals and count
4. **Build CartToggle island** (displays count, opens flyout)
5. **Build CartFlyout island** (displays items, quantities, remove)
6. **Add AddToCartButton islands** to product cards

**Deliverable:** Working shopping cart that persists across pages/sessions

### Phase 3: Platter Builder (Week 2-3)
**Goal:** Interactive custom platter creator

1. **Create PlatterBuilder island** with category filters
2. **Implement selection logic** (max 6 items, visual feedback)
3. **Add live price calculation** (sum of 6 selected items)
4. **Build validation** (must select exactly 6 items)
5. **Integrate with cart store** (add custom platter to cart)
6. **Create platter builder page** with instructions

**Deliverable:** Custom platter builder that adds to cart

### Phase 4: Checkout & Validation (Week 3-4)
**Goal:** Order submission via WhatsApp

1. **Create checkout form island** (name, phone, address, delivery date/time)
2. **Implement validation logic** (required fields, phone format, 48hr lead time)
3. **Build date/time picker** with availability checking
4. **Create WhatsApp message formatter** (cart items + customer details)
5. **Implement WhatsApp URL constructor** and submission
6. **Add confirmation page/modal** after submission
7. **Implement cart clearing** after successful order

**Deliverable:** Complete checkout flow with WhatsApp submission

### Phase 5: Polish & Mobile Optimization (Week 4)
**Goal:** Production-ready site with excellent UX

1. **Mobile-first responsive design** (all components, test on real devices)
2. **Accessibility audit** (keyboard navigation, screen readers, ARIA labels)
3. **Performance optimization** (image optimization, lazy loading, bundle analysis)
4. **Error handling** (network failures, validation errors, empty states)
5. **Loading states** (skeleton screens, spinners for async operations)
6. **Docker deployment** (test on Raspberry Pi, configure Traefik)

**Deliverable:** Polished, mobile-optimized site ready for production

### Phase 6: Testing & Launch (Week 5)
**Goal:** Bug-free launch

1. **Cross-browser testing** (Chrome, Safari, Firefox on mobile/desktop)
2. **User acceptance testing** (test with real customers)
3. **Performance testing** (Lighthouse audit, Core Web Vitals)
4. **WhatsApp integration testing** (verify message format, test on real phones)
5. **Documentation** (README for updates, deployment guide)
6. **Launch** and monitor

**Deliverable:** Live production site

### Why This Order?

1. **Foundation first:** Static pages establish routing, layout, design system
2. **Data display next:** Proves JSON loading works before adding complexity
3. **Cart before builder:** Cart is reusable infrastructure needed by platter builder
4. **Builder before checkout:** Can test cart with simple "add to cart" before complex platter logic
5. **Checkout last:** Depends on cart + validation + WhatsApp integration
6. **Polish throughout:** Mobile-first from start, but dedicated optimization phase at end

### Dependencies

```
Static Pages → Menu Display → Cart Infrastructure → Platter Builder → Checkout
                   ↓              ↓                     ↓              ↓
              JSON Data    Nano Stores          Cart Actions    WhatsApp API
```

**Critical path:** JSON Data → Nano Stores → Cart → Checkout
**Parallel work:** Static pages, mobile design, component library can progress independently

## Sources

### High-Confidence Sources (Official Documentation)

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Official Astro documentation
- [Share State Between Islands - Astro Docs](https://docs.astro.build/en/recipes/sharing-state-islands/) - Nano Stores integration
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) - JSON data loading with type safety
- [Astro Client Directives](https://docs.astro.build/en/reference/directives-reference/) - Hydration control
- [@nanostores/persistent GitHub](https://github.com/nanostores/persistent) - localStorage persistence
- [Nanostores GitHub](https://github.com/nanostores/nanostores) - Core library documentation
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design) - Mobile-first breakpoints

### Medium-Confidence Sources (Verified Industry Practices)

- [Astro Islands Architecture Explained - Strapi](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)
- [State Management with Astro and Nanostores - DEV Community](https://dev.to/petrtcoi/state-management-with-astro-and-nanostores-5h17)
- [Building High-Performance Ecommerce Sites with Astro - LogRocket](https://blog.logrocket.com/building-high-performance-ecommerce-sites-astro/)
- [Building a Static Website from JSON Data with Astro - Solita](https://dev.solita.fi/2024/12/02/building-static-websites-with-astro.html)
- [Architecture and Design Principles for Online Food Delivery Systems - LinkedIn](https://www.linkedin.com/pulse/architecture-design-principle-online-food-delivery-system-sharma)
- [Food Delivery App Architecture - Enatega](https://enatega.com/food-delivery-app-architecture/)
- [WhatsApp API Integration Guide 2026 - Unipile](https://www.unipile.com/whatsapp-api-a-complete-guide-to-integration/)
- [Frontend Design Patterns That Work in 2026 - Netguru](https://www.netguru.com/blog/frontend-design-patterns)
- [Mobile-First Responsive Design - UXPin](https://www.uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design/)
- [Tailwind CSS Best Practices 2025-2026 - FrontendTools](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)

---

*Architecture research for: Manna Kitchen food ordering website*
*Researched: 2026-01-28*
*Framework: Astro 4.x with React/Preact islands*
*Target deployment: Docker on Raspberry Pi with Traefik reverse proxy*
