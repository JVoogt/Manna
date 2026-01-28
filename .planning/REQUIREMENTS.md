# Requirements: Manna Kitchen Website

**Defined:** 2026-01-28
**Core Value:** Customers can easily browse products, build custom platters or select weekly meals, and place orders that seamlessly flow to Manna via WhatsApp for personalized service and fulfillment.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Infrastructure

- [x] **INFRA-01**: Site deployed via Docker Compose on Raspberry Pi
- [x] **INFRA-02**: Traefik reverse proxy configured with SSL certificate
- [x] **INFRA-03**: Site accessible at manna.voogt.co.za via Cloudflare DNS
- [x] **INFRA-04**: All pages served over HTTPS (SSL enabled)
- [x] **INFRA-05**: Site handles 20+ concurrent users without performance degradation
- [x] **INFRA-06**: Astro static site builds successfully on ARM64 architecture

### Content Management

- [x] **CONTENT-01**: Products loaded from products.json file
- [x] **CONTENT-02**: Weekly meals loaded from meals.json file
- [x] **CONTENT-03**: JSON schema validation prevents syntax errors
- [x] **CONTENT-04**: Admin can update JSON files without developer assistance
- [x] **CONTENT-05**: Product images optimized to <200KB for mobile
- [x] **CONTENT-06**: Images use WebP format with JPEG fallback
- [x] **CONTENT-07**: Responsive images with srcset for different screen sizes

### Product Display

- [ ] **DISPLAY-01**: Homepage shows platter builder and weekly meals prominently
- [ ] **DISPLAY-02**: Product menu displays all available snack items with photos
- [ ] **DISPLAY-03**: Each product shows name, description, and individual price
- [ ] **DISPLAY-04**: Weekly meals section displays 1-3 meals with image, name, description, and price
- [ ] **DISPLAY-05**: Dietary and allergen information visible for all items
- [ ] **DISPLAY-06**: Product photos are high-quality and appetizing

### Custom Platter Builder

- [ ] **PLATTER-01**: User can view all available snack items in platter builder
- [ ] **PLATTER-02**: User can select exactly 6 items for their platter
- [ ] **PLATTER-03**: Selection counter shows X/6 items selected
- [ ] **PLATTER-04**: Selected items are visually distinguished (highlight, checkmark)
- [ ] **PLATTER-05**: User cannot add platter to cart until exactly 6 items selected
- [ ] **PLATTER-06**: Platter price calculated as sum of 6 individual item prices
- [ ] **PLATTER-07**: Price updates in real-time as items are selected
- [ ] **PLATTER-08**: User can deselect items and choose different ones
- [ ] **PLATTER-09**: User can add multiple platters to cart (each with different items)
- [ ] **PLATTER-10**: Platter builder works perfectly on mobile (tap targets 44x44px minimum)

### Shopping Cart

- [ ] **CART-01**: User can add platters and meals to cart
- [ ] **CART-02**: Cart displays all items with quantities and individual prices
- [ ] **CART-03**: Cart shows running total of all items
- [ ] **CART-04**: User can view cart from any page (cart toggle/icon)
- [ ] **CART-05**: User can increase/decrease quantities in cart
- [ ] **CART-06**: User can remove items from cart
- [ ] **CART-07**: Cart state persists across page navigation
- [ ] **CART-08**: Cart state persists on browser refresh (localStorage)
- [ ] **CART-09**: Empty cart shows helpful message and link to menu

### Checkout & Order Submission

- [ ] **CHECKOUT-01**: User can access checkout from cart
- [ ] **CHECKOUT-02**: Checkout form collects customer name
- [ ] **CHECKOUT-03**: Checkout form collects customer phone number
- [ ] **CHECKOUT-04**: Checkout form collects pickup date and time
- [ ] **CHECKOUT-05**: Phone number validated and normalized to E.164 format (+27XXXXXXXXX)
- [ ] **CHECKOUT-06**: Pickup date enforced to be at least 48 hours in future for platters
- [ ] **CHECKOUT-07**: Date validation excludes weekends for 48-hour calculation
- [ ] **CHECKOUT-08**: Date/time displayed in SAST (South African Standard Time)
- [ ] **CHECKOUT-09**: Form validates all required fields before submission
- [ ] **CHECKOUT-10**: Order details formatted clearly for WhatsApp message
- [ ] **CHECKOUT-11**: WhatsApp message sent to +27825795210 on order submission
- [ ] **CHECKOUT-12**: WhatsApp message includes: customer name, phone, pickup time, itemized order, total price
- [ ] **CHECKOUT-13**: User sees confirmation after successful order submission
- [ ] **CHECKOUT-14**: Cart cleared after successful order submission

### Information Pages

- [x] **INFO-01**: About page tells story of two sisters and Manna Kitchen
- [x] **INFO-02**: About page explains how ordering and pickup process works
- [x] **INFO-03**: Contact page shows business address/location
- [x] **INFO-04**: Contact page shows operating hours
- [x] **INFO-05**: Contact page shows phone number and WhatsApp contact
- [x] **INFO-06**: Contact information visible in site footer on all pages

### Design & Mobile Experience

- [ ] **DESIGN-01**: Site has rustic traditional South African aesthetic
- [ ] **DESIGN-02**: Design uses warm colors and traditional design elements
- [ ] **DESIGN-03**: Site is mobile-first responsive (works perfectly on 375px screens)
- [ ] **DESIGN-04**: All interactive elements have minimum 44x44px tap targets
- [ ] **DESIGN-05**: Site works on iOS Safari, Android Chrome, and desktop browsers
- [ ] **DESIGN-06**: Typography is readable on mobile (minimum 16px body text)
- [ ] **DESIGN-07**: Images lazy-load (except above-fold content)
- [ ] **DESIGN-08**: Page load time under 3 seconds on 4G mobile connection

### SEO & Analytics

- [ ] **SEO-01**: Google Analytics tracking code installed
- [ ] **SEO-02**: Page titles optimized with "Pretoria North" keywords
- [ ] **SEO-03**: Meta descriptions written for all pages
- [ ] **SEO-04**: Semantic HTML structure (h1, h2, proper heading hierarchy)
- [ ] **SEO-05**: Alt text provided for all images
- [ ] **SEO-06**: Sitemap.xml generated and submitted
- [ ] **SEO-07**: Open Graph tags for social media sharing

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

*(None defined yet - focus on v1 launch first)*

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts/authentication | Adds complexity and causes 19% cart abandonment. Guest checkout aligns with business model. |
| Online payment processing | Payment handled via WhatsApp maintains personal service. Avoids transaction fees and compliance burden. |
| Delivery service | Pickup-only model fits small-scale operation. Delivery adds logistics complexity. |
| Real-time inventory tracking | Manual JSON updates sufficient for current scale. Over-engineered for weekly content changes. |
| Live chat support | WhatsApp serves this purpose. Additional chat widget adds complexity. |
| Complex loyalty program | Personal relationships via WhatsApp provide better retention than automated points system. |
| Advanced search/filtering | Small curated menu doesn't need search. Adds UI complexity without value. |
| Automated order management system | WhatsApp conversation is the order record. CRM overhead not needed at this scale. |
| Mobile native apps | Progressive web app sufficient. Native apps require ongoing maintenance and app store fees. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| INFRA-05 | Phase 1 | Complete |
| INFRA-06 | Phase 1 | Complete |
| CONTENT-01 | Phase 1 | Complete |
| CONTENT-02 | Phase 1 | Complete |
| CONTENT-03 | Phase 1 | Complete |
| CONTENT-04 | Phase 1 | Complete |
| CONTENT-05 | Phase 1 | Complete |
| CONTENT-06 | Phase 1 | Complete |
| CONTENT-07 | Phase 1 | Complete |
| INFO-01 | Phase 1 | Complete |
| INFO-02 | Phase 1 | Complete |
| INFO-03 | Phase 1 | Complete |
| INFO-04 | Phase 1 | Complete |
| INFO-05 | Phase 1 | Complete |
| INFO-06 | Phase 1 | Complete |
| DISPLAY-01 | Phase 2 | Pending |
| DISPLAY-02 | Phase 2 | Pending |
| DISPLAY-03 | Phase 2 | Pending |
| DISPLAY-04 | Phase 2 | Pending |
| DISPLAY-05 | Phase 2 | Pending |
| DISPLAY-06 | Phase 2 | Pending |
| CART-01 | Phase 2 | Pending |
| CART-02 | Phase 2 | Pending |
| CART-03 | Phase 2 | Pending |
| CART-04 | Phase 2 | Pending |
| CART-05 | Phase 2 | Pending |
| CART-06 | Phase 2 | Pending |
| CART-07 | Phase 2 | Pending |
| CART-08 | Phase 2 | Pending |
| CART-09 | Phase 2 | Pending |
| CHECKOUT-01 | Phase 2 | Pending |
| CHECKOUT-02 | Phase 2 | Pending |
| CHECKOUT-03 | Phase 2 | Pending |
| CHECKOUT-04 | Phase 2 | Pending |
| CHECKOUT-05 | Phase 2 | Pending |
| CHECKOUT-06 | Phase 2 | Pending |
| CHECKOUT-07 | Phase 2 | Pending |
| CHECKOUT-08 | Phase 2 | Pending |
| CHECKOUT-09 | Phase 2 | Pending |
| CHECKOUT-10 | Phase 2 | Pending |
| CHECKOUT-11 | Phase 2 | Pending |
| CHECKOUT-12 | Phase 2 | Pending |
| CHECKOUT-13 | Phase 2 | Pending |
| CHECKOUT-14 | Phase 2 | Pending |
| PLATTER-01 | Phase 3 | Pending |
| PLATTER-02 | Phase 3 | Pending |
| PLATTER-03 | Phase 3 | Pending |
| PLATTER-04 | Phase 3 | Pending |
| PLATTER-05 | Phase 3 | Pending |
| PLATTER-06 | Phase 3 | Pending |
| PLATTER-07 | Phase 3 | Pending |
| PLATTER-08 | Phase 3 | Pending |
| PLATTER-09 | Phase 3 | Pending |
| PLATTER-10 | Phase 3 | Pending |
| DESIGN-01 | Phase 4 | Pending |
| DESIGN-02 | Phase 4 | Pending |
| DESIGN-03 | Phase 4 | Pending |
| DESIGN-04 | Phase 4 | Pending |
| DESIGN-05 | Phase 4 | Pending |
| DESIGN-06 | Phase 4 | Pending |
| DESIGN-07 | Phase 4 | Pending |
| DESIGN-08 | Phase 4 | Pending |
| SEO-01 | Phase 4 | Pending |
| SEO-02 | Phase 4 | Pending |
| SEO-03 | Phase 4 | Pending |
| SEO-04 | Phase 4 | Pending |
| SEO-05 | Phase 4 | Pending |
| SEO-06 | Phase 4 | Pending |
| SEO-07 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 73 total
- Mapped to phases: 73/73 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after roadmap creation with 100% coverage*
