# Phase 2: Core Ordering Flow - Research

**Researched:** 2026-01-28
**Domain:** E-commerce ordering flow (React-based cart, forms, WhatsApp integration)
**Confidence:** HIGH

## Summary

Phase 2 builds an interactive e-commerce ordering flow on top of Phase 1's Astro foundation. The core technical challenge is adding React-based interactivity to a static Astro site while maintaining performance. The standard approach uses Astro's island architecture with strategic hydration, React Hook Form for validation, Context API with localStorage for cart persistence, and direct WhatsApp Web API links for order handoff.

**Key architectural decisions:**
- Use Astro's React integration with selective client-side hydration (islands)
- Implement cart state with React Context API + localStorage persistence
- Integrate React Hook Form with Zod (already installed) for type-safe validation
- Use date-fns with date-fns-tz for business day calculations and SAST timezone
- Format phone numbers with libphonenumber-js to E.164 standard
- Generate WhatsApp links with properly URL-encoded messages

**Primary recommendation:** Keep React islands minimal and strategic. Cart operations need client:load (immediate interactivity), while product cards can use client:visible (below fold). Separate cart state and cart actions into different contexts to prevent unnecessary re-renders across the component tree.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/react | ^4.x | React integration | Official Astro integration, handles SSR/hydration |
| react | ^18.3.x | UI framework | Industry standard for interactive components |
| react-dom | ^18.3.x | DOM rendering | Required peer dependency for React 18 |
| react-hook-form | ^7.x | Form management | Minimal re-renders, 38.7k stars, best performance |
| @hookform/resolvers | ^3.x | Schema validation bridge | Official resolver for Zod integration |
| zod | ^3.25.76 | Schema validation | Already installed in Phase 1 |
| date-fns | ^4.x | Date manipulation | Modern, tree-shakeable, 45k+ stars |
| date-fns-tz | ^3.x | Timezone handling | Official timezone companion for date-fns |
| libphonenumber-js | ^1.x | Phone validation | Lightweight (vs google-libphonenumber), E.164 formatting |
| sonner | ^2.x | Toast notifications | Modern, TypeScript-first, no setup needed, 5KB |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-day-picker | ^9.x | Date picker UI | Accessible calendar with weekend disable support |
| headlessui/react | ^2.x | Tabs component | Accessible, unstyled tabs for Products/Meals switching |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Hook Form | Formik | More popular historically but slower performance, larger bundle |
| date-fns | Luxon | Heavier bundle, uses Intl API (no tree-shaking) |
| libphonenumber-js | google-libphonenumber | Full features but much larger bundle (500KB+) |
| Sonner | react-toastify | More features but larger bundle, requires setup |
| Context API | Zustand | Better performance but adds dependency (this phase is small enough for Context) |

**Installation:**
```bash
npm install @astrojs/react react react-dom
npm install react-hook-form @hookform/resolvers
npm install date-fns date-fns-tz
npm install libphonenumber-js
npm install sonner
npm install react-day-picker headlessui/react
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── react/              # All React components (island candidates)
│   │   ├── Cart.tsx        # Cart display and management
│   │   ├── CartIcon.tsx    # Header cart badge
│   │   ├── ProductCard.tsx # Product display with Add to Cart
│   │   ├── ProductTabs.tsx # Products/Meals switcher
│   │   ├── CheckoutForm.tsx # Complete checkout with validation
│   │   └── ToastProvider.tsx # Sonner toast container
│   └── astro/              # Astro-only components
│       └── ProductGrid.astro # Static grid layout
├── lib/
│   ├── cart-context.tsx    # React Context for cart state
│   ├── cart-actions.tsx    # Cart mutations (separated for performance)
│   ├── validators.ts       # Zod schemas for forms
│   ├── date-utils.ts       # Business day calculations
│   ├── phone-utils.ts      # Phone number formatting
│   └── whatsapp.ts         # WhatsApp link generation
├── pages/
│   ├── index.astro         # Product browsing page
│   ├── cart.astro          # Cart page
│   └── checkout.astro      # Checkout page
└── types/
    └── cart.ts             # TypeScript types for cart items
```

### Pattern 1: Astro Islands with Strategic Hydration
**What:** Render React components as static HTML by default, hydrate only when needed
**When to use:** All React components in Astro pages
**Example:**
```tsx
---
// src/pages/index.astro
import ProductCard from '@/components/react/ProductCard';
import CartIcon from '@/components/react/CartIcon';
---
<Layout>
  <header>
    <!-- Hydrate immediately - user expects instant interactivity -->
    <CartIcon client:load />
  </header>

  <main>
    {products.map(product => (
      <!-- Hydrate when visible - below fold optimization -->
      <ProductCard product={product} client:visible />
    ))}
  </main>
</Layout>
```

**Hydration directive guide:**
- `client:load` - High priority, immediate interactivity (cart icon, checkout form)
- `client:idle` - Medium priority, interactive when browser idle (tabs)
- `client:visible` - Low priority, interactive when scrolled into view (product cards)
- `client:only="react"` - Never server-render, client-only (avoids hydration mismatches)

### Pattern 2: Separated Context for Performance
**What:** Split cart state and cart actions into separate contexts to prevent re-renders
**When to use:** Any shared state that causes frequent updates
**Example:**
```tsx
// src/lib/cart-context.tsx
import { createContext, useContext, useState, useMemo } from 'react';

// Separate contexts prevent re-renders
const CartStateContext = createContext<CartItem[]>([]);
const CartActionsContext = createContext<CartActions | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('manna-cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Memoize actions to prevent re-creation
  const actions = useMemo(() => ({
    addItem: (item: CartItem) => {
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        const updated = existing
          ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...prev, { ...item, quantity: 1 }];
        localStorage.setItem('manna-cart', JSON.stringify(updated));
        return updated;
      });
    },
    removeItem: (id: string) => {
      setItems(prev => {
        const updated = prev.filter(i => i.id !== id);
        localStorage.setItem('manna-cart', JSON.stringify(updated));
        return updated;
      });
    },
    updateQuantity: (id: string, quantity: number) => {
      setItems(prev => {
        const updated = prev.map(i => i.id === id ? { ...i, quantity } : i);
        localStorage.setItem('manna-cart', JSON.stringify(updated));
        return updated;
      });
    },
    clearCart: () => {
      setItems([]);
      localStorage.removeItem('manna-cart');
    }
  }), []); // Empty deps - functions never change

  return (
    <CartStateContext.Provider value={items}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

// Separate hooks for state and actions
export const useCartState = () => useContext(CartStateContext);
export const useCartActions = () => useContext(CartActionsContext);
```

### Pattern 3: React Hook Form with Zod Resolver
**What:** Type-safe form validation with schema-based validation
**When to use:** All forms requiring validation (checkout form)
**Example:**
```tsx
// src/lib/validators.ts
import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { addBusinessDays, isWeekend } from 'date-fns';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().transform((val, ctx) => {
    try {
      const parsed = parsePhoneNumber(val, 'ZA');
      if (!parsed || !parsed.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid South African phone number',
        });
        return z.NEVER;
      }
      return parsed.format('E.164'); // Returns +27XXXXXXXXX
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone number format',
      });
      return z.NEVER;
    }
  }),
  pickupDate: z.date().refine((date) => {
    const minDate = addBusinessDays(new Date(), 2); // 48 hours = 2 business days
    return date >= minDate && !isWeekend(date);
  }, 'Pickup must be at least 2 business days in advance (excluding weekends)'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// src/components/react/CheckoutForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validators';

export function CheckoutForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormData) => {
    // Generate WhatsApp link with validated data
    const message = formatWhatsAppMessage(data);
    window.open(message, '_blank');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('phone')} type="tel" />
      {errors.phone && <span>{errors.phone.message}</span>}

      {/* Date picker component */}
      <button type="submit">Place Order via WhatsApp</button>
    </form>
  );
}
```

### Pattern 4: Business Day Calculation with date-fns
**What:** Calculate 48-hour lead time excluding weekends and SA public holidays
**When to use:** Date validation, minimum pickup date calculation
**Example:**
```typescript
// src/lib/date-utils.ts
import { addBusinessDays, isWeekend, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const SA_TIMEZONE = 'Africa/Johannesburg'; // SAST (UTC+2)

// South Africa public holidays 2026 (10 working days)
const SA_HOLIDAYS_2026 = [
  new Date('2026-01-01'), // New Year's Day
  new Date('2026-03-21'), // Human Rights Day (Sat - not observed)
  new Date('2026-04-03'), // Good Friday
  new Date('2026-04-06'), // Family Day
  new Date('2026-04-27'), // Freedom Day
  new Date('2026-05-01'), // Workers' Day
  new Date('2026-06-16'), // Youth Day
  new Date('2026-08-09'), // National Women's Day (Sun)
  new Date('2026-08-10'), // National Women's Day observed (Mon)
  new Date('2026-09-24'), // Heritage Day
  new Date('2026-12-16'), // Day of Reconciliation
  new Date('2026-12-25'), // Christmas Day
  new Date('2026-12-26'), // Day of Goodwill (Sat - not observed)
];

export function isBusinessDay(date: Date): boolean {
  if (isWeekend(date)) return false;

  // Check against public holidays
  const dateStr = format(date, 'yyyy-MM-dd');
  return !SA_HOLIDAYS_2026.some(holiday =>
    format(holiday, 'yyyy-MM-dd') === dateStr
  );
}

export function getMinimumPickupDate(): Date {
  // 48 hours = 2 business days minimum
  let date = new Date();
  let businessDaysAdded = 0;

  while (businessDaysAdded < 2) {
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
    if (isBusinessDay(date)) {
      businessDaysAdded++;
    }
  }

  return date;
}

export function formatSAST(date: Date): string {
  return formatInTimeZone(date, SA_TIMEZONE, 'yyyy-MM-dd HH:mm');
}
```

### Pattern 5: WhatsApp Link Generation
**What:** Create properly formatted WhatsApp Web API links with URL-encoded messages
**When to use:** Order submission, pre-filled message generation
**Example:**
```typescript
// src/lib/whatsapp.ts
const WHATSAPP_NUMBER = '+27825795210';

export function generateWhatsAppLink(
  name: string,
  phone: string,
  pickupDate: Date,
  items: CartItem[]
): string {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Format message (use \n for newlines, will be URL-encoded)
  const message = `**New Order**
Name: ${name}
Phone: ${phone}
Pickup: ${formatSAST(pickupDate)}

Items:
${items.map(item => `- ${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: R${total.toFixed(2)}`;

  // URL encode the message (spaces become %20, newlines become %0A)
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp Web API format
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
}
```

### Pattern 6: Toast Notifications with Sonner
**What:** Non-blocking toast notifications for user feedback
**When to use:** "Item added to cart", "Order sent", error messages
**Example:**
```tsx
// src/components/react/ToastProvider.tsx
import { Toaster } from 'sonner';

export function ToastProvider() {
  return <Toaster position="bottom-center" duration={3000} />;
}

// In layout
import { ToastProvider } from '@/components/react/ToastProvider';
<ToastProvider client:load />

// Usage in components
import { toast } from 'sonner';

function addToCart() {
  // ... add item logic
  toast.success('Added to cart!');
}
```

### Anti-Patterns to Avoid

- **Don't hydrate everything with client:load:** This defeats Astro's performance benefits. Only cart icon and checkout form need immediate hydration.
- **Don't put cart provider in every island:** Create one root provider in the layout, islands share the context.
- **Don't store entire product catalog in cart state:** Only store cart items (id, name, price, quantity). Fetch full product details from data source.
- **Don't use setState callbacks for localStorage:** Sync localStorage inside the state update function to avoid race conditions.
- **Don't validate dates client-side only:** Server-side validation would be ideal, but since this is static, provide clear error messages and disable invalid dates in picker.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Phone number parsing | Regex validation | libphonenumber-js | Country-specific rules, E.164 formatting, handles edge cases (area codes, mobile vs landline) |
| Business day calculation | Date math loops | date-fns addBusinessDays + custom holiday checker | Timezone-aware, handles DST, tested algorithms |
| Form validation | Manual error state | React Hook Form + Zod | Prevents re-renders, type-safe, handles touched/dirty/valid states |
| Toast notifications | Custom positioned divs | Sonner or react-hot-toast | Accessibility (ARIA), animations, queue management, mobile positioning |
| Date picker UI | Custom calendar | react-day-picker or MUI | Keyboard navigation, accessibility, localization, edge cases (month boundaries) |
| WhatsApp detection | navigator.userAgent parsing | Direct wa.me links with fallback | Universal format, works on web and mobile, no detection needed |
| URL encoding | String replace | encodeURIComponent() | Handles all special characters, Unicode-safe |

**Key insight:** E-commerce checkout flows have subtle edge cases that take years to discover. Phone numbers vary by country, business day calculation needs public holidays, and form validation requires accessibility. Libraries encode thousands of hours of real-world testing.

## Common Pitfalls

### Pitfall 1: Cart State Race Conditions
**What goes wrong:** Adding items quickly causes stale state - only last click is recorded, previous clicks are lost.
**Why it happens:** setState doesn't immediately update. Multiple rapid clicks read the same old state and overwrite each other.
**How to avoid:** Always use functional state updates: `setItems(prev => [...prev, newItem])` never `setItems([...items, newItem])`
**Warning signs:** Cart quantity doesn't match number of clicks, items disappear mysteriously.

### Pitfall 2: localStorage QuotaExceededError
**What goes wrong:** Application crashes with "QuotaExceededError" when localStorage fills up (5MB limit in most browsers).
**Why it happens:** Cart data grows unbounded, or error isn't caught, causing unhandled exception.
**How to avoid:**
```typescript
function saveToLocalStorage(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    if (err instanceof DOMException && (
      err.code === 22 ||
      err.name === 'QuotaExceededError'
    )) {
      // Clear old data or notify user
      toast.error('Cart storage full. Please complete your order.');
      // Optionally: clear old items, compress data, or use IndexedDB
    }
  }
}
```
**Warning signs:** Application works fine with small carts but crashes with many items.

### Pitfall 3: Hydration Mismatches in Astro Islands
**What goes wrong:** Console errors "Text content does not match server-rendered HTML" or components flash incorrect content.
**Why it happens:** Server-rendered HTML differs from client-rendered HTML. Common cause: reading localStorage during SSR (localStorage doesn't exist on server).
**How to avoid:**
```tsx
// BAD - runs during SSR
const [count, setCount] = useState(localStorage.getItem('count'));

// GOOD - only runs on client
const [count, setCount] = useState(() => {
  if (typeof window === 'undefined') return 0; // SSR fallback
  return localStorage.getItem('count') || 0;
});

// BETTER - use useEffect for side effects
const [count, setCount] = useState(0);
useEffect(() => {
  const stored = localStorage.getItem('count');
  if (stored) setCount(Number(stored));
}, []);
```
**Warning signs:** Flickering content on page load, console hydration warnings.

### Pitfall 4: Context API Re-render Cascades
**What goes wrong:** Entire app re-renders when cart updates, causing sluggish UI and wasted CPU cycles.
**Why it happens:** All components consuming context re-render when any part of context value changes. Single context with both state and actions causes every consumer to re-render on every update.
**How to avoid:** Separate state and actions into different contexts (see Pattern 2). Components only consuming actions won't re-render when state changes.
**Warning signs:** Console logs show components rendering multiple times, UI feels slow when adding to cart.

### Pitfall 5: Incorrect Business Day Calculation
**What goes wrong:** Order placed on Friday calculates Monday as valid (only 1 calendar day between), violating 48-hour rule.
**Why it happens:** Business days calculation counts weekdays but doesn't account for actual 48-hour time passage.
**How to avoid:** Requirement states "48 hours in advance" AND "excluding weekends in calculation." This means: if order placed Friday 2pm, cannot pick up Monday (48 hours would be Sunday, which is excluded). Earliest pickup is Tuesday. Implementation must check both business days AND ensure 48 actual hours pass.
**Warning signs:** Customer complaints about insufficient preparation time, edge case failures on Fridays.

### Pitfall 6: WhatsApp Link Encoding Issues
**What goes wrong:** WhatsApp message appears garbled, asterisks show as `%2A`, or newlines don't work.
**Why it happens:** Message isn't properly URL-encoded, or wrong encoding is used (double-encoding, missing encoding).
**How to avoid:**
- Use `encodeURIComponent()` on the entire message string
- Newlines: Use `\n` in JavaScript string, encodeURIComponent converts to `%0A`
- Bold formatting (`**text**`) works in WhatsApp but gets URL-encoded to `%2A%2Atext%2A%2A` (this is correct)
**Warning signs:** Message looks wrong in WhatsApp, special characters appear as codes.

### Pitfall 7: South African Phone Number Formats
**What goes wrong:** Valid SA numbers rejected (e.g., "082 123 4567" or "0821234567" marked invalid).
**Why it happens:** Phone validation expects international format but users enter national format with leading 0.
**How to avoid:** Use libphonenumber-js with country code 'ZA' - it handles national format: `parsePhoneNumber('0821234567', 'ZA')` correctly parses to `+27821234567`.
**Warning signs:** User confusion, support tickets about phone validation, cart abandonment at checkout.

### Pitfall 8: Date Picker Timezone Confusion
**What goes wrong:** User selects tomorrow's date, but system calculates it as today or yesterday.
**Why it happens:** Date picker returns UTC midnight, but business logic uses local time. SAST is UTC+2, so UTC 2026-02-01 00:00 is actually 2026-01-31 22:00 in UTC.
**How to avoid:** Always work in SAST timezone using date-fns-tz. When comparing dates, normalize to SAST midnight: `formatInTimeZone(date, 'Africa/Johannesburg', 'yyyy-MM-dd')`.
**Warning signs:** Date validation fails unexpectedly, dates off by one day.

## Code Examples

Verified patterns from official sources:

### Complete Cart Context with localStorage Sync
```typescript
// Source: https://www.pedroalonso.net/blog/building-shopping-cart-reat-localstorage/
// Adapted for TypeScript and separated contexts
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const CartStateContext = createContext<CartItem[]>([]);
const CartActionsContext = createContext<{
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('manna-cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse cart from localStorage', err);
      }
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('manna-cart', JSON.stringify(items));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Optionally: clear cart or show error to user
      }
    }
  }, [items]);

  const actions = useMemo(() => ({
    addItem: (item: Omit<CartItem, 'quantity'>) => {
      setItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    },
    removeItem: (id: string) => {
      setItems(prev => prev.filter(i => i.id !== id));
    },
    updateQuantity: (id: string, quantity: number) => {
      if (quantity <= 0) {
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        setItems(prev => prev.map(i =>
          i.id === id ? { ...i, quantity } : i
        ));
      }
    },
    clearCart: () => {
      setItems([]);
    }
  }), []);

  return (
    <CartStateContext.Provider value={items}>
      <CartActionsContext.Provider value={actions}>
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
}

export const useCartState = () => useContext(CartStateContext);
export const useCartActions = () => {
  const actions = useContext(CartActionsContext);
  if (!actions) throw new Error('useCartActions must be used within CartProvider');
  return actions;
};
```

### React Hook Form with Zod Phone Validation
```typescript
// Source: https://www.contentful.com/blog/react-hook-form-validation-zod/
// Source: https://github.com/react-hook-form/resolvers
import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().refine((val) => {
    try {
      const parsed = parsePhoneNumber(val, 'ZA');
      return parsed?.isValid() ?? false;
    } catch {
      return false;
    }
  }, 'Invalid South African phone number').transform((val) => {
    const parsed = parsePhoneNumber(val, 'ZA');
    return parsed!.format('E.164');
  }),
  pickupDate: z.date(),
  notes: z.string().optional(),
});

// Usage in component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(checkoutSchema),
});
```

### Date Picker with Weekend Disabling
```tsx
// Source: https://daypicker.dev/selections/disabling-dates
import { DayPicker } from 'react-day-picker';
import { getMinimumPickupDate } from '@/lib/date-utils';

export function PickupDatePicker({ value, onChange }: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}) {
  const minDate = getMinimumPickupDate();

  return (
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      disabled={[
        { dayOfWeek: [0, 6] }, // Disable weekends (Sunday=0, Saturday=6)
        { before: minDate }     // Disable dates before minimum
      ]}
    />
  );
}
```

### WhatsApp Link with Proper Encoding
```typescript
// Source: https://pureoxygenlabs.com/how-to-create-a-whatsapp-deep-link-with-a-pre-populated-message/
// Source: https://www.quickreply.ai/whatsapp-marketing/everything-you-need-to-know-about-whatsapp-url-links
export function createWhatsAppLink(phone: string, message: string): string {
  // Remove + from phone number for wa.me format
  const cleanPhone = phone.replace('+', '');

  // Encode message (handles spaces, newlines, special chars)
  const encodedMessage = encodeURIComponent(message);

  // wa.me is more reliable than api.whatsapp.com
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// Example usage
const message = `**New Order**
Name: John Smith
Phone: +27821234567

Items:
- Pasta Platter x 2 - R200.00
- Chocolate Cake x 1 - R150.00

Total: R550.00`;

const link = createWhatsAppLink('+27825795210', message);
// Result: https://wa.me/27825795210?text=**New%20Order**%0AName%3A%20...
```

### Astro Layout with React Provider
```astro
---
// src/layouts/BaseLayout.astro
import { CartProvider } from '@/lib/cart-context';
import { ToastProvider } from '@/components/react/ToastProvider';
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <CartProvider client:only="react">
      <ToastProvider client:load />
      <slot />
    </CartProvider>
  </body>
</html>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Formik for forms | React Hook Form | 2020-2021 | Better performance, fewer re-renders, smaller bundle |
| Moment.js for dates | date-fns | 2018-2019 | Tree-shakeable, immutable, modern API |
| google-libphonenumber | libphonenumber-js | 2019-2020 | Smaller bundle (30KB vs 500KB), maintained for web |
| Redux for cart | Context API | 2019-2020 | Simpler for small state, no middleware needed |
| react-toastify | Sonner | 2023-2024 | No setup, better TypeScript, modern API |
| Separate date-picker libs | react-day-picker | 2023-2024 | Hooks-based, accessible, customizable |

**Deprecated/outdated:**
- **Moment.js**: No longer maintained, use date-fns or Luxon
- **Redux for simple cart**: Overkill for this use case, Context API sufficient
- **Class components for forms**: React Hook Form requires hooks
- **Uncontrolled forms in React**: Poor UX, hard to validate, use controlled with React Hook Form

## Open Questions

Things that couldn't be fully resolved:

1. **Public Holiday Updates**
   - What we know: 2026 SA public holidays are confirmed
   - What's unclear: How to handle future years (2027+) without manual updates
   - Recommendation: Hard-code 2026 holidays, add comment to update annually. Consider holiday API service for production.

2. **WhatsApp Business API vs Web API**
   - What we know: wa.me links work universally
   - What's unclear: Whether WhatsApp Business API would provide better integration (message confirmation, webhook)
   - Recommendation: Use wa.me for Phase 2 (zero setup). Consider Business API in future phase if order tracking needed.

3. **Cart State Persistence Duration**
   - What we know: localStorage persists indefinitely until cleared
   - What's unclear: How long cart should persist (days? weeks? session only?)
   - Recommendation: Persist indefinitely for Phase 2. Add expiration timestamp in future if needed.

4. **Mobile App Deep Link Fallback**
   - What we know: wa.me links open WhatsApp app if installed, web otherwise
   - What's unclear: Whether explicit fallback to tel: link or SMS needed
   - Recommendation: wa.me handles both cases. Add "Contact us: [phone]" text near button as manual fallback.

## Sources

### Primary (HIGH confidence)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/) - Official integration guide
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Official architecture docs
- [React Hook Form](https://react-hook-form.com/) - Official documentation
- [React Hook Form Resolvers](https://github.com/react-hook-form/resolvers) - Official Zod integration
- [date-fns](https://date-fns.org/) - Official library
- [date-fns-tz npm](https://www.npmjs.com/package/date-fns-tz) - Timezone support
- [libphonenumber-js GitHub](https://github.com/catamphetamine/libphonenumber-js) - Library source
- [react-day-picker](https://daypicker.dev/docs/selection-modes) - Official docs
- [Headless UI Tabs](https://headlessui.com/react/tabs) - Official component
- [Sonner (react-hot-toast)](https://react-hot-toast.com/) - Modern toast library

### Secondary (MEDIUM confidence)
- [Astro Client Directives Explained](https://medium.com/@mirko.tomhave/astro-client-directives-explained-b0daac284c0) - Community guide
- [Building Shopping Cart with React and localStorage](https://www.pedroalonso.net/blog/building-shopping-cart-reat-localstorage/) - Implementation pattern
- [React Form Validation with Zod](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/) - Integration guide
- [WhatsApp Deep Link Guide](https://pureoxygenlabs.com/how-to-create-a-whatsapp-deep-link-with-a-pre-populated-message/) - URL format
- [React Context API Performance](https://kentcdodds.com/blog/how-to-optimize-your-context-value) - Kent C. Dodds optimization guide
- [localStorage Quota Error Handling](https://mmazzarolo.com/blog/2022-06-25-local-storage-status/) - Error handling patterns
- [South Africa Public Holidays 2026](https://www.timeanddate.com/holidays/south-africa/2026) - Official holiday list
- [E.164 Phone Format Guide](https://www.sent.dm/resources/e164-phone-format) - Format specification

### Tertiary (LOW confidence - marked for validation)
- [React Shopping Cart Common Mistakes](https://blog.logrocket.com/react-patterns-common-pitfalls-local-state-management/) - Community patterns (verify against project needs)
- [WhatsApp Link Generator](https://www.delightchat.io/whatsapp-link-generator) - Third-party tool (verify URL format)
- [Best React Form Libraries 2026](https://blog.croct.com/post/best-react-form-libraries) - Comparison article (verify versions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via official docs and Context7 for major libraries
- Architecture: HIGH - Patterns confirmed in official Astro, React Hook Form, and date-fns docs
- Pitfalls: MEDIUM - Based on community articles and known issues (WebSearch + cross-verification)
- Business day calculation: MEDIUM - Custom logic needed, public holidays verified from timeanddate.com
- WhatsApp integration: HIGH - Official wa.me format confirmed in multiple sources

**Research date:** 2026-01-28
**Valid until:** 2026-03-28 (60 days - stable ecosystem, but verify library versions before implementation)

**Key risks:**
- Public holidays need annual updates
- Phone number formats may vary for international customers (future consideration)
- WhatsApp API format could change (low risk, stable since 2018)
- React/Astro major version updates could affect hydration patterns
