# Phase 2: Core Ordering Flow - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

E-commerce ordering flow where customers browse products and weekly meals, build a shopping cart, complete checkout details (name, phone, pickup date with 48-hour lead time), and place orders via WhatsApp (+27825795210). This phase covers the complete ordering journey from product discovery to WhatsApp handoff.

</domain>

<decisions>
## Implementation Decisions

### Product browsing layout
- Card-based layout (not list or grid)
- Single page with tabs/sections to switch between Products and Weekly Meals (not separate pages)
- Each card shows: Image + Name + Price + Short description (1-2 line preview)
- "Add to Cart" button visible on each card
- Quantity defaults to 1 when adding (no quantity selector on card)

### Cart access & visibility
- Cart accessed via header navigation link to dedicated /cart page
- Cart icon shows counter badge only when cart has items (hidden when empty)
- Cart page displays: Editable list of items + Order summary box
- Items show: image, name, price, quantity selector, remove button
- Summary box shows: subtotal, item count, checkout button
- After adding item: Toast notification appears + user stays on products page (no redirect)

### Checkout form structure
- Single page form with all fields visible (not multi-step wizard)
- Fields: Name, Phone, Pickup Date, Optional Notes
- Date picker: Calendar widget (visual date picker)
- Invalid dates (weekends, within 48 hours) are disabled/grayed in calendar
- Help text below date field: "Orders require 48 hours notice (excluding weekends)"
- Validation approach: Combination
  - Required field errors appear on form submission
  - Format errors (phone, date) appear inline as user types/leaves field

### WhatsApp order handoff
- Direct WhatsApp link opens immediately after form submission (no confirmation screen)
- Pre-filled message uses structured format with headers:
  ```
  **New Order**
  Name: [name]
  Phone: [phone]
  Pickup: [date]

  Items:
  - [item] x [qty] - R[price]
  - [item] x [qty] - R[price]

  Total: R[total]
  ```
- Fallback: Show alternative contact methods if WhatsApp unavailable (call number, email)
- After WhatsApp opens: Toast message "Order sent to WhatsApp! Please send the message to complete."
- User stays on current page (no redirect to confirmation page)

### Claude's Discretion
- Exact tab/section switcher design for products/meals
- Card shadow depth, border radius, spacing
- Toast notification animation and duration
- Loading states (skeletons, spinners)
- Empty cart state message and illustration
- Calendar widget specific library/implementation
- Phone number format validation rules (SA format)
- Error message text for validation failures

</decisions>

<specifics>
## Specific Ideas

- Toast notifications should be non-blocking and appear briefly (3-4 seconds)
- WhatsApp number: +27825795210
- Cart page follows the classic e-commerce pattern: list on left/top, summary on right/bottom
- Calendar should clearly communicate why dates are disabled (visual + help text)
- Mobile-first: 44px minimum touch targets (from Phase 1)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-core-ordering-flow*
*Context gathered: 2026-01-28*
