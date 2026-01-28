# Feature Research

**Domain:** Small food business ordering website (custom platters + weekly meals)
**Researched:** 2026-01-28
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mobile-optimized interface | 80% of food orders come from mobile devices | MEDIUM | Thumb-friendly buttons, no zooming needed, fast loading. 36% abandon if not mobile-friendly |
| Clear menu display with photos | Visual content processed 60,000x faster than text | LOW | High-quality photos increase orders by 25-35%. Must show accurate product representation |
| Simple cart management | Users expect to see/edit cart before checkout | LOW | Show items, quantities, total. Clear remove/edit options |
| Minimal checkout form | Long forms cause 19% abandonment | MEDIUM | Name, phone/email, pickup time, special instructions only. No forced registration |
| Guest checkout | Forced account creation causes 19% cart abandonment | LOW | Must be the most prominent checkout option |
| Multiple payment options | Limited options = cart abandonment | MEDIUM | WhatsApp-based payment link (as planned) is acceptable for small business. Show accepted methods upfront |
| Pickup time selection | Users need to know when food will be ready | MEDIUM | Must enforce 48-hour lead time for platters. Weekly meals have fixed pickup windows |
| Order confirmation | Users need proof of order | LOW | Show confirmation on screen, prepare WhatsApp message with order details |
| Contact information visible | Builds trust and transparency | LOW | Phone, WhatsApp, location visible on all pages. Critical for small business credibility |
| SSL certificate (HTTPS) | Browsers mark HTTP as "Not Secure" - kills conversions | LOW | Non-negotiable security baseline |
| Business information | Users want to know who they're buying from | LOW | About page with story, photos of kitchen/food prep, owner/chef bio |
| Dietary/allergen information | Health risk if missing - users may not order at all | MEDIUM | Clear labels for nuts, dairy, gluten, etc. on each platter item |

### Differentiators (Competitive Advantage)

Features that set the product apart and build trust for a small home cooking business.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Custom platter builder (pick 6 items) | Personalization without complexity | HIGH | Core differentiator. Visual, intuitive selection. Shows remaining slots. This is the unique value proposition |
| WhatsApp order integration | Personal service at scale - builds relationship | MEDIUM | Sends order details directly to WhatsApp. Eliminates 30% platform fees. Enables conversation-based payment and service |
| Weekly changing menu | Creates urgency and repeat visits | LOW | Shows what's available this week. Encourages checking back regularly |
| Authentic home cooking story | Trust signal for home-based business | LOW | Professional photos of actual kitchen, cooking process. Real person behind the business |
| Customer testimonials/reviews | Social proof crucial for new small business | LOW | Display real customer feedback with names. WhatsApp reviews can be featured |
| 48-hour lead time transparency | Sets expectations upfront - prevents disappointment | LOW | Clear messaging on platter builder. Prevents order issues and builds trust through honesty |
| Local Pretoria North focus | Community connection | LOW | Emphasize local, home-cooked aspect. Pretoria North pickup location prominently displayed |
| Zero delivery fees (pickup only) | Cost savings passed to customer | LOW | Clear messaging: "No delivery fees - pickup only" |
| Order preview before WhatsApp | Reduces friction in WhatsApp flow | LOW | Show complete order summary before redirecting to WhatsApp |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this scale/model.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| User accounts with login | "Industry standard" for ordering sites | Adds complexity, causes 19% abandonment, unnecessary for guest-only model | Guest checkout with email/phone for contact. Store orders via WhatsApp conversation history |
| Real-time inventory tracking | Seems professional | Over-engineered for manual inventory management via JSON files. Creates maintenance burden | Admin manually updates JSON files. Out-of-stock items simply not shown |
| Automated payment processing | Perceived as "modern" | Removes personal touch, adds PCI compliance burden, integration costs, transaction fees | Payment handled in WhatsApp conversation. Maintains personal service model |
| Delivery service | Customer convenience | Wrong business model. Adds logistics complexity, insurance, timing issues for 1-person operation | Pickup only with clear communication. Position as "fresh pickup" benefit |
| Complex loyalty program | Retain customers | Technical complexity, maintenance burden for small scale | Simple: encourage WhatsApp contacts to become repeat customers. Personal relationship is the loyalty program |
| Live chat support | Immediate customer service | Requires constant monitoring. WhatsApp serves this purpose | WhatsApp contact prominently displayed. Async communication fits small business model |
| Order history dashboard | Track past orders | Requires user accounts, database complexity | WhatsApp conversation history serves this purpose naturally |
| Dynamic pricing/promotions | Increase sales | Complex to implement and manage. Pricing should be stable and transparent | Fixed prices in JSON. Occasional specials communicated via WhatsApp status/About page |
| Advanced search/filtering | Navigate large menus | Not needed for small, curated inventory (6 platter items, 1-3 weekly meals) | Simple, scannable menu display with photos |
| Native mobile app | App presence seems professional | Massive development cost, app store fees, update burden | Progressive Web App features (save to homescreen) sufficient. Mobile-optimized website is enough |
| Reservation system | Schedule orders | Wrong model. This is order-ahead food, not reservations | Pickup time selection during checkout is sufficient |
| Multi-location support | Scale business | Premature. Single location (Pretoria North) for now | Hard-code location. Add multi-location support only when second location launches |

## Feature Dependencies

```
[Guest Checkout]
    └──requires──> [Cart Management]
                       └──requires──> [Menu Display]

[Platter Builder]
    └──requires──> [Inventory Display]
    └──requires──> [Cart Management]
    └──requires──> [6-item Selection Logic]

[WhatsApp Integration]
    └──requires──> [Order Summary]
    └──requires──> [Guest Checkout Form]
    └──enhances──> [Payment Flow]
    └──enhances──> [Customer Service]

[48-hour Validation]
    └──requires──> [Pickup Time Selection]
    └──requires──> [Calendar Logic]

[Weekly Meals]
    └──independent──> [Platter Builder] (separate flows)

[SSL Certificate]
    └──required by──> [ALL features] (baseline security)

[Mobile Optimization]
    └──affects──> [ALL features] (80% of traffic)
```

### Dependency Notes

- **Platter Builder requires Cart Management:** Users need to see their 6 selections before checkout
- **WhatsApp Integration enhances entire flow:** Order details formatted for WhatsApp, but user can still see summary before redirect
- **48-hour Validation requires date logic:** Must prevent same-day/next-day platter orders. Weekly meals have different timing
- **Weekly Meals are independent:** Separate from platter builder. Different product type with simpler selection (1-3 options)
- **SSL is baseline:** Non-negotiable foundation. Must be implemented before any other features
- **Mobile-first affects everything:** Desktop is secondary. Every feature must work perfectly on mobile

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the business concept and start taking orders.

- [x] **Mobile-optimized responsive design** — 80% of traffic. Non-negotiable foundation
- [x] **SSL certificate (HTTPS)** — Security baseline. Browsers mark HTTP as "Not Secure"
- [x] **Custom platter builder (pick 6 items)** — Core unique value proposition. Without this, it's just a generic menu
- [x] **Weekly meals display** — Second product type. Simple display of 1-3 options with photos/prices
- [x] **Cart management** — View cart, update quantities, see total before checkout
- [x] **Guest checkout form** — Name, phone, email, pickup time, special instructions. No account required
- [x] **48-hour lead time validation** — Prevent same-day platter orders. Set expectations upfront
- [x] **WhatsApp order integration** — Core business model. Format order details, open WhatsApp with pre-filled message
- [x] **About page** — Build trust. Story, photos, who's cooking. Critical for home business credibility
- [x] **Contact page** — Phone, WhatsApp link, location, hours. Trust signal
- [x] **High-quality food photos** — 25-35% increase in orders. Show actual products
- [x] **Dietary/allergen information** — Display on each platter item. Health & trust
- [x] **Google Analytics** — Track what's working. Understand user behavior

### Add After Validation (v1.x)

Features to add once core is working and orders are flowing.

- [ ] **Customer testimonials section** — Social proof. Display WhatsApp reviews. Add after 10-20 orders received
- [ ] **SEO optimization improvements** — Schema markup, meta descriptions, sitemap. Add when ready to scale beyond word-of-mouth
- [ ] **Reorder functionality** — "Order your favorite platter again" for returning WhatsApp customers. Add after identifying repeat customer patterns
- [ ] **Order number tracking** — Assign order numbers for easier reference in WhatsApp conversations. Add when order volume increases
- [ ] **Weekly special/promotion banner** — Highlight limited-time offers. Add when ready to drive specific behaviors
- [ ] **Image gallery** — Show cooking process, platter examples, weekly meal photos. Build trust and appetite. Add after collecting sufficient photos
- [ ] **FAQ section** — Answer common questions about pickup, payment, lead time. Add after identifying repeated customer questions
- [ ] **Email notifications** — Order confirmation emails (in addition to WhatsApp). Add if customers request this
- [ ] **Progressive Web App (PWA) features** — Save to homescreen, offline menu viewing. Add when mobile usage patterns justify it
- [ ] **Pickup time slot restrictions** — Limit available slots to manage capacity. Add when order volume requires it

### Future Consideration (v2+)

Features to defer until product-market fit is established and business is scaling.

- [ ] **Delivery service** — Major business model change. Only consider after consistent pickup demand established
- [ ] **Catering packages** — Larger orders for events. Add when requested multiple times by customers
- [ ] **Subscription service** — Weekly meal subscriptions. Add after understanding customer frequency patterns
- [ ] **Gift cards/vouchers** — Give as gifts. Low priority until established brand
- [ ] **Recipe blog** — Content marketing. Only when time permits and SEO strategy is active
- [ ] **Multi-location support** — Second kitchen/pickup location. Only when expanding beyond Pretoria North
- [ ] **Admin dashboard for analytics** — Currently using Google Analytics. Custom dashboard only if GA insufficient
- [ ] **Automated inventory updates** — Replace JSON file manual updates. Only when order volume justifies development cost
- [ ] **Native mobile app** — Massive cost. Only if web app reaches limits and user demand is clear
- [ ] **Loyalty points system** — Complex to build and maintain. Personal relationships via WhatsApp are better retention strategy at this scale

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Mobile-optimized design | HIGH | MEDIUM | P1 |
| SSL certificate | HIGH | LOW | P1 |
| Platter builder (pick 6) | HIGH | HIGH | P1 |
| Weekly meals display | HIGH | LOW | P1 |
| Cart management | HIGH | LOW | P1 |
| Guest checkout form | HIGH | MEDIUM | P1 |
| 48-hour validation | HIGH | MEDIUM | P1 |
| WhatsApp integration | HIGH | MEDIUM | P1 |
| About page | HIGH | LOW | P1 |
| Contact page | HIGH | LOW | P1 |
| Food photography | HIGH | LOW | P1 |
| Dietary/allergen info | HIGH | MEDIUM | P1 |
| Google Analytics | MEDIUM | LOW | P1 |
| Customer testimonials | HIGH | LOW | P2 |
| SEO optimization | MEDIUM | MEDIUM | P2 |
| Reorder functionality | MEDIUM | MEDIUM | P2 |
| Order number tracking | MEDIUM | LOW | P2 |
| Promotion banners | MEDIUM | LOW | P2 |
| Image gallery | MEDIUM | MEDIUM | P2 |
| FAQ section | MEDIUM | LOW | P2 |
| Email notifications | LOW | MEDIUM | P2 |
| PWA features | LOW | MEDIUM | P2 |
| Pickup slot restrictions | MEDIUM | MEDIUM | P2 |
| Delivery service | HIGH | HIGH | P3 |
| Catering packages | MEDIUM | HIGH | P3 |
| Subscription service | MEDIUM | HIGH | P3 |
| Gift cards | LOW | HIGH | P3 |
| Recipe blog | LOW | MEDIUM | P3 |
| Multi-location | LOW | HIGH | P3 |
| Admin analytics dashboard | LOW | HIGH | P3 |
| Automated inventory | LOW | HIGH | P3 |
| Native mobile app | LOW | HIGH | P3 |
| Loyalty points system | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for launch - Core value proposition or trust signal
- P2: Should have when ready - Enhances experience after validation
- P3: Nice to have in future - Only when scaling or customer demand is clear

## Competitor Feature Analysis

### Food Ordering Platforms (DoorDash, Uber Eats, etc.)
| Feature | Their Approach | Manna's Approach | Rationale |
|---------|----------------|------------------|-----------|
| User accounts | Required for all orders | Guest checkout only | Reduce friction. 19% abandon forced registration. WhatsApp maintains customer relationship |
| Payment processing | Integrated credit card processing | Payment via WhatsApp conversation | Avoid PCI compliance, transaction fees, integration cost. Maintain personal service |
| Delivery | Core feature with GPS tracking | Pickup only | Different business model. 1-person operation. No delivery logistics/insurance burden |
| Restaurant selection | Browse hundreds of restaurants | Single business (Manna Kitchen) | Not a marketplace. Single home cooking business |
| Real-time order tracking | Live status updates | WhatsApp conversation | Personal communication fits scale. No need for automated tracking at this volume |
| Ratings/reviews | Star ratings and written reviews | WhatsApp testimonials (future) | Trust through personal relationships first. Social proof added after establishing base |

### Small Restaurant Websites (GloriaFood, UpMenu, etc.)
| Feature | Their Approach | Manna's Approach | Rationale |
|---------|----------------|------------------|-----------|
| Online payment | Integrated payment processing | WhatsApp-based payment | Maintain personal touch. No transaction fees or integration costs |
| Menu management | Admin dashboard for updates | Manual JSON file updates | Simpler for small inventory. Admin dashboard over-engineering initially |
| Order notifications | Email/SMS to restaurant | WhatsApp message | WhatsApp is the business communication channel. Consolidate everything there |
| Commission-free ordering | Key selling point | Also commission-free via WhatsApp | Aligned approach. Direct customer relationships prioritized |
| Inventory management | Real-time stock tracking | Manual JSON updates | Appropriate for scale. ~20 items total (platter items + weekly meals) |
| Loyalty programs | Built-in points systems | Personal relationships via WhatsApp | Loyalty through service quality and personal touch, not gamification |

### Custom Platter Services (Contrado, Our Platter, etc.)
| Feature | Their Approach | Manna's Approach | Rationale |
|---------|----------------|------------------|-----------|
| Customization | Upload designs, pick layouts | Pick 6 items from inventory | Food platters, not physical products. Constrained choice (6 items) prevents decision paralysis |
| Builder interface | Complex design tools | Simple visual selection with photos | Food selection should be appetizing and quick, not a design project |
| Pricing | Size-based pricing | Fixed price for 6-item platter | Simpler pricing model. Easier to understand. No calculation complexity |
| Lead time | Varies by product | Fixed 48-hour minimum | Set clear expectations. Allows prep time for made-to-order food |

## Mobile-First Considerations

Given that **80% of food orders come from mobile devices** in 2026, every feature must prioritize mobile experience:

### Critical Mobile Requirements
- **Thumb-friendly buttons:** Minimum 44x44px touch targets
- **No zooming required:** Legible text (16px+ body), form fields that don't require zoom
- **Fast loading:** < 3 seconds on 3G connection. 36% abandon if not mobile-friendly
- **Single-column layout:** Forms complete 15.4 seconds faster in single column vs multi-column
- **Sticky cart/checkout:** Easy access to cart and checkout button while browsing
- **Minimal form fields:** Mobile typing is slow. Ask only essential information
- **Auto-fill compatible:** Name, email, phone should work with browser auto-fill
- **WhatsApp deep linking:** Direct WhatsApp app launch with pre-filled message
- **Large food photos:** Showcase products. Images processed 60,000x faster than text
- **Minimal scrolling on checkout:** Keep checkout form short enough to see without excessive scrolling

### Desktop Considerations (Secondary)
- Desktop is 20% of traffic, but still needs to work well
- Same features, optimized layout for larger screens
- Multi-column layout acceptable on desktop (2-column menu grid, etc.)
- Still prioritize simplicity - mobile-first mindset benefits desktop too

## Trust Signals for Small Home Business

Small food businesses need extra trust signals since customers haven't heard of the brand:

### Essential Trust Elements (All P1)
1. **SSL certificate** - "Not Secure" kills conversions instantly
2. **About page with photos** - Show the person cooking. Home kitchen photos. Build personal connection
3. **Contact information** - Phone, WhatsApp, physical pickup location visible
4. **High-quality food photos** - Show actual products. Build appetite and trust
5. **Dietary/allergen info** - Shows care for customer safety
6. **48-hour lead time transparency** - Honesty about timing builds trust

### Trust Enhancers (P2 - Add after launch)
1. **Customer testimonials** - Real names, real feedback from WhatsApp customers
2. **Social media links** - WhatsApp Status, Facebook, Instagram presence
3. **Image gallery** - Cooking process, platter examples, satisfied customers
4. **FAQ section** - Answer concerns proactively (payment, pickup, food safety, etc.)

### Trust Detractors to Avoid
- Generic stock photos (use real Manna Kitchen photos only)
- Anonymous testimonials ("Great food! - A.B.")
- Over-promising ("Best food in Pretoria!")
- Hidden pricing (all prices clear upfront)
- Vague location (show exact pickup address)

## Sources

### Food Ordering Features & Best Practices
- [11 Restaurant Website Features You Need in 2026 | Homebase](https://www.joinhomebase.com/blog/restaurant-website)
- [Best Online Ordering System for Restaurants in 2026 | UpMenu](https://www.upmenu.com/)
- [How to Create an Online Ordering System for Your Small Business | Orderable](https://orderable.com/blog/online-ordering-system-for-your-small-business/)
- [Ultimate Guide to Online Ordering in 2026 | Flipdish US](https://www.flipdish.com/us/resources/blog/restaurant-online-ordering-guide)
- [11 Restaurant Online Ordering Best Practices | Chowbus](https://www.chowbus.com/blog/restaurant-online-ordering-best-practices)

### Guest Checkout vs User Accounts
- [Guest Checkout vs Account: Which Strategy Converts More Customers in 2026 | Krepling Pay](https://pay.krepling.com/guest-checkout-vs-account-which-strategy-converts-more-customers-in-2026/)
- [Guest Checkout vs Customer Accounts | GrooveCommerce](https://www.groovecommerce.com/ecommerce-blog/guest-checkout/)
- [Customer accounts vs. guest checkout | BigCommerce](https://www.bigcommerce.com/glossary/customer-accounts-vs-guest-checkout-how-use-each/)

### WhatsApp Integration
- [How Restaurants Use WhatsApp Integration to Boost Orders | RestoLabs](https://www.restolabs.com/blog/whatsapp-integration-food-ordering-system)
- [WhatsApp food ordering system | Trengo](https://trengo.com/blog/whatsapp-order-system)
- [How to Create a WhatsApp Food Ordering System | TimelinesAI](https://timelines.ai/create-whatsapp-food-order-system/)

### Mobile-First & Checkout Optimization
- [Best practices for mobile food & beverage ordering | Roller](https://mysupport.roller.software/hc/en-us/articles/8485249467535-Best-practices-for-mobile-food-beverage-F-B-ordering)
- [Mobile Ordering for Restaurants | Dinevate](https://www.dinevate.com/blog/posts/mobile-ordering-for-restaurants/)
- [A Guide to Checkout UX in 2026 | Trafiki Ecommerce](https://www.trafiki-ecommerce.com/marketing-knowledge-hub/the-ultimate-guide-to-checkout-ux/)

### Common Mistakes to Avoid
- [10 Mistakes New Restaurant Websites Make | Orderable](https://orderable.com/blog/new-restaurant-websites-mistakes/)
- [5 Biggest Restaurant Website Mistakes to Avoid | TableIn](https://www.tablein.com/blog/restaurant-website-mistakes)
- [Critical mistakes to avoid when choosing an online ordering system | Grafterr](https://www.grafterr.com/blog/critical-mistakes-to-avoid-when-choosing-an-online-ordering-system/)
- [Why Customers Struggle With Online Food Ordering & Fixes | TechRyde](https://www.techryde.com/blog/why-customers-struggle-with-your-online-food-ordering-system-and-how-to-fix-it/)

### Form Design Best Practices
- [9 Contact Form Best Practices | Formidable Forms](https://formidableforms.com/research-based-tips-improve-contact-form-conversions/)
- [Form Design Examples: Types of Forms and Best Practices (2026) | Shopify](https://www.shopify.com/blog/form-design-examples)

### Trust Signals & Conversion
- [Small Business Website Must-Haves: 2026 Conversion Checklist | Good Fellas](https://www.goodfellastech.com/blog/small-business-website-must-haves-2026-conversion-checklist)
- [Best Contact Us Page Examples | Bit-Form](https://bit-form.com/blog/contact-us-page-examples-for-better-leads/)
- [2026 Industry Conversion Rate Benchmarks | OptiMonk](https://www.optimonk.com/industry-conversion-rate-benchmarks/)

### Food Photography Impact
- [High-quality food photos can increase orders by 35% | Snappr](https://www.snappr.com/enterprise-blog/high-quality-food-photos-can-increase-orders-on-restaurant-delivery-apps-by-35)
- [Why Food Photography Is Important | Restaurant Website Builder](https://www.restaurant-website-builder.com/why-food-photography-is-important)
- [10 Best Food & Beverage Website Designs of 2026 | Azuro Digital](https://azurodigital.com/food-beverage-website-examples/)

### Analytics & Tracking
- [How Data Analytics is Revolutionizing Online Food Ordering | Deliverect](https://www.deliverect.com/en-us/blog/trending/how-data-analytics-is-revolutionizing-the-online-food-ordering-industry)
- [Best Online Ordering Technology for Food Businesses | Enatega](https://enatega.com/online-ordering-technology/)

### 2026 Industry Trends
- [Plan Ordering Tech for 2026 | EZ-Chow](https://ez-chow.com/restaurant-ordering-tech-2026-plan/)
- [Restaurant App Trends for 2026 | DoorDash Merchants](https://merchants.doordash.com/en-us/blog/restaurant-app-trends-2026)
- [The 2026 Food Truck Reality Check | Velocity Merchant Services](https://www.getvms.com/food-truck-trends/)

---
*Feature research for: Manna Kitchen ordering website*
*Researched: 2026-01-28*
