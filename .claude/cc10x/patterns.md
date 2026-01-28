# Patterns & Learnings

## Common Gotchas

### Astro SSR vs Client-Side Hydration

**Problem:** Components using React Context fail during Astro's static site generation

**Symptoms:**
```
Error: useCartState must be used within CartProvider
  at useCartState (file:///app/dist/chunks/...)
  at Cart (file:///app/dist/pages/cart.astro.mjs...)
```

**Root Cause:**
- Astro runs `npm run build` which performs SSR for ALL pages
- React Context (CartProvider) relies on browser APIs (localStorage)
- During SSR, there's no browser environment → Context fails

**Solution:**
Use `client:only="react"` instead of `client:load` for components that:
1. Use React Context (useContext, custom hooks like useCartState)
2. Access browser APIs (localStorage, window, document)
3. Require client-side state initialization

**Example:**
```astro
<!-- ❌ Fails during SSR -->
<Cart client:load />

<!-- ✅ Skips SSR, renders only on client -->
<Cart client:only="react" />
```

**When to use each directive:**
- `client:load` - Component works during SSR (pure rendering, no context/browser APIs)
- `client:only="react"` - Component needs client environment (context, localStorage, etc.)
- `client:idle` - Non-critical component, load when browser idle
- `client:visible` - Load when component enters viewport

### Export/Import Mismatch in Astro

**Problem:** Build fails with "default is not exported by"

**Symptoms:**
```
src/pages/cart.astro (3:7): "default" is not exported by "src/components/react/Cart.tsx"
```

**Root Cause:**
- Astro file imports as default: `import Cart from '@/components/react/Cart'`
- But component exports as named: `export function Cart() { ... }`

**Solution:**
Match export pattern to import pattern:

```tsx
// If importing as default in .astro files
export default function Cart() { ... }

// If importing as named in .astro files
export function Cart() { ... }
// Then import as: import { Cart } from '...'
```

**Convention for this project:**
- Page-level components → default exports (Cart, CheckoutForm)
- Utility components → named exports (CartIcon, ProductCard)
- Libraries/utilities → named exports (cart-context, validators)

### Docker Port Conflicts

**Problem:** `failed to set up container networking: port is already allocated`

**Solution:**
1. Check what's using the port: `docker ps | grep <port>`
2. Choose different port in docker-compose.yml
3. Document in comments which port is used

**This project:** Port 4321 (Astro's default dev port)

## Performance Patterns

### React Context Optimization

**Pattern:** Separate state and actions into different contexts

**Implementation:**
```tsx
const CartStateContext = createContext<CartItem[]>([]);
const CartActionsContext = createContext<CartActions | null>(null);

// Components only reading state
const items = useCartState(); // Won't re-render on action changes

// Components only calling actions
const { addItem } = useCartActions(); // Won't re-render on state changes
```

**Benefit:** Prevents unnecessary re-renders when components only need state OR actions (not both)

## Security Patterns

### Phone Number Validation

**Pattern:** Server-side normalization to E.164 format

**Implementation:**
```tsx
// Zod schema with transform
phone: z.string()
  .refine(val => parsePhoneNumber(val, 'ZA').isValid())
  .transform(val => parsePhoneNumber(val, 'ZA').format('E.164'))
```

**Why:** WhatsApp API requires E.164 format (+27XXXXXXXXX)

## Testing Patterns

### Docker Build Verification

**Pattern:** Test all endpoints after build

```bash
docker-compose -f docker-compose.dev.yml up --build -d
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/cart/
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/checkout/
```

**Success criteria:** All endpoints return 200

## Build Patterns

### Multi-Stage Docker for Astro

**Pattern:**
```dockerfile
# Stage 1: Build with Node
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

**Benefits:**
- Smaller production image (no Node.js, only static files)
- Faster deploys
- Better security (fewer dependencies in production)
