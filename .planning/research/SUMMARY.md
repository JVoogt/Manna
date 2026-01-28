# Project Research Summary

**Project:** Manna Kitchen Ordering Website
**Domain:** Food ordering website with custom platter builder
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

Manna Kitchen is a small food business ordering website that needs to handle two core workflows: custom platter builder (pick 6 items) and weekly meal ordering, deployed on a Raspberry Pi with WhatsApp-based order submission. Research reveals this is a perfect fit for a static-first architecture with selective interactivity—specifically Astro with Islands Architecture, which renders the vast majority as static HTML while hydrating only interactive components (cart, platter builder, checkout form).

The recommended approach prioritizes mobile-first design (80% of food orders are mobile), minimal JavaScript bundle size (critical for Pi hosting and mobile performance), and guest checkout flow (forced registration causes 19% cart abandonment). Core technologies are Astro 5.16.15, TailwindCSS 4.x for mobile-first styling, Nanostores for lightweight state management, and WhatsApp Click-to-Chat integration (simpler and cheaper than Business API for MVP scale). Content is managed via JSON files with Astro Content Collections for type safety—no database needed, keeping infrastructure lean for Pi hosting.

Key risks center on Pi performance under concurrent load, mobile ordering friction causing 68.8% cart abandonment, date/timezone validation for 48-hour lead time enforcement, and JSON structure stability for non-technical admin editing. These are all manageable with proper load testing, mobile-first UX testing on real devices, robust validation with business day calculation, and JSON schema validation with clear admin workflows. The architecture is battle-tested for this use case, and all recommended technologies have verified ARM64 support for Raspberry Pi deployment.

## Key Findings

### Recommended Stack

Astro with Islands Architecture is the clear winner for this use case—static generation provides instant page loads with zero JavaScript for content pages, while selective hydration ("islands") handles interactivity only where needed (cart, platter builder, checkout). This gives the best of both worlds: excellent performance for mobile users and Pi hosting, with modern interactive features where they matter.

**Core technologies:**
- **Astro 5.16.15**: Static site generator with Island Architecture — zero JavaScript by default, selective hydration for interactive components, Content Layer API for JSON with Zod schema validation
- **TailwindCSS 4.x**: Mobile-first CSS framework — utility-first approach accelerates development, mobile-first breakpoints align with 80% mobile traffic, minimal runtime overhead
- **Nanostores (0.11.x)**: Tiny state management (265-814 bytes) — framework-agnostic, persistent localStorage for cart, atomic stores with computed values, perfect for cross-component cart state
- **Alpine.js (3.x)**: Lightweight JavaScript (12KB) — declarative syntax for interactive components, alternative to heavier frameworks, works well with Astro's islands
- **Node.js 22.x LTS**: Runtime environment — official ARM64 support for Raspberry Pi, best performance for Astro builds, lightweight memory footprint
- **WhatsApp Click-to-Chat**: Order submission — simple URL format, no API setup/authentication, free for <1000 orders/month, perfect for MVP scale

**Critical version notes:**
- Astro 5.2+ required for TailwindCSS v4 first-class support
- Node.js 22+ required for optimal Astro build performance
- Sharp (image optimization) auto-installs ARM64 prebuilds

**ARM64 compatibility:** All recommended packages verified for Raspberry Pi deployment.

### Expected Features

Food ordering websites have well-established feature expectations. Missing table stakes features causes immediate trust issues and abandonment.

**Must have (table stakes):**
- Mobile-optimized interface — 80% of traffic, 36% abandon if not mobile-friendly
- Clear menu display with high-quality photos — images increase orders by 25-35%
- Simple cart management — users expect to see/edit before checkout
- Guest checkout (no forced registration) — forced accounts cause 19% abandonment
- 48-hour lead time validation — prevents unrealistic delivery expectations
- SSL certificate (HTTPS) — browsers mark HTTP as "Not Secure"
- Contact information visible — builds trust for small home business
- Dietary/allergen information — health risk if missing, users may not order

**Should have (competitive advantage):**
- Custom platter builder (pick 6 items) — core unique value proposition
- WhatsApp order integration — personal service, eliminates 30% platform fees
- Weekly changing menu — creates urgency and repeat visits
- Authentic home cooking story — trust signal for home-based business
- Customer testimonials/reviews — social proof crucial for new small business
- 48-hour lead time transparency — sets expectations upfront

**Defer (v2+):**
- User accounts with login — adds complexity, causes abandonment
- Real-time inventory tracking — over-engineered for manual JSON management
- Automated payment processing — removes personal touch, adds compliance burden
- Delivery service — wrong business model for 1-person operation
- Complex loyalty program — personal relationships via WhatsApp are better retention
- Live chat support — WhatsApp serves this purpose
- Advanced search/filtering — not needed for small curated menu

**Anti-features to avoid:**
Research identified common features that seem good but create problems at this scale: forced user accounts, automated payment processing, real-time inventory, delivery service, complex loyalty programs. These add significant complexity without benefit for a small home business model focused on personal service via WhatsApp.

### Architecture Approach

Astro Islands Architecture is the proven pattern for content-heavy sites with selective interactivity. The vast majority of the site is static HTML (menu pages, about, contact), with small "islands" of JavaScript hydrated only where needed (cart toggle, platter builder, checkout form). This architecture is specifically optimized for this exact use case.

**Major components:**

1. **Static pages** (Astro components, 0KB JavaScript) — Home, About, Contact, Menu listing pages rendered at build time from JSON data
2. **Interactive islands** (React/Preact, selective hydration) — PlatterBuilder, ShoppingCart, CartFlyout, CheckoutForm hydrated client-side with strategic directives (client:load, client:visible, client:idle)
3. **State management** (Nanostores) — Centralized cart store with localStorage persistence, computed totals/counts, framework-agnostic shared state across islands
4. **Data layer** (JSON + Content Collections) — Products.json, meals.json with Zod schema validation, loaded at build time, no database needed
5. **WhatsApp integration** (Client-side URL construction) — Format order details, construct https://wa.me/27XXXXXXXXX?text={encoded}, open in new tab

**Key patterns:**
- JSON-driven content with Content Collections for type safety
- Persistent cart state with @nanostores/persistent for localStorage sync
- Mobile-first responsive design with TailwindCSS breakpoints
- Component-driven development (Atomic Design: atoms → molecules → organisms)
- Strategic client directives to minimize JavaScript bundle

**Data flow:**
Build time: JSON files → Content Collections → Static HTML pages
Runtime: User interaction → Island hydration → Nano Stores update → localStorage persistence → WhatsApp submission

**Critical insight:** No database needed. JSON files act as lightweight CMS with git version control. Admin edits JSON directly, commits changes, rebuilds site. Simple, version-controlled, fast, no DB overhead.

### Critical Pitfalls

Research identified seven critical pitfalls specific to this domain and architecture. These must be addressed proactively during implementation.

1. **Pi hosting performance bottlenecks** — Raspberry Pi overwhelmed under concurrent load due to CPU/memory limits and home internet upload speed. Prevention: Load test with 20+ concurrent users, configure Nginx worker settings, implement aggressive CDN caching, monitor resources with htop/netdata. Address in Phase 1 (Infrastructure Setup).

2. **Mobile ordering friction causing 68.8% cart abandonment** — Small tap targets, unclear selection states, confusing multi-step flows. Prevention: Mobile-first design (375px first), 44x44px tap targets, progressive disclosure, real device testing. Address in Phase 3 (Core Ordering Flow) and Phase 4 (Platter Builder).

3. **Date/timezone issues breaking 48-hour lead time** — Server timezone vs customer timezone mismatches, DST transitions, weekend/holiday handling. Prevention: Always calculate in UTC, display in SAST, business day calculation (exclude weekends), validate both client and server-side. Address in Phase 3 (Core Ordering Flow).

4. **WhatsApp phone number formatting failures** — SA users enter "082 123 4567" but API requires "+27821234567" E.164 format. Prevention: Input masking, aggressive normalization (strip spaces/parentheses), auto-prepend +27 for SA numbers, regex validation. Address in Phase 5 (WhatsApp Integration).

5. **JSON structure changes breaking non-technical admin edits** — Admin removes comma or changes structure, site crashes with "Unexpected token" error. Prevention: JSON schema validation, visual editor or clear guide, version control for rollback, freeze structure early, migration scripts if changes needed. Address in Phase 2 (Menu & Content Structure).

6. **Custom platter validation edge cases** — Invalid combinations accepted (e.g., 2 items when minimum is 3), pricing errors, inventory not checked. Prevention: Server-side validation (never trust client), business rules engine, edge case test matrix, disable invalid options in UI. Address in Phase 4 (Platter Builder).

7. **Image performance destroying mobile experience** — 5-10MB camera photos load slowly on mobile, cause layout shift, exhaust Pi bandwidth. Prevention: Image optimization pipeline (sharp/ImageMagick to 80-85% quality), responsive images with srcset, WebP/AVIF with JPEG fallback, lazy loading (exclude above-fold), always specify width/height. Address in Phase 2 (Menu & Content Structure).

## Implications for Roadmap

Based on architecture dependencies and pitfall prevention strategies, suggested phase structure:

### Phase 1: Foundation & Infrastructure (Week 1)
**Rationale:** Must establish Pi hosting environment and validate performance before building features. Pi performance is a critical constraint that affects all subsequent work.

**Delivers:**
- Docker configuration for Astro on Raspberry Pi
- Traefik reverse proxy setup with SSL
- Load testing framework and baseline performance
- Static site skeleton (layout components, routing)

**Addresses:**
- Pi performance bottlenecks (Pitfall 1) — configure and load test early
- SSL certificate requirement (FEATURES.md table stakes)

**Avoids:** Building features on infrastructure that can't handle production load

**Research flag:** SKIP — Docker/Traefik/Pi hosting well-documented, standard patterns apply

---

### Phase 2: Menu & Content Structure (Week 1-2)
**Rationale:** JSON data structure is foundation for all features. Must be stable before admin starts editing or components start consuming. Image optimization must be established before content is added.

**Delivers:**
- JSON schema design (products.json, meals.json, config.json)
- Astro Content Collections with Zod validation
- Image optimization pipeline (responsive images, WebP/AVIF)
- Static menu pages displaying products
- ProductCard and MealCard components

**Addresses:**
- JSON structure stability (Pitfall 5) — establish schema with validation early
- Image performance (Pitfall 7) — set up optimization pipeline before images are added
- Clear menu display with photos (FEATURES.md table stakes)
- Dietary/allergen information (FEATURES.md table stakes)

**Avoids:** JSON structure changes after admin has started editing, unoptimized images slowing mobile experience

**Research flag:** SKIP — Content Collections and JSON patterns well-documented in Astro docs

---

### Phase 3: Core Ordering Flow (Week 2)
**Rationale:** Cart infrastructure is reusable foundation needed by platter builder and checkout. Must work perfectly on mobile before adding complexity of custom platter logic.

**Delivers:**
- Nanostores cart store with localStorage persistence
- CartToggle, CartFlyout, AddToCartButton islands
- Mobile-first responsive cart UI
- Simple "add to cart" flow for weekly meals
- Guest checkout form foundation

**Addresses:**
- Simple cart management (FEATURES.md table stakes)
- Mobile ordering friction (Pitfall 2) — mobile-first design from start
- Guest checkout requirement (FEATURES.md table stakes)

**Uses:**
- Nanostores for state management (STACK.md)
- TailwindCSS mobile-first breakpoints (STACK.md)

**Avoids:** Building complex platter builder before cart infrastructure is proven

**Research flag:** SKIP — Nanostores + Astro islands well-documented, official integration guide exists

---

### Phase 4: Custom Platter Builder (Week 2-3)
**Rationale:** Core unique value proposition, but depends on cart infrastructure and requires extensive validation. Most complex interactive component.

**Delivers:**
- PlatterBuilder island with category filters
- 6-item selection logic with visual feedback
- Live price calculation
- Validation (exactly 6 items, business rules)
- Integration with cart store
- Mobile-optimized builder UI

**Addresses:**
- Custom platter builder (FEATURES.md competitive advantage — core unique value)
- Platter validation edge cases (Pitfall 6) — comprehensive validation and edge case testing
- Mobile ordering friction (Pitfall 2) — test builder extensively on mobile devices

**Implements:**
- PlatterBuilder component (ARCHITECTURE.md)
- Business rules validation (ARCHITECTURE.md)

**Avoids:** Invalid platter combinations reaching kitchen, pricing errors

**Research flag:** CONSIDER — Custom product builder patterns are domain-specific. May benefit from targeted research on validation strategies and UI patterns, but basic implementation is straightforward.

---

### Phase 5: Checkout & WhatsApp Integration (Week 3-4)
**Rationale:** Depends on cart being fully functional. Validation logic (48-hour lead time, phone formatting) is critical and must be thoroughly tested.

**Delivers:**
- CheckoutForm island with validation
- 48-hour lead time enforcement with business day logic
- Phone number normalization to E.164 format
- Date/time picker with availability checking
- WhatsApp message formatter
- WhatsApp URL construction and submission
- Order confirmation screen

**Addresses:**
- WhatsApp order integration (FEATURES.md competitive advantage)
- 48-hour lead time validation (FEATURES.md table stakes)
- Date/timezone issues (Pitfall 3) — robust business day calculation, UTC/SAST handling
- WhatsApp phone formatting (Pitfall 4) — aggressive normalization and validation
- Order confirmation (FEATURES.md table stakes)

**Implements:**
- CheckoutForm component (ARCHITECTURE.md)
- WhatsApp integration (ARCHITECTURE.md)
- Date validation utilities (ARCHITECTURE.md lib/date-utils.ts)

**Avoids:** Orders with insufficient lead time, phone number format failures causing silent failures

**Research flag:** CONSIDER — WhatsApp API phone number requirements and SA number formats may need targeted research. Date/timezone handling with business days has edge cases worth researching.

---

### Phase 6: Polish & Mobile Optimization (Week 4)
**Rationale:** Dedicated phase to ensure production-ready quality, mobile UX excellence, and Pi performance optimization.

**Delivers:**
- Mobile-first responsive design audit (all components)
- Real device testing (iOS/Android)
- Accessibility audit (keyboard, screen readers, ARIA)
- Performance optimization (image lazy loading, bundle analysis)
- Error handling and loading states
- About page with trust signals
- Contact page

**Addresses:**
- Mobile-optimized interface (FEATURES.md table stakes)
- Business information (FEATURES.md table stakes)
- Contact information visible (FEATURES.md table stakes)
- Mobile ordering friction (Pitfall 2) — final testing on real devices

**Avoids:** Shipping with poor mobile UX, accessibility issues, slow performance

**Research flag:** SKIP — Well-established best practices for mobile UX, accessibility, and performance

---

### Phase 7: Testing & Launch (Week 5)
**Rationale:** Comprehensive testing phase to catch integration issues, validate all pitfall prevention strategies, and ensure smooth launch.

**Delivers:**
- Cross-browser testing (Chrome, Safari, Firefox on mobile/desktop)
- User acceptance testing with real customers
- Performance testing (Lighthouse, Core Web Vitals)
- WhatsApp integration testing (real phones, various number formats)
- Load testing on Pi (20+ concurrent users)
- Documentation (admin JSON editing guide, deployment guide)
- Production launch

**Addresses:**
- All pitfall prevention strategies validated
- Production readiness verified

**Avoids:** Bugs in production, performance issues under real load

**Research flag:** SKIP — Testing strategies are well-established

---

### Phase Ordering Rationale

**Critical path dependencies:**
1. Infrastructure → Content Structure → Cart → Platter Builder → Checkout
2. Each phase builds on stable foundation from previous phase
3. Cart infrastructure is reusable foundation (used by platter builder, weekly meals, checkout)
4. Platter builder requires cart to be proven before adding complexity
5. Checkout requires cart and platter builder to be complete

**Pitfall prevention integrated:**
- Phase 1 addresses Pi performance (Pitfall 1) before features are built
- Phase 2 addresses JSON stability (Pitfall 5) and image performance (Pitfall 7) before content is added
- Phase 3 addresses mobile friction (Pitfall 2) early in simple cart flow before complex platter logic
- Phase 4 addresses platter validation (Pitfall 6) with dedicated edge case testing
- Phase 5 addresses date/timezone (Pitfall 3) and WhatsApp formatting (Pitfall 4) where they're used
- Phase 6 provides dedicated mobile optimization and polish pass
- Phase 7 validates all pitfall prevention strategies

**Parallel work opportunities:**
- Static pages (About, Contact) can be built in parallel with cart implementation
- Image optimization pipeline can be established while menu structure is being designed
- Mobile design system can be developed throughout all phases

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 4 (Platter Builder):** Custom product builder UI patterns and validation strategies are somewhat domain-specific. Research may help identify best practices for constraint-based product builders (min/max items, category requirements, price calculation).
- **Phase 5 (WhatsApp Integration):** WhatsApp Click-to-Chat phone number formatting for South African numbers and error handling patterns may benefit from targeted research. Date/timezone handling with business day calculation has edge cases (DST, holidays) worth researching.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Infrastructure):** Docker, Traefik, Pi hosting are well-documented with standard patterns
- **Phase 2 (Content Structure):** Astro Content Collections and JSON schemas have excellent official documentation
- **Phase 3 (Cart):** Nanostores + Astro islands have official integration guide and examples
- **Phase 6 (Polish):** Mobile UX, accessibility, performance optimization have established best practices
- **Phase 7 (Testing):** Testing strategies are well-documented across the industry

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All core technologies verified with official docs and Context7. ARM64 compatibility confirmed for all packages. Astro Islands Architecture is battle-tested for this use case. |
| Features | HIGH | Food ordering website features well-established with industry research. Mobile-first requirements backed by strong data (80% mobile traffic, 68.8% cart abandonment). Custom platter builder is unique but straightforward UX pattern. |
| Architecture | HIGH | Astro Islands Architecture officially documented and widely used. Nanostores integration verified with official guides. Data flow patterns proven for static-first sites. Component structure follows Atomic Design principles. |
| Pitfalls | HIGH | All critical pitfalls validated with multiple sources. Pi hosting limitations well-documented with benchmark data. Mobile ordering friction backed by industry research. Date/timezone and phone formatting issues verified with official API docs. |

**Overall confidence:** HIGH

Research is comprehensive across all dimensions. All core technologies have official documentation, ARM64 compatibility is verified, and architectural patterns are proven for this use case. Feature expectations are well-established for food ordering websites, and pitfalls are backed by industry research and technical documentation.

### Gaps to Address

While overall confidence is high, a few areas may need validation during implementation:

- **Pi load testing results:** Benchmark data exists, but actual performance will depend on specific configuration (Nginx settings, image optimization effectiveness, CDN setup). Address with load testing in Phase 1.

- **WhatsApp Click-to-Chat reliability:** Research confirms URL format and basic approach, but real-world reliability with various SA phone number formats should be validated early. Address with integration testing in Phase 5.

- **JSON editing workflow for non-technical admin:** Research identifies JSON syntax as a common pain point, but whether admin can successfully edit JSON with guidance or needs visual editor will be validated during Phase 2 handoff. May require Phase 7+ admin panel if JSON editing proves too challenging.

- **Custom platter builder UX:** While constraint-based product builders are a known pattern, optimal UX for mobile platter builder (6-item selection with categories) should be validated with user testing. Address with prototyping and user testing in Phase 4.

- **Business day calculation edge cases:** 48-hour lead time with weekend/holiday exclusion has edge cases (Friday afternoon orders, holiday weekends, DST transitions). Comprehensive test suite needed in Phase 5.

## Sources

### Primary (HIGH confidence)
- **Context7:** `/withastro/docs` — Astro Islands Architecture, Content Collections, client directives, image optimization, deployment patterns
- **Context7:** `/nanostores/nanostores` — State management patterns, persistent stores, React integration
- [Astro Official Documentation](https://docs.astro.build/) — Core architecture, Content Collections API, deployment
- [Astro GitHub Releases](https://github.com/withastro/astro/releases) — v5.16.15 verified as latest stable
- [TailwindCSS Official Docs](https://tailwindcss.com/docs) — Mobile-first design, responsive breakpoints, Astro integration
- [Nanostores GitHub](https://github.com/nanostores/nanostores) — API documentation, size metrics (265-814 bytes)
- [@nanostores/persistent GitHub](https://github.com/nanostores/persistent) — localStorage sync patterns
- [WhatsApp Click-to-Chat API Docs](https://faq.whatsapp.com/) — URL format, international phone number format (E.164)
- [Docker ARM Documentation](https://docs.docker.com/build/building/multi-platform/) — Multi-arch builds, ARM64 support
- [Traefik Docker Hub](https://hub.docker.com/_/traefik) — arm64v8 architecture support verified

### Secondary (MEDIUM confidence)
- **Food ordering features:** 11+ sources on restaurant website features, online ordering best practices, guest checkout vs accounts (Homebase, UpMenu, Orderable, Flipdish, Chowbus, GrooveCommerce, BigCommerce, RestoLabs, Trengo, TimelinesAI)
- **Mobile optimization:** Multiple sources on mobile-first design, checkout UX, friction reduction (Roller, Dinevate, Trafiki Ecommerce, Formidable Forms, Shopify)
- **Trust signals:** Conversion optimization, small business website best practices (Good Fellas, Bit-Form, OptiMonk)
- **Food photography impact:** High-quality photos increase orders by 25-35% (Snappr, Restaurant Website Builder, Azuro Digital)
- **Raspberry Pi hosting:** Performance benchmarks and best practices (DefenceDev, Ian Morrison Medium, DIVA Portal academic paper)
- **WhatsApp integration:** Integration challenges, error handling, phone number formatting (Interakt, Unipile, Meta error codes guide)
- **Image optimization:** 2026 web performance standards, lazy loading, mobile optimization (Request Metrics, MDN, InMotion Hosting, NitroPack)
- **Pitfalls research:** Common mistakes in food ordering systems, UX friction points, checkout abandonment (TechRyde, Deonde, Cieden, Orderable, Testomat.io, Medium Design Bootcamp, Survicate)

### Tertiary (LOW confidence)
- None — all recommendations verified with official docs or multiple independent sources

---
*Research completed: 2026-01-28*
*Ready for roadmap: yes*
