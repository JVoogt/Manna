# Pitfalls Research

**Domain:** Food Ordering Website + Custom Product Builder (Manna Kitchen)
**Researched:** 2026-01-28
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Pi Hosting Performance Bottlenecks

**What goes wrong:**
Raspberry Pi hardware becomes overwhelmed under concurrent user load, causing slow page loads, unresponsive buttons, and timeout errors during checkout. The biggest bottleneck is typically the home internet upload speed (ADSL/VDSL) rather than the Pi's CPU, but both can become constraints.

**Why it happens:**
Developers test with single-user scenarios locally and assume the Pi can handle production traffic. Web server software (Nginx/Apache) configurations often use defaults that aren't optimized for Pi's limited resources. System resource limits (file handles, TCP sockets) hit unexpectedly under load.

**Consequences:**
- Cart abandonment during slow checkout (18% abandon due to slow/complicated checkout)
- Customer frustration with unresponsive ordering buttons
- Revenue loss during peak ordering times
- Poor first impressions that prevent repeat visits

**Prevention:**
- Load test with realistic concurrent users (10-20 simultaneous) before launch
- Configure Nginx with worker_processes and worker_connections tuned for Pi specs
- Use static site generation where possible to reduce server processing
- Implement aggressive caching at CDN/edge level to minimize Pi hits
- Set up monitoring (htop, netdata) to track resource usage in production
- Consider HAProxy load balancing if scaling to multiple Pis becomes necessary
- Optimize database queries and connection pooling for Pi's limited memory

**Warning signs:**
- CPU usage above 75% during testing
- Page load times exceeding 3 seconds on home internet connection
- Memory usage approaching Pi's capacity during concurrent test sessions
- High system mode CPU percentage (>25%) indicating kernel bottleneck

**Phase to address:**
Phase 1 (Infrastructure Setup) - Must configure and load test Pi hosting before building features
Phase 3 (Core Ordering Flow) - Retest under realistic ordering scenarios with images

---

### Pitfall 2: Mobile Ordering Flow Friction Causing 68.8% Cart Abandonment

**What goes wrong:**
Mobile users encounter friction points that cause them to abandon their orders: small tap targets, unclear product selection states, confusing multi-step flows, unexpected costs at checkout, and lack of progress indicators in the custom platter builder.

**Why it happens:**
Developers design on desktop and test on desktop, or use simplified mobile emulators that don't capture real mobile constraints (small screen, touch input, distractions, intermittent connectivity). The custom platter builder adds cognitive load that compounds mobile friction.

**Consequences:**
- Average cart abandonment rate of 68.8% (industry standard)
- Loss of 84% of "near me" mobile search traffic
- Frustrated customers who can't complete orders on mobile
- Competitive disadvantage (customers order from competitors with better mobile UX)

**Prevention:**
- **Mobile-first design**: Design for 375px width first, then scale up
- **Tap target size**: Minimum 44x44px for all interactive elements
- **Progressive disclosure**: Break platter builder into bite-sized steps with clear progress
- **Show costs upfront**: Display total, delivery fee, and lead time before checkout
- **Save state**: Allow users to save incomplete orders and resume later
- **Autofill support**: Use HTML5 autocomplete attributes for name, phone, address
- **One-handed operation**: Place primary actions in thumb-friendly zones
- **Test on real devices**: Test on actual mobile devices with real network conditions

**Warning signs:**
- Buttons smaller than 44px in mobile viewport
- Forms requiring more than 5 fields without autofill
- Multi-step flows without progress indicators
- Checkout process requiring 3+ screens
- No ability to edit platter after adding to cart

**Phase to address:**
Phase 2 (Menu & Content Structure) - Establish mobile-first content patterns
Phase 3 (Core Ordering Flow) - Ruthlessly optimize mobile ordering UX with user testing
Phase 4 (Platter Builder) - Test builder extensively on mobile devices for friction points

---

### Pitfall 3: Date/Timezone Issues Breaking 48-Hour Lead Time Enforcement

**What goes wrong:**
Orders placed late Friday in customer's timezone might be interpreted as Monday delivery due to server timezone mismatches. 48-hour lead time calculations break across daylight saving time transitions. International customers (or South African timezone edge cases) see incorrect delivery dates.

**Why it happens:**
Developers use server time instead of customer time for lead time calculations. JavaScript Date objects handle timezones inconsistently across browsers. Validation logic doesn't account for business hours (weekends, holidays) when calculating lead time.

**Consequences:**
- Customer selects delivery date thinking it meets 48-hour requirement, but it doesn't
- Kitchen receives orders with insufficient prep time
- Customer frustration when delivery date is rejected after checkout
- Revenue loss from customer abandonment at checkout
- Reputation damage if incorrect dates lead to failed deliveries

**Prevention:**
- **Always work in UTC**: Store all dates/times in UTC on server
- **Display in customer timezone**: Use Intl.DateTimeFormat or date-fns-tz for display
- **Business day calculation**: Count 48 hours in business hours only (exclude weekends/holidays)
- **Validate on both sides**: Client-side for UX, server-side for enforcement
- **Clear timezone display**: Show "Delivery date (SAST)" to make timezone explicit
- **Holiday calendar**: Maintain list of non-delivery dates and validate against it
- **Test edge cases**: Test Friday afternoon orders, DST transitions, December holidays

**Warning signs:**
- Using new Date() without timezone specification
- Lead time validation only on client side
- No handling for weekends/holidays in date calculations
- Timezone not displayed to user during date selection
- Date validation that breaks during DST transitions

**Phase to address:**
Phase 3 (Core Ordering Flow) - Implement robust date validation with business day logic
Phase 6 (Testing & Polish) - Test edge cases: DST, holidays, Friday orders, etc.

---

### Pitfall 4: WhatsApp Integration Phone Number Formatting Failures

**What goes wrong:**
Orders fail to send via WhatsApp API because phone numbers contain spaces, parentheses, or incorrect country codes. Customer enters "082 123 4567" but API requires "+27821234567". Error messages like "Unable to deliver message: recipient not a WhatsApp user" appear due to formatting issues, not actual WhatsApp availability.

**Why it happens:**
South African users expect to enter numbers in local format (082/083/072) but WhatsApp API requires E.164 international format. Input validation allows invalid characters or doesn't normalize to international format. Developers test with their own correctly formatted numbers.

**Consequences:**
- Orders completed but never received by kitchen
- No error visible to customer (silent failure)
- Customer pays but kitchen doesn't get notification
- Revenue loss and reputation damage
- Manual reconciliation work to recover lost orders

**Prevention:**
- **Input masking**: Guide user to correct format with placeholder "(082) 123-4567"
- **Aggressive normalization**: Strip spaces, parentheses, hyphens before API call
- **Country code detection**: Auto-prepend +27 for South African numbers (082/083/072/073/074/076/078/079/081)
- **Format validation**: Regex check for valid SA mobile pattern before submission
- **Test number validation**: Check if number exists on WhatsApp before sending (optional pre-check API)
- **Error handling**: Surface WhatsApp API errors to user, not silent failure
- **Fallback contact**: Collect email as backup if WhatsApp fails

**Warning signs:**
- Phone input accepts any text without validation
- No country code dropdown or auto-detection
- Phone numbers stored with formatting characters (spaces/parentheses)
- No error handling for WhatsApp API 400/404 responses
- Testing only with your own phone number

**Phase to address:**
Phase 5 (WhatsApp Integration) - Implement robust phone number normalization and validation
Phase 6 (Testing & Polish) - Test with various SA number formats and invalid numbers

---

### Pitfall 5: JSON Structure Changes Breaking Non-Technical Admin Edits

**What goes wrong:**
Admin makes a small edit to menu JSON (adds new platter item, changes price), but accidentally removes a comma, adds a trailing comma, or mismatches a bracket. Website immediately crashes with cryptic "Unexpected token" errors. Or worse, structure changes during development invalidate admin's existing JSON edits.

**Why it happens:**
JSON is extremely strict (no trailing commas, no comments, exact syntax) but non-technical users expect forgiving editing like Word. Developers change JSON structure during feature development without migration scripts or validation of existing content.

**Consequences:**
- Website goes down due to invalid JSON
- Admin frustrated and afraid to edit content
- Developer interruptions to fix JSON syntax errors
- Loss of autonomy for admin (depends on developer for content changes)
- Content updates delayed waiting for developer assistance

**Prevention:**
- **JSON schema validation**: Validate JSON against schema before deploying/loading
- **Visual JSON editor**: Provide form-based UI that generates valid JSON (even basic)
- **Syntax error messages**: Clear errors like "Missing comma after line 15" not "Unexpected token"
- **Version control**: Git-track JSON files so errors can be rolled back
- **Staging environment**: Test JSON changes in staging before production
- **JSON Comments alternative**: Use JSON5 or YAML for more forgiving syntax
- **Freeze structure early**: Lock down JSON structure before handoff to admin
- **Migration scripts**: When structure must change, provide automated migration
- **Default values**: Handle missing optional fields gracefully with defaults

**Warning signs:**
- JSON edited directly in text editor without syntax highlighting
- No JSON validation before deploying changes
- JSON structure still evolving while admin is editing content
- No staging/preview environment for testing changes
- Error messages don't indicate which file/line has issue

**Phase to address:**
Phase 2 (Menu & Content Structure) - Establish stable JSON schema with validation
Phase 6 (Testing & Polish) - Create simple JSON editing guide with validation checklist
Consider: Phase 7+ (Admin Panel) if budget allows for visual editor

---

### Pitfall 6: Custom Platter Builder Validation Edge Cases

**What goes wrong:**
Customer creates platter with invalid combinations (e.g., selects 2 options when minimum is 3, or exceeds maximum servings), but validation fails to catch it until checkout or worse, until kitchen receives order. Prices calculate incorrectly for edge cases. Inventory constraints not checked for custom selections.

**Why it happens:**
Validation logic focuses on happy path (standard platters) but misses edge cases in custom builder. Client-side validation exists but no server-side verification. Business rules (min/max servings, required components) not consistently enforced across UI and backend.

**Consequences:**
- Orders accepted that kitchen cannot fulfill
- Pricing errors leading to revenue loss or customer disputes
- Kitchen confusion about what to prepare
- Customer frustration when order is rejected after payment
- Developer firefighting to fix edge case bugs in production

**Prevention:**
- **Server-side validation**: Never trust client-side only - validate all constraints on backend
- **Business rules engine**: Centralize platter rules (min/max, required components) in single source of truth
- **Edge case test matrix**: Test all boundaries (zero items, max items, all same item, etc.)
- **Input constraints**: Disable invalid options in UI (gray out, hide) rather than allowing then validating
- **Real-time price calculation**: Show price updating as customer adds items
- **Validation feedback**: Show clear error messages at the point of interaction, not at checkout
- **Platter preview**: Show visual summary before adding to cart for customer verification

**Warning signs:**
- Validation only on client side with no backend verification
- Custom platter prices hard-coded rather than calculated from components
- No handling for empty selections or out-of-bounds quantities
- Business rules scattered across multiple components
- Testing only covers standard/simple platter combinations

**Phase to address:**
Phase 4 (Platter Builder) - Build comprehensive validation test suite with edge cases
Phase 6 (Testing & Polish) - User acceptance testing with intentionally invalid inputs

---

### Pitfall 7: Image Performance Destroying Mobile Experience

**What goes wrong:**
High-resolution platter images (5-10MB each from camera) load slowly on mobile networks, causing layout shift as images load, exhausting Pi's storage and bandwidth, and frustrating customers who wait 10+ seconds for menu images to appear.

**Why it happens:**
Developers upload photos directly from camera without optimization. Lazy loading implemented incorrectly (includes above-fold images). No responsive image sizing (serves 4K image to 375px mobile screen). Pi storage fills up with unoptimized originals.

**Consequences:**
- Mobile users abandon site during slow initial load (>3 seconds = closed tab)
- Poor Core Web Vitals (LCP, CLS) hurt SEO rankings
- Pi bandwidth exhausted during peak traffic
- Pi storage fills up preventing future content updates
- Wasted mobile data frustrates customers on metered connections

**Prevention:**
- **Image optimization pipeline**: Compress images to 80-85% quality before upload (use sharp, ImageMagick)
- **Responsive images**: Generate and serve multiple sizes using srcset (mobile, tablet, desktop)
- **Modern formats**: Use WebP or AVIF with JPEG fallback for better compression
- **Lazy loading**: Use loading="lazy" but EXCLUDE above-fold images (hero, featured platters)
- **Image dimensions**: Always specify width/height to prevent layout shift
- **CDN/edge caching**: Serve images from CDN to reduce Pi bandwidth
- **Storage limits**: Set maximum upload size and total storage quotas
- **Automated optimization**: Process images on upload, don't rely on manual compression

**Warning signs:**
- Images larger than 500KB for web display
- No srcset or multiple image sizes
- Lazy loading on above-fold hero images
- Layout shifts as images load (missing width/height)
- Images served from Pi without CDN caching
- No image compression in build pipeline

**Phase to address:**
Phase 2 (Menu & Content Structure) - Establish image optimization pipeline and formats
Phase 3 (Core Ordering Flow) - Implement responsive images with lazy loading
Phase 6 (Testing & Polish) - Test image performance on slow mobile connections

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| No server-side validation | Faster initial development | Security vulnerabilities, invalid data in system | Never - always validate server-side |
| Hard-coded business rules | Quick to implement | Impossible to change without code deploy | MVP only, must refactor before v1.0 |
| Client-side only date calculation | Works for local testing | Timezone bugs in production | Never - critical for 48-hour lead time |
| Direct JSON editing | No admin panel to build | Admin dependency on developer, error-prone | MVP only if admin is technical |
| Single Pi instance | Minimal infrastructure complexity | No redundancy, downtime during updates | Acceptable for MVP with scheduled maintenance |
| No image optimization | Faster content upload | Poor mobile performance, storage issues | Never - must optimize images from start |
| WhatsApp-only notification | Simpler than email/SMS | Single point of failure, no audit trail | Acceptable if email backup exists |
| Manual order tracking | No need for order management system | Kitchen chaos, lost orders | MVP only, must automate before scale |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| WhatsApp API | Assuming all SA numbers are valid for WhatsApp | Validate number format AND check WhatsApp availability via API |
| WhatsApp API | Sending unformatted phone numbers with spaces/parentheses | Normalize to E.164 format (+27XXXXXXXXX) before API call |
| WhatsApp API | No error handling for failed message delivery | Catch API errors and provide fallback (email, admin notification) |
| JSON content files | Assuming JSON will always parse successfully | Wrap JSON.parse() in try/catch, show user-friendly error message |
| JSON content files | Changing structure without versioning | Version JSON schema, write migrations for structure changes |
| Mobile viewport | Testing only in Chrome DevTools responsive mode | Test on real iOS/Android devices with real network conditions |
| Date/time handling | Using browser's local time for lead time calculation | Always calculate lead time in UTC, convert to SAST for display |
| Image loading | Using absolute paths assuming specific folder structure | Use relative paths or environment-based CDN URLs |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Serving unoptimized images from Pi | Slow page loads, high bandwidth usage | Compress images, use CDN, implement caching | 10+ concurrent users |
| No database connection pooling | Connection errors under load | Configure connection pool with max limits | 20+ concurrent users |
| Loading entire menu on every page | Slow navigation, high server load | Cache menu JSON, use stale-while-revalidate | 50+ menu items |
| Synchronous order processing | Checkout hangs while sending WhatsApp | Queue order processing, respond immediately | 5+ orders/minute |
| No query optimization | Slow database queries under load | Index foreign keys, use EXPLAIN to optimize | 100+ orders in database |
| Client-side only platter calculation | Slow platter builder with many items | Calculate on server, cache results | 20+ platter components |
| Single Pi instance | Downtime during restarts, no redundancy | Set up load balancer with 2+ Pi instances | 50+ concurrent users |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Phone numbers stored unencrypted | POPIA violation, customer data exposure | Encrypt PII at rest, use secure storage |
| WhatsApp API keys in client-side code | API key theft, unauthorized message sending | Store API keys server-side only, use environment variables |
| No HTTPS on order submission | Payment details intercepted, man-in-the-middle | Enforce HTTPS, redirect HTTP to HTTPS |
| Order validation only on client | Fake orders, price manipulation | Always validate orders server-side before processing |
| No rate limiting on order endpoint | DOS attack, spam orders | Rate limit by IP, require CAPTCHA for suspicious activity |
| Storing raw JSON from user input | XSS via JSON injection | Sanitize and validate JSON, use schema validation |
| Exposing admin JSON files publicly | Menu/pricing data editable by anyone | Restrict JSON file access, serve through API with auth |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Unclear platter customization limits | Customer creates invalid platter, frustrated at checkout | Show min/max limits prominently, disable invalid options |
| Hidden delivery fees until checkout | Cart abandonment, feeling of being tricked | Show delivery fee estimate on menu page, confirm at checkout |
| No order confirmation screen | Customer unsure if order went through | Show clear confirmation with order details and next steps |
| Ambiguous lead time language | Customer expects next-day, arrives in 3 days | Display exact delivery date/time, not just "48-hour lead time" |
| Too many platter options at once | Decision paralysis, cognitive overload | Group options by category, show 5-7 options at a time |
| No ability to edit order after submission | Customer frustration, cancellation requests | Allow edits up to 24 hours before delivery via WhatsApp |
| Menu images don't match actual product | Customer disappointment, trust issues | Use real photos of actual platters, update seasonally |
| Complex multi-step checkout on mobile | Abandonment due to friction | Single-page checkout with progressive disclosure |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Custom Platter Builder:** Often missing server-side validation — verify all rules enforced on backend
- [ ] **Date Selection:** Often missing weekend/holiday handling — verify business day calculation works
- [ ] **WhatsApp Integration:** Often missing error handling — verify failed sends are caught and logged
- [ ] **Image Loading:** Often missing dimensions causing layout shift — verify width/height set on all images
- [ ] **Mobile Ordering:** Often missing real device testing — verify works on actual iOS/Android phones
- [ ] **JSON Editing:** Often missing schema validation — verify invalid JSON is caught before deploy
- [ ] **Lead Time Enforcement:** Often missing timezone handling — verify calculations work across timezones/DST
- [ ] **Phone Number Input:** Often missing format normalization — verify API receives E.164 format
- [ ] **Pi Performance:** Often missing load testing — verify handles 10+ concurrent users without slowdown
- [ ] **Cache Invalidation:** Often missing JSON change detection — verify menu updates appear immediately

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Pi performance bottleneck | MEDIUM | 1) Add CDN/caching 2) Optimize images 3) Load balance with 2nd Pi 4) Migrate to VPS if needed |
| Invalid JSON crashes site | LOW | 1) Revert to last known good JSON from git 2) Fix syntax error 3) Add validation to prevent recurrence |
| WhatsApp message failure | LOW | 1) Check error logs for root cause 2) Resend via admin panel 3) Add retry logic with exponential backoff |
| Timezone bug in lead time | MEDIUM | 1) Manually review affected orders 2) Contact customers to confirm dates 3) Fix calculation 4) Add edge case tests |
| Mobile cart abandonment | HIGH | 1) Identify friction points via analytics 2) Simplify checkout flow 3) A/B test improvements 4) Monitor abandonment rate |
| Image performance issues | MEDIUM | 1) Optimize existing images (compress, WebP) 2) Implement lazy loading 3) Add CDN 4) Set up automated optimization |
| Platter validation bug | HIGH | 1) Identify edge case 2) Add server-side validation 3) Write test case 4) Review all validation logic for similar gaps |
| SEO ranking drop | HIGH | 1) Fix Core Web Vitals issues 2) Optimize mobile performance 3) Add schema markup 4) Rebuild local backlinks |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Pi performance bottlenecks | Phase 1 (Infrastructure) | Load test with 20 concurrent users, page loads < 3s |
| Mobile ordering friction | Phase 3 (Core Ordering) | Cart abandonment rate < 40%, mobile user testing passes |
| Date/timezone issues | Phase 3 (Core Ordering) | Edge case tests pass (DST, holidays, Friday orders) |
| WhatsApp formatting failures | Phase 5 (WhatsApp Integration) | Test with 10+ SA number formats, all normalize correctly |
| JSON structure breaks | Phase 2 (Menu Structure) | JSON schema validation, admin can edit without errors |
| Platter validation edge cases | Phase 4 (Platter Builder) | Edge case test suite passes 100% (boundaries, empty, max) |
| Image performance issues | Phase 2 (Menu Structure) | Mobile LCP < 2.5s, images optimized to < 200KB |
| Local SEO mistakes | Phase 6 (Testing & Polish) | Google Business Profile complete, NAP consistent |
| Non-technical admin struggles | Phase 2 (Menu Structure) | Admin successfully edits menu without developer help |
| Cache invalidation issues | Phase 2 (Menu Structure) | JSON changes appear within 1 minute, no stale content |

## Sources

**Food Ordering Websites:**
- [Why Customers Struggle With Online Food Ordering & Fixes | TechRyde](https://www.techryde.com/blog/why-customers-struggle-with-your-online-food-ordering-system-and-how-to-fix-it/)
- [10 Common Problems In Online Food Ordering And How To Fix](https://deonde.co/blog/common-problems-in-online-food-ordering-and-solutions/)
- [Fixing 9 Common UX Mistakes in Food Delivery App | UX Upgrade](https://cieden.com/fixing-9-common-ux-mistakes-in-food-delivery-app-ux-upgrade)
- [10 Mistakes New Restaurant Websites Make (How to Avoid Them)](https://orderable.com/blog/new-restaurant-websites-mistakes/)

**Custom Product Builders:**
- [Checklist to spot edge cases in API contracts, design mockups & product behaviour](https://devadi.netlify.app/blog/edge-case-product-checklist)
- [Edge Cases in Software Development: Guide to Testing](https://testomat.io/blog/edge-cases-in-software-development/)
- [6 Best Product Configurator Software Options in 2026 | Salesforce](https://www.salesforce.com/sales/revenue-lifecycle-management/product-configurator-software/)

**Mobile Ordering UX:**
- [15 Ecommerce Checkout & Cart UX Best Practices for 2026](https://www.designstudiouiux.com/blog/ecommerce-checkout-ux-best-practices/)
- [The frictionless checkout: UX tactics that drive conversions](https://medium.com/design-bootcamp/the-frictionless-checkout-ux-tactics-that-drive-conversions-7fc1ebbe4a18)
- [10 Mobile UX Design Trends Every Business Must Follow in 2026](https://webdesignerindia.medium.com/10-mobile-ux-design-trends-2026-231783d97d28)
- [2025 Guide to Understand and Minimize User Friction](https://survicate.com/blog/user-friction/)

**Raspberry Pi Hosting:**
- [Host a Website on Raspberry Pi – Real Benchmark Tests](https://defencedev.com/solutions/raspberry-pi-4-web-hosting-benchmark/)
- [Raspberry Pi Web Server Performance | Medium](https://medium.com/@ian.morrison.webdev/raspberry-pi-web-server-does-it-work-5ca8ed1e9a72)
- [Performance evaluation of Raspberry pi 3B as a web server](https://www.diva-portal.org/smash/get/diva2:1439759/FULLTEXT01.pdf)

**WhatsApp Integration:**
- [Ways To Solve Common WhatsApp API Integration Issues](https://www.interakt.shop/whatsapp-business-api/integration/challenges-solved/)
- [WhatsApp API 2026: Complete Integration Guide and Use Cases](https://www.unipile.com/whatsapp-api-a-complete-guide-to-integration/)
- [About international phone number format | WhatsApp Help Center](https://faq.whatsapp.com/1294841057948784)
- [All Meta WhatsApp Cloud API Error Codes Explained](https://www.heltar.com/blogs/all-meta-error-codes-explained-along-with-complete-troubleshooting-guide-2025-cm69x5e0k000710xtwup66500)

**JSON Content Management:**
- [How content designers can (and should) use JSON files](https://uxcontent.com/content-design-json/)
- [Common JSON Mistakes and How to Avoid Them | JSONLint](https://jsonlint.com/common-mistakes-in-json-and-how-to-avoid-them)
- [15 Common JSON Errors and How to Fix Them](https://orbit2x.com/blog/common-json-errors-how-to-fix)
- [Understanding JSON Response Caching](https://moldstud.com/articles/p-understanding-json-response-caching-a-comprehensive-guide-for-remote-developers)
- [Cache Invalidation | Storyblok Documentation](https://www.storyblok.com/docs/api/content-delivery/v2/getting-started/cache-invalidation)

**Image Optimization:**
- [How to Optimize Website Images: The Complete 2026 Guide](https://requestmetrics.com/web-performance/high-performance-images/)
- [Lazy loading - Performance - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading)
- [2026 Web Performance Standards: Guide Faster Websites](https://www.inmotionhosting.com/blog/web-performance-benchmarks/)
- [11 Best Practices to Speed Up Website Performance on Mobile](https://nitropack.io/blog/speed-up-mobile-website/)

**Date/Timezone Handling:**
- [Time zone error in Bookings meetings](https://support.lesley.edu/support/solutions/articles/4000215566-time-zone-discrepancies-with-microsoft-bookings)
- [Set Bookings language and time zones | Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/bookings/set-language-time-zones)

**Local SEO:**
- [11 SEO Tips for Restaurants and Food Businesses in 2026](https://www.squarespace.com/blog/food-business-and-restaurant-seo)
- [Top Local SEO Mistakes Hurting Your Local SEO Rankings in 2026](https://www.localmighty.com/blog/top-local-seo-mistakes-killing-your-local-seo-rankings/)
- [Restaurant SEO Checklist – 2026 Guide to Ranking on Google & AI Search](https://thedigitalrestaurant.com/restaurant-seo-checklist/)
- [Local SEO for Small Business Guide for 2026 | SeoProfy](https://seoprofy.com/blog/local-seo-for-small-business/)

---
*Pitfalls research for: Manna Kitchen food ordering website with custom platter builder on Raspberry Pi hosting*
*Researched: 2026-01-28*
