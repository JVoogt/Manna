# Roadmap: Manna Kitchen Website

## Overview

A 4-phase journey from infrastructure to launch, building a mobile-first ordering website where customers browse products, build custom 6-item platters or order weekly meals, and place orders via WhatsApp. Each phase delivers a complete, verifiable capability that builds toward a production-ready ordering system optimized for Raspberry Pi hosting.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Content** - Infrastructure, content management, and static pages
- [ ] **Phase 2: Core Ordering Flow** - Product display, shopping cart, and checkout
- [ ] **Phase 3: Custom Platter Builder** - 6-item platter builder with validation
- [ ] **Phase 4: Polish & Launch** - Mobile optimization, SEO, and production launch

## Phase Details

### Phase 1: Foundation & Content
**Goal**: Site deployed on Raspberry Pi with content management system ready for products and meals

**Depends on**: Nothing (first phase)

**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06, CONTENT-07, INFO-01, INFO-02, INFO-03, INFO-04, INFO-05, INFO-06

**Success Criteria** (what must be TRUE):
  1. Site is accessible at https://manna.voogt.co.za via Cloudflare DNS with valid SSL certificate
  2. Admin can update products.json and meals.json files and see changes reflected after rebuild
  3. Site handles 20+ concurrent users without performance degradation on Raspberry Pi
  4. Product and meal images load quickly on mobile (<3 seconds on 4G)
  5. About page tells the sisters' story and Contact page shows location, hours, and WhatsApp

**Plans**: TBD

Plans:
- [ ] 01-01: TBD during planning
- [ ] 01-02: TBD during planning
- [ ] 01-03: TBD during planning

---

### Phase 2: Core Ordering Flow
**Goal**: Customers can browse products, add items to cart, and place orders via WhatsApp

**Depends on**: Phase 1

**Requirements**: DISPLAY-01, DISPLAY-02, DISPLAY-03, DISPLAY-04, DISPLAY-05, DISPLAY-06, CART-01, CART-02, CART-03, CART-04, CART-05, CART-06, CART-07, CART-08, CART-09, CHECKOUT-01, CHECKOUT-02, CHECKOUT-03, CHECKOUT-04, CHECKOUT-05, CHECKOUT-06, CHECKOUT-07, CHECKOUT-08, CHECKOUT-09, CHECKOUT-10, CHECKOUT-11, CHECKOUT-12, CHECKOUT-13, CHECKOUT-14

**Success Criteria** (what must be TRUE):
  1. User can view all available products and weekly meals with photos, prices, and descriptions on mobile
  2. User can add weekly meals to cart, view cart from any page, and modify quantities
  3. User can complete checkout form with name, phone, and pickup date
  4. System enforces 48-hour lead time for platters (excluding weekends) and validates pickup date
  5. Order is sent to +27825795210 via WhatsApp with complete details and customer sees confirmation

**Plans**: TBD

Plans:
- [ ] 02-01: TBD during planning
- [ ] 02-02: TBD during planning
- [ ] 02-03: TBD during planning

---

### Phase 3: Custom Platter Builder
**Goal**: Customers can build custom 6-item snack platters with real-time pricing

**Depends on**: Phase 2

**Requirements**: PLATTER-01, PLATTER-02, PLATTER-03, PLATTER-04, PLATTER-05, PLATTER-06, PLATTER-07, PLATTER-08, PLATTER-09, PLATTER-10

**Success Criteria** (what must be TRUE):
  1. User can select exactly 6 snack items from available inventory on mobile
  2. Selection counter shows X/6 items selected and selected items are visually distinguished
  3. Price calculates in real-time as sum of 6 individual item prices
  4. User cannot add incomplete platter (less than 6 items) to cart
  5. User can add multiple different platters to cart and proceed through checkout

**Plans**: TBD

Plans:
- [ ] 03-01: TBD during planning
- [ ] 03-02: TBD during planning

---

### Phase 4: Polish & Launch
**Goal**: Production-ready website with mobile optimization, SEO, and full testing complete

**Depends on**: Phase 3

**Requirements**: DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06, DESIGN-07, DESIGN-08, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07

**Success Criteria** (what must be TRUE):
  1. Site has rustic South African aesthetic with warm colors and mobile-first responsive design
  2. All interactive elements have minimum 44x44px tap targets and work on iOS Safari and Android Chrome
  3. Page load time is under 3 seconds on 4G mobile connection with images lazy-loading
  4. Google Analytics tracking code installed and all pages have SEO metadata with Pretoria keywords
  5. Site tested on real devices with user acceptance testing completed and ready for production launch

**Plans**: TBD

Plans:
- [ ] 04-01: TBD during planning
- [ ] 04-02: TBD during planning

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Content | 0/TBD | Not started | - |
| 2. Core Ordering Flow | 0/TBD | Not started | - |
| 3. Custom Platter Builder | 0/TBD | Not started | - |
| 4. Polish & Launch | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-28*
*Last updated: 2026-01-28*
